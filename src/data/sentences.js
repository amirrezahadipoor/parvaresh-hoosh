// موتور جمله‌سازی — جمله‌های خواندنی از واژه‌های آموخته‌شده.
//
// چرا این فایل لازم شد:
// تا اینجا بزرگ‌ترین واحدی که کودک می‌خواند «کلمه» بود. ولی خواندن
// یعنی رسیدن به معنا، و معنا در جمله ساخته می‌شود نه در کلمهٔ تنها.
// این فایل پل میان کلمه‌خوانی و درک مطلب است.
//
// ── منابع ─────────────────────────────────────────────────────────
// • ساختار جملهٔ فارسی: نهاد + (مفعول) + فعل — فعل همیشه آخر است.
//   جملهٔ دوجزئی «فاعل + فعل ناگذر» ساده‌ترین شکل ممکن است و همان
//   چیزی است که کتاب فارسی اول با «اسد آمد.» شروع می‌کند.
// • FCRR (مرکز پژوهش خواندن فلوریدا)، فعالیت Sentence-Picture Match:
//   ⚠ نکتهٔ حیاتی — بدل‌ها باید با پاسخ **واژهٔ مشترک** داشته باشند،
//   وگرنه کودک از روی واژهٔ اول حدس می‌زند و کل جمله را نمی‌خواند.
//   این تنها چیزی است که تعیین می‌کند تمرین واقعاً «خواندن» باشد.
// • K5 Learning / IXL کودکستان: سه تمرین پایه در سطح جمله —
//   تطبیق جمله با تصویر، مرتب کردن واژه‌های درهم، و پرسش «چه کسی؟».
//
// ── قید سخت ───────────────────────────────────────────────────────
// هر واژه‌ای که در جمله می‌آید باید با نشانه‌های آموخته‌شده تا آن درس
// خواندنی باشد. رتبهٔ جمله = بیشترین رتبهٔ نشانه در همهٔ واژه‌هایش.

import { teachRank } from './neshaneh.js';

// حرکت‌ها و نیم‌فاصله در سنجش خواندنی‌بودن شمرده نمی‌شوند.
const SKIP_CHARS = new Set(['آ', 'ء', 'ٔ', '\u200c', 'ـ', 'َ', 'ِ', 'ُ', 'ّ', 'ْ']);

/** بیشترین رتبهٔ نشانه در یک رشته — یعنی زودترین درسی که خواندنی می‌شود. */
export function rankOf(text) {
  const ranks = [...text]
    .filter((ch) => !SKIP_CHARS.has(ch) && ch !== ' ')
    .map((ch) => {
      const r = teachRank(ch);
      return r === 999 ? 0 : r;
    });
  return ranks.length ? Math.max(...ranks) : 0;
}

/**
 * فعل‌های ناگذر — جملهٔ دوجزئی «نهاد + فعل» می‌سازند.
 * فقط فعل‌هایی آمده‌اند که کودک ۵ ساله معنایشان را از تصویر بفهمد.
 * `subjects` مشخص می‌کند چه نهادی با این فعل جور درمی‌آید: هیچ‌کس
 * نمی‌گوید «سنگ خوابید».
 */
export const INTRANSITIVE = Object.freeze([
  { verb: 'آمد', kinds: ['animal', 'flyer', 'swimmer', 'crawler'] },
  { verb: 'دوید', kinds: ['animal'] },
  { verb: 'خزید', kinds: ['crawler'] },
  { verb: 'خوابید', kinds: ['animal', 'crawler'] },
  { verb: 'پرید', kinds: ['flyer'] },
  { verb: 'نشست', kinds: ['animal', 'flyer'] },
  { verb: 'رشد کرد', kinds: ['plant'] },
]);

/**
 * نهادها با دستهٔ معنایی‌شان و رتبهٔ نشانه.
 * `kind` تعیین می‌کند چه فعلی می‌تواند بگیرد — این همان چیزی است که
 * جلوی جمله‌های بی‌معنا («کوه دوید») را می‌گیرد.
 */
