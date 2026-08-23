// اعتبارسنج پروژه — این فایل باید بتواند شکست بخورد.
//
// در نسخهٔ قبلی ۱۱ اسکریپت ممیزی وجود داشت که همیشه سبز بودند، در حالی که
// ۲۰۰ درس از ۳۴۲ درس هیچ محتوایی نداشت. علتش این بود که هیچ‌کدام
// «نبودِ محتوا» را بررسی نمی‌کردند. این اعتبارسنج دقیقاً همان را بررسی می‌کند.
//
// اجرا: node scripts/validate.js   (خروج با کد ۱ در صورت خطا)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { LESSONS, SUPPORTED_ROUND_KINDS, lessonById } from '../src/data/lessons/index.js';
import { NARRATION } from '../src/data/narration.js';
import { DOMAINS, AGE_TRACKS, TRACK_ORDER } from '../src/data/curriculum.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUDIO_DIR = path.join(ROOT, 'assets/audio/kid');

const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

// ── ۱. صدا: هر ورودی نگاشت باید فایل واقعی داشته باشد، و برعکس ────────────
const audioFiles = new Set(
  fs.readdirSync(AUDIO_DIR).filter((f) => f.endsWith('.mp3')).map((f) => f.slice(0, -4)),
);
const referenced = new Set(Object.values(NARRATION));

for (const [line, clip] of Object.entries(NARRATION)) {
  if (!audioFiles.has(clip)) fail(`صدا: خط «${line}» به فایل ناموجود ${clip}.mp3 اشاره می‌کند`);
}
for (const f of audioFiles) {
  if (!referenced.has(f)) warn(`صدا: فایل ${f}.mp3 یتیم است (هیچ خطی به آن اشاره نمی‌کند)`);
}
for (const f of audioFiles) {
  const size = fs.statSync(path.join(AUDIO_DIR, `${f}.mp3`)).size;
  if (size < 2000) fail(`صدا: فایل ${f}.mp3 مشکوک به خالی بودن است (${size} بایت)`);
}

// ── ۲. درس‌ها: هیچ درسی نباید توخالی باشد ────────────────────────────────
const seenIds = new Set();
const domainIds = new Set(DOMAINS.map((d) => d.id));

for (const l of LESSONS) {
  const tag = `درس ${l.id || '(بدون شناسه)'}`;

  if (!l.id) fail(`${tag}: شناسه ندارد`);
  if (seenIds.has(l.id)) fail(`${tag}: شناسهٔ تکراری`);
  seenIds.add(l.id);

  if (!domainIds.has(l.domain)) fail(`${tag}: حوزهٔ نامعتبر «${l.domain}»`);
  if (!l.title || l.title.trim().length < 3) fail(`${tag}: عنوان ندارد`);
  if (!l.goal || l.goal.trim().length < 10) fail(`${tag}: هدف آموزشی ندارد`);
  if (!l.parentNote || l.parentNote.trim().length < 10) fail(`${tag}: راهنمای والدین ندارد`);
  if (!Number.isFinite(l.minutes) || l.minutes < 1) fail(`${tag}: مدت‌زمان نامعتبر`);

  // مهم‌ترین بررسی: درس بدون گِرد = درس توخالی.
  if (!Array.isArray(l.rounds) || l.rounds.length === 0) {
    fail(`${tag}: هیچ گِردی ندارد — درس توخالی است`);
    continue;
  }
  if (l.rounds.length < 3) fail(`${tag}: فقط ${l.rounds.length} گِرد دارد (حداقل ۳)`);

  l.rounds.forEach((r, i) => {
    const rtag = `${tag} گِرد ${i + 1}`;
    if (!SUPPORTED_ROUND_KINDS.includes(r.kind)) {
      fail(`${rtag}: نوع پشتیبانی‌نشده «${r.kind}» — موتور بازی این را نمی‌شناسد`);
    }
    if (!r.prompt || !r.prompt.trim()) fail(`${rtag}: پرسش ندارد`);

    // اگر گِرد صدا می‌خواهد، آن صدا باید واقعاً ضبط شده باشد.
    if (r.speak && !NARRATION[r.speak]) {
      fail(`${rtag}: صدای «${r.speak}» ضبط نشده است`);
    }
    // گِردهای گزینه‌ای باید پاسخ مشخص داشته باشند.
    const needsAnswer = ['letter-sound', 'letter-word', 'pattern-next', 'odd-one-out'];
    if (needsAnswer.includes(r.kind) && (r.answer === undefined || r.answer === '')) {
      fail(`${rtag}: پاسخ درست تعریف نشده`);
    }
    // پاسخ باید بین گزینه‌ها باشد.
    if (Array.isArray(r.options) && r.answer !== undefined && !r.options.includes(r.answer)) {
      fail(`${rtag}: پاسخ «${r.answer}» بین گزینه‌ها نیست`);
    }
    if (Array.isArray(r.items) && r.answer !== undefined && !r.items.includes(r.answer)) {
      fail(`${rtag}: پاسخ «${r.answer}» بین آیتم‌ها نیست`);
    }
  });
}

