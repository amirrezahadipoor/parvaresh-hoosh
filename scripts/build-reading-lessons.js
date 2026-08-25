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
import { pickSentences, buildPassages } from '../src/data/sentences.js';
import { pickWords, rhymeFamilies, firstSound, SOUND_MAP } from '../src/data/phonics.js';
import { SHAPE_NAMES } from '../src/core/svg.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// حرکت‌ها و نیم‌فاصله در سنجش «خواندنی بودن» شمرده نمی‌شوند.
// بیشترین تعداد گزینه در بین رده‌های سنی (۷ تا ۸ سال = ۴).
// هر فیلتر داده باید به این گره بخورد، نه به عددی دلخواه.
const MAX_OPTIONS = 4;

// واژه‌ای که هم خواندنی است هم تصویر دارد — سقفِ واقعیِ همهٔ
// تمرین‌های «کلمه ↔ معنا». تا ۲۶ شکل تازه کشیده نشد این عدد ۳۴ بود
// و بیشترِ درس‌های زیر اصلاً ساخته نمی‌شدند.
const PICTURED = new Set(SHAPE_NAMES);

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
for (let end = 5; end < groups.length; end += 2) {
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
for (let end = 14; end <= groups.length; end += 1) {
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

// ── درس‌های آگاهی واجی: قافیه و صدای اول ────────────────────────────
//
// چرا اینها *پیش از* بقیه لازم بودند و نبودند:
// جدول Reading Rockets («سنی که ۸۰–۹۰٪ کودکان مهارت را دارند»)
// تشخیص قافیه را در ۵ سالگی و جدا کردن صدای اول را در ۵٫۵ سالگی
// می‌گذارد — هر دو *پیش از* بخش‌کردن (۵) و تجزیهٔ واج (۶). برنامه
// مستقیم از «این حرف کدام است؟» به صداکشی می‌پرید، یعنی یک پلهٔ
// کاملِ رشدی جا افتاده بود.
//
// این درس‌ها زود شروع می‌شوند (از نشانهٔ ششم) چون به خواندن نیاز
// ندارند: هر دو گِرد تصویری‌اند.
const phono = [];
for (let end = 6; end <= groups.length; end += 1) {
  const letters = groups.slice(0, end).flatMap((g) => g.letters.map((a) => a.letter));
  const last = letters[letters.length - 1];
  const limit = teachRank(last);
  const readableHere = (w) =>
    [...w].every((ch) => {
      if (SKIP_CHARS.has(ch)) return true;
      const r = teachRank(ch);
      return r === 999 || r <= limit;
    });
  const ok = (w) => readableHere(w) && PICTURED.has(w);

  const rounds = [];
  // قافیه: دست‌کم یک خانوادهٔ دوتایی و به‌اندازهٔ کافی واژهٔ بیرونی.
  const fams = rhymeFamilies(ok);
  const pairs = [...fams.values()].filter((ws) => ws.length >= 2);
  const outside = [...fams.entries()].filter(([, ws]) => ws.length < 2).flatMap(([, ws]) => ws);
  if (pairs.length >= 1 && outside.length + pairs.length >= MAX_OPTIONS) {
    rounds.push({ kind: 'rhyme-pick', letter: last, prompt: 'کدام با این هم‌آهنگ است؟' });
    if (pairs.length >= 2) {
      rounds.push({ kind: 'rhyme-pick', letter: last, prompt: 'کدام با این هم‌آهنگ است؟' });
    }
  }
  // صدای اول: باید MAX_OPTIONS حرفِ آغازینِ متفاوت وجود داشته باشد،
  // وگرنه buildRound سر ردهٔ چهارگزینه‌ای پرتاب می‌کند.
  const firsts = new Set(
    SOUND_MAP.filter((e) => ok(e.word))
      .map((e) => firstSound(e))
      .filter((f) => f.g && !f.v && teachRank(f.g) <= limit)
      .map((f) => f.g),
  );
  if (firsts.size >= MAX_OPTIONS) {
    rounds.push({ kind: 'first-sound', letter: last, prompt: 'این کلمه با کدام صدا شروع می‌شود؟' });
    rounds.push({ kind: 'first-sound', letter: last, prompt: 'این کلمه با کدام صدا شروع می‌شود؟' });
  }
  // یک گِرد صداکشیِ ساده هم می‌آید تا درس فقط شنیداری نماند.
  if (pickWords({ maxSounds: 3, maxSyllables: 1, longVowelOnly: true, readable: readableHere }).length >= MAX_OPTIONS) {
    rounds.push({
      kind: 'blend-word', letter: last,
      maxSounds: 3, maxSyllables: 1, minSyllables: 1, longVowelOnly: true,
      prompt: 'کدام کلمه می‌شود؟',
    });
  }
  if (rounds.length < 4) continue;

  phono.push({
    id: `reading-sound-${String(phono.length + 1).padStart(2, '0')}`,
    domain: 'reading',
    order: end + 0.2 + (phono.length + 1) / 1000,
    title: `بازی صداها ${toFaNum(phono.length + 1)}`,
    goal: 'کودک قافیه را می‌شنود و صدای اولِ کلمه را جدا می‌کند.',
    letters,
    minutes: 5,
    rounds,
    parentNote:
      'این درس نوشتن و خواندن نمی‌خواهد؛ گوش را تربیت می‌کند. کودکی که «گربه» و «پنجره» را هم‌آهنگ می‌شنود، بعداً کلمه‌های تازه را راحت‌تر می‌خواند.',
    reviewDays: [1, 3, 7],
  });
}

// ── درس‌های واژه‌خوانی: از نوشته به معنا ────────────────────────────
//
// حفرهٔ بزرگ: کودک صدا می‌کشید («ب ا د») ولی هیچ‌جا لازم نبود بفهمد
// «باد» یعنی چه. FCRR این را جدا می‌شمارد: رمزگشایی یک مهارت است و
// معنا مهارتی دیگر. اینجا هر دو جهت تمرین می‌شود، و در پایان
// «ساختن» واژه — که رمزگذاری است و سخت‌ترین گام.
const wordLessons = [];
for (let end = 8; end <= groups.length; end += 1) {
  const letters = groups.slice(0, end).flatMap((g) => g.letters.map((a) => a.letter));
  const last = letters[letters.length - 1];
  const limit = teachRank(last);
  const readableHere = (w) =>
    [...w].every((ch) => {
      if (SKIP_CHARS.has(ch)) return true;
      const r = teachRank(ch);
      return r === 999 || r <= limit;
    });
  const pool = SOUND_MAP.map((e) => e.word).filter((w) => readableHere(w) && PICTURED.has(w));

  const rounds = [];
  if (pool.length >= MAX_OPTIONS) {
    rounds.push({ kind: 'word-pic', letter: last, prompt: 'کدام تصویر این کلمه است؟' });
    rounds.push({ kind: 'word-pic', letter: last, prompt: 'کدام تصویر این کلمه است؟' });
    rounds.push({ kind: 'pic-word', letter: last, prompt: 'اسم این تصویر کدام است؟' });
    rounds.push({ kind: 'pic-word', letter: last, prompt: 'اسم این تصویر کدام است؟' });
  }
  // ساختن واژه: فقط واژهٔ سه تا چهار نویسه‌ای، بدون نیم‌فاصله و حرکت.
  const buildable = pool.filter(
    (w) => [...w].every((ch) => !SKIP_CHARS.has(ch)) && w.length >= 3 && w.length <= 4,
  );
  if (buildable.length >= 2) {
    rounds.push({ kind: 'word-build', letter: last, maxLetters: 4, prompt: 'حرف‌ها را بچین تا کلمه بسازی' });
  }
  if (rounds.length < 4) continue;

  wordLessons.push({
    id: `reading-word-${String(wordLessons.length + 1).padStart(2, '0')}`,
    domain: 'reading',
    order: end + 0.35 + (wordLessons.length + 1) / 1000,
    title: `کلمه و معنی ${toFaNum(wordLessons.length + 1)}`,
    goal: 'کودک کلمه را می‌خواند و معنایش را نشان می‌دهد، و خودش کلمه می‌سازد.',
    letters,
    minutes: 6,
    rounds,
    parentNote:
      'خواندن یعنی رسیدن به معنا، نه فقط درست تلفظ کردن. اگر کلمه را درست خواند ولی تصویرش را اشتباه زد، یعنی هنوز دارد «صدا می‌سازد» و معنا نمی‌گیرد — عجله نکنید.',
    reviewDays: [1, 3, 7],
  });
}

// ── درس‌های صدای گم‌شده ──────────────────────────────────────────────
// جانشینی واج (۶٫۵ سالگی): سخت‌ترین کارِ سطح واژه. کودک باید واژه را
// در ذهن نگه دارد، جای خالی را بشنود و پرش کند.
const missing = [];
for (let end = 10; end <= groups.length; end += 2) {
  const letters = groups.slice(0, end).flatMap((g) => g.letters.map((a) => a.letter));
  const last = letters[letters.length - 1];
  const limit = teachRank(last);
  const readableHere = (w) =>
    [...w].every((ch) => {
      if (SKIP_CHARS.has(ch)) return true;
      const r = teachRank(ch);
      return r === 999 || r <= limit;
    });

  const rounds = [];
  if (pickWords({ maxSounds: 4, maxSyllables: 1, readable: readableHere }).length >= 3) {
    rounds.push({ kind: 'which-sound', letter: last, maxSounds: 4, prompt: 'کدام صدا گم شده؟' });
    rounds.push({ kind: 'which-sound', letter: last, maxSounds: 4, prompt: 'کدام صدا گم شده؟' });
  }
  if (pickWords({ maxSounds: 5, readable: readableHere }).length >= 6) {
    rounds.push({ kind: 'segment-count', letter: last, maxSounds: 5, prompt: 'این کلمه چند صدا دارد؟' });
  }
  const syl = pickWords({ maxSyllables: 3, readable: readableHere }).filter((w) => w.syllables.length >= 2);
  if (syl.length >= 3) {
    rounds.push({ kind: 'syllable-build', letter: last, prompt: 'بخش‌ها را به ترتیب بچین' });
  }
  // ⚠ این خانواده روی چهار گِرد می‌ماند و کوتاه‌ترین درس‌های برنامه را
  // می‌سازد. جانشینی واج سخت است، ولی چهار گِرد یعنی درس دو دقیقه‌ای:
  // کودک تازه گرم می‌شود که تمام می‌شود. دو گِردِ سبک‌تر در انتها
  // اضافه می‌شود تا درس به شش برسد و با آسان‌تر تمام شود — ترتیبِ
  // «سخت در میانه، آسان در پایان» حس موفقیت می‌دهد.
  if (pickWords({ maxSounds: 4, readable: readableHere }).length >= 4) {
    rounds.push({ kind: 'first-sound', letter: last, maxSounds: 4, prompt: 'کدام با این صدا شروع می‌شود؟' });
  }
  const rhymers = pickWords({ maxSounds: 5, readable: readableHere });
  if (rhymers.length >= 6) {
    rounds.push({ kind: 'rhyme-pick', letter: last, maxSounds: 5, prompt: 'کدام هم‌آهنگ است؟' });
  }
  if (rounds.length < 4) continue;

  missing.push({
    id: `reading-gap-${String(missing.length + 1).padStart(2, '0')}`,
    domain: 'reading',
    order: end + 0.6 + (missing.length + 1) / 1000,
    title: `صدای گم‌شده ${toFaNum(missing.length + 1)}`,
    goal: 'کودک صدای افتاده را از میان صداهای کلمه پیدا می‌کند.',
    letters,
    minutes: 5,
    rounds,
    parentNote:
      'سخت‌ترین تمرین این بخش است: کودک باید کلمه را در ذهن نگه دارد و جای خالی را پر کند. اگر خسته شد، درس بعد را بازی کنید و هفتهٔ دیگر برگردید.',
    reviewDays: [1, 3, 7],
  });
}

// ── درس‌های درک مطلب ────────────────────────────────────────────────
//
// بالاترین پلهٔ حوزهٔ خواندن و تا امروز غایب بود. کودک جمله را به
// تصویر وصل می‌کرد، ولی هیچ‌جا لازم نبود از دلِ جمله یک جزء را بیرون
// بکشد یا دو جمله را با هم نگه دارد.
//
// از نشانهٔ پانزدهم به بعد، چون به جملهٔ سه‌جزئیِ خواندنی نیاز دارد.
const comprehension = [];
for (let end = 15; end <= groups.length; end += 1) {
  const letters = groups.slice(0, end).flatMap((g) => g.letters.map((a) => a.letter));
  const last = letters[letters.length - 1];
  const limit = teachRank(last);
  const three = pickSentences({ maxRank: limit, parts: 3 });
  const passages = buildPassages(limit);

  const rounds = [];
  if (three.length >= MAX_OPTIONS) {
    rounds.push({ kind: 'wh-question', letter: last, prompt: '{q}' });
    rounds.push({ kind: 'wh-question', letter: last, prompt: '{q}' });
  }
  if (passages.length >= MAX_OPTIONS) {
    rounds.push({ kind: 'passage-read', letter: last, prompt: 'بعد چه کار کرد؟' });
    rounds.push({ kind: 'passage-read', letter: last, prompt: 'بعد چه کار کرد؟' });
  }
  if (passages.length >= 2) {
    rounds.push({ kind: 'passage-order', letter: last, prompt: 'اول کدام بود؟ به ترتیب بچین' });
  }
  // یک گِرد جمله‌خوانی هم می‌آید تا درس فقط پرسش نباشد.
  if (three.length >= 2) {
    rounds.push({ kind: 'sentence-pic', letter: last, parts: 3, prompt: 'کدام تصویر به این جمله می‌خورد؟' });
  }
  if (rounds.length < 4) continue;

  comprehension.push({
    id: `reading-understand-${String(comprehension.length + 1).padStart(2, '0')}`,
    domain: 'reading',
    order: end + 0.85 + (comprehension.length + 1) / 1000,
    title: `فهمیدن متن ${toFaNum(comprehension.length + 1)}`,
    goal: 'کودک از جمله پاسخ می‌گیرد و دو جمله را با هم دنبال می‌کند.',
    letters,
    minutes: 6,
    rounds,
    parentNote:
      'اینجا دیگر مسئله «درست خواندن» نیست، «فهمیدن» است. اگر جمله را روان خواند ولی پرسش را اشتباه زد، یک بار دیگر با هم بخوانید و بپرسید «کی؟ چی؟» — همین دو پرسش کلید درک مطلب است.',
    reviewDays: [1, 3, 7],
  });
}

// ── درس‌های روان‌خوانی ──────────────────────────────────────────────
//
// آخرین خانوادهٔ حوزهٔ خواندن، و از همه مهم‌تر.
//
// چرا: هر خانوادهٔ بالا *یک* مهارت را تمرین می‌دهد. ولی خواندن یعنی
// همهٔ آن مهارت‌ها با هم و بی‌مکث. FCRR این را «روانی» می‌نامد و
// جدا از رمزگشایی می‌شمارد: کودکی که هر تمرین را جدا درست می‌زند
// می‌تواند سر متنِ پیوسته بماند، چون تا امروز هرگز مجبور نبوده در
// یک نشست از صدا به کلمه به جمله برود.
//
// هر درس عمداً از هر لایه یک گِرد دارد: صدا → کلمه → جمله → معنا.
const fluency = [];
for (let end = 12; end <= groups.length; end += 1) {
  const letters = groups.slice(0, end).flatMap((g) => g.letters.map((a) => a.letter));
  const last = letters[letters.length - 1];
  const limit = teachRank(last);
  const readableHere = (w) =>
    [...w].every((ch) => {
      if (SKIP_CHARS.has(ch)) return true;
      const r = teachRank(ch);
      return r === 999 || r <= limit;
    });
  const pictured = SOUND_MAP.map((e) => e.word).filter((w) => readableHere(w) && PICTURED.has(w));
  const two = pickSentences({ maxRank: limit, parts: 2 });
  const three = pickSentences({ maxRank: limit, parts: 3 });

  const rounds = [];
  // ۱. لایهٔ صدا
  if (pickWords({ maxSounds: 4, maxSyllables: 1, readable: readableHere }).length >= MAX_OPTIONS) {
    rounds.push({
      kind: 'blend-word', letter: last,
      maxSounds: 4, maxSyllables: 1, minSyllables: 1, longVowelOnly: false,
      prompt: 'کدام کلمه می‌شود؟',
    });
  }
  // ۲. لایهٔ کلمه — هر دو جهت
  if (pictured.length >= MAX_OPTIONS) {
    rounds.push({ kind: 'pic-word', letter: last, prompt: 'اسم این تصویر کدام است؟' });
    rounds.push({ kind: 'word-pic', letter: last, prompt: 'کدام تصویر این کلمه است؟' });
  }
  // ۳. لایهٔ جمله
  if (two.length >= MAX_OPTIONS) {
    rounds.push({ kind: 'sentence-pic', letter: last, parts: 2, prompt: 'کدام تصویر به این جمله می‌خورد؟' });
  }
  // ۴. لایهٔ معنا
  if (three.length >= MAX_OPTIONS) {
    rounds.push({ kind: 'wh-question', letter: last, prompt: '{q}' });
  }
  if (rounds.length < 5) continue;

  fluency.push({
    id: `reading-fluent-${String(fluency.length + 1).padStart(2, '0')}`,
    domain: 'reading',
    order: end + 0.95 + (fluency.length + 1) / 1000,
    title: `روان بخوان ${toFaNum(fluency.length + 1)}`,
    goal: 'کودک صدا، کلمه، جمله و معنا را در یک نشست و بی‌مکث به کار می‌برد.',
    letters,
    minutes: 7,
    rounds,
    parentNote:
      'این درس همهٔ مهارت‌های خواندن را با هم می‌آورد: از صدا تا معنا. اگر تک‌تک تمرین‌ها را بلد است ولی اینجا کند می‌شود، طبیعی است — روانی آخرین چیزی است که می‌آید و فقط با تکرار به دست می‌آید.',
    reviewDays: [1, 3, 7],
  });
}

const all = [
  ...lessons, ...practice, ...review, ...sentences,
  ...phono, ...wordLessons, ...missing, ...comprehension, ...fluency,
].sort((a, b) => a.order - b.order);
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
console.log(
  `نوشته شد: ${all.length} درس خواندن (${lessons.length} نشانه + ${practice.length} تمرین + ` +
    `${review.length} مرور + ${sentences.length} جمله + ${phono.length} صداها + ` +
    `${wordLessons.length} کلمه + ${missing.length} گم‌شده + ` +
    `${comprehension.length} درک مطلب + ${fluency.length} روان‌خوانی)، ` +
    `${roundCount} گِرد، از ${usable.length} حرف.`,
);
if (skippedWordRounds.length) {
  console.log(`گِرد کلمه ساخته نشد (کلمهٔ خواندنی نبود): ${skippedWordRounds.join('، ')}`);
}
if (skipped.length) console.log(`رد شد (بدون صدا): ${skipped.map((s) => s.letter).join(' ')}`);
