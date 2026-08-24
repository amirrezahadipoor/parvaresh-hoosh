// موتور گِرد — یک تعریفِ گِرد را به یک پرسشِ قابل‌بازی تبدیل می‌کند.
//
// تفاوت بنیادی با نسخهٔ قبلی:
// نسخهٔ قبلی عنوان درس را regex می‌کرد و از روی چند کلمه بازی می‌ساخت
// (`titlePlan()`), برای همین درس‌های بدون محتوا هم «کار می‌کردند».
// اینجا هر گِرد باید نوع مشخص و دادهٔ خودش را داشته باشد. نوع ناشناخته
// یعنی خطا — نه حدس زدن.

import { NARRATION } from '../data/narration.js';
import { actionFor } from './task-icon.js';
import { ALPHABET } from '../data/alphabet.js';
import { STAGED_WORDS } from '../data/word-bank.js';
import { teachRank } from '../data/neshaneh.js';
import { pickWords, soundsOf, flatSounds, syllableText, SOUND_MAP } from '../data/phonics.js';
import {
  SHAPES, SHAPE_NAMES, CATEGORIES, TRAITS, TRAIT_NEGATIVE, TRAIT_PHRASE, EVERYDAY_NAMES, COLOR_HEX, GEO,
  FACES, SITUATIONS, HAZARDS, SAFETY_STEPS, SCENES, hasPicture,
} from './svg.js';
import {
  EN_ALPHABET,
  EN_PICTURE_WORDS,
  EN_COLORS,
  EN_NUMBERS,
  CVC_FAMILIES,
  SIGHT_WORDS,
  SIGHT_WORD_FA,
  TRANSLATABLE_SIGHT_WORDS,
} from '../data/english.js';
import {
  LIVING, NON_LIVING, LIFE_CYCLES, SEASONS, SENSES, FLOATS, SINKS,
} from '../data/science-data.js';

const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
export const toFa = (n) => String(n).replace(/\d/g, (d) => faDigits[+d]);

// حرکت‌ها و نیم‌فاصله در سنجش «خواندنی بودن» شمرده نمی‌شوند.
const SKIP_CHARS = new Set(['آ', 'ء', 'ٔ', '\u200c', 'ـ', 'َ', 'ِ', 'ُ', 'ّ', 'ْ']);

const rand = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rand(arr.length)];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** n گزینهٔ یکتا می‌سازد که حتماً شامل پاسخ درست است. */
function buildOptions(answer, pool, count) {
  const opts = new Set([answer]);
  let guard = 0;
  while (opts.size < count && guard++ < 200) {
    const c = pick(pool);
    if (c !== answer && c !== undefined && c !== null) opts.add(c);
  }
  return shuffle([...opts]);
}

// نام شکل‌های SVG که برای شمردن استفاده می‌شوند (به‌جای اموجی، که روی
// هر دستگاه شکل متفاوتی دارد).
const COUNTABLES = ['سیب', 'ستاره', 'ماهی', 'گل', 'توپ', 'موز', 'انار', 'پرنده'];

// ── دانشِ حوزهٔ مهارت زندگی ──────────────────────────────────────────
//
// این جدول‌ها «پاسخ درست» درس‌های مهارت زندگی‌اند و عمداً اینجا و نه
// در فایل درس‌ها نشسته‌اند: هر موقعیت یک پاسخ درست دارد و اگر در
// چند درس تکرار می‌شد، امکان داشت جایی پاسخ متفاوتی بگیرد.
//
// منبع: چارچوب CASEL (خودآگاهی — نام‌گذاری احساس) و راهنمای رسمی
// مهارت زندگی سازمان بهزیستی (ایمنی فردی).

// موقعیت → حسی که کودک در آن موقعیت دارد.
// هر موقعیت باید حسِ بی‌ابهام داشته باشد؛ موقعیت‌های دوپهلو
// («دوستش اسباب‌بازی را گرفت») عمداً نیامده‌اند چون پاسخ درست
// ندارند و کودک را سردرگم می‌کنند.
const SITUATION_FEELING = Object.freeze({
  هدیه: 'شاد',
  'برج‌خراب': 'غمگین',
  'اتاق‌تاریک': 'ترسیده',
  'زانوی‌زخمی': 'غمگین',
  رعدوبرق: 'ترسیده',
  'بستنی‌افتاده': 'غمگین',
  'باغچه‌آرام': 'آرام',
});

// کارهای درستِ بهداشت و مراقبت از خود — همه از فهرست بهداشت فردی
// کودکان: شستن دست، مسواک، دستمال هنگام عطسه، خواب کافی، آب.
const GOOD_HABITS = ['دست‌شستن', 'مسواک', 'دستمال', 'خواب', 'آب‌خوردن', 'زبالهٔ‌درست'];

// کارهای درستِ اجتماعی — از صلاحیت «مهارت‌های ارتباطی» CASEL.
const KIND_ACTS = ['کمک‌کردن', 'نوبت'];

const HAZARD_NAMES_L = Object.keys(HAZARDS);
const FACE_NAMES = Object.keys(FACES);

// چیزهای بی‌خطر که کودک اجازه دارد لمسشان کند — برای درس ایمنی، در
// برابر خطرها. اینها باید آشکارا بی‌خطر باشند تا انتخاب معنا بدهد.
const SAFE_THINGS = ['توپ', 'کتاب', 'سیب', 'گل', 'موز', 'ستاره'];
const GEO_NAMES = Object.keys(GEO);

/**
 * یک گِرد را برای یک ردهٔ سنی مشخص می‌سازد.
 * @param {object} round تعریف گِرد از فایل درس
 * @param {object} track ردهٔ سنی (optionCount, maxNumber, ...)
 * @returns {object} گِرد قابل‌نمایش
 */

// ── لنگر تصویری حروف ────────────────────────────────────────────────────
// هر گِرد باید چیزی برای *دیدن* داشته باشد، وگرنه صفحه شبیه سند می‌شود.
// برای حروفی که شکل متناظر داریم، تصویر واقعی نشان می‌دهیم؛ کودک پیش از
// خواندن، از راه تصویر معنا می‌گیرد (کاهش بار شناختی برای پیش‌خوانا).
const LETTER_PICTURE = Object.freeze({
  'ا': 'انار',
  'ب': 'ابر',
  'د': 'درخت',
  'م': 'ماهی',
  'س': 'سیب',
  'ت': 'توپ',
  'ر': 'درخت',
  'ن': 'خانه',
  'ی': 'ماهی',
  'ز': 'موز',
  'ه': 'ماه',
  'ش': 'خرگوش',
  'ک': 'کتاب',
  'گ': 'گل',
  'پ': 'پرنده',
  'خ': 'خورشید',
  'ف': 'برف',
  'ق': 'قایق',
  'ل': 'گل',
  'ج': 'کاج',
  'و': 'موز',
  'ع': 'شمع',
  'ص': 'قیچی',
  'ح': 'صحرا',
});

/** تصویر مرتبط با حرف، اگر شکلش را داشته باشیم. */
function pictureFor(letter) {
  const name = LETTER_PICTURE[letter];
  return name && SHAPE_NAMES.includes(name) ? name : null;
}

/**
 * هر گِرد را برای کودکِ پیش‌خوان آماده می‌کند.
 *
 * کودک پنج‌ساله خواندن بلد نیست. پیش از این ۶۷٪ گِردها هیچ صدایی
 * نداشتند و تنها راهنمای کودک متنی بود که نمی‌توانست بخواند.
 * اینجا دو چیز به هر گِرد افزوده می‌شود:
 *   speak → اگر کلیپ ضبط‌شده‌ای برای همان پرسش هست، خودکار وصل شود.
 *   action → فعل تمرین، تا رابط نشان تصویری درست را نشان دهد.
 * هیچ‌کدام دستی در ۳۲ نوع گِرد تکرار نمی‌شود؛ یک نقطهٔ خروجی مشترک.
 */
function withCues(built, round) {
  if (!built || typeof built !== 'object') return built;
  if (!built.speak && built.prompt && NARRATION[built.prompt]) {
    built.speak = built.prompt;
  }
  built.action = actionFor(round.kind);
  built.kindName = round.kind;
  return built;
}

// نامِ عدد به‌صورت واژه نوشته می‌شود («یک»، «دو») و کودکِ پیش‌خوان
// نمی‌خواندش. در گِرد «کدام فرق دارد؟» همان تعداد نقطه را نشان می‌دهیم
// تا شمردنی باشد.
const NUM_WORD = { یک: 1, دو: 2, سه: 3, چهار: 4, پنج: 5, شش: 6, هفت: 7, هشت: 8, نه: 9, ده: 10 };

/**
 * استخر واژگان انگلیسی برای یک موضوع.
 *
 * دو نقش جدا دارد و این تفکیک مهم است:
 *  • targets — همیشه فقط از خود موضوع. اگر درس نامش «لباس‌ها» است،
 *    پرسش باید دربارهٔ لباس باشد، وگرنه عنوان درس دروغ می‌شود.
 *  • pool — استخر بدل‌ها. اگر موضوع کوچک‌تر از تعداد گزینه بود
 *    (مثلاً پوشیدنی فقط سه شکل دارد)، بدل از بیرونِ موضوع پر می‌شود.
 *    این هم آموزشی‌تر است: «کدام کفش است» بین کفش و قاشق، تمرین
 *    واقعی‌تری است تا بین سه پوشیدنی.
 */
function enPool(group) {
  if (!group) return { targets: EN_PICTURE_WORDS, pool: EN_PICTURE_WORDS };
  const sub = EN_PICTURE_WORDS.filter((w) => w.group === group);
  if (!sub.length) return { targets: EN_PICTURE_WORDS, pool: EN_PICTURE_WORDS };
  return { targets: sub, pool: EN_PICTURE_WORDS };
}

export function buildRound(round, track) {
  const built = buildRoundInner(round, track);
  // ⚠ چند گِردِ منطق وقتی دادهٔ کافی نیست null برمی‌گردانند (مثلاً
  // ویژگی‌ای که فقط یک عضو تصویردار دارد). null بی‌سروصدا از
  // withCues رد می‌شد و به رابط می‌رسید — یعنی صحنهٔ خالی برای
  // کودک. بهتر است آزمون بترکد تا بازی خراب شود.
  if (!built) {
    throw new Error(`گِرد «${round.kind}» دادهٔ کافی برای ساخت نداشت`);
  }
  return withCues(built, round);
}

