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

// ── پوشیدنی و خوراکی (برای بازی «کدام فرق دارد؟») ────────────────────
// ⚠ درس منطق آیتم‌های «کفش، کلاه، پیراهن، نان» داشت که هیچ‌کدام شکل
// نداشتند، پس گزینه‌ها فقط واژه بودند و کودکِ پیش‌خوان نمی‌توانست
// بازی کند. هر آیتمی که در درسی می‌آید باید تصویر داشته باشد.

  // ⚠ نسخهٔ اول جعبهٔ آبیِ تخت خوانده می‌شد. کفش از نیم‌رخ نشانه‌های
  // یکتا دارد: پنجهٔ بالاآمده، قوسِ زیرِ کف، مچ، و بندها.
  کفش: () =>
    svg(`<path d="M12 70 q0 -8 8 -9 l16 -2 q6 -1 10 -6 l10 -12 q4 -5 10 -3 q7 2 8 10
      l2 14 q1 8 9 10 q7 2 7 8 v4 h-80 z"
      fill="#3D6FA8" stroke="#274F79" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M10 78 h82 q3 0 3 4 t-3 4 h-82 q-3 0 -3 -4 t3 -4z" fill="#2B2A33"/>
    <path d="M56 44 l10 5 M53 52 l12 5 M51 60 l14 4" stroke="#FFF" stroke-width="3" stroke-linecap="round"/>
    <path d="M66 38 q8 6 9 16" fill="none" stroke="#274F79" stroke-width="2.4"/>`),


  کلاه: () =>
    svg(`<path d="M28 56 q0 -30 22 -30 t22 30 z" fill="#E4572E" stroke="#C04521" stroke-width="2.5"/>
    <path d="M12 58 h76 q4 0 4 5 t-4 5 h-76 q-4 0 -4 -5 t4 -5z" fill="#F4B942" stroke="#D99C1F" stroke-width="2.5"/>
    <path d="M50 26 v30" stroke="#C04521" stroke-width="2.2"/>
    <circle cx="50" cy="24" r="5" fill="#F4B942" stroke="#D99C1F" stroke-width="2"/>`),

  پیراهن: () =>
    svg(`<path d="M34 22 h32 l18 12 -10 14 -6 -4 v40 h-36 v-40 l-6 4 -10 -14 z"
      fill="#3D9A50" stroke="#2E7A3D" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M34 22 q16 12 32 0" fill="none" stroke="#2E7A3D" stroke-width="2.5"/>
    <circle cx="50" cy="46" r="2.6" fill="#2E7A3D"/>
    <circle cx="50" cy="58" r="2.6" fill="#2E7A3D"/>`),

  // ── افزودهٔ بخش ۶.۱: علوم و انگلیسی ────────────────────────────────
  // چرخهٔ زندگی، فصل‌ها، حواس و چند اسم پرکاربرد Dolch. قانون همان
  // است: هیچ درسی بدون تصویر ساخته نمی‌شود، پس اول شکل، بعد درس.

  // چرخهٔ زندگی پروانه — چهار مرحله که کودک باید مرتب کند
  // ⚠ نسخهٔ اول تخم ۹×۱۲ بود و روی برگ گم می‌شد — کودک فقط یک لکه
  // می‌دید. حالا تخم عنصر اصلی است و برگ فقط بستر.
  تخم: () =>
    svg(`<path d="M10 70 q40 -22 80 0 q-40 16 -80 0z" fill="#8FCB6B"/>
    <path d="M50 62 v-4" stroke="#6BA84F" stroke-width="2.5"/>
    <ellipse cx="50" cy="40" rx="17" ry="22" fill="#FFF8E7" stroke="#C9B48A" stroke-width="3"/>
    <ellipse cx="44" cy="33" rx="5" ry="7" fill="#FFFDF6"/>`),

  کرم: () =>
    svg(`<g><circle cx="26" cy="56" r="11" fill="#8FCB6B"/>
    <circle cx="42" cy="58" r="12" fill="#7DBB5B"/>
    <circle cx="58" cy="58" r="12" fill="#8FCB6B"/>
    <circle cx="74" cy="56" r="11" fill="#7DBB5B"/>
    <circle cx="79" cy="52" r="3" fill="#2D2A32"/>
    <path d="M74 44 v-6 M82 46 v-5" stroke="#2D2A32" stroke-width="2.5" stroke-linecap="round"/></g>`),

  پیله: () =>
    svg(`<path d="M40 20 h20 v4 h-20 z" fill="#8B6F47"/>
    <path d="M50 24 q22 10 22 32 t-22 30 q-22 -8 -22 -30 t22 -32 z" fill="#C89B5A" stroke="#A87B3A" stroke-width="2"/>
    <path d="M36 44 q14 6 28 0 M34 58 q16 7 32 0 M38 72 q12 5 24 0" fill="none" stroke="#A87B3A" stroke-width="2"/>`),

  گیاه: () =>
    svg(`<path d="M50 86 v-40" stroke="#3D9A50" stroke-width="5" stroke-linecap="round"/>
    <path d="M50 58 q-20 -6 -22 -22 q18 0 22 22z" fill="#6FBF73"/>
    <path d="M50 50 q20 -6 22 -22 q-18 0 -22 22z" fill="#8FCB6B"/>
    <path d="M28 86 h44" stroke="#8B6F47" stroke-width="6" stroke-linecap="round"/>`),

  دانه: () =>
    svg(`<path d="M22 78 h56 l-4 10 h-48 z" fill="#8B6F47"/>
    <ellipse cx="50" cy="60" rx="10" ry="13" fill="#C89B5A" stroke="#8B6F47" stroke-width="2.5"/>
    <path d="M50 52 q4 -6 0 -10" fill="none" stroke="#3D9A50" stroke-width="3" stroke-linecap="round"/>`),

  // فصل‌ها — هرکدام نشانهٔ دیداری یکتا دارد، نه فقط رنگ متفاوت
  بهار: () =>
    svg(`<circle cx="50" cy="50" r="36" fill="#E8F6E0"/>
    <path d="M50 82 v-26" stroke="#3D9A50" stroke-width="4" stroke-linecap="round"/>
    <circle cx="50" cy="44" r="8" fill="#F49AC1"/>
    <circle cx="38" cy="50" r="7" fill="#F7B7D2"/><circle cx="62" cy="50" r="7" fill="#F7B7D2"/>
    <circle cx="44" cy="34" r="7" fill="#F7B7D2"/><circle cx="56" cy="34" r="7" fill="#F7B7D2"/>
    <circle cx="50" cy="42" r="4.5" fill="#F4D03F"/>`),

  تابستان: () =>
    svg(`<circle cx="50" cy="50" r="36" fill="#FFF3D6"/>
    <circle cx="50" cy="50" r="17" fill="#F4B942"/>
    <g stroke="#F07818" stroke-width="4" stroke-linecap="round">
    <path d="M50 22 v-9"/><path d="M50 78 v9"/><path d="M22 50 h-9"/><path d="M78 50 h9"/>
    <path d="M31 31 l-6 -6"/><path d="M69 31 l6 -6"/><path d="M31 69 l-6 6"/><path d="M69 69 l6 6"/></g>`),

  پاییز: () =>
    svg(`<circle cx="50" cy="50" r="36" fill="#FBEAD7"/>
    <path d="M50 78 q-4 -14 0 -26" stroke="#8B6F47" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M50 52 q-20 -4 -22 -20 q20 -2 22 20z" fill="#E4572E"/>
    <path d="M50 52 q20 -4 22 -20 q-20 -2 -22 20z" fill="#F07818"/>
    <path d="M50 46 q-10 -14 0 -24 q10 10 0 24z" fill="#D9A441"/>`),

  زمستان: () =>
    svg(`<circle cx="50" cy="50" r="36" fill="#E4F0F7"/>
    <g stroke="#2E86AB" stroke-width="4" stroke-linecap="round">
    <path d="M50 20 v60"/><path d="M24 35 l52 30"/><path d="M76 35 l-52 30"/>
    <path d="M50 30 l-8 -8 M50 30 l8 -8"/><path d="M50 70 l-8 8 M50 70 l8 8"/></g>`),

  // حواس پنج‌گانه — اندام، نه نماد انتزاعی
  چشم: () =>
    svg(`<path d="M12 50 q38 -30 76 0 q-38 30 -76 0z" fill="#FFF" stroke="#2B2A33" stroke-width="3"/>
    <circle cx="50" cy="50" r="15" fill="#5AA9CF"/>
    <circle cx="50" cy="50" r="7" fill="#2B2A33"/>
    <circle cx="45" cy="45" r="3" fill="#FFF"/>`),

  گوش: () =>
    svg(`<path d="M62 18 q-30 -4 -32 26 q-1 20 6 30 q5 8 12 8 q8 0 8 -9 q0 -8 6 -12 q14 -9 12 -25 q-2 -16 -12 -18z"
      fill="#F7C9A8" stroke="#C99B7A" stroke-width="3" stroke-linejoin="round"/>
    <path d="M56 38 q-12 2 -10 16 q1 8 6 10" fill="none" stroke="#C99B7A" stroke-width="3.5" stroke-linecap="round"/>`),

  // ⚠ نسخهٔ اول نیم‌رخ بود و مثل یک سیم خمیده دیده می‌شد. بینیِ
  // روبه‌رو با دو سوراخ برای کودک بلافاصله خواناست.
  بینی: () =>
    svg(`<path d="M50 16 q-16 26 -22 46 q-4 14 10 18 q12 4 12 -6 q0 10 12 6 q14 -4 10 -18 q-6 -20 -22 -46z"
      fill="#F7C9A8" stroke="#C99B7A" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="38" cy="70" rx="6" ry="4.5" fill="#B07B5A" transform="rotate(-18 38 70)"/>
    <ellipse cx="62" cy="70" rx="6" ry="4.5" fill="#B07B5A" transform="rotate(18 62 70)"/>`),

  // ⚠ نسخهٔ اول مثل کاسهٔ صورتی بود. حالا دهانِ باز با دندان‌های
  // بالا و زبانِ بیرون‌آمده — نشانهٔ روشنِ «چشیدن».
  زبان: () =>
    svg(`<path d="M18 40 q32 -20 64 0 q2 26 -14 38 q-18 14 -36 0 q-16 -12 -14 -38z"
      fill="#8E3B4E"/>
    <path d="M22 40 q28 -16 56 0 q-6 8 -28 8 t-28 -8z" fill="#FFF"/>
    <path d="M34 54 q16 -8 32 0 q2 22 -16 30 q-18 -8 -16 -30z" fill="#E88AA0" stroke="#C4566F" stroke-width="2.5"/>
    <path d="M50 62 v18" fill="none" stroke="#C4566F" stroke-width="2.5" stroke-linecap="round"/>`),

  دست: () =>
    svg(`<path d="M34 88 v-30 q-8 2 -10 -6 q-2 -8 6 -10 l4 -1 v-24 q0 -6 6 -6 t6 6 v20 h3 v-26 q0 -6 6 -6 t6 6 v26 h3 v-20 q0 -6 6 -6 t6 6 v34 q0 24 -18 37z"
      fill="#F7C9A8" stroke="#C99B7A" stroke-width="3" stroke-linejoin="round"/>`),

  // ── صحنه‌های پرسش ─────────────────────────────────────────────────
  // ⚠ این‌ها «تصویرِ خودِ پرسش»اند، نه گزینه. گِردهای زنده/غیرزنده و
  // شناور/غرق اول فقط واژهٔ «زنده» یا «روی آب می‌ماند» را در صحنه
  // می‌گذاشتند — یعنی کودکِ پیش‌خوان اصلاً نمی‌فهمید چه پرسیده شده.
  // قانون پروژه: بدون صدا و بدون خواندن هم باید حل‌شدنی باشد.

  'روی‌آب': () =>
    svg(`<rect x="6" y="52" width="88" height="42" rx="8" fill="#BFE3F2"/>
    <path d="M6 56 q11 -7 22 0 t22 0 t22 0 t22 0" fill="none" stroke="#7FC4E0" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="50" cy="49" rx="20" ry="8" fill="#E4572E"/>
    <path d="M30 49 q20 14 40 0" fill="#C4451F"/>
    <path d="M50 41 v-18" stroke="#8B6F47" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M52 24 l18 8 -18 8z" fill="#F4B942"/>`),

  'ته‌آب': () =>
    svg(`<rect x="6" y="20" width="88" height="74" rx="8" fill="#BFE3F2"/>
    <path d="M6 24 q11 -7 22 0 t22 0 t22 0 t22 0" fill="none" stroke="#7FC4E0" stroke-width="4" stroke-linecap="round"/>
    <path d="M6 84 q22 -8 44 0 t44 0 v10 h-88z" fill="#D9CDB4"/>
    <path d="M56 34 q10 -6 18 2" fill="none" stroke="#8FB8CC" stroke-width="3" stroke-linecap="round" opacity=".8"/>
    <circle cx="62" cy="46" r="3.5" fill="#FFF" opacity=".7"/>
    <circle cx="70" cy="58" r="2.5" fill="#FFF" opacity=".6"/>
    <ellipse cx="46" cy="78" rx="17" ry="12" fill="#9A9490" stroke="#6E6A66" stroke-width="2.5"/>
    <path d="M36 74 q10 -6 20 -1" fill="none" stroke="#7E7A76" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M46 30 v30" stroke="#6E6A66" stroke-width="3" stroke-dasharray="4 5" stroke-linecap="round" opacity=".7"/>
    <path d="M40 56 l6 8 6 -8" fill="none" stroke="#6E6A66" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>`),

  // ── شناور/غرق و چند شیء پایه ──────────────────────────────────────
  // ⚠ نسخهٔ اول برگ دو برگچه روی ساقه بود — یعنی عملاً همان «گیاه».
  // چون هر دو می‌توانند گزینهٔ یک پرسش باشند، باید در یک نگاه از هم
  // جدا شوند: برگِ تک و بزرگ با رگبرگ، نه جوانه.
  برگ: () =>
    svg(`<path d="M78 20 q-52 4 -60 40 q-4 20 10 26 q26 10 42 -14 q14 -22 8 -52z"
      fill="#7DBB5B" stroke="#4E7A32" stroke-width="3" stroke-linejoin="round"/>
    <path d="M78 20 q-34 22 -52 66" fill="none" stroke="#4E7A32" stroke-width="3.5" stroke-linecap="round"/>
    <g stroke="#4E7A32" stroke-width="2.2" stroke-linecap="round" fill="none">
    <path d="M64 33 q-12 2 -18 12"/><path d="M56 47 q-12 2 -18 12"/><path d="M46 62 q-10 2 -14 10"/></g>`),

  چوب: () =>
    svg(`<rect x="14" y="40" width="72" height="22" rx="10" fill="#C89B5A" stroke="#8B6F47" stroke-width="3"/>
    <ellipse cx="82" cy="51" rx="6" ry="11" fill="#A87B3A"/>
    <path d="M28 46 v10 M42 44 v14 M56 46 v10" stroke="#A87B3A" stroke-width="2.5" stroke-linecap="round"/>`),

  کاغذ: () =>
    svg(`<path d="M24 14 h40 l14 14 v58 h-54z" fill="#FFF" stroke="#B9AFA0" stroke-width="3" stroke-linejoin="round"/>
    <path d="M64 14 v14 h14" fill="none" stroke="#B9AFA0" stroke-width="3" stroke-linejoin="round"/>
    <path d="M34 44 h34 M34 56 h34 M34 68 h22" stroke="#C9BFB0" stroke-width="3.5" stroke-linecap="round"/>`),

  سنگ: () =>
    svg(`<path d="M18 72 q-4 -22 16 -32 q22 -12 38 2 q16 12 10 30 q-32 8 -64 0z"
      fill="#9A9490" stroke="#6E6A66" stroke-width="3" stroke-linejoin="round"/>
    <path d="M34 52 q10 -8 20 -2" fill="none" stroke="#7E7A76" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="50" cy="76" rx="34" ry="5" fill="#C9C3BE"/>`),

  سکه: () =>
    svg(`<circle cx="50" cy="50" r="32" fill="#E8B84B" stroke="#B8863A" stroke-width="3.5"/>
    <circle cx="50" cy="50" r="23" fill="none" stroke="#B8863A" stroke-width="2.5"/>
    <path d="M50 34 v32 M40 42 h20 M40 58 h20" stroke="#B8863A" stroke-width="4" stroke-linecap="round"/>`),

  قاشق: () =>
    svg(`<ellipse cx="50" cy="30" rx="17" ry="21" fill="#C9CFD4" stroke="#8E979E" stroke-width="3"/>
    <ellipse cx="46" cy="25" rx="6" ry="9" fill="#E8EDF0"/>
    <path d="M50 51 v34" stroke="#C9CFD4" stroke-width="9" stroke-linecap="round"/>
    <path d="M50 51 v34" stroke="#8E979E" stroke-width="2.5" stroke-linecap="round"/>`),

  'رنگین‌کمان': () =>
    svg(`<g fill="none" stroke-width="9" stroke-linecap="round">
    <path d="M14 78 a36 36 0 0 1 72 0" stroke="#E4572E"/>
    <path d="M23 78 a27 27 0 0 1 54 0" stroke="#F4B942"/>
    <path d="M32 78 a18 18 0 0 1 36 0" stroke="#4CAF50"/>
    <path d="M41 78 a9 9 0 0 1 18 0" stroke="#2E86AB"/></g>`),

  نان: () =>
    svg(`<ellipse cx="50" cy="54" rx="36" ry="26" fill="#E0A94B" stroke="#B8863A" stroke-width="2.5"/>
    <ellipse cx="50" cy="50" rx="28" ry="18" fill="#F0C377"/>
    <circle cx="38" cy="48" r="2.4" fill="#B8863A"/>
    <circle cx="52" cy="44" r="2.4" fill="#B8863A"/>
    <circle cx="60" cy="54" r="2.4" fill="#B8863A"/>
    <circle cx="44" cy="58" r="2.4" fill="#B8863A"/>`),

};

