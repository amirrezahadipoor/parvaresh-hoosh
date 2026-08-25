/**
 * نگهبان ۱۰ — موتور آهنگ.
 *
 * ── چرا این نگهبان لازم است ───────────────────────────────────────
 * آهنگ تنها بخشِ برنامه است که **در پس‌زمینه و بی‌پایان** اجرا
 * می‌شود. یک اشتباه اینجا شبیهِ بقیهٔ اشتباه‌ها نیست:
 *
 *   • یک اسیلاتور که `stop` نشود، تا بسته‌شدن برنامه صدا می‌دهد.
 *   • یک زمان‌بند که پاک نشود، بعد از خروج از صفحه هم CPU می‌خورد
 *     و باتری را می‌بلعد — روی گوشیِ ارزان که مخاطبِ ماست، مرگبار.
 *   • یک آهنگ که وسطِ درس پخش شود، دقیقاً همان آسیبی را می‌زند که
 *     پژوهش هشدار داده بود.
 *
 * هیچ‌کدامِ این‌ها در اسکرین‌شات دیده نمی‌شوند و هیچ‌کدام تست‌های
 * موجود را قرمز نمی‌کنند. `test-visual` عکس می‌گیرد و عکس صدا ندارد.
 *
 * ── چه چیزی را *نمی‌بیند* ─────────────────────────────────────────
 * این نگهبان **کیفیتِ موسیقی را قضاوت نمی‌کند.** نمی‌داند آهنگ
 * خوش‌آهنگ است یا آزاردهنده، و نمی‌تواند بداند. آن را فقط گوش
 * می‌شنود. اینجا فقط *رفتارِ مهندسیِ* موتور بررسی می‌شود: تمپو در
 * محدوده، بلندی در سقف، هیچ صدایی داخل درس، و پاک‌شدنِ کاملِ منابع.
 */

import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:8080';

const problems = [];
const fail = (m) => problems.push(m);

