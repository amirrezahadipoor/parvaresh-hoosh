#!/usr/bin/env node
/**
 * نگهبانِ آیتم ۲ از §۷.۱۶ — لرزشِ مهربان.
 *
 * ═══════════════════════════════════════════════════════════════════
 * چرا این نگهبان لازم شد
 * ═══════════════════════════════════════════════════════════════════
 *
 * «لرزشِ مهربان» باید سه ویژگی داشته باشد که هیچ گاردِ دیگری نمی‌بیند:
 *
 *   ۱. فقط روی پاسخِ درست — غلط هرگز لرزش نمی‌دهد (لرزشِ تنبیهی ممنوع).
 *   ۲. پشتِ تنظیمِ والدین — خاموش‌کردن باید واقعاً خاموش کند.
 *   ۳. در دستگاهِ بی‌پشتیبان بی‌اثر — feature-detect، نه try/catchِ کور.
 *
 * در مرورگرِ بی‌سرِ این آزمون `navigator.vibrate` را با یک شمارنده
 * جایگزین می‌کنیم تا رفتارِ واقعی دیده شود — و این را پیش از بارگذاریِ
 * برنامه تزریق می‌کنیم تا خودِ کدِ برنامه همان چیزی را صدا بزند که
 * روی گوشی صدا می‌زند.
 *
 * چه چیزی را نمی‌سنجد: شدتِ فیزیکیِ لرزش را (۱۵ms) نمی‌سنجد — آن را
 * کدِ ثابتِ `vibrate(15)` نگه می‌دارد و همین‌جا استاتیک بررسی می‌شود.
 */

import { readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL || 'http://localhost:8080';

const errors = [];
const notes = [];
const check = (cond, msg) => {
  if (!cond) errors.push(msg);
};

// ── ۱. استاتیک: ماژولِ لرزش، feature-detect، و اتصالش به صفحهٔ درس ──
{
  const haptics = readFileSync(new URL('../src/core/haptics.js', import.meta.url), 'utf8');
  const screens = readFileSync(new URL('../src/ui/screens.js', import.meta.url), 'utf8');
  check(haptics.includes('navigator.vibrate'), 'در haptics.js هیچ ارجاعی به navigator.vibrate نیست');
  check(
    /typeof\s+navigator\.vibrate\s*!==\s*'function'/.test(haptics),
    'لرزش feature-detect ندارد — در دستگاهِ بی‌پشتیبان باید بی‌اثر باشد',
  );
  check(haptics.includes('vibrate(15)'), 'لرزش باید تپِ کوتاهِ ۱۵ms باشد («مهربان»)');
  check(screens.includes('gentleBuzz()'), 'صفحهٔ درس لرزش را صدا نمی‌زند');
  notes.push('استاتیک: haptics.js + gentleBuzz در صفحهٔ درس');
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

// شمارندهٔ لرزش را پیش از هر بارگذاری تزریق کن — همان چیزی که
// haptics.js صدا می‌زند، این‌جا شمرده می‌شود.
await page.addInitScript(() => {
  window.__buzz = 0;
  try {
    navigator.vibrate = () => {
      window.__buzz += 1;
      return true;
    };
  } catch {
    window.__buzz = -1;
  }
});

const fresh = (vibrate) =>
  page.evaluate((v) => {
    localStorage.setItem(
      'parvaresh-hoosh/v4',
      JSON.stringify({
        childName: 'آزمون',
        age: 5,
        muted: true,
        vibrate: v,
        lessons: {},
        stars: 0,
        dailyLimitMin: 0,
        playLog: {},
        gameScores: {},
      }),
    );
  }, vibrate);

// ── ۲. روشن: درست → لرزش؛ غلط → هیچ ──────────────────────────────────
await page.goto(BASE, { waitUntil: 'networkidle' });
await fresh(true);
await page.reload({ waitUntil: 'networkidle' });
await page.locator('.play-btn').click();
await page.waitForSelector('.prompt');

let okEvents = 0;
let noEvents = 0;
const violations = [];

for (let i = 0; i < 40 && errors.length < 20; i++) {
  if (await page.locator('.done-card').count()) {
    await page.locator('.next-btn').click().catch(() => {});
    await page.waitForSelector('.prompt', { timeout: 4000 }).catch(() => {});
    if (!(await page.locator('.prompt').count())) break;
    continue;
  }

  const canvas = page.locator('canvas.pad').first();
  const opt = page.locator('.opt:not([disabled])').first();
  const buzz = await page.evaluate(() => window.__buzz);

  if (await canvas.count()) {
    // خط‌کشی همیشه «درست» است — مسیرِ قطعیِ لرزش.
    const b = await canvas.boundingBox();
    if (b) {
      await page.mouse.move(b.x + 30, b.y + 30);
      await page.mouse.down();
      for (let k = 0; k < 40; k++) await page.mouse.move(b.x + 30 + k * 4, b.y + 35 + k * 3);
      await page.mouse.up();
    }
    await page.waitForTimeout(1000);
    const now = await page.evaluate(() => window.__buzz);
    okEvents++;
    if (now !== buzz + 1) violations.push(`خط‌کشیِ درست: لرزش ${buzz}→${now}، باید +۱`);
    await page.waitForTimeout(900);
  } else if (await opt.count()) {
    await opt.click();
    await page
      .waitForFunction(
        () => document.querySelector('.feedback.ok') || document.querySelector('.feedback.no'),
        { timeout: 2500 },
      )
      .catch(() => {});
    const ok = (await page.locator('.feedback.ok').count()) > 0;
    const now = await page.evaluate(() => window.__buzz);
    if (ok) {
      okEvents++;
      if (now !== buzz + 1) violations.push(`پاسخِ درست (گزینه): لرزش ${buzz}→${now}، باید +۱`);
    } else {
      noEvents++;
      if (now !== buzz) violations.push(`پاسخِ غلط (گزینه): لرزش ${buzz}→${now}، غلط نباید لرزش بدهد`);
    }
    await page.waitForTimeout(ok ? 1000 : 2000);
  } else if (await page.locator('.order-item:not(.picked)').count()) {
    while (await page.locator('.order-item:not(.picked)').count()) {
      await page.locator('.order-item:not(.picked)').first().click().catch(() => {});
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(1200);
    const ok = (await page.locator('.feedback.ok').count()) > 0;
    const now = await page.evaluate(() => window.__buzz);
    if (ok) {
      okEvents++;
      if (now !== buzz + 1) violations.push(`چیدنیِ درست: لرزش ${buzz}→${now}، باید +۱`);
    } else {
      noEvents++;
      if (now !== buzz) violations.push(`چیدنیِ غلط: لرزش ${buzz}→${now}، غلط نباید لرزش بدهد`);
    }
    await page.waitForTimeout(1900);
  } else if (await page.locator('.card:not(.matched)').count()) {
    for (let t = 0; t < 30 && !(await page.locator('.feedback.ok').count()); t++) {
      await page.locator('.card:not(.matched):not(.up)').first().click().catch(() => {});
      await page.waitForTimeout(250);
    }
    await page.waitForTimeout(400);
    const now = await page.evaluate(() => window.__buzz);
    if (await page.locator('.feedback.ok').count()) {
      okEvents++;
      if (now !== buzz + 1) violations.push(`حافظه: لرزش ${buzz}→${now}، باید +۱`);
    }
    await page.waitForTimeout(1300);
  } else {
    break;
  }

  if (okEvents >= 6 && noEvents >= 3) break;
}

check(okEvents >= 1, 'حتی یک پاسخِ درست هم رخ نداد — لرزشِ درست آزموده نشد');
check(noEvents >= 1, 'حتی یک پاسخِ غلط هم رخ نداد — ممنوعیتِ لرزشِ غلط آزموده نشد');
violations.forEach((v) => errors.push(v));
notes.push(`روشن: ${okEvents} درست (لرزش دیده شد)، ${noEvents} غلط (بی‌لرزش)`);

// ── ۳. خاموش با تنظیمِ والدین: درست هم نباید لرزش بدهد ────────────────
await fresh(false);
await page.reload({ waitUntil: 'networkidle' });
await page.locator('.play-btn').click();
await page.waitForSelector('.prompt');
let okOff = 0;
for (let i = 0; i < 20; i++) {
  if (await page.locator('.done-card').count()) break;
  const canvas = page.locator('canvas.pad').first();
  const opt = page.locator('.opt:not([disabled])').first();
  if (await canvas.count()) {
    const b = await canvas.boundingBox();
    if (b) {
      await page.mouse.move(b.x + 30, b.y + 30);
      await page.mouse.down();
      for (let k = 0; k < 40; k++) await page.mouse.move(b.x + 30 + k * 4, b.y + 35 + k * 3);
      await page.mouse.up();
    }
    await page.waitForTimeout(1000);
    okOff++;
    await page.waitForTimeout(900);
  } else if (await opt.count()) {
    await opt.click();
    await page.waitForTimeout(300);
    if (await page.locator('.feedback.ok').count()) okOff++;
    await page.waitForTimeout(2000);
  }
}
const buzzOff = await page.evaluate(() => window.__buzz);
check(okOff >= 1, 'با تنظیمِ خاموش حتی یک پاسخِ درست هم رخ نداد — آزمایشِ خاموشی بی‌اثر بود');
check(buzzOff === 0, `با تنظیمِ «خاموش»، لرزش ${buzzOff} بار رخ داد — تنظیمِ والدین کار نمی‌کند`);
notes.push(`خاموش: ${okOff} پاسخِ درست، ${buzzOff} لرزش`);

// ── ۴. سوییچِ «لرزشِ مهربان» پشتِ دروازهٔ والدین ──────────────────────
{
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await fresh(true);
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.icon-btn[aria-label="تنظیمات"]').click();
  await page.waitForSelector('.gate input');
  const mult = await page.evaluate(() => {
    const p = document.querySelector('.gate .prompt').textContent.trim().replace(/[×=?\s]/g, ' ');
    const nums = p.match(/\d+/g).map(Number);
    return String(nums[0] * nums[1]);
  });
  await page.locator('.gate input').fill(mult);
  await page.locator('.gate .btn', { hasText: 'ورود' }).click();
  await page.waitForSelector('.switch-field');
  const vibSwitch = page.locator('.switch-field', { hasText: 'لرزشِ مهربان' });
  check((await vibSwitch.count()) === 1, 'سوییچِ «لرزشِ مهربان» در تنظیمات نیست');
  if (await vibSwitch.count()) {
    await vibSwitch.locator('input').uncheck();
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('parvaresh-hoosh/v4')).vibrate,
    );
    check(stored === false, 'خاموش‌کردنِ سوییچ در ذخیره‌سازی ثبت نشد');
  }
  notes.push('سوییچِ «لرزشِ مهربان» پشتِ دروازهٔ والدین است و ذخیره می‌شود');
}

await browser.close();

console.log('── نگهبانِ لرزشِ مهربان (§۷.۱۶ آیتم ۲) ──');
notes.forEach((n) => console.log('  ' + n));
if (errors.length) {
  console.log(`\nمشکل (${errors.length}):`);
  [...new Set(errors)].forEach((e) => console.log('  ✗ ' + e));
  process.exit(1);
}
console.log('\n✓ درست می‌لرزد، غلط هرگز، و خاموشیِ والدین واقعاً خاموش می‌کند.');
