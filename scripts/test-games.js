#!/usr/bin/env node
/**
 * نگهبانِ گسترشِ بازی‌ها (دستورِ مالک، در چارچوبِ §۷.۴) + آیتم ۸ §۷.۱۶
 * — کارت‌های صحنه‌دار.
 *
 * ═══════════════════════════════════════════════════════════════════
 * چرا این نگهبان لازم شد
 * ═══════════════════════════════════════════════════════════════════
 *
 * بازی‌ها «هیچ محتوای تازه‌ای نمی‌سازند» — از موتورِ گِرد تغذیه
 * می‌کنند. پس یک بازیِ تازه می‌تواند به‌ظاهر سبز بماند ولی واقعاً
 * هیچ گِردی نسازد (استخرِ خالی = بازیِ بسته‌شده در یک چشم‌برهم).
 * این نگهبان قفل می‌کند:
 *
 *   • هر بازی دست‌کم یک گِردِ واقعی از درس‌ها می‌سازد — در هر دو
 *     ردهٔ سنی.
 *   • بازیِ زمان‌دار/جان‌دار فقط گِردِ تک‌ضربه‌ای دارد (چیدنی و
 *     حافظه وسطِ مسابقه‌ی زمان‌دار خراب می‌شوند — §۷.۴).
 *   • شناسه/نشان/رنگِ بازی‌ها یکتاست (کودک فهرست را از روی شکل
 *     می‌شناسد).
 *   • هر بازی در README مستند است (سند دروغ نگوید).
 *   • کارتِ هر بازی صحنه دارد: تزئینی، بی‌تعامل، بی‌حرکت (آیتم ۸).
 *
 * چه چیزی را نمی‌سنجد: «سرگرم‌کننده بودن» را نمی‌سنجد — آن را فقط
 * کودکِ واقعی می‌گوید (§۷.۱۶). سازگاریِ فنی را می‌سنجد.
 */

import { readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { GAMES } from '../src/data/games.js';
import { LESSONS } from '../src/data/lessons/index.js';
import { AGE_TRACKS } from '../src/data/curriculum.js';
import { buildRound } from '../src/core/rounds.js';

const BASE = process.env.BASE_URL || 'http://localhost:8080';

const errors = [];
const notes = [];
const check = (cond, msg) => {
  if (!cond) errors.push(msg);
};

// ── ۱. شناسه/نشان/رنگِ یکتا + مستندسازی در README ────────────────────
{
  const ids = GAMES.map((g) => g.id);
  const icons = GAMES.map((g) => g.icon);
  const colors = GAMES.map((g) => g.color);
  check(new Set(ids).size === ids.length, `شناسهٔ بازی تکراری است: ${ids}`);
  check(new Set(icons).size === icons.length, `نشانِ بازی تکراری است: ${icons} — دو کارت فقط با برچسب فرق می‌کنند`);
  check(new Set(colors).size === colors.length, `رنگِ بازی تکراری است: ${colors}`);
  check(GAMES.length >= 7, `بازی‌ها باید دست‌کم ۷ تا باشند (گسترش)، ${GAMES.length} است`);
  const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
  for (const g of GAMES) {
    check(readme.includes(g.title), `بازیِ «${g.title}» در جدولِ README نیست`);
  }
  notes.push(`فهرست: ${GAMES.length} بازی با شناسه/نشان/رنگِ یکتا`);
}

// ── ۲. موتور: هر بازی واقعاً گِرد می‌سازد، و زمان‌دار فقط تک‌ضربه‌ای ──
{
  for (const g of GAMES) {
    // همان منطقِ استخرِ gameScreen: از درس‌های واقعی، یکتا بر پایهٔ JSON.
    const seen = new Set();
    const pool = [];
    for (const lesson of LESSONS) {
      for (const rd of lesson.rounds) {
        if (!g.kinds.includes(rd.kind)) continue;
        const key = JSON.stringify(rd);
        if (seen.has(key)) continue;
        seen.add(key);
        pool.push(rd);
      }
    }
    check(pool.length > 0, `بازیِ «${g.title}» هیچ گِردی در درس‌ها ندارد — استخر خالی است`);
    notes.push(`  «${g.title}»: ${pool.length} گِردِ یکتا`);

    if (pool.length === 0) continue;

    for (const track of [AGE_TRACKS.early, AGE_TRACKS.school]) {
      let built = 0;
      let badType = 0;
      for (const rd of pool.slice(0, 40)) {
        try {
          const b = buildRound(rd, track);
          if (!b) continue;
          built++;
          // زمان‌دار و جان‌دار فقط گِردِ تک‌ضربه‌ای (choice).
          if (g.mode !== 'levels' && b.type !== 'choice') badType++;
        } catch {
          /* این گِردِ خاص ساخته نشد — شاید برای این رده مناسب نیست */
        }
      }
      check(built > 0, `بازیِ «${g.title}» در ردهٔ «${track.label}» حتی یک گِرد نساخت`);
      check(
        badType === 0,
        `بازیِ «${g.title}» ${badType} گِردِ غیرِتک‌ضربه‌ای در فهرستِ خود دارد — وسطِ مسابقهٔ زمان‌دار خراب می‌شود`,
      );
    }
  }
}

// ── ۳. مرورگر: کارت‌های صحنه‌دار و باز شدنِ بازی‌ها ────────────────────
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
await page.locator('.btn.ghost', { hasText: 'بازی‌ها' }).click();
await page.waitForSelector('.game-card');

{
  const dom = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.game-card')];
    return {
      n: cards.length,
      allScenes: cards.every((c) => {
        const s = c.querySelector('.game-scene');
        return s && s.getAttribute('aria-hidden') === 'true' && s.querySelector('svg');
      }),
      infinite: [...document.querySelectorAll('.game-list *')].filter((e) => {
        const c = getComputedStyle(e);
        return c.animationName !== 'none' && c.animationIterationCount === 'infinite';
      }).length,
    };
  });
  check(dom.n === GAMES.length, `فهرستِ بازی ${dom.n} کارت نشان می‌دهد، ولی ${GAMES.length} بازی تعریف شده`);
  check(dom.allScenes, 'کارتِ بازی‌ای صحنه‌ی تزئینی ندارد (aria-hidden + svg) — آیتم ۸');
  check(dom.infinite === 0, `${dom.infinite} انیمیشن بی‌پایان در فهرستِ بازی‌ها`);
  notes.push(`مرورگر: ${dom.n} کارت، همه صحنه‌دار و بی‌حرکت`);
}

// هر بازیِ تازه باید در مرورگر واقعی باز شود و گِرد رندر کند.
for (const id of ['count', 'nature', 'pattern']) {
  const g = GAMES.find((x) => x.id === id);
  if (!g) continue;
  await page.locator('.game-card', { hasText: g.title }).click();
  const opened = await page.waitForSelector('.prompt', { timeout: 6000 }).then(() => true).catch(() => false);
  check(opened, `بازیِ «${g.title}» در مرورگر باز نشد یا گِرد رندر نکرد`);
  await page.locator('.icon-btn[aria-label="بازگشت"]').click().catch(() => {});
  await page.waitForSelector('.game-card', { timeout: 4000 }).catch(() => {});
}

await browser.close();

console.log('── نگهبانِ گسترشِ بازی‌ها و کارت‌های صحنه‌دار (§۷.۴ و §۷.۱۶/۸) ──');
notes.forEach((n) => console.log('  ' + n));
if (errors.length) {
  console.log(`\nمشکل (${errors.length}):`);
  [...new Set(errors)].forEach((e) => console.log('  ✗ ' + e));
  process.exit(1);
}
console.log('\n✓ هر بازی گِردِ واقعی می‌سازد، زمان‌دارها تک‌ضربه‌ای‌اند و کارت‌ها صحنه‌دارند.');
