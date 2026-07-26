-- شغّل الملف ده كامل في Supabase: Project → SQL Editor → New query → الصق والصق Run
-- بينشئ كل الجداول اللي التطبيق محتاجها + قواعد الحماية (RLS)
-- ملحوظة: التطبيق مبني عشان يكتشف تلقائيًا لو الجداول دي مش موجودة
-- ويشتغل ببيانات تجريبية بدلها، فمفيش أي خطر إنك تجرب وتغيّر.

-- ============ الملف الشخصي (يتربط تلقائيًا بمستخدم تسجيل الدخول) ============
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null default '',
  email text not null default '',
  role text not null default 'مستخدم' check (role in ('مستخدم', 'مسؤول')),
  status text not null default 'نشط' check (status in ('نشط', 'موقوف')),
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- دالة مساعدة (security definer) عشان نتجنب مشكلة recursion في قواعد الحماية
create or replace function is_admin(uid uuid)
returns boolean as $$
  select exists (select 1 from profiles where id = uid and role = 'مسؤول');
$$ language sql security definer stable;

create policy "قراءة بروفايلك أو المسؤول يشوف الكل" on profiles
  for select using (auth.uid() = id or is_admin(auth.uid()));
create policy "تعديل بروفايلك أو المسؤول يعدّل أي حد" on profiles
  for update using (auth.uid() = id or is_admin(auth.uid()));
create policy "إنشاء بروفايل عند التسجيل" on profiles
  for insert with check (auth.uid() = id);
create policy "المسؤول يحذف أي بروفايل" on profiles
  for delete using (is_admin(auth.uid()));

-- دالة تلقائية: تنشئ صف في profiles أول ما حد يعمل حساب جديد
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''), new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============ الرحلات (بيانات بدر / تاركو / سودانير) ============
create table if not exists flights (
  id text primary key,
  airline text not null check (airline in ('badr', 'tarco', 'sudanair')),
  "from" text not null,
  "to" text not null,
  dep text not null,
  arr text not null,
  dur text not null,
  price numeric not null,
  aircraft text not null default '',
  status text not null default 'نشطة' check (status in ('نشطة', 'مكتملة', 'ملغاة')),
  created_at timestamptz not null default now()
);

alter table flights enable row level security;

create policy "أي حد مسجّل دخول يشوف الرحلات" on flights
  for select using (auth.role() = 'authenticated' or auth.role() = 'anon');
create policy "المسؤول بس يضيف/يعدّل/يحذف رحلات" on flights
  for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- ============ الحجوزات ============
create table if not exists bookings (
  pnr text primary key,
  user_id uuid references auth.users on delete cascade,
  flight_id text references flights(id),
  seats text[] not null default '{}',
  status text not null default 'مؤكد' check (status in ('مؤكد', 'معلق', 'ملغاة')),
  total numeric not null default 0,
  created_at timestamptz not null default now()
);

alter table bookings enable row level security;

create policy "المستخدم يشوف حجوزاته أو المسؤول يشوف الكل" on bookings
  for select using (auth.uid() = user_id or is_admin(auth.uid()));
create policy "المستخدم يضيف حجز لنفسه" on bookings
  for insert with check (auth.uid() = user_id);
create policy "صاحب الحجز أو المسؤول يعدّل" on bookings
  for update using (auth.uid() = user_id or is_admin(auth.uid()));
create policy "المسؤول يحذف أي حجز" on bookings
  for delete using (is_admin(auth.uid()));

-- ============ المسافرين المرتبطين بحجز ============
create table if not exists passengers (
  id uuid primary key default gen_random_uuid(),
  booking_pnr text references bookings(pnr) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  dob date,
  nationality text default 'السودانية',
  passport text,
  passport_exp date
);

alter table passengers enable row level security;

create policy "صاحب الحجز أو المسؤول يشوف المسافرين" on passengers
  for select using (
    is_admin(auth.uid())
    or exists (select 1 from bookings where bookings.pnr = passengers.booking_pnr and bookings.user_id = auth.uid())
  );
create policy "صاحب الحجز يضيف مسافريه" on passengers
  for insert with check (
    exists (select 1 from bookings where bookings.pnr = passengers.booking_pnr and bookings.user_id = auth.uid())
  );
create policy "صاحب الحجز أو المسؤول يعدّل المسافرين" on passengers
  for update using (
    is_admin(auth.uid())
    or exists (select 1 from bookings where bookings.pnr = passengers.booking_pnr and bookings.user_id = auth.uid())
  );

-- ============ بيانات أولية للرحلات (اختياري، تقدر تمسحها أو تضيف عليها) ============
insert into flights (id, airline, "from", "to", dep, arr, dur, price, aircraft, status) values
  ('BJ101','badr','الخرطوم','بورتسودان','07:00','08:15','1س 15د',85,'Embraer 145','نشطة'),
  ('SD202','sudanair','الخرطوم','جدة','09:30','12:10','2س 40د',310,'Airbus A320','نشطة'),
  ('TC303','tarco','الخرطوم','نيالا','06:45','08:00','1س 15د',95,'ATR 72','نشطة'),
  ('BJ104','badr','بورتسودان','الخرطوم','14:00','15:15','1س 15د',85,'Embraer 145','نشطة'),
  ('SD205','sudanair','الخرطوم','دبي','23:15','04:40','4س 25د',420,'Airbus A320','نشطة'),
  ('TC306','tarco','الخرطوم','جوبا','10:00','12:30','2س 30د',260,'Boeing 737','نشطة'),
  ('SD210','sudanair','الخرطوم','القاهرة','13:00','15:45','2س 45د',290,'Airbus A320','نشطة'),
  ('BJ115','badr','الخرطوم','جدة','16:00','18:35','2س 35د',300,'Boeing 737','نشطة'),
  ('SD220','sudanair','الخرطوم','الرياض','05:00','07:50','2س 50د',335,'Airbus A320','نشطة'),
  ('TC320','tarco','الخرطوم','إسطنبول','01:20','06:10','4س 50د',410,'Boeing 737','نشطة')
on conflict (id) do nothing;

-- عشان تخلي أول حساب بتعمله انت "مسؤول" (Admin)، بعد ما تسجّل حساب من التطبيق
-- شغّل السطر ده وغيّر الإيميل بإيميلك اللي سجّلت بيه:
-- update profiles set role = 'مسؤول' where email = 'your-email@example.com';
