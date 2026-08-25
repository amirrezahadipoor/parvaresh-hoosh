// نشان‌های رابط کاربری — همه SVG درون‌خطی.
//
// چرا اموجی حذف شد:
//   رابط از ⭐ 🔇 🔊 ⚙ 🔒 🌙 استفاده می‌کرد. اموجی را خودِ سیستم‌عامل
//   می‌کشد، پس روی هر گوشی شکل، وزن و حتی رنگ متفاوتی دارد؛ روی
//   بعضی اندرویدهای قدیمی اصلاً مربع خالی می‌شود. برنامه‌ای که
//   می‌خواهد ظاهرش دقیق باشد نمی‌تواند بخشی از ظاهرش را به دستگاه
//   واگذار کند — همان دلیلی که برای تصویرهای درس هم SVG انتخاب شد.
//
//   ⚠ همچنین «⭐» و «★» هر دو استفاده می‌شدند: دو ستارهٔ متفاوت در
//   یک برنامه، یکی رنگی و یکی تک‌رنگ. حالا یک ستاره بیشتر نیست.

const wrap = (body, vb = '0 0 24 24') =>
  `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${body}</svg>`;

/** ستاره — تنها ستارهٔ برنامه. رنگش را از CSS می‌گیرد. */
export const starIcon = () =>
  wrap(`<path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.58 1.11 6.47L12 17.44l-5.81 3.06 1.11-6.47L2.6 9.45l6.5-.95z"
    fill="currentColor"/>`);

/** بلندگوی روشن. */
export const soundOnIcon = () =>
  wrap(`<path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" fill="currentColor"/>
    <path d="M15.5 9a4 4 0 0 1 0 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`);

/** بلندگوی خاموش — خطِ روی آن باید آشکارا دیده شود. */
export const soundOffIcon = () =>
  wrap(`<path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" fill="currentColor"/>
    <path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`);

/** چرخ‌دنده — تنظیمات. */
export const gearIcon = () =>
  wrap(`<path d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2z" fill="none"
      stroke="currentColor" stroke-width="2"/>
    <path d="M12 2.8l1.5 2.3 2.7-.5.5 2.7 2.3 1.5-1.3 2.4 1.3 2.4-2.3 1.5-.5 2.7-2.7-.5L12 21.2l-1.5-2.3-2.7.5-.5-2.7-2.3-1.5L6.3 12 5 9.6l2.3-1.5.5-2.7 2.7.5z"
      fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>`);

/** قفل — درسی که هنوز باز نشده. */
export const lockIcon = () =>
  wrap(`<rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor"/>
    <path d="M8.2 10.5V8a3.8 3.8 0 0 1 7.6 0v2.5" fill="none" stroke="currentColor"
      stroke-width="2.1" stroke-linecap="round"/>`);

/** تیک — درسِ انجام‌شده. */
export const checkIcon = () =>
  wrap(`<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor"
    stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`);

/** چرخش — درسی که وقت مرورش رسیده. */
export const reviewIcon = () =>
  wrap(`<path d="M20 12a8 8 0 1 1-2.6-5.9" fill="none" stroke="currentColor"
      stroke-width="2.4" stroke-linecap="round"/>
    <path d="M20 3.6V8h-4.4" fill="none" stroke="currentColor" stroke-width="2.4"
      stroke-linecap="round" stroke-linejoin="round"/>`);

/** ماه — پایان سهم روزانه. */
export const moonIcon = () =>
  wrap(`<path d="M20 14.5A8.6 8.6 0 0 1 9.5 4 8.6 8.6 0 1 0 20 14.5z" fill="currentColor"/>
    <circle cx="17.5" cy="5.5" r="1.4" fill="currentColor" opacity=".55"/>
    <circle cx="20.5" cy="9" r="1" fill="currentColor" opacity=".4"/>`);

/** پیکان بازگشت — در RTL به سمت راست. */
export const backIcon = () =>
  wrap(`<path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor"
    stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`);

/**
 * نشانِ حوزه — شش نشان، یکی برای هر حوزهٔ درسی.
 *
 * ── چرا این‌ها لازم شدند ──────────────────────────────────────────
 * فیلدِ `icon` هفت ماه در `curriculum.js` نشسته بود («book»،
 * «numbers»، «leaf»…) و **هیچ‌جا خوانده نمی‌شد** — دادهٔ مرده. در
 * همان حال، بزرگ‌ترین عنصرِ صفحهٔ خانه یک کارتِ رنگیِ ۲۵۰ پیکسلی بود
 * که فقط سه خط *متن* داشت.
 *
 * برای کودکِ پنج‌ساله‌ای که خواندن بلد نیست، آن کارت یعنی «یک
 * مستطیلِ نارنجی». قانونِ ثبت‌شدهٔ برنامه می‌گوید هرجا صدا نیست،
 * راهنمای دیداری باید باشد؛ اینجا نه صدا بود نه تصویر.
 *
 * ── چرا با سبکِ ui-icons و نه سبکِ svg.js ─────────────────────────
 * ⚠ تصویرهای درس (`svg.js`) رنگی و تخت‌اند و روی کارتِ سفید می‌نشینند.
 * این نشان‌ها اما روی *زمینهٔ رنگیِ حوزه* می‌آیند، پس باید تک‌رنگ و
 * توخالی باشند و رنگشان را از `currentColor` بگیرند. یک تصویرِ رنگیِ
 * svg.js روی زمینهٔ نارنجی، قانونِ «یک رنگ = یک معنی» را می‌شکست.
 *
 * ضخامتِ خط ۱٫۹ است، نه ۲: در اندازهٔ بزرگ (۷۲px) خطِ ۲ سنگین
 * می‌شود، و این نشان‌ها بزرگ‌تر از بقیهٔ نشان‌های رابط دیده می‌شوند.
 */
