// درس‌های خواندن را از روی حروف الفبا و کلیپ‌های صوتیِ واقعاً موجود می‌سازد.
//
// اگر حرفی کلیپ صوتی نداشته باشد، درس آن ساخته نمی‌شود — نه اینکه با
// محتوای ساختگی پر شود. خروجی: src/data/lessons/reading.js
//
// اجرا:  node scripts/build-reading-lessons.js

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALPHABET } from '../src/data/alphabet.js';
import { NARRATION } from '../src/data/narration.js';
import { NESHANEH_LESSONS, teachRank } from '../src/data/neshaneh.js';
import { STAGED_WORDS } from '../src/data/word-bank.js';
import { pickSentences } from '../src/data/sentences.js';
import { pickWords } from '../src/data/phonics.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// حرکت‌ها و نیم‌فاصله در سنجش «خواندنی بودن» شمرده نمی‌شوند.
// بیشترین تعداد گزینه در بین رده‌های سنی (۷ تا ۸ سال = ۴).
// هر فیلتر داده باید به این گره بخورد، نه به عددی دلخواه.
const MAX_OPTIONS = 4;

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const toFaNum = (x) => String(x).replace(/\d/g, (d) => FA_DIGITS[+d]);

const SKIP_CHARS = new Set(['آ', 'ء', 'ٔ', '\u200c', 'ـ', 'َ', 'ِ', 'ُ', 'ّ', 'ْ']);
const skippedWordRounds = [];

const soundLine = (a) => `صدای حرف ${a.name}`;
const traceLine = (a) => `با انگشت روی حرف ${a.letter} بکش`;

// حروفی که هر دو کلیپ (صدا و خط‌کشیدن) را دارند.
const usable = ALPHABET.filter((a) => NARRATION[soundLine(a)] && NARRATION[traceLine(a)]);
const skipped = ALPHABET.filter((a) => !(NARRATION[soundLine(a)] && NARRATION[traceLine(a)]));

// گروه‌بندی بر اساس درس‌های واقعی کتاب فارسی اول، نه ترتیب الفبا.
// کتاب در هر درس ۱ تا ۲ نشانه می‌دهد؛ ما دو درس کتاب را در یک درس بازی
// ادغام می‌کنیم تا نشست ۵-۶ دقیقه‌ای پر شود، ولی ترتیب حفظ می‌شود.
const byLetter = new Map(usable.map((a) => [a.letter, a]));
const ordered = [];
for (const nl of NESHANEH_LESSONS) {
  const have = nl.letters.map((l) => byLetter.get(l)).filter(Boolean);
  if (have.length) ordered.push({ letters: have, label: nl.label });
}
// یک نشانهٔ کتاب = یک درس بازی.
//
// پیش‌تر دو نشانه در یک درس ادغام می‌شد تا نشست طولانی‌تر شود، ولی این
// کار نصف درس‌ها را حذف می‌کرد و هر درس را شلوغ‌تر می‌ساخت. پژوهش
// می‌گوید دامنهٔ توجه این سن ۸ تا ۱۲ دقیقه است و نشست‌های *کوتاه‌ترِ
// پرتکرار* بهتر از نشست‌های طولانی‌اند. پس درس‌ها کوچک و پرشمار می‌شوند.
const groups = ordered.map((c) => ({ letters: c.letters, labels: [c.label] }));

