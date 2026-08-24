// آزمون واقعیِ مرورگر — برنامه را باز می‌کند و یک درس کامل را بازی می‌کند.
//
// این آزمون چیزی را می‌سنجد که آزمون‌های واحد نمی‌توانند: اینکه برنامه
// در یک مرورگر واقعی بالا می‌آید، دکمه‌ها کار می‌کنند و هیچ خطای
// کنسولی رخ نمی‌دهد.
//
// اجرا:  node scripts/test-browser.js   (سرور باید روی ۸۰۸۰ باشد)

import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL || 'http://localhost:8080';

// از خودِ داده می‌خوانیم تا با رشد محتوا آزمون نشکند.
const { LESSONS } = await import('../src/data/lessons/index.js');
const LESSON_COUNT = LESSONS.length;
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

// ── خانه: یک دکمهٔ بازی، نه منوی حوزه‌ها ────────────────────────────────
// قرارداد جدید: کودک با *یک* تپ به بازی می‌رسد. اگر روزی دوباره
// منوی چندطبقه برگردد، این آزمون می‌شکند — و باید بشکند.
await page.waitForSelector('.play-btn', { timeout: 5000 });
const playBtns = await page.locator('.play-btn').count();
check(playBtns === 1, `خانه باید دقیقاً یک دکمهٔ بازی داشته باشد، ${playBtns} دارد`);

const playTitle = await page.locator('.play-title').textContent();
check(/[\u0600-\u06FF]/.test(playTitle), 'عنوان درس روی دکمهٔ بازی فارسی نیست');
console.log(`✓ خانه: یک تپ تا بازی — «${playTitle.trim()}»`);

// شمارش تصمیم‌های لازم برای رسیدن به بازی
const decisions = await page.locator('.screen button:not(.icon-btn)').count();
check(decisions <= 2, `خانه نباید بیش از ۲ دکمه داشته باشد، ${decisions} دارد`);

