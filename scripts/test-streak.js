#!/usr/bin/env node
/**
 * نگهبانِ آیتم ۱ از §۷.۱۶ — زنجیرهٔ دیداریِ پاسخ‌های درست.
 *
 * ═══════════════════════════════════════════════════════════════════
 * چرا این نگهبان لازم شد
 * ═══════════════════════════════════════════════════════════════════
 *
 * ملودیِ بالارونده (§۷.۳) فقط صدا بود؛ در حالتِ بی‌صدا هیچ نشانه‌ای از
 * «رشتهٔ پاسخ‌های درست» وجود نداشت — نقضِ قانونِ «بی‌صدا هم باید جشن
 * باشد». این گارد همتایِ دیداریِ همان زنجیره را نگه می‌دارد:
 *
 *   درست → یک نشان روشن (تا سقف ۳)، غلط → همه خاموش.
 *   روشن‌شدن فقط در لحظهٔ گذار — حینِ پرسش هیچ حرکتی نیست (قانون ۱).
 *
 * چه چیزی را نمی‌سنجد: «زیبایی» را نمی‌سنجد — اینکه نشان‌ها واقعاً
 * دیده می‌شوند را باید چشمِ آدم ببیند (قانون ۱۱). رفتار و بی‌حرکتی
 * را می‌سنجد.
 */

import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL || 'http://localhost:8080';

