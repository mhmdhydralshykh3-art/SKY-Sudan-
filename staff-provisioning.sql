-- أمثلة لإدارة موظفي شركات الطيران بعد إنشاء حسابهم في Auth Dashboard

-- ربط موظف ببدر:
-- update profiles set account_type='staff', airline_id='badr', status='active'
-- where email='employee@example.com';

-- إعطاء صلاحيات الرحلات والحجوزات:
-- insert into user_permissions(user_id, permission_code)
-- select id, p.code
-- from profiles cross join (values ('flights.view'),('flights.manage'),('bookings.view')) p(code)
-- where email='employee@example.com'
-- on conflict do nothing;

-- إيقاف موظف:
-- update profiles set status='suspended' where email='employee@example.com';

-- حذف صلاحية:
-- delete from user_permissions
-- where user_id=(select id from profiles where email='employee@example.com')
-- and permission_code='flights.manage';
