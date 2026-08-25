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
  // ── نشانهٔ جهت نیرو ───────────────────────────────────────────────
  // ⚠ گِرد push-pull فقط دو پاسخ متنی دارد («هل دادن»/«کشیدن») و گارد
  // درست ردش کرد: کودک پیش‌خوان نمی‌تواند بخواند. برای نیرو نمی‌شود
  // «شیء» کشید، پس جهتش را می‌کشیم: دستی که جعبه را از خود دور
  // می‌کند، و دستی که آن را به‌سوی خود می‌آورد.
  'هل دادن': () =>
    svg(`<rect x="52" y="34" width="34" height="34" rx="5" fill="#E8DCC8" stroke="#C9BFB0" stroke-width="3"/>
    <path d="M14 51 h30" stroke="#E4572E" stroke-width="7" stroke-linecap="round"/>
    <path d="M38 40 l12 11 l-12 11" fill="none" stroke="#E4572E" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`),

  'کشیدن': () =>
    svg(`<rect x="14" y="34" width="34" height="34" rx="5" fill="#E8DCC8" stroke="#C9BFB0" stroke-width="3"/>
    <path d="M86 51 h-30" stroke="#2E86AB" stroke-width="7" stroke-linecap="round"/>
    <path d="M62 40 l-12 11 l12 11" fill="none" stroke="#2E86AB" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`),

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

  // ابزار مدرسه — برای اندازه‌گیری با واحد غیراستاندارد (تم ۱۸).
  // عمداً عمودی کشیده شده‌اند تا وقتی کنار هم می‌چینیم، طولِ نوار
  // را نشان بدهند نه پهنا را.
  مداد: () =>
    svg(`<g><rect x="40" y="20" width="20" height="52" rx="3" fill="#F4B942"/>
    <rect x="40" y="20" width="20" height="8" rx="3" fill="#E08A1E"/>
    <path d="M40 72 L50 88 L60 72 Z" fill="#E8C39E"/>
    <path d="M45 79 L50 88 L55 79 Z" fill="#2B2A33"/></g>`),

  گیره: () =>
    svg(`<g><path d="M38 22 v46 a12 12 0 0 0 24 0 v-38 a7 7 0 0 0 -14 0 v36"
    fill="none" stroke="#7B8794" stroke-width="7" stroke-linecap="round"/></g>`),

  'پاک‌کن': () =>
    svg(`<g><rect x="30" y="34" width="40" height="34" rx="5" fill="#E4572E"/>
    <rect x="30" y="34" width="40" height="12" rx="5" fill="#F2F0EC"/></g>`),

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

  // ── افزودهٔ عمق‌بخشی به علوم ───────────────────────────────────
  // این پنج شکل برای گسترش جدول‌های «از چه ساخته شده؟» و «نور و
  // سایه» لازم شدند. قانون همان است: هر آیتمی که در گزینه بیاید
  // باید شکل داشته باشد.

  شیر: () =>
    svg(`<path d="M30 34 h40 v46 a6 6 0 0 1 -6 6 h-28 a6 6 0 0 1 -6 -6z"
      fill="#FBFBF8" stroke="#C9CFD4" stroke-width="3" stroke-linejoin="round"/>
    <path d="M30 34 l8 -14 h24 l8 14z" fill="#EDEFF0" stroke="#C9CFD4" stroke-width="3" stroke-linejoin="round"/>
    <path d="M34 52 h32 v22 h-32z" fill="#8FC7E0" opacity=".5"/>
    <circle cx="50" cy="62" r="7" fill="#FFF" stroke="#9AC7DC" stroke-width="2.2"/>
    <path d="M46 62 q4 -5 8 0 q-4 5 -8 0z" fill="#8FC7E0"/>`),

  ماست: () =>
    svg(`<path d="M26 40 h48 l-5 42 a5 5 0 0 1 -5 4 h-28 a5 5 0 0 1 -5 -4z"
      fill="#FBFBF8" stroke="#C9CFD4" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="50" cy="40" rx="24" ry="7" fill="#EDEFF0" stroke="#C9CFD4" stroke-width="3"/>
    <ellipse cx="50" cy="40" rx="17" ry="4.4" fill="#FFF"/>
    <path d="M40 56 h20 M38 66 h24" stroke="#DCE3E8" stroke-width="3" stroke-linecap="round"/>`),

  موم: () =>
    svg(`<path d="M22 44 h56 v34 a6 6 0 0 1 -6 6 h-44 a6 6 0 0 1 -6 -6z"
      fill="#F5E6C8" stroke="#D9C49A" stroke-width="3" stroke-linejoin="round"/>
    <path d="M22 44 q14 -8 28 0 q14 8 28 0 v-6 q-14 8 -28 0 q-14 -8 -28 0z" fill="#EBD8AF"/>
    <path d="M34 58 h32 M34 70 h24" stroke="#E4D3AC" stroke-width="3.4" stroke-linecap="round"/>`),

  // ⚠ نسخهٔ اول این را لیوان کشیده بود و کنارِ «ماست» گذاشته می‌شد:
  // دو ظرفِ کم‌رنگِ هم‌شکل. کاربردِ این شکل «پنجره از چه ساخته شده؟»
  // است، پس *قطعه شیشه* درست است نه ظرفِ شیشه‌ای.
  شیشه: () =>
    svg(`<path d="M24 26 h52 v48 h-52z" fill="#DCF0FA" stroke="#7FBBD6"
      stroke-width="3" stroke-linejoin="round"/>
    <path d="M30 70 l34 -38" stroke="#FFF" stroke-width="8" stroke-linecap="round" opacity=".9"/>
    <path d="M44 70 l24 -26" stroke="#FFF" stroke-width="5" stroke-linecap="round" opacity=".75"/>
    <path d="M24 26 h52 v48 h-52z" fill="none" stroke="#7FBBD6"
      stroke-width="3" stroke-linejoin="round"/>
    <path d="M76 26 l8 -6 v48 l-8 6z" fill="#C4E4F2" stroke="#7FBBD6"
      stroke-width="3" stroke-linejoin="round"/>`),

  شکوفه: () =>
    svg(`<path d="M50 60 v26" stroke="#8B5E3C" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 72 q-12 -6 -16 4 q12 5 16 -4z" fill="#4CAF50"/>
    <g fill="#F7CBD8" stroke="#E3A8BA" stroke-width="2">
      <ellipse cx="50" cy="30" rx="8" ry="11"/>
      <ellipse cx="64" cy="40" rx="11" ry="8"/>
      <ellipse cx="58" cy="55" rx="8" ry="11"/>
      <ellipse cx="42" cy="55" rx="8" ry="11"/>
      <ellipse cx="36" cy="40" rx="11" ry="8"/>
    </g>
    <circle cx="50" cy="43" r="6" fill="#F4B942"/>`),

  // ── افزودهٔ بخش خواندن: واژگان تصویردار ─────────────────────────
  // ⚠ چرا این ۲۵ شکل: سقف تنوعِ جمله‌سازی و کلمه‌خوانی تعداد واژه‌هایی
  // بود که هم با نشانه‌های آموخته‌شده خواندنی باشند و هم تصویر داشته
  // باشند — فقط ۳۴ واژه از ۱۹۲ واژهٔ نقشهٔ صدا. تا این عدد بالا نرود،
  // درسِ «کلمه را بخوان و تصویرش را پیدا کن» ساخته نمی‌شود و
  // جمله‌ها هم تکراری می‌مانند. همهٔ این واژه‌ها از پیش در SOUND_MAP
  // بودند؛ فقط چشمِ برنامه را باز می‌کنیم.
  // معیار انتخاب: واژه باید در یک نگاه و بدون توضیح شناخته شود.
  // «دود» و «نمک» و «لباس» عمداً نیامدند چون تصویرشان دو پهلوست.

  بادام: () =>
    svg(`<path d="M50 14 C74 34 80 62 50 86 C20 62 26 34 50 14z" fill="#D9A86C" stroke="#A9793F" stroke-width="3"/>
    <path d="M50 24 C61 42 61 66 50 78" fill="none" stroke="#A9793F" stroke-width="2.6" stroke-linecap="round"/>`),

  سبد: () =>
    svg(`<path d="M28 40 a22 20 0 0 1 44 0" fill="none" stroke="#8B6F47" stroke-width="5" stroke-linecap="round"/>
    <path d="M18 42 h64 l-9 44 h-46z" fill="#C89B5A" stroke="#8B6F47" stroke-width="3" stroke-linejoin="round"/>
    <path d="M26 58 h48 M29 72 h42" stroke="#8B6F47" stroke-width="2.4"/>
    <path d="M34 46 l4 38 M50 46 v38 M66 46 l-4 38" stroke="#8B6F47" stroke-width="2.4"/>`),

  توت: () =>
    svg(`<path d="M50 34 v-18" stroke="#4E7A32" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M50 22 q8 -12 20 -12 q-3 13 -18 16z" fill="#4CAF50"/>
    <g fill="#7B4B94"><circle cx="50" cy="42" r="10"/><circle cx="38" cy="54" r="10"/>
    <circle cx="62" cy="54" r="10"/><circle cx="44" cy="68" r="10"/><circle cx="57" cy="68" r="10"/>
    <circle cx="50" cy="55" r="10"/></g>
    <g fill="#9B6BB5"><circle cx="47" cy="39" r="3"/><circle cx="35" cy="51" r="3"/>
    <circle cx="59" cy="51" r="3"/><circle cx="41" cy="65" r="3"/></g>`),

  اتو: () =>
    svg(`<path d="M14 74 h72 q2 -18 -16 -24 h-32 q-20 4 -24 24z" fill="#B9C3CC" stroke="#7B8794" stroke-width="3" stroke-linejoin="round"/>
    <path d="M12 74 h76 v9 h-76z" fill="#7B8794"/>
    <path d="M34 50 q16 -22 34 -8" fill="none" stroke="#4A5560" stroke-width="7" stroke-linecap="round"/>
    <circle cx="26" cy="66" r="3.4" fill="#E4572E"/>`),

  سوت: () =>
    svg(`<path d="M22 40 h44 a16 16 0 0 1 0 32 h-44 a4 4 0 0 1 -4 -4 v-24 a4 4 0 0 1 4 -4z"
      fill="#C9CFD4" stroke="#7B8794" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="62" cy="56" r="6" fill="#7B8794"/>
    <path d="M18 46 h-8" stroke="#7B8794" stroke-width="5" stroke-linecap="round"/>
    <path d="M74 34 q10 -6 14 -14 M80 50 h10 M74 68 q10 6 14 14" fill="none" stroke="#E4572E" stroke-width="4" stroke-linecap="round"/>`),

  مار: () =>
    svg(`<path d="M20 82 q22 0 22 -14 t-18 -14 q-14 0 -14 -12 t18 -12 h30"
      fill="none" stroke="#4CAF50" stroke-width="12" stroke-linecap="round"/>
    <path d="M20 82 q22 0 22 -14 t-18 -14 q-14 0 -14 -12 t18 -12 h30"
      fill="none" stroke="#7DBB5B" stroke-width="5" stroke-linecap="round" stroke-dasharray="5 9"/>
    <circle cx="56" cy="30" r="9" fill="#4CAF50"/>
    <circle cx="59" cy="27" r="2.6" fill="#2D2A32"/>
    <path d="M65 31 h10 l-5 4 M70 35 l5 4" fill="none" stroke="#E4572E" stroke-width="2.6" stroke-linecap="round"/>`),

  میز: () =>
    svg(`<rect x="12" y="38" width="76" height="11" rx="4" fill="#C89B5A" stroke="#8B6F47" stroke-width="2.6"/>
    <path d="M22 49 v34 M78 49 v34" stroke="#8B6F47" stroke-width="8" stroke-linecap="round"/>`),

  باران: () =>
    svg(`<path d="M30 46 a15 15 0 0 1 29 -6 a13 13 0 0 1 13 20 h-42 a12 12 0 0 1 0 -14z" fill="#B9C6D6"/>
    <g fill="#2E86AB"><path d="M32 66 q4 8 0 10 q-5 -2 0 -10z"/><path d="M48 70 q4 8 0 10 q-5 -2 0 -10z"/>
    <path d="M64 66 q4 8 0 10 q-5 -2 0 -10z"/><path d="M40 82 q4 8 0 10 q-5 -2 0 -10z"/>
    <path d="M56 82 q4 8 0 10 q-5 -2 0 -10z"/></g>`),

  شانه: () =>
    svg(`<rect x="14" y="30" width="72" height="20" rx="5" fill="#5C6BC0" stroke="#3F4C9A" stroke-width="2.6"/>
    <g stroke="#5C6BC0" stroke-width="6" stroke-linecap="round">
    <path d="M22 50 v24"/><path d="M34 50 v24"/><path d="M46 50 v24"/>
    <path d="M58 50 v24"/><path d="M70 50 v24"/><path d="M80 50 v24"/></g>`),

  اردک: () =>
    svg(`<ellipse cx="52" cy="60" rx="26" ry="17" fill="#FFF8E7" stroke="#D9CDB5" stroke-width="2.4"/>
    <circle cx="30" cy="40" r="13" fill="#FFF8E7" stroke="#D9CDB5" stroke-width="2.4"/>
    <path d="M18 41 h-11 q-2 4 0 7 h11z" fill="#F07818"/>
    <circle cx="27" cy="37" r="2.8" fill="#2D2A32"/>
    <path d="M52 54 q12 -6 20 4 q-10 8 -20 -4z" fill="#E9DEC6"/>
    <path d="M14 80 h72" stroke="#2E86AB" stroke-width="4" stroke-linecap="round"/>`),

  کاسه: () =>
    svg(`<path d="M16 46 h68 a34 32 0 0 1 -68 0z" fill="#2E86AB" stroke="#1B6B8F" stroke-width="3" stroke-linejoin="round"/>
    <path d="M12 44 h76" stroke="#1B6B8F" stroke-width="6" stroke-linecap="round"/>
    <path d="M28 58 a22 20 0 0 0 16 14" fill="none" stroke="#8FC7E0" stroke-width="4" stroke-linecap="round"/>`),

  پنیر: () =>
    svg(`<path d="M16 74 v-18 l58 -18 v18z" fill="#F4D03F" stroke="#C9A227" stroke-width="3" stroke-linejoin="round"/>
    <path d="M16 74 h58 v-18 l-58 18z" fill="#F7DC6F" stroke="#C9A227" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="34" cy="66" r="4" fill="#E0B90C"/><circle cx="52" cy="62" r="3" fill="#E0B90C"/>
    <circle cx="64" cy="68" r="3.4" fill="#E0B90C"/>`),

  خرس: () =>
    svg(`<circle cx="28" cy="30" r="11" fill="#8B5E3C"/><circle cx="72" cy="30" r="11" fill="#8B5E3C"/>
    <circle cx="28" cy="30" r="5" fill="#C08A5E"/><circle cx="72" cy="30" r="5" fill="#C08A5E"/>
    <circle cx="50" cy="52" r="30" fill="#A0692F"/>
    <ellipse cx="50" cy="64" rx="16" ry="12" fill="#D8B08C"/>
    <ellipse cx="50" cy="56" rx="6" ry="4.6" fill="#3A2A1C"/>
    <circle cx="38" cy="44" r="3.6" fill="#2D2A32"/><circle cx="62" cy="44" r="3.6" fill="#2D2A32"/>
    <path d="M50 62 v5 M44 71 q6 5 12 0" fill="none" stroke="#3A2A1C" stroke-width="2.6" stroke-linecap="round"/>`),

  فیل: () =>
    svg(`<ellipse cx="56" cy="54" rx="30" ry="24" fill="#9AA5B1"/>
    <path d="M34 74 v12 M52 76 v10 M70 76 v10 M82 70 v14" stroke="#9AA5B1" stroke-width="10" stroke-linecap="round"/>
    <circle cx="30" cy="44" r="20" fill="#AEB8C2"/>
    <ellipse cx="44" cy="42" rx="12" ry="16" fill="#8A95A1"/>
    <path d="M18 54 q-6 16 2 26 q8 4 10 -6" fill="none" stroke="#AEB8C2" stroke-width="11" stroke-linecap="round"/>
    <circle cx="26" cy="38" r="3.2" fill="#2D2A32"/>`),

  گلابی: () =>
    svg(`<path d="M50 26 c12 0 12 14 8 20 c10 8 14 20 14 28 c0 12 -10 20 -22 20 s-22 -8 -22 -20
      c0 -8 4 -20 14 -28 c-4 -6 -4 -20 8 -20z" fill="#C6D64A" stroke="#93A32B" stroke-width="2.6"/>
    <path d="M50 26 v-12" stroke="#8B5E3C" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 18 q10 -8 18 -6 q-4 10 -16 10z" fill="#4CAF50"/>`),

  پنجره: () =>
    svg(`<rect x="16" y="16" width="68" height="68" rx="5" fill="#BFE6F5" stroke="#8B6F47" stroke-width="6"/>
    <path d="M50 16 v68 M16 50 h68" stroke="#8B6F47" stroke-width="6"/>
    <circle cx="34" cy="32" r="7" fill="#F4B942"/>
    <path d="M60 40 q8 -8 18 -4" fill="none" stroke="#FFF" stroke-width="4" stroke-linecap="round"/>`),

  چای: () =>
    svg(`<path d="M32 30 h36 l-6 44 h-24z" fill="#D9782E" stroke="#A85A1C" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M30 28 h40" stroke="#C9CFD4" stroke-width="6" stroke-linecap="round"/>
    <path d="M22 84 h56" stroke="#C9CFD4" stroke-width="8" stroke-linecap="round"/>
    <path d="M42 20 q6 -6 0 -12 M56 20 q6 -6 0 -12" fill="none" stroke="#B9C6D6" stroke-width="3.4" stroke-linecap="round"/>`),

  صدف: () =>
    svg(`<path d="M50 82 C18 66 14 40 30 26 C40 18 60 18 70 26 C86 40 82 66 50 82z"
      fill="#F5C6C6" stroke="#C98A8A" stroke-width="3" stroke-linejoin="round"/>
    <g fill="none" stroke="#C98A8A" stroke-width="2.6" stroke-linecap="round">
    <path d="M50 80 V26"/><path d="M50 80 L30 30"/><path d="M50 80 L70 30"/>
    <path d="M50 80 L20 44"/><path d="M50 80 L80 44"/></g>`),

  صابون: () =>
    svg(`<rect x="18" y="46" width="58" height="30" rx="12" fill="#8FC7E0" stroke="#5A9BBA" stroke-width="3"/>
    <path d="M26 58 q10 -6 20 0" fill="none" stroke="#FFF" stroke-width="4" stroke-linecap="round"/>
    <circle cx="70" cy="30" r="10" fill="none" stroke="#8FC7E0" stroke-width="3.4"/>
    <circle cx="84" cy="46" r="6" fill="none" stroke="#8FC7E0" stroke-width="3"/>
    <circle cx="56" cy="24" r="6" fill="none" stroke="#8FC7E0" stroke-width="3"/>`),

  شمع: () =>
    svg(`<rect x="38" y="40" width="24" height="46" rx="4" fill="#F5E6C8" stroke="#D9C49A" stroke-width="2.6"/>
    <path d="M42 52 h16 M42 64 h16" stroke="#E4D3AC" stroke-width="3"/>
    <path d="M50 40 v-6" stroke="#6E6A78" stroke-width="3" stroke-linecap="round"/>
    <path d="M50 12 q10 12 0 22 q-10 -10 0 -22z" fill="#F4B942"/>
    <path d="M50 20 q5 7 0 12 q-5 -5 0 -12z" fill="#E4572E"/>`),

  حلزون: () =>
    svg(`<path d="M22 78 q-6 0 -6 -6 q0 -8 12 -8 h10" fill="none" stroke="#C6A76B" stroke-width="11" stroke-linecap="round"/>
    <circle cx="24" cy="56" r="3" fill="#2D2A32"/>
    <path d="M20 50 v-8 M28 50 v-8" stroke="#C6A76B" stroke-width="3" stroke-linecap="round"/>
    <path d="M62 72 a20 20 0 1 0 -18 -20 a13 13 0 1 0 12 12 a7 7 0 1 1 -6 -7"
      fill="none" stroke="#B8863A" stroke-width="9" stroke-linecap="round"/>`),

  حوله: () =>
    svg(`<rect x="18" y="26" width="64" height="52" rx="7" fill="#F5C6C6" stroke="#C98A8A" stroke-width="3"/>
    <path d="M18 40 h64 M18 64 h64" stroke="#FFF" stroke-width="5"/>
    <path d="M18 52 h64" stroke="#C98A8A" stroke-width="3.4"/>
    <path d="M30 26 v52 M70 26 v52" stroke="#E9AFAF" stroke-width="2.4"/>`),

  طوطی: () =>
    svg(`<ellipse cx="46" cy="50" rx="20" ry="24" fill="#4CAF50"/>
    <circle cx="46" cy="30" r="14" fill="#66BB6A"/>
    <path d="M34 28 q-10 3 -8 9 q6 4 10 -2z" fill="#E4572E"/>
    <circle cx="45" cy="27" r="3" fill="#2D2A32"/>
    <path d="M58 56 q18 14 22 30 q-16 -4 -26 -20z" fill="#F4B942"/>
    <path d="M40 74 v10 M52 74 v10" stroke="#B8863A" stroke-width="4" stroke-linecap="round"/>
    <path d="M50 44 q14 6 12 18 q-12 0 -14 -12z" fill="#43A047"/>`),

  قطار: () =>
    svg(`<path d="M46 74 v-30 h30 l10 14 v16z" fill="#E4572E" stroke="#B33E1C" stroke-width="2.6" stroke-linejoin="round"/>
    <rect x="10" y="50" width="30" height="24" rx="4" fill="#2E86AB" stroke="#1B6B8F" stroke-width="2.6"/>
    <rect x="54" y="50" width="14" height="11" rx="2" fill="#BFE6F5"/>
    <rect x="52" y="30" width="9" height="14" rx="2" fill="#B33E1C"/>
    <circle cx="20" cy="80" r="7" fill="#2D2A32"/><circle cx="54" cy="80" r="7" fill="#2D2A32"/>
    <circle cx="76" cy="80" r="7" fill="#2D2A32"/>
    <path d="M6 84 h88" stroke="#8B6F47" stroke-width="4" stroke-linecap="round"/>`),

  چراغ: () =>
    svg(`<path d="M30 46 l10 -22 h20 l10 22z" fill="#E08A1E" stroke="#B36B12" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M50 46 v28" stroke="#7B8794" stroke-width="5"/>
    <path d="M32 84 h36 q0 -10 -18 -10 t-18 10z" fill="#7B8794"/>
    <g stroke="#F4B942" stroke-width="4" stroke-linecap="round">
    <path d="M22 56 l-10 6"/><path d="M78 56 l10 6"/><path d="M50 52 v0"/></g>`),

  مرغ: () =>
    svg(`<ellipse cx="54" cy="58" rx="26" ry="21" fill="#FFF8E7" stroke="#D9CDB5" stroke-width="2.4"/>
    <circle cx="30" cy="38" r="14" fill="#FFF8E7" stroke="#D9CDB5" stroke-width="2.4"/>
    <path d="M22 26 q4 -8 8 -2 q4 -8 8 -2 q3 4 -2 8 q-8 2 -14 -4z" fill="#D14343"/>
    <path d="M17 40 l-10 4 l10 4z" fill="#F07818"/>
    <path d="M26 48 q4 8 8 0" fill="#D14343"/>
    <circle cx="27" cy="35" r="2.8" fill="#2D2A32"/>
    <path d="M56 52 q14 -8 22 4 q-12 10 -22 -4z" fill="#E9DEC6"/>
    <path d="M46 79 v7 M62 79 v7" stroke="#F07818" stroke-width="4" stroke-linecap="round"/>`),

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
    || SITUATIONS[name] || HAZARDS[name] || SAFETY_STEPS[name]
    || PROBLEM_SCENES[name];
  return f ? f() : null;
}