// ── شکل‌های هندسی ───────────────────────────────────────────────────────
export const GEO = {
  دایره: (c) => svg(`<circle cx="50" cy="50" r="34" fill="${c}"/>`),
  مربع: (c) => svg(`<rect x="18" y="18" width="64" height="64" rx="6" fill="${c}"/>`),
  مثلث: (c) => svg(`<path d="M50 16 L86 82 H14 Z" fill="${c}"/>`),
  // مستطیل جزو چهار شکلِ کتاب اول دبستان است و نبودش حفره‌ای در
  // «گوشه‌ها را بشمار» می‌ساخت: بدون آن فقط مثلث و مربع می‌ماند.
  مستطیل: (c) => svg(`<rect x="10" y="28" width="80" height="44" rx="6" fill="${c}"/>`),
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
  // چرا سه جدول و یک تابع: کل مسیر رندر (screens.js) فقط shape() را
  // صدا می‌زند. اگر چهره‌ها و صحنه‌ها جدا می‌ماندند، باید هر شاخهٔ
  // نمایش دوباره نوشته می‌شد. با این عقب‌نشینی، حوزهٔ مهارت زندگی
  // بدون یک خط تغییر در رابط کاربری تصویر می‌گیرد.
  const f = SHAPES[name] || FACES[name] || SCENES[name]
    || SITUATIONS[name] || HAZARDS[name] || SAFETY_STEPS[name];
  return f ? f() : null;
}

