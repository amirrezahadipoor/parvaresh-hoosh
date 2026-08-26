#!/usr/bin/env node
/**
 * نگهبانِ عمقِ بازی‌ها (گسترش به درخواستِ مالک، در چارچوبِ §۷.۴).
 *
 * ═══════════════════════════════════════════════════════════════════
 * چرا این نگهبان لازم شد
 * ═══════════════════════════════════════════════════════════════════
 *
 * «عمق» یعنی چیزی که ماشینی می‌شود شکست: رشتهٔ پاسخ‌های درست باید
 * پاداش بدهد، برجِ پاسخ باید دیده شود، و حافظه باید مرحلهٔ عمیق‌تری
 * داشته باشد. این نگهبان سه لایه را قفل می‌کند:
 *
 *   • منطقِ خالص (streakBonus/pointsFor/towerBlocks) — عددِ درست.
 *   • حضورِ ساختاری در رابط (شعله و برج) — بی‌صدا و تزئینی.
 *   • رفتارِ واقعی در مرورگر — بلوکِ برج با پاسخِ درست زیاد می‌شود
 *     و شعله با دو درستِ پیاپی روشن می‌شود.
 *
 * چه چیزی را نمی‌سنجد: «سرگرم‌کننده بودن» را نمی‌سنجد — آن را فقط
 * کودکِ واقعی می‌گوید. سازگاریِ مکانیکی را می‌سنجد.
 */

import { readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { streakBonus, pointsFor, towerBlocks, TOWER_CAP } from '../src/core/game-depth.js';
import { GAMES } from '../src/data/games.js';

const BASE = process.env.BASE_URL || 'http://localhost:8080';

const errors = [];
const notes = [];
const check = (cond, msg) => {
  if (!cond) errors.push(msg);
};

// ── ۱. منطقِ خالص ────────────────────────────────────────────────────
{
  check(streakBonus(0) === 0 && streakBonus(1) === 0, 'رشتهٔ کمتر از ۲ نباید پاداش بدهد');
  check(pointsFor(1) === 1, 'پاسخِ اول باید ۱ امتیاز باشد');
  check(pointsFor(2) === 2 && pointsFor(3) === 3 && pointsFor(4) === 4, 'پاداش باید ۰،۱،۲،۳ پیش برود');
  check(pointsFor(5) === 4 && pointsFor(10) === 4, 'پاداش باید در +۳ سقف کند — شعله بی‌نهایت نشود');
  check(towerBlocks(0) === 0 && towerBlocks(5) === 5, 'بلوک‌های برج باید با امتیاز بخوانند');
  check(towerBlocks(TOWER_CAP + 10) === TOWER_CAP, 'برج باید سقفِ نمایشی داشته باشد');
  check(Number.isInteger(TOWER_CAP) && TOWER_CAP >= 8, 'سقفِ برج باید حداقل ۸ باشد تا «برج» دیده شود');
  notes.push('واحد: منحنیِ پاداش و بلوک‌های برج درست‌اند');
}

// ── ۲. ساختار: شعله در بازی‌های امتیازی، برج در «برجِ پاسخ»، مراحلِ حافظه ──
{
  const screens = readFileSync(new URL('../src/ui/screens.js', import.meta.url), 'utf8');
  const games = readFileSync(new URL('../src/data/games.js', import.meta.url), 'utf8');
  check(screens.includes('streakBonus('), 'صفحهٔ بازی از streakBonus استفاده نمی‌کند');
  check(screens.includes('pointsFor('), 'صفحهٔ بازی امتیازِ رشته را اعمال نمی‌کند');
  check(screens.includes('FLAME_ICO'), 'شعلهٔ رشته در رابط نیست');
  check(screens.includes('class: `g-fire'), 'نشانِ شعله (g-fire) در نوارِ وضعیت نیست');
  check(screens.includes("g.id === 'tower'"), 'برجِ پاسخ رفتارِ ویژه ندارد');
  check(screens.includes('towerBlocks(score)'), 'برج با امتیاز ساخته نمی‌شود');
  const memory = GAMES.find((g) => g.id === 'memory');
  check(memory.levels.length >= 6, 'حافظه باید مراحلِ عمیق‌تری داشته باشد (گسترش)');
  check(memory.levels.includes(10) && memory.levels.includes(12), 'مراحلِ ۱۰ و ۱۲ جفت در حافظه نیست');
  notes.push('ساختار: شعله، برج و مراحلِ عمیق‌تر حافظه حاضرند');
}

// ── ۳. مرورگر: رفتارِ واقعی ──────────────────────────────────────────
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
await page.locator('.btn.ghost', { hasText: 'بازی‌ها' }).click();
await page.waitForSelector('.game-card');

// ۳الف) شعله: در شروع خاموش است.
{
  await page.locator('.game-card', { hasText: 'مسابقهٔ سرعت' }).click();
  await page.waitForSelector('.prompt');
  const f = await page.evaluate(() => {
    const el = document.querySelector('.g-fire');
    return { exists: !!el, on: el?.classList.contains('on') ?? false };
  });
  check(f.exists, 'شعلهٔ رشته در بازیِ امتیازی نیست');
  check(!f.on, 'شعله نباید در شروعِ بازی روشن باشد');
}

// ۳ب و ۳ج) شعله و برج، هر دو در «برجِ پاسخ»:
//    برج تایمر ندارد (بازیِ زمان‌دارِ سرعت با جریمهٔ ۵ ثانیه‌ای وسطِ
//    آزمون تمام می‌شد — اینجا پایدار است)؛ فقط سه خطا بازی را
//    می‌بندد، پس روی «دوباره» ری‌استارت می‌کنیم.
{
  await page.locator('.icon-btn[aria-label="بازگشت"]').click().catch(() => {});
  await page.waitForSelector('.game-card');
  await page.locator('.game-card', { hasText: 'برجِ پاسخ' }).click();
  await page.waitForSelector('.prompt');
  check(await page.locator('.g-tower').count() === 1, 'برجِ دیداری در «برجِ پاسخ» نیست');
  let blocksObserved = 0;
  let fireObserved = false;
  let lastOk = false;
  for (let i = 0; i < 26 && (blocksObserved < 2 || !fireObserved); i++) {
    if (!(await page.locator('.prompt').count())) {
      // سه خطا بازی را بست — «دوباره» بزن و رشته را از نو بساز.
      const again = page.locator('.btn', { hasText: 'دوباره' }).first();
      if (await again.count()) {
        await again.click();
        await page.waitForSelector('.prompt', { timeout: 4000 }).catch(() => {});
        lastOk = false;
        continue;
      }
      break;
    }
    const b1 = await page.evaluate(() => document.querySelectorAll('.g-tower .tower-b').length);
    await page.locator('.opt:not([disabled])').first().click();
    await page.waitForTimeout(120);
    const ok = (await page.locator('.feedback.ok').count()) > 0;
    await page.waitForTimeout(700);
    const after = await page.evaluate(() => ({
      b: document.querySelectorAll('.g-tower .tower-b').length,
      fire: document.querySelector('.g-fire')?.classList.contains('on') ?? false,
    }));
    if (ok) {
      if (after.b === b1 + 1) blocksObserved++;
      if (ok && lastOk && after.fire) fireObserved = true;
    }
    lastOk = ok;
  }
  check(blocksObserved >= 1, 'هیچ بلوکی به برج اضافه نشد — برج با امتیاز نمی‌خواند');
  check(fireObserved, 'شعله با دو پاسخِ درستِ پیاپی روشن نشد');
  notes.push(`مرورگر: ${blocksObserved} بار بلوکِ برج افزایش یافت؛ شعله ${fireObserved ? 'روشن شد' : 'دیده نشد'}`);
}

await browser.close();

console.log('── نگهبانِ عمقِ بازی‌ها (§۷.۴ — گسترش) ──');
notes.forEach((n) => console.log('  ' + n));
if (errors.length) {
  console.log(`\nمشکل (${errors.length}):`);
  [...new Set(errors)].forEach((e) => console.log('  ✗ ' + e));
  process.exit(1);
}
console.log('\n✓ رشته پاداش می‌دهد، برج دیده می‌شود و حافظه عمیق‌تر است.');
