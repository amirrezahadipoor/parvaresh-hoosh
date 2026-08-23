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

// دادهٔ تکرار فاصله‌دار باید سالم باشد.
const { auditReviewData } = await import('../src/core/mastery.js');
for (const problem of auditReviewData()) errors.push(`تکرار فاصله‌دار: ${problem}`);

// هر نوع گِرد باید نشان تصویری داشته باشد — کودکِ پیش‌خوان تنها
// راهنمایش همین است.
// نقشهٔ صدای واژه‌ها باید با املا بخواند، وگرنه کودک چیزی می‌بیند
// که با آنچه صداکشی می‌کند یکی نیست.
const { auditPhonics } = await import('../src/data/phonics.js');
for (const problem of auditPhonics()) errors.push(`واج‌شناسی: ${problem}`);

// ── تنوع واژگان صداکشی ────────────────────────────────────────────
// یک بار بانک واژگان ۱۰۶ تایی در عمل به ۲۵ واژهٔ تکراری فرو ریخت:
// سه سطح سختی در سقف ۶ گِردِ درس با هم می‌جنگیدند و فقط ساده‌ترین
// می‌ماند، پس کودک بیست درس پشت سر هم همان واژه‌ها را می‌دید.
// شمارش «واژهٔ موجود» این را نمی‌دید — باید «واژهٔ رسیده به کودک»
// را شمرد.
{
  const { READING_LESSONS } = await import('../src/data/lessons/reading.js');
  const { buildLesson } = await import('../src/core/rounds.js');
  const { AGE_TRACKS } = await import('../src/data/curriculum.js');
  const { SOUND_MAP } = await import('../src/data/phonics.js');

  const reached = new Set();
  for (const lesson of READING_LESSONS) {
    for (let rep = 0; rep < 15; rep++) {
      for (const r of buildLesson(lesson, AGE_TRACKS.school)) {
        if (r.kindName === 'blend-word') reached.add(r.answer);
      }
    }
  }
  const ratio = reached.size / SOUND_MAP.length;
  if (ratio < 0.5) {
    errors.push(
      `صداکشی: فقط ${reached.size} واژه از ${SOUND_MAP.length} به کودک می‌رسد ` +
        `(${Math.round(ratio * 100)}٪) — بانک واژگان دارد هدر می‌رود`,
    );
  }

  // سختی باید با پیشرفت درس بالا برود، وگرنه درس بیستم به‌سادگی سوم است.
  const avgSounds = (idx) => {
    const words = new Set();
    for (let k = 0; k < 20; k++) {
      for (const r of buildLesson(READING_LESSONS[idx], AGE_TRACKS.school)) {
        if (r.kindName === 'blend-word') words.add(r.answer);
      }
    }
    if (!words.size) return 0;
    let total = 0;
    for (const w of words) {
      const e = SOUND_MAP.find((x) => x.word === w);
      total += e ? e.syllables.flat().length : 0;
    }
    return total / words.size;
  };
  const early = avgSounds(3);
  const late = avgSounds(19);
  if (early && late && late <= early) {
    errors.push(
      `صداکشی: درس آخر سخت‌تر از درس اول نیست (${late.toFixed(1)} در برابر ${early.toFixed(1)} صدا)`,
    );
  }
}

const { auditIcons } = await import('../src/core/task-icon.js');
const allKinds = [...new Set(LESSONS.flatMap((l) => l.rounds.map((r) => r.kind)))];
for (const problem of auditIcons(allKinds)) errors.push(`نشان تمرین: ${problem}`);

