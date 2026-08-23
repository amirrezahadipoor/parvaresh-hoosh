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
  // ── افزودهٔ فاز ۳: گسترش دسته‌ها ──────────────────────────────────
  // علوم و منطق به تنوع تصویری نیاز دارند؛ با ۱۸ شکل نمی‌شد درس تازه
  // ساخت بدون تکرار. همان سبک: viewBox ۱۰۰×۱۰۰، بدون ارجاع بیرونی.

  جوجه: () =>
    svg(`<g><ellipse cx="50" cy="60" rx="24" ry="22" fill="#F4D03F"/>
    <circle cx="50" cy="34" r="16" fill="#F7DC6F"/>
    <path d="M50 18 q-3 -6 2 -8 q1 5 -2 8" fill="#F4B942"/>
    <circle cx="44" cy="32" r="3.4" fill="#2D2A32"/><circle cx="56" cy="32" r="3.4" fill="#2D2A32"/>
    <circle cx="45" cy="31" r="1.2" fill="#fff"/><circle cx="57" cy="31" r="1.2" fill="#fff"/>
    <path d="M50 38 l-6 4 l6 4 l6 -4 z" fill="#F07818"/>
    <ellipse cx="30" cy="60" rx="7" ry="12" fill="#F7DC6F"/>
    <ellipse cx="70" cy="60" rx="7" ry="12" fill="#F7DC6F"/>
    <path d="M42 82 v6 M58 82 v6" stroke="#F07818" stroke-width="4" stroke-linecap="round"/>
    <path d="M38 90 h8 M54 90 h8" stroke="#F07818" stroke-width="4" stroke-linecap="round"/></g>`),

  گاو: () =>
    svg(`<g><ellipse cx="50" cy="58" rx="28" ry="20" fill="#F2F0EC"/>
    <ellipse cx="36" cy="52" rx="8" ry="6" fill="#2D2A32"/><ellipse cx="64" cy="64" rx="9" ry="6" fill="#2D2A32"/>
    <ellipse cx="50" cy="74" rx="13" ry="9" fill="#F7C9C0"/>
    <circle cx="45" cy="72" r="2" fill="#2D2A32"/><circle cx="55" cy="72" r="2" fill="#2D2A32"/>
    <circle cx="40" cy="48" r="3.5" fill="#2D2A32"/><circle cx="60" cy="48" r="3.5" fill="#2D2A32"/>
    <path d="M28 42 Q22 32 30 30" stroke="#C8B8A0" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M72 42 Q78 32 70 30" stroke="#C8B8A0" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M36 78 v9 M64 78 v9" stroke="#2D2A32" stroke-width="4" stroke-linecap="round"/></g>`),

  پروانه: () =>
    svg(`<g><ellipse cx="50" cy="52" rx="3.5" ry="20" fill="#5A4A3F"/>
    <ellipse cx="32" cy="40" rx="17" ry="14" fill="#F07818"/>
    <ellipse cx="68" cy="40" rx="17" ry="14" fill="#F07818"/>
    <ellipse cx="34" cy="62" rx="13" ry="11" fill="#F4B942"/>
    <ellipse cx="66" cy="62" rx="13" ry="11" fill="#F4B942"/>
    <circle cx="30" cy="40" r="4" fill="#fff" opacity="0.8"/><circle cx="70" cy="40" r="4" fill="#fff" opacity="0.8"/>
    <path d="M48 34 Q42 24 36 22 M52 34 Q58 24 64 22" stroke="#5A4A3F" stroke-width="2" fill="none" stroke-linecap="round"/></g>`),

  زنبور: () =>
    svg(`<g><ellipse cx="50" cy="56" rx="22" ry="17" fill="#F4B942"/>
    <path d="M40 42 v28 M52 40 v32" stroke="#2D2A32" stroke-width="6"/>
    <ellipse cx="38" cy="38" rx="13" ry="9" fill="#fff" opacity="0.75"/>
    <ellipse cx="62" cy="38" rx="13" ry="9" fill="#fff" opacity="0.75"/>
    <circle cx="72" cy="52" r="8" fill="#2D2A32"/>
    <circle cx="75" cy="50" r="2.2" fill="#fff"/>
    <path d="M28 56 l-8 4" stroke="#2D2A32" stroke-width="3" stroke-linecap="round"/></g>`),

  لاکپشت: () =>
    svg(`<g><ellipse cx="50" cy="58" rx="28" ry="20" fill="#4CAF50"/>
    <path d="M50 38 v40 M28 54 h44 M34 44 L66 72 M66 44 L34 72" stroke="#2E7D32" stroke-width="2.5"/>
    <circle cx="78" cy="50" r="9" fill="#7CB342"/>
    <circle cx="81" cy="48" r="2.2" fill="#2D2A32"/>
    <ellipse cx="32" cy="76" rx="7" ry="5" fill="#7CB342"/><ellipse cx="66" cy="76" rx="7" ry="5" fill="#7CB342"/></g>`),

  پرتقال: () =>
    svg(`<g><circle cx="50" cy="56" r="27" fill="#F07818"/>
    <circle cx="42" cy="48" r="7" fill="#FF9642" opacity="0.55"/>
    <path d="M50 29 v-8" stroke="#6B4423" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M52 24 Q64 16 70 24 Q60 30 52 26 Z" fill="#4CAF50"/></g>`),

  هویج: () =>
    svg(`<g><path d="M50 84 L36 40 Q50 34 64 40 Z" fill="#F07818"/>
    <path d="M42 52 h14 M40 62 h12 M45 72 h8" stroke="#D45F10" stroke-width="2" stroke-linecap="round"/>
    <path d="M50 36 Q44 20 34 18 Q40 30 46 36 Z" fill="#4CAF50"/>
    <path d="M50 36 Q50 18 50 14 Q56 26 54 36 Z" fill="#66BB6A"/>
    <path d="M52 36 Q62 22 72 20 Q64 32 56 37 Z" fill="#4CAF50"/></g>`),

  گیلاس: () =>
    svg(`<g><circle cx="36" cy="66" r="14" fill="#D42B2B"/><circle cx="64" cy="70" r="13" fill="#E4572E"/>
    <circle cx="31" cy="61" r="4" fill="#fff" opacity="0.5"/>
    <path d="M36 52 Q46 28 56 22" stroke="#4CAF50" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M64 57 Q60 32 56 22" stroke="#4CAF50" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M56 22 Q68 14 76 20 Q66 26 56 24 Z" fill="#66BB6A"/></g>`),

  کوه: () =>
    svg(`<g><path d="M8 80 L34 34 L52 62 L64 44 L92 80 Z" fill="#7B8A99"/>
    <path d="M34 34 L44 52 L24 52 Z" fill="#F2F0EC"/>
    <path d="M64 44 L72 56 L56 56 Z" fill="#F2F0EC"/>
    <path d="M8 80 H92" stroke="#5A6B7A" stroke-width="3" stroke-linecap="round"/></g>`),

  رودخانه: () =>
    svg(`<g><path d="M20 20 Q46 40 30 58 Q14 76 40 88" stroke="#2E86AB" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="M20 20 Q46 40 30 58 Q14 76 40 88" stroke="#7FD1E8" stroke-width="6" fill="none" stroke-linecap="round"/>
    <ellipse cx="68" cy="42" rx="9" ry="6" fill="#8FBF6A"/><ellipse cx="76" cy="66" rx="8" ry="5" fill="#8FBF6A"/></g>`),

  برف: () =>
    svg(`<g stroke="#2E86AB" stroke-width="4" stroke-linecap="round">
    <path d="M50 16 v68 M20 33 L80 67 M80 33 L20 67"/>
    <path d="M50 26 l-7 -7 M50 26 l7 -7 M50 74 l-7 7 M50 74 l7 7"/>
    <path d="M30 39 l-10 1 M30 39 l1 -10 M70 61 l10 -1 M70 61 l-1 10"/>
    <path d="M70 39 l10 1 M70 39 l-1 -10 M30 61 l-10 -1 M30 61 l1 10"/></g>`),

  چتر: () =>
    svg(`<g><path d="M12 54 Q50 12 88 54 Z" fill="#E4572E"/>
    <path d="M12 54 Q22 44 32 54 Q42 44 50 54 Q58 44 68 54 Q78 44 88 54" fill="#C8431F"/>
    <path d="M50 54 v26 Q50 90 38 88" stroke="#6B4423" stroke-width="4" fill="none" stroke-linecap="round"/></g>`),

  ساعت: () =>
    svg(`<g><circle cx="50" cy="54" r="30" fill="#F2F0EC" stroke="#2D2A32" stroke-width="4"/>
    <circle cx="50" cy="54" r="3" fill="#2D2A32"/>
    <path d="M50 54 V34" stroke="#2D2A32" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 54 L66 62" stroke="#E4572E" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 28 v5 M76 54 h-5 M50 80 v-5 M24 54 h5" stroke="#2D2A32" stroke-width="3" stroke-linecap="round"/>
    <path d="M36 20 L30 12 M64 20 L70 12" stroke="#2D2A32" stroke-width="4" stroke-linecap="round"/></g>`),

  کلید: () =>
    svg(`<g><circle cx="32" cy="46" r="16" fill="none" stroke="#F4B942" stroke-width="8"/>
    <path d="M44 54 L78 76" stroke="#F4B942" stroke-width="8" stroke-linecap="round"/>
    <path d="M66 68 l6 -10 M74 74 l6 -10" stroke="#F4B942" stroke-width="6" stroke-linecap="round"/></g>`),

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
    svg(`<g><circle cx="50" cy="54" r="28" fill="#E4572E"/>
    <path d="M50 26 v56" stroke="#fff" stroke-width="4"/>
    <path d="M22 54 h56" stroke="#fff" stroke-width="4"/>
    <path d="M30 34 Q50 54 30 74" stroke="#fff" stroke-width="3.5" fill="none"/>
    <path d="M70 34 Q50 54 70 74" stroke="#fff" stroke-width="3.5" fill="none"/>
    <circle cx="40" cy="42" r="6" fill="#fff" opacity="0.35"/></g>`),

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

