#!/usr/bin/env node
/**
 * نگهبانِ صحنه‌ها — تپهٔ ایستا + «آرامِ زنده» (§۷.۱۶ آیتم ۵ + §۷.۱۷).
 *
 * ═══════════════════════════════════════════════════════════════════
 * تاریخچهٔ این نگهبان — چرا نسخهٔ ۲ لازم شد
 * ═══════════════════════════════════════════════════════════════════
 *
 * نسخهٔ ۱ (آیتم ۵، ۱۴۰۵/۰۶/۰۴): «هر انیمیشنی در پس‌زمینه ممنوع» —
 * قفلِ مکانیکیِ فاز ۴.۵ («پس‌زمینهٔ زنده = بارِ شناختیِ بی‌دلیل»).
 *
 * همان روز، مالک گفت قوانین جلوی زیباسازیِ عمیق را گرفته‌اند. کاوش
 * نشان داد قاعدهٔ «زنده ممنوع» برای صفحهٔ پرسش نوشته شده بود و بر
 * صفحه‌های بی‌تکلیف (خانه، جشن) هم اعمال می‌شد — جایی که هیچ تکلیفی
 * نیست که حرکتِ آرام توجهش را بدزدد (§۷.۱۷).
 *
 * نسخهٔ ۲ (§۷.۱۷): قانونِ واقعی دقیق‌تر شد، نه سست‌تر:
 *   • تپه و خورشید (::before) **همیشه ایستا** می‌مانند.
 *   • خانه و جشن می‌توانند عنصرِ محیطیِ «آرام» داشته باشند (::after،
 *     تنفسِ هوشی) — با قراردادهایِ سختِ زیر.
 *   • صفحهٔ پرسش هرگز هیچ‌کدام را ندارد.
 *
 * قراردادهایی که این نگهبان قفل می‌کند:
 *   ۱. صحنهٔ ایستا در خانه و پایان درس هست (::before، پشتِ محتوا،
 *      بی‌تعامل) و **هیچ انیمیشنی ندارد**.
 *   ۲. خانه و جشنِ پایان هرکدام دست‌کم یک عنصرِ محیطیِ آرام دارند.
 *   ۳. دورهٔ هر حلقهٔ محیطی ≥ ۵ ثانیه و بی‌پایان — «آرام» یعنی کندتر
 *      از آنکه «حرکت» خوانده شود (§۷.۱۷ ب).
 *   ۴. keyframeهایِ `ambient-*` فقط transform/opacity را انیمیت
 *      می‌کنند — بازرسیِ مستقیمِ متنِ CSS، چون CSSOM پروپرتی‌هایِ
 *      داخلِ keyframe را به‌راحتی نمی‌دهد (§۷.۱۷ د).
 *   ۵. زیرِ prefers-reduced-motion همهٔ حلقه‌هایِ محیطی کاملاً خاموش‌اند
 *      — حتی آرام (§۷.۱۷ هـ).
 *   ۶. صفحهٔ پرسش: نه لایهٔ صحنه دارد، نه هیچ انیمیشنِ بی‌پایانی —
 *      همان قلبِ پداگوژیکِ فاز ۴.۵ که دست‌نخورده ماند (تأکیدِ
 *      دوباره در کنارِ test:delight، چون این صفحه‌ست که قانون برایش
 *      نوشته شد).
 *   ۷. هیچ سرریزی نمی‌سازند.
 *
 * چه چیزی را نمی‌سنجد: زیباییِ صحنه را — عکس باید دیده شود (قانون ۱۱).
 */

import { readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL || 'http://localhost:8080';
const CSS_PATH = new URL('../src/styles/main.css', import.meta.url);
// آستانهٔ «آرام» از §۷.۱۷ ب: کندتر از آنکه حرکت خوانده شود.
const MIN_AMBIENT_S = 5;

const errors = [];
const notes = [];
const check = (cond, msg) => {
  if (!cond) errors.push(msg);
};

/** وضعیتِ یک لایهٔ شبه‌عنصر: انیمیشن + دوره + تکرار. */
const layer = (page, sel, pseudo = '::before') =>
  page.evaluate(([s, p]) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const cs = getComputedStyle(el, p);
    const dur = cs.animationName !== 'none' ? cs.animationDuration : null;
    return {
      has: cs.content !== 'none',
      bg: cs.backgroundImage !== 'none' && cs.backgroundImage !== undefined,
      h: parseFloat(cs.height) || 0,
      anim: cs.animationName,
      dur: dur ? (parseFloat(dur) || 0) * (dur.endsWith('ms') ? 0.001 : 1) : null,
      iter: cs.animationIterationCount,
      z: cs.zIndex,
      pe: cs.pointerEvents,
    };
  }, [sel, pseudo]);

