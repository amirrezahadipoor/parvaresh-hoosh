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

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const soundLine = (a) => `صدای حرف ${a.name}`;
const traceLine = (a) => `با انگشت روی حرف ${a.letter} بکش`;

// حروفی که هر دو کلیپ (صدا و خط‌کشیدن) را دارند.
const usable = ALPHABET.filter((a) => NARRATION[soundLine(a)] && NARRATION[traceLine(a)]);
const skipped = ALPHABET.filter((a) => !(NARRATION[soundLine(a)] && NARRATION[traceLine(a)]));

// چهار حرف در هر درس: کودک ۵ ساله بیش از این را در یک نشست نگه نمی‌دارد.
const GROUP = 4;
const groups = [];
for (let i = 0; i < usable.length; i += GROUP) groups.push(usable.slice(i, i + GROUP));

const lessons = groups.map((group, gi) => {
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
  for (const a of group) {
    if (!a.words || !a.words.length) continue;
    rounds.push({
      kind: 'letter-word',
      letter: a.letter,
      name: a.name,
      prompt: `کدام کلمه با حرف «${a.letter}» شروع می‌شود؟`,
      answer: a.words[0],
      options: a.words.slice(0, 3),
      distractorPool: 'words',
    });
  }

  return {
    id,
    domain: 'reading',
    order: gi + 1,
    title: `حرف‌های ${letters.join(' ')}`,
    goal: `کودک صدای حرف‌های ${letters.join('، ')} را می‌شناسد و شکلشان را می‌نویسد.`,
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
if (skipped.length) console.log(`رد شد (بدون صدا): ${skipped.map((s) => s.letter).join(' ')}`);