// ── چهره‌های احساس (حوزهٔ مهارت زندگی) ──────────────────────────────
//
// چرا چهره و نه اموجی: کل حوزهٔ مهارت زندگی روی «خواندن احساس از
// تصویر» بنا شده و اموجی روی هر دستگاه شکل دیگری دارد. اگر چهرهٔ
// «ترسیده» روی یک گوشی شبیه «متعجب» درآید، درس چیز غلطی یاد می‌دهد.
//
// منبع (CASEL، صلاحیت خودآگاهی): نخستین گام سواد هیجانی «نام‌گذاری
// احساس» است. پس هر احساس باید نشانهٔ دیداری یکتا و بدون ابهام
// داشته باشد — فقط دهان کافی نیست، ابرو هم باید فرق کند.

const face = (inner, fill = '#FFD98E') =>
  svg(`<circle cx="50" cy="50" r="38" fill="${fill}"/>
    <circle cx="50" cy="50" r="38" fill="none" stroke="#E0A94B" stroke-width="2.5"/>
    ${inner}`);

// چشم‌های ساده — در همهٔ حالت‌ها یکسان مگر جایی که معنا عوض شود
const eyes = `<circle cx="37" cy="43" r="4.5" fill="#2B2A33"/>
    <circle cx="63" cy="43" r="4.5" fill="#2B2A33"/>`;