// ── یک تپ و بازی شروع می‌شود ────────────────────────────────────────────
await page.locator('.play-btn').click();
await page.waitForSelector('.prompt');
console.log('✓ بازی با یک تپ شروع شد');

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
  // گِرد خط‌کشیدن: با انگشت روی بوم می‌کشیم.
  // امتیاز بر پایهٔ تلاش است، پس باید بیش از ۸ نمونهٔ حرکت بفرستیم.
  const canvas = page.locator('canvas').first();
  if (await canvas.count()) {
    rounds++;
    const b = await canvas.boundingBox();
    if (b) {
      await page.mouse.move(b.x + b.width * 0.3, b.y + b.height * 0.25);
      await page.mouse.down();
      for (let k = 0; k < 16; k++) {
        await page.mouse.move(b.x + b.width * (0.3 + k * 0.025), b.y + b.height * (0.25 + k * 0.03));
      }
      await page.mouse.up();
    }
    const doneBtn = page.locator('.btn', { hasText: 'تمام شد' }).first();
    if (await doneBtn.count()) await doneBtn.click();
    await page.waitForTimeout(900);
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
await page.waitForSelector('.play-btn');
await page.locator('.icon-btn[aria-label="تنظیمات"]').click();
// تنظیمات پشت دروازهٔ ضرب است (تا کودک نتواند پیشرفتش را پاک کند).
// ⚠ waitForSelector بدون catch کل آزمون را با TimeoutErrorِ بی‌معنی
// می‌کشد و علت واقعی پنهان می‌ماند. خطای نام‌دار می‌دهیم.
{
  const gateShown = await page
    .waitForSelector('.gate', { timeout: 5000 })
    .then(() => true)
    .catch(() => false);
  if (!gateShown) {
    errors.push('صفحهٔ تنظیمات دروازه ندارد — کودک به پاک‌کردن پیشرفت دسترسی دارد');
  } else {
    const q = await page.locator('.gate .prompt').textContent();
    const m = q.match(/(\d+)\s*×\s*(\d+)/);
    await page.locator('.gate input').fill(String(Number(m[1]) * Number(m[2])));
    await page.locator('.gate button').click();
  }
}
await page.waitForSelector('select');
await page.selectOption('select', '5');
await page.locator('.btn', { hasText: 'ذخیره' }).click();
await page.waitForSelector('.play-btn');

await page.locator('.play-btn').click();
await page.waitForSelector('.opt');
const optsAge5 = await page.locator('.opt').count();
check(optsAge5 === 2, `کودک ۵ ساله باید ۲ گزینه ببیند، ${optsAge5} دید`);
console.log(`✓ سن ۵: ${optsAge5} گزینه (تطبیق سنی واقعاً کار می‌کند)`);

// ── ستاره‌ها ذخیره شده‌اند؟ ─────────────────────────────────────────────
const stars = await page.locator('.stars').first().textContent();
check(/[۰-۹]/.test(stars), 'شمارندهٔ ستاره عدد فارسی ندارد');
console.log(`✓ ستاره‌ها: ${stars.trim()}`);

// ── نقشهٔ سفر: کل مجموعه یک‌جا ──────────────────────────────────────────
await page.locator('.icon-btn[aria-label="بازگشت"]').click();
await page.waitForSelector('.play-btn');
await page.locator('.btn.ghost', { hasText: 'نقشهٔ سفر' }).click();
await page.waitForSelector('.map-item');
const mapItems = await page.locator('.map-item').count();
check(mapItems === LESSON_COUNT, `نقشه باید همهٔ ${LESSON_COUNT} درس را یک‌جا نشان دهد، ${mapItems} نشان داد`);
const lockedCount = await page.locator('.map-item.locked').count();
check(lockedCount > 0, 'نقشه باید درس‌های باز نشده را قفل نشان دهد');
check(lockedCount < mapItems, 'همهٔ درس‌ها قفل‌اند — مسیر پیش نمی‌رود');
console.log(`✓ نقشهٔ سفر: ${mapItems} درس یک‌جا، ${lockedCount} هنوز قفل`);

// درس خواندن را از نقشه باز می‌کنیم (اولین درس مسیر، همیشه باز)
await page.locator('.map-item:not(.locked)').first().click();
await page.waitForSelector('.prompt');
const audioOk = await page.evaluate(async () => {
  const r = await fetch('assets/audio/kid/letter-alef.mp3');
  return r.ok && Number(r.headers.get('content-length')) > 2000;
});
check(audioOk, 'فایل صوتی letter-alef.mp3 در دسترس نیست');
console.log('✓ فایل صوتی از خود برنامه قابل واکشی است');

// ── درس تصویری: شکل‌های SVG باید واقعاً رندر شوند ───────────────────────
await page.locator('.icon-btn[aria-label="بازگشت"]').click();
await page.waitForSelector('.play-btn');
await page.locator('.btn.ghost', { hasText: 'نقشهٔ سفر' }).click();
await page.waitForSelector('.map-item');
await page.locator('.map-item:not(.locked)', { hasText: 'حیوان' }).first().click();
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

// ── دروازهٔ والدین ───────────────────────────────────────────────────────
// ⚠ باگ واقعی: صفحهٔ تنظیمات پشت دروازه نبود و دکمهٔ «پاک کردن همهٔ
// پیشرفت» با یک تپ روی چرخ‌دنده در دسترس کودک بود. confirm() محافظ
// نیست — کودکِ پیش‌خوان متنش را نمی‌خواند و تأیید می‌زند.
// این محافظ می‌پاید که هیچ کارِ ویرانگری بی‌دروازه نماند.
{
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.locator('.icon-btn[aria-label="تنظیمات"]').first().click();
  await page.waitForTimeout(400);

  const gated = await page.evaluate(() => ({
    gate: !!document.querySelector('.gate'),
    danger: [...document.querySelectorAll('button')].some((b) => /پاک کردن/.test(b.textContent)),
    q: document.querySelector('.gate .prompt')?.textContent || '',
  }));
  check(gated.gate, 'تپ روی چرخ‌دنده مستقیم وارد تنظیمات می‌شود — دروازه ندارد');
  check(!gated.danger, 'دکمهٔ «پاک کردن همهٔ پیشرفت» پیش از دروازه دیده می‌شود');

  // ⚠ اگر دروازه نبود، ادامهٔ بررسی‌ها بی‌معنی است و locatorها با
  // TimeoutErrorِ خام کل آزمون را می‌کشند. خطا ثبت شده؛ رد می‌شویم.
  const m = gated.gate ? gated.q.match(/(\d+)\s*×\s*(\d+)/) : null;
  if (gated.gate) {
    // پاسخ غلط نباید رد شود
    await page.locator('.gate input').fill('1');
    await page.locator('.gate button').click();
    await page.waitForTimeout(300);
    check(
      await page.evaluate(() => !!document.querySelector('.gate')),
      'دروازه با پاسخ غلط باز شد',
    );
  }

  // پاسخ درست باید رد شود
  if (m) {
    await page.locator('.gate input').fill(String(Number(m[1]) * Number(m[2])));
    await page.locator('.gate button').click();
    await page.waitForTimeout(400);
    check(
      await page.evaluate(() =>
        [...document.querySelectorAll('button')].some((b) => /پاک کردن/.test(b.textContent)),
      ),
      'دروازه با پاسخ درست باز نشد',
    );
    console.log('✓ دروازهٔ والدین: تنظیمات و پاک‌کردن پیشرفت محافظت شده‌اند');
  } else if (gated.gate) {
    errors.push('پرسش دروازه خوانده نشد');
  }
}

// ── نمودار هفتگی والدین ─────────────────────────────────────────────────
// ⚠ باگ: ستون‌های بلند بریده می‌شدند (۷۷٪ و ۱۰۰٪ هر دو ۷۲px) چون
// درصدِ ارتفاع در برابر کل ستون شامل برچسب روز حساب می‌شد. نمودار
// دروغ می‌گفت. اینجا نسبتِ واقعیِ پیکسل‌ها سنجیده می‌شود، نه فقط
// وجودِ نمودار.
{
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const playLog = {};
    const mins = [8, 14, 5, 22, 11, 17, 9];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const p2 = (x) => String(x).padStart(2, '0');
      playLog[`${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`] = mins[i];
    }
    const s = JSON.parse(localStorage.getItem('parvaresh-hoosh/v4') || '{}');
    localStorage.setItem('parvaresh-hoosh/v4', JSON.stringify({ ...s, playLog }));
  });
  await page.goto(BASE, { waitUntil: 'networkidle' });

  const pass = async (sel) => {
    const q = await page.locator('.gate .prompt').textContent();
    const m2 = q.match(/(\d+)\s*×\s*(\d+)/);
    await page.locator('.gate input').fill(String(Number(m2[1]) * Number(m2[2])));
    await page.locator('.gate button').click();
    await page.waitForTimeout(350);
  };
  await page.locator('.icon-btn[aria-label="تنظیمات"]').first().click();
  await page.waitForTimeout(350);
  await pass();
  await page.locator('.btn.ghost', { hasText: 'بخش والدین' }).click();
  await page.waitForTimeout(350);
  if (await page.locator('.gate').count()) await pass();

  const bars = await page.evaluate(() =>
    [...document.querySelectorAll('.chart .bar')].map((b) => ({
      pct: parseFloat(b.style.height),
      px: b.getBoundingClientRect().height,
    })),
  );
  check(bars.length === 7, `نمودار هفته باید ۷ ستون داشته باشد، ${bars.length} دارد`);
  if (bars.length === 7) {
    const tallest = bars.reduce((a, b) => (b.pct > a.pct ? b : a));
    const clipped = bars.filter((b) => b.pct < tallest.pct - 5 && b.px >= tallest.px - 1);
    check(
      clipped.length === 0,
      `${clipped.length} ستون نمودار بریده شده — ارتفاع با درصدش نمی‌خواند`,
    );
    console.log('✓ نمودار هفتگی: ارتفاع ستون‌ها با داده می‌خواند');
  }
}

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