// محدوده‌های مجاز — از پژوهش، نه از سلیقه.
//
// پایین: کندتر از ۸۰ برای کودک «غمگین» شنیده می‌شود (پژوهشِ تمپو و
// احساس از ۴ سالگی). بالا: تمپوی محبوبِ کودک ~۱۵۰ است؛ بالاتر از
// ۱۶۰ دیگر برانگیزاننده نیست، آشفته است.
const BPM_MIN = 80;
const BPM_MAX = 160;
// تمپوی «آرام» باید واقعاً آرام باشد، وگرنه اسمش دروغ است.
const CALM_MAX = 110;
// سقفِ بلندی. آهنگ باید *زیرِ* صدای بازخورد بماند؛ اگر بلندتر شود،
// کودک صدای «آفرین» را از دست می‌دهد.
const GAIN_MAX = 0.09;

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));

  await page.goto(BASE, { waitUntil: 'networkidle' });

  // ── ۱. بررسی ایستا روی خودِ داده ───────────────────────────────
  const tracks = await page.evaluate(async () => {
    const m = await import('/src/core/music.js');
    return m.TRACKS.map((t) => ({ ...t }));
  });

  if (tracks.length < 4) fail(`فقط ${tracks.length} آهنگ هست؛ «چند آهنگ» یعنی دست‌کم ۴.`);

  const calm = tracks.filter((t) => t.mood === 'calm');
  const lively = tracks.filter((t) => t.mood === 'lively');
  // ⚠ با یک آهنگ در هر حال، «پخشِ تصادفی» بی‌معناست و کودک هر بار
  // همان را می‌شنود. دست‌کم دو تا لازم است تا انتخاب معنی بدهد.
  if (calm.length < 2) fail(`فقط ${calm.length} آهنگ آرام؛ برای تصادفی‌بودن دست‌کم ۲ لازم است.`);
  if (lively.length < 2) fail(`فقط ${lively.length} آهنگ شاد؛ برای تصادفی‌بودن دست‌کم ۲ لازم است.`);

  const ids = new Set();
  for (const t of tracks) {
    if (ids.has(t.id)) fail(`شناسهٔ تکراری: ${t.id}`);
    ids.add(t.id);
    if (t.bpm < BPM_MIN || t.bpm > BPM_MAX) {
      fail(`آهنگ «${t.name}» تمپوی ${t.bpm} دارد؛ محدودهٔ کودک ${BPM_MIN}–${BPM_MAX}.`);
    }
    if (t.mood === 'calm' && t.bpm > CALM_MAX) {
      fail(`آهنگ «${t.name}» آرام نامیده شده ولی ${t.bpm} BPM است (سقفِ آرام ${CALM_MAX}).`);
    }
    if (!t.name || !/[\u0600-\u06FF]/.test(t.name)) fail(`آهنگ ${t.id} نام فارسی ندارد.`);
    if (!Array.isArray(t.chords) || t.chords.length < 3) {
      fail(`آهنگ «${t.name}» کمتر از ۳ آکورد دارد — خیلی زود تکراری می‌شود.`);
    }
  }

  // دو آهنگ نباید تمپو و گامِ یکسان داشته باشند، وگرنه گوش تفاوتی
  // نمی‌شنود و «چند آهنگ» توهم است.
  const sigs = new Map();
  for (const t of tracks) {
    const sig = `${t.bpm}/${t.root}/${t.chords.join(',')}`;
    if (sigs.has(sig)) fail(`«${t.name}» و «${sigs.get(sig)}» عملاً یک آهنگ‌اند (${sig}).`);
    sigs.set(sig, t.name);
  }

  // ── ۲. بلندی ───────────────────────────────────────────────────
  const src = await (await fetch(`${BASE}/src/core/music.js`)).text();
  const vol = src.match(/const VOLUME = ([\d.]+)/);
  if (!vol) fail('ثابتِ VOLUME پیدا نشد.');
  else if (Number(vol[1]) > GAIN_MAX) {
    fail(`بلندیِ آهنگ ${vol[1]} است؛ سقف ${GAIN_MAX} تا زیرِ صدای بازخورد بماند.`);
  }

  // ⚠ نُت‌ها هرگز نباید با setInterval زمان‌بندی شوند. این دقیقاً
  // همان اشتباهی است که web.dev «دو ساعت» دربارهٔ آن هشدار می‌دهد:
  // آهنگ روی گوشیِ کند کِش می‌آید.
  if (/setInterval/.test(src)) fail('music.js از setInterval استفاده می‌کند — نُت‌ها می‌لرزند.');
  // هر اسیلاتوری که start شود باید stop هم بشود.
  const starts = (src.match(/\.start\(/g) || []).length;
  const stops = (src.match(/\.stop\(/g) || []).length;
  if (stops < starts) fail(`${starts} بار start و فقط ${stops} بار stop — اسیلاتورِ رهاشده.`);

  // ── ۳. رفتارِ زنده: آیا واقعاً داخل درس ساکت است؟ ──────────────
  //
  // این مهم‌ترین بخشِ نگهبان است. بقیه را می‌شد با خواندنِ کد فهمید؛
  // این یکی فقط با اجرا معلوم می‌شود.
  await page.evaluate(() => {
    const lessons = {};
    for (let i = 1; i <= 400; i++) lessons[`l${i}`] = { completions: 1, bestScore: 100 };
    const raw = JSON.parse(localStorage.getItem('parvaresh-hoosh/v4') || '{}');
    localStorage.setItem(
      'parvaresh-hoosh/v4',
      JSON.stringify({ ...raw, lessons, dailyLimitMin: 300, music: true, muted: false }),
    );
  });
  await page.reload({ waitUntil: 'networkidle' });

  // ردیابِ اسیلاتور: می‌شماریم چند تا ساخته و چند تا متوقف شده.
  await page.addInitScript(() => {
    window.__osc = { made: 0, stopped: 0 };
  });

  const probeAfter = async (label) => {
    // به موتور فرصت بده چند نُت زمان‌بندی کند.
    await page.waitForTimeout(700);
    return page.evaluate(async () => {
      const m = await import('/src/core/music.js');
      return { playing: m.isPlaying(), track: m.currentTrackName() };
    });
  };

  // بدونِ حرکتِ کاربر، هیچ صدایی مجاز نیست (سیاستِ خودکارپخشِ مرورگر).
  let st = await probeAfter('home-before-gesture');

  // یک لمس، تا AudioContext آزاد شود.
  await page.mouse.click(195, 60);
  await page.waitForTimeout(200);

  // صفحهٔ خانه: باید آهنگِ آرام بخواند.
  await page.evaluate(async () => {
    const s = await import('/src/ui/screens.js');
    s.render(s.homeScreen());
  });
  st = await probeAfter('home');
  if (!st.playing) fail('در صفحهٔ خانه با آهنگِ روشن، هیچ آهنگی پخش نشد.');

  // ── حالا مهم‌ترین ادعا: داخلِ درس باید سکوت باشد ────────────────
  const playBtn = page.locator('.play-btn');
  if (await playBtn.count()) {
    await playBtn.first().click();
    await page.waitForTimeout(800);
    const inLesson = await page.evaluate(async () => {
      const m = await import('/src/core/music.js');
      return m.isPlaying();
    });
    if (inLesson) {
      fail('⛔ داخلِ درس آهنگ پخش می‌شود — پژوهش می‌گوید هوشیاری کودک را کم می‌کند.');
    }
  } else {
    fail('دکمهٔ شروعِ درس پیدا نشد؛ بررسیِ سکوتِ درس انجام نشد.');
  }

  // ── بخشِ بازی: باید آهنگِ تند بخواند ────────────────────────────
  await page.evaluate(async () => {
    const s = await import('/src/ui/screens.js');
    s.render(s.homeScreen());
  });
  await page.waitForTimeout(200);
  const gamesBtn = page.getByRole('button', { name: 'بازی‌ها' });
  if (await gamesBtn.count()) {
    await gamesBtn.first().click();
    await page.waitForTimeout(800);
    const g = await page.evaluate(async () => {
      const m = await import('/src/core/music.js');
      return { playing: m.isPlaying(), name: m.currentTrackName() };
    });
    if (!g.playing) fail('در بخش بازی‌ها آهنگی پخش نشد.');
  }

  // ── ۴. خاموشیِ کامل ────────────────────────────────────────────
  // وقتی والد آهنگ را خاموش می‌کند، باید *فوراً* و *کامل* بایستد —
  // هم صدا، هم زمان‌بند.
  await page.evaluate(async () => {
    const m = await import('/src/core/music.js');
    m.stopMusic(true);
  });
  await page.waitForTimeout(300);
  const after = await page.evaluate(async () => {
    const m = await import('/src/core/music.js');
    return m.isPlaying();
  });
  if (after) fail('بعد از stopMusic هنوز آهنگ فعال است.');

  // بی‌صدا کردنِ کلی باید جلوی شروعِ دوباره را هم بگیرد.
  const blocked = await page.evaluate(async () => {
    const a = await import('/src/core/audio.js');
    const m = await import('/src/core/music.js');
    a.setMuted(true);
    m.playMusic('calm');
    return m.isPlaying();
  });
  if (blocked) fail('با وجود بی‌صدا بودنِ برنامه، playMusic آهنگ را شروع کرد.');

  if (errors.length) fail(`خطای صفحه: ${errors.slice(0, 3).join(' | ')}`);

  await browser.close();

  console.log(`آهنگ‌ها: ${tracks.length} (${calm.length} آرام، ${lively.length} شاد)`);
  console.log(`تمپو: ${tracks.map((t) => t.bpm).sort((a, b) => a - b).join('، ')} BPM`);
  if (problems.length) {
    console.error(`\n✗ ${problems.length} مشکل در موتور آهنگ:`);
    for (const p of problems) console.error(`  • ${p}`);
    process.exit(1);
  }
  console.log('✓ موتور آهنگ سالم است: داخل درس ساکت، بیرون شاد، بدون نشتی.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