/** قراردادِ مشترکِ لایهٔ صحنه: هست، پشتِ محتوا، بی‌تعامل. */
const checkSceneLayer = (l, where) => {
  check(l && l.has && l.bg, `${where} پس‌زمینهٔ صحنه‌ای ندارد`);
  check(l && l.h > 0, `پس‌زمینهٔ ${where} ارتفاع صفر دارد — دیده نمی‌شود`);
  check(l && l.z === '-1', `پس‌زمینهٔ ${where} باید پشتِ محتوا باشد (z-index منفی)`);
  check(l && l.pe === 'none', `پس‌زمینهٔ ${where} نباید تعاملی باشد`);
};

/** قراردادِ عنصرِ محیطیِ آرام: بی‌پایان و ≥ آستانهٔ آرامی. */
const checkAmbient = (l, where) => {
  check(l && l.has, `${where} عنصرِ محیطیِ آرام ندارد (§۷.۱۷ — پس از بازنگری، این صفحه باید نفس بکشد)`);
  if (!l || !l.has) return;
  check(l.anim !== 'none', `${where} عنصرِ محیطی دارد ولی انیمیشن ندارد — لایهٔ مرده`);
  check(l.iter === 'infinite', `${where} حلقهٔ محیطی بی‌پایان نیست`);
  check(
    l.dur === null || l.dur >= MIN_AMBIENT_S,
    `${where} حلقهٔ محیطی دورهٔ ${l.dur}s دارد — آرام یعنی ≥ ${MIN_AMBIENT_S}s (§۷.۱۷ ب)`,
  );
};

const browser = await chromium.launch();

// ── ۴. keyframeهای محیطی فقط transform/opacity (بازرسیِ متن) ────────
{
  const css = readFileSync(CSS_PATH, 'utf8');
  const frames = [...css.matchAll(/@keyframes\s+(ambient-[\w-]+)\s*\{([\s\S]*?)\n\}/g)];
  check(frames.length >= 3, `فقط ${frames.length} keyframe محیطی پیدا شد — انتظار: ≥۳ (ابر، ستاره، تنفس)`);
  for (const [, name, body] of frames) {
    const props = [...body.matchAll(/^\s*([a-z-]+)\s*:/gm)].map((m) => m[1]);
    const bad = props.filter((p) => p !== 'transform' && p !== 'opacity');
    check(
      bad.length === 0,
      `keyframeِ «${name}» غیر از transform/opacity چیزی انیمیت می‌کند: ${bad.join('، ')} — قانونِ ۶۰fps گوشیِ ارزان (§۷.۱۷ د)`,
    );
  }
  notes.push(`keyframeهای محیطی: ${frames.map((f) => f[1]).join('، ')}`);
}

// ── ۱و۲و۳. خانه ─────────────────────────────────────────────────────
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
{
  const hills = await layer(page, '.screen.home', '::before');
  checkSceneLayer(hills, 'خانه');
  check(hills && hills.anim === 'none', 'تپه‌های خانه انیمیشن دارند — صحنهٔ ::before باید ایستا بماند (§۷.۱۷)');
  const cloud = await layer(page, '.screen.home', '::after');
  checkAmbient(cloud, 'ابرِ خانه');
  checkSceneLayer(cloud, 'ابرِ خانه');

  // تنفسِ هوشی: فقط در خانه، نه سرِ درس.
  const buddy = await page.evaluate(() => {
    const b = document.querySelector('.screen.home .buddy');
    if (!b) return null;
    const cs = getComputedStyle(b);
    return {
      anim: cs.animationName,
      dur: parseFloat(cs.animationDuration) || 0,
      iter: cs.animationIterationCount,
    };
  });
  check(buddy, 'هوشی در صفحهٔ خانه نیست');
  check(buddy && buddy.anim !== 'none', 'هوشیِ خانه نفس نمی‌کشد — «زنده است» معنایش رفت (§۷.۱۷)');
  check(buddy && buddy.iter === 'infinite', 'تنفسِ هوشی بی‌پایان نیست');
  check(buddy && buddy.dur >= MIN_AMBIENT_S, `تنفسِ هوشی دورهٔ ${buddy?.dur}s دارد — آرام یعنی ≥ ${MIN_AMBIENT_S}s`);
  notes.push('خانه: تپهٔ ایستا + ابرِ روان + تنفسِ هوشی');
}

