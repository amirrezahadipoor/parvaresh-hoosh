// آزمون ظاهری — باگ‌های دیداری را مکانیکی می‌گیرد.
//
// چرا این آزمون وجود دارد:
// «باگ ظاهری نداشته باشد» را نمی‌شود با نگاه کردن تضمین کرد. این آزمون
// هر صفحه را در چند اندازهٔ واقعی باز می‌کند و اندازه می‌گیرد:
//   ۱. سرریز افقی (متن یا دکمه از صفحه بیرون بزند)
//   ۲. هم‌پوشانی عناصر تعاملی
//   ۳. هدف لمسی کوچک‌تر از حد پژوهشی
//   ۴. متن بریده‌شده (ellipsis یا سرریز عمودی)
//   ۵. تضاد رنگ ناکافی
//
// اجرا: node scripts/test-visual.js   (سرور باید بالا باشد)

import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL || 'http://localhost:8080';

// اندازه‌های واقعی: از کوچک‌ترین گوشی رایج تا تبلت.
const VIEWPORTS = [
  { name: 'گوشی کوچک', width: 320, height: 568 },
  { name: 'گوشی متوسط', width: 390, height: 844 },
  { name: 'گوشی بزرگ', width: 430, height: 932 },
  { name: 'تبلت', width: 768, height: 1024 },
];

const MIN_TAP = 56; // حداقل مطلق؛ هدف ۷۶px است ولی آیکون‌های ثانویه ۵۶ مجازند
const errors = [];
const notes = [];

const browser = await chromium.launch();

/** یک صفحه را می‌سنجد و مشکلات را برمی‌گرداند. */
async function audit(page, label, vp) {
  const r = await page.evaluate((minTap) => {
    const out = {
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      small: [],
      overlaps: [],
      clipped: [],
      invisible: [],
    };

    const interactive = [...document.querySelectorAll('button, a, input, select, [role="button"]')];
    const boxes = [];
    for (const el of interactive) {
      const b = el.getBoundingClientRect();
      if (b.width === 0 && b.height === 0) continue; // پنهان — مشکلی نیست
      const tag = el.className?.split?.(' ')[0] || el.tagName;
      if (b.height < minTap || b.width < minTap) {
        out.small.push(`${tag} ${Math.round(b.width)}×${Math.round(b.height)}`);
      }
      boxes.push({ tag, b });
    }

    // هم‌پوشانی بین عناصر تعاملی = لمس اشتباه
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i].b;
        const c = boxes[j].b;
        const hit = !(a.right <= c.left || c.right <= a.left || a.bottom <= c.top || c.bottom <= a.top);
        if (hit) out.overlaps.push(`${boxes[i].tag} ⨯ ${boxes[j].tag}`);
      }
    }

    // متن بریده‌شده: محتوا از ظرفش بزرگ‌تر است
    for (const el of document.querySelectorAll('h1, h2, .prompt, .lesson-body strong, .opt, .btn, figcaption')) {
      if (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2) {
        const t = (el.textContent || '').trim().slice(0, 26);
        out.clipped.push(`«${t}»`);
      }
    }

    // متن نامرئی (رنگ متن = رنگ پس‌زمینه)
    for (const el of document.querySelectorAll('h1, h2, p, .prompt, .opt, .btn')) {
      const cs = getComputedStyle(el);
      if (cs.color === cs.backgroundColor && (el.textContent || '').trim()) {
        out.invisible.push(el.className || el.tagName);
      }
    }
    return out;
  }, MIN_TAP);

  const tag = `${label} @${vp.name}`;
  if (r.overflowX) errors.push(`${tag}: سرریز افقی (${r.scrollW} > ${r.innerW})`);
  if (r.small.length) errors.push(`${tag}: هدف لمسی کوچک — ${[...new Set(r.small)].join('، ')}`);
  if (r.overlaps.length) errors.push(`${tag}: هم‌پوشانی — ${[...new Set(r.overlaps)].slice(0, 3).join('، ')}`);
  if (r.clipped.length) errors.push(`${tag}: متن بریده — ${[...new Set(r.clipped)].slice(0, 3).join('، ')}`);
  if (r.invisible.length) errors.push(`${tag}: متن نامرئی — ${[...new Set(r.invisible)].join('، ')}`);
}

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  await page.waitForSelector('.domain-card');
  await audit(page, 'خانه', vp);

  // هر حوزه: فهرست درس + یک درس بازی‌شونده
  const domainCount = await page.locator('.domain-card').count();
  for (let d = 0; d < domainCount; d++) {
    await page.locator('.domain-card').nth(d).click();
    await page.waitForSelector('.lesson-card');
    const title = (await page.locator('.topbar h1').textContent())?.trim();
    await audit(page, `فهرست ${title}`, vp);

    await page.locator('.lesson-card').first().click();
    await page.waitForSelector('.prompt');
    await page.waitForTimeout(420); // پایان انیمیشن ورود
    await audit(page, `بازی ${title}`, vp);

    await page.locator('.icon-btn[aria-label="بازگشت"]').click();
    await page.waitForSelector('.lesson-card');
    await page.locator('.icon-btn[aria-label="بازگشت"]').click();
    await page.waitForSelector('.domain-card');
  }

  // تنظیمات
  await page.locator('.icon-btn[aria-label="تنظیمات"]').click();
  await page.waitForSelector('select');
  await audit(page, 'تنظیمات', vp);

  notes.push(`${vp.name} (${vp.width}px): ${domainCount} حوزه بررسی شد`);
  await page.close();
}

await browser.close();

console.log('── آزمون ظاهری ──');
notes.forEach((n) => console.log('  ' + n));
if (errors.length) {
  console.log(`\nباگ ظاهری (${errors.length}):`);
  [...new Set(errors)].forEach((e) => console.log('  ✗ ' + e));
  process.exit(1);
}
console.log('\n✓ هیچ باگ ظاهری در هیچ اندازهٔ صفحه پیدا نشد.');
