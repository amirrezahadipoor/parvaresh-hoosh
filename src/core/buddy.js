// «هوشی» — شخصیت راهنما.
//
// چرا وجود دارد:
// کودک با یک شخصیت انس می‌گیرد، نه با یک رابط. ولی پژوهش هشدار جدی
// می‌دهد: شخصیت‌های متحرک زیاد «بار شناختی بیرونی» می‌سازند و توجه را
// از هدف درس می‌دزدند (نقد وارد بر Khan Academy Kids).
//
// پس قاعده‌های سختی برای هوشی گذاشته‌ایم:
//   ۱. هرگز همزمان با پرسش حرکت نمی‌کند — فقط در لحظه‌های گذار.
//   ۲. هیچ انیمیشن بی‌پایانی ندارد؛ هر حرکت شروع و پایان دارد.
//   ۳. تمام SVG درون‌خطی است، بدون تصویر بیرونی و بدون کتابخانه.
//   ۴. حالت‌ها کم‌اند و هرکدام معنایی دارند: خنثی، خوشحال، دلگرم‌کننده،
//      متفکر. حالت تزئینی نداریم.
//
// طراحی عمداً ساده است: دایره، دو چشم، یک دهان. کودک این را در
// یک نگاه می‌فهمد و ذهنش درگیر جزئیات نمی‌شود.

/** حالت‌های مجاز. هر حالت باید معنایی داشته باشد. */
export const MOODS = Object.freeze(['neutral', 'happy', 'encourage', 'think', 'wow']);

const FACE = Object.freeze({
  // چشم‌ها: [شعاع، جابه‌جایی عمودی]
  neutral: { eye: 5.5, brow: 0, mouth: 'M38 62 Q50 68 62 62', blush: 0 },
  happy: { eye: 5.5, brow: -2, mouth: 'M36 60 Q50 74 64 60', blush: 0.9 },
  encourage: { eye: 5, brow: -1, mouth: 'M38 63 Q50 69 62 63', blush: 0.5 },
  think: { eye: 4.5, brow: 1, mouth: 'M43 64 h11', blush: 0 },
  // «وای!» — فقط برای لحظه‌های بزرگ (قدمِ گردِ سفر). چشم‌های درشتِ
  // بالا و دهانِ «او»ی کوچک: شگفتیِ شاد، نه ترس (§۷.۱۶ آیتم ۶).
  wow: { eye: 6.2, brow: -3, mouth: 'M43 64 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0', blush: 0.9 },
});

/**
 * SVG هوشی را برمی‌گرداند.
 * @param {'neutral'|'happy'|'encourage'|'think'} mood
 * @param {string} color رنگ حوزه، تا هوشی با درس هماهنگ شود
 */
export function buddy(mood = 'neutral', color = '#E4572E') {
  const f = FACE[mood] || FACE.neutral;
  const eyeY = 48 + f.brow;
  return `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <g class="bd-body">
      <circle cx="50" cy="54" r="34" fill="${color}"/>
      <circle cx="50" cy="54" r="34" fill="#fff" opacity="0.14"/>
      <path d="M50 20 v-8" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="50" cy="10" r="5" fill="#F4B942"/>
      <g class="bd-eyes">
        <circle cx="38" cy="${eyeY}" r="${f.eye}" fill="#2B2A33"/>
        <circle cx="62" cy="${eyeY}" r="${f.eye}" fill="#2B2A33"/>
        <circle cx="39.8" cy="${eyeY - 1.8}" r="1.9" fill="#fff"/>
        <circle cx="63.8" cy="${eyeY - 1.8}" r="1.9" fill="#fff"/>
      </g>
      ${
        f.blush
          ? `<ellipse cx="30" cy="60" rx="6" ry="4" fill="#fff" opacity="${f.blush * 0.4}"/>
             <ellipse cx="70" cy="60" rx="6" ry="4" fill="#fff" opacity="${f.blush * 0.4}"/>`
          : ''
      }
      <path d="${f.mouth}" stroke="#2B2A33" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    </g>
  </svg>`;
}

/**
 * جمله‌های هوشی. کوتاه — چون کودک نمی‌خواند، می‌بیند و می‌شنود.
 * هیچ‌کدام بیش از ۳۰ نویسه نیست تا صفحه شبیه متن نشود (قانون ۱۲).
 */
export const LINES = Object.freeze({
  welcome: ['بزن بریم!', 'آماده‌ای؟', 'شروع کنیم!'],
  correct: ['آفرین!', 'عالی بود!', 'درست گفتی!', 'همینه!'],
  wrong: ['اشکالی نداره', 'دوباره ببین', 'نزدیک بود!'],
  finish: ['کارت عالی بود!', 'چه پیشرفتی!', 'خسته نباشی!'],
});

/** یک جملهٔ قطعی‌نما ولی متنوع؛ بدون تکرار پشت‌سرهم. */
const lastPick = new Map();
export function line(kind) {
  const pool = LINES[kind] || LINES.correct;
  if (pool.length === 1) return pool[0];
  let i = Math.floor(Math.random() * pool.length);
  if (lastPick.get(kind) === i) i = (i + 1) % pool.length;
  lastPick.set(kind, i);
  return pool[i];
}
