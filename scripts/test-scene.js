#!/usr/bin/env node
/**
 * نگهبانِ آیتم ۵ از §۷.۱۶ — پس‌زمینهٔ صحنه‌ایِ ایستا.
 *
 * ═══════════════════════════════════════════════════════════════════
 * چرا این نگهبان لازم شد
 * ═══════════════════════════════════════════════════════════════════
 *
 * خانه و جشن رنگِ تخت داشتند. حالا یک صحنهٔ ایستا (تپه + خورشید)
 * پشتشان است. این نگهبان چهار قرارداد را قفل می‌کند:
 *
 *   • صحنه در خانه و صفحهٔ پایان هست (پس‌زمینهٔ ::before).
 *   • ایستا: هیچ انیمیشنی — پس‌زمینهٔ «زنده» ممنوع (فاز ۴.۵).
 *   • تزئینی: pointer-events: none و پشتِ محتوا (z-index منفی).
 *   • هیچ سرریزی نمی‌سازد.
 *
 * چه چیزی را نمی‌سنجد: زیباییِ صحنه را نمی‌سنجد — عکس باید دیده
 * شود (قانون ۱۱). قراردادها را می‌سنجد.
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

/** وضعیتِ لایهٔ پس‌زمینهٔ یک صفحه. */
const layer = (sel) =>
  page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const cs = getComputedStyle(el, '::before');
    return {
      has: cs.content !== 'none',
      bg: cs.backgroundImage !== 'none' && cs.backgroundImage !== undefined,
      h: parseFloat(cs.height) || 0,
      anim: cs.animationName,
      z: cs.zIndex,
      pe: cs.pointerEvents,
    };
  }, sel);

// ── ۱. خانه ───────────────────────────────────────────────────────────
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
{
  const l = await layer('.screen.home');
  check(l, 'صفحهٔ خانه پیدا نشد');
  check(l && l.has && l.bg, 'خانه پس‌زمینهٔ صحنه‌ای ندارد');
  check(l && l.h > 0, 'پس‌زمینهٔ خانه ارتفاع صفر دارد — دیده نمی‌شود');
  check(l && l.anim === 'none', 'پس‌زمینهٔ خانه انیمیشن دارد — باید ایستا باشد');
  check(l && l.z === '-1', 'پس‌زمینهٔ خانه باید پشتِ محتوا باشد (z-index منفی)');
  check(l && l.pe === 'none', 'پس‌زمینهٔ خانه نباید تعاملی باشد');
  notes.push('خانه: صحنهٔ ایستا');
}

// ── ۲. صفحهٔ پایان درس ────────────────────────────────────────────────
{
  await page.locator('.play-btn').click();
  await page.waitForSelector('.prompt');
  for (let i = 0; i < 20; i++) {
    if (await page.locator('.done-card').count()) break;
    const opt = page.locator('.opt:not([disabled])').first();
    const canvas = page.locator('canvas.pad').first();
    if (await canvas.count()) {
      const b = await canvas.boundingBox();
      if (b) {
        await page.mouse.move(b.x + 30, b.y + 30);
        await page.mouse.down();
        for (let k = 0; k < 40; k++) await page.mouse.move(b.x + 30 + k * 4, b.y + 35 + k * 3);
        await page.mouse.up();
      }
      await page.waitForTimeout(1100);
    } else if (await opt.count()) {
      await opt.click();
      await page.waitForTimeout(2100);
    } else break;
  }
  await page.waitForSelector('.done-card', { timeout: 5000 }).catch(() => {});
  const l = await layer('.screen.done');
  check(l, 'صفحهٔ پایان درس پیدا نشد');
  check(l && l.has && l.bg, 'صفحهٔ پایان درس پس‌زمینهٔ صحنه‌ای ندارد');
  check(l && l.h > 0, 'پس‌زمینهٔ پایان درس ارتفاع صفر دارد — دیده نمی‌شود');
  check(l && l.anim === 'none', 'پس‌زمینهٔ پایان درس انیمیشن دارد — باید ایستا باشد');
  check(l && l.z === '-1', 'پس‌زمینهٔ پایان باید پشتِ محتوا باشد');
  check(l && l.pe === 'none', 'پس‌زمینهٔ پایان نباید تعاملی باشد');
  notes.push('پایان درس: صحنهٔ ایستا');
}

// ── ۳. بی‌سرریز ──────────────────────────────────────────────────────
{
  const ox = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  check(!ox, 'پس‌زمینهٔ صحنه‌ای سرریزِ افقی ساخته است');
}

await browser.close();

console.log('── نگهبانِ پس‌زمینهٔ صحنه‌ایِ ایستا (§۷.۱۶ آیتم ۵) ──');
notes.forEach((n) => console.log('  ' + n));
if (errors.length) {
  console.log(`\nمشکل (${errors.length}):`);
  [...new Set(errors)].forEach((e) => console.log('  ✗ ' + e));
  process.exit(1);
}
console.log('\n✓ خانه و جشن پس‌زمینهٔ ایستای صحنه‌ای دارند، پشتِ محتوا و بی‌تعامل.');
