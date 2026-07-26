-- Sky Sudan production schema (Supabase/PostgreSQL)
-- Public signup creates PASSENGER accounts only.
-- Staff accounts are created/invited internally and assigned to one airline.
-- Authorization is enforced in PostgreSQL RLS, not only in the UI.

create extension if not exists pgcrypto;

create table if not exists airlines (
  id text primary key,
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into airlines(id,name) values
 ('badr','بدر للطيران'),('tarco','تاركو للطيران'),('sudanair','الخطوط الجوية السودانية')
on conflict(id) do update set name=excluded.name;

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null default '',
  email text not null default '',
  account_type text not null default 'passenger'
    check (account_type in ('passenger','staff','super_admin')),
  airline_id text references airlines(id),
  status text not null default 'active' check (status in ('active','suspended')),
  created_at timestamptz not null default now(),
  check (
    (account_type='staff' and airline_id is not null)
    or (account_type in ('passenger','super_admin') and airline_id is null)
  )
);

create table if not exists permissions (
  code text primary key,
  label text not null
);
insert into permissions(code,label) values
 ('flights.view','عرض الرحلات'),
 ('flights.manage','إضافة وتعديل الرحلات'),
 ('bookings.view','عرض الحجوزات'),
 ('bookings.manage','إدارة الحجوزات'),
 ('passengers.view','عرض بيانات المسافرين'),
 ('inventory.manage','إدارة المقاعد والتوفر'),
 ('staff.manage','إدارة موظفي الشركة')
on conflict(code) do update set label=excluded.label;

create table if not exists user_permissions (
  user_id uuid references profiles(id) on delete cascade,
  permission_code text references permissions(code) on delete cascade,
  primary key(user_id, permission_code)
);

create or replace function current_account_type()
returns text language sql security definer stable set search_path=public as $$
  select account_type from profiles where id=auth.uid()
$$;
create or replace function current_airline_id()
returns text language sql security definer stable set search_path=public as $$
  select airline_id from profiles where id=auth.uid()
$$;
create or replace function has_permission(p text)
returns boolean language sql security definer stable set search_path=public as $$
  select current_account_type()='super_admin'
    or exists(select 1 from user_permissions where user_id=auth.uid() and permission_code=p)
$$;

-- Public signup can never choose staff/admin metadata.
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into profiles(id,name,email,account_type,airline_id,status)
  values(new.id, coalesce(new.raw_user_meta_data->>'name',''), new.email,
         'passenger', null, 'active');
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure handle_new_user();

create table if not exists flights (
  id text primary key,
  airline_id text not null references airlines(id),
  "from" text not null,
  "to" text not null,
  flight_date date not null,
  dep time not null,
  arr time not null,
  dur text not null default '',
  price numeric(12,2) not null check(price>=0),
  currency text not null default 'USD',
  aircraft text not null default '',
  capacity integer not null check(capacity>0),
  status text not null default 'active' check(status in ('active','completed','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  pnr text primary key,
  user_id uuid not null references auth.users on delete restrict,
  flight_id text not null references flights(id) on delete restrict,
  status text not null default 'confirmed' check(status in ('confirmed','pending','cancelled')),
  total numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists passengers (
  id uuid primary key default gen_random_uuid(),
  booking_pnr text not null references bookings(pnr) on delete cascade,
  first_name text not null,
  last_name text not null,
  dob date,
  nationality text,
  passport text,
  passport_exp date
);

create table if not exists booking_seats (
  flight_id text references flights(id) on delete cascade,
  seat_code text not null,
  booking_pnr text references bookings(pnr) on delete cascade,
  primary key(flight_id, seat_code)
);

-- RLS
alter table profiles enable row level security;
alter table user_permissions enable row level security;
alter table flights enable row level security;
alter table bookings enable row level security;
alter table passengers enable row level security;
alter table booking_seats enable row level security;

drop policy if exists profiles_select on profiles;
create policy profiles_select on profiles for select using (
  id=auth.uid()
  or current_account_type()='super_admin'
  or (current_account_type()='staff' and airline_id=current_airline_id() and account_type='staff')
);
drop policy if exists profiles_update on profiles;
create policy profiles_update on profiles for update using (
  id=auth.uid() or current_account_type()='super_admin'
);

drop policy if exists perms_select on user_permissions;
create policy perms_select on user_permissions for select using (
  user_id=auth.uid() or current_account_type()='super_admin'
  or (current_account_type()='staff' and has_permission('staff.manage')
      and exists(select 1 from profiles p where p.id=user_permissions.user_id and p.airline_id=current_airline_id()))
);

drop policy if exists flights_read on flights;
create policy flights_read on flights for select using (true);
drop policy if exists flights_insert on flights;
create policy flights_insert on flights for insert with check (
  current_account_type()='super_admin'
  or (current_account_type()='staff' and has_permission('flights.manage') and airline_id=current_airline_id())
);
drop policy if exists flights_update on flights;
create policy flights_update on flights for update using (
  current_account_type()='super_admin'
  or (current_account_type()='staff' and has_permission('flights.manage') and airline_id=current_airline_id())
);
drop policy if exists flights_delete on flights;
create policy flights_delete on flights for delete using (current_account_type()='super_admin');

drop policy if exists bookings_read on bookings;
create policy bookings_read on bookings for select using (
 user_id=auth.uid() or current_account_type()='super_admin'
 or (current_account_type()='staff' and has_permission('bookings.view')
     and exists(select 1 from flights f where f.id=bookings.flight_id and f.airline_id=current_airline_id()))
);
drop policy if exists bookings_insert on bookings;
create policy bookings_insert on bookings for insert with check (
 user_id=auth.uid() and current_account_type()='passenger'
);
drop policy if exists bookings_update on bookings;
create policy bookings_update on bookings for update using (
 user_id=auth.uid() or current_account_type()='super_admin'
 or (current_account_type()='staff' and has_permission('bookings.manage')
     and exists(select 1 from flights f where f.id=bookings.flight_id and f.airline_id=current_airline_id()))
);

drop policy if exists passengers_read on passengers;
create policy passengers_read on passengers for select using (
 current_account_type()='super_admin'
 or exists(select 1 from bookings b where b.pnr=passengers.booking_pnr and b.user_id=auth.uid())
 or (current_account_type()='staff' and has_permission('passengers.view') and exists(
   select 1 from bookings b join flights f on f.id=b.flight_id
   where b.pnr=passengers.booking_pnr and f.airline_id=current_airline_id()))
);
drop policy if exists passengers_insert on passengers;
create policy passengers_insert on passengers for insert with check (
 exists(select 1 from bookings b where b.pnr=passengers.booking_pnr and b.user_id=auth.uid())
);

drop policy if exists seats_read on booking_seats;
create policy seats_read on booking_seats for select using (true);
drop policy if exists seats_insert on booking_seats;
create policy seats_insert on booking_seats for insert with check (
 exists(select 1 from bookings b where b.pnr=booking_seats.booking_pnr and b.user_id=auth.uid())
);

-- IMPORTANT: create staff users through Supabase Dashboard/Auth admin tooling,
-- then assign their profile internally. Never expose staff/admin selection on public signup.
-- Example after inviting/creating a staff account:
-- update profiles set account_type='staff', airline_id='badr' where email='employee@airline.com';
-- insert into user_permissions(user_id,permission_code)
-- select id,'flights.manage' from profiles where email='employee@airline.com';
--
-- Make your own account super admin ONCE:
-- update profiles set account_type='super_admin', airline_id=null where email='YOUR_EMAIL';