export const FACES = {
  شاد: () =>
    face(`${eyes}
    <path d="M34 60 q16 15 32 0" fill="none" stroke="#2B2A33" stroke-width="4" stroke-linecap="round"/>`),

  غمگین: () =>
    face(`${eyes}
    <path d="M34 68 q16 -15 32 0" fill="none" stroke="#2B2A33" stroke-width="4" stroke-linecap="round"/>
    <path d="M30 34 q7 -4 13 -1" fill="none" stroke="#2B2A33" stroke-width="3" stroke-linecap="round"/>
    <path d="M70 34 q-7 -4 -13 -1" fill="none" stroke="#2B2A33" stroke-width="3" stroke-linecap="round"/>`,
    '#BFD3E6'),

  عصبانی: () =>
    face(`${eyes}
    <path d="M30 32 q8 4 13 8" fill="none" stroke="#2B2A33" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M70 32 q-8 4 -13 8" fill="none" stroke="#2B2A33" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M36 66 q14 -8 28 0" fill="none" stroke="#2B2A33" stroke-width="4" stroke-linecap="round"/>`,
    '#F0A08A'),

  // ⚠ «ترسیده» و «متعجب» اول تقریباً یکسان درآمدند — هر دو چشم گرد و
  // دهان باز. اگر هر دو گزینهٔ یک پرسش باشند کودک نمی‌تواند تشخیص
  // دهد و درس چیز غلطی می‌آموزد. پس ترسیده نشانه‌های یکتا گرفت:
  // دهان موجدار (لرزیدن)، قطرهٔ عرق، ابروی جمع‌شده به داخل.
  ترسیده: () =>
    face(`<ellipse cx="37" cy="44" rx="5" ry="6.5" fill="#2B2A33"/>
    <ellipse cx="63" cy="44" rx="5" ry="6.5" fill="#2B2A33"/>
    <path d="M30 33 q7 -3 13 1" fill="none" stroke="#2B2A33" stroke-width="3" stroke-linecap="round"/>
    <path d="M70 33 q-7 -3 -13 1" fill="none" stroke="#2B2A33" stroke-width="3" stroke-linecap="round"/>
    <path d="M38 64 q4 -5 8 0 q4 5 8 0 q4 -5 8 0" fill="none" stroke="#2B2A33" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M76 36 q4 7 0 10 q-4 -3 0 -10" fill="#7FB8D8"/>`,
    '#D8CFE8'),

  آرام: () =>
    face(`<path d="M31 43 q6 -4 12 0" fill="none" stroke="#2B2A33" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M57 43 q6 -4 12 0" fill="none" stroke="#2B2A33" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M38 62 q12 7 24 0" fill="none" stroke="#2B2A33" stroke-width="3.6" stroke-linecap="round"/>`,
    '#BFE3C8'),

  خسته: () =>
    face(`<path d="M31 44 q6 5 12 0" fill="none" stroke="#2B2A33" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M57 44 q6 5 12 0" fill="none" stroke="#2B2A33" stroke-width="3.4" stroke-linecap="round"/>
    <ellipse cx="50" cy="65" rx="7" ry="8" fill="#2B2A33"/>`,
    '#D9D2C4'),

  متعجب: () =>
    face(`<circle cx="37" cy="42" r="6" fill="#2B2A33"/>
    <circle cx="63" cy="42" r="6" fill="#2B2A33"/>
    <path d="M29 29 q8 -6 15 -2" fill="none" stroke="#2B2A33" stroke-width="3" stroke-linecap="round"/>
    <path d="M71 29 q-8 -6 -15 -2" fill="none" stroke="#2B2A33" stroke-width="3" stroke-linecap="round"/>
    <circle cx="50" cy="66" r="7" fill="#2B2A33"/>`,
    '#FFE8A3'),
};