function buildRoundInner(round, track) {
  const n = track.optionCount;
  // سقف عدد: کمینهٔ چیزی که درس می‌خواهد و چیزی که سن اجازه می‌دهد.
  const cap = Math.min(round.max ?? track.maxNumber, track.maxNumber);

  switch (round.kind) {
    case 'letter-sound': {
      const pool = ALPHABET.map((a) => a.letter);
      return {
        type: 'choice',
        prompt: round.prompt,
        speak: round.speak,
        // اموجی بلندگو چیزی یاد نمی‌دهد، ولی نشان دادن *خودِ حرف* هم
        // پرسش را بی‌معنا می‌کند: کودک فقط کپی می‌کند. پس تنها تصویرِ
        // کلمه را نشان می‌دهیم — کودک باید از صدا به حرف برسد.
        display: pictureFor(round.answer)
          ? { kind: 'pic-only', icon: pictureFor(round.answer) }
          : null,
        options: buildOptions(round.answer, pool, n).map((v) => ({ label: v, value: v })),
        answer: round.answer,
      };
    }

    // ── انگلیسی ────────────────────────────────────────────────────────
    // هیچ گِرد انگلیسی به صدا وابسته نیست: کلیپ صوتی انگلیسی نداریم و
    // گفتار مصنوعی ممنوع است. آموزش کاملاً دیداری/نوشتاری است.

    case 'en-letter-pic': {
      // کدام تصویر با این حرف انگلیسی شروع می‌شود؟
      const withPic = EN_ALPHABET.filter((a) => a.pic);
      const target = pick(withPic);
      const wrong = withPic.filter((a) => a.upper !== target.upper).map((a) => a.pic);
      return {
        type: 'choice',
        prompt: round.prompt.replace('{L}', target.upper),
        display: { kind: 'text', value: `${target.upper} ${target.lower}` },
        // برچسب انگلیسی زیر تصویر: کودک شکل و واژه را با هم می‌بیند.
        options: buildOptions(target.pic, wrong, n).map((v) => ({
          label: withPic.find((a) => a.pic === v)?.word ?? v,
          value: v,
          pic: v,
          latinLabel: true,
        })),
        answer: target.pic,
      };
    }

    case 'en-word-pic': {
      // تصویر را ببین، واژهٔ انگلیسی درست را انتخاب کن.
      // round.group موضوع را محدود می‌کند (animals / food / …) تا هر درس
      // یک میدان معنایی داشته باشد؛ بدل‌ها هم از همان موضوع می‌آیند و
      // انتخاب واقعاً «کدام حیوان» می‌شود، نه «کدام تصویر».
      const wp = enPool(round.group);
      const target = pick(wp.targets);
      const wrong = wp.pool.filter((w) => w.en !== target.en).map((w) => w.en);
      return {
        type: 'choice',
        prompt: round.prompt,
        display: { kind: 'pic-only', icon: target.pic },
        options: buildOptions(target.en, wrong, n).map((v) => ({ label: v, value: v, latin: true })),
        answer: target.en,
      };
    }

    case 'en-pic-word': {
      // عکسِ گِرد بالا: واژه را ببین، تصویر درست را انتخاب کن.
      const pw = enPool(round.group);
      const target = pick(pw.targets);
      const wrong = pw.pool.filter((w) => w.en !== target.en).map((w) => w.pic);
      return {
        type: 'choice',
        prompt: round.prompt.replace('{w}', target.en),
        display: { kind: 'latin', value: target.en },
        options: buildOptions(target.pic, wrong, n).map((v) => ({
          label: pw.pool.find((w) => w.pic === v)?.en ?? v,
          value: v,
          pic: v,
          latinLabel: true,
        })),
        answer: target.pic,
      };
    }

    case 'en-color': {
      const target = pick(EN_COLORS);
      const wrong = EN_COLORS.filter((c) => c.en !== target.en).map((c) => c.hex);
      return {
        type: 'choice',
        prompt: round.prompt.replace('{w}', target.en),
        display: { kind: 'latin', value: target.en },
        options: buildOptions(target.hex, wrong, n).map((v) => ({
          label: EN_COLORS.find((c) => c.hex === v).fa,
          value: v,
          swatch: v,
        })),
        answer: target.hex,
      };
    }

    case 'en-number': {
      const cap10 = Math.min(cap, 10);
      const target = pick(EN_NUMBERS.slice(0, Math.max(2, cap10)));
      const wrong = EN_NUMBERS.slice(0, Math.max(2, cap10))
        .filter((x) => x.n !== target.n)
        .map((x) => x.n);
      return {
        type: 'choice',
        prompt: round.prompt.replace('{w}', target.en),
        display: { kind: 'latin', value: target.en },
        options: buildOptions(target.n, wrong, n).map((v) => ({
          label: toFa(v),
          value: v,
          dots: v,
        })),
        answer: target.n,
      };
    }

    case 'en-sight-find': {
      // عکسِ گِرد بالا: معنی فارسی را می‌بیند، واژهٔ انگلیسی را پیدا کند.
      // هر دو جهت لازم است — شناختن با تولید یکی نیست.
      const target = pick(TRANSLATABLE_SIGHT_WORDS);
      const wrong = TRANSLATABLE_SIGHT_WORDS.filter(
        (w) => w !== target && SIGHT_WORD_FA[w] !== SIGHT_WORD_FA[target],
      );
      return {
        type: 'choice',
        prompt: round.prompt.replaceAll('{w}', SIGHT_WORD_FA[target]),
        display: { kind: 'text', value: SIGHT_WORD_FA[target] },
        options: buildOptions(target, wrong, n).map((v) => ({
          label: v,
          value: v,
          latin: true,
        })),
        answer: target,
      };
    }

    case 'en-rime-build': {
      // ساختِ واژه: حرف اول را بگذار تا واژه کامل شود.
      // کودک می‌بیند با عوض کردن یک حرف واژهٔ تازه می‌سازد — کشف
      // الگو، نه حفظ کردن. (Herlambang & Hendar: ترکیب پیش از تجزیه.)
      const fam = pick(CVC_FAMILIES.filter((f) => f.words.some((w) => w.length === 3)));
      const target = pick(fam.words.filter((w) => w.length === 3));
      const first = target[0];
      // حرف‌های نادرست باید واژهٔ واقعیِ همان خانواده نسازند، وگرنه
      // دو گزینه هر دو درست‌اند و کودک به‌ناحق «اشتباه» می‌شود.
      const realFirsts = new Set(fam.words.map((w) => w[0]));
      const pool = 'bcdfghjklmnprstvwz'.split('').filter((c) => !realFirsts.has(c));
      return {
        type: 'choice',
        prompt: round.prompt.replaceAll('{r}', `-${fam.rime}`),
        display: { kind: 'latin', value: `_${fam.rime}` },
        options: buildOptions(first, pool, n).map((v) => ({
          label: v,
          value: v,
          latin: true,
        })),
        answer: first,
      };
    }

    // ── علوم: واحدهای استاندارد پیش‌دبستان ─────────────────────────

    case 'living': {
      // زنده یا غیرزنده؟
      // ⚠ اشتباه رایج کودک ۵ ساله: «حرکت می‌کند پس زنده است» — ماشین
      // را زنده می‌داند. برای همین در گزینه‌های نادرست عمداً چیزهای
      // متحرک/آشنا می‌آید تا درس همان بدفهمی را هدف بگیرد.
      const wantLiving = round.want !== 'non';
      const from = wantLiving ? LIVING : NON_LIVING;
      const other = wantLiving ? NON_LIVING : LIVING;
      const target = pick(from);
      return {
        type: 'choice',
        prompt: round.prompt,
        // «زنده» تصویرِ یگانه ندارد؛ هر نمونه‌ای که در صحنه بگذاریم
        // یا پاسخ را لو می‌دهد یا گمراه می‌کند. پس صحنه خالی می‌ماند و
        // خودِ گزینه‌ها تصویری‌اند — مثل گِرد category که همین کار را
        // می‌کند. نقشکِ کار بالای پرسش نشان می‌دهد باید یکی را برگزیند.
        display: null,
        options: buildOptions(target, other.filter((x) => x !== target), n).map((v) => ({
          label: v,
          value: v,
          pic: v,
        })),
        answer: target,
      };
    }

    case 'life-cycle': {
      // چرخهٔ زندگی را به ترتیب بچین. خودِ ترتیب همان مفهوم است،
      // پس این گِرد از نوع order است نه choice.
      const cyc = round.cycle
        ? LIFE_CYCLES.find((c) => c.id === round.cycle)
        : pick(LIFE_CYCLES);
      const steps = cyc.steps;
      const mixed = shuffle(steps.map((name, i) => ({ name, order: i + 1 })));
      return {
        type: 'order',
        prompt: round.prompt.replaceAll('{c}', cyc.title),
        items: mixed.map((m) => ({ label: m.name, value: m.order, scale: 1, pic: m.name })),
        answer: steps.map((_, i) => i + 1),
      };
    }

    case 'life-cycle-next': {
      // مرحلهٔ بعدی چیست؟ — سبک‌تر از چیدن کل چرخه، برای سن پایین‌تر.
      const cyc = pick(LIFE_CYCLES);
      const i = rand(0, cyc.steps.length - 2);
      const shown = cyc.steps[i];
      const answer = cyc.steps[i + 1];
      // ⚠ «تخم» هم سرِ چرخهٔ پروانه است هم چرخهٔ جوجه. اگر تخم نشان
      // داده شود و «جوجه» هم گزینه باشد، کودکی که جوجه را انتخاب
      // می‌کند **درست** گفته ولی «اشتباه» می‌شود. پس هر مرحله‌ای که
      // در چرخهٔ دیگری هم بعد از همین تصویر می‌آید باید از گزینه‌های
      // نادرست حذف شود.
      const alsoValid = new Set(
        LIFE_CYCLES.flatMap((c) => {
          const k = c.steps.indexOf(shown);
          return k >= 0 && k < c.steps.length - 1 ? [c.steps[k + 1]] : [];
        }),
      );
      const wrong = LIFE_CYCLES.flatMap((c) => c.steps).filter(
        (x) => x !== shown && !alsoValid.has(x),
      );
      return {
        type: 'choice',
        prompt: round.prompt,
        display: { kind: 'pic-only', icon: cyc.steps[i] },
        options: buildOptions(answer, [...new Set(wrong)], n).map((v) => ({
          label: v,
          value: v,
          pic: v,
        })),
        answer,
      };
    }

    case 'season': {
      // کدام تصویر به این فصل می‌خورد؟
      const target = pick(SEASONS);
      const wrong = SEASONS.filter((x) => x.name !== target.name).map((x) => x.sign);
      return {
        type: 'choice',
        prompt: round.prompt.replaceAll('{f}', target.name),
        display: { kind: 'pic-only', icon: target.name },
        options: buildOptions(target.sign, wrong, n).map((v) => ({
          label: v,
          value: v,
          pic: v,
        })),
        answer: target.sign,
      };
    }

    case 'sense': {
      // با کدام عضو این را می‌فهمی؟
      const target = pick(SENSES.filter((x) => x.examples.length));
      const thing = pick(target.examples);
      const wrong = SENSES.filter((x) => x.organ !== target.organ).map((x) => x.organ);
      return {
        type: 'choice',
        prompt: round.prompt.replaceAll('{x}', thing),
        display: { kind: 'pic-only', icon: thing },
        options: buildOptions(target.organ, wrong, n).map((v) => ({
          label: v,
          value: v,
          pic: v,
        })),
        answer: target.organ,
      };
    }

    case 'float-sink': {
      // روی آب می‌ماند یا ته می‌رود؟
      // ⚠ درس ادعای قانون نمی‌کند («سنگین غرق می‌شود» غلط است —
      // کشتی سنگین است و شناور می‌ماند). فقط مشاهده را تمرین می‌دهد،
      // و نمونه‌ها عمداً بی‌ابهام‌اند.
      const wantFloat = round.want !== 'sink';
      const from = wantFloat ? FLOATS : SINKS;
      const other = wantFloat ? SINKS : FLOATS;
      const target = pick(from);
      return {
        type: 'choice',
        prompt: round.prompt,
        // تصویرِ صحنه، نه واژه: کودک پیش‌خوان باید ببیند چه پرسیده شده.
        display: { kind: 'pic-only', icon: wantFloat ? 'روی‌آب' : 'ته‌آب' },
        options: buildOptions(target, other, n).map((v) => ({ label: v, value: v, pic: v })),
        answer: target,
      };
    }

    case 'en-cvc': {
      // خانوادهٔ واژگانی: کدام واژه به این خانواده تعلق دارد؟
      // کودک الگو را کشف می‌کند، نه اینکه حفظ کند.
      const fam = pick(CVC_FAMILIES);
      const target = pick(fam.words);
      const others = CVC_FAMILIES.filter((f) => f.rime !== fam.rime).flatMap((f) => f.words);
      return {
        type: 'choice',
        prompt: round.prompt.replace('{r}', `-${fam.rime}`),
        display: { kind: 'latin', value: `_ ${fam.rime}` },
        options: buildOptions(target, others, n).map((v) => ({ label: v, value: v, latin: true })),
        answer: target,
      };
    }

    case 'en-translate': {
      // تطبیق دوزبانه: معنی فارسی واژهٔ انگلیسی.
      const target = pick(TRANSLATABLE_SIGHT_WORDS);
      const wrong = TRANSLATABLE_SIGHT_WORDS.filter((w) => w !== target).map((w) => SIGHT_WORD_FA[w]);
      return {
        type: 'choice',
        prompt: round.prompt.replace('{w}', target),
        display: { kind: 'latin', value: target },
        options: buildOptions(SIGHT_WORD_FA[target], wrong, n).map((v) => ({ label: v, value: v })),
        answer: SIGHT_WORD_FA[target],
      };
    }

    case 'trait': {
      // دسته‌بندی بر پایهٔ ویژگی، نه نوع: «کدام پرواز می‌کند؟»
      // انعطاف شناختی — یک چیز می‌تواند عضو چند دسته باشد.
      const names = Object.keys(TRAITS);
      const trait = pick(names);
      const members = TRAITS[trait];
      const answer = pick(members);
      // فریب از اشیای روزمره، نه از هر شکلی که تصویر دارد.
      const others = EVERYDAY_NAMES.filter((x) => !members.includes(x));
      if (others.length < n - 1) return null;
      return {
        type: 'choice',
        prompt: round.prompt.replace('{t}', trait),
        display: null,
        // برچسب لازم است: در گِردِ منطق نامِ شیء پاسخ را لو نمی‌دهد
        // (پرسش دربارهٔ ویژگی است) ولی نبودش دکمه را بی‌متن می‌کند.
        options: buildOptions(answer, others, n).map((v) => ({ label: v, value: v, pic: v, picLabel: true })),
        answer,
        because: `${answer} ${trait}.`,
      };
    }

    case 'which-group': {
      // عکس گِرد بالا: چیز را می‌بینی، دسته‌اش را بگو.
      const cats = Object.keys(CATEGORIES);
      const cat = pick(cats);
      const item = pick(CATEGORIES[cat]);
      const wrong = cats.filter((c) => c !== cat);
      return {
        type: 'choice',
        prompt: round.prompt,
        display: { kind: 'pic-only', icon: item },
        // نامِ دسته («میوه») خودش تصویر ندارد. اگر فقط واژه بیاید،
        // کودکِ پیش‌خوان نمی‌تواند انتخاب کند. پس هر گزینه یک نمونهٔ
        // تصویری از همان دسته نشان می‌دهد — نمونه‌ای غیر از چیزی که
        // بالای صفحه پرسیده شده، وگرنه پاسخ لو می‌رود.
        options: buildOptions(cat, wrong, n).map((v) => {
          const sample = pick(CATEGORIES[v].filter((x) => x !== item)) || CATEGORIES[v][0];
          return { label: v, value: v, pic: sample, picLabel: true };
        }),
        answer: cat,
        because: `${item} یک ${cat} است.`,
      };
    }

    case 'count-group': {
      // شمردن اعضای یک دسته در میان چیزهای پراکنده — توجه انتخابی.
      const cat = pick(Object.keys(CATEGORIES));
      const members = CATEGORIES[cat];
      const others = SHAPE_NAMES.filter((x) => !members.includes(x));
      const hits = 1 + rand(Math.min(4, members.length));
      const fillers = 2 + rand(3);
      const items = [];
      for (let k = 0; k < hits; k++) items.push(pick(members));
      for (let k = 0; k < fillers; k++) items.push(pick(others));
      // ترتیب قطعی‌شکن ولی درهم
      for (let k = items.length - 1; k > 0; k--) {
        const j = rand(k + 1);
        [items[k], items[j]] = [items[j], items[k]];
      }
      const pool = [1, 2, 3, 4, 5, 6];
      return {
        type: 'choice',
        prompt: round.prompt.replace('{c}', cat),
        display: { kind: 'mixed', items },
        options: buildOptions(hits, pool, n).map((v) => ({ label: toFa(v), value: v })),
        answer: hits,
      };
    }

    case 'subitize': {
      // تشخیص فوری تعداد بدون شمردن — پایهٔ «حس عدد» (IES REL).
      // الگوی تاس/کارت‌نقطه، چون چیدمان آشنا تشخیص را ممکن می‌کند.
      // تا ۵ نقطه در توان بیشتر کودکان است؛ بالاتر باید شمرد.
      const count = 1 + rand(Math.min(5, Math.max(2, cap)));
      const pool = Array.from({ length: Math.min(6, Math.max(3, cap)) }, (_, i) => i + 1);
      return {
        type: 'choice',
        prompt: round.prompt,
        display: { kind: 'dice', times: count },
        options: buildOptions(count, pool, n).map((v) => ({ label: toFa(v), value: v })),
        answer: count,
      };
    }

    case 'ten-frame': {
      // قاب ده‌تایی — ابزار متعارف برای دیدن «چقدر تا ۱۰ مانده».
      // پل میان شمردن و جمع/تفریق.
      const filled = 1 + rand(9);
      const pool = Array.from({ length: 10 }, (_, i) => i + 1);
      const askRemain = round.mode === 'remain';
      const answer = askRemain ? 10 - filled : filled;
      return {
        type: 'choice',
        prompt: round.prompt,
        display: { kind: 'ten-frame', filled },
        options: buildOptions(answer, pool, n).map((v) => ({ label: toFa(v), value: v })),
        answer,
      };
    }

    case 'number-bond': {
      // تجزیهٔ عدد: «۵ می‌شود ۳ و چند؟» — subitizing مفهومی که
      // پژوهش آن را پل به جمع و تفریق می‌داند.
      const total = 3 + rand(Math.min(7, Math.max(3, cap - 2)));
      const part = 1 + rand(total - 1);
      const answer = total - part;
      const pool = Array.from({ length: Math.max(4, total) }, (_, i) => i + 1);
      return {
        type: 'choice',
        prompt: round.prompt.replace('{t}', toFa(total)).replace('{p}', toFa(part)),
        display: { kind: 'bond', total, part },
        options: buildOptions(answer, pool, n).map((v) => ({ label: toFa(v), value: v })),
        answer,
      };
    }


    // ── صداکشی و ترکیب: قلب آموزش خواندن ──────────────────────────
    // تا پیش از این، حوزهٔ خواندن در سطح «شناخت حرف» می‌ماند و کودک
    // هرگز به خواندن نمی‌رسید. این سه نوع آن حلقه را می‌بندند.
    // پژوهش (Herlambang 2020): ترکیب پیش از تجزیه — ۶۶٪ در برابر ۴۷٪.

    case 'blend-word': {
      // صداها را می‌بیند و می‌شنود، واژه را می‌سازد: ب‑آ‑د ← باد
      // ساده‌ترین گام خواندن، و همانی که مدرسه «صداکشی» می‌نامد.
      const limit = teachRank(round.letter ?? 'ا');
      const readable = (w) =>
        [...w].every((ch) => {
          if (SKIP_CHARS.has(ch)) return true;
          const r = teachRank(ch);
          return r === 999 || r <= limit;
        });
      const pool = pickWords({
        maxSounds: round.maxSounds ?? 3,
        maxSyllables: round.maxSyllables ?? 1,
        minSyllables: round.minSyllables ?? 1,
        longVowelOnly: round.longVowelOnly ?? true,
        readable,
      });
      if (!pool.length) return null;
      const target = pick(pool);
      // بدل‌ها: واژه‌هایی با همان تعداد صدا، تا انتخاب واقعاً خواندن بخواهد
      const others = pool.filter((w) => w.word !== target.word).map((w) => w.word);
      if (others.length < n - 1) return null;
      return {
        type: 'choice',
        prompt: round.prompt,
        // صداها جدا نشان داده می‌شوند — کودک باید ترکیبشان کند
        display: { kind: 'sounds', parts: flatSounds(target).map((x) => ({ g: x.g, s: x.s })) },
        options: buildOptions(target.word, [target.word, ...others], n).map((w) => ({
          label: w,
          value: w,
          big: true,
        })),
        answer: target.word,
      };
    }

    case 'segment-count': {
      // واژه را می‌بیند، می‌شمارد چند صدا دارد.
      // این «تجزیه» است و پس از ترکیب می‌آید (ترتیب پژوهش‌محور).
      // مهم: در فارسی مصوت کوتاه نوشته نمی‌شود، پس «سبد» سه حرف
      // دارد ولی پنج صدا — دقیقاً همان چیزی که باید آموخته شود.
      const limit = teachRank(round.letter ?? 'ا');
      const readable = (w) =>
        [...w].every((ch) => {
          if (SKIP_CHARS.has(ch)) return true;
          const r = teachRank(ch);
          return r === 999 || r <= limit;
        });
      const pool = pickWords({ maxSounds: round.maxSounds ?? 5, readable });
      if (!pool.length) return null;
      const target = pick(pool);
      const count = flatSounds(target).length;
      const nums = [2, 3, 4, 5, 6];
      return {
        type: 'choice',
        prompt: round.prompt,
        display: { kind: 'text', value: target.word },
        options: buildOptions(count, nums, n).map((v) => ({ label: toFa(v), value: v })),
        answer: count,
      };
    }

    case 'syllable-build': {
      // بخش‌ها را به ترتیب می‌چیند: ما + دَر ← مادر
      // روش مدرسهٔ ایران: «ما» را بخوان، «دَر» را بخوان، حالا با هم.
      const limit = teachRank(round.letter ?? 'ا');
      const readable = (w) =>
        [...w].every((ch) => {
          if (SKIP_CHARS.has(ch)) return true;
          const r = teachRank(ch);
          return r === 999 || r <= limit;
        });
      const pool = pickWords({ maxSyllables: 3, readable }).filter(
        (w) => w.syllables.length >= 2,
      );
      if (!pool.length) return null;
      const target = pick(pool);
      const parts = target.syllables.map((syl, i) => ({
        label: syllableText(syl),
        value: i,
      }));
      // ⚠ واژهٔ کامل نمایش داده نمی‌شود: اگر «اتو» بالای صفحه باشد،
      // کودک فقط تطبیق شکلی می‌کند و هیچ چیز نمی‌آموزد. همان دام
      // «نشتی پاسخ» که پیش‌تر در letter-sound گرفتیم.
      return {
        type: 'order',
        prompt: round.prompt,
        items: shuffle(parts.map((p) => ({ ...p, scale: 1 }))),
        answer: parts.map((p) => p.value),
      };
    }

    case 'letter-in-word': {
      // «کدام کلمه حرف X را دارد؟» — سخت‌تر از «با X شروع می‌شود»
      // چون کودک باید کل کلمه را بکاود، نه فقط حرف اول.
      const limit = teachRank(round.letter);
      const readable = (w) =>
        [...w].every((ch) => {
          if (SKIP_CHARS.has(ch)) return true;
          const r = teachRank(ch);
          return r === 999 || r <= limit;
        });
      const pool = STAGED_WORDS.filter(readable);
      const withL = pool.filter((w) => w.includes(round.letter));
      const without = pool.filter((w) => !w.includes(round.letter));
      if (!withL.length || without.length < n - 1) return null;
      const answer = pick(withL);
      return {
        type: 'choice',
        prompt: round.prompt,
        display: { kind: 'text', value: round.letter },
        options: buildOptions(answer, without, n).map((v) => ({ label: v, value: v })),
        answer,
      };
    }

    case 'count-letters': {
      // شمردن حرف‌های یک کلمه — پل میان خواندن و ریاضی.
      const limit = teachRank(round.letter ?? 'ا');
      const readable = (w) =>
        [...w].every((ch) => {
          if (SKIP_CHARS.has(ch)) return true;
          const r = teachRank(ch);
          return r === 999 || r <= limit;
        });
      const pool = STAGED_WORDS.filter((w) => readable(w) && w.length >= 2 && w.length <= 6);
      if (!pool.length) return null;
      const word = pick(pool);
      const count = [...word].filter((ch) => !SKIP_CHARS.has(ch)).length;
      const nums = [2, 3, 4, 5, 6, 7];
      return {
        type: 'choice',
        prompt: round.prompt.replace('{w}', word),
        display: { kind: 'text', value: word },
        options: buildOptions(count, nums, n).map((v) => ({ label: toFa(v), value: v })),
        answer: count,
      };
    }

    case 'letter-trace':
      return {
        type: 'trace',
        prompt: round.prompt,
        speak: round.speak,
        letter: round.letter,
      };

    case 'letter-word': {
      // گزینه‌های نادرست هم باید خواندنی باشند: فقط حروفی که تا این درس
      // آموزش داده شده. وگرنه کودک کلمه‌ای می‌بیند که هنوز بلد نیست بخواند.
      const limit = teachRank(round.letter);
      const readable = (w) =>
        [...w].every((ch) => {
          if (SKIP_CHARS.has(ch)) return true;
          const r = teachRank(ch);
          return r === 999 || r <= limit;
        });
      const wrong = STAGED_WORDS.filter((w) => !w.startsWith(round.letter) && readable(w));
      return {
        type: 'choice',
        prompt: round.prompt,
        display: pictureFor(round.letter)
          ? { kind: 'letter-pic', letter: round.letter, icon: pictureFor(round.letter) }
          : { kind: 'text', value: round.letter },
        options: buildOptions(round.answer, wrong, n).map((v) => ({ label: v, value: v })),
        answer: round.answer,
      };
    }

    case 'count-objects': {
      const count = 1 + rand(Math.max(1, cap));
      const icon = pick(COUNTABLES);
      const pool = Array.from({ length: cap }, (_, i) => i + 1);
      return {
        type: 'choice',
        prompt: round.prompt,
        display: { kind: 'repeat', icon, times: count },
        options: buildOptions(count, pool, n).map((v) => ({ label: toFa(v), value: v })),
        answer: count,
      };
    }

    case 'pick-number': {
      const target = 1 + rand(Math.max(1, cap));
      const pool = Array.from({ length: cap }, (_, i) => i + 1);
      return {
        type: 'choice',
        prompt: round.prompt.replace('{n}', toFa(target)),
        // اینجا عمداً هیچ نقطه‌ای نشان نمی‌دهیم: پرسش «کدام عدد ۳ است؟»
        // با سه نقطه روی صحنه، دیگر پرسش نیست — کودک می‌شمارد و کپی
        // می‌کند. صفحهٔ بی‌تصویر بد است، ولی گِردِ بی‌معنا بدتر.
        // به‌جای آن، خودِ گزینه‌ها تصویری می‌شوند.
        display: null,
        options: buildOptions(target, pool, n).map((v) => ({
          label: toFa(v),
          value: v,
          dots: v,
        })),
        answer: target,
      };
    }

    case 'next-number': {
      const base = 1 + rand(Math.max(1, cap - 1));
      const answer = base + 1;
      const pool = Array.from({ length: cap }, (_, i) => i + 1);
      return {
        type: 'choice',
        prompt: round.prompt.replace('{n}', toFa(base)),
        display: { kind: 'text', value: toFa(base) },
        options: buildOptions(answer, pool, n).map((v) => ({ label: toFa(v), value: v })),
        answer,
      };
    }

    case 'compare-groups': {
      const icon = pick(COUNTABLES);
      let a = 1 + rand(cap);
      let b = 1 + rand(cap);
      while (a === b) b = 1 + rand(cap);
      const answer = round.mode === 'less' ? Math.min(a, b) : Math.max(a, b);
      return {
        type: 'choice',
        prompt: round.prompt,
        display: null,
        layout: 'groups',
        options: shuffle([a, b]).map((v) => ({
          // برچسب متنی برای دسترس‌پذیری و آزمون‌ها لازم است، حتی وقتی
          // نمایشِ دیداری گروهی از شکل‌هاست.
          label: toFa(v),
          shapeRepeat: { icon, times: v },
          value: v,
        })),
        answer,
      };
    }

    case 'compare-numbers': {
      let a = 1 + rand(cap);
      let b = 1 + rand(cap);
      while (a === b) b = 1 + rand(cap);
      const answer = round.mode === 'less' ? Math.min(a, b) : Math.max(a, b);
      return {
        type: 'choice',
        prompt: round.prompt,
        display: null,
        options: shuffle([a, b]).map((v) => ({ label: toFa(v), value: v, big: true })),
        answer,
      };
    }

    case 'add': {
      const a = 1 + rand(Math.max(1, Math.floor(cap / 2)));
      const b = 1 + rand(Math.max(1, Math.floor(cap / 2)));
      const answer = a + b;
      const pool = Array.from({ length: cap + 2 }, (_, i) => i + 1);
      return {
        type: 'choice',
        prompt: round.prompt.replace('{a}', toFa(a)).replace('{b}', toFa(b)),
        display: { kind: 'text', value: `${toFa(a)} + ${toFa(b)}` },
        options: buildOptions(answer, pool, n).map((v) => ({ label: toFa(v), value: v })),
        answer,
      };
    }

    case 'sub': {
      const a = 2 + rand(Math.max(1, cap - 1));
      const b = 1 + rand(a - 1);
      const answer = a - b;
      const pool = Array.from({ length: cap }, (_, i) => i);
      return {
        type: 'choice',
        prompt: round.prompt.replace('{a}', toFa(a)).replace('{b}', toFa(b)),
        display: { kind: 'text', value: `${toFa(a)} − ${toFa(b)}` },
        options: buildOptions(answer, pool, n).map((v) => ({ label: toFa(v), value: v })),
        answer,
      };
    }

    // ── ریاضی، دور دوم ─────────────────────────────────────────────
    // منبع: مسیرهای یادگیری Clements & Sarama و کتاب ریاضی اول
    // دبستان ایران (تم‌های ۴، ۱۵، ۱۸: چوب‌خط، ارزش مکانی، شمردن
    // چندتایی) — یعنی هم پژوهش جهانی و هم چیزی که کودک ایرانی
    // در مدرسه می‌بیند.

    case 'digit-trace':
      // نوشتن رقم بخشی از برنامهٔ رسمی اول دبستان است. صفحهٔ
      // خط‌کشیدن همان است که برای حروف کار می‌کند و r.letter را
      // می‌کشد، پس رقم را در همان کلید می‌فرستیم.
      return {
        type: 'trace',
        prompt: round.prompt,
        letter: toFa(round.digit),
      };

    case 'tally': {
      // چوب‌خط: دسته‌های ۵تایی که پنجمی روی چهارتای قبل مورب
      // کشیده می‌شود. کتاب اول دبستان (تم ۴) این را پیش از عدد
      // دو رقمی می‌آورد، چون «دستهٔ ۵تایی» پایهٔ ارزش مکانی است.
      const top = Math.min(12, Math.max(3, cap));
      const count = 3 + rand(Math.max(1, top - 2));
      // گزینه‌های نادرست هم باید زیر سقف سنی بمانند.
      const pool = Array.from({ length: top }, (_, i) => i + 1);
      return {
        type: 'choice',
        prompt: round.prompt,
        display: { kind: 'tally', times: count },
        // ⚠ نقطه فقط برای بعضی گزینه‌ها = گِرد نیمه‌تصویری، و
        // نگهبان test-rounds درست می‌گیردش. اینجا خودِ چوب‌خط
        // بالای صفحه شمردنی است، پس گزینه‌ها رقم خالی می‌مانند.
        options: buildOptions(count, pool, n).map((v) => ({ label: toFa(v), value: v })),
        answer: count,
      };
    }

    case 'skip-count': {
      // شمردن چندتایی (تم ۱۸): ۲تا۲تا، ۵تا۵تا، ۱۰تا۱۰تا.
      // پایهٔ ضرب و درک ساختار عدد.
      // ⚠ گام باید با سقف سنی بخواند: ردهٔ ۵–۶ تا ۱۰ می‌شمارد، پس
      // «۱۰تا۱۰تا» برایش بی‌معناست. گام را به سقف می‌چسبانیم و
      // رشته را کوتاه می‌کنیم تا آخرین عدد از سقف نگذرد.
      let step = round.step || 2;
      while (step > 2 && step * 4 > cap) step = step === 10 ? 5 : 2;
      // آخرین عددِ رشته (start + 3×step) باید زیر سقف بماند، وگرنه
      // گزینهٔ درست خودش از دامنهٔ سنی بیرون می‌زند.
      const maxStart = Math.max(step, cap - step * 3);
      const start = step * (1 + rand(Math.max(1, Math.floor(maxStart / step) - 1)));
      const seen = [start, start + step, start + step * 2];
      const answer = start + step * 3;
      const pool = [answer, answer + step, answer - step, answer + 1, answer - 1].filter(
        (v) => v > 0 && v <= cap,
      );
      return {
        type: 'choice',
        // ⚠ replace فقط اولین جای‌نگهدار را عوض می‌کند و پرسش
        // «۲ تا {s} تا بشمار» نیمه‌خام می‌ماند. باید همه را گرفت.
        prompt: round.prompt.replaceAll('{s}', toFa(step)),
        // رشتهٔ عددها را با نقطه‌های شمردنی نشان نمی‌دهیم چون
        // بلند می‌شود؛ خودِ عددها اینجا درس‌اند و کودک این سن
        // رقم فارسی را می‌خواند.
        display: { kind: 'number-seq', items: seen.map((v) => toFa(v)) },
        options: buildOptions(answer, pool, n).map((v) => ({ label: toFa(v), value: v })),
        answer,
      };
    }

    case 'place-value': {
      // ارزش مکانی (تم ۱۵ و ۱۶): عدد دو رقمی = چند دستهٔ ده‌تایی
      // و چند یکی. با دسته‌های دیدنی، نه با تعریف کلامی.
      // تعداد دسته‌ها با سقف سنی محدود می‌شود تا عددِ ساخته‌شده از
      // دامنهٔ رده بیرون نزند (ردهٔ ۶–۷ سقف ۲۰ دارد → حداکثر یک دسته).
      const maxTens = Math.max(1, Math.floor((cap - 1) / 10));
      const tens = 1 + rand(maxTens);
      const ones = rand(Math.min(10, Math.max(1, cap - tens * 10 + 1)));
      const total = tens * 10 + ones;
      // ⚠ عدد دو رقمی ذاتاً از سقف ردهٔ ۵–۶ (۱۰) بالاتر است. برای آن
      // رده فقط «چند دسته؟» پرسیده می‌شود — پاسخ تک‌رقمی است و
      // خودِ مفهومِ دسته‌بندی هم همان است. رده‌های بالاتر کل عدد را
      // می‌گویند.
      const askTens = round.mode === 'tens' || cap <= 10;
      const answer = askTens ? tens : total;
      // ⚠ گزینه‌های نادرست هم باید در دامنهٔ سنی بمانند، وگرنه کودک
      // عددی می‌بیند که هنوز یاد نگرفته. (`total + 10` از سقف می‌زد.)
      const pool = askTens
        ? [1, 2, 3, 4, 5, 6].filter((v) => v <= maxTens + 2)
        : [total, total + 10, total - 10, total + 1, total - 1, tens * 10]
            .filter((v) => v > 0 && v <= cap);
      return {
        type: 'choice',
        prompt: round.prompt,
        display: { kind: 'place-value', tens, ones },
        options: buildOptions(answer, pool, n).map((v) => ({ label: toFa(v), value: v })),
        answer,
      };
    }

    case 'shape-corners': {
      // گوشه‌ها را بشمار (تم ۴). کتاب صریح توصیه می‌کند واژهٔ
      // «ضلع» و «رأس» به کار نرود؛ «گوشه» برای این سن فهمیدنی‌تر
      // است — پس در متن درس هم همان آمده.
      // ⚠ ستاره ۵ گوشه ندارد؛ نقشِ رسم‌شده ۱۰ رأس دارد (پنج نوک و
      // پنج فرورفتگی). پاسخ ۵ یعنی کودکی که واقعاً می‌شمارد ۱۰
      // می‌گیرد و «غلط» می‌شود — بدترین نوع باگ آموزشی. یا باید
      // پاسخ با تصویر بخواند یا ستاره کنار برود.
      const CORNERS = { مثلث: 3, مربع: 4, مستطیل: 4, لوزی: 4, ستاره: 10, دایره: 0 };
      // دایره گوشه ندارد، پس پرسش برایش بی‌معناست.
      let names = ['مثلث', 'مربع', 'مستطیل', 'لوزی'];
      // ستاره فقط وقتی می‌آید که کودک تا ۱۰ می‌شمارد.
      if (cap >= 10) names = names.concat('ستاره');
      const name = pick(names);
      const answer = CORNERS[name];
      const pool = answer >= 10 ? [5, 8, 10, 12] : [3, 4, 5, 6];
      return {
        type: 'choice',
        prompt: round.prompt,
        display: { kind: 'geo-big', name },
        options: buildOptions(answer, pool, n).map((v) => ({ label: toFa(v), value: v, dots: v })),
        answer,
      };
    }

    case 'symmetry': {
      // تقارن (تم ۹): کدام شکل آینه‌ای است؟ توانایی فضایی که
      // پژوهش آن را پیش‌بینی‌کنندهٔ ریاضی بعدی می‌داند.
      const SYMMETRIC = ['مربع', 'دایره', 'مثلث', 'ستاره', 'قلب', 'لوزی'];
      const answer = pick(SYMMETRIC);
      return {
        type: 'choice',
        prompt: round.prompt,
        display: { kind: 'mirror', name: answer },
        options: buildOptions(answer, SYMMETRIC, Math.min(n, SYMMETRIC.length)).map((v) => ({
          label: v,
          value: v,
          geo: { name: v, color: '#2E86AB' },
        })),
        answer,
      };
    }

    case 'number-line': {
      // محور اعداد (تم ۱۷). کتاب صریح می‌گوید هدف جمعِ ذهنی نیست:
      // کودک باید «قدم برداشتن» روی محور را ببیند. پس فلش‌ها را
      // نشان می‌دهیم و او فقط جای فرود را می‌خواند.
      // ⚠ محور باید کوتاه بماند وگرنه در ۳۲۰ پیکسل سرریز می‌کند؛
      // ده خانه بیشترین چیزی است که جا می‌شود.
      const span = Math.min(10, cap);
      const from = rand(Math.max(1, span - 3));
      const steps = 1 + rand(Math.min(4, span - from));
      const answer = from + steps;
      const pool = [answer, answer + 1, answer - 1, answer + 2].filter((v) => v >= 0 && v <= span);
      return {
        type: 'choice',
        prompt: round.prompt.replaceAll('{a}', toFa(from)).replaceAll('{b}', toFa(steps)),
        // ⚠ مقصد را رنگی نمی‌کنیم! نسخهٔ اول نقطهٔ فرود را نارنجی
        // می‌کرد، یعنی پاسخ روی محور نوشته شده بود و کودک فقط
        // عددِ رنگی را می‌خواند. حالا فقط نقطهٔ شروع و کمانِ
        // قدم‌ها را می‌بیند و خودش باید بشمارد.
        display: { kind: 'number-line', span, from, steps, hideTo: true },
        options: buildOptions(answer, pool, n).map((v) => ({ label: toFa(v), value: v })),
        answer,
      };
    }

    case 'between': {
      // مفهوم «بین» (تم ۱۷، صفحهٔ ۱۱۳). در کتاب کنار چپ/راست و
      // جلو/پشت می‌آید — یعنی مفهومی فضایی است، نه فقط عددی.
      // اینجا شکل عددی‌اش را می‌سازیم چون روی محور دیدنی است.
      const span = Math.min(10, cap);
      const left = rand(Math.max(1, span - 2));
      const answer = left + 1;
      const right = left + 2;
      const pool = [answer, left, right, answer + 2].filter((v) => v >= 0 && v <= span);
      return {
        type: 'choice',
        prompt: round.prompt.replaceAll('{a}', toFa(left)).replaceAll('{b}', toFa(right)),
        display: { kind: 'number-line', span, mark: [left, right] },
        options: buildOptions(answer, pool, n).map((v) => ({ label: toFa(v), value: v })),
        answer,
      };
    }

    case 'teen-build': {
      // اعداد ۱۱ تا ۱۹ (تم ۱۶). این عددها در فارسی هم بی‌قاعده‌اند
      // («یازده»، نه «ده‌ویک») پس باید دیده شوند، نه شنیده.
      // ⚠ ذاتاً دورقمی است: برای کودکی که تا ۱۰ می‌شمارد بی‌معناست.
      // به‌جای کلمپِ بی‌فایده، پرسش را به «یک ده‌تایی و چند تا؟»
      // تغییر می‌دهیم که همان مفهوم است ولی پاسخش تک‌رقمی.
      const ones = 1 + rand(9);
      const total = 10 + ones;
      const askOnes = cap < total;
      const answer = askOnes ? ones : total;
      const pool = askOnes
        ? [ones, ones + 1, ones - 1, ones + 2].filter((v) => v > 0 && v <= 9)
        : [total, total + 1, total - 1, total + 10].filter((v) => v > 0 && v <= cap);
      return {
        type: 'choice',
        prompt: askOnes ? 'چند تا تک‌تکی کنار دسته است؟' : round.prompt,
        display: { kind: 'place-value', tens: 1, ones },
        options: buildOptions(answer, pool, n).map((v) => ({ label: toFa(v), value: v })),
        answer,
      };
    }

    case 'measure-units': {
      // اندازه‌گیری با واحد غیراستاندارد (تم ۱۸، صفحهٔ ۱۱۸). کتاب
      // می‌خواهد کودک با گیره و پاک‌کن اندازه بگیرد، نه با خط‌کش —
      // چون مفهومِ «واحد» مهم‌تر از سانتی‌متر است.
      const unit = pick(['گیره', 'مداد', 'پاک‌کن']);
      // ⚠ سقف ۸ تا: بیشتر از این در ۳۲۰ پیکسل جا نمی‌شود و چون
      // نوار باید *دقیقاً* هم‌اندازهٔ واحدها بماند، نمی‌شود بریدش.
      const len = 3 + rand(Math.min(5, Math.max(1, Math.min(cap, 8) - 2)));
      const pool = [len, len + 1, len - 1, len + 2].filter((v) => v > 0 && v <= cap);
      return {
        type: 'choice',
        prompt: round.prompt.replaceAll('{u}', unit),
        display: { kind: 'measure', unit, len },
        options: buildOptions(len, pool, n).map((v) => ({ label: toFa(v), value: v })),
        answer: len,
      };
    }

    case 'ordinal': {
      // عددهای ترتیبی (تم ۱۸). «سوم» با «سه تا» فرق دارد و همین
      // تفاوت است که کودک را گیج می‌کند — پس صفِ دیدنی می‌سازیم.
      // ⚠ ترتیب در فارسی از راست شروع می‌شود؛ نمایش باید RTL بماند
      // وگرنه «اولی» را از چپ می‌شمارد و همیشه غلط می‌دهد.
      const NAMES = ['اول', 'دوم', 'سوم', 'چهارم', 'پنجم'];
      // ⚠ صف باید در *یک خط* بماند. با ۶ تا در ۳۹۰ پیکسل به خط دوم
      // می‌شکند و «اولی» بی‌معنا می‌شود — کودک نمی‌داند از کجا
      // بشمارد. چهار تا بیشترین چیزی است که همیشه جا می‌شود.
      const len = 4;
      const idx = rand(Math.min(len, NAMES.length));
      const items = [];
      const bag = shuffle(COUNTABLES.slice());
      for (let i = 0; i < len; i++) items.push(bag[i % bag.length]);
      const answer = items[idx];
      const pool = items.filter((v, i) => i !== idx);
      return {
        type: 'choice',
        prompt: round.prompt.replaceAll('{p}', NAMES[idx]),
        display: { kind: 'queue', items },
        options: buildOptions(answer, pool, n).map((v) => ({
          label: v,
          value: v,
          pic: v,
          picLabel: v,
        })),
        answer,
      };
    }

    case 'missing-addend': {
      // «۵ و چند تا می‌شود ۷؟» — سطح Find Change +/- در مسیر
      // یادگیری Clements & Sarama، پلِ میان شمردن و جمع.
      const total = 4 + rand(Math.min(7, Math.max(2, cap - 3)));
      const part = 1 + rand(total - 2);
      const answer = total - part;
      const pool = Array.from({ length: Math.max(5, total) }, (_, i) => i + 1);
      return {
        type: 'choice',
        prompt: round.prompt.replace('{p}', toFa(part)).replace('{t}', toFa(total)),
        display: { kind: 'missing', part, total },
        options: buildOptions(answer, pool, n).map((v) => ({ label: toFa(v), value: v, dots: v })),
        answer,
      };
    }

    case 'pattern-next': {
      const pool = round.unit === 'color' ? Object.keys(COLOR_HEX) : GEO_NAMES;
      return {
        type: 'choice',
        prompt: round.prompt,
        display: { kind: 'sequence', unit: round.unit, items: round.sequence },
        // ⚠ باگ: کلید `shape` را می‌فرستاد ولی رابط کاربری فقط `geo`
        // را می‌شناسد. نتیجه: الگوی شکلی گزینه‌هایش واژهٔ خالی بود
        // («مثلث»، «لوزی») و کودکِ پیش‌خوان نمی‌توانست حلش کند —
        // در حالی که خودِ الگو بالای صفحه تصویری نشان داده می‌شد.
        options: buildOptions(round.answer, pool, Math.min(n, pool.length)).map((v) => ({
          label: v,
          value: v,
          swatch: round.unit === 'color' ? COLOR_HEX[v] : null,
          geo: round.unit === 'shape' ? { name: v, color: '#2E86AB' } : null,
        })),
        answer: round.answer,
      };
    }

    case 'odd-one-out': {
      // این گِرد تنها جایی بود که قانون «تعداد گزینه بر حسب سن» را
      // دور می‌زد و به کودک ۵ ساله ۴ گزینه می‌داد. پژوهش دانشگاه
      // کالیفرنیای جنوبی: چیدمان ساده‌تر ← خطای ناوبری کمتر در ۵–۸ سال.
      // کمینهٔ منطقی این تمرین ۳ است (یکی متفاوت، دوتا هم‌گروه).
      const others = round.items.filter((v) => v !== round.answer);
      const keep = Math.max(3, Math.min(n, round.items.length));
      const items = shuffle([round.answer, ...shuffle(others).slice(0, keep - 1)]);
      return {
        type: 'choice',
        prompt: round.prompt,
        display: null,
        // آیتم‌های این گِرد نامِ شکل‌اند («پروانه»، «هویج»). پیش‌تر
        // فقط برچسبِ متنی می‌گرفتند و کودکِ پیش‌خوان بازی را
        // نمی‌فهمید. حالا تصویر می‌آید و برچسب زیرش می‌ماند.
        // سه حالت: نامِ شکل تصویر می‌گیرد، نامِ رنگ لکهٔ رنگی، و
        // نامِ شکل هندسی («دایره») شکلِ هندسی. اگر هیچ‌کدام نبود
        // برچسب متنی می‌ماند — ولی چنین آیتمی در درس‌ها نداریم.
        options: items.map((v) => {
          if (hasPicture(v)) return { label: v, value: v, pic: v, picLabel: true };
          if (COLOR_HEX[v]) return { label: v, value: v, swatch: COLOR_HEX[v] };
          // ⚠ رنگِ شکل نباید با هیچ‌کدام از لکه‌های رنگیِ همان گِرد یکی
          // باشد: «دایرهٔ آبی» کنار لکهٔ «آبی» کودک را دودل می‌کند که
          // پرسش دربارهٔ رنگ است یا شکل. خاکستریِ خنثی هیچ نامِ رنگی
          // در درس‌ها ندارد.
          if (GEO[v]) return { label: v, value: v, geo: { name: v, color: '#6E6A78' } };
          if (NUM_WORD[v]) return { label: v, value: v, dots: NUM_WORD[v] };
          return { label: v, value: v };
        }),
        answer: round.answer,
        because: round.because,
      };
    }

    case 'order-size': {
      const icon = pick(COUNTABLES);
      const sizes = shuffle(Array.from({ length: round.count }, (_, i) => i + 1));
      return {
        type: 'order',
        prompt: round.prompt,
        items: sizes.map((s) => ({ label: icon, value: s, scale: 0.6 + s * 0.25 })),
        answer: [...sizes].sort((x, y) => x - y),
      };
    }

    case 'order-number': {
      const capN = Math.min(round.max ?? track.maxNumber, track.maxNumber);
      const set = new Set();
      while (set.size < round.count) set.add(1 + rand(capN));
      const nums = shuffle([...set]);
      return {
        type: 'order',
        prompt: round.prompt,
        items: nums.map((v) => ({ label: toFa(v), value: v, scale: 1 })),
        answer: [...nums].sort((x, y) => x - y),
      };
    }

    case 'memory-pairs': {
      const icons = shuffle(COUNTABLES).slice(0, round.pairs);
      return {
        type: 'memory',
        prompt: round.prompt,
        cards: shuffle([...icons, ...icons]).map((icon, i) => ({ id: i, icon })),
        pairs: round.pairs,
      };
    }

    // ── بازی‌های تصویری (SVG) ──────────────────────────────────────────
    case 'shape-color': {
      // «کدام دایرهٔ آبی است؟» — رنگ و شکل هم‌زمان، تمرین توجه انتخابی.
      const shapeName = round.shape || pick(GEO_NAMES);
      const colorName = round.color || pick(Object.keys(COLOR_HEX));
      const others = Object.keys(COLOR_HEX).filter((c) => c !== colorName);
      const colors = shuffle([colorName, ...shuffle(others).slice(0, n - 1)]);
      return {
        type: 'choice',
        prompt: round.prompt.replace('{shape}', shapeName).replace('{color}', colorName),
        display: null,
        options: colors.map((c) => ({
          label: c,
          value: c,
          geo: { name: shapeName, color: c },
        })),
        answer: colorName,
      };
    }

    case 'two-rule': {
      // دسته‌بندی با دو معیار همزمان (منطقِ AND).
      //
      // پژوهش: کودک ۵ ساله یک معیار را خوب می‌گیرد، ولی نگه‌داشتن
      // *دو* معیار در ذهن جهشِ بعدی است — پایهٔ انعطاف شناختی.
      //
      // ⚠ تلاش اول از TRAITS × CATEGORIES ساخته شد و شکست خورد:
      // ویژگی‌ها زیرمجموعهٔ دسته‌ها هستند (هر پرنده حیوان است)، پس
      // «فقط‌ویژگی» تقریباً همیشه خالی می‌ماند و از شش ترکیب فقط
      // یکی می‌ساخت — یعنی یک پرسشِ تکراری برای کل درس.
      // AND واقعی دو محورِ *مستقل* می‌خواهد: شکل و رنگ.
      const shapeName = pick(GEO_NAMES);
      const colorName = pick(Object.keys(COLOR_HEX));
      const otherShapes = GEO_NAMES.filter((x) => x !== shapeName);
      const otherColors = Object.keys(COLOR_HEX).filter((c) => c !== colorName);

      // پاسخ: هر دو شرط. فریب‌ها: دقیقاً یکی از دو شرط — اگر هیچ
      // شرطی نداشته باشند، کودک بدون فهمیدن AND هم برنده می‌شود.
      const answer = { shape: shapeName, color: colorName };
      const decoys = [
        { shape: shapeName, color: pick(otherColors) },
        { shape: pick(otherShapes), color: colorName },
        { shape: shuffle(otherShapes)[1] ?? pick(otherShapes), color: shuffle(otherColors)[1] ?? pick(otherColors) },
      ];
      const opts = shuffle([answer, ...decoys.slice(0, n - 1)]);
      return {
        type: 'choice',
        prompt: `کدام ${shapeName} ${colorName} است؟`,
        display: null,
        options: opts.map((o) => ({
          // برچسب هر دو ویژگی را می‌گوید تا انتخاب مبهم نماند.
          // ⚠ geoLabel لازم است وگرنه رابط دکمه را بی‌متن می‌سازد و
          // قانونِ «هر گزینه متن دارد» می‌شکند.
          label: `${o.shape} ${o.color}`,
          value: `${o.shape}|${o.color}`,
          geo: { name: o.shape, color: COLOR_HEX[o.color] },
          geoLabel: true,
        })),
        answer: `${answer.shape}|${answer.color}`,
      };
    }

    case 'not-rule': {
      // منطقِ NOT — «کدام پرواز نمی‌کند؟»
      //
      // نفی برای این سن سخت‌تر از اثبات است چون باید قاعده را
      // بسازد و بعد واژگونش کند. ولی همان چیزی است که «همهٔ … جز
      // …» را ممکن می‌کند.
      // ⚠ همهٔ فریب‌ها باید *در* آن ویژگی باشند، پس ویژگی باید دست‌کم
      // n−1 عضو تصویردار داشته باشد. «چرخ دارد» فقط ماشین را دارد و
      // برای ردهٔ ۸ ساله (۴ گزینه) کم می‌آورد — آزمون همین را گرفت.
      const usable = Object.entries(TRAITS).filter(
        ([, items]) => items.filter(hasPicture).length >= n - 1,
      );
      if (!usable.length) return null;
      const [trait, rawItems] = pick(usable);
      const inTrait = rawItems.filter(hasPicture);
      // بیرونی‌ها باید تصویر داشته باشند و در آن ویژگی نباشند.
      // ⚠ فریب از EVERYDAY_NAMES می‌آید، نه SHAPE_NAMES: دومی
      // «روی‌آب»، «پیله» و اجزای بدن را هم دارد که بیرون از درس
      // علوم بی‌معنا هستند و پرسش را مسخره می‌کنند.
      const outside = EVERYDAY_NAMES.filter((x) => !inTrait.includes(x) && hasPicture(x));
      if (!outside.length) return null;
      // ⚠ «کدام گیاه نیست؟ → سیب» ساخته می‌شد، چون سیب در فهرست
      // «گیاه است» نیست ولی *واقعاً* از گیاه می‌آید. عضویتِ نبودن
      // در یک فهرست با نبودنِ واقعی یکی نیست. برای ویژگی‌هایی که
      // مرز مبهم دارند، بیرونی‌ها را صریح محدود می‌کنیم.
      const AMBIGUOUS = {
        'گیاه است': ['گربه', 'سگ', 'ماهی', 'پرنده', 'خرگوش', 'جوجه', 'گاو', 'توپ', 'کتاب', 'خانه', 'ماشین', 'کفش', 'کلاه', 'ساعت', 'کلید', 'مداد', 'چتر'],
        'خوردنی است': ['توپ', 'کتاب', 'خانه', 'ماشین', 'کفش', 'کلاه', 'پیراهن', 'ساعت', 'کلید', 'مداد', 'چتر', 'کوه', 'ماه', 'ستاره'],
      };
      const safeOutside = AMBIGUOUS[trait]
        ? outside.filter((x) => AMBIGUOUS[trait].includes(x))
        : outside;
      if (!safeOutside.length) return null;
      const answer = pick(safeOutside);
      // ⚠ همهٔ فریب‌ها باید *در* آن ویژگی باشند، وگرنه چند پاسخ
      // درست می‌شود و گِرد شکسته است.
      const wrong = shuffle(inTrait).slice(0, n - 1);
      if (wrong.length < n - 1) return null;
      return {
        type: 'choice',
        prompt: `کدام ${TRAIT_NEGATIVE[trait]}؟`,
        display: null,
        options: shuffle([answer, ...wrong]).map((v) => ({ label: v, value: v, pic: v, picLabel: true })),
        answer,
        because: `${answer} ${trait} نیست.`,
      };
    }

    case 'category': {
      // «کدام حیوان است؟» — دسته‌بندی معنایی با تصویر واقعی.
      const catName = round.category || pick(Object.keys(CATEGORIES));
      const inCat = CATEGORIES[catName];
      const outCat = Object.entries(CATEGORIES)
        .filter(([k]) => k !== catName)
        .flatMap(([, v]) => v);
      const answer = pick(inCat);
      const wrong = shuffle(outCat).slice(0, n - 1);
      return {
        type: 'choice',
        prompt: round.prompt.replace('{cat}', catName),
        display: null,
        options: shuffle([answer, ...wrong]).map((v) => ({
          label: v,
          value: v,
          pic: v,
          picLabel: true,
        })),
        answer,
        because: `${answer} ${catName} است.`,
      };
    }

    case 'shadow': {
      // «سایهٔ کدام است؟» — تطبیق شکل با سایه‌اش، ادراک دیداری.
      const answer = round.item || pick(Object.keys(SHAPES));
      const wrong = shuffle(Object.keys(SHAPES).filter((x) => x !== answer)).slice(0, n - 1);
      return {
        type: 'choice',
        prompt: round.prompt,
        display: { kind: 'shadow', value: answer },
        options: shuffle([answer, ...wrong]).map((v) => ({ label: v, value: v, pic: v })),
        answer,
      };
    }

    case 'count-shapes': {
      // شمردن با شکل‌های برداری در چیدمان پراکنده — سخت‌تر از ردیف منظم،
      // چون کودک باید واقعاً بشمارد نه الگو را حفظ کند.
      const count = 1 + rand(Math.max(1, Math.min(cap, 9)));
      const icon = round.icon || pick(COUNTABLES);
      const pool = Array.from({ length: Math.max(cap, count + 2) }, (_, i) => i + 1);
      return {
        type: 'choice',
        prompt: round.prompt,
        display: { kind: 'scatter', icon, times: count },
        options: buildOptions(count, pool, n).map((v) => ({ label: toFa(v), value: v })),
        answer: count,
      };
    }

    // ── مهارت زندگی ────────────────────────────────────────────────────
    case 'feel-face': {
      // «او چه حسی دارد؟» — موقعیت را می‌بیند، چهرهٔ درست را می‌زند.
      // نخستین گام سواد هیجانی در CASEL: نام‌گذاری احساس.
      const sit = round.situation || pick(Object.keys(SITUATION_FEELING));
      const answer = SITUATION_FEELING[sit];
      const wrong = FACE_NAMES.filter((f) => f !== answer);
      return {
        type: 'choice',
        prompt: round.prompt,
        display: { kind: 'pic-only', icon: sit },
        options: buildOptions(answer, wrong, n).map((v) => ({
          label: v,
          value: v,
          pic: v,
          picLabel: true,
        })),
        answer,
        because: `او ${answer} است.`,
      };
    }

    case 'name-face': {
      // چهره را می‌بیند، نامش را می‌گوید.
      //
      // ⚠ اینجا عمداً گزینه‌ها تصویر ندارند: اگر هر گزینه هم چهره
      // باشد، کودک فقط دو تصویر را با هم تطبیق می‌دهد و نامِ احساس
      // را یاد نمی‌گیرد — همان کاری که گِرد feel-face می‌کند. هدف
      // این گِرد پیوند «چهره ↔ واژه» است.
      //
      // چون واژه‌خوانی لازم می‌شود، این تنها گِرد مهارت زندگی است که
      // برای کودکِ کاملاً پیش‌خوان مناسب نیست. پس فقط در ردهٔ سنی
      // بالاتر می‌آید و برای ۵–۶ ساله به feel-face تبدیل می‌شود.
      if (track.optionCount <= 2) {
        const sit = pick(Object.keys(SITUATION_FEELING));
        const ansE = SITUATION_FEELING[sit];
        const wrongE = FACE_NAMES.filter((f) => f !== ansE);
        return {
          type: 'choice',
          prompt: round.prompt,
          display: { kind: 'pic-only', icon: sit },
          options: buildOptions(ansE, wrongE, n).map((v) => ({
            label: v,
            value: v,
            pic: v,
            picLabel: true,
          })),
          answer: ansE,
          because: `او ${ansE} است.`,
        };
      }
      const answer = round.emotion || pick(FACE_NAMES);
      const wrong = FACE_NAMES.filter((f) => f !== answer);
      return {
        type: 'choice',
        prompt: round.prompt,
        display: { kind: 'pic-only', icon: answer },
        options: buildOptions(answer, wrong, n).map((v) => ({ label: v, value: v })),
        answer,
      };
    }

    case 'safe-pick': {
      // «کدام خطرناک است؟» یا «کدام بی‌خطر است؟».
      // منبع: فهرست ایمنی کودک — وسایل برقی، اشیای تیز، دارو، کبریت.
      const wantHazard = round.want !== 'safe';
      const answer = wantHazard ? pick(HAZARD_NAMES_L) : pick(SAFE_THINGS);
      const wrong = wantHazard
        ? SAFE_THINGS.filter((x) => x !== answer)
        : HAZARD_NAMES_L.filter((x) => x !== answer);
      return {
        type: 'choice',
        prompt: round.prompt,
        display: null,
        options: buildOptions(answer, wrong, n).map((v) => ({
          label: v,
          value: v,
          pic: v,
          picLabel: true,
        })),
        answer,
        because: wantHazard ? `${answer} خطرناک است.` : `${answer} بی‌خطر است.`,
      };
    }

    case 'good-habit': {
      // «کدام برای تو خوب است؟» — بهداشت فردی و مهربانی.
      //
      // بدیل‌ها خطرند، نه یک عادتِ درستِ دیگر: اگر هر دو گزینه درست
      // بودند، پاسخ یکتا نبود.
      //
      // ⚠ پرسش اول «کدام کارِ درست است؟» بود و غلط بود: بدیل‌ها
      // شیءاند («کبریت»)، نه کار. کودک می‌دید «کدام کار… کبریت» و
      // پرسش با گزینه جور درنمی‌آمد. «خوب بودن» هم دربارهٔ کار صدق
      // می‌کند هم دربارهٔ شیء، پس هر دو را می‌پوشاند.
      const pool = round.pool === 'kind' ? KIND_ACTS : GOOD_HABITS;
      const answer = pick(pool);
      const wrong = HAZARD_NAMES_L;
      return {
        type: 'choice',
        prompt: round.prompt,
        display: null,
        options: buildOptions(answer, wrong, n).map((v) => ({
          label: v,
          value: v,
          pic: v,
          picLabel: true,
        })),
        answer,
        because: `${answer} کارِ درستی است.`,
      };
    }

    case 'safety-order': {
      // چیدنِ «نه، برو، بگو» — فرمول سه‌گامیِ ایمنی شخصی از راهنمای
      // بهزیستی. تصویری است تا کودک پیش‌خوان هم بتواند بچیند.
      const steps = ['نه‌گفتن', 'دورشدن', 'گفتن‌به‌بزرگ‌تر'];
      const labels = { 'نه‌گفتن': 'نه!', دورشدن: 'برو', 'گفتن‌به‌بزرگ‌تر': 'بگو' };
      const mixed = shuffle(steps.map((name, i) => ({ name, order: i + 1 })));
      return {
        type: 'order',
        prompt: round.prompt,
        items: mixed.map((m) => ({
          label: labels[m.name],
          value: m.order,
          scale: 1,
          pic: m.name,
        })),
        answer: [1, 2, 3],
      };
    }

    case 'event-order': {
      // توالی رویداد روزمره — «اول چه کار می‌کنی؟»
      //
      // پژوهش این را پایهٔ درکِ داستان و علت‌ومعلول می‌داند: کودکی
      // که ترتیب را می‌فهمد، متن را هم دنبال می‌کند.
      // ⚠ فقط توالی‌هایی که *ذاتاً* یک‌طرفه‌اند. اگر جای دو گام را
      // بشود عوض کرد و باز منطقی بماند، گِرد چند پاسخ درست دارد.
      const CHAINS = [
        { name: 'شست‌وشو', steps: ['آب‌خوردن', 'دست‌شستن', 'غذا'], labels: ['آب', 'دست بشور', 'غذا بخور'] },
        { name: 'شب', steps: ['غذا', 'مسواک', 'خواب'], labels: ['شام', 'مسواک', 'خواب'] },
        { name: 'زخم', steps: ['زانوی‌زخمی', 'دستمال', 'کمک‌کردن'], labels: ['زخم شد', 'تمیز کن', 'کمک بگیر'] },
      ];
      const usable = CHAINS.filter((c) => c.steps.every(hasPicture));
      if (!usable.length) return null;
      const chain = pick(usable);
      const mixed = shuffle(chain.steps.map((name, i) => ({ name, order: i + 1, label: chain.labels[i] })));
      return {
        type: 'order',
        prompt: round.prompt,
        items: mixed.map((m) => ({ label: m.label, value: m.order, scale: 1, pic: m.name })),
        answer: [1, 2, 3],
      };
    }

    case 'what-if': {
      // استدلال علت و معلول — «اگر … چه می‌شود؟»
      //
      // این تنها گِردِ منطق است که پاسخش روی صفحه *نیست*: کودک
      // باید نتیجه را پیش‌بینی کند. برای همین متنِ کوتاه دارد ولی
      // هر گزینه تصویر دارد تا پیش‌خوان هم بتواند بازی کند.
      // ⚠ کلیدهای SHAPES نامِ داخلی‌اند («کمک‌کردن»، «کتاب‌خواندن») و
      // برای *نمایش* ساخته نشده‌اند: در دکمهٔ باریک وسطِ نیم‌فاصله
      // می‌شکنند و «کمک‌کرد / ن» می‌شود. پس هر گزینه برچسبِ کوتاهِ
      // خودش را دارد.
      const LABEL = {
        'کمک‌کردن': 'کمک',
        'کتاب‌خواندن': 'کتاب',
        دستمال: 'تمیز کن',
        خواب: 'خواب',
        غذا: 'غذا',
        دویدن: 'دویدن',
        توپ: 'بازی',
        خانه: 'خانه',
      };
      const CASES = [
        { if: 'برج‌خراب', then: 'کمک‌کردن', wrong: ['خواب', 'غذا'], q: 'برج خراب شد. بعد چه کار خوبی است؟' },
        { if: 'بستنی‌افتاده', then: 'دستمال', wrong: ['دویدن', 'کتاب‌خواندن'], q: 'بستنی افتاد. اول چه کار می‌کنی؟' },
        { if: 'زانوی‌زخمی', then: 'کمک‌کردن', wrong: ['دویدن', 'توپ'], q: 'زانویت زخم شد. چه کار می‌کنی؟' },
        { if: 'رعدوبرق', then: 'خانه', wrong: ['دویدن', 'توپ'], q: 'رعد و برق شد. کجا می‌روی؟' },
      ];
      const usable = CASES.filter(
        (c) => hasPicture(c.if) && hasPicture(c.then) && c.wrong.every(hasPicture),
      );
      if (!usable.length) return null;
      const c = pick(usable);
      const wrong = shuffle(c.wrong.slice()).slice(0, n - 1);
      return {
        type: 'choice',
        prompt: c.q,
        display: { kind: 'pic-only', icon: c.if },
        options: shuffle([c.then, ...wrong]).map((v) => ({
          label: LABEL[v] ?? v,
          value: v,
          pic: v,
          picLabel: true,
        })),
        answer: c.then,
      };
    }

    case 'same-different': {
      // «کدام دو تا شبیه هم‌اند؟» — پایهٔ مقایسه و تعمیم.
      //
      // ⚠ شباهت باید *یک* دلیل روشن داشته باشد، وگرنه چند جواب
      // درست می‌شود. پس از TRAITS استفاده می‌کنیم: دو عضو یک
      // ویژگی، کنار یکی که آن ویژگی را ندارد.
      // اینجا فقط ۲ عضو لازم است (یکی نمایش، یکی پاسخ) چون فریب‌ها
      // از بیرونِ ویژگی می‌آیند، نه از داخلش.
      const usable = Object.entries(TRAITS).filter(
        ([, items]) => items.filter(hasPicture).length >= 2,
      );
      if (!usable.length) return null;
      const [trait, rawItems] = pick(usable);
      const inTrait = shuffle(rawItems.filter(hasPicture));
      const shown = inTrait[0];
      const answer = inTrait[1];
      const outside = shuffle(
        EVERYDAY_NAMES.filter((x) => !rawItems.includes(x) && hasPicture(x)),
      ).slice(0, n - 1);
      if (outside.length < n - 1) return null;
      return {
        type: 'choice',
        prompt: `کدام مثل این ${trait}؟`,
        display: { kind: 'pic-only', icon: shown },
        options: shuffle([answer, ...outside]).map((v) => ({ label: v, value: v, pic: v, picLabel: true })),
        answer,
        because: `${shown} و ${answer} هر دو ${trait}.`,
      };
    }

    default:
      // هرگز حدس نمی‌زنیم. اعتبارسنج باید جلوی رسیدن به اینجا را گرفته باشد.
      throw new Error(`نوع گِرد پشتیبانی نمی‌شود: ${round.kind}`);
  }
}