const lessons = groups.map((grp, gi) => {
  const group = grp.letters;
  const letters = group.map((a) => a.letter);
  const id = `reading-letters-${String(gi + 1).padStart(2, '0')}`;

  // گِرد‌های درس: هر حرف یک بار «شنیدن صدا» و یک بار «خط کشیدن»،
  // و در پایان یک گِرد «کلمه با این حرف شروع می‌شود؟».
  const rounds = [];
  for (const a of group) {
    rounds.push({
      kind: 'letter-sound',
      letter: a.letter,
      name: a.name,
      prompt: `کدام یکی حرف «${a.name}» است؟`,
      speak: soundLine(a),
      answer: a.letter,
      distractorPool: 'letters',
    });
  }
  for (const a of group) {
    rounds.push({
      kind: 'letter-trace',
      letter: a.letter,
      name: a.name,
      prompt: `با انگشت روی حرف «${a.letter}» بکش`,
      speak: traceLine(a),
    });
  }
  // گِرد «کدام کلمه با این حرف شروع می‌شود؟» فقط وقتی ساخته می‌شود که
  // کلمه‌ای پیدا شود که *همهٔ حروفش* تا این درس آموزش داده شده باشد.
  // کودکی که هنوز «ش» را ندیده، نباید «ورزش» را به‌عنوان گزینه ببیند.
  const taughtSoFar = Math.max(...letters.map(teachRank));
  const readable = (w) =>
    [...w].every((ch) => {
      if (SKIP_CHARS.has(ch)) return true;
      const r = teachRank(ch);
      return r === 999 || r <= taughtSoFar;
    });

  for (const a of group) {
    // کلمه از واژگان مرحله‌ای انتخاب می‌شود، نه از فهرست عمومی.
    const candidates = STAGED_WORDS.filter((w) => w.startsWith(a.letter));
    const ok = candidates.filter(readable);
    if (!ok.length) {
      skippedWordRounds.push(`${a.letter} (درس ${gi + 1})`);
      continue;
    }
    rounds.push({
      kind: 'letter-word',
      letter: a.letter,
      name: a.name,
      prompt: `کدام کلمه با حرف «${a.letter}» شروع می‌شود؟`,
      answer: ok[0],
      readablePool: true,
      distractorPool: 'words',
    });
  }

  // مهارت‌های افزوده — فقط وقتی داده اجازه بدهد.
  // قانون پروژه: مولد هر گِردی را که نتواند صادقانه بسازد، رد می‌کند.
  const readablePool = STAGED_WORDS.filter(readable);
  for (const a of group) {
    const withL = readablePool.filter((w) => w.includes(a.letter));
    const without = readablePool.filter((w) => !w.includes(a.letter));
    // ۴ گزینه بیشترین حالت است (ردهٔ ۷–۸ سال)، پس ۳ گزینهٔ نادرست لازم است.
    if (withL.length && without.length >= 3) {
      rounds.push({
        kind: 'letter-in-word',
        letter: a.letter,
        name: a.name,
        prompt: `کدام کلمه حرف «${a.letter}» را دارد؟`,
      });
    }
  }
  // ── صداکشی: قلب آموزش خواندن ────────────────────────────────────
  // مولد فقط وقتی این گِردها را می‌سازد که واژگان کافی با نقشهٔ صدا
  // موجود باشد. اگر نتواند صادقانه بسازد، رد می‌کند (قانون پروژه).
  const lastLetter = letters[letters.length - 1];
  const limit = teachRank(lastLetter);
  const soundReadable = (w) =>
    [...w].every((ch) => {
      if (SKIP_CHARS.has(ch)) return true;
      const r = teachRank(ch);
      return r === 999 || r <= limit;
    });

  // سختی صداکشی با پیشرفت درس بالا می‌رود — نه اینکه سه سطح در یک
  // درس سر جای محدود بجنگند. سقف گِردِ هر درس ۴ تا ۶ است، پس اگر
  // هر سه سطح را همیشه اضافه کنیم فقط ساده‌ترین می‌ماند و کودک
  // بیست درس پشت سر هم همان ۲۶ واژهٔ سه‌صدایی را می‌بیند.
  //
  // درس ۳–۶ : سه‌صدایی با مصوت بلند (ساده‌ترین — مصوت نوشته می‌شود)
  // درس ۷–۱۱ : + مصوت کوتاه (سخت‌تر — نوشته نمی‌شود)
  // درس ۱۲+ : واژهٔ دوبخشی (سخت‌ترین)
  const stage = gi + 1;
  const blendSpec =
    stage >= 12
      ? { maxSounds: 6, maxSyllables: 2, minSyllables: 2, longVowelOnly: false }
      : stage >= 7
        ? { maxSounds: 4, maxSyllables: 1, minSyllables: 1, longVowelOnly: false }
        : { maxSounds: 3, maxSyllables: 1, minSyllables: 1, longVowelOnly: true };

  if (pickWords({ ...blendSpec, readable: soundReadable }).length >= 4) {
    rounds.push({
      kind: 'blend-word',
      letter: lastLetter,
      ...blendSpec,
      prompt: 'کدام کلمه می‌شود؟',
    });
  }

  // یک سطح آسان‌تر هم نگه می‌داریم تا مرور باشد و کودک جا نماند.
  if (stage >= 7) {
    const easier =
      stage >= 12
        ? { maxSounds: 4, maxSyllables: 1, minSyllables: 1, longVowelOnly: false }
        : { maxSounds: 3, maxSyllables: 1, minSyllables: 1, longVowelOnly: true };
    if (pickWords({ ...easier, readable: soundReadable }).length >= 4) {
      rounds.push({
        kind: 'blend-word',
        letter: lastLetter,
        ...easier,
        prompt: 'کدام کلمه می‌شود؟',
      });
    }
  }

  // بخش کردن: «ما» + «دَر» ← مادر (روش مدرسهٔ ایران)
  const syl = pickWords({ maxSyllables: 3, readable: soundReadable }).filter(
    (w) => w.syllables.length >= 2,
  );
  if (syl.length >= 3) {
    rounds.push({
      kind: 'syllable-build',
      letter: lastLetter,
      prompt: 'بخش‌ها را به ترتیب بچین',
    });
  }

  // گام ۵ — تجزیه: چند صدا دارد؟ (پس از ترکیب می‌آید)
  const segPool = pickWords({ maxSounds: 5, readable: soundReadable });
  if (segPool.length >= 6) {
    rounds.push({
      kind: 'segment-count',
      letter: lastLetter,
      maxSounds: 5,
      prompt: 'این کلمه چند صدا دارد؟',
    });
  }

  // شمردن حرف‌ها: از درسی که واژگان کافی جمع شده باشد.
  if (readablePool.filter((w) => w.length >= 2 && w.length <= 6).length >= 6) {
    rounds.push({
      kind: 'count-letters',
      letter: letters[letters.length - 1],
      prompt: 'کلمهٔ {w} چند حرف دارد؟',
    });
  }

  return {
    id,
    domain: 'reading',
    order: gi + 1,
    title: `نشانه‌های ${letters.join(' ')}`,
    schoolLessons: grp.labels,
    goal: `کودک صدای حرف‌های ${letters.join('، ')} را می‌شناسد، شکلشان را می‌نویسد و با آن‌ها کلمه می‌خواند.`,
    letters,
    minutes: 6,
    rounds,
    parentNote: `بعد از بازی، دنبال چیزهایی در خانه بگردید که با ${letters
      .slice(0, 2)
      .map((l) => `«${l}»`)
      .join(' یا ')} شروع می‌شوند.`,
    reviewDays: [1, 3, 7],
  };
});

