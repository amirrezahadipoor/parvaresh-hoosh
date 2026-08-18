# گزارش نهایی اصلاح و باگ‌گیری

تاریخ: ۱۴۰۵/۰۵/۲۷ (۲۰۲۶-۰۸-۱۸)

## تغییرات اصلی

- تعداد درس‌ها و فعالیت‌های curriculum از **۱۴۲ به ۱۹۲** افزایش یافت؛ دقیقاً **۵۰ محتوای جدید** اضافه شد.
- محتوای جدید بین ۶ حوزه پخش شد: خواندن، ریاضی، منطق، علوم، مهارت‌های اجتماعی و هنر.
- برای هر درس جدید نوع فعالیت مشخص و قابل resolve شدن توسط موتور بازی ثبت شد.
- فایل bundled curriculum و فایل `content/curriculum.json` همگام شدند.
- `content/content_manifest.json` از ۱۴۲ به ۱۹۲ مورد به‌روزرسانی شد.
- نسخه محتوای curriculum به `1.1.0` و نسخه manifest به `2.1.0` ارتقا یافت.

## باگ‌های فنی/ظاهری اصلاح‌شده

- Service Worker ناقص بود و فقط نام cache داشت؛ اکنون install/activate/fetch، حذف cache قدیمی، cache-first و fallback آفلاین دارد.
- cache version به `v4-192-lessons` تغییر کرد تا فایل‌های قدیمی UI و curriculum روی دستگاه باقی نمانند.
- bundle وب با `scripts/prepare_web.js` دوباره تولید و وجود فایل‌های اصلی آن بررسی شد.
- مسیر Android همچنان روی `webDir: www` است و فایل آماده‌شده برای Capacitor داخل پروژه تولید شد.

## تست‌ها

- `node scripts/audit_curriculum.js`: موفق — **۱۹۲/۱۹۲** درس یکتا و map شده.
- `node test_all_components.js`: موفق — **۱۹۲/۱۹۲** درس تولید و اعتبارسنجی ساختاری شد؛ بازی‌های Arcade، کاراکترها، SVG و موتور IQ نیز smoke-test شدند.
- `node scripts/prepare_web.js`: موفق — bundle وب Android/PWA ساخته شد.
- تست runtime کامل در این محیط اجرا نشد چون وابستگی `jsdom` نصب نبود؛ بنابراین این مورد به‌عنوان تست محیطیِ باقی‌مانده ثبت شده است.
- ساخت APK release/debug در این محیط انجام نشد چون محیط موجود Node 24 و Java 21 موردنیاز Capacitor 8 را ندارد.

## نتیجه

پکیج آمادهٔ ادامه توسعه و build اندروید است. برای اطمینان نهایی قبل از انتشار، `npm ci` با Node 24، سپس `npm test` و `npm run android:debug` روی محیط CI/Android Studio اجرا شود.
