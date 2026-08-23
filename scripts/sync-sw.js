// فهرست کشِ سرویس‌ورکر را از روی فایل‌های واقعی می‌سازد.
//
// چرا این اسکریپت هست:
//   فهرست SHELL دستی نوشته شده بود و پوسید. وقتی حوزهٔ «مهارت زندگی»
//   اضافه شد، فایل‌های life.js، english.js، phonics.js، journey.js،
//   mastery.js و task-icon.js در فهرست نبودند. برنامه آنلاین درست کار
//   می‌کرد و باگ دیده نمی‌شد — چون فایل‌های جامانده هنگام نخستین
//   واکشی کش می‌شدند. ولی کودکی که برنامه را نصب می‌کند و بی‌درنگ
//   آفلاین می‌شود، با برنامهٔ شکسته روبه‌رو می‌شد.
//
//   هر فهرستی که آدم باید دستی به‌روز نگه دارد، دیر یا زود عقب می‌ماند.
//   پس از روی دیسک ساخته می‌شود، نه از حافظهٔ من.
//
// اجرا: node scripts/sync-sw.js
// بررسی بدون نوشتن: node scripts/sync-sw.js --check

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SW = join(ROOT, 'sw.js');

/** همهٔ فایل‌های یک پوشه را بازگشتی می‌دهد. */
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

/** فهرست دارایی‌هایی که باید پیش از نخستین اجرا کش شوند. */
export function shellFiles() {
  const list = ['./', './index.html', './manifest.webmanifest'];

  // همهٔ ماژول‌های برنامه
  const src = walk(join(ROOT, 'src'))
    .filter((f) => f.endsWith('.js') || f.endsWith('.css'))
    .map((f) => './' + relative(ROOT, f).split('\\').join('/'))
    .sort();

  // فونت‌ها — بدون آن‌ها متن فارسی با فونت جایگزین و بدشکل می‌آید
  const fonts = walk(join(ROOT, 'assets/fonts'))
    .filter((f) => f.endsWith('.woff2'))
    .map((f) => './' + relative(ROOT, f).split('\\').join('/'))
    .sort();

  // ⚠ صداها عمداً اینجا نیستند: ۲٫۶ مگابایت‌اند و برنامه باید کاملاً
  // بی‌صدا هم کار کند. هنگام نخستین پخش کش می‌شوند.
  return [...list, ...src, ...fonts];
}

/** بلوک SHELL را در sw.js بازنویسی می‌کند. */
function render(files) {
  const body = files.map((f) => `  '${f}',`).join('\n');
  return `const SHELL = [\n${body}\n];`;
}

const files = shellFiles();
const current = readFileSync(SW, 'utf8');
const next = current.replace(/const SHELL = \[[\s\S]*?\n\];/, render(files));

if (process.argv.includes('--check')) {
  if (current !== next) {
    console.error('✗ فهرست کش سرویس‌ورکر کهنه است. اجرا کنید: node scripts/sync-sw.js');
    process.exit(1);
  }
  console.log(`✓ فهرست کش سرویس‌ورکر به‌روز است (${files.length} دارایی).`);
} else {
  writeFileSync(SW, next);
  console.log(`✓ فهرست کش سرویس‌ورکر ساخته شد: ${files.length} دارایی.`);
}
