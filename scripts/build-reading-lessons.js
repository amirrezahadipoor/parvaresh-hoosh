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
import { pickWords } from '../src/data/phonics.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// حرکت‌ها و نیم‌فاصله در سنجش «خواندنی بودن» شمرده نمی‌شوند.
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
      prompt: 'صداها را به هم بچسبان. کدام کلمه می‌شود؟',
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
        prompt: 'صداها را به هم بچسبان. کدام کلمه می‌شود؟',
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

const header = `// تولیدشده با scripts/build-reading-lessons.js — دستی ویرایش نکنید.
//
// هر درس فقط از حروفی ساخته شده که کلیپ صوتی واقعی دارند.
// حروف بدون صدا: ${skipped.length ? skipped.map((s) => s.letter).join(' ') : 'هیچ‌کدام — هر ۳۲ حرف صدا دارند'}

`;

const out = `${header}export const READING_LESSONS = ${JSON.stringify(lessons, null, 2)};\n`;

fs.mkdirSync(path.join(ROOT, 'src/data/lessons'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'src/data/lessons/reading.js'), out);

const roundCount = lessons.reduce((s, l) => s + l.rounds.length, 0);
console.log(`نوشته شد: ${lessons.length} درس خواندن، ${roundCount} گِرد، از ${usable.length} حرف.`);
if (skippedWordRounds.length) {
  console.log(`گِرد کلمه ساخته نشد (کلمهٔ خواندنی نبود): ${skippedWordRounds.join('، ')}`);
}
if (skipped.length) console.log(`رد شد (بدون صدا): ${skipped.map((s) => s.letter).join(' ')}`);