/** نام همهٔ احساس‌ها. */
export const EMOTIONS = Object.freeze(Object.keys(FACES));

/** SVG یک احساس، یا رشتهٔ خالی اگر نبود. */
export function faceSvg(name) {
  const f = FACES[name];
  return f ? f() : '';
}


// ── صحنه‌های زندگی روزمره (حوزهٔ مهارت زندگی) ────────────────────────
//
// کل حوزه باید بدون خواندن کار کند، پس موقعیت‌ها هم باید تصویری
// باشند: «دست‌شستن»، «مسواک»، «کمک‌کردن»، «نوبت گرفتن».
//
// منابع: سازمان بهداشت جهانی (مهارت‌های ده‌گانه)، و فهرست بهداشت
// فردی کودکان — شستن دست پیش از غذا و پس از سرویس، مسواک، دستمال
// هنگام عطسه، ناخن کوتاه، لباس تمیز.

export const SCENES = {
  // ⚠ نسخهٔ اول: دست‌ها لکه‌های بی‌شکل بودند و شیر آب خوانده نمی‌شد.
  // حالا شیر از بالا، جریان آب عمودی، و دو دست کاسه‌شده با انگشت.
  دست‌شستن: () =>
    svg(`<path d="M20 14 v14 h30" fill="none" stroke="#9AA5B1" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="46" y="22" width="12" height="13" rx="3" fill="#7B8A99"/>
    <path d="M52 38 v10 M48 42 v8 M56 42 v8" stroke="#7FB8D8" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M28 60 q0 -8 7 -8 q3 -8 8 -3 l3 12 q2 8 -7 10 q-11 2 -11 -11 z" fill="#F2C6A0" stroke="#D9A87E" stroke-width="2"/>
    <path d="M72 60 q0 -8 -7 -8 q-3 -8 -8 -3 l-3 12 q-2 8 7 10 q11 2 11 -11 z" fill="#F5D3B5" stroke="#D9A87E" stroke-width="2"/>
    <circle cx="42" cy="56" r="5" fill="#FFF" opacity=".9"/>
    <circle cx="58" cy="54" r="4" fill="#FFF" opacity=".85"/>
    <circle cx="50" cy="62" r="3.4" fill="#FFF" opacity=".8"/>
    <path d="M22 78 h56" stroke="#BFD9E8" stroke-width="5" stroke-linecap="round"/>`),
  // ⚠ دو بار بازنویسی شد. نسخهٔ ۱ افقی بود و شبیه چکش می‌شد؛ نسخهٔ ۲
  // موهای سفید داشت که روی کارت سفید کاملاً نامرئی بودند. درس این
  // بود: هیچ جزء معنادار SVG نباید سفیدِ بی‌خط باشد، چون پس‌زمینهٔ
  // گزینه‌ها سفید است. حالا مورب، با موهای روشن اما خط‌دار.
  مسواک: () =>
    svg(`<g transform="rotate(-20 50 50)">
      <rect x="44" y="34" width="12" height="52" rx="6" fill="#2E86AB"/>
      <rect x="44" y="66" width="12" height="20" rx="6" fill="#1F6C8C"/>
      <rect x="39" y="22" width="22" height="16" rx="5" fill="#2E86AB"/>
      <g fill="#F4F7F9" stroke="#B9C6D0" stroke-width="1.6">
        <rect x="41.5" y="10" width="5" height="13" rx="2.5"/>
        <rect x="47.5" y="8" width="5" height="15" rx="2.5"/>
        <rect x="53.5" y="10" width="5" height="13" rx="2.5"/>
      </g>
      <path d="M40 9 q10 -8 21 0 q-10 5 -21 0 z" fill="#6ECB8F" stroke="#4FAE72" stroke-width="1.6"/>
    </g>
    <circle cx="20" cy="58" r="6" fill="#DCEAF4" stroke="#BFD9E8" stroke-width="1.6"/>
    <circle cx="82" cy="46" r="5" fill="#DCEAF4" stroke="#BFD9E8" stroke-width="1.6"/>
    <circle cx="78" cy="68" r="4" fill="#DCEAF4" stroke="#BFD9E8" stroke-width="1.6"/>`),
  خواب: () =>
    svg(`<rect x="14" y="56" width="72" height="24" rx="6" fill="#BFD3E6"/>
    <rect x="14" y="48" width="26" height="16" rx="6" fill="#FFF"/>
    <circle cx="30" cy="50" r="10" fill="#F5D3B5"/>
    <path d="M25 50 q3 3 6 0" fill="none" stroke="#2B2A33" stroke-width="2.2" stroke-linecap="round"/>
    <text x="62" y="42" font-size="16" fill="#7B8A99" font-family="sans-serif">Z</text>
    <text x="74" y="32" font-size="11" fill="#9AA5B1" font-family="sans-serif">z</text>`),

  آب‌خوردن: () =>
    svg(`<path d="M34 34 h32 l-5 42 q-1 6 -11 6 t-11 -6 z" fill="#DCEAF4" stroke="#9CC4DC" stroke-width="2.5"/>
    <path d="M36 50 h28 l-4 26 q-1 5 -10 5 t-10 -5 z" fill="#7FB8D8"/>
    <ellipse cx="50" cy="34" rx="16" ry="4" fill="#BFD9E8"/>`),

  // ⚠ نسخهٔ اول فقط یک قوس سبز میان دو سر بود و معنا نمی‌داد. نسخهٔ
  // دوم خط‌های سبزِ بی‌معنی داشت (قرار بود «حرکت» را برسانند ولی
  // فقط شلوغی بودند) — برداشته شدند.
  کمک‌کردن: () =>
    svg(`<circle cx="26" cy="62" r="11" fill="#F2C6A0" stroke="#D9A87E" stroke-width="1.8"/>
    <path d="M14 84 q0 -14 12 -14 t12 14 z" fill="#F4B942"/>
    <circle cx="70" cy="26" r="12" fill="#F5D3B5" stroke="#D9A87E" stroke-width="1.8"/>
    <path d="M56 74 q0 -32 14 -32 t14 32 z" fill="#2E86AB"/>
    <path d="M60 48 q-16 4 -22 10" stroke="#F5D3B5" stroke-width="7.5" stroke-linecap="round" fill="none"/>
    <circle cx="37" cy="59" r="5.5" fill="#F5D3B5" stroke="#D9A87E" stroke-width="1.6"/>
    <path d="M8 86 h84" stroke="#C9BFB0" stroke-width="3.5" stroke-linecap="round"/>`),
  نوبت: () =>
    svg(`<circle cx="26" cy="40" r="10" fill="#F2C6A0"/>
    <path d="M16 74 q0 -18 10 -18 t10 18 z" fill="#E4572E"/>
    <circle cx="52" cy="40" r="10" fill="#F5D3B5"/>
    <path d="M42 74 q0 -18 10 -18 t10 18 z" fill="#F4B942"/>
    <circle cx="78" cy="40" r="10" fill="#EEC9A8"/>
    <path d="M68 74 q0 -18 10 -18 t10 18 z" fill="#7B4B94"/>
    <path d="M12 84 h76" stroke="#C9BFB0" stroke-width="3" stroke-linecap="round"/>`),

  زبالهٔ‌درست: () =>
    svg(`<path d="M30 40 h40 l-5 42 h-30 z" fill="#7B8A99"/>
    <rect x="26" y="32" width="48" height="9" rx="4" fill="#5D6B78"/>
    <rect x="43" y="24" width="14" height="7" rx="3" fill="#5D6B78"/>
    <path d="M44 52 v20 M56 52 v20" stroke="#4A5560" stroke-width="3" stroke-linecap="round"/>
    <circle cx="74" cy="24" r="7" fill="#3D9A50"/>
    <path d="M70 24 l3 3 l6 -6" fill="none" stroke="#FFF" stroke-width="2.6" stroke-linecap="round"/>`),

  // ⚠ سه بار بازنویسی شد. نسخهٔ ۱ شبیه بلندگو، نسخهٔ ۲ شبیه پیش‌بند،
  // نسخهٔ ۳ آن‌قدر بزرگ بود که صورت را می‌پوشاند و چهره دیده نمی‌شد.
  // درس: در آیکون ۸۶ پیکسلی، وقتی دو چیز باید هم‌زمان خوانده شوند
  // (چهره + شیء)، شیء باید کوچک و در حاشیه بماند.
  دستمال: () =>
    svg(`<circle cx="48" cy="36" r="22" fill="#F5D3B5" stroke="#D9A87E" stroke-width="2"/>
    <path d="M34 24 q7 -5 13 -1" fill="none" stroke="#2B2A33" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M62 24 q-7 -5 -13 -1" fill="none" stroke="#2B2A33" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M36 35 q5 5 10 0" fill="none" stroke="#2B2A33" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M52 35 q5 5 10 0" fill="none" stroke="#2B2A33" stroke-width="2.8" stroke-linecap="round"/>
    <ellipse cx="48" cy="47" rx="5" ry="4" fill="#2B2A33"/>
    <g transform="rotate(-12 50 70)">
      <rect x="30" y="60" width="40" height="24" rx="4" fill="#FBFDFF" stroke="#8FA6B6" stroke-width="2.6"/>
      <path d="M43 60 v24 M56 60 v24" stroke="#C9D8E2" stroke-width="2"/>
    </g>
    <circle cx="74" cy="80" r="7" fill="#F2C6A0" stroke="#D9A87E" stroke-width="2"/>`),
  دویدن: () =>
    svg(`<circle cx="52" cy="26" r="11" fill="#F2C6A0"/>
    <path d="M46 38 q10 -3 14 6 l6 16 h-10 z" fill="#E4572E"/>
    <path d="M50 60 l-12 20" stroke="#2E86AB" stroke-width="7" stroke-linecap="round"/>
    <path d="M58 60 l14 14" stroke="#2E86AB" stroke-width="7" stroke-linecap="round"/>
    <path d="M46 44 l-14 8" stroke="#F2C6A0" stroke-width="6" stroke-linecap="round"/>
    <path d="M62 44 l12 -6" stroke="#F2C6A0" stroke-width="6" stroke-linecap="round"/>`),

  کتاب‌خواندن: () =>
    svg(`<circle cx="50" cy="26" r="12" fill="#F5D3B5"/>
    <circle cx="45" cy="25" r="2.4" fill="#2B2A33"/>
    <circle cx="55" cy="25" r="2.4" fill="#2B2A33"/>
    <path d="M45 32 q5 4 10 0" fill="none" stroke="#2B2A33" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M20 54 q30 -10 30 0 q0 -10 30 0 v22 q-30 -10 -30 0 q0 -10 -30 0 z"
      fill="#FFF" stroke="#C9BFB0" stroke-width="2.5"/>
    <path d="M50 54 v22" stroke="#C9BFB0" stroke-width="2.5"/>`),
};