// ── درس‌های تمرینِ خواندن ────────────────────────────────────────
//
// چرا لازم است: تعداد درس‌های نشانه به کتاب گره خورده (۲۰ نشانه) و
// بیشتر نمی‌شود. ولی کودک بعد از یادگیری نشانه باید *بخواند* — و
// خواندن با تکرارِ فاصله‌دار جا می‌افتد، نه با یک بار دیدن.
//
// هر درس تمرین روی حروفِ تا آن نقطه تکیه می‌کند و فقط صداکشی،
// بخش‌کردن و شمردن صدا دارد — بدون معرفی حرف تازه. مولد هر درسی را
// که واژگان کافی نداشته باشد رد می‌کند، مثل بقیهٔ پروژه.
const practice = [];
// گام ۱ یعنی پس از *هر* نشانه یک تمرین. با گام ۲ نصف درس‌ها ساخته
// نمی‌شد و بین دو تمرین چهار نشانهٔ تازه فاصله می‌افتاد.
for (let after = 2; after < groups.length; after += 1) {
  const letters = groups.slice(0, after + 1).flatMap((g) => g.letters.map((a) => a.letter));
  const limit = Math.max(...letters.map(teachRank));
  const readableHere = (w) =>
    [...w].every((ch) => {
      if (SKIP_CHARS.has(ch)) return true;
      const r = teachRank(ch);
      return r === 999 || r <= limit;
    });

  const rounds = [];
  // سه سطح سختی، هر کدام فقط اگر واژهٔ کافی باشد.
  const specs = [
    { maxSounds: 3, maxSyllables: 1, minSyllables: 1, longVowelOnly: true },
    { maxSounds: 4, maxSyllables: 1, minSyllables: 1, longVowelOnly: false },
    { maxSounds: 6, maxSyllables: 2, minSyllables: 2, longVowelOnly: false },
  ];
  for (const spec of specs) {
    if (pickWords({ ...spec, readable: readableHere }).length >= 4) {
      rounds.push({ kind: 'blend-word', letter: letters[letters.length - 1], ...spec, prompt: 'کدام کلمه می‌شود؟' });
    }
  }
  const syl = pickWords({ maxSyllables: 3, readable: readableHere }).filter((w) => w.syllables.length >= 2);
  if (syl.length >= 3) {
    rounds.push({ kind: 'syllable-build', letter: letters[letters.length - 1], prompt: 'بخش‌ها را به ترتیب بچین' });
  }
  if (pickWords({ maxSounds: 5, readable: readableHere }).length >= 6) {
    rounds.push({ kind: 'segment-count', letter: letters[letters.length - 1], maxSounds: 5, prompt: 'این کلمه چند صدا دارد؟' });
  }
  const wordPool = STAGED_WORDS.filter(readableHere);
  if (wordPool.filter((w) => w.length >= 2 && w.length <= 6).length >= 6) {
    rounds.push({ kind: 'count-letters', letter: letters[letters.length - 1], prompt: 'کلمهٔ {w} چند حرف دارد؟' });
  }

  // درسِ سه‌گِردی ارزش یک قدم روی نقشه را ندارد.
  if (rounds.length < 4) continue;

  const shown = groups[after].letters.map((a) => a.letter).join(' ');
  practice.push({
    id: `reading-read-${String(practice.length + 1).padStart(2, '0')}`,
    domain: 'reading',
    // پس از درسِ نشانهٔ متناظر می‌نشیند.
    order: after + 1 + (practice.length + 1) / 100,
    title: `خواندن تا ${shown}`,
    goal: `کودک با حرف‌هایی که تا اینجا آموخته کلمه‌های تازه می‌خواند.`,
    letters,
    minutes: 6,
    rounds,
    parentNote:
      'این درس حرف تازه‌ای ندارد؛ تمرین خواندن است. اگر کند می‌خواند اشکالی ندارد — سرعت بعد از دقت می‌آید.',
    reviewDays: [1, 3, 7],
  });
}