const DOMAIN_ICONS = {
  // کتابِ باز — خواندن و نوشتن
  book: `<path d="M12 6.4c-2-1.6-4.3-2.2-7-2.2v13c2.7 0 5 .6 7 2.2 2-1.6 4.3-2.2 7-2.2v-13c-2.7 0-5 .6-7 2.2z"
    fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>
    <path d="M12 6.4v13" fill="none" stroke="currentColor" stroke-width="1.9"/>`,

  // چُرتکه — ریاضی.
  //
  // ⚠ طرحِ اول سه میله با دو نقطهٔ بالایشان بود. در بزرگ‌نمایی معلوم
  // شد شکلِ حاصل «ili» خوانده می‌شود: سه حرفِ لاتین در برنامه‌ای
  // فارسی برای کودکی که هنوز الفبا یاد می‌گیرد. قانونِ ثبت‌شدهٔ
  // پروژه («در نشان، نه رقم و نه حرفِ لاتین») را نقض می‌کرد و هیچ
  // نگهبانی هم نمی‌گرفتش، چون نگهبان‌ها نمی‌خوانند.
  //
  // چُرتکه امن است: دو میلهٔ افقی با مهره‌های گرد، شکلی که هیچ
  // حرفی را تداعی نمی‌کند و «شمردن» را مستقیم می‌گوید.
  numbers: `<rect x="3.6" y="4.4" width="16.8" height="15.2" rx="2.4" fill="none"
      stroke="currentColor" stroke-width="1.9"/>
    <path d="M3.6 12h16.8" fill="none" stroke="currentColor" stroke-width="1.6"/>
    <circle cx="7.6" cy="8.2" r="1.7" fill="currentColor"/>
    <circle cx="12" cy="8.2" r="1.7" fill="currentColor"/>
    <circle cx="9.8" cy="15.8" r="1.7" fill="currentColor"/>
    <circle cx="14.2" cy="15.8" r="1.7" fill="currentColor"/>`,

  // برگ — تماشا و شناخت
  leaf: `<path d="M19.5 4.5c0 8-4.6 12.5-10.5 12.5-2 0-3.5-.5-3.5-.5S5 8 12.5 5.6c3.4-1.1 7-1.1 7-1.1z"
    fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>
    <path d="M16 8c-4 1.6-7 5-9.5 11.5" fill="none" stroke="currentColor"
      stroke-width="1.9" stroke-linecap="round"/>`,

  // حباب گفتگو با دو خط — انگلیسی. حرفِ لاتین نمی‌گذاریم چون
  // نشان نباید خودش معما شود و «A» برای کودکِ نویسانخوان بی‌معناست.
  abc: `<path d="M4 6.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-4 4v-4a2 2 0 0 1-2-2z"
    fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>
    <path d="M8.5 8.5h7M8.5 11.5h4.5" fill="none" stroke="currentColor"
      stroke-width="1.9" stroke-linecap="round"/>`,

  // قلب — مهارت زندگی
  heart: `<path d="M12 20s-7.2-4.4-7.2-9.4A4.1 4.1 0 0 1 12 8.2a4.1 4.1 0 0 1 7.2 2.4c0 5-7.2 9.4-7.2 9.4z"
    fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>`,

  // قطعهٔ پازل — منطق و الگو
  puzzle: `<path d="M5 5h5a1.8 1.8 0 0 1 3.6 0H19v5.2a1.8 1.8 0 0 0 0 3.6V19h-5.4a1.8 1.8 0 0 0-3.6 0H5v-5.4a1.8 1.8 0 0 0 0-3.6z"
    fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/>`,
};

/**
 * نشانِ یک حوزه. اگر نامِ ناشناخته بیاید **رشتهٔ خالی** برمی‌گرداند،
 * نه یک نشانِ پیش‌فرض: نشانِ غلط بدتر از نبودِ نشان است، چون کودک
 * یاد می‌گیرد «برگ = ریاضی». نبودش را هم نگهبان می‌گیرد.
 */
export const domainIcon = (name) =>
  (DOMAIN_ICONS[name] ? wrap(DOMAIN_ICONS[name]) : '');

/** فهرستِ نام‌های موجود — برای نگهبان. */
export const DOMAIN_ICON_NAMES = Object.freeze(Object.keys(DOMAIN_ICONS));