// ── ۳. تنوع محتوا: تشخیص محتوای قالبی ───────────────────────────────────
// در نسخهٔ قبلی mistakeFeedback در هر ۱۴۲ درس یک مقدار بود.
function uniqueRatio(field) {
  const vals = LESSONS.map((l) => l[field]).filter(Boolean);
  return vals.length ? new Set(vals).size / vals.length : 1;
}
for (const f of ['goal', 'parentNote', 'title']) {
  const r = uniqueRatio(f);
  if (r < 0.6) fail(`محتوای قالبی: میدان «${f}» فقط ${Math.round(r * 100)}٪ یکتاست`);
}

// ── ۴. ردهٔ سنی باید واقعاً متفاوت باشد ─────────────────────────────────
const trackSigs = TRACK_ORDER.map((t) => JSON.stringify(AGE_TRACKS[t]));
if (new Set(trackSigs).size !== TRACK_ORDER.length) {
  fail('ردهٔ سنی: دست‌کم دو رده یکسان‌اند — تطبیق با سن بی‌اثر است');
}

// ── ۵. هر حوزه باید درس داشته باشد ──────────────────────────────────────
for (const d of DOMAINS) {
  const n = LESSONS.filter((l) => l.domain === d.id).length;
  if (n === 0) fail(`حوزهٔ «${d.title}» هیچ درسی ندارد — یا درس اضافه کنید یا حوزه را حذف کنید`);
}

// ── ۶. پوستهٔ آفلاین: هر فایلی که sw.js کش می‌کند باید وجود داشته باشد ──
const sw = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
const shell = [...sw.matchAll(/'\.\/([^']+)'/g)].map((m) => m[1]).filter((p) => p && !p.endsWith('/'));
for (const rel of shell) {
  if (!fs.existsSync(path.join(ROOT, rel))) fail(`پوستهٔ آفلاین: فایل «${rel}» وجود ندارد`);
}

// ── گزارش ───────────────────────────────────────────────────────────────
const roundTotal = LESSONS.reduce((s, l) => s + (l.rounds?.length || 0), 0);
// ── سلامت مسیر سفر ──────────────────────────────────────────────────────
// مسیر باید همهٔ درس‌ها را دقیقاً یک بار داشته باشد، ترتیب داخلی هیچ حوزه‌ای
// را نشکند، و بین حوزه‌ها بچرخد تا کودک از یکنواختی خسته نشود.
const { auditSequence, SEQUENCE } = await import('../src/core/journey.js');
for (const problem of auditSequence()) errors.push(`مسیر سفر: ${problem}`);

console.log('── اعتبارسنجی پرورش هوش ──');
console.log(`حوزه‌ها: ${DOMAINS.length}`);
for (const d of DOMAINS) {
  const ls = LESSONS.filter((l) => l.domain === d.id);
  console.log(`  ${d.title}: ${ls.length} درس، ${ls.reduce((s, l) => s + l.rounds.length, 0)} گِرد`);
}
console.log(`مجموع: ${LESSONS.length} درس، ${roundTotal} گِرد`);
console.log(`صدا: ${Object.keys(NARRATION).length} خط گفتاری، ${audioFiles.size} فایل`);
console.log(`مسیر سفر: ${SEQUENCE.length} قدم پیوسته`);

if (warnings.length) {
  console.log(`\nهشدار (${warnings.length}):`);
  warnings.forEach((w) => console.log('  ⚠ ' + w));
}
if (errors.length) {
  console.log(`\nخطا (${errors.length}):`);
  errors.forEach((e) => console.log('  ✗ ' + e));
  console.log('\nاعتبارسنجی شکست خورد.');
  process.exit(1);
}
console.log('\n✓ همهٔ بررسی‌ها موفق — هر درس محتوای واقعی دارد.');
