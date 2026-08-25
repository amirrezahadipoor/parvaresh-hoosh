#!/usr/bin/env node
/**
 * نگهبان ۱۱ — سند دروغ نگوید.
 *
 * ═══════════════════════════════════════════════════════════════════
 * چرا این نگهبان لازم شد
 * ═══════════════════════════════════════════════════════════════════
 *
 * هنگامِ آماده‌سازیِ مخزن برای تحویل، `README.md` هنوز می‌گفت پروژه
 * **۲۳ درس** و **۲۴ تصویر SVG** دارد. عددِ واقعی ۳۰۷ درس و ۱۴۷ تصویر
 * بود. آن جدول ماه‌ها غلط مانده بود و هیچ‌کس ندید، چون **هیچ گاردی
 * به مستندات نگاه نمی‌کرد**.
 *
 * این دقیقاً همان خانوادهٔ باگی است که این پروژه بارها خورده: چیزی
 * که *به‌نظر* درست است چون کسی نگاهش نکرده. تفاوتش این است که
 * قربانیِ سندِ کهنه، توسعه‌دهندهٔ بعدی است — یا ایجنتی که با آن سند
 * تصمیم می‌گیرد. سندِ غلط بدتر از سندِ نبوده است، چون اعتماد
 * می‌آفریند.
 *
 * ⚠ این گارد **محتوای** سند را نمی‌سنجد، فقط **اعدادِ قابل‌شمارش** را.
 * اینکه سند خوب نوشته شده، مفید است یا گمراه‌کننده — هیچ‌کدام را
 * نمی‌بیند. آن را فقط آدمی که می‌خواندش می‌فهمد.
 */

import { readFileSync } from 'node:fs';
import { LESSONS } from '../src/data/lessons/index.js';
import { DOMAINS } from '../src/data/curriculum.js';
import { TRACKS } from '../src/core/music.js';
import { NARRATION } from '../src/data/narration.js';

const problems = [];
const fail = (m) => problems.push(m);

/** عددِ فارسی → لاتین، تا بشود با دادهٔ واقعی مقایسه کرد. */
const FA = '۰۱۲۳۴۵۶۷۸۹';
const toEn = (s) => s.replace(/[۰-۹]/g, (d) => String(FA.indexOf(d))).replace(/٬/g, '');

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
const roadmap = readFileSync(new URL('../ROADMAP.md', import.meta.url), 'utf8');

// ── حقایقِ شمرده‌شده از خودِ داده ────────────────────────────────────
const facts = {
  lessons: LESSONS.length,
  rounds: LESSONS.reduce((a, l) => a + l.rounds.length, 0),
  domains: DOMAINS.length,
  tracks: TRACKS.length,
  clips: Object.keys(NARRATION).length,
};

console.log('── آزمون صداقتِ مستندات ──');
console.log(
  `  واقعیت: ${facts.lessons} درس، ${facts.rounds} تمرین، ` +
    `${facts.domains} حوزه، ${facts.tracks} آهنگ، ${facts.clips} کلیپ`,
);

// ── ۱. اعدادِ کلیدی در README باید درست باشند ───────────────────────
//
// ⚠ روش عمداً محافظه‌کارانه است: به‌جای تلاش برای فهمیدنِ *هر* عدد در
// سند (که پر از خطای مثبتِ کاذب می‌شود — «۵ تا ۸ سال»، «۱۹۰٬۰۰۰
// تومان»، شمارهٔ نسخه‌ها)، فقط سطرهایی را می‌سنجیم که کلیدواژهٔ
// مشخصی دارند. گاردی که سر و صدای بی‌جا کند، خاموش می‌شود.
const checks = [
  { key: 'درس‌ها', value: facts.lessons, label: 'تعداد درس' },
  { key: 'تمرین‌ها (گِرد)', value: facts.rounds, label: 'تعداد تمرین' },
  { key: 'آهنگ پس‌زمینه', value: facts.tracks, label: 'تعداد آهنگ' },
  { key: 'کلیپ صوتی', value: facts.clips, label: 'تعداد کلیپ' },
];

for (const c of checks) {
  // سطرِ جدولِ README به شکل `| کلید | **۳۰۷** ... |` است.
  const row = readme.split('\n').find((l) => l.includes(`| ${c.key} |`));
  if (!row) {
    fail(`سطرِ «${c.key}» در جدولِ README پیدا نشد`);
    continue;
  }
  const nums = (toEn(row).match(/\d+/g) || []).map(Number);
  if (!nums.includes(c.value)) {
    fail(`README: ${c.label} باید ${c.value} باشد، ولی سطر می‌گوید «${row.trim()}»`);
  }
}

// ── ۲. شمارشِ درسِ هر حوزه در README ────────────────────────────────
for (const d of DOMAINS) {
  const n = LESSONS.filter((l) => l.domain === d.id).length;
  const row = readme.split('\n').find((l) => l.trim().startsWith(`| ${d.title} |`));
  if (!row) {
    fail(`حوزهٔ «${d.title}» در جدولِ README نیست`);
    continue;
  }
  const nums = (toEn(row).match(/\d+/g) || []).map(Number);
  if (!nums.includes(n)) {
    fail(`README: حوزهٔ «${d.title}» باید ${n} درس داشته باشد، ولی سطر می‌گوید «${row.trim()}»`);
  }
}