export const SUBJECTS = Object.freeze([
  // ⚠ ماهی دستهٔ جدا دارد: «ماهی دوید» و «ماهی نشست» جملهٔ بی‌معنایی
  // است که موتور بی‌سروصدا می‌ساخت. دستهٔ معنایی فقط برای زیبایی
  // نیست — تنها چیزی است که جلوی جملهٔ نادرست را می‌گیرد.
  { word: 'ماهی', kind: 'swimmer', pic: 'ماهی' },
  { word: 'سگ', kind: 'animal', pic: 'سگ' },
  { word: 'گربه', kind: 'animal', pic: 'گربه' },
  { word: 'خرگوش', kind: 'animal', pic: 'خرگوش' },
  { word: 'جوجه', kind: 'animal', pic: 'جوجه' },
  { word: 'پرنده', kind: 'flyer', pic: 'پرنده' },
  { word: 'پروانه', kind: 'flyer', pic: 'پروانه' },
  { word: 'درخت', kind: 'plant', pic: 'درخت' },
  { word: 'گل', kind: 'plant', pic: 'گل' },
  { word: 'گاو', kind: 'animal', pic: 'گاو' },
  { word: 'زنبور', kind: 'flyer', pic: 'زنبور' },
  // ⚠ «کرم دوید» و «لاکپشت دوید» غلط بود. دویدن فعلِ جانورِ تندپاست؛
  // این دو می‌خزند. یک دستهٔ معنایی تازه ارزانش را دارد.
  { word: 'لاکپشت', kind: 'crawler', pic: 'لاکپشت' },
  { word: 'کرم', kind: 'crawler', pic: 'کرم' },
  { word: 'دانه', kind: 'plant', pic: 'دانه' },
]);

/**
 * جمله‌های سه‌جزئی «نهاد + مفعول + فعل».
 * هر تركيب باید در جهان واقعی درست باشد و تصویرش موجود.
 */
export const ACTIONS = Object.freeze([
  { subject: 'خرگوش', object: 'هویج', verb: 'خورد', subPic: 'خرگوش', objPic: 'هویج' },
  { subject: 'گربه', object: 'ماهی', verb: 'خورد', subPic: 'گربه', objPic: 'ماهی' },
  { subject: 'جوجه', object: 'دانه', verb: 'خورد', subPic: 'جوجه', objPic: 'دانه' },
  { subject: 'پروانه', object: 'گل', verb: 'دید', subPic: 'پروانه', objPic: 'گل' },
  { subject: 'سگ', object: 'توپ', verb: 'دید', subPic: 'سگ', objPic: 'توپ' },
  { subject: 'پرنده', object: 'برگ', verb: 'برد', subPic: 'پرنده', objPic: 'برگ' },
  { subject: 'گاو', object: 'برگ', verb: 'خورد', subPic: 'گاو', objPic: 'برگ' },
  { subject: 'زنبور', object: 'گل', verb: 'دید', subPic: 'زنبور', objPic: 'گل' },
  { subject: 'پرنده', object: 'کرم', verb: 'خورد', subPic: 'پرنده', objPic: 'کرم' },
  { subject: 'خرگوش', object: 'برگ', verb: 'خورد', subPic: 'خرگوش', objPic: 'برگ' },
  { subject: 'گربه', object: 'توپ', verb: 'دید', subPic: 'گربه', objPic: 'توپ' },
  { subject: 'کرم', object: 'برگ', verb: 'خورد', subPic: 'کرم', objPic: 'برگ' },
  { subject: 'جوجه', object: 'کرم', verb: 'دید', subPic: 'جوجه', objPic: 'کرم' },
  { subject: 'ماهی', object: 'دانه', verb: 'خورد', subPic: 'ماهی', objPic: 'دانه' },
  { subject: 'سگ', object: 'گربه', verb: 'دید', subPic: 'سگ', objPic: 'گربه' },
]);

