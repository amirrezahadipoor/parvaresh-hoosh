# گزارش اصلاح سخت‌گیرانهٔ نسخهٔ ۳.۳.۰

تاریخ: ۲۰ اوت ۲۰۲۶

## نتیجه

تمام خطاهای قابل اثباتی که در ممیزی سورس کشف شدند اصلاح شده‌اند و quality gateهای
خودکار فعلی **۱۰۰٪ سبز** هستند. این عبارت به معنی امتیاز قطعی ۱۰۰ برای کیفیت
آموزشی/حقوقی/تجربهٔ کودک نیست؛ آن بخش‌ها بدون بازبین مستقل و دستگاه واقعی قابل
اثبات نیستند.

## اصلاحات اصلی

- یکسان‌سازی نسخه روی `3.3.0` در package، lock، App، curriculum، manifest و Android
- یکسان‌سازی آمار روی ۳۴۲ درس، ۷ حوزه، ۷۲ سطح و ۷ بازی
- تبدیل ۱۹۲ status قدیمی `planned` به `implemented` پس از احراز generator mapping
- یکتا کردن هر ۳۴۲ عنوان و شناسه
- افزودن `sync:content` و audit جلوگیری از drift دوبارهٔ metadata
- حذف ZIP تکراری، گزارش‌های QA قدیمی و اسکریپت‌های mutation منسوخ
- افزودن LICENSE، SECURITY، privacy/terms دقیق و checklist انتشار
- حذف ادعاهای سنجش IQ/سن ذهنی از UI و تبدیل گزارش به شاخص تسلط داخل بازی
- اصلاح توضیح منشأ صدا: AI فارسی ازپیش‌تولیدشده و پردازش‌شده، بدون TTS runtime
- audit واقعی ساختار MP3 برای ۱۰۹۷ کلیپ: mono/24kHz، بدون duplicate و بدون فایل مفقود
- اثبات پوشش گفتار هر ۱۷۵۰ round تولیدشده در پاس deterministic
- deterministic کردن generator auditها
- رفع accessible name دکمه‌های صوتی و افزودن قرارداد accessibility به تست runtime
- اعتبارسنجی و محدودیت حجم backup؛ جلوگیری از key ناشناخته
- حذف interpolation ناامن گالری و پذیرش فقط PNG data URL معتبر
- CSP سخت‌گیرانه‌تر با حذف `unsafe-inline` از script
- غیرفعال‌کردن Android backup، cleartext و حذف مجوز INTERNET
- اصلاح CI: Release فقط برای semantic tag، نام نسخهٔ درست، checksum، concurrency و least privilege
- افزودن تست PWA و کنترل تمام referenceهای محلی
- کشف و رفع باگ واقعی cold-offline: ۳۴ فایل JS و CSS در service-worker cache نبودند
- افزودن E2E واقعی Chromium برای source و production bundle

## خروجی تست نهایی

- Node 24 `npm test`: موفق
- metadata: ۳۴۲/۳۴۲، عنوان و ID یکتا، خطا صفر
- generator: ۳۴۲/۳۴۲، تعداد ۱۷۵۰ round و ۱۷۵۰ round دارای گفتار
- age rules: تعداد ۳۵٬۰۰۰ نمونه، مشکل صفر
- audio: تعداد ۱۰۹۷، duplicate صفر، TTS runtime صفر
- PWA: تعداد ۷۲۶ precache entry، reference مفقود صفر
- dependency audit: آسیب‌پذیری صفر
- JSDOM stress render: تعداد ۱۷۱۰ round
- Chromium source E2E و cold offline reload: موفق
- Chromium production-bundle E2E و cold offline reload: موفق
- Capacitor sync با Node 24: موفق

## مواردی که برای امتیاز محصول ۱۰۰ نیازمند اقدام انسانی‌اند

- تست APK روی ماتریس دستگاه‌های واقعی
- TalkBack و contrast دستی
- بازبینی ۳۴۲ درس توسط متخصص مستقل آموزش کودک
- تست مشاهده‌ای با کودک و رضایت والد
- شنیدن و تأیید کیفی صداها توسط بازبین فارسی‌زبان
- بازبینی حقوقی کشور محل انتشار
- build release امضاشده با keystore مالک

چک‌لیست قابل امضا در `docs/RELEASE_CHECKLIST_FA.md` قرار دارد.