/** آیا برای این نام تصویری هست؟ — برای اعتبارسنجی درس‌ها. */
export function hasPicture(name) {
  return Boolean(
    SHAPES[name] || FACES[name] || SCENES[name]
    || SITUATIONS[name] || HAZARDS[name] || SAFETY_STEPS[name]
    || PROBLEM_SCENES[name],
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

/**
 * صحنهٔ موقعیت‌های مسئله — برای گِرد problem-solve.
 *
 * ⚠ چرا این هشت شکل لازم شد: گِرد problem-solve تصویری برای
 * موقعیت‌هایش نداشت و از شکل‌های موجود قرض می‌گرفت. نتیجه فاجعه
 * بود و هیچ گاردی نمی‌گرفتش، چون شکل «وجود داشت»:
 *
 *   «زخم»    → تصویرِ قرص     (به کودک یاد می‌داد زخم = دارو بخور!)
 *   «تشنگی»  → تصویرِ رودخانه
 *   «خستگی»  → تصویرِ ماه
 *   «خرابی»  → تصویرِ توپِ سالم
 *   «اذیت»   → تصویرِ دست
 *   «گم شدن» → تصویرِ خانه
 *
 * قانون تازه‌ای که از این پیدا شد و در نقشهٔ راه ثبت شد:
 * **تصویر باید خودِ چیز را نشان دهد، نه چیزی که با آن تداعی
 * می‌شود.** «ماه» یعنی ماه، نه خستگی. تداعی کارِ بزرگ‌سالی است؛
 * کودک ۵ ساله تصویر را تحت‌اللفظی می‌خواند.
 */
export const PROBLEM_SCENES = {
  // اسباب‌بازی شکسته — همان توپ، ولی دو تکه و با خط شکست
  'اسباب‌بازی‌شکسته': () =>
    svg(`<path d="M46 26 a28 28 0 0 0 -8 52 l8 -14 l-6 -8 l10 -6 l-6 -10 z"
      fill="#E4572E" stroke="#B33E1C" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M56 26 a28 28 0 0 1 8 52 l-8 -14 l6 -8 l-10 -6 l6 -10 z"
      fill="#D14343" stroke="#B33E1C" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M30 20 l-6 -8 M70 20 l6 -8 M50 16 v-9" stroke="#F4B942" stroke-width="3.4" stroke-linecap="round"/>`),

  // گم شدن — کودکِ تنها میان دو مسیر، با علامت سؤال
  'گم‌شدن': () =>
    svg(`<path d="M8 84 h84" stroke="#C9BFB0" stroke-width="5" stroke-linecap="round"/>
    <path d="M30 84 l10 -30 M70 84 l-10 -30" stroke="#E0D5C4" stroke-width="4" stroke-dasharray="6 6"/>
    <circle cx="50" cy="56" r="11" fill="#F2C6A0" stroke="#D9A87E" stroke-width="2"/>
    <path d="M34 84 q0 -18 16 -18 t16 18 z" fill="#2E86AB"/>
    <circle cx="46" cy="55" r="2" fill="#2D2A32"/><circle cx="54" cy="55" r="2" fill="#2D2A32"/>
    <path d="M46 61 q4 -3 8 0" fill="none" stroke="#B5836A" stroke-width="2" stroke-linecap="round"/>
    <path d="M62 28 q0 -9 8 -9 t8 9 q0 6 -8 8 v4" fill="none" stroke="#E4572E" stroke-width="4.4" stroke-linecap="round"/>
    <circle cx="70" cy="47" r="2.8" fill="#E4572E"/>`),

  // اذیت شدن — دستی که به سوی کودک دراز شده و کودکِ عقب‌کشیده
  اذیت: () =>
    svg(`<circle cx="66" cy="42" r="12" fill="#F5D3B5" stroke="#D9A87E" stroke-width="2"/>
    <path d="M48 86 q0 -22 18 -22 t18 22 z" fill="#3D9A50"/>
    <circle cx="62" cy="41" r="2.2" fill="#2D2A32"/><circle cx="70" cy="41" r="2.2" fill="#2D2A32"/>
    <path d="M61 49 q5 3 10 0" fill="none" stroke="#B5836A" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M40 46 q-10 -4 -16 2 q-4 5 2 8 l12 4" fill="#F2C6A0" stroke="#D9A87E" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M14 30 l8 6 M12 44 h10 M16 58 l8 -5" stroke="#D14343" stroke-width="3.4" stroke-linecap="round"/>`),

  // زخمِ زانو — پا با چسب‌زخم روی زانو (نه قرص!)
  زخم: () =>
    svg(`<path d="M40 12 q14 0 14 16 v22 q0 14 8 22 v14 h-26 v-16 q-10 -10 -10 -26 v-16 q0 -16 14 -16z"
      fill="#F5D3B5" stroke="#D9A87E" stroke-width="2.6" stroke-linejoin="round"/>
    <g transform="rotate(-25 40 46)">
      <rect x="26" y="39" width="28" height="14" rx="7" fill="#F0C89A" stroke="#C9995F" stroke-width="2.4"/>
      <rect x="34" y="41" width="12" height="10" rx="3" fill="#FBEBD6"/>
      <circle cx="37" cy="44" r="1.2" fill="#C9995F"/><circle cx="43" cy="44" r="1.2" fill="#C9995F"/>
      <circle cx="37" cy="49" r="1.2" fill="#C9995F"/><circle cx="43" cy="49" r="1.2" fill="#C9995F"/>
    </g>
    <path d="M62 22 l6 -6 M70 32 h8 M64 44 l7 4" stroke="#D14343" stroke-width="3" stroke-linecap="round"/>`),

  // تشنگی — کودک با لیوانِ خالی و زبانِ بیرون (نه رودخانه!)
  تشنگی: () =>
    svg(`<circle cx="40" cy="38" r="16" fill="#F2C6A0" stroke="#D9A87E" stroke-width="2.4"/>
    <path d="M18 86 q0 -24 22 -24 t22 24 z" fill="#E08A1E"/>
    <circle cx="34" cy="35" r="2.4" fill="#2D2A32"/><circle cx="46" cy="35" r="2.4" fill="#2D2A32"/>
    <path d="M33 45 q7 8 14 0z" fill="#B5535A"/>
    <path d="M38 49 q3 7 6 0z" fill="#D96A72"/>
    <path d="M70 40 h18 l-3 34 h-12 z" fill="none" stroke="#9AC7DC" stroke-width="3" stroke-linejoin="round"/>
    <path d="M74 68 h10 l-1 5 h-8 z" fill="#BFE6F5"/>`),

  // خستگی — کودک با چشمِ بسته و حباب خواب (نه ماه!)
  خستگی: () =>
    svg(`<circle cx="44" cy="44" r="18" fill="#F5D3B5" stroke="#D9A87E" stroke-width="2.4"/>
    <path d="M20 86 q0 -24 24 -24 t24 24 z" fill="#7B4B94"/>
    <path d="M33 42 q6 5 12 0 M49 42 q6 5 12 0" fill="none" stroke="#2D2A32" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M38 55 q6 4 12 0" fill="none" stroke="#B5836A" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M68 34 h10 l-10 12 h10" fill="none" stroke="#6E6A78" stroke-width="3" stroke-linejoin="round"/>
    <path d="M78 16 h8 l-8 10 h8" fill="none" stroke="#9A96A4" stroke-width="2.6" stroke-linejoin="round"/>`),

  // دعوا بر سر اسباب‌بازی — دو دست یک توپ را می‌کشند
  'دعوا‌سر‌بازی': () =>
    svg(`<circle cx="50" cy="50" r="16" fill="#F4B942" stroke="#C9931F" stroke-width="2.6"/>
    <path d="M34 50 q-12 -6 -20 0 q-5 5 1 9 l14 5" fill="#F2C6A0" stroke="#D9A87E" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M66 50 q12 -6 20 0 q5 5 -1 9 l-14 5" fill="#F5D3B5" stroke="#D9A87E" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M50 26 v-10 M36 30 l-6 -8 M64 30 l6 -8" stroke="#D14343" stroke-width="3.4" stroke-linecap="round"/>`),

  // نوبتِ کسی دیگر — دو کودک و یک اسباب‌بازی، یکی منتظر
  'نوبت‌دیگری': () =>
    svg(`<circle cx="28" cy="38" r="12" fill="#F2C6A0" stroke="#D9A87E" stroke-width="2.2"/>
    <path d="M12 86 q0 -20 16 -20 t16 20 z" fill="#2E86AB"/>
    <circle cx="24" cy="37" r="2.2" fill="#2D2A32"/><circle cx="32" cy="37" r="2.2" fill="#2D2A32"/>
    <path d="M23 45 q5 4 10 0" fill="none" stroke="#B5836A" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="72" cy="38" r="12" fill="#F5D3B5" stroke="#D9A87E" stroke-width="2.2"/>
    <path d="M56 86 q0 -20 16 -20 t16 20 z" fill="#3D9A50"/>
    <circle cx="68" cy="37" r="2.2" fill="#2D2A32"/><circle cx="76" cy="37" r="2.2" fill="#2D2A32"/>
    <path d="M67 46 q5 -4 10 0" fill="none" stroke="#B5836A" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="50" cy="70" r="9" fill="#E4572E"/>
    <path d="M50 61 v18" stroke="#fff" stroke-width="2.2"/>`),
};

/** نام همهٔ صحنه‌های مسئله. */
export const PROBLEM_SCENE_NAMES = Object.freeze(Object.keys(PROBLEM_SCENES));

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

// ── افزودهٔ بازبینی احساسات ─────────────────────────────────────────
//
// ⚠ چرا لازم شد: با هفت موقعیت، گِرد «او چه حسی دارد؟» فقط سه پرسش
// متمایز می‌ساخت و چهار پاسخ. کودک بعد از دو بار بازی، *صحنه* را
// حفظ می‌کرد نه *احساس* را — یعنی درست همان چیزی را یاد نمی‌گرفت
// که درس ادعا می‌کرد. حفظِ جفتِ «تصویر ← پاسخ» شبیه یادگیری است و
// در هیچ آزمونی هم قرمز نمی‌شود.
//
// دو احساس («عصبانی» و «متعجب») چهره داشتند ولی هیچ موقعیتی
// نداشتند، یعنی هرگز به‌عنوان پاسخ نمی‌آمدند و فقط بدل بودند.
// حالا هر شش احساس دست‌کم دو موقعیت دارد.
Object.assign(SITUATIONS, {
  // شاد — کیک تولد
  'کیک‌تولد': () =>
    svg(`<path d="M22 54 h56 v26 q0 4 -4 4 h-48 q-4 0 -4 -4z" fill="#F5C6C6" stroke="#C98A8A" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M22 62 q9 6 18 0 q9 6 18 0 q9 6 18 0" fill="none" stroke="#E4572E" stroke-width="3.4"/>
    <rect x="36" y="38" width="6" height="16" rx="2" fill="#8FC7E0"/>
    <rect x="58" y="38" width="6" height="16" rx="2" fill="#C6D64A"/>
    <path d="M39 38 q5 -7 0 -12 q-5 6 0 12z" fill="#F4B942"/>
    <path d="M61 38 q5 -7 0 -12 q-5 6 0 12z" fill="#F4B942"/>`),

  // شاد — دوستِ تازه، دو کودک دست در دست
  // ⚠ نسخهٔ اول: سرها دایره و تن‌ها نیم‌دایره بودند و بینشان فاصله
  // می‌افتاد — دو سرِ شناور روی دو تپه. حالا گردن سر را به تن وصل
  // می‌کند و دست‌ها از شانه بیرون می‌آیند، پس پیکره یکپارچه است.
  // این ایراد در هیچ آزمونی دیده نمی‌شد؛ فقط با نگاه کردن.
  'دوستِ‌تازه': () =>
    svg(`<path d="M13 88 q0 -32 17 -32 t17 32z" fill="#E4572E"/>
    <circle cx="30" cy="34" r="14" fill="#F2C6A0" stroke="#D9A87E" stroke-width="2.2"/>
    <circle cx="26" cy="33" r="2.2" fill="#2D2A32"/><circle cx="34" cy="33" r="2.2" fill="#2D2A32"/>
    <path d="M25 40 q5 5 10 0" fill="none" stroke="#B5836A" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M53 88 q0 -32 17 -32 t17 32z" fill="#3D9A50"/>
    <circle cx="70" cy="34" r="14" fill="#F5D3B5" stroke="#D9A87E" stroke-width="2.2"/>
    <circle cx="66" cy="33" r="2.2" fill="#2D2A32"/><circle cx="74" cy="33" r="2.2" fill="#2D2A32"/>
    <path d="M65 40 q5 5 10 0" fill="none" stroke="#B5836A" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M42 72 q8 -5 16 0" fill="none" stroke="#F2C6A0" stroke-width="7" stroke-linecap="round"/>`),

  // غمگین — بادکنکِ پرواز کرده
  'بادکنک‌رفته': () =>
    svg(`<ellipse cx="66" cy="20" rx="13" ry="16" fill="#E4572E"/>
    <path d="M66 36 l-4 5 h8z" fill="#C8431F"/>
    <path d="M66 41 q-8 12 -4 22 q4 10 -6 16" fill="none" stroke="#B8A98F" stroke-width="2.4"/>
    <path d="M11 88 q0 -30 19 -30 t19 30z" fill="#2E86AB"/>
    <circle cx="30" cy="56" r="14" fill="#F2C6A0" stroke="#D9A87E" stroke-width="2.4"/>
    <circle cx="25" cy="55" r="2.2" fill="#2D2A32"/><circle cx="35" cy="55" r="2.2" fill="#2D2A32"/>
    <path d="M25 66 q5 -5 10 0" fill="none" stroke="#B5836A" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M21 49 q3 -2 6 -1 M33 48 q3 -1 6 1" fill="none" stroke="#B5836A" stroke-width="1.8" stroke-linecap="round"/>
    <!-- ⚠ اشک: نسخهٔ اول یک خطِ کشیده از گوشهٔ چشم بود و روی کارتِ
         کوچک شبیه دماغِ آویزان می‌شد. حالا قطرهٔ جدا و پایین‌تر از
         چشم، با شکلِ اشکِ آشنا. -->
    <path d="M24 61 q-3 5 0 7 q3 -2 0 -7z" fill="#7FB8D8"/>`),

  // غمگین — تنها نشستن، بقیه دورترند
  تنهایی: () =>
    svg(`<path d="M7 88 q0 -30 19 -30 t19 30z" fill="#7B4B94"/>
    <circle cx="26" cy="50" r="14" fill="#F2C6A0" stroke="#D9A87E" stroke-width="2.4"/>
    <circle cx="21" cy="49" r="2.2" fill="#2D2A32"/><circle cx="31" cy="49" r="2.2" fill="#2D2A32"/>
    <path d="M21 60 q5 -5 10 0" fill="none" stroke="#B5836A" stroke-width="2.4" stroke-linecap="round"/>
    <g opacity=".45">
      <circle cx="68" cy="42" r="9" fill="#F5D3B5" stroke="#D9A87E" stroke-width="2"/>
      <path d="M56 74 q0 -16 12 -16 t12 16z" fill="#3D9A50"/>
      <circle cx="86" cy="46" r="8" fill="#F2C6A0" stroke="#D9A87E" stroke-width="2"/>
      <path d="M76 74 q0 -14 10 -14 t10 14z" fill="#E08A1E"/>
    </g>`),

  // عصبانی — برجِ بازی که کسی خرابش کرده و دستِ مقصر
  'خط‌روی‌نقاشی': () =>
    svg(`<rect x="18" y="18" width="64" height="58" rx="5" fill="#FFF" stroke="#C9BFB0" stroke-width="3"/>
    <circle cx="40" cy="38" r="9" fill="#F4B942"/>
    <path d="M26 66 l12 -16 l10 12 l8 -9 l12 13z" fill="#7DBB5B"/>
    <path d="M22 24 L78 70 M78 24 L22 70" stroke="#D14343" stroke-width="6" stroke-linecap="round"/>`),

  // عصبانی — کسی در صف جلو زده
  // ⚠ نسخهٔ اول سه سرِ شناور روی سه تپه بود و «صف» خوانده نمی‌شد.
  // حالا هر پیکره گردن دارد، و خطِ زمین با فلشِ جهتِ صف نشان
  // می‌دهد کجا جلو است — بی آن، «جلو زدن» معنا نداشت.
  // نفرِ سوم *بالاتر و جلوتر* ایستاده و بین دو نفر اول چپیده — همین
  // همپوشانی است که «جلو زدن» را می‌رساند، نه فلشِ روی زمین که در
  // اندازهٔ کارت اصلاً دیده نمی‌شد.
  'صف‌شکنی': () =>
    svg(`<path d="M6 88 h88" stroke="#C9BFB0" stroke-width="4" stroke-linecap="round"/>
    <path d="M10 86 q0 -26 14 -26 t14 26z" fill="#2E86AB"/>
    <circle cx="24" cy="44" r="11" fill="#F2C6A0" stroke="#D9A87E" stroke-width="2"/>
    <circle cx="21" cy="43" r="1.9" fill="#2D2A32"/><circle cx="27" cy="43" r="1.9" fill="#2D2A32"/>
    <path d="M20 51 q4 4 8 0" fill="none" stroke="#B5836A" stroke-width="2" stroke-linecap="round"/>
    <path d="M62 86 q0 -26 14 -26 t14 26z" fill="#E08A1E"/>
    <circle cx="76" cy="44" r="11" fill="#F5D3B5" stroke="#D9A87E" stroke-width="2"/>
    <circle cx="73" cy="43" r="1.9" fill="#2D2A32"/><circle cx="79" cy="43" r="1.9" fill="#2D2A32"/>
    <path d="M72 52 q4 3 8 0" fill="none" stroke="#B5836A" stroke-width="2" stroke-linecap="round"/>
    <path d="M34 86 q0 -32 16 -32 t16 32z" fill="#D14343"/>
    <circle cx="50" cy="34" r="13" fill="#F2C6A0" stroke="#D9A87E" stroke-width="2.2"/>
    <circle cx="46" cy="33" r="2.1" fill="#2D2A32"/><circle cx="54" cy="33" r="2.1" fill="#2D2A32"/>
    <path d="M45 42 q5 -4 10 0" fill="none" stroke="#B5836A" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M36 14 l-5 7 M50 10 v8 M64 14 l5 7" stroke="#D14343" stroke-width="3.4" stroke-linecap="round"/>`),

  // ترسیده — سگِ بزرگِ پارس‌کننده
  'سگ‌بزرگ': () =>
    svg(`<ellipse cx="58" cy="56" rx="26" ry="20" fill="#8B5E3C"/>
    <circle cx="30" cy="42" r="16" fill="#A0692F"/>
    <path d="M18 30 q-6 -12 2 -12 q6 1 8 10z" fill="#6B4423"/>
    <path d="M42 30 q6 -12 -2 -12 q-6 1 -8 10z" fill="#6B4423"/>
    <circle cx="25" cy="40" r="2.6" fill="#2D2A32"/><circle cx="35" cy="40" r="2.6" fill="#2D2A32"/>
    <!-- ⚠ نسخهٔ اول: مستطیلِ سفیدِ دندان دقیقاً زیر بینی می‌نشست و
         شبیه پوزبندِ سفید می‌شد، نه دهانِ باز. حالا دهان یک شکلِ
         تیرهٔ باز است و دندان‌ها مثلث‌های کوچکِ بالای آن — همان
         نشانه‌ای که کودک «پارس» می‌خواند. -->
    <ellipse cx="30" cy="47" rx="5" ry="4" fill="#3A2A1C"/>
    <path d="M21 53 q9 12 18 0 q-9 4 -18 0z" fill="#5C2E2E" stroke="#3A2A1C" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M24 54 l2 4 l2 -4z M32 54 l2 4 l2 -4z" fill="#FFF"/>
    <path d="M26 61 q4 3 8 0" fill="#C4626B"/>
    <path d="M46 76 v10 M62 76 v10 M78 74 v12" stroke="#8B5E3C" stroke-width="8" stroke-linecap="round"/>
    <path d="M84 40 q10 -6 12 -14" fill="none" stroke="#8B5E3C" stroke-width="7" stroke-linecap="round"/>`),

  // ترسیده — بلندی، ایستادن لب پله
  بلندی: () =>
    svg(`<path d="M6 86 h30 v-18 h20 v-18 h20 v-18 h18" fill="none" stroke="#C9BFB0" stroke-width="6" stroke-linejoin="round"/>
    <path d="M4 84 q0 -28 17 -28 t17 28z" fill="#5C6BC0"/>
    <circle cx="21" cy="44" r="13" fill="#F2C6A0" stroke="#D9A87E" stroke-width="2.2"/>
    <circle cx="17" cy="43" r="2.4" fill="#2D2A32"/><circle cx="25" cy="43" r="2.4" fill="#2D2A32"/>
    <ellipse cx="21" cy="52" rx="4" ry="3.4" fill="#B5535A"/>
    <path d="M36 30 v-8 M46 34 l4 -7" stroke="#9AA5B1" stroke-width="3" stroke-linecap="round"/>`),

  // متعجب — جعبه‌ای که چیزی از آن بیرون پریده
  'جعبهٔ‌شگفتی': () =>
    svg(`<rect x="24" y="52" width="52" height="32" rx="5" fill="#2E86AB" stroke="#1B6B8F" stroke-width="2.6"/>
    <path d="M20 52 h60 l-8 -10 h-44z" fill="#8FC7E0" stroke="#1B6B8F" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M50 42 q-4 -10 4 -14 q-8 -4 -4 -12" fill="none" stroke="#F4B942" stroke-width="5" stroke-linecap="round"/>
    <circle cx="52" cy="14" r="10" fill="#E4572E"/>
    <circle cx="48" cy="12" r="1.8" fill="#FFF"/><circle cx="56" cy="12" r="1.8" fill="#FFF"/>
    <path d="M14 34 l-7 -6 M86 34 l7 -6 M50 6 v-5" stroke="#F4B942" stroke-width="3.4" stroke-linecap="round"/>`),

  // متعجب — رنگین‌کمانِ ناگهانی
  'رنگین‌کمان': () =>
    svg(`<path d="M12 78 a38 38 0 0 1 76 0" fill="none" stroke="#E4572E" stroke-width="8"/>
    <path d="M20 78 a30 30 0 0 1 60 0" fill="none" stroke="#F4B942" stroke-width="8"/>
    <path d="M28 78 a22 22 0 0 1 44 0" fill="none" stroke="#3D9A50" stroke-width="8"/>
    <path d="M36 78 a14 14 0 0 1 28 0" fill="none" stroke="#2E86AB" stroke-width="8"/>
    <path d="M8 84 h84" stroke="#C9BFB0" stroke-width="4" stroke-linecap="round"/>`),

  // خسته — بعد از دویدنِ زیاد
  'دویدنِ‌زیاد': () =>
    svg(`<path d="M25 88 q0 -34 21 -34 t21 34z" fill="#E4572E"/>
    <circle cx="46" cy="36" r="15" fill="#F2C6A0" stroke="#D9A87E" stroke-width="2.4"/>
    <path d="M39 34 q6 5 12 0" fill="none" stroke="#2D2A32" stroke-width="2.6" stroke-linecap="round"/>
    <ellipse cx="46" cy="45" rx="5" ry="4" fill="#B5535A"/>
    <path d="M28 20 q4 -8 -1 -12 M62 22 q5 -7 1 -12" fill="none" stroke="#8FC7E0" stroke-width="3" stroke-linecap="round"/>
    <path d="M14 44 h10 M12 56 h12 M76 44 h10 M74 56 h12" stroke="#C9BFB0" stroke-width="3" stroke-linecap="round"/>`),

  // آرام — کنارِ دریا
  'کنارِ‌دریا': () =>
    svg(`<circle cx="74" cy="24" r="12" fill="#F4B942"/>
    <path d="M0 56 h100 v34 h-100z" fill="#8FC7E0"/>
    <path d="M0 56 q14 -6 26 0 t26 0 t26 0 t26 0" fill="none" stroke="#5A9BBA" stroke-width="3"/>
    <path d="M6 70 q14 -5 26 0 M50 78 q14 -5 26 0" fill="none" stroke="#BFE6F5" stroke-width="3" stroke-linecap="round"/>
    <path d="M0 56 h100" stroke="#E4D3AC" stroke-width="0"/>
    <path d="M0 50 h100 v6 h-100z" fill="#EFE0C4"/>`),
});

/** نام همهٔ موقعیت‌ها، خطرها و گام‌های ایمنی. */
export const SITUATION_NAMES = Object.freeze(Object.keys(SITUATIONS));
export const HAZARD_NAMES = Object.freeze(Object.keys(HAZARDS));
export const SAFETY_STEP_NAMES = Object.freeze(Object.keys(SAFETY_STEPS));

/** دسته‌بندی معنایی — برای بازی «کدام فرق دارد؟». */
export const CATEGORIES = Object.freeze({
  // ⚠ هر افزوده باید هم تصویر داشته باشد و هم کودک ۵ ساله بی‌توضیح
  // بشناسدش. اینها با ۲۶ شکلِ تازهٔ واژگانِ خواندنی گسترده شدند تا
  // «کدام فرق دارد؟» بیست درس پشت سر هم یک استخر را نچرخاند.
  حیوان: [
    'گربه', 'سگ', 'ماهی', 'پرنده', 'خرگوش', 'جوجه', 'گاو', 'پروانه', 'زنبور',
    'لاکپشت', 'خرس', 'فیل', 'مار', 'طوطی', 'مرغ', 'اردک', 'حلزون',
  ],
  میوه: ['سیب', 'موز', 'انار', 'پرتقال', 'گیلاس', 'گلابی', 'توت'],
  طبیعت: ['گل', 'درخت', 'خورشید', 'ماه', 'ابر', 'ستاره', 'کوه', 'رودخانه', 'برف', 'باران', 'صدف'],
  وسیله: [
    'توپ', 'کتاب', 'خانه', 'ماشین', 'چتر', 'ساعت', 'کلید',
    'میز', 'سبد', 'اتو', 'سوت', 'پنجره', 'شانه', 'حوله', 'صابون', 'شمع', 'چراغ', 'قطار', 'کاسه',
  ],
  پوشیدنی: ['کفش', 'کلاه', 'پیراهن'],
});

/**
 * دسته‌بندی دوم — بر پایهٔ ویژگی، نه نوع.
 * همان شکل‌ها از زاویهٔ دیگری دسته می‌شوند؛ این «انعطاف شناختی» است:
 * کودک یاد می‌گیرد یک چیز می‌تواند همزمان عضو چند دسته باشد.
 */
/**
 * شکلِ گزاره‌ایِ هر ویژگی — «X ___ است» یا «X ___ می‌کند».
 *
 * ⚠ چرا جدولِ چهارم لازم شد: TRAIT_PHRASE برای جملهٔ «کدام هم X و هم
 * Y؟» ساخته شده و بی‌فعل است («در آسمان»، «خوردنی»). وقتی گِرد
 * true-false همان را در «X ___ است» گذاشت، جمله شکست: «ماشین چرخ
 * دارد است»، «ستاره در آسمان است» (این یکی درست بود، آن یکی نه).
 * فارسی قاعدهٔ یکنواختی ندارد، پس مثل TRAIT_NEGATIVE صریح می‌نویسیم.
 */
/**
 * شکلِ جمعِ هر ویژگی — «A و B هر دو ___».
 *
 * ⚠ چرا جدول پنجم: چسباندن «اند» به TRAIT_PHRASE با قاعده کار
 * نمی‌کند. «خوردنی» + «اند» می‌شود «خوردنیاند» (نیم‌فاصله لازم
 * دارد) و «پرواز می‌کند» + «اند» می‌شود «پرواز می‌کنداند» (اصلاً
 * غلط است — شکل جمعش «پرواز می‌کنند» است). فارسی برای این کار
 * قاعده ندارد؛ همان درسی که TRAIT_NEGATIVE هم داد.
 */
export const TRAIT_PLURAL = Object.freeze({
  'پرواز می‌کند': 'پرواز می‌کنند',
  'در آب زندگی می‌کند': 'در آب زندگی می‌کنند',
  'در آسمان است': 'در آسمان‌اند',
  'خوردنی است': 'خوردنی‌اند',
  'چرخ دارد': 'چرخ دارند',
  'گیاه است': 'گیاه‌اند',
  'در خانه است': 'در خانه‌اند',
  'جانور است': 'جانورند',
});

export const TRAIT_STATEMENT = Object.freeze({
  'پرواز می‌کند': 'پرواز می‌کند',
  'در آب زندگی می‌کند': 'در آب زندگی می‌کند',
  'در آسمان است': 'در آسمان است',
  'خوردنی است': 'خوردنی است',
  'چرخ دارد': 'چرخ دارد',
  'گیاه است': 'گیاه است',
  'در خانه است': 'در خانه است',
  'جانور است': 'جانور است',
});

export const TRAITS = Object.freeze({
  'پرواز می‌کند': ['پرنده', 'پروانه', 'زنبور', 'طوطی'],
  'در آب زندگی می‌کند': ['ماهی', 'لاکپشت', 'صدف', 'اردک'],
  'در آسمان است': ['خورشید', 'ماه', 'ستاره', 'ابر'],
  // ⚠ «می‌شود خورد» در جملهٔ «کدام مثل این …؟» شکسته می‌شد.
  // همهٔ کلیدها باید در قالبِ «کدام مثل این ___؟» و «کدام ___
  // نیست؟» درست بنشینند — یعنی گزارهٔ کامل و بی‌فعلِ کمکیِ اضافه.
  'خوردنی است': ['سیب', 'موز', 'انار', 'پرتقال', 'گیلاس', 'هویج', 'گلابی', 'توت', 'بادام', 'پنیر', 'نان'],
  // ⚠ با یک عضو، «کدام مثل این چرخ دارد؟» هرگز ساخته نمی‌شد؛ گاردها
  // بی‌صدا ردش می‌کردند و ویژگی عملاً مرده بود.
  'چرخ دارد': ['ماشین', 'قطار'],
  // ⚠ فهرست باید *چند* عضو مشترک با ویژگی‌های دیگر داشته باشد،
  // وگرنه گِرد «هم این هم آن» بیست بار پشت سر هم یک پاسخ می‌دهد.
  // نخست تنها عضو مشترکِ «گیاه» و «خوردنی» هویج بود و همان همیشه
  // پاسخ می‌شد.
  'گیاه است': ['گل', 'درخت', 'هویج', 'گلابی', 'توت', 'دانه', 'برگ'],
  'در خانه است': ['میز', 'کاسه', 'صابون', 'حوله', 'شانه', 'پنجره', 'شمع', 'کلید', 'ساعت', 'اتو'],
  'جانور است': [
    'گربه', 'سگ', 'ماهی', 'پرنده', 'خرگوش', 'جوجه', 'گاو', 'پروانه',
    'زنبور', 'لاکپشت', 'خرس', 'فیل', 'مار', 'طوطی', 'مرغ', 'اردک', 'حلزون', 'کرم',
  ],
});

/**
 * شکلِ منفیِ هر ویژگی — دستی، نه با replace.
 *
 * ⚠ ساختن نفی با زنجیرهٔ String.replace شکننده بود: «در آسمان است»
 * → «در آسمان نیست» درست درمی‌آمد ولی «می‌شود خورد» → جملهٔ شکسته.
 * فارسی قاعدهٔ یکنواختی برای نفی ندارد، پس صریح می‌نویسیم.
 */
export const TRAIT_PHRASE = Object.freeze({
  // شکلی که پس از «کدام هم X است و هم …» می‌نشیند: بدون فعلِ تکراری.
  'پرواز می‌کند': 'پرواز می‌کند',
  'در آب زندگی می‌کند': 'در آب زندگی می‌کند',
  'در آسمان است': 'در آسمان',
  'خوردنی است': 'خوردنی',
  'چرخ دارد': 'چرخ دارد',
  'گیاه است': 'گیاه',
  'در خانه است': 'در خانه',
  'جانور است': 'جانور',
});

export const TRAIT_NEGATIVE = Object.freeze({
  'پرواز می‌کند': 'پرواز نمی‌کند',
  'در آب زندگی می‌کند': 'در آب زندگی نمی‌کند',
  'در آسمان است': 'در آسمان نیست',
  'خوردنی است': 'خوردنی نیست',
  'چرخ دارد': 'چرخ ندارد',
  'گیاه است': 'گیاه نیست',
  'در خانه است': 'در خانه نیست',
  'جانور است': 'جانور نیست',
});

/**
 * اشیای «روزمره» — استخرِ امن برای گزینه‌های نادرست در گِردهای منطق.
 *
 * ⚠ SHAPE_NAMES هر چیزی را که تصویر دارد برمی‌گرداند، از جمله
 * «روی‌آب»، «ته‌آب»، «پیله» و اجزای بدن که فقط داخلِ درس علوم معنا
 * دارند. وقتی اینها به‌عنوان فریب در «کدام مثل این گیاه است؟»
 * می‌آمدند، پرسش بی‌معنا می‌شد. اینجا فقط چیزهایی می‌آیند که کودک
 * بیرون از هر درسی می‌شناسد.
 */
export const EVERYDAY_NAMES = Object.freeze(
  [
    ...CATEGORIES.حیوان,
    ...CATEGORIES.میوه,
    ...CATEGORIES.طبیعت,
    ...CATEGORIES.وسیله,
    ...CATEGORIES.پوشیدنی,
    'نان',
    'مداد',
  ].filter((x) => x in SHAPES),
);
