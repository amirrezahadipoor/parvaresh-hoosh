// شکل‌های SVG — همهٔ تصویرها برداری و درون‌خطی‌اند.
//
// چرا SVG و نه تصویر یا اموجی:
//   ۱. در هر اندازه‌ای تیز است (صفحهٔ کودک ممکن است تبلت باشد یا موبایل کوچک).
//   ۲. حجم ندارد — برنامه باید آفلاین و سبک بماند.
//   ۳. اموجی روی دستگاه‌های مختلف شکل متفاوتی دارد؛ سیب اندروید با سیب
//      شیائومی فرق می‌کند و برای درس «کدام میوه است؟» قابل اتکا نیست.
//
// هر شکل یک تابع است که رشتهٔ SVG برمی‌گرداند تا بشود آن را در DOM گذاشت.

const svg = (body, vb = '0 0 100 100') =>
  `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${body}</svg>`;

// ── حیوان‌ها ────────────────────────────────────────────────────────────
export const SHAPES = {
  گربه: () =>
    svg(`<g><ellipse cx="50" cy="62" rx="26" ry="24" fill="#F4A259"/>
    <path d="M28 44 L24 22 L42 34 Z" fill="#F4A259"/><path d="M72 44 L76 22 L58 34 Z" fill="#F4A259"/>
    <path d="M30 42 L28 29 L38 36 Z" fill="#F7C9A0"/><path d="M70 42 L72 29 L62 36 Z" fill="#F7C9A0"/>
    <circle cx="40" cy="58" r="5" fill="#2D2A32"/><circle cx="60" cy="58" r="5" fill="#2D2A32"/>
    <circle cx="41.5" cy="56.5" r="1.8" fill="#fff"/><circle cx="61.5" cy="56.5" r="1.8" fill="#fff"/>
    <path d="M46 70 Q50 74 54 70" stroke="#2D2A32" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50 66 l-3 3 h6 z" fill="#E4572E"/>
    <path d="M22 66 H8 M22 72 H10 M78 66 H92 M78 72 H90" stroke="#2D2A32" stroke-width="2" stroke-linecap="round"/></g>`),

  سگ: () =>
    svg(`<g><ellipse cx="50" cy="60" rx="26" ry="24" fill="#B5835A"/>
    <ellipse cx="24" cy="52" rx="9" ry="18" fill="#8B5E3C"/><ellipse cx="76" cy="52" rx="9" ry="18" fill="#8B5E3C"/>
    <circle cx="41" cy="55" r="4.5" fill="#2D2A32"/><circle cx="59" cy="55" r="4.5" fill="#2D2A32"/>
    <circle cx="42" cy="53.5" r="1.6" fill="#fff"/><circle cx="60" cy="53.5" r="1.6" fill="#fff"/>
    <ellipse cx="50" cy="70" rx="12" ry="9" fill="#E8D5C0"/>
    <ellipse cx="50" cy="66" rx="5" ry="4" fill="#2D2A32"/>
    <path d="M50 70 v5 M44 78 Q50 82 56 78" stroke="#2D2A32" stroke-width="2" fill="none" stroke-linecap="round"/></g>`),

  ماهی: () =>
    svg(`<g><ellipse cx="46" cy="50" rx="30" ry="20" fill="#2E86AB"/>
    <path d="M76 50 L94 34 L94 66 Z" fill="#1B6B8F"/>
    <path d="M40 30 L52 32 L44 42 Z" fill="#1B6B8F"/>
    <circle cx="30" cy="45" r="5" fill="#fff"/><circle cx="29" cy="45" r="2.6" fill="#2D2A32"/>
    <path d="M56 42 Q62 50 56 58" stroke="#7FD1E8" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M66 44 Q72 50 66 56" stroke="#7FD1E8" stroke-width="3" fill="none" stroke-linecap="round"/></g>`),

  پرنده: () =>
    svg(`<g><ellipse cx="52" cy="56" rx="24" ry="20" fill="#F4B942"/>
    <circle cx="34" cy="42" r="14" fill="#F4B942"/>
    <path d="M22 42 l-12 4 12 4 z" fill="#E4572E"/>
    <circle cx="32" cy="39" r="3.6" fill="#2D2A32"/><circle cx="33" cy="38" r="1.3" fill="#fff"/>
    <path d="M52 52 Q66 44 74 58 Q62 62 52 52 Z" fill="#E0A32E"/>
    <path d="M74 62 L92 56 L88 70 Z" fill="#E0A32E"/>
    <path d="M46 76 v8 M58 76 v8" stroke="#E4572E" stroke-width="3" stroke-linecap="round"/></g>`),

  خرگوش: () =>
    svg(`<g><ellipse cx="50" cy="66" rx="24" ry="21" fill="#EFEFEF"/>
    <ellipse cx="40" cy="30" rx="7" ry="20" fill="#EFEFEF"/><ellipse cx="60" cy="30" rx="7" ry="20" fill="#EFEFEF"/>
    <ellipse cx="40" cy="31" rx="3.4" ry="14" fill="#F7C9D4"/><ellipse cx="60" cy="31" rx="3.4" ry="14" fill="#F7C9D4"/>
    <circle cx="42" cy="62" r="4.2" fill="#2D2A32"/><circle cx="58" cy="62" r="4.2" fill="#2D2A32"/>
    <path d="M50 68 l-3 3 h6 z" fill="#F7A0B4"/>
    <path d="M44 76 Q50 80 56 76" stroke="#2D2A32" stroke-width="2" fill="none" stroke-linecap="round"/></g>`),

  // ── میوه‌ها ───────────────────────────────────────────────────────────
  سیب: () =>
    svg(`<g><path d="M50 30 C30 30 22 46 26 62 C30 78 42 86 50 86 C58 86 70 78 74 62 C78 46 70 30 50 30 Z" fill="#E4572E"/>
    <path d="M50 32 V20" stroke="#6B4423" stroke-width="4" stroke-linecap="round"/>
    <path d="M52 24 Q66 14 70 26 Q58 32 52 24 Z" fill="#4CAF50"/>
    <ellipse cx="38" cy="48" rx="5" ry="8" fill="#fff" opacity=".35"/></g>`),

  موز: () =>
    svg(`<g><path d="M22 32 Q26 70 62 78 Q84 80 86 62 Q70 70 52 58 Q34 46 34 30 Z" fill="#F4B942"/>
    <path d="M22 32 Q26 70 62 78" stroke="#D89B1E" stroke-width="2.5" fill="none"/>
    <path d="M20 28 l6 6" stroke="#6B4423" stroke-width="4" stroke-linecap="round"/></g>`),

  انار: () =>
    svg(`<g><circle cx="50" cy="58" r="27" fill="#C1352B"/>
    <path d="M50 31 v-9 M50 22 l-6 -6 M50 22 l6 -6" stroke="#6B4423" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <circle cx="42" cy="54" r="3.4" fill="#8C1F18"/><circle cx="56" cy="52" r="3.4" fill="#8C1F18"/>
    <circle cx="50" cy="64" r="3.4" fill="#8C1F18"/><circle cx="60" cy="64" r="3" fill="#8C1F18"/>
    <circle cx="40" cy="66" r="3" fill="#8C1F18"/></g>`),

  گل: () =>
    svg(`<g><path d="M50 62 V88" stroke="#4CAF50" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 74 Q34 68 32 80 Q46 84 50 74Z" fill="#4CAF50"/>
    <g fill="#E4572E"><ellipse cx="50" cy="34" rx="9" ry="14"/><ellipse cx="50" cy="62" rx="9" ry="14"/>
    <ellipse cx="36" cy="48" rx="14" ry="9"/><ellipse cx="64" cy="48" rx="14" ry="9"/></g>
    <circle cx="50" cy="48" r="8" fill="#F4B942"/></g>`),

  درخت: () =>
    svg(`<g><rect x="45" y="56" width="10" height="32" rx="3" fill="#8B5E3C"/>
    <circle cx="50" cy="40" r="20" fill="#4CAF50"/><circle cx="34" cy="50" r="14" fill="#43A047"/>
    <circle cx="66" cy="50" r="14" fill="#43A047"/></g>`),

  // ── اشیاء ─────────────────────────────────────────────────────────────
  توپ: () =>
    svg(`<g><circle cx="50" cy="52" r="28" fill="#2E86AB"/>
    <path d="M22 52 H78" stroke="#fff" stroke-width="4"/>
    <path d="M50 24 V80" stroke="#fff" stroke-width="4"/>
    <circle cx="50" cy="52" r="10" fill="none" stroke="#fff" stroke-width="4"/></g>`),

  کتاب: () =>
    svg(`<g><path d="M18 26 H48 V78 H18 Z" fill="#E4572E"/><path d="M52 26 H82 V78 H52 Z" fill="#C1352B"/>
    <rect x="46" y="24" width="8" height="56" rx="2" fill="#8C1F18"/>
    <path d="M24 38 H42 M24 46 H42 M24 54 H38" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M58 38 H76 M58 46 H76 M58 54 H72" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></g>`),

  خانه: () =>
    svg(`<g><path d="M50 18 L88 50 H12 Z" fill="#E4572E"/>
    <rect x="22" y="50" width="56" height="36" fill="#F7E4C8"/>
    <rect x="42" y="62" width="16" height="24" rx="2" fill="#8B5E3C"/>
    <rect x="28" y="58" width="10" height="10" fill="#2E86AB"/>
    <rect x="62" y="58" width="10" height="10" fill="#2E86AB"/></g>`),

  ماشین: () =>
    svg(`<g><path d="M14 62 L20 44 H70 L82 62 Z" fill="#2E86AB"/>
    <rect x="12" y="60" width="76" height="14" rx="6" fill="#1B6B8F"/>
    <rect x="28" y="47" width="16" height="13" fill="#BFE6F5"/>
    <rect x="48" y="47" width="16" height="13" fill="#BFE6F5"/>
    <circle cx="30" cy="76" r="9" fill="#2D2A32"/><circle cx="70" cy="76" r="9" fill="#2D2A32"/>
    <circle cx="30" cy="76" r="3.6" fill="#ccc"/><circle cx="70" cy="76" r="3.6" fill="#ccc"/></g>`),

  ستاره: () =>
    svg(`<path d="M50 16 L60 42 L88 44 L66 62 L73 88 L50 73 L27 88 L34 62 L12 44 L40 42 Z" fill="#F4B942"/>`),

  // هلال ماه با «تفریق» دو دایره ساخته می‌شود. تلاش اول با یک path و دو
  // کمان، به‌خاطر جهت‌های sweep، شکل توخالی و نامرئی می‌داد.
  ماه: () =>
    svg(`<g><defs><mask id="mn"><rect width="100" height="100" fill="#000"/>
    <circle cx="50" cy="50" r="34" fill="#fff"/><circle cx="66" cy="40" r="30" fill="#000"/></mask></defs>
    <rect width="100" height="100" fill="#F4B942" mask="url(#mn)"/></g>`),

  خورشید: () =>
    svg(`<g><circle cx="50" cy="50" r="20" fill="#F4B942"/>
    <g stroke="#F4B942" stroke-width="5" stroke-linecap="round">
    <path d="M50 14 V4 M50 96 V86 M14 50 H4 M96 50 H86 M24 24 l-7-7 M76 76 l7 7 M76 24 l7-7 M24 76 l-7 7"/></g></g>`),

  ابر: () =>
    svg(`<g fill="#BFD9E8"><circle cx="36" cy="56" r="16"/><circle cx="54" cy="48" r="20"/>
    <circle cx="70" cy="58" r="14"/><rect x="34" y="58" width="38" height="16" rx="8"/></g>`),
};