/** همهٔ گِردهای یک درس را برای یک ردهٔ سنی می‌سازد. */
export function buildLesson(lesson, track) {
  const rounds = lesson.rounds.map((r) => buildRound(r, track)).filter(Boolean);
  const cap = Math.max(3, track.roundsPerLesson);
  if (rounds.length <= cap) return rounds;

  // ⚠ برش سادهٔ «۶ تای اول» یک باگ آموزشی جدی بود: گِردهای صداکشی
  // و بخش‌بندی در انتهای درس تعریف شده‌اند، پس هرگز به هیچ کودکی
  // نشان داده نمی‌شدند — کل آموزش خواندنِ واقعی مرده بود.
  //
  // به‌جایش از هر مهارت نمونه برمی‌داریم و ترتیب اصلی را نگه
  // می‌داریم. مهارت‌های رمزگشایی اولویت دارند چون هدف درس‌اند؛
  // شناخت حرف مقدمه است، نه مقصد.
  // ⚠ «یکی از هر نوع» برای صداکشی غلط است: سه گِرد blend-word با
  // سختی‌های متفاوت وجود دارد (سه‌صدایی ساده، چهارصدایی، دوبخشی) و
  // نگه‌داشتن فقط یکی باعث می‌شد ۵۷ واژهٔ چندبخشی هرگز دیده نشوند و
  // بانک واژگان به ۲۵ واژهٔ تکراری فرو بریزد. تمایز بر پایهٔ سختی است.
  const variantKey = (r) =>
    r.kindName === 'blend-word'
      ? `blend-${r.display?.parts?.length ?? 0}`
      : r.kindName;
  const PRIORITY = ['blend-word', 'syllable-build', 'segment-count'];
  const picked = [];
  const used = new Set();

  // ۱) یکی از هر مهارت رمزگشایی
  for (const kind of PRIORITY) {
    const i = rounds.findIndex(
      (r, k) =>
        !used.has(k) &&
        r.kindName === kind &&
        !picked.some((j) => variantKey(rounds[j]) === variantKey(r)),
    );
    if (i >= 0 && picked.length < cap) {
      picked.push(i);
      used.add(i);
    }
  }
  // ۲) یکی از هر مهارت دیگر، به ترتیب ظهور
  for (const [i, r] of rounds.entries()) {
    if (picked.length >= cap) break;
    if (used.has(i)) continue;
    if (picked.some((k) => variantKey(rounds[k]) === variantKey(r))) continue;
    picked.push(i);
    used.add(i);
  }
  // ۳) اگر هنوز جا هست، از ابتدا پر کن
  for (const [i] of rounds.entries()) {
    if (picked.length >= cap) break;
    if (used.has(i)) continue;
    picked.push(i);
    used.add(i);
  }

  return picked.sort((a, b) => a - b).map((i) => rounds[i]);
}