const errors = [];
const notes = [];
const check = (cond, msg) => {
  if (!cond) errors.push(msg);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

const fresh = () =>
  page.evaluate(() => {
    localStorage.setItem(
      'parvaresh-hoosh/v4',
      JSON.stringify({
        childName: 'آزمون',
        age: 5,
        muted: true,
        lessons: {},
        stars: 0,
        dailyLimitMin: 0,
        playLog: {},
        gameScores: {},
      }),
    );
  });

await page.goto(BASE, { waitUntil: 'networkidle' });
await fresh();
await page.reload({ waitUntil: 'networkidle' });
await page.locator('.play-btn').click();
await page.waitForSelector('.prompt');

// ── ۱. ساختار: سربرگِ زنجیره، سه نشان، و هوشیِ کوچک کنارش ────────────
{
  const s = await page.evaluate(() => ({
    head: !!document.querySelector('.lesson-head'),
    dots: document.querySelectorAll('.streak-dot').length,
    miniBuddy: document.querySelectorAll('.lesson-head .buddy.mini svg').length,
  }));
  check(s.head, 'سربرگِ زنجیره (.lesson-head) در صفحهٔ درس نیست');
  check(s.dots === 3, `زنجیره باید سه نشان داشته باشد، ${s.dots} دارد`);
  check(s.miniBuddy === 1, 'کنارِ زنجیره هوشیِ کوچک نیست — «سه نشان کنار هوشی» (§۷.۱۶)');
}

// ── ۲. حینِ پرسش بی‌حرکت است (قانون ۱ §۷.۱۶) ─────────────────────────
{
  const anim = await page.evaluate(() => {
    const out = [];
    for (const d of document.querySelectorAll('.streak-dot')) {
      const cs = getComputedStyle(d);
      if (cs.animationName !== 'none') out.push(cs.animationName);
    }
    return out;
  });
  check(anim.length === 0, `حینِ پرسش نشان‌های زنجیره حرکت دارند: ${anim.join('، ')}`);
  notes.push('زنجیره حینِ پرسش: بی‌حرکت');
}

// ── ۳. رفتار: درست → یکی روشن (تا سقف ۳)، غلط → همه خاموش ─────────────
let prevLit = 0;
let okEvents = 0;
let noEvents = 0;
let maxLit = 0;
const violations = [];

for (let i = 0; i < 40 && errors.length < 20; i++) {
  if (await page.locator('.done-card').count()) {
    // درس تمام شد — زنجیرهٔ درسِ بعدی با ۰ شروع می‌شود (هر درس نو).
    await page.locator('.next-btn').click().catch(() => {});
    await page.waitForSelector('.prompt', { timeout: 4000 }).catch(() => {});
    if (!(await page.locator('.prompt').count())) break;
    prevLit = 0;
    continue;
  }

  const canvas = page.locator('canvas.pad').first();
  const opt = page.locator('.opt:not([disabled])').first();

  if (await canvas.count()) {
    // گِرد خط‌کشیدن همیشه «درست» است — یک مسیرِ قطعی برای روشن‌شدن.
    const b = await canvas.boundingBox();
    if (b) {
      await page.mouse.move(b.x + 30, b.y + 30);
      await page.mouse.down();
      for (let k = 0; k < 40; k++) await page.mouse.move(b.x + 30 + k * 4, b.y + 35 + k * 3);
      await page.mouse.up();
    }
    await page.waitForTimeout(1000); // finishTrace (۶۵۰ms) اجرا شود
    okEvents++;
    const lit = await page.locator('.streak-dot.on').count();
    maxLit = Math.max(maxLit, lit);
    const expect = Math.min(3, prevLit + 1);
    if (lit !== expect) {
      violations.push(`بعد از «درست» (خط‌کشی): ${prevLit}→${lit}، انتظار ${expect}`);
    }
    prevLit = lit;
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
    const lit = await page.locator('.streak-dot.on').count();
    maxLit = Math.max(maxLit, lit);
    if (ok) {
      okEvents++;
      const expect = Math.min(3, prevLit + 1);
      if (lit !== expect) {
        violations.push(`بعد از «درست» (گزینه): ${prevLit}→${lit}، انتظار ${expect}`);
      }
      prevLit = lit;
    } else {
      noEvents++;
      if (lit !== 0) violations.push(`بعد از «غلط» (گزینه): ${prevLit}→${lit}، باید همه خاموش شوند`);
      prevLit = 0;
    }
    await page.waitForTimeout(ok ? 1000 : 2000);
  } else if (await page.locator('.order-item:not(.picked)').count()) {
    // گِرد چیدنی: همه را لمس کن، بگذار نتیجه بیاید.
    while (await page.locator('.order-item:not(.picked)').count()) {
      await page.locator('.order-item:not(.picked)').first().click().catch(() => {});
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(1200);
    const ok = (await page.locator('.feedback.ok').count()) > 0;
    const lit = await page.locator('.streak-dot.on').count();
    maxLit = Math.max(maxLit, lit);
    if (ok) {
      okEvents++;
      const expect = Math.min(3, prevLit + 1);
      if (lit !== expect) {
        violations.push(`بعد از «درست» (چیدنی): ${prevLit}→${lit}، انتظار ${expect}`);
      }
      prevLit = lit;
    } else {
      noEvents++;
      if (lit !== 0) violations.push(`بعد از «غلط» (چیدنی): ${prevLit}→${lit}، باید همه خاموش شوند`);
      prevLit = 0;
    }
    await page.waitForTimeout(1900);
  } else if (await page.locator('.card:not(.matched)').count()) {
    // حافظه: تا پیدا شدنِ همهٔ جفت‌ها — پایانش همیشه «درست» است.
    for (let t = 0; t < 30 && !(await page.locator('.feedback.ok').count()); t++) {
      await page.locator('.card:not(.matched):not(.up)').first().click().catch(() => {});
      await page.waitForTimeout(250);
    }
    await page.waitForTimeout(400);
    const lit = await page.locator('.streak-dot.on').count();
    maxLit = Math.max(maxLit, lit);
    if (await page.locator('.feedback.ok').count()) {
      okEvents++;
      const expect = Math.min(3, prevLit + 1);
      if (lit !== expect) {
        violations.push(`بعد از «درست» (حافظه): ${prevLit}→${lit}، انتظار ${expect}`);
      }
      prevLit = lit;
    }
    await page.waitForTimeout(1300);
  } else {
    break;
  }

  // بس است: نمونهٔ کافی از هر دو رفتار دیده شد.
  if (okEvents >= 6 && noEvents >= 3) break;
}

check(okEvents >= 1, 'حتی یک پاسخِ درست هم رخ نداد — رفتارِ روشن‌شدن آزموده نشد');
check(noEvents >= 1, 'حتی یک پاسخِ غلط هم رخ نداد — رفتارِ خاموش‌شدن آزموده نشد');
check(maxLit <= 3, `زنجیره بیش از سه نشان روشن شد: ${maxLit}`);
violations.forEach((v) => errors.push(v));
notes.push(`رفتار: ${okEvents} درست، ${noEvents} غلط، بیشترین روشن‌شدگی ${maxLit}`);

// ── ۴. سقفِ ۳ در خودِ کد — تا آستانه‌ها با هم جا‌به‌جا نشوند ────────────
{
  const src = await (await fetch(`${BASE}/src/ui/screens.js`)).text();
  check(/Math\.min\(3,\s*streak\s*\+\s*1\)/.test(src), 'سقفِ سه نشانِ روشن در کد نیست');
}

await browser.close();

console.log('── نگهبانِ زنجیرهٔ دیداری (§۷.۱۶ آیتم ۱) ──');
notes.forEach((n) => console.log('  ' + n));
if (errors.length) {
  console.log(`\nمشکل (${errors.length}):`);
  [...new Set(errors)].forEach((e) => console.log('  ✗ ' + e));
  process.exit(1);
}
console.log('\n✓ هر پاسخِ درست یک نشان روشن می‌کند، خطا همه را خاموش، و حینِ پرسش بی‌حرکت است.');
