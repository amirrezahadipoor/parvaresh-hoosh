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
import { SHAPES, SHAPE_NAMES, CATEGORIES, TRAITS, COLOR_HEX, GEO } from './svg.js';
import {
  EN_ALPHABET,
  EN_PICTURE_WORDS,
  EN_COLORS,
  EN_NUMBERS,
  CVC_FAMILIES,
  SIGHT_WORD_FA,
  TRANSLATABLE_SIGHT_WORDS,
} from '../data/english.js';

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

export function buildRound(round, track) {
  return withCues(buildRoundInner(round, track), round);
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
      const target = pick(EN_PICTURE_WORDS);
      const wrong = EN_PICTURE_WORDS.filter((w) => w.en !== target.en).map((w) => w.en);
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
      const target = pick(EN_PICTURE_WORDS);
      const wrong = EN_PICTURE_WORDS.filter((w) => w.en !== target.en).map((w) => w.pic);
      return {
        type: 'choice',
        prompt: round.prompt.replace('{w}', target.en),
        display: { kind: 'latin', value: target.en },
        options: buildOptions(target.pic, wrong, n).map((v) => ({
          label: EN_PICTURE_WORDS.find((w) => w.pic === v)?.en ?? v,
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
      const others = SHAPE_NAMES.filter((x) => !members.includes(x));
      if (others.length < n - 1) return null;
      return {
        type: 'choice',
        prompt: round.prompt.replace('{t}', trait),
        display: null,
        options: buildOptions(answer, others, n).map((v) => ({ label: v, value: v, pic: v })),
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
        options: buildOptions(cat, wrong, n).map((v) => ({ label: v, value: v })),
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

    case 'pattern-next': {
      const pool = round.unit === 'color' ? Object.keys(COLOR_HEX) : GEO_NAMES;
      return {
        type: 'choice',
        prompt: round.prompt,
        display: { kind: 'sequence', unit: round.unit, items: round.sequence },
        options: buildOptions(round.answer, pool, Math.min(n, pool.length)).map((v) => ({
          label: v,
          value: v,
          swatch: round.unit === 'color' ? COLOR_HEX[v] : null,
          shape: round.unit === 'shape' ? v : null,
        })),
        answer: round.answer,
      };
    }

    case 'odd-one-out':
      return {
        type: 'choice',
        prompt: round.prompt,
        display: null,
        options: shuffle(round.items).map((v) => ({ label: v, value: v })),
        answer: round.answer,
        because: round.because,
      };

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

    default:
      // هرگز حدس نمی‌زنیم. اعتبارسنج باید جلوی رسیدن به اینجا را گرفته باشد.
      throw new Error(`نوع گِرد پشتیبانی نمی‌شود: ${round.kind}`);
  }
}

/** همهٔ گِردهای یک درس را برای یک ردهٔ سنی می‌سازد. */
export function buildLesson(lesson, track) {
  const rounds = lesson.rounds.map((r) => buildRound(r, track));
  // ردهٔ سنی تعداد گِرد را هم تعیین می‌کند: کودک کوچک‌تر، نشست کوتاه‌تر.
  return rounds.slice(0, Math.max(3, track.roundsPerLesson));
}