// ── شکل‌های هندسی ───────────────────────────────────────────────────────
export const GEO = {
  دایره: (c) => svg(`<circle cx="50" cy="50" r="34" fill="${c}"/>`),
  مربع: (c) => svg(`<rect x="18" y="18" width="64" height="64" rx="6" fill="${c}"/>`),
  مثلث: (c) => svg(`<path d="M50 16 L86 82 H14 Z" fill="${c}"/>`),
  ستاره: (c) => svg(`<path d="M50 16 L60 42 L88 44 L66 62 L73 88 L50 73 L27 88 L34 62 L12 44 L40 42 Z" fill="${c}"/>`),
  قلب: (c) => svg(`<path d="M50 84 C20 62 14 44 26 34 C36 26 48 32 50 42 C52 32 64 26 74 34 C86 44 80 62 50 84 Z" fill="${c}"/>`),
  لوزی: (c) => svg(`<path d="M50 14 L84 50 L50 86 L16 50 Z" fill="${c}"/>`),
};

export const COLOR_HEX = Object.freeze({
  قرمز: '#E4572E',
  آبی: '#2E86AB',
  زرد: '#F4B942',
  سبز: '#4CAF50',
  بنفش: '#7B4B94',
  نارنجی: '#F07818',
});

/** نام همهٔ شکل‌های تصویری موجود. */
export const SHAPE_NAMES = Object.freeze(Object.keys(SHAPES));

/** یک شکل تصویری را برمی‌گرداند؛ اگر نبود، null (هرگز شکل اشتباه نمی‌سازیم). */
export function shape(name) {
  return SHAPES[name] ? SHAPES[name]() : null;
}

/** یک شکل هندسی رنگی برمی‌گرداند. */
export function geo(name, color = '#2E86AB') {
  return GEO[name] ? GEO[name](COLOR_HEX[color] || color) : null;
}

/** دسته‌بندی معنایی — برای بازی «کدام فرق دارد؟». */
export const CATEGORIES = Object.freeze({
  حیوان: ['گربه', 'سگ', 'ماهی', 'پرنده', 'خرگوش'],
  میوه: ['سیب', 'موز', 'انار'],
  طبیعت: ['گل', 'درخت', 'خورشید', 'ماه', 'ابر', 'ستاره'],
  وسیله: ['توپ', 'کتاب', 'خانه', 'ماشین'],
});
