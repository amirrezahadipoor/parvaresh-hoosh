// همهٔ اندازه‌های آیکون را از یک منبع SVG می‌سازد.
//
// چرا با مرورگر و نه با کتابخانهٔ تبدیل تصویر:
//   برنامه فقط یک وابستگی توسعه دارد (playwright-core) و همان
//   مرورگری که آزمون‌ها با آن اجرا می‌شوند، SVG را دقیقاً مثل
//   دستگاه کاربر رندر می‌کند. افزودن sharp یا svg2png فقط برای
//   ساخت شش فایل، وابستگی اضافه است.
//
// اجرا: node scripts/build-icons.js
// بررسی: node scripts/build-icons.js --check  (فقط می‌گوید چه کم است)

import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appIcon } from '../src/core/app-icon.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = join(ROOT, 'assets/icon');

// چرا این اندازه‌ها:
//   192 و 512 → حداقلِ لازم برای نصب PWA
//   maskable-512 → اندروید آیکون را می‌بُرد و بدون این، چهره بریده می‌شود
//   180 → apple-touch-icon
//   32 → favicon مرورگر دسکتاپ (والد ممکن است روی لپ‌تاپ باز کند)
const SIZES = [
  { file: 'icon-32.png', size: 32, maskable: false },
  { file: 'icon-180.png', size: 180, maskable: false },
  { file: 'icon-192.png', size: 192, maskable: false },
  { file: 'icon-512.png', size: 512, maskable: false },
  { file: 'icon-maskable-192.png', size: 192, maskable: true },
  { file: 'icon-maskable-512.png', size: 512, maskable: true },
];

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

// نسخهٔ SVG هم نگه داشته می‌شود: برداری، بی‌وزن، و منبعِ هر بازسازی.
const svgPath = join(OUT, 'icon.svg');
writeFileSync(svgPath, appIcon() + '\n');
const maskSvgPath = join(OUT, 'icon-maskable.svg');
writeFileSync(maskSvgPath, appIcon({ maskable: true }) + '\n');

if (process.argv.includes('--check')) {
  const missing = SIZES.filter((s) => !existsSync(join(OUT, s.file)));
  if (missing.length) {
    console.error(`✗ ${missing.length} آیکون ساخته نشده: ${missing.map((m) => m.file).join('، ')}`);
    console.error('  اجرا کنید: node scripts/build-icons.js');
    process.exit(1);
  }
  console.log(`✓ هر ${SIZES.length} آیکون موجود است.`);
  process.exit(0);
}

const { chromium } = await import('playwright-core');
const browser = await chromium.launch();

for (const { file, size, maskable } of SIZES) {
  const svg = appIcon({ maskable });
  const page = await browser.newPage({
    viewport: { width: size, height: size },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    `<body style="margin:0;width:${size}px;height:${size}px;overflow:hidden">
       <div style="width:${size}px;height:${size}px">${svg
         .replace('width="512" height="512"', `width="${size}" height="${size}"`)}</div>
     </body>`,
    { waitUntil: 'load' },
  );
  await page.waitForTimeout(80);
  const buf = await page.screenshot({ omitBackground: !maskable });
  writeFileSync(join(OUT, file), buf);
  await page.close();
  console.log(`  ${file} — ${size}×${size}${maskable ? ' (maskable)' : ''}`);
}

await browser.close();
console.log(`✓ ${SIZES.length} آیکون ساخته شد در assets/icon/.`);
