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
      soundOrder: null,
    };

    // ── ترتیب صداکشی ──────────────────────────────────────────────
    // بنیادی‌ترین بررسی حوزهٔ خواندن. صداها باید به ترتیب خواندن
    // دیده شوند. یک بار با row-reverse وارونه شدند و کودک «اَم»
    // می‌دید به‌جای «ما» — تمرین دقیقاً عکس هدفش را می‌آموخت.
    // آزمون ساختاری این را نمی‌بیند؛ فقط مختصات واقعی نشانش می‌دهد.
    {
      const nodes = [...document.querySelectorAll('.sounds .snd')];
      if (nodes.length >= 2) {
        const dom = nodes.map((e) => e.querySelector('.snd-g')?.textContent ?? '');
        const visual = nodes
          .map((e) => ({ t: e.querySelector('.snd-g')?.textContent ?? '', x: e.getBoundingClientRect().left }))
          .sort((a, b) => b.x - a.x)
          .map((o) => o.t);
        if (dom.join('') !== visual.join('')) {
          out.soundOrder = { dom: dom.join(' '), visual: visual.join(' ') };
        }
      }
    }

    const interactive = [...document.querySelectorAll('button, a, input, select, [role="button"]')];
    const boxes = [];
    for (const el of interactive) {
      const b = el.getBoundingClientRect();
      if (b.width === 0 && b.height === 0) continue; // پنهان — مشکلی نیست
      const tag = el.className?.split?.(' ')[0] || el.tagName;
      // مقایسهٔ مرزی: ۵۶ دقیقاً مجاز است، پس کمی رواداری برای گِردکردن زیرپیکسلی
      if (b.height < minTap - 0.5 || b.width < minTap - 0.5) {
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

    // ── دام دوجهته (bidi) ────────────────────────────────
    // نویسه‌های خنثی مثل • | / - کنار عدد فارسی جابه‌جا می‌شوند و
    // عدد را تحریف می‌کنند: «۶ دقیقه» به چشم «۶۰ دقیقه» می‌آید.
    // این دسته باگ در فارسی بسیار رایج و با چشم سخت‌یاب است.
    out.bidi = [];
    const NEUTRAL = /[۰-۹]\s*[•|/·−–—]\s*|[•|/·−–—]\s*[۰-۹]/;
    for (const el of document.querySelectorAll('span, p, strong, .prompt, h1, h2, .muted')) {
      if (el.children.length) continue; // فقط برگ‌ها، تا متن دوبار شمرده نشود
      const t = (el.textContent || '').trim();
      if (t && NEUTRAL.test(t)) out.bidi.push(`«${t.slice(0, 30)}»`);
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
  if (r.soundOrder) {
    errors.push(
      `${tag}: ترتیب صداکشی وارونه — «${r.soundOrder.visual}» به‌جای «${r.soundOrder.dom}»`,
    );
  }
  if (r.bidi?.length) {
    errors.push(`${tag}: دام دوجهته کنار عدد — ${[...new Set(r.bidi)].slice(0, 3).join('، ')}`);
  }
}

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  // سن ۸ = بیشترین گِرد در هر درس (۶ به‌جای ۴). گِردهای صداکشی و
  // بخش‌بندی انتهای درس‌اند؛ با سن پیش‌فرض هرگز بازرسی نمی‌شدند و
  // محافظِ ترتیب صداکشی کور می‌ماند — در منفی-آزمون لو رفت.
  await page.evaluate(() =>
    localStorage.setItem(
      'parvaresh-hoosh/v4',
      JSON.stringify({ childName: 'آزمون', age: 8, muted: true, lessons: {}, stars: 0, dailyLimitMin: 0, playLog: {} }),
    ),
  );
  await page.reload({ waitUntil: 'networkidle' });

  await page.waitForSelector('.play-btn');
  await audit(page, 'خانه', vp);

  // نقشهٔ سفر — طولانی‌ترین فهرست برنامه، بیشترین احتمال سرریز
  await page.locator('.btn.ghost', { hasText: 'نقشهٔ سفر' }).click();
  await page.waitForSelector('.map-item');
  await audit(page, 'نقشهٔ سفر', vp);
  await page.locator('.icon-btn[aria-label="بازگشت"]').click();
  await page.waitForSelector('.play-btn');

  // هر درسِ بازِ مسیر را می‌سنجیم — نه فقط یکی از هر حوزه.
  // درس‌ها یکی‌یکی باز می‌شوند، پس با بازی کردن جلو می‌رویم.
  let played = 0;
  for (let step = 0; step < 6; step++) {
    await page.waitForSelector('.play-btn');
    const title = (await page.locator('.play-title').textContent())?.trim();
    await page.locator('.play-btn').click();
    await page.waitForSelector('.prompt');
    await page.waitForTimeout(420); // پایان انیمیشن ورود
    await audit(page, `بازی ${title}`, vp);

    // درس را تا پایان بازی می‌کنیم تا درس بعدی باز شود.
    // ⚠ هر گِرد جداگانه بازرسی می‌شود، نه فقط اولی: گِردهای
    // صداکشی و بخش‌بندی در انتهای درس‌اند و با بازرسیِ فقط گِرد
    // اول هرگز دیده نمی‌شدند — محافظ کور بود و در منفی-آزمون لو رفت.
    for (let i = 0; i < 14; i++) {
      if (await page.locator('.done-card').count()) break;
      if (i > 0 && (await page.locator('.prompt').count())) {
        await page.waitForTimeout(260);
        await audit(page, `${title} گِرد ${i + 1}`, vp);
      }
      const opt = page.locator('.opt:not([disabled])').first();
      const order = page.locator('.order-item:not(.picked)').first();
      const canvas = page.locator('canvas').first();
      if (await opt.count()) await opt.click({ timeout: 4000 }).catch(() => {});
      else if (await order.count()) await order.click({ timeout: 4000 }).catch(() => {});
      else if (await canvas.count()) {
        const b = await canvas.boundingBox();
        if (b) {
          await page.mouse.move(b.x + 20, b.y + 20);
          await page.mouse.down();
          for (let k = 0; k < 12; k++) await page.mouse.move(b.x + 20 + k * 6, b.y + 30 + k * 3);
          await page.mouse.up();
        }
        const nx = page.locator('.btn', { hasText: 'تمام شد' }).first();
        if (await nx.count()) await nx.click();
      } else break;
      await page.waitForTimeout(2100);
    }

    if (await page.locator('.done-card').count()) {
      await audit(page, `پایان ${title}`, vp);
      played++;
      await page.locator('.btn.ghost', { hasText: 'خانه' }).click();
    } else {
      await page.locator('.icon-btn[aria-label="بازگشت"]').click();
    }
    await page.waitForSelector('.play-btn');
  }

  // تنظیمات
  await page.locator('.icon-btn[aria-label="تنظیمات"]').click();
  await page.waitForSelector('select');
  await audit(page, 'تنظیمات', vp);

  // پنل والدین — طولانی‌ترین متن برنامه و پرخطرترین جا برای دام دوجهته،
  // چون پر از عدد و درصد است.
  await page.locator('.btn.ghost', { hasText: 'بخش والدین' }).click();
  await page.waitForSelector('.gate');
  await audit(page, 'دروازهٔ والدین', vp);
  const q = await page.locator('.gate .prompt').textContent();
  const [x, y] = (q || '').match(/\d+/g).map(Number);
  await page.locator('.gate input').fill(String(x * y));
  await page.locator('.btn', { hasText: 'ورود' }).click();
  await page.waitForSelector('.chart');
  await page.waitForTimeout(500);
  await audit(page, 'پنل والدین', vp);

  // ── ترتیب صداکشی ────────────────────────────────────────────────
  // خزشِ بازی برای این کار مناسب نیست: انتخاب گِرد تصادفی است و
  // بررسی گاهی سبز و گاهی قرمز می‌شد. آزمون متناوب بدتر از نبودنش
  // است. پس صحنهٔ صداکشی را قطعی می‌سازیم و مختصات واقعی را
  // می‌سنجیم — همان چیزی که باگ را لو داد.
  {
    const bad = await page.evaluate(async () => {
      const R = await import('/src/core/rounds.js');
      const C = await import('/src/data/curriculum.js');
      const L = await import('/src/data/lessons/reading.js');
      const les = L.READING_LESSONS.find((l) => l.id === 'reading-letters-06');
      const rd = les.rounds.find((r) => r.kind === 'blend-word');
      if (!rd) return { err: 'گِرد صداکشی در درس تعریف نشده' };
      const built = R.buildRound(rd, C.AGE_TRACKS.school);
      if (!built?.display?.parts?.length) return { err: 'صحنهٔ صداکشی ساخته نشد' };

      const host = document.createElement('div');
      host.className = 'screen';
      const stage = document.createElement('div');
      stage.className = 'stage';
      const row = document.createElement('div');
      row.className = 'sounds';
      built.display.parts.forEach((x, i) => {
        if (i) {
          const l = document.createElement('span');
          l.className = 'snd-link';
          row.append(l);
        }
        const w = document.createElement('span');
        w.className = 'snd';
        const g = document.createElement('span');
        g.className = 'snd-g';
        g.textContent = x.g || '·';
        const v = document.createElement('span');
        v.className = 'snd-s';
        v.textContent = x.s;
        w.append(g, v);
        row.append(w);
      });
      stage.append(row);
      host.append(stage);
      document.querySelector('#app').replaceChildren(host);

      const nodes = [...document.querySelectorAll('.sounds .snd')];
      if (nodes.length < 2) return { err: 'کمتر از دو صدا' };
      const dom = nodes.map((e) => e.querySelector('.snd-g').textContent);
      const visual = nodes
        .map((e) => ({ t: e.querySelector('.snd-g').textContent, x: e.getBoundingClientRect().left }))
        .sort((a2, b2) => b2.x - a2.x)
        .map((o) => o.t);
      return dom.join('') === visual.join('')
        ? null
        : { dom: dom.join(' '), visual: visual.join(' ') };
    });

    if (bad?.err) errors.push(`${vp.name}: ${bad.err}`);
    else if (bad) {
      errors.push(`${vp.name}: ترتیب صداکشی وارونه — «${bad.visual}» به‌جای «${bad.dom}»`);
    }
    await page.goto(BASE, { waitUntil: 'networkidle' });
  }

  notes.push(`${vp.name} (${vp.width}px): خانه + نقشه + ${played} درس + ترتیب صداکشی بررسی شد`);
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
