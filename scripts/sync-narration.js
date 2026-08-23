// narration.js را از روی فایل‌های واقعی assets/audio/kid بازتولید می‌کند.
//
// نگاشت متن→کلیپ در narration.js حفظ می‌شود؛ این اسکریپت فقط ورودی‌هایی
// را نگه می‌دارد که فایلشان واقعاً وجود دارد و فایل‌های یتیم را گزارش می‌کند.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NARRATION } from '../src/data/narration.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(ROOT, 'assets/audio/kid');
const files = new Set(fs.readdirSync(dir).filter((f) => f.endsWith('.mp3')).map((f) => f.slice(0, -4)));

const kept = Object.entries(NARRATION).filter(([, c]) => files.has(c));
const dropped = Object.entries(NARRATION).filter(([, c]) => !files.has(c));
const orphans = [...files].filter((f) => !kept.some(([, c]) => c === f));

// مرتب‌سازی باید قطعی باشد: localeCompare به ICU و locale سیستم وابسته است
// و روی CI خروجی متفاوتی می‌داد، پس بررسی «بازتولیدپذیری» شکست می‌خورد.
const body = kept.sort((a, b) => (a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0))
  .map(([t, c]) => `  ${JSON.stringify(t)}: ${JSON.stringify(c)}`).join(',\n');

fs.writeFileSync(path.join(ROOT, 'src/data/narration.js'),
  '// تولیدشده از فایل‌های واقعی assets/audio/kid — با scripts/sync-narration.js بازتولید کنید.\n' +
  '// هر ورودی تضمیناً یک فایل mp3 موجود دارد؛ اعتبارسنج در صورت مغایرت شکست می‌خورد.\n\n' +
  `export const NARRATION = Object.freeze({\n${body}\n});\n\n` +
  'export const NARRATION_LINES = Object.keys(NARRATION);\n');

console.log(`${kept.length} خط نوشته شد.`);
if (dropped.length) console.log(`حذف شد (بدون فایل): ${dropped.map(([t]) => t).join('، ')}`);
if (orphans.length) console.log(`فایل یتیم (بدون متن): ${orphans.join('، ')}`);