/** آیا برای این نام تصویری هست؟ — برای اعتبارسنجی درس‌ها. */
export function hasPicture(name) {
  return Boolean(
    SHAPES[name] || FACES[name] || SCENES[name]
    || SITUATIONS[name] || HAZARDS[name] || SAFETY_STEPS[name],
  );
}

/** یک شکل هندسی رنگی برمی‌گرداند. */
export function geo(name, color = '#2E86AB') {
  return GEO[name] ? GEO[name](COLOR_HEX[color] || color) : null;
}

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

  نفس‌عمیق: () =>
    svg(`<circle cx="50" cy="46" r="20" fill="#F5D3B5" stroke="#D9A87E" stroke-width="2"/>
    <path d="M39 42 q5 -4 10 0" fill="none" stroke="#2B2A33" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M53 42 q5 -4 10 0" fill="none" stroke="#2B2A33" stroke-width="2.6" stroke-linecap="round"/>
    <ellipse cx="50" cy="55" rx="5" ry="4" fill="#2B2A33"/>
    <circle cx="50" cy="46" r="29" fill="none" stroke="#7FB8D8" stroke-width="3" opacity=".55"/>
    <circle cx="50" cy="46" r="37" fill="none" stroke="#7FB8D8" stroke-width="2.4" opacity=".3"/>
    <path d="M50 78 q-8 8 -3 16 M50 78 q8 8 3 16" fill="none" stroke="#7FB8D8" stroke-width="3" stroke-linecap="round"/>`),

  غذا: () =>
    svg(`<ellipse cx="50" cy="58" rx="34" ry="24" fill="#FFF" stroke="#C9BFB0" stroke-width="3"/>
    <ellipse cx="50" cy="56" rx="24" ry="16" fill="#F4E7D4"/>
    <circle cx="42" cy="52" r="6" fill="#E4572E"/>
    <circle cx="56" cy="56" r="5" fill="#3D9A50"/>
    <circle cx="50" cy="62" r="4.5" fill="#F4B942"/>
    <path d="M14 32 v18 M11 32 v10 M17 32 v10" stroke="#9AA5B1" stroke-width="3" stroke-linecap="round"/>
    <path d="M86 32 q4 8 0 14 v10" stroke="#9AA5B1" stroke-width="3" stroke-linecap="round" fill="none"/>`),
};

