/**
 * گاردِ خوانایی تصویر — «آیا کودک این شکل را روی کارت سفید می‌بیند؟»
 *
 * ⚠ چرا این گارد لازم شد: در فاز ۷.۱ همهٔ ۹۵ شکل را روی کارت سفید
 * رندر کردم و میانگین روشناییِ جوهرشان را سنجیدم. نتیجه تکان‌دهنده
 * بود: «ماست» و «ابر» *صفر درصد* پیکسلِ تیره‌تر از L=200 داشتند —
 * یعنی روی دکمهٔ سفیدِ گزینه عملاً نامرئی بودند.
 *
 * هیچ‌کدام از پنج گاردِ دیگر این را نمی‌دید:
 *   - validate: شکل وجود دارد ✓
 *   - test-rounds: گزینه تصویر دارد ✓
 *   - test-visual: عنصر جابه‌جا نشده ✓
 *   - test-delight: تصویر هست ✓
 * همه سبز، و کودک یک کارتِ خالی می‌دید.
 *
 * درسش همان درسِ همیشگی این پروژه است: **گارد چیزی را می‌سنجد که
 * سنجیدنش را به او یاد داده‌ای.** «تصویر وجود دارد» با «تصویر دیده
 * می‌شود» یکی نیست.
 *
 * روش سنجش: شکل را روی #FFFFFF رندر کن، پیکسل‌هایی را که از سفید
 * فاصله دارند جدا کن، و دو عدد بگیر:
 *   1) پوششِ جوهر — چند درصدِ کادر روشنایی‌اش زیر ۲۰۰ است
 *   2) کنتراستِ میانگین نسبت به سفید (فرمول WCAG)
 *
 * آستانه‌ها از داده آمده‌اند، نه از سلیقه: پس از اصلاحِ فاز ۷.۱
 * ضعیف‌ترین شکلِ پذیرفتنی «اردک» بود با پوشش ۱۰٪. زیر ۴٪ یعنی شکل
 * فقط چند خطِ نازک است و از یک متر فاصله ناپدید می‌شود.
 */
import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL || 'http://localhost:8080';

// حداقلِ پوششِ جوهر. زیر این عدد یعنی شکل روی کارت سفید محو است.
const MIN_INK = 0.035;
// حداقل کنتراستِ میانگین نسبت به سفید.
const MIN_CONTRAST = 1.28;

// ⚠ استثناها باید *دلیل* داشته باشند، نه فقط نام. هر ورودی اینجا
// یعنی «این شکل عمداً کم‌جوهر است و دلیلش این است».
const ALLOW = new Map([
  // شکل‌هایی که ذاتاً روشن‌اند و روشنی خودِ معناشان است باید
  // دست‌کم کانتور داشته باشند — تا امروز هیچ‌کدام معاف نیستند.
]);

const luminance = (L) => {
  const l = L / 255;
  return l <= 0.03928 ? l / 12.92 : ((l + 0.055) / 1.055) ** 2.4;
};
const contrastToWhite = (L) => 1.05 / (luminance(L) + 0.05);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 220, height: 220 } });
await page.goto(BASE, { waitUntil: 'domcontentloaded' });

const names = await page.evaluate(async () => {
  const m = await import('/src/core/svg.js');
  return m.SHAPE_NAMES;
});

const rows = [];
for (const name of names) {
  const r = await page.evaluate(async (nm) => {
    const m = await import('/src/core/svg.js');
    document.body.innerHTML = `<div id="w">${m.shape(nm)}</div>`;
    const s = document.querySelector('#w svg');
    s.setAttribute('width', '200');
    s.setAttribute('height', '200');
    const xml = new XMLSerializer().serializeToString(s);
    const img = new Image();
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(xml)))}`;
    });
    const c = document.createElement('canvas');
    c.width = 200;
    c.height = 200;
    const cx = c.getContext('2d');
    // دقیقاً همان پس‌زمینه‌ای که دکمهٔ گزینه دارد
    cx.fillStyle = '#FFFFFF';
    cx.fillRect(0, 0, 200, 200);
    cx.drawImage(img, 0, 0, 200, 200);
    const d = cx.getImageData(0, 0, 200, 200).data;
    let ink = 0;
    let sum = 0;
    let cnt = 0;
    for (let i = 0; i < d.length; i += 4) {
      const L = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      if (L < 250) {
        cnt++;
        sum += L;
      }
      if (L < 200) ink++;
    }
    return { ink: ink / 40000, avgL: cnt ? sum / cnt : 255 };
  }, name);
  rows.push({ name, ink: r.ink, cr: contrastToWhite(r.avgL) });
}

await browser.close();

const problems = [];
for (const r of rows) {
  if (ALLOW.has(r.name)) continue;
  if (r.ink < MIN_INK) {
    problems.push(
      `${r.name}: فقط ${(r.ink * 100).toFixed(1)}٪ پوشش جوهر (حد ${(MIN_INK * 100).toFixed(1)}٪) — روی کارت سفید محو است`,
    );
  } else if (r.cr < MIN_CONTRAST) {
    problems.push(
      `${r.name}: کنتراست ${r.cr.toFixed(2)} نسبت به سفید (حد ${MIN_CONTRAST}) — کم‌جان است`,
    );
  }
}

const sorted = [...rows].sort((a, b) => a.ink - b.ink);
console.log('── آزمون خوانایی تصویر ──');
console.log(`  ${rows.length} شکل روی کارت سفید رندر و اندازه‌گیری شد`);
console.log('  کم‌جوهرترین‌ها:');
for (const r of sorted.slice(0, 5)) {
  console.log(`    ${r.name.padEnd(12)} پوشش ${(r.ink * 100).toFixed(1)}٪  کنتراست ${r.cr.toFixed(2)}`);
}

if (problems.length) {
  console.log(`\nمشکل (${problems.length}):`);
  for (const p of problems) console.log(`  ✗ ${p}`);
  process.exit(1);
}
console.log('\n✓ هر شکل روی کارت سفید به‌قدر کافی جوهر دارد.');
