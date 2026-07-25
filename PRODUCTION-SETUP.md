# Sky Sudan — تشغيل حقيقي

هذا الإصدار مصمم بدون تسجيل دخول تجريبي.

1. أنشئ مشروع Supabase (PostgreSQL + Auth).
2. شغّل `supabase-schema.sql` في SQL Editor.
3. انسخ `.env.example` إلى `.env` وضع Project URL و anon key.
4. شغّل `npm install` ثم `npm run dev`.
5. التسجيل العام ينشئ حساب Passenger فقط.
6. حسابات موظفي شركات الطيران لا تُنشأ من الموقع العام. أنشئ/ادعُ الموظف من Auth Dashboard ثم عدّل `profiles` واربطه بالشركة وأضف الصلاحيات في `user_permissions`.
7. اجعل حسابك `super_admin` مرة واحدة بأمر SQL الموجود أسفل schema.

الصلاحيات مفروضة في PostgreSQL RLS، لذلك إخفاء الأزرار في الواجهة ليس هو الحماية الأساسية.