/** نام همهٔ صحنه‌ها. */
export const SCENE_NAMES = Object.freeze(Object.keys(SCENES));

/** SVG یک صحنه، یا رشتهٔ خالی اگر نبود. */
export function sceneSvg(name) {
  const f = SCENES[name];
  return f ? f() : '';
}


// ── موقعیت‌های داستانی و ایمنی (حوزهٔ مهارت زندگی) ───────────────────
//
// این‌ها قلب حوزه‌اند. پرسش «او چه حسی دارد؟» فقط وقتی بدون خواندن
// حل می‌شود که خودِ موقعیت تصویری باشد: کودک صحنه را می‌بیند و
// چهرهٔ درست را انتخاب می‌کند. اگر موقعیت متن بود، درس برای کودک
// پیش‌خوان بی‌فایده می‌شد.
//
// موقعیت‌ها از دو منبع درآمده‌اند: چارچوب CASEL (خودآگاهی: نام‌گذاری
// احساس) و راهنمای مهارت زندگی بهزیستی (ایمنی فردی، «نه، برو، بگو»).

export const SITUATIONS = {
  هدیه: () =>
    svg(`<rect x="24" y="42" width="52" height="40" rx="5" fill="#E4572E"/>
    <rect x="20" y="32" width="60" height="14" rx="5" fill="#C8462260"/>
    <rect x="20" y="32" width="60" height="14" rx="5" fill="#D14343"/>
    <rect x="44" y="32" width="12" height="50" fill="#F4B942"/>
    <path d="M50 32 q-14 -14 -4 -18 q8 -3 4 18 z" fill="#F4B942"/>
    <path d="M50 32 q14 -14 4 -18 q-8 -3 -4 18 z" fill="#F4B942"/>`),

  برج‌خراب: () =>
    svg(`<rect x="14" y="66" width="20" height="16" rx="3" fill="#2E86AB"/>
    <rect x="16" y="50" width="18" height="15" rx="3" fill="#F4B942" transform="rotate(-8 25 58)"/>
    <rect x="52" y="70" width="18" height="14" rx="3" fill="#7B4B94" transform="rotate(22 61 77)"/>
    <rect x="70" y="56" width="17" height="14" rx="3" fill="#3D9A50" transform="rotate(-34 78 63)"/>
    <rect x="44" y="46" width="16" height="14" rx="3" fill="#E4572E" transform="rotate(48 52 53)"/>
    <path d="M8 86 h84" stroke="#C9BFB0" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M40 30 l6 8 M52 26 v10 M64 30 l-6 8" stroke="#C9BFB0" stroke-width="3" stroke-linecap="round"/>`),

  // ⚠ نسخهٔ اول: کودک آن‌قدر کوچک بود که در گوشهٔ قاب گم می‌شد و
  // صحنه فقط «یک اتاق تاریک» خوانده می‌شد، نه «کودکی در تاریکی».
  // حالا کودک بزرگ و در مرکز است — او سوژه است، نه اتاق.
  اتاق‌تاریک: () =>
    svg(`<rect x="6" y="6" width="88" height="88" rx="8" fill="#3A3550"/>
    <rect x="58" y="18" width="30" height="28" rx="3" fill="#241F3A" stroke="#5A5478" stroke-width="2.5"/>
    <path d="M73 18 v28 M58 32 h30" stroke="#5A5478" stroke-width="2.2"/>
    <circle cx="80" cy="25" r="4.5" fill="#F4E3A8" opacity=".8"/>
    <circle cx="38" cy="46" r="17" fill="#E3C3A6" stroke="#C49B78" stroke-width="2"/>
    <path d="M28 38 q6 -5 11 -1 M41 37 q6 -4 11 1" fill="none" stroke="#2B2A33" stroke-width="2.6" stroke-linecap="round"/>
    <ellipse cx="33" cy="46" rx="3.4" ry="4.4" fill="#2B2A33"/>
    <ellipse cx="45" cy="46" rx="3.4" ry="4.4" fill="#2B2A33"/>
    <path d="M32 57 q3 -4 6 0 q3 4 6 0" fill="none" stroke="#2B2A33" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M18 92 q0 -26 20 -26 t20 26 z" fill="#5A5478"/>`),
  // ⚠ نسخهٔ اول: تنه یک مستطیل تخت بود، پاها شناور بودند و زخم لکهٔ
  // قرمز بی‌شکل. حالا تنهٔ گرد، پاهای متصل، و چسب‌زخم ضربدری روی
  // زانو — چسب‌زخم از خودِ خون خواناتر است و کودک را نمی‌ترساند.
  زانوی‌زخمی: () =>
    svg(`<circle cx="50" cy="22" r="14" fill="#F5D3B5" stroke="#D9A87E" stroke-width="2"/>
    <path d="M42 18 q4 -3 7 1 M51 19 q4 -3 7 1" fill="none" stroke="#2B2A33" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="45" cy="24" r="2.4" fill="#2B2A33"/>
    <circle cx="56" cy="24" r="2.4" fill="#2B2A33"/>
    <path d="M45 32 q5 -4 10 0" fill="none" stroke="#2B2A33" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M50 38 q14 0 15 16 v10 h-30 v-10 q1 -16 15 -16 z" fill="#2E86AB"/>
    <path d="M40 64 v18 M60 64 v18" stroke="#F5D3B5" stroke-width="11" stroke-linecap="round"/>
    <path d="M36 46 l-9 12 M64 46 l9 12" stroke="#F5D3B5" stroke-width="7.5" stroke-linecap="round"/>
    <g transform="rotate(-20 40 72)">
      <rect x="31" y="66" width="18" height="11" rx="5" fill="#F0C08A" stroke="#D9A05B" stroke-width="1.8"/>
      <circle cx="40" cy="71.5" r="2.6" fill="#D9A05B"/>
    </g>
    <path d="M8 88 h84" stroke="#C9BFB0" stroke-width="3.5" stroke-linecap="round"/>`),
  رعدوبرق: () =>
    svg(`<path d="M24 46 q-12 0 -12 -11 q0 -10 11 -10 q3 -13 17 -13 q13 0 16 12 q13 0 13 12 q0 10 -12 10 z"
      fill="#8A93A8"/>
    <path d="M52 44 h18 l-13 18 h12 l-24 30 l8 -24 h-11 z" fill="#F4B942" stroke="#D99C1F" stroke-width="2"/>
    <path d="M22 58 l-5 12 M34 62 l-4 10" stroke="#9CB4C4" stroke-width="3.4" stroke-linecap="round"/>`),

  بستنی‌افتاده: () =>
    svg(`<path d="M40 34 q10 -16 20 0 z" fill="#F2C6A0" opacity="0"/>
    <path d="M34 46 l12 26 l12 -26 z" fill="#D9A05B" stroke="#B57F3C" stroke-width="2"/>
    <circle cx="66" cy="76" r="11" fill="#F6B8C8" stroke="#DE94A8" stroke-width="2"/>
    <ellipse cx="66" cy="86" rx="18" ry="4" fill="#EFD6DD"/>
    <path d="M52 58 q10 4 12 10" fill="none" stroke="#C9BFB0" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="4 5"/>
    <path d="M8 90 h84" stroke="#C9BFB0" stroke-width="3.5" stroke-linecap="round"/>`),

  باغچه‌آرام: () =>
    svg(`<circle cx="74" cy="24" r="12" fill="#F4B942"/>
    <path d="M0 78 q25 -14 50 0 q25 14 50 0 v22 h-100 z" fill="#8ED9A8"/>
    <circle cx="28" cy="58" r="6" fill="#E86A9A"/>
    <path d="M28 64 v14" stroke="#3D9A50" stroke-width="3" stroke-linecap="round"/>
    <circle cx="50" cy="64" r="5" fill="#F4B942"/>
    <path d="M50 69 v11" stroke="#3D9A50" stroke-width="3" stroke-linecap="round"/>
    <circle cx="70" cy="60" r="5.5" fill="#B48CD8"/>
    <path d="M70 66 v13" stroke="#3D9A50" stroke-width="3" stroke-linecap="round"/>`),
};

