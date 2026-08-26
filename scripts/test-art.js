#!/usr/bin/env node
/**
 * نگهبانِ آیتم ۷ از §۷.۱۶ — ارتقای هنریِ SVG (نشست‌های پیاپی).
 *
 * ═══════════════════════════════════════════════════════════════════
 * چرا این نگهبان لازم شد
 * ═══════════════════════════════════════════════════════════════════
 *
 * ارتقای هنریِ SVG «تدریجی» است: ۱۰ تا ۱۵ تصویر در هر نشست. این
 * نگهبان پیشرفتِ همین نشست را قفل می‌کند — هر تصویری که «ارتقا
 * یافته» اعلام می‌شود باید امضایِ ارتقا را داشته باشد:
 *
 *   • سایهٔ زمینِ نرم (بیضیِ روشنِ پایِ شکل) — عمق، بدونِ جوهرِ زیاد.
 *   • هایلایت (سفیدیِ نرم) یا لهجهٔ پالت (رنگِ دومِ معنادار).
 *
 * خواناییِ تصویر را اینجا نمی‌سنجیم — `test:contrast` هر ۱۴۷ تصویر
 * را روی کارت سفید می‌سنجد. این گارد فقط «ارتقا واقعاً اعمال شده»
 * را قفل می‌کند و با هر نشست، فهرست بزرگ‌تر می‌شود.
 */

import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/core/svg.js', import.meta.url), 'utf8');

// تصویرهایِ ارتقایافته در همین نشست — با هر نشستِ تازه بزرگ‌تر می‌شود.
const ART_UPGRADED = [
  'گربه', 'سگ', 'ماهی', 'سیب', 'موز', 'گل',
  'درخت', 'توپ', 'کتاب', 'خانه', 'ماشین', 'ابر',
];

const errors = [];
const check = (cond, msg) => {
  if (!cond) errors.push(msg);
};

for (const name of ART_UPGRADED) {
  // بدنهٔ شکل: بین `svg(` و `),` در تعریفِ `name: () =>`
  const key = `  ${name}: () =>\n    svg(\``;
  const start = src.indexOf(key);
  check(start >= 0, `تصویرِ «${name}» در svg.js نیست`);
  if (start < 0) continue;
  const end = src.indexOf('`),', start);
  const body = src.slice(start, end);

  // امضای ارتقا ۱: سایهٔ زمینِ نرم (بیضیِ روشن پایِ شکل).
  check(
    /<ellipse[^>]*fill="#B9B0A0"/.test(body),
    `«${name}» سایهٔ زمینِ نرم ندارد — امضای ارتقا گم شده`,
  );
  // امضای ارتقا ۲: هایلایت (سفیدِ کمرنگ) یا لهجهٔ پالتِ تازه.
  const hasHighlight =
    /fill="#fff" opacity="0\.(2[0-9]|3[0-9])"/.test(body) ||
    /stroke="#FFF"[^>]*opacity="\.(5[0-9]|9[0-9])"/.test(body);
  const hasAccent = /#C1352B|#F4B942|#FBE6A2|#F4D03F|#E4572E/.test(body);
  check(hasHighlight || hasAccent, `«${name}» نه هایلایت دارد نه لهجهٔ پالتِ تازه`);
}

console.log('── نگهبانِ ارتقای هنریِ SVG (§۷.۱۶ آیتم ۷ — نشست ۱) ──');
console.log(`  ارتقایافته: ${ART_UPGRADED.length} تصویر (${ART_UPGRADED.join('، ')})`);
if (errors.length) {
  console.log(`\nمشکل (${errors.length}):`);
  [...new Set(errors)].forEach((e) => console.log('  ✗ ' + e));
  process.exit(1);
}
console.log('\n✓ هر تصویرِ اعلام‌شده امضای ارتقا را دارد؛ خوانایی را test:contrast می‌سنجد.');