// ── ممنوعیت اموجی در رابط ────────────────────────────────────────────
// چرا: اموجی را سیستم‌عامل می‌کشد، پس روی هر گوشی شکل و رنگ دیگری
// دارد و روی اندرویدهای قدیمی گاهی مربع خالی می‌شود. برنامه‌ای که
// «هیچ باگ ظاهری» می‌خواهد نمی‌تواند بخشی از ظاهرش را به دستگاه
// بسپارد. یک بار ⭐ 🔇 🔊 ⚙ 🔒 🌙 در رابط بودند و حذف شدند؛ این
// بررسی جلوی بازگشتشان را می‌گیرد.
{
  const { readFileSync } = await import('node:fs');
  const { fileURLToPath } = await import('node:url');
  const root = fileURLToPath(new URL('..', import.meta.url));
  const src = readFileSync(root + 'src/ui/screens.js', 'utf8');

  // بازهٔ اموجی + نمادهای متفرقه‌ای که پیش‌تر در رابط بودند.
  const emoji = /[\u{1F300}-\u{1FAFF}\u{2B00}-\u{2BFF}\u{1F000}-\u{1F2FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    // فقط رشته‌های واقعی رابط؛ توضیحات فارسی (که ⚠ دارند) معاف‌اند.
    const code = line.replace(/\/\/.*$/, '');
    if (!/text:|textContent|innerHTML|'aria-label'/.test(code)) return;
    const hit = code.match(emoji);
    if (hit) {
      errors.push(
        `اموجی در رابط — خط ${i + 1}: ${hit[0]} (به‌جایش از src/core/ui-icons.js استفاده کنید)`,
      );
    }
  });
}

// ── آیکون و مانیفست ─────────────────────────────────────────────────
// چرا اینجا: آیکون تنها چیزی است که والد پیش از نصب می‌بیند. یک
// ارجاعِ شکسته در manifest یعنی آیکون خالی در کافه‌بازار، و این
// باگی است که هیچ آزمون دیگری نمی‌گیرد چون برنامه سالم اجرا می‌شود.
{
  const { existsSync, readFileSync } = await import('node:fs');
  const { fileURLToPath } = await import('node:url');
  const root = fileURLToPath(new URL('..', import.meta.url));
  const rel = (f) => root + f.replace(/^\.\//, '');

  const manifest = JSON.parse(readFileSync(rel('./manifest.webmanifest'), 'utf8'));
  if (!manifest.icons?.length) errors.push('مانیفست: هیچ آیکونی تعریف نشده');
  for (const ic of manifest.icons || []) {
    if (!existsSync(rel(ic.src))) errors.push(`مانیفست: آیکون گمشده — ${ic.src}`);
  }
  // اندروید بدون maskable آیکون را داخل یک کادر سفید می‌گذارد.
  if (!(manifest.icons || []).some((i) => i.purpose === 'maskable')) {
    errors.push('مانیفست: آیکون maskable ندارد — اندروید کادر سفید می‌گذارد');
  }

  const html = readFileSync(rel('./index.html'), 'utf8');
  for (const m of html.matchAll(/(?:href|src)="(assets\/icon\/[^"]+)"/g)) {
    if (!existsSync(root + m[1])) errors.push(`index.html: آیکون گمشده — ${m[1]}`);
  }

  // رنگ نوار وضعیت باید با پس‌زمینهٔ واقعی برنامه یکی باشد، وگرنه
  // زیر نوار اندروید یک خط رنگیِ ناهم‌خوان دیده می‌شود.
  const css = readFileSync(rel('./src/styles/main.css'), 'utf8');
  const bg = css.match(/--bg:\s*(#[0-9A-Fa-f]{6})/)?.[1];
  const theme = html.match(/name="theme-color"\s+content="(#[0-9A-Fa-f]{6})"/)?.[1];
  if (bg && theme && bg.toUpperCase() !== theme.toUpperCase()) {
    errors.push(`رنگ تم (${theme}) با پس‌زمینهٔ برنامه (${bg}) یکی نیست`);
  }
  if (bg && manifest.background_color?.toUpperCase() !== bg.toUpperCase()) {
    errors.push(`مانیفست: background_color با --bg (${bg}) یکی نیست`);
  }
}

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