// ── چیزهای خطرناک و امن (درس ایمنی) ─────────────────────────────────
//
// منبع: فهرست ایمنی کودک — پرهیز از تماس با وسایل برقی، اشیای تیز و
// مواد شیمیایی، و خبردادن به بزرگ‌تر. کودک باید خطر را از روی شکل
// بشناسد، پس هر خطر نشانهٔ دیداری تند دارد.

export const HAZARDS = {
  پریز: () =>
    svg(`<rect x="26" y="22" width="48" height="56" rx="8" fill="#F0EAE0" stroke="#C9BFB0" stroke-width="3"/>
    <circle cx="40" cy="44" r="5" fill="#4A4550"/>
    <circle cx="60" cy="44" r="5" fill="#4A4550"/>
    <path d="M36 60 h28" stroke="#C9BFB0" stroke-width="3" stroke-linecap="round"/>
    <path d="M50 6 l-8 14 h7 l-6 12 l14 -16 h-7 z" fill="#F4B942" stroke="#D99C1F" stroke-width="2"/>`),

  چاقو: () =>
    svg(`<path d="M22 62 q18 -34 40 -44 q6 12 -6 30 q-10 15 -24 22 z" fill="#D8DEE4" stroke="#9AA5B1" stroke-width="2.5"/>
    <rect x="58" y="62" width="26" height="11" rx="5" fill="#7B4B94" transform="rotate(42 71 67)"/>
    <path d="M28 56 q16 -28 32 -38" fill="none" stroke="#FFF" stroke-width="2.6" opacity=".8"/>`),

  قرص: () =>
    svg(`<rect x="30" y="34" width="40" height="50" rx="7" fill="#E86A6A" stroke="#C43F3F" stroke-width="2.5"/>
    <rect x="34" y="24" width="32" height="12" rx="4" fill="#C43F3F"/>
    <rect x="36" y="48" width="28" height="22" rx="4" fill="#FFF" opacity=".9"/>
    <circle cx="44" cy="56" r="3.4" fill="#E86A6A"/>
    <circle cx="56" cy="56" r="3.4" fill="#E86A6A"/>
    <circle cx="50" cy="64" r="3.4" fill="#E86A6A"/>`),

  کبریت: () =>
    svg(`<rect x="40" y="34" width="9" height="50" rx="3" fill="#D9A05B" transform="rotate(12 44 60)"/>
    <circle cx="40" cy="34" r="7" fill="#C43F3F"/>
    <path d="M40 26 q-9 -10 0 -20 q3 9 8 11 q4 -3 3 -8 q8 9 3 18 q-4 6 -14 -1 z"
      fill="#F4B942" stroke="#E0851F" stroke-width="1.8"/>`),
};