// ── درس‌های مرور ────────────────────────────────────────────────────
// تکرار فاصله‌دار (spaced repetition): نشانه‌ای که ده درس پیش آموخته
// شده اگر دوباره دیده نشود فراموش می‌شود. درس‌های تمرین بالا فقط
// «خواندن با حروف تا اینجا» هستند و ممکن است سراغ حرف‌های قدیمی
// نروند؛ این درس‌ها عمداً روی یک پنجرهٔ مشخص از نشانه‌های *گذشته*
// تمرکز می‌کنند.
const review = [];
for (let end = 5; end < groups.length; end += 4) {
  // پنجرهٔ مرور: پنج نشانهٔ پیش از این نقطه.
  const start = Math.max(0, end - 5);
  const windowGroups = groups.slice(start, end);
  // شیءِ کاملِ حرف لازم است، نه فقط نویسه: letter-sound به name و
  // speak و answer هم نیاز دارد (همان‌طور که درس‌های نشانه می‌سازند).
  const windowAlpha = windowGroups.flatMap((g) => g.letters);
  const letters = groups.slice(0, end).flatMap((g) => g.letters.map((a) => a.letter));
  const readableHere = (w) =>
    [...w].every((ch) => SKIP_CHARS.has(ch) || teachRank(ch) === 999 || letters.includes(ch));

  const rounds = [];
  // یک گِرد صدا و یک گِرد کلمه برای هر حرفِ داخل پنجره — تا حرف‌های
  // قدیمی دوباره جلوی چشم بیایند.
  for (const a of windowAlpha.slice(0, 3)) {
    rounds.push({
      kind: 'letter-sound',
      letter: a.letter,
      name: a.name,
      // ⚠ letter-sound هیچ جای‌نگهداری جایگزین نمی‌کند؛ متن باید
      // همین‌جا کامل ساخته شود.
      prompt: `کدام یکی حرف «${a.name}» است؟`,
      speak: soundLine(a),
      answer: a.letter,
      distractorPool: 'letters',
    });
  }
  for (const a of windowAlpha.slice(0, 2)) {
    const letter = a.letter;
    // ⚠ سازندهٔ letter-in-word استخر را با teachRank(letter) محدود
    // می‌کند، نه با حروف آموخته‌شده تا اینجا. برای حرفی که رتبه‌اش
    // پایین است استخر بسیار کوچک می‌شود، پس همان منطق باید اینجا
    // بازتاب پیدا کند وگرنه buildRound سر ردهٔ چهارگزینه‌ای پرتاب
    // می‌کند. آستانه به بیشترین تعداد گزینه (۴) گره خورده، نه عدد دلخواه.
    const rank = teachRank(letter);
    const inRank = (w) =>
      [...w].every((ch) => SKIP_CHARS.has(ch) || teachRank(ch) === 999 || teachRank(ch) <= rank);
    const pool = STAGED_WORDS.filter(inRank);
    const withL = pool.filter((w) => w.includes(letter));
    const without = pool.filter((w) => !w.includes(letter));
    if (withL.length >= 1 && without.length >= MAX_OPTIONS - 1) {
      rounds.push({
        kind: 'letter-in-word',
        letter,
        name: a.name,
        prompt: `کدام کلمه حرف «${letter}» را دارد؟`,
      });
    }
  }
  if (pickWords({ maxSounds: 4, maxSyllables: 2, readable: readableHere }).length >= 6) {
    rounds.push({
      kind: 'blend-word',
      letter: letters[letters.length - 1],
      maxSounds: 4,
      maxSyllables: 2,
      longVowelOnly: false,
      prompt: 'کدام کلمه می‌شود؟',
    });
  }
  if (rounds.length < 4) continue;

  const shown = windowGroups.map((g) => g.letters.map((a) => a.letter).join(' ')).join(' ');
  review.push({
    id: `reading-review-${String(review.length + 1).padStart(2, '0')}`,
    domain: 'reading',
    order: end + 0.5 + (review.length + 1) / 1000,
    title: `مرور ${shown}`,
    goal: 'کودک نشانه‌هایی را که چند درس پیش آموخته دوباره مرور می‌کند.',
    letters,
    minutes: 5,
    rounds,
    parentNote:
      'درس مرور. حرفی که چند هفته پیش یاد گرفته اگر دوباره دیده نشود فراموش می‌شود — به همین دلیل این درس عمداً سراغ حرف‌های قدیمی‌تر می‌رود.',
    reviewDays: [1, 3, 7],
  });
}

