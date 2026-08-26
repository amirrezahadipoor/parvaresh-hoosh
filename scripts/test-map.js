#!/usr/bin/env node
/**
 * نگهبانِ آیتم ۳ از §۷.۱۶ — نقشهٔ سفرِ صحنه‌دار.
 *
 * ═══════════════════════════════════════════════════════════════════
 * چرا این نگهبان لازم شد
 * ═══════════════════════════════════════════════════════════════════
 *
 * فهرستِ ۳۰۷ درس سطری بود و کودک «سفر» را نمی‌دید. حالا یک راهِ
 * پیوسته (یک `path`) پشتِ فهرست است و آغازِ هر حوزه نشانِ رنگیِ
 * خودش را دارد. این نگهبان سه قرارداد را قفل می‌کند:
 *
 *   • یک راه، نه ۳۰۷ گرافِ تازه — هر درس یک گرهٔ تازه در SVG
 *     نمی‌سازد (قانونِ ۶: بدون تکرار).
 *   • شش نشانِ رنگیِ آغازِ حوزه، با همان رنگ‌های حوزه (یک رنگ =
 *     یک معنی).
 *   • صحنه تزئینی است: `aria-hidden`، بی‌تعامل (`pointer-events`)،
 *     و بی‌حرکت.
 *
 * چه چیزی را نمی‌سنجد: زیباییِ مسیر را نمی‌سنجد — چشمانِ آدم باید
 * ببیند (قانون ۱۱). ساختار و رفتار را می‌سنجد.
 */

import { chromium } from 'playwright-core';
import { DOMAINS } from '../src/data/curriculum.js';

const BASE = process.env.BASE_URL || 'http://localhost:8080';

const errors = [];
const notes = [];
const check = (cond, msg) => {
  if (!cond) errors.push(msg);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
await page.locator('.btn.ghost', { hasText: 'نقشهٔ سفر' }).click();
await page.waitForSelector('.map-item');

// ── ۱. یک صحنهٔ پس‌زمینه، با یک راه، نه ۳۰۷ گره ─────────────────────
const s = await page.evaluate(() => {
  const scene = document.querySelector('.map-scene');
  const cs = scene ? getComputedStyle(scene) : null;
  return {
    scenes: document.querySelectorAll('.map-scene').length,
    paths: scene ? scene.querySelectorAll('path').length : 0,
    circles: scene ? scene.querySelectorAll('circle').length : 0,
    ariaHidden: scene ? scene.getAttribute('aria-hidden') : null,
    pointerEvents: cs ? cs.pointerEvents : null,
    items: document.querySelectorAll('.map-item').length,
  };
});
check(s.scenes === 1, `نقشه باید دقیقاً یک صحنهٔ پس‌زمینه داشته باشد، ${s.scenes} دارد`);
check(s.paths === 1, `راهِ سفر باید یک «path» پیوسته باشد، ${s.paths} است — نه ۳۰۷ گرافِ تازه`);
check(s.items === 307, `نقشه باید همهٔ ۳۰۷ درس را نشان دهد، ${s.items} دارد`);
check(s.ariaHidden === 'true', 'صحنهٔ نقشه باید aria-hidden باشد — تزئین است');
check(s.pointerEvents === 'none', 'صحنهٔ نقشه نباید تعاملی باشد (pointer-events باید none باشد)');
notes.push(`صحنه: ۱ path + ${s.circles} نشان، ${s.items} درس`);

// ── ۲. نشانِ رنگیِ آغازِ هر حوزه — با همان رنگِ حوزه ──────────────────
{
  const colors = await page.evaluate(() => {
    const scene = document.querySelector('.map-scene');
    return scene ? [...scene.querySelectorAll('circle')].map((c) => (c.getAttribute('fill') || '').toLowerCase()) : [];
  });
  const domainColors = DOMAINS.map((d) => d.color.toLowerCase());
  // هر رنگِ حوزه باید دست‌کم یک نشان داشته باشد (آغازِ همان حوزه).
  for (const dc of domainColors) {
    check(colors.includes(dc), `هیچ نشانِ رنگی با رنگِ حوزهٔ «${dc}» روی راه نیست`);
  }
  notes.push(`نشان‌های حوزه: ${colors.length} با رنگ‌های ${domainColors.join('، ')}`);
}

// ── ۳. بی‌حرکتی و بدون سرریز ─────────────────────────────────────────
{
  const m = await page.evaluate(() => {
    const infinite = [...document.querySelectorAll('.screen *')].filter((e) => {
      const c = getComputedStyle(e);
      return c.animationName !== 'none' && c.animationIterationCount === 'infinite';
    }).length;
    return {
      infinite,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });
  check(m.infinite === 0, `نقشه ${m.infinite} انیمیشن بی‌پایان دارد — صحنه باید ایستا باشد`);
  check(!m.overflowX, 'نقشهٔ صحنه‌دار سرریزِ افقی ایجاد کرده است');
}

await browser.close();

console.log('── نگهبانِ نقشهٔ سفرِ صحنه‌دار (§۷.۱۶ آیتم ۳) ──');
notes.forEach((n) => console.log('  ' + n));
if (errors.length) {
  console.log(`\nمشکل (${errors.length}):`);
  [...new Set(errors)].forEach((e) => console.log('  ✗ ' + e));
  process.exit(1);
}
console.log('\n✓ یک راهِ پیوسته با نشانِ رنگیِ هر حوزه، تزئینی و بی‌حرکت.');
