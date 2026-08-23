// آزمون «این مقاله نیست، بازی است».
//
// بازخورد کاربر: «اینکه کودک بیاد روی اپلیکیشن مقاله‌ای با تب‌های زیاد
// کار کنه اصلا قابل قبول نیست.»
//
// «کودکانه بودن» حس نیست که با نگاه تأیید شود — اینجا به عدد تبدیل شده
// تا هر تغییری که برنامه را دوباره به سند شبیه کند، ساخت را بشکند.
// معیارها در ROADMAP.md §۲.۲ ثبت شده‌اند.

import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL || 'http://localhost:8080';

const LIMITS = {
  maxTextPerScreen: 200, // نویسهٔ متن پیوسته در صفحه‌های کودک
  maxParagraphs: 1, // دو پاراگراف پشت‌سرهم یعنی مقاله
  minVisualsInRound: 1, // هر گِرد دست‌کم یک عنصر دیداری
  maxTapsToPlay: 1, // قانون ۹
  maxFeedbackMs: 100, // قانون ۱۴
};

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

/** متن قابل خواندن صفحه، بدون احتساب دکمه‌ها و برچسب‌ها. */
async function screenText() {
  return page.evaluate(() => {
    const skip = new Set(['BUTTON', 'SELECT', 'OPTION', 'LABEL', 'SVG', 'CANVAS']);
    let total = 0;
    const walk = (n) => {
      for (const c of n.childNodes) {
        if (c.nodeType === 3) total += (c.textContent || '').trim().length;
        else if (c.nodeType === 1 && !skip.has(c.tagName) && !c.closest('.note')) walk(c);
      }
    };
    const s = document.querySelector('.screen');
    if (s) walk(s);
    return total;
  });
}

// ── ۱. تب و نوار پیمایش وجود ندارد ──────────────────────────────────────
const tabs = await page.evaluate(() => {
  const sel = ['[role="tab"]', '[role="tablist"]', '.tab', '.tabs', 'nav'];
  return sel.reduce((n, s) => n + document.querySelectorAll(s).length, 0);
});
check(tabs === 0, `برنامه نباید تب یا نوار پیمایش داشته باشد، ${tabs} پیدا شد`);
notes.push(`تب و نوار پیمایش: ${tabs}`);

// ── ۲. یک تپ تا بازی ────────────────────────────────────────────────────
await page.waitForSelector('.play-btn');
const homeText = await screenText();
check(
  homeText < LIMITS.maxTextPerScreen,
  `خانه ${homeText} نویسه متن دارد؛ بیش از ${LIMITS.maxTextPerScreen} یعنی صفحهٔ خواندنی`,
);
notes.push(`متن صفحهٔ خانه: ${homeText} نویسه`);

await page.locator('.play-btn').click();
await page.waitForSelector('.prompt');
notes.push(`تپ تا شروع بازی: ${LIMITS.maxTapsToPlay}`);

// ── ۳. سرعت بازخورد: کودک باید فوراً اثر لمس را ببیند ───────────────────
{
  await page.waitForSelector('.opt:not([disabled])');
  const t = await page.evaluate(async () => {
    const el = document.querySelector('.opt:not([disabled])');
    const before = el.className + '|' + getComputedStyle(el).backgroundColor;
    const t0 = performance.now();
    el.click();
    // منتظر نخستین تغییر دیداری می‌مانیم
    for (let i = 0; i < 40; i++) {
      await new Promise((r) => requestAnimationFrame(r));
      const now = el.className + '|' + getComputedStyle(el).backgroundColor;
      if (now !== before) return performance.now() - t0;
    }
    return -1;
  });
  check(t >= 0, 'لمس گزینه هیچ بازخورد دیداری نداشت');
  check(
    t >= 0 && t <= LIMITS.maxFeedbackMs,
    `بازخورد لمس ${Math.round(t)}ms طول کشید؛ باید زیر ${LIMITS.maxFeedbackMs}ms باشد`,
  );
  notes.push(`سرعت بازخورد لمس: ${Math.round(t)}ms`);
  await page.waitForTimeout(2200);
}

// ── ۴. هر گِرد: تصویر دارد، متنش کوتاه است، پاراگراف‌بازی ندارد ─────────
let roundsSeen = 0;
let roundsWithVisual = 0;
let worstText = 0;

