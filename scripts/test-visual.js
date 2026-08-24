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

  // ⚠ استثنای زمان اجرا هیچ‌وقت گرفته نمی‌شد. یک بار یک ویرایش
  // اشتباه `r.display.parts.length` را در بلوک repeat گذاشت و همهٔ
  // درس‌های ریاضی/منطق/علوم با «Cannot read properties of undefined»
  // از کار افتادند — ولی هر پنج آزمون سبز بودند، چون هیچ‌کدام به
  // خطای صفحه گوش نمی‌داد. برنامه برای کاربر واقعی می‌شکست.
  page.on('pageerror', (e) => {
    errors.push(`${vp.name}: استثنای زمان اجرا — ${e.message}`);
  });
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`${vp.name}: خطای کنسول — ${m.text().slice(0, 120)}`);
  });
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

  // ── خانه باید یک‌صفحه‌ای بماند ───────────────────────────────
  // ⚠ در ۳۲۰×۵۶۸ دکمهٔ «نقشهٔ سفر» ۲۷px زیر لبهٔ صفحه می‌افتاد.
  // کودک اسکرول را کشف نمی‌کند؛ چیزی که نمی‌بیند برایش نیست.
  // در سوی دیگر، دکمهٔ بازی روی ارتفاع ثابت می‌ماند و در گوشیِ
  // بلند دو حفرهٔ ~۱۴۰px می‌ساخت. هر دو سرِ طیف بررسی می‌شود.
  {
    const home = await page.evaluate(() => {
      const q = (sel) => {
        const e = document.querySelector(sel);
        return e ? e.getBoundingClientRect() : null;
      };
      const ghost = q('.btn.ghost');
      const play = q('.play-btn');
      const buddy = q('.buddy-row');
      const bar = q('.journey-bar');
      if (!ghost || !play) return null;
      return {
        overflow: Math.round(ghost.bottom - window.innerHeight),
        gapUp: buddy ? Math.round(play.top - buddy.bottom) : 0,
        gapDown: bar ? Math.round(bar.top - play.bottom) : 0,
        tap: Math.round(ghost.height),
      };
    });
    if (!home) {
      errors.push(`${vp.name}/خانه: دکمهٔ بازی یا «نقشهٔ سفر» پیدا نشد`);
    } else {
      if (home.overflow > 0) {
        errors.push(`${vp.name}/خانه: «نقشهٔ سفر» ${home.overflow}px زیر لبهٔ صفحه است`);
      }
      // حفرهٔ بزرگ‌تر از ۱۲۰px یعنی صفحه بی‌مرکز و خالی دیده می‌شود.
      const hole = Math.max(home.gapUp, home.gapDown);
      if (hole > 120) {
        errors.push(`${vp.name}/خانه: فضای مردهٔ ${hole}px دور دکمهٔ بازی`);
      }
      if (home.tap < 56) {
        errors.push(`${vp.name}/خانه: هدف لمسی «نقشهٔ سفر» فقط ${home.tap}px است`);
      }
    }
  }

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
    // اگر درس باز نشود، آزمون باید **گزارش** دهد نه اینکه بمیرد.
    // یک بار استثنای زمان اجرا همهٔ درس‌های ریاضی را از کار انداخت
    // و آزمون با TimeoutError کرش کرد؛ هیچ‌کس نفهمید علت چیست.
    const opened = await page
      .waitForSelector('.prompt', { timeout: 10000 })
      .then(() => true)
      .catch(() => false);
    if (!opened) {
      errors.push(`${vp.name}: درس «${title}» باز نشد`);
      await page.goto(BASE, { waitUntil: 'networkidle' });
      await page.waitForSelector('.play-btn');
      continue;
    }
    await page.waitForTimeout(420); // پایان انیمیشن ورود
    await audit(page, `بازی ${title}`, vp);

    // درس را تا پایان بازی می‌کنیم تا درس بعدی باز شود.
    // ⚠ هر گِرد جداگانه بازرسی می‌شود، نه فقط اولی: گِردهای
    // صداکشی و بخش‌بندی در انتهای درس‌اند و با بازرسیِ فقط گِرد
    // اول هرگز دیده نمی‌شدند — محافظ کور بود و در منفی-آزمون لو رفت.
    for (let i = 0; i < 20; i++) {
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
        // «تمام شد» را نمی‌زنیم: گِرد کشیدن خودش جلو می‌رود و
        // زدن دکمه با پیشرَویِ خودکار تداخل می‌کرد و یک گِرد
        // پریده می‌شد.
      } else break;
      await page.waitForTimeout(2100);
    }

    if (await page.locator('.done-card').count()) {
      await audit(page, `پایان ${title}`, vp);

      // ── جشن پایان باید یک‌جا دیده شود ─────────────────────────
      // ⚠ در ۳۲۰×۵۶۸ کارت جشن + یادداشت والدین + دو دکمه ۲۰۱px
      // بلندتر از صفحه می‌شدند و دکمهٔ «بعدی» — تنها راه ادامهٔ
      // زنجیرهٔ بازی — کامل بیرون می‌افتاد.
      const done = await page.evaluate(() => {
        const next = document.querySelector('.btn.next-btn');
        if (!next) return null;
        const r = next.getBoundingClientRect();
        const note = document.querySelector('.note');
        return {
          below: Math.round(r.bottom - window.innerHeight),
          tap: Math.round(r.height),
          // یادداشتِ تاشو (<details> بسته) بریده نیست — والد با یک
          // تپ بازش می‌کند و کل متن هست. فقط یادداشتِ *باز* که
          // متنش جا نشده باگ است.
          noteClipped:
            note && !(note.tagName === 'DETAILS' && !note.open)
              ? note.scrollHeight > note.clientHeight + 1
              : false,
          noteFoldable: note ? note.tagName === 'DETAILS' : false,
        };
      });
      if (!done) {
        errors.push(`${vp.name}/پایان ${title}: دکمهٔ «بعدی» پیدا نشد`);
      } else {
        if (done.below > 0) {
          errors.push(`${vp.name}/پایان ${title}: دکمهٔ «بعدی» ${done.below}px زیر لبهٔ صفحه است`);
        }
        if (done.tap < 56) {
          errors.push(`${vp.name}/پایان ${title}: هدف لمسی «بعدی» فقط ${done.tap}px است`);
        }
        if (done.noteClipped) {
          errors.push(`${vp.name}/پایان ${title}: متن یادداشت والدین بریده شده`);
        }
      }

      played++;
      // ⚠ دکمهٔ «خانه» در صفحهٔ کوتاه پنهان می‌شود (فلشِ نوار بالا
      // همان کار را می‌کند)، پس نباید فرض کنیم همیشه هست.
      // ⚠ count() عنصرِ display:none را هم می‌شمارد؛ باید دیدنی
      // بودن را پرسید، وگرنه کلیک با TimeoutError می‌ماند.
      const homeBtn = page.locator('.screen.done > .btn.ghost');
      if (await homeBtn.isVisible().catch(() => false)) await homeBtn.click();
      else await page.locator('.icon-btn[aria-label="بازگشت"]').first().click();
    } else {
      // درس تمام نشد (گِرد ناشناخته یا گیر). به‌جای شکست خاموش،
      // از راه خانه برمی‌گردیم تا گام‌های بعدی اجرا شوند.
      const back = page.locator('.icon-btn[aria-label="بازگشت"]').first();
      if (await back.count()) await back.click().catch(() => {});
      else await page.goto(BASE, { waitUntil: 'networkidle' });
    }
    await page.waitForSelector('.play-btn', { timeout: 15000 }).catch(async () => {
      await page.goto(BASE, { waitUntil: 'networkidle' });
      await page.waitForSelector('.play-btn');
    });
  }

  // تنظیمات — پشت دروازهٔ ضرب است (تا کودک پیشرفتش را پاک نکند).
  await page.locator('.icon-btn[aria-label="تنظیمات"]').click();
  await page.waitForSelector('.gate');
  await audit(page, 'دروازهٔ تنظیمات', vp);
  {
    const q0 = await page.locator('.gate .prompt').textContent();
    const [a0, b0] = (q0 || '').match(/\d+/g).map(Number);
    await page.locator('.gate input').fill(String(a0 * b0));
    await page.locator('.btn', { hasText: 'ورود' }).click();
  }
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
      // بدترین حالت را می‌سنجیم، نه یک واژهٔ تصادفی: واژهٔ کوتاه
      // همیشه جا می‌شود و باگِ شکستن خط را پنهان می‌کند.
      let built = null;
      for (let k = 0; k < 40; k++) {
        const cand = R.buildRound(rd, C.AGE_TRACKS.school);
        if (!cand?.display?.parts?.length) continue;
        if (!built || cand.display.parts.length > built.display.parts.length) built = cand;
      }
      if (!built) return { err: 'صحنهٔ صداکشی ساخته نشد' };

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
      if (dom.join('') !== visual.join('')) {
        return { dom: dom.join(' '), visual: visual.join(' ') };
      }

      // همهٔ صداها باید در یک خط باشند. شکستن خط در RTL ترتیب را
      // وارونه می‌کرد: «شکار» به‌صورت «ا ک ِ ش ر» دیده می‌شد —
      // واژه‌ای که کودک می‌خواند اصلاً واژه نبود.
      const lines = new Set(nodes.map((e) => Math.round(e.getBoundingClientRect().top)));
      if (lines.size > 1) return { err: `صداها در ${lines.size} خط شکسته‌اند` };

      // هیچ کارتی نباید آن‌قدر کوچک شود که ناخوانا گردد.
      const tiny = nodes.filter((e) => e.getBoundingClientRect().width < 24);
      if (tiny.length) return { err: `${tiny.length} کارت صدا خیلی کوچک است` };

      // ردیف نباید از کادر بزند بیرون.
      const row2 = document.querySelector('.sounds');
      const host2 = row2.parentElement;
      const rr = row2.getBoundingClientRect();
      const hr = host2.getBoundingClientRect();
      if (rr.left < hr.left - 1 || rr.right > hr.right + 1) {
        return { err: 'ردیف صداکشی از کادر بیرون زده' };
      }
      return null;
    });

    if (bad?.err) errors.push(`${vp.name}: ${bad.err}`);
    else if (bad) {
      errors.push(`${vp.name}: ترتیب صداکشی وارونه — «${bad.visual}» به‌جای «${bad.dom}»`);
    }
    await page.goto(BASE, { waitUntil: 'networkidle' });
  }

  // ── گِرد چیدنِ تصویری «نه، برو، بگو» ─────────────────────────────
  // چرا صحنه را دستی می‌سازیم: این درس در مسیر سفر قفل است و خزشِ
  // بازی هرگز به آن نمی‌رسد. محافظی که به صحنه نرسد، محافظ نیست.
  //
  // چه چیزی را می‌پاید: هر سه گام باید در یک سطر دیده شوند. اگر
  // آیتم سوم به سطر دوم بیفتد کودک نمی‌تواند ترتیب را بفهمد — این
  // دقیقاً باگی بود که در ۳۲۰px رخ داد.
  {
    const bad = await page.evaluate(async () => {
      const R = await import('/src/core/rounds.js');
      const C = await import('/src/data/curriculum.js');
      const L = await import('/src/data/lessons/life.js');
      const les = L.LIFE_LESSONS.find((l) => l.id === 'life-safety-02');
      const rd = les?.rounds.find((r) => r.kind === 'safety-order');
      if (!rd) return { err: 'گِرد «نه، برو، بگو» در درس تعریف نشده' };
      const built = R.buildRound(rd, C.AGE_TRACKS.school);
      if (!built?.items?.length) return { err: 'صحنهٔ چیدن ساخته نشد' };

      const host = document.createElement('div');
      host.className = 'screen';
      const tray = document.createElement('div');
      tray.className = 'order-tray';
      built.items.forEach((it) => {
        const btn = document.createElement('button');
        btn.className = `order-item${it.pic ? ' has-pic' : ''}`;
        const ico = document.createElement('span');
        ico.className = 'ico ord-ico';
        ico.textContent = '□';
        const lab = document.createElement('span');
        lab.className = 'ord-label';
        lab.textContent = it.label;
        btn.append(ico, lab);
        tray.append(btn);
      });
      host.append(tray);
      document.querySelector('#app').replaceChildren(host);

      const nodes = [...document.querySelectorAll('.order-tray .order-item')];
      if (nodes.length !== 3) return { err: `${nodes.length} گام به‌جای ۳` };

      const lines = new Set(nodes.map((e) => Math.round(e.getBoundingClientRect().top)));
      if (lines.size > 1) return { err: `گام‌های ایمنی در ${lines.size} سطر شکسته‌اند` };

      // هدف لمسی: هیچ گامی نباید از حداقلِ انگشت کودک کوچک‌تر شود.
      const small = nodes.filter((e) => {
        const r = e.getBoundingClientRect();
        return Math.min(r.width, r.height) < 56;
      });
      if (small.length) return { err: `${small.length} گام کوچک‌تر از ۵۶px است` };

      const out = nodes.filter((e) => {
        const r = e.getBoundingClientRect();
        return r.left < -0.5 || r.right > window.innerWidth + 0.5;
      });
      if (out.length) return { err: `${out.length} گام از صفحه بیرون زده` };
      return null;
    });
    if (bad?.err) errors.push(`${vp.name}: ${bad.err}`);
    await page.goto(BASE, { waitUntil: 'networkidle' });
  }

  // ── نمایش‌های ریاضی ─────────────────────────────────────────────
  // خزشِ بازی فقط ۶ درس اول مسیر را می‌بیند، پس درس‌های ریاضیِ دور
  // دوم (چوب‌خط، ارزش مکانی، تقارن…) هرگز بازرسی نمی‌شدند. اینجا
  // مستقیم از نقشهٔ سفر بازشان می‌کنیم و هر گِرد را می‌سنجیم.
  {
    const MATH_LESSONS = [
      'چوب‌خط',
      'گوشه‌ها را بشمار',
      'آینه و تقارن',
      'دوتا دوتا بشمار',
      'ده‌تایی و یکی',
      'چند تا کم داریم؟',
    ];
    // ⚠ نمایهٔ آزمون هیچ درسی را باز نکرده، پس درس‌های ریاضیِ دور
    // دوم روی نقشه قفل‌اند و کلیک روی‌شان با TimeoutError می‌ماند.
    // همه را باز می‌کنیم — فقط برای همین بخش.
    await page.evaluate(async () => {
      const L = await import('/src/data/lessons/index.js');
      const KEY = 'parvaresh-hoosh/v4';
      const st = JSON.parse(localStorage.getItem(KEY) || '{}');
      st.lessons = st.lessons || {};
      for (const l of L.LESSONS) {
        st.lessons[l.id] = { completions: 1, bestScore: 90, lastPlayed: new Date().toISOString() };
      }
      st.dailyLimitMin = 300;
      localStorage.setItem(KEY, JSON.stringify(st));
    });

    for (const title of MATH_LESSONS) {
      await page.goto(BASE, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        await document.fonts.ready;
      });
      await page.locator('.btn.ghost', { hasText: 'نقشهٔ سفر' }).first().click();
      await page.waitForTimeout(250);
      const item = page.locator('.map-item', { hasText: title }).first();
      if (!(await item.count())) {
        errors.push(`${vp.name}: درس «${title}» در نقشه پیدا نشد`);
        continue;
      }
      await item.click();
      const opened = await page
        .waitForSelector('.prompt', { timeout: 8000 })
        .then(() => true)
        .catch(() => false);
      if (!opened) {
        errors.push(`${vp.name}: درس «${title}» باز نشد`);
        continue;
      }

      for (let step = 0; step < 6; step++) {
        if (await page.locator('.done-card').count()) break;
        await page.evaluate(async () => {
          await document.fonts.ready;
        });
        await page.waitForTimeout(240);
        const bad = await page.evaluate((vw) => {
          const out = [];
          const stage = document.querySelector('.stage');
          if (stage) {
            if (stage.scrollWidth > stage.clientWidth + 2) {
              out.push(`سرریز افقی ${stage.scrollWidth - stage.clientWidth}px`);
            }
            const sb = stage.getBoundingClientRect();
            if (sb.right > vw + 1 || sb.left < -1) out.push('صحنه از کادر بیرون زده');
            // عنصرِ دیدنی با ابعاد صفر = جعبهٔ خالی یا شکل ناپدید
            for (const e of stage.querySelectorAll('div,span,i')) {
              const r = e.getBoundingClientRect();
              const cs = getComputedStyle(e);
              if (cs.display === 'none' || cs.visibility === 'hidden') continue;
              if (r.width < 1 || r.height < 1) {
                out.push(`عنصر نامرئی .${String(e.className)}`);
                break;
              }
            }
          }
          for (const o of document.querySelectorAll('.opt')) {
            const r = o.getBoundingClientRect();
            if (r.right > vw + 1 || r.left < -1) out.push('گزینه از کادر بیرون زده');
          }
          return [...new Set(out)];
        }, vp.width);
        if (bad.length) {
          const q = (await page.locator('.prompt').textContent().catch(() => ''))?.trim();
          errors.push(`${vp.name}/«${title}» [${q}]: ${bad.join('؛ ')}`);
        }

        const opt = page.locator('.opt:not([disabled])').first();
        if (await opt.count()) {
          await opt.click().catch(() => {});
          await page.waitForTimeout(1900);
        } else break;
      }
    }
    await page.goto(BASE, { waitUntil: 'networkidle' });
  }

  notes.push(
    `${vp.name} (${vp.width}px): خانه + نقشه + ${played} درس + ترتیب صداکشی + چیدن ایمنی + نمایش ریاضی بررسی شد`,
  );
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