// ── درس‌های جمله ────────────────────────────────────────────────────
// پل میان کلمه‌خوانی و درک مطلب. تا اینجا بزرگ‌ترین واحدی که کودک
// می‌خواند «کلمه» بود؛ ولی خواندن یعنی رسیدن به معنا و معنا در جمله
// ساخته می‌شود.
//
// این درس‌ها فقط جایی ساخته می‌شوند که جملهٔ خواندنیِ کافی وجود داشته
// باشد — یعنی از حدود نشانهٔ چهاردهم به بعد، وقتی نام جانوران
// خواندنی می‌شود. زودتر از آن، جمله‌ای برای خواندن نیست.
const sentences = [];
for (let end = 14; end <= groups.length; end += 3) {
  const letters = groups.slice(0, end).flatMap((g) => g.letters.map((a) => a.letter));
  const last = letters[letters.length - 1];
  const two = pickSentences({ maxRank: teachRank(last), parts: 2 });
  const three = pickSentences({ maxRank: teachRank(last), parts: 3 });

  const rounds = [];
  // تطبیق جمله با تصویر، در هر دو جهت. هر دو لازم است: شناختن با
  // تولید یکی نیست.
  if (two.length >= MAX_OPTIONS) {
    rounds.push({ kind: 'sentence-pic', letter: last, parts: 2, prompt: 'کدام تصویر به این جمله می‌خورد؟' });
    rounds.push({ kind: 'sentence-pic', letter: last, parts: 2, prompt: 'کدام تصویر به این جمله می‌خورد؟' });
    rounds.push({ kind: 'pic-sentence', letter: last, prompt: 'کدام جمله درست است؟' });
  }
  // چیدن واژه‌ها: قاعدهٔ «فعل آخر می‌آید» را کودک خودش کشف می‌کند.
  if (two.length >= 3) {
    rounds.push({ kind: 'sentence-build', letter: last, parts: 2, prompt: 'کلمه‌ها را به ترتیب بچین' });
  }
  if (three.length >= 2) {
    rounds.push({ kind: 'sentence-build', letter: last, parts: 3, prompt: 'کلمه‌ها را به ترتیب بچین' });
    rounds.push({ kind: 'sentence-pic', letter: last, parts: 3, prompt: 'کدام تصویر به این جمله می‌خورد؟' });
  }
  if (rounds.length < 4) continue;

  sentences.push({
    id: `reading-sentence-${String(sentences.length + 1).padStart(2, '0')}`,
    domain: 'reading',
    order: end + 0.75 + (sentences.length + 1) / 1000,
    title: `جمله بخوان ${toFaNum(sentences.length + 1)}`,
    goal: 'کودک جملهٔ ساده را می‌خواند و معنایش را به تصویر وصل می‌کند.',
    letters,
    minutes: 6,
    rounds,
    parentNote:
      'اولین جمله‌خوانی. گزینه‌های نادرست عمداً واژهٔ مشترک دارند («سگ دوید» کنار «سگ خوابید») تا کودک مجبور شود کل جمله را بخواند، نه اینکه از روی کلمهٔ اول حدس بزند.',
    reviewDays: [1, 3, 7],
  });
}

