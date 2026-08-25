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
  // ⚠ «شنا کرد» تنها فعلی است که ماهی و اردک را از هم جدا نمی‌کند
  // ولی هر دو را درست توصیف می‌کند — و پیش از این ماهی فقط یک فعل
  // داشت («آمد»)، یعنی «ماهی» عملاً در جمله‌سازی مرده بود.
  { verb: 'شنا کرد', kinds: ['swimmer'] },
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
  // ── افزودهٔ بخش خواندن ─────────────────────────────────────────
  // با ۲۶ شکلِ تازه، این نهادها هم تصویر گرفتند. تنوعِ جمله مستقیم
  // به تعداد نهادها گره خورده: با ۱۴ نهاد فقط ۳۹ جملهٔ دوجزئی ممکن
  // بود و درس‌های جمله بعد از سومی تکراری می‌شدند.
  { word: 'خرس', kind: 'animal', pic: 'خرس' },
  { word: 'فیل', kind: 'animal', pic: 'فیل' },
  { word: 'مار', kind: 'crawler', pic: 'مار' },
  { word: 'طوطی', kind: 'flyer', pic: 'طوطی' },
  { word: 'مرغ', kind: 'animal', pic: 'مرغ' },
  { word: 'اردک', kind: 'swimmer', pic: 'اردک' },
  { word: 'حلزون', kind: 'crawler', pic: 'حلزون' },
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
  // ── افزودهٔ بخش خواندن ─────────────────────────────────────────
  // هر ترکیب در جهان واقعی درست است و هر دو تصویر موجودند.
  { subject: 'خرس', object: 'ماهی', verb: 'خورد', subPic: 'خرس', objPic: 'ماهی' },
  { subject: 'خرس', object: 'توت', verb: 'خورد', subPic: 'خرس', objPic: 'توت' },
  { subject: 'مرغ', object: 'دانه', verb: 'خورد', subPic: 'مرغ', objPic: 'دانه' },
  { subject: 'مرغ', object: 'کرم', verb: 'دید', subPic: 'مرغ', objPic: 'کرم' },
  { subject: 'اردک', object: 'ماهی', verb: 'دید', subPic: 'اردک', objPic: 'ماهی' },
  { subject: 'اردک', object: 'دانه', verb: 'خورد', subPic: 'اردک', objPic: 'دانه' },
  { subject: 'فیل', object: 'برگ', verb: 'خورد', subPic: 'فیل', objPic: 'برگ' },
  { subject: 'فیل', object: 'درخت', verb: 'دید', subPic: 'فیل', objPic: 'درخت' },
  { subject: 'طوطی', object: 'گلابی', verb: 'خورد', subPic: 'طوطی', objPic: 'گلابی' },
  { subject: 'طوطی', object: 'دانه', verb: 'خورد', subPic: 'طوطی', objPic: 'دانه' },
  { subject: 'حلزون', object: 'برگ', verb: 'خورد', subPic: 'حلزون', objPic: 'برگ' },
  { subject: 'مار', object: 'کرم', verb: 'خورد', subPic: 'مار', objPic: 'کرم' },
  { subject: 'خرگوش', object: 'گلابی', verb: 'خورد', subPic: 'خرگوش', objPic: 'گلابی' },
  { subject: 'گاو', object: 'دانه', verb: 'خورد', subPic: 'گاو', objPic: 'دانه' },
  { subject: 'خرس', object: 'مرغ', verb: 'دید', subPic: 'خرس', objPic: 'مرغ' },
  { subject: 'گربه', object: 'مرغ', verb: 'دید', subPic: 'گربه', objPic: 'مرغ' },
  { subject: 'سگ', object: 'گاو', verb: 'دید', subPic: 'سگ', objPic: 'گاو' },
  { subject: 'پرنده', object: 'توت', verb: 'خورد', subPic: 'پرنده', objPic: 'توت' },
  { subject: 'جوجه', object: 'آب', verb: 'خورد', subPic: 'جوجه', objPic: 'رودخانه' },
  { subject: 'خرگوش', object: 'هویج', verb: 'دید', subPic: 'خرگوش', objPic: 'هویج' },
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
 * پرسش «چه کسی؟ / چه چیزی؟ / چه کار کرد؟» از یک جملهٔ سه‌جزئی.
 *
 * چرا این لایه لازم شد:
 * تا اینجا کودک جمله را به تصویر وصل می‌کرد — یعنی *کل* جمله را
 * می‌فهمید یا نمی‌فهمید. ولی درک مطلب یعنی بتوانی از دلِ جمله یک
 * جزء را بیرون بکشی. FCRR و IXL کودکستان هر دو همین سه پرسش را
 * پایهٔ درک در سطح جمله می‌گذارند، و همین است که خواندنِ ماشینی را
 * از فهمیدن جدا می‌کند.
 *
 * ⚠ پرسش «چه کار کرد؟» عمداً نیامده است: پاسخش فعل است و فعل تصویر
 * ندارد، پس گزینه‌ها واژهٔ خالی می‌شدند. قانون برنامه این است که
 * پرسش را وارونه کنیم، نه اینکه گارد را دور بزنیم.
 */
export const WH_QUESTIONS = Object.freeze([
  { q: 'چه کسی؟', field: 'subject', picField: 'pic' },
  { q: 'چه چیزی؟', field: 'object', picField: 'objPic' },
]);

/**
 * بندهای دوجمله‌ای — نخستین «متن» برنامه.
 *
 * چرا دو جمله و نه یکی:
 * وقتی فقط یک جمله روی صفحه است، کودک می‌تواند بی‌آنکه چیزی در ذهن
 * نگه دارد پاسخ بدهد. با دو جمله باید جملهٔ اول را نگه دارد تا
 * دومی را بخواند — همان چیزی که «خواندنِ متن» را از «خواندنِ جمله»
 * جدا می‌کند (CCSS RL.K.1، بازگفتن رویدادها به ترتیب).
 *
 * قاعدهٔ ساخت: هر دو جمله یک نهاد دارند، پس بند منسجم است و کودک
 * می‌فهمد دربارهٔ *یک* موجود حرف می‌زند.
 */
export function buildPassages(maxRank) {
  const out = [];
  const two = TWO_PART.filter((x) => x.rank <= maxRank);
  const three = THREE_PART.filter((x) => x.rank <= maxRank);
  for (const a of two) {
    // جملهٔ دوم دربارهٔ همان نهاد، ولی کارِ دیگری.
    const b = three.find((x) => x.subject === a.subject);
    if (!b) continue;
    out.push({
      subject: a.subject,
      pic: a.pic,
      objPic: b.objPic,
      object: b.object,
      verb: b.verb,
      firstVerb: a.verb,
      lines: [a.text, b.text],
      text: `${a.text}. ${b.text}.`,
      rank: Math.max(a.rank, b.rank),
    });
  }
  // یک بند برای هر نهاد کافی است؛ بیشترش تکرار است.
  const seen = new Set();
  return out.filter((x) => {
    if (seen.has(x.subject)) return false;
    seen.add(x.subject);
    return true;
  });
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