// ── ۵. زیرِ prefers-reduced-motion همه خاموش ─────────────────────────
{
  const rm = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await rm.goto(BASE, { waitUntil: 'networkidle' });
  await rm.evaluate(() => localStorage.clear());
  await rm.reload({ waitUntil: 'networkidle' });
  const cloud = await layer(rm, '.screen.home', '::after');
  const buddy = await rm.evaluate(() => {
    const b = document.querySelector('.screen.home .buddy');
    return b ? getComputedStyle(b).animationName : null;
  });
  check(cloud && cloud.anim === 'none', 'زیرِ reduced-motion ابرِ خانه هنوز می‌رود — باید کاملاً خاموش باشد');
  check(buddy === 'none', 'زیرِ reduced-motion هوشی هنوز نفس می‌کشد — باید کاملاً خاموش باشد');
  notes.push('reduced-motion: خاموشیِ کامل');
  await rm.close();
}

// ── ۶. صفحهٔ پرسش: نه صحنه، نه انیمیشنِ بی‌پایان ─────────────────────
{
  await page.locator('.play-btn').click();
  await page.waitForSelector('.prompt');
  await page.waitForTimeout(900);
  const q = await page.evaluate(() => {
    const scr = document.querySelector('.screen:not(.home):not(.done)');
    if (!scr) return null;
    const pe = getComputedStyle(scr, '::before');
    const pa = getComputedStyle(scr, '::after');
    const moving = [...scr.querySelectorAll('*')].filter((e) => {
      const cs = getComputedStyle(e);
      return cs.animationName !== 'none' && cs.animationIterationCount === 'infinite';
    }).length;
    return {
      layerBefore: pe.content,
      layerAfter: pa.content,
      moving,
      selfAnim: getComputedStyle(scr).animationIterationCount === 'infinite',
    };
  });
  check(q, 'صفحهٔ پرسش پیدا نشد');
  check(q && q.layerBefore === 'none' && q.layerAfter === 'none', 'صفحهٔ پرسش لایهٔ صحنه دارد — قانونِ §۷.۱۷ الف');
  check(q && q.moving === 0 && !q.selfAnim, `صفحهٔ پرسش ${q?.moving ?? '?'} عنصرِ بی‌پایانِ متحرک دارد — قلبِ فاز ۴.۵`);
  notes.push('صفحهٔ پرسش: بی‌صحنه و بی‌حرکت');
}

// ── ۲و۳. صفحهٔ پایان درس ─────────────────────────────────────────────
await page.goBack().catch(() => {});
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'networkidle' });
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
{
  const hills = await layer(page, '.screen.done', '::before');
  checkSceneLayer(hills, 'پایان درس');
  check(hills && hills.anim === 'none', 'تپه‌های پایانِ درس انیمیشن دارند — ::before ایستا می‌ماند');
  const stars = await layer(page, '.screen.done', '::after');
  checkAmbient(stars, 'ستارهٔ جشن');
  checkSceneLayer(stars, 'ستارهٔ جشن');
  notes.push('پایان درس: تپهٔ ایستا + ستارهٔ چشمک‌زنِ آرام');
}

// ── ۷. بی‌سرریز ──────────────────────────────────────────────────────
{
  const ox = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  check(!ox, 'لایه‌های صحنه/محیط سرریزِ افقی ساخته‌اند');
}

await browser.close();

console.log('── نگهبانِ صحنه‌ها: ایستا + آرامِ زنده (§۷.۱۶ آیتم ۵ + §۷.۱۷) ──');
notes.forEach((n) => console.log('  ' + n));
if (errors.length) {
  console.log(`\nمشکل (${errors.length}):`);
  [...new Set(errors)].forEach((e) => console.log('  ✗ ' + e));
  process.exit(1);
}
console.log('\n✓ تپه‌ها ایستا، خانه و جشن آرام نفس می‌کشند، صفحهٔ پرسش بی‌حرکت، و همه زیرِ reduced-motion خاموش.');
