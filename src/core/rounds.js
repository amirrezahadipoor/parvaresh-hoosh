// موتور گِرد — یک تعریفِ گِرد را به یک پرسشِ قابل‌بازی تبدیل می‌کند.
//
// تفاوت بنیادی با نسخهٔ قبلی:
// نسخهٔ قبلی عنوان درس را regex می‌کرد و از روی چند کلمه بازی می‌ساخت
// (`titlePlan()`), برای همین درس‌های بدون محتوا هم «کار می‌کردند».
// اینجا هر گِرد باید نوع مشخص و دادهٔ خودش را داشته باشد. نوع ناشناخته
// یعنی خطا — نه حدس زدن.

import { ALPHABET } from '../data/alphabet.js';
import { STAGED_WORDS } from '../data/word-bank.js';
import { teachRank } from '../data/neshaneh.js';
import { SHAPES, CATEGORIES, COLOR_HEX, GEO } from './svg.js';

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
export function buildRound(round, track) {
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
        display: { kind: 'text', value: '🔊' },
        options: buildOptions(round.answer, pool, n).map((v) => ({ label: v, value: v })),
        answer: round.answer,
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
        display: { kind: 'text', value: round.letter },
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
        display: null,
        options: buildOptions(target, pool, n).map((v) => ({ label: toFa(v), value: v })),
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
