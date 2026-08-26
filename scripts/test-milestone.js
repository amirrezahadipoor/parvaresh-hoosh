#!/usr/bin/env node
/**
 * نگهبانِ آیتم‌های ۴ و ۶ از §۷.۱۶ — جشنِ قدم‌های گرد و هوشیِ «وای».
 *
 * ═══════════════════════════════════════════════════════════════════
 * چرا این نگهبان لازم شد
 * ═══════════════════════════════════════════════════════════════════
 *
 * هر ۳۰۷ درس با یک جشنِ یکسان تمام می‌شد؛ کودک هیچ تفاوتی بین
 * «قدمِ ۵۰» و «درسِ معمولی» نمی‌دید. حالا گام‌های گرد (۵۰/۱۰۰/۲۰۰/
 * ۳۰۷) و پایانِ هر حوزه جشنِ متفاوت دارند: هوشیِ «وای»، نشانِ جام،
 * هالهٔ طلایی. این نگهبان سه قرارداد را قفل می‌کند:
 *
 *   • `milestoneOf` خالص است و قدم‌های گرد را درست می‌شناسد.
 *   • صفحهٔ پایانِ درسِ گرد واقعاً جشنِ متفاوت نشان می‌دهد.
 *   • درسِ عادی هرگز جشنِ گرد نمی‌گیرد (جشنِ گرد = قدمِ گرد).
 *
 * چه چیزی را نمی‌سنجد: زیباییِ جشن را نمی‌سنجد — عکس باید دیده
 * شود (قانون ۱۱). رفتار و تمایز را می‌سنجد.
 */

import { readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { SEQUENCE, milestoneOf, MILESTONE_STEPS } from '../src/core/journey.js';
import { DOMAINS } from '../src/data/curriculum.js';

const BASE = process.env.BASE_URL || 'http://localhost:8080';

const errors = [];
const notes = [];
const check = (cond, msg) => {
  if (!cond) errors.push(msg);
};

// ── ۰. استاتیک: هوشیِ «وای» یک حالتِ معنادارِ واقعی است (آیتم ۶) ────
{
  const src = readFileSync(new URL('../src/core/buddy.js', import.meta.url), 'utf8');
  const screens = readFileSync(new URL('../src/ui/screens.js', import.meta.url), 'utf8');
  check(/'wow'/.test(src), 'حالتِ «wow» در هوشی تعریف نشده');
  check(/wow:\s*\{/.test(src), 'حالتِ «wow» چهرهٔ تعریف‌شده ندارد — حالتِ تزئینی ممنوع');
  check(/'wow'/.test(screens), 'هوشیِ «وای» هیچ‌جا استفاده نمی‌شود — حالتِ تزئینی ممنوع');
  notes.push('استاتیک: «wow» تعریف، چهره و استفاده دارد');
}

// ── ۱. واحد: milestoneOf خالص ────────────────────────────────────────
{
  for (const step of MILESTONE_STEPS) {
    const s = SEQUENCE[step - 1];
    const m = milestoneOf(s.lesson.id);
    check(m.kind === 'milestone', `قدمِ ${step} باید 'milestone' باشد، «${m.kind}» است`);
    check(m.step === step, `قدمِ ${step}: milestoneOf عددِ ${m.step} داد`);
  }
  const mid = milestoneOf(SEQUENCE[25].lesson.id);
  check(mid.kind === null, `درسِ عادی باید جشنِ عادی بگیرد، «${mid.kind}» گرفت`);
  // پایانِ هر حوزه (که خودش قدمِ گرد نباشد) باید 'domain-end' باشد.
  for (const d of DOMAINS) {
    const last = SEQUENCE.filter((s) => s.domainId === d.id).at(-1);
    const m = milestoneOf(last.lesson.id);
    if (!MILESTONE_STEPS.includes(last.order + 1)) {
      check(m.kind === 'domain-end', `آخرین درسِ «${d.id}» باید 'domain-end' باشد، «${m.kind}» است`);
    }
  }
  notes.push(`واحد: قدم‌های ${MILESTONE_STEPS.join('، ')} و پایانِ هر حوزه درست‌اند`);
}

// ── ۲. مرورگر: تکمیلِ درسِ ۵۰ → جشنِ متفاوت ──────────────────────────
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

const fresh = (ids) =>
  page.evaluate((idsArg) => {
    const lessons = {};
    for (const id of idsArg) lessons[id] = { completions: 1, bestScore: 95 };
    localStorage.setItem(
      'parvaresh-hoosh/v4',
      JSON.stringify({
        childName: 'آزمون',
        age: 5,
        muted: true,
        lessons,
        stars: 0,
        dailyLimitMin: 0,
        playLog: {},
        gameScores: {},
      }),
    );
  }, ids);

/** یک درس را با ضربه‌زدن تا پایان می‌برد و برمی‌گرداند که به جشن رسیدیم. */
async function playUntilDone() {
  for (let i = 0; i < 30; i++) {
    if (await page.locator('.done-card').count()) return true;
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
  return (await page.locator('.done-card').count()) > 0;
}

// درسِ عادی: جشنِ عادی.
{
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await fresh([]);
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.play-btn').click();
  await page.waitForSelector('.prompt');
  const done = await playUntilDone();
  check(done, 'درسِ عادی تمام نشد — نتوانستیم جشنِ عادی را بسنجیم');
  const normal = await page.evaluate(() => ({
    milestone: document.querySelector('.done-card')?.classList.contains('milestone') ?? false,
    badge: !!document.querySelector('.milestone-badge'),
  }));
  check(!normal.milestone, 'درسِ عادی جشنِ قدمِ گرد گرفت — جشنِ گرد باید فقط برای قدمِ گرد باشد');
  check(!normal.badge, 'درسِ عادی نشانِ جام گرفت');
  notes.push('درسِ عادی: جشنِ عادی');
}

// درسِ ۵۰: جشنِ متفاوت.
{
  const first49 = SEQUENCE.slice(0, 49).map((s) => s.lesson.id);
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await fresh(first49);
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.play-btn').click();
  await page.waitForSelector('.prompt');
  const done = await playUntilDone();
  check(done, 'درسِ ۵۰ تمام نشد — نتوانستیم جشنِ گرد را بسنجیم');
  const big = await page.evaluate(() => {
    const card = document.querySelector('.done-card');
    return {
      milestone: card?.classList.contains('milestone') ?? false,
      badge: !!document.querySelector('.milestone-badge'),
      label: document.querySelector('.mb-label')?.textContent || '',
      hasBuddy: !!document.querySelector('.done-card .buddy svg'),
    };
  });
  check(big.milestone, 'پس از تکمیلِ درسِ ۵۰، جشنِ قدمِ گرد دیده نشد');
  check(big.badge, 'نشانِ جام در جشنِ قدمِ گرد نیست');
  check(big.label.includes('۵۰'), `برچسبِ قدم باید «۵۰» را بگوید، «${big.label}» می‌گوید`);
  check(big.hasBuddy, 'هوشی در جشنِ قدمِ گرد نیست');
  notes.push(`درسِ ۵۰: جشنِ گرد (برچسب «${big.label}»)`);
}

await browser.close();

console.log('── نگهبانِ جشنِ قدم‌های گرد و هوشیِ «وای» (§۷.۱۶ آیتم‌های ۴ و ۶) ──');
notes.forEach((n) => console.log('  ' + n));
if (errors.length) {
  console.log(`\nمشکل (${errors.length}):`);
  [...new Set(errors)].forEach((e) => console.log('  ✗ ' + e));
  process.exit(1);
}
console.log('\n✓ قدم‌های گرد جشنِ متفاوت دارند و درسِ عادی جشنِ عادی می‌گیرد.');