// ── ۳. هر گاردِ package.json باید در README و CI باشد ───────────────
//
// ⚠ گاردی که کسی از وجودش خبر ندارد، اجرا نمی‌شود. و گاردی که در CI
// نیست، فقط یک اسکریپت است که *گاهی* کسی اجرایش می‌کند — سه گاردِ
// contrast/a11y/music دقیقاً همین وضع را داشتند.
const ci = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
const guardScripts = Object.keys(pkg.scripts).filter((k) => k.startsWith('test:'));

for (const g of guardScripts) {
  if (!readme.includes(`npm run ${g}`)) fail(`گاردِ «${g}» در README مستند نشده`);
  if (!ci.includes(`npm run ${g}`)) fail(`گاردِ «${g}» در CI اجرا نمی‌شود`);
}

// ── ۳.۵ هیچ سندی نباید فرمانِ مرده بدهد ────────────────────────────
//
// ⚠ سندی که فرمانِ ناموجود می‌دهد، بدتر از سندِ نبوده است: ایجنت یا
// توسعه‌دهنده آن را اجرا می‌کند، خطا می‌گیرد، و اعتمادش به کلِ سند
// می‌ریزد. `AGENTS.md` مخصوصاً حساس است چون ابزارهای خودکار
// بی‌چون‌وچرا از آن پیروی می‌کنند.
//
// ⚠ الگوی regex باید رقم را هم بگیرد (`test:a11y`)، وگرنه خودش
// «test:a» را استخراج می‌کند و خطای کاذب می‌سازد — همین اشتباه
// هنگامِ نوشتنِ این گارد رخ داد.
{
  const docs = [
    ['AGENTS.md', readFileSync(new URL('../AGENTS.md', import.meta.url), 'utf8')],
    ['README.md', readme],
    ['ROADMAP.md', roadmap],
  ];
  for (const [name, text] of docs) {
    for (const cmd of new Set(text.match(/npm run [a-z0-9:-]+/g) || [])) {
      const script = cmd.replace('npm run ', '');
      if (!pkg.scripts[script]) fail(`${name}: فرمانِ «${cmd}» در package.json وجود ندارد`);
    }
  }
}

// ── ۴. شمارشِ گارد در متن باید با واقعیت بخواند ─────────────────────
//
// `npm test` چهار بررسی را با هم اجرا می‌کند، پس شمارشِ واقعی:
// چهارتای داخلِ test + هر test:* جداگانه.
const insideTest = (pkg.scripts.test.match(/node scripts\//g) || []).length;
const totalGuards = insideTest + guardScripts.length;
const claimed = roadmap.match(/(?:^|\n)#+ ۰\.۳ ([^\n]*گارد)/);
if (claimed) {
  const n = Number(toEn(claimed[1]).match(/\d+/)?.[0]);
  // عنوان «ده گارد» است — عددِ فارسیِ نوشتاری، نه رقم. پس فقط وقتی
  // رقم هست مقایسه می‌کنیم.
  if (n && n !== totalGuards) {
    fail(`نقشهٔ راه §۰.۳ می‌گوید ${n} گارد، ولی ${totalGuards} گارد هست`);
  }
}
console.log(`  گاردها: ${totalGuards} (${insideTest} داخلِ npm test + ${guardScripts.length} جداگانه)`);

// ── ۵. نسخه باید ۱.۰.۰ بماند — قانون ۱ ─────────────────────────────
if (pkg.version !== '1.0.0') {
  fail(`نسخهٔ package.json «${pkg.version}» است؛ قانون ۱ می‌گوید روی 1.0.0 قفل است`);
}

// ── ۶. نقشهٔ راه باید بخشِ «شروع سریع» داشته باشد ───────────────────
//
// این تنها راهی است که ایجنتِ بعدی بدونِ حافظه می‌تواند کار را
// ادامه دهد. اگر کسی روزی این بخش را حذف کند، باید بشکند.
for (const need of ['۰. شروع سریع', '۰.۲ برپا کردن محیط', '۰.۴ کارِ باقی‌مانده']) {
  if (!roadmap.includes(need)) fail(`بخشِ «${need}» از نقشهٔ راه حذف شده`);
}
// AGENTS.md نقطهٔ ورودِ ابزارهای خودکار است.
if (!readme.includes('ROADMAP.md')) fail('README به نقشهٔ راه ارجاع نمی‌دهد');

console.log('');
if (problems.length) {
  console.error(`✗ ${problems.length} ناسازگاری بین سند و واقعیت:`);
  problems.forEach((p) => console.error('  ✗ ' + p));
  process.exit(1);
}
console.log('✓ اعدادِ مستندات با دادهٔ واقعی می‌خوانند و هر گارد مستند و در CI است.');