/** نام همهٔ صحنه‌ها. */
export const SCENE_NAMES = Object.freeze(Object.keys(SCENES));

/** SVG یک صحنه، یا رشتهٔ خالی اگر نبود. */
export function sceneSvg(name) {
  const f = SCENES[name];
  return f ? f() : '';
}

export const CATEGORIES = Object.freeze({
  حیوان: ['گربه', 'سگ', 'ماهی', 'پرنده', 'خرگوش', 'جوجه', 'گاو', 'پروانه', 'زنبور', 'لاکپشت'],
  میوه: ['سیب', 'موز', 'انار', 'پرتقال', 'گیلاس'],
  طبیعت: ['گل', 'درخت', 'خورشید', 'ماه', 'ابر', 'ستاره', 'کوه', 'رودخانه', 'برف'],
  وسیله: ['توپ', 'کتاب', 'خانه', 'ماشین', 'چتر', 'ساعت', 'کلید'],
});

/**
 * دسته‌بندی دوم — بر پایهٔ ویژگی، نه نوع.
 * همان شکل‌ها از زاویهٔ دیگری دسته می‌شوند؛ این «انعطاف شناختی» است:
 * کودک یاد می‌گیرد یک چیز می‌تواند همزمان عضو چند دسته باشد.
 */
export const TRAITS = Object.freeze({
  'پرواز می‌کند': ['پرنده', 'پروانه', 'زنبور'],
  'در آب زندگی می‌کند': ['ماهی', 'لاکپشت'],
  'در آسمان است': ['خورشید', 'ماه', 'ستاره', 'ابر'],
  'می‌شود خورد': ['سیب', 'موز', 'انار', 'پرتقال', 'گیلاس', 'هویج'],
  'چرخ دارد': ['ماشین'],
  'گیاه است': ['گل', 'درخت', 'هویج'],
});