/**
 * همهٔ جمله‌های دوجزئی ممکن، با رتبهٔ خواندنی‌بودن.
 * ساخت در زمان بارگذاری، نه در زمان اجرا: فهرست کوچک است و
 * ساختن دوباره‌اش در هر گِرد اتلاف است.
 */
function buildTwoPart() {
  const out = [];
  for (const s of SUBJECTS) {
    for (const v of INTRANSITIVE) {
      if (!v.kinds.includes(s.kind)) continue;
      const text = `${s.word} ${v.verb}`;
      out.push({
        text,
        subject: s.word,
        verb: v.verb,
        pic: s.pic,
        rank: rankOf(text),
        parts: [s.word, v.verb],
      });
    }
  }
  return Object.freeze(out);
}

function buildThreePart() {
  return Object.freeze(
    ACTIONS.map((a) => {
      const text = `${a.subject} ${a.object} ${a.verb}`;
      return {
        text,
        subject: a.subject,
        object: a.object,
        verb: a.verb,
        pic: a.subPic,
        objPic: a.objPic,
        rank: rankOf(text),
        parts: [a.subject, a.object, a.verb],
      };
    }),
  );
}

export const TWO_PART = buildTwoPart();
export const THREE_PART = buildThreePart();
export const ALL_SENTENCES = Object.freeze([...TWO_PART, ...THREE_PART]);

/**
 * جمله‌های خواندنی تا یک رتبهٔ مشخص.
 * @param {object} opts
 * @param {number} opts.maxRank بالاترین رتبهٔ نشانهٔ مجاز
 * @param {number} [opts.parts] ۲ یا ۳ جزئی؛ نبودنش یعنی هر دو
 */
export function pickSentences({ maxRank, parts }) {
  let pool = ALL_SENTENCES;
  if (parts === 2) pool = TWO_PART;
  if (parts === 3) pool = THREE_PART;
  return pool.filter((s) => s.rank <= maxRank);
}

/**
 * بدل‌های «نزدیک» برای یک جمله — جمله‌هایی که دست‌کم یک واژه با آن
 * مشترک دارند.
 *
 * ⚠ این تابع قلب درستیِ آموزشی این حوزه است. اگر بدل‌ها هیچ واژهٔ
 * مشترکی نداشته باشند، کودک اولین واژه را می‌خواند و بقیه را حدس
 * می‌زند — و ما فکر می‌کنیم دارد جمله می‌خواند. FCRR دقیقاً همین را
 * هشدار می‌دهد: «تصویرها را طوری طراحی کردیم که واژه‌ها تکرار شوند تا
 * دانش‌آموز مجبور شود کل جمله را بخواند».
 */
export function nearMisses(target, pool) {
  const words = new Set(target.parts);
  const shared = pool.filter(
    (s) => s.text !== target.text && s.parts.some((w) => words.has(w)),
  );
  const rest = pool.filter(
    (s) => s.text !== target.text && !s.parts.some((w) => words.has(w)),
  );
  // اول نزدیک‌ها، بعد بقیه — تا اگر نزدیک کم بود، گِرد باز هم ساخته شود.
  return [...shared, ...rest];
}

/**
 * بررسی سلامت داده — مثل auditPhonics در phonics.js.
 * هر جملهٔ سه‌جزئی باید تصویر نهاد و مفعول داشته باشد و هیچ جملهٔ
 * تکراری نباید وجود داشته باشد.
 */
export function auditSentences(hasPicture) {
  const problems = [];
  const seen = new Set();
  for (const s of ALL_SENTENCES) {
    if (seen.has(s.text)) problems.push(`جملهٔ تکراری: ${s.text}`);
    seen.add(s.text);
    if (!hasPicture(s.pic)) problems.push(`تصویر نهاد نیست: ${s.text} (${s.pic})`);
    if (s.objPic && !hasPicture(s.objPic)) {
      problems.push(`تصویر مفعول نیست: ${s.text} (${s.objPic})`);
    }
  }
  return problems;
}