const all = [...lessons, ...practice, ...review, ...sentences].sort((a, b) => a.order - b.order);
// شماره‌گذاری دوباره، تا مسیر سفر پیوسته بماند.
all.forEach((l, i) => {
  l.order = i + 1;
});

const header = `// تولیدشده با scripts/build-reading-lessons.js — دستی ویرایش نکنید.
//
// هر درس فقط از حروفی ساخته شده که کلیپ صوتی واقعی دارند.
// حروف بدون صدا: ${skipped.length ? skipped.map((s) => s.letter).join(' ') : 'هیچ‌کدام — هر ۳۲ حرف صدا دارند'}

`;

const out = `${header}export const READING_LESSONS = ${JSON.stringify(all, null, 2)};\n`;

fs.mkdirSync(path.join(ROOT, 'src/data/lessons'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'src/data/lessons/reading.js'), out);

const roundCount = all.reduce((s, l) => s + l.rounds.length, 0);
console.log(`نوشته شد: ${all.length} درس خواندن (${lessons.length} نشانه + ${practice.length} تمرین + ${review.length} مرور + ${sentences.length} جمله)، ${roundCount} گِرد، از ${usable.length} حرف.`);
if (skippedWordRounds.length) {
  console.log(`گِرد کلمه ساخته نشد (کلمهٔ خواندنی نبود): ${skippedWordRounds.join('، ')}`);
}
if (skipped.length) console.log(`رد شد (بدون صدا): ${skipped.map((s) => s.letter).join(' ')}`);
