// آزمون واقعیِ مرورگر — برنامه را باز می‌کند و یک درس کامل را بازی می‌کند.
//
// این آزمون چیزی را می‌سنجد که آزمون‌های واحد نمی‌توانند: اینکه برنامه
// در یک مرورگر واقعی بالا می‌آید، دکمه‌ها کار می‌کنند و هیچ خطای
// کنسولی رخ نمی‌دهد.
//
// اجرا:  node scripts/test-browser.js   (سرور باید روی ۸۰۸۰ باشد)

import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const errors = [];
const consoleErrors = [];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text());
});
page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));
page.on('requestfailed', (r) => {
  // فونت/صدا ممکن است در محیط بی‌صدا رد شود؛ فقط ۴۰۴ مهم است
  consoleErrors.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`);
});

const check = (cond, msg) => {
  if (!cond) errors.push(msg);
};

await page.goto(BASE, { waitUntil: 'networkidle' });

// ── خانه ────────────────────────────────────────────────────────────────
await page.waitForSelector('.domain-card', { timeout: 5000 });
const domains = await page.locator('.domain-card').count();
check(domains === 4, `صفحهٔ خانه باید ۴ حوزه داشته باشد، ${domains} دارد`);
console.log(`✓ خانه: ${domains} حوزه`);

// عنوان‌ها واقعاً فارسی رندر شده‌اند؟
const firstTitle = await page.locator('.domain-card h2').first().textContent();
check(/[\u0600-\u06FF]/.test(firstTitle), 'عنوان حوزه فارسی نیست');

// ── ورود به حوزهٔ ریاضی و بازی یک درس ───────────────────────────────────
await page.locator('.domain-card', { hasText: 'ریاضی' }).click();
await page.waitForSelector('.lesson-card');
const lessons = await page.locator('.lesson-card').count();
check(lessons === 5, `ریاضی باید ۵ درس داشته باشد، ${lessons} دارد`);
console.log(`✓ ریاضی: ${lessons} درس`);

await page.locator('.lesson-card').first().click();
await page.waitForSelector('.prompt');

// یک درس کامل را بازی می‌کنیم؛ همیشه گزینهٔ اول را می‌زنیم.
let rounds = 0;
for (let i = 0; i < 12; i++) {
  const done = await page.locator('.done-card').count();
  if (done) break;

  const prompt = await page.locator('.prompt').textContent().catch(() => '');
  check(!/\{[a-z]\}/.test(prompt || ''), `جای‌نگهدار پر نشده در متن: ${prompt}`);

  const opts = page.locator('.opt:not([disabled])');
  const n = await opts.count();
  if (n > 0) {
    rounds++;
    await opts.first().click();
    await page.waitForTimeout(2100);
    continue;
  }
  const orderItems = page.locator('.order-item:not(.picked)');
  if (await orderItems.count()) {
    rounds++;
    while (await orderItems.count()) {
      await orderItems.first().click();
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(1900);
    continue;
  }
  break;
}
check(rounds >= 3, `باید دست‌کم ۳ گِرد بازی می‌شد، ${rounds} شد`);
console.log(`✓ ${rounds} گِرد بازی شد`);

await page.waitForSelector('.done-card', { timeout: 8000 });
const doneText = await page.locator('.done-card').textContent();
check(/تمرین درست/.test(doneText), 'صفحهٔ پایان نتیجه را نشان نمی‌دهد');
console.log('✓ صفحهٔ پایان درس نمایش داده شد');

// ── تنظیمات: تغییر سن باید تعداد گزینه‌ها را عوض کند ────────────────────
await page.locator('.btn.ghost', { hasText: 'خانه' }).click();
await page.waitForSelector('.domain-card');
await page.locator('.icon-btn[aria-label="تنظیمات"]').click();
await page.waitForSelector('select');
await page.selectOption('select', '5');
await page.locator('.btn', { hasText: 'ذخیره' }).click();
await page.waitForSelector('.domain-card');

await page.locator('.domain-card', { hasText: 'ریاضی' }).click();
await page.locator('.lesson-card').first().click();
await page.waitForSelector('.opt');
const optsAge5 = await page.locator('.opt').count();
check(optsAge5 === 2, `کودک ۵ ساله باید ۲ گزینه ببیند، ${optsAge5} دید`);
console.log(`✓ سن ۵: ${optsAge5} گزینه (تطبیق سنی واقعاً کار می‌کند)`);

// ── ستاره‌ها ذخیره شده‌اند؟ ─────────────────────────────────────────────
const stars = await page.locator('.stars').first().textContent();
check(/[۰-۹]/.test(stars), 'شمارندهٔ ستاره عدد فارسی ندارد');
console.log(`✓ ستاره‌ها: ${stars.trim()}`);

// ── حوزهٔ خواندن: صدا و بوم خط‌کشیدن ────────────────────────────────────
await page.locator('.icon-btn[aria-label="بازگشت"]').click();
await page.waitForSelector('.lesson-card');
await page.locator('.icon-btn[aria-label="بازگشت"]').click();
await page.waitForSelector('.domain-card');
await page.locator('.domain-card', { hasText: 'خواندن' }).click();
await page.locator('.lesson-card').first().click();
await page.waitForSelector('.prompt');
const audioOk = await page.evaluate(async () => {
  const r = await fetch('assets/audio/kid/letter-alef.mp3');
  return r.ok && Number(r.headers.get('content-length')) > 2000;
});
check(audioOk, 'فایل صوتی letter-alef.mp3 در دسترس نیست');
console.log('✓ فایل صوتی از خود برنامه قابل واکشی است');

// ── حوزهٔ تصویری: شکل‌های SVG باید واقعاً رندر شوند ─────────────────────
await page.locator('.icon-btn[aria-label="بازگشت"]').click();
await page.waitForSelector('.lesson-card');
await page.locator('.icon-btn[aria-label="بازگشت"]').click();
await page.waitForSelector('.domain-card');
await page.locator('.domain-card', { hasText: 'تماشا' }).click();
await page.waitForSelector('.lesson-card');
await page.locator('.lesson-card').first().click();
await page.waitForSelector('.opt');

const svgCount = await page.locator('.opt svg').count();
check(svgCount >= 2, `گزینه‌ها باید شکل SVG داشته باشند، ${svgCount} پیدا شد`);
// SVG باید ابعاد واقعی داشته باشد، نه صفر (شکل خالی)
const boxes = await page.locator('.opt svg').evaluateAll((els) =>
  els.map((e) => { const r = e.getBoundingClientRect(); return { w: r.width, h: r.height }; }),
);
const collapsed = boxes.filter((b) => b.w < 8 || b.h < 8).length;
check(collapsed === 0, `${collapsed} شکل SVG ابعاد صفر دارد (خالی رندر شده)`);
console.log(`✓ بازی تصویری: ${svgCount} شکل SVG با ابعاد درست`);

// شکل‌ها باید محتوای واقعی داشته باشند (path/circle/rect)، نه svg خالی
const empties = await page.locator('.opt svg').evaluateAll(
  (els) => els.filter((e) => e.children.length === 0).length,
);
check(empties === 0, `${empties} شکل SVG بدون محتواست`);

await browser.close();

// ── گزارش ───────────────────────────────────────────────────────────────
const real404 = consoleErrors.filter((e) => !/favicon/i.test(e));
if (real404.length) {
  console.log(`\nخطای کنسول (${real404.length}):`);
  [...new Set(real404)].slice(0, 10).forEach((e) => console.log('  ⚠ ' + e));
  errors.push(`${real404.length} خطای کنسول`);
}
if (errors.length) {
  console.log(`\nخطا (${errors.length}):`);
  errors.forEach((e) => console.log('  ✗ ' + e));
  process.exit(1);
}
console.log('\n✓ آزمون مرورگر کامل موفق بود.');