for (let i = 0; i < 18; i++) {
  if (await page.locator('.done-card').count()) break;
  if (!(await page.locator('.prompt').count())) break;

  roundsSeen++;

  const m = await page.evaluate(() => {
    const s = document.querySelector('.screen');
    return {
      visuals: s.querySelectorAll('svg, canvas, img, .ico, .swatch').length,
      paragraphs: [...s.querySelectorAll('p')].filter((p) => (p.textContent || '').trim().length > 80).length,
      promptLen: (document.querySelector('.prompt')?.textContent || '').trim().length,
    };
  });
  const txt = await screenText();
  worstText = Math.max(worstText, txt);
  if (m.visuals >= LIMITS.minVisualsInRound) roundsWithVisual++;

  check(txt < LIMITS.maxTextPerScreen, `گِرد ${roundsSeen}: ${txt} نویسه متن — زیادی خواندنی است`);
  check(
    m.paragraphs <= LIMITS.maxParagraphs,
    `گِرد ${roundsSeen}: ${m.paragraphs} پاراگراف بلند — شبیه مقاله شده`,
  );
  check(m.promptLen <= 80, `گِرد ${roundsSeen}: پرسش ${m.promptLen} نویسه است؛ برای کودک ۵ ساله بلند است`);

  // جلو رفتن
  const opt = page.locator('.opt:not([disabled])').first();
  const order = page.locator('.order-item:not(.picked)').first();
  const canvas = page.locator('canvas').first();
  if (await opt.count()) {
    await opt.click({ timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(2200);
  } else if (await order.count()) {
    while (await page.locator('.order-item:not(.picked)').count()) {
      await page.locator('.order-item:not(.picked)').first().click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(150);
    }
    await page.waitForTimeout(2000);
  } else if (await canvas.count()) {
    const b = await canvas.boundingBox();
    if (b) {
      await page.mouse.move(b.x + 30, b.y + 30);
      await page.mouse.down();
      for (let k = 0; k < 14; k++) await page.mouse.move(b.x + 30 + k * 7, b.y + 35 + k * 4);
      await page.mouse.up();
    }
    const d = page.locator('.btn', { hasText: 'تمام شد' }).first();
    if (await d.count()) await d.click();
    await page.waitForTimeout(900);
  } else break;
}

check(roundsSeen >= 3, `باید دست‌کم ۳ گِرد بررسی می‌شد، ${roundsSeen} شد`);
const visualRatio = roundsSeen ? roundsWithVisual / roundsSeen : 0;
check(
  visualRatio >= 0.5,
  `فقط ${Math.round(visualRatio * 100)}٪ گِردها عنصر دیداری داشتند؛ صفحهٔ فقط‌متن برای کودک کسل‌کننده است`,
);
notes.push(`گِردهای بررسی‌شده: ${roundsSeen}، دارای تصویر: ${roundsWithVisual}`);
notes.push(`بیشترین متن یک صفحه: ${worstText} نویسه (حد: ${LIMITS.maxTextPerScreen})`);

// ── ۵. جشن پایان درس: باید دیداری باشد، نه یک جملهٔ خشک ─────────────────
if (await page.locator('.done-card').count()) {
  const celebration = await page.evaluate(() => {
    const c = document.querySelector('.done-card');
    const anim = [...document.querySelectorAll('.screen *')].filter((e) => {
      const a = getComputedStyle(e).animationName;
      return a && a !== 'none';
    }).length;
    return { hasBig: !!c.querySelector('.big'), animated: anim };
  });
  check(celebration.hasBig, 'صفحهٔ پایان درس نشان بزرگ جشن ندارد');
  check(celebration.animated > 0, 'صفحهٔ پایان درس هیچ حرکتی ندارد — جشن باید دیده شود');
  notes.push(`جشن پایان: ${celebration.animated} عنصر متحرک`);
}

await browser.close();

console.log('── آزمون «بازی است، نه مقاله» ──');
notes.forEach((n) => console.log('  ' + n));
if (errors.length) {
  console.log(`\nمشکل (${errors.length}):`);
  [...new Set(errors)].forEach((e) => console.log('  ✗ ' + e));
  process.exit(1);
}
console.log('\n✓ برنامه مثل بازی رفتار می‌کند، نه مثل سند.');