// ── نشانه‌های «نه، برو، بگو» ─────────────────────────────────────────
//
// منبع: راهنمای رسمی مهارت زندگی بهزیستی — فرمول سه‌گامیِ ایمنی
// شخصی. سه گام باید سه تصویر کاملاً متفاوت باشند تا کودک بتواند
// ترتیبشان را بچیند، نه اینکه حدس بزند.

export const SAFETY_STEPS = {
  'نه‌گفتن': () =>
    svg(`<path d="M34 84 v-26 q-8 -4 -8 -14 v-14 q0 -5 5 -5 t5 5 v10 v-20 q0 -5 5 -5 t5 5 v18 v-22
      q0 -5 5 -5 t5 5 v22 v-16 q0 -5 5 -5 t5 5 v34 q0 18 -14 18 z"
      fill="#F5D3B5" stroke="#D9A87E" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="76" cy="24" r="13" fill="#D14343"/>
    <path d="M69 24 h14" stroke="#FFF" stroke-width="4" stroke-linecap="round"/>`),

  'دورشدن': () =>
    svg(`<circle cx="42" cy="24" r="11" fill="#F2C6A0" stroke="#D9A87E" stroke-width="2"/>
    <path d="M36 36 q10 -3 14 6 l6 16 h-10 z" fill="#E4572E"/>
    <path d="M40 58 l-12 22" stroke="#2E86AB" stroke-width="7.5" stroke-linecap="round"/>
    <path d="M48 58 l14 16" stroke="#2E86AB" stroke-width="7.5" stroke-linecap="round"/>
    <path d="M36 42 l-14 8" stroke="#F2C6A0" stroke-width="6.5" stroke-linecap="round"/>
    <path d="M78 44 h14 M84 36 l8 8 l-8 8" fill="none" stroke="#3D9A50" stroke-width="4"
      stroke-linecap="round" stroke-linejoin="round"/>`),

  'گفتن‌به‌بزرگ‌تر': () =>
    svg(`<circle cx="26" cy="54" r="11" fill="#F2C6A0" stroke="#D9A87E" stroke-width="2"/>
    <path d="M13 86 q0 -18 13 -18 t13 18 z" fill="#F4B942"/>
    <circle cx="70" cy="28" r="13" fill="#F5D3B5" stroke="#D9A87E" stroke-width="2"/>
    <path d="M53 86 q0 -44 17 -44 t17 44 z" fill="#2E86AB"/>
    <path d="M40 34 h26 q5 0 5 5 v12 q0 5 -5 5 h-16 l-8 8 v-8 h-2 q-5 0 -5 -5 v-12 q0 -5 5 -5 z"
      fill="#FFF" stroke="#9AA5B1" stroke-width="2.4"/>
    <circle cx="47" cy="45" r="2.4" fill="#7B8A99"/>
    <circle cx="55" cy="45" r="2.4" fill="#7B8A99"/>
    <circle cx="63" cy="45" r="2.4" fill="#7B8A99"/>`),
};

/** نام همهٔ موقعیت‌ها، خطرها و گام‌های ایمنی. */
export const SITUATION_NAMES = Object.freeze(Object.keys(SITUATIONS));
export const HAZARD_NAMES = Object.freeze(Object.keys(HAZARDS));
export const SAFETY_STEP_NAMES = Object.freeze(Object.keys(SAFETY_STEPS));

/** دسته‌بندی معنایی — برای بازی «کدام فرق دارد؟». */
export const CATEGORIES = Object.freeze({
  حیوان: ['گربه', 'سگ', 'ماهی', 'پرنده', 'خرگوش', 'جوجه', 'گاو', 'پروانه', 'زنبور', 'لاکپشت'],
  میوه: ['سیب', 'موز', 'انار', 'پرتقال', 'گیلاس'],
  طبیعت: ['گل', 'درخت', 'خورشید', 'ماه', 'ابر', 'ستاره', 'کوه', 'رودخانه', 'برف'],
  وسیله: ['توپ', 'کتاب', 'خانه', 'ماشین', 'چتر', 'ساعت', 'کلید'],
  پوشیدنی: ['کفش', 'کلاه', 'پیراهن'],
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
