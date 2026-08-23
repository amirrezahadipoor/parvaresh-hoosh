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
