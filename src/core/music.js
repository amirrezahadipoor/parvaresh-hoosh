/**
 * آهنگ‌های پس‌زمینه — ساخته می‌شوند، ضبط نمی‌شوند.
 *
 * ── چرا این فایل جدا از audio.js است ──────────────────────────────
 * `audio.js` صداهای *لحظه‌ای* می‌سازد: یک نُت وقتی پاسخ درست است، یک
 * زنگ وقتی بازی تمام می‌شود. عمرشان چند صد میلی‌ثانیه است و بعد
 * فراموش می‌شوند. آهنگ چیز دیگری است: باید دقیقه‌ها ادامه بدهد،
 * حافظه نبلعد، و هر لحظه بشود خاموشش کرد. مخلوط کردنشان یعنی
 * `audio.js` هم زمان‌بند شود هم صدا‌ساز.
 *
 * ── دو یافتهٔ پژوهشی که کلِ طراحی را عوض کرد ──────────────────────
 *
 * ۱. **تمپوی محبوبِ کودک ~۱۵۰ BPM است**، نه ۱۰۰–۱۲۰ که برای بزرگ‌سال
 *    راحت است (musicscience.net). با بالا رفتن سن کند می‌شود.
 *
 * ۲. **و مهم‌تر:** پژوهش EEG روی کودکان ۵ تا ۷ ساله نشان داد در محیط
 *    ساکت، موسیقیِ پس‌زمینه **هوشیاری را کم می‌کند**
 *    (ScienceDirect S0885201422001435). پژوهش دیگری روی ۴ تا ۶
 *    ساله‌ها نشان داد موسیقیِ *کند* کارایی توجه را حفظ می‌کند ولی
 *    موسیقیِ *تند* آن را می‌کاهد (Springer 13414-022-02602-3).
 *
 * این دو با هم یک نتیجهٔ ناخوشایند می‌دهند: **آهنگِ تند و شاد دقیقاً
 * همان چیزی است که نباید هنگام درس پخش شود.** کودک باید بشمارد و
 * حرف تشخیص دهد؛ موسیقی همان کانالِ توجهی را می‌گیرد.
 *
 * ── تصمیم ─────────────────────────────────────────────────────────
 * آهنگ‌ها ساخته می‌شوند و تصادفی پخش می‌شوند، اما **نه همه‌جا**:
 *
 *   خانه و نقشه  → آهنگِ آرام (۹۰–۱۰۴ BPM). اینجا کودک کاری نمی‌کند.
 *   بخش بازی‌ها  → آهنگِ تند (۱۳۸–۱۵۲ BPM). بازی خودش هیجان است.
 *   داخل درس     → **هیچ آهنگی.** فقط صداهای لحظه‌ای.
 *   جشن پایان    → آهنگِ کوتاهِ پیروزی.
 *
 * و پیش‌فرض `muted` است، چون قانونِ برنامه می‌گوید همه‌چیز باید بدون
 * صدا کامل کار کند. آهنگ افزودنی است، نه لازمه.
 *
 * ── چرا زمان‌بندیِ lookahead ──────────────────────────────────────
 * `setTimeout` برای نُت‌ها لرزش دارد و آهنگ کِش می‌آید. روشِ درست
 * (web.dev «A tale of two clocks») این است: یک تایمرِ ۲۵ms که فقط
 * *نگاه می‌کند* آیا نُتی در ۱۰۰ms آینده باید پخش شود، و آن را با
 * ساعتِ دقیقِ Web Audio زمان‌بندی می‌کند. تایمر می‌تواند بلرزد؛
 * صدا نمی‌لرزد.
 *
 * ── صفر بایت دارایی ───────────────────────────────────────────────
 * هیچ فایل صوتی‌ای اضافه نمی‌شود. کلِ این فایل چند کیلوبایت متن است
 * که آهنگ را در لحظه می‌سازد. قانونِ فاز ۷ حفظ می‌شود.
 */

import { isMuted } from './audio.js';

// ── نظریهٔ موسیقی، به کمترین شکلِ لازم ──────────────────────────────
//
// پنتاتونیکِ ماژور: پنج نُت که *هر ترکیبی* از آن‌ها خوش‌آهنگ است.
// این یعنی می‌شود نُت‌ها را تصادفی انتخاب کرد و هرگز فالش نشود —
// همان دلیلی که در audio.js هم انتخاب شد.
//
// اعداد نیم‌پرده نسبت به نتِ پایه‌اند (۰=ریشه، ۱۲=یک اکتاو بالاتر).
const PENTA_STEPS = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];

/** نیم‌پرده به فرکانس. ۶۰ = دوی میانی. */
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

/**
 * آهنگ‌ها.
 *
 * هر آهنگ چند «بخش» دارد و هر بخش چند میزان. به‌جای نوشتنِ نُت‌به‌نُتِ
 * چند دقیقه موسیقی (که هزاران خط می‌شد)، هر آهنگ یک *دستورِ ساخت*
 * است: پیش‌رَوی آکورد + الگوی ملودی + ریتم. موتور از رویش دقیقه‌ها
 * موسیقیِ متغیر می‌سازد که هرگز عیناً تکرار نمی‌شود.
 *
 * ⚠ `root` نتِ پایه است. آهنگ‌ها عمداً در گام‌های متفاوت‌اند تا وقتی
 * پشت سر هم پخش می‌شوند، گوش تغییر را حس کند.
 */
export const TRACKS = Object.freeze([
  {
    id: 'sabz',
    name: 'دشتِ سبز',
    mood: 'calm',
    bpm: 96,
    root: 60, // دو
    // پیش‌رَویِ I–V–vi–IV: شناخته‌شده‌ترین پیش‌رَویِ موسیقی مردمی،
    // چون هر آکورد به بعدی «می‌خواهد» برود.
    chords: [0, 7, 9, 5],
    wave: 'sine',
    bassWave: 'triangle',
    // چگالیِ ملودی: چند شانزدهم از هر شانزده‌تا نُت داشته باشد.
    density: 0.38,
  },
  {
    id: 'abi',
    name: 'آسمانِ آبی',
    mood: 'calm',
    bpm: 88,
    root: 62, // ر
    chords: [0, 5, 7, 5],
    wave: 'triangle',
    bassWave: 'sine',
    density: 0.32,
  },
  {
    id: 'talayi',
    name: 'صبحِ طلایی',
    mood: 'calm',
    bpm: 104,
    root: 65, // فا
    chords: [0, 9, 5, 7],
    wave: 'sine',
    bassWave: 'triangle',
    density: 0.42,
  },
  {
    id: 'parande',
    name: 'پروازِ پرنده',
    mood: 'lively',
    bpm: 138,
    root: 60,
    chords: [0, 5, 7, 0],
    wave: 'square',
    bassWave: 'triangle',
    density: 0.55,
  },
  {
    id: 'jashn',
    name: 'جشنِ رنگ‌ها',
    mood: 'lively',
    bpm: 148,
    root: 67, // سل
    chords: [0, 7, 5, 7],
    wave: 'square',
    bassWave: 'square',
    density: 0.62,
  },
  {
    id: 'toop',
    name: 'توپ‌بازی',
    mood: 'lively',
    bpm: 152,
    root: 64, // می
    chords: [0, 5, 9, 7],
    wave: 'triangle',
    bassWave: 'square',
    density: 0.58,
  },
]);

// ── وضعیتِ پخش ──────────────────────────────────────────────────────

let ctx = null;
let master = null;
let timer = null;
let current = null; // آهنگِ در حال پخش
let nextNoteTime = 0; // ساعتِ Web Audio، نه ساعتِ جاوااسکریپت
let step = 0; // شمارندهٔ شانزدهم
let lastId = null; // برای اینکه دو بار پشت‌سرهم یکی نیاید
let fadeTimer = null;

const LOOKAHEAD_MS = 25; // هر چند وقت *نگاه* کنیم
const SCHEDULE_AHEAD = 0.12; // چقدر جلوتر زمان‌بندی کنیم (ثانیه)
const VOLUME = 0.055; // ⚠ آهنگ باید *زیرِ* صدای بازخورد بماند

function ensureCtx() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0;
  // فیلترِ پایین‌گذر: هارمونیک‌های تیزِ موجِ مربعی را می‌گیرد.
  // بدون این، square روی بلندگوی گوشی زننده است.
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 2600;
  master.connect(lp);
  lp.connect(ctx.destination);
  return ctx;
}

/**
 * یک نُت را در زمانِ دقیق زمان‌بندی می‌کند.
 *
 * ⚠ هر نُت اسیلاتورِ خودش را می‌سازد و بعد از پایان خودش را جمع
 * می‌کند (مرورگر پس از `stop` آزادش می‌کند). این عمدی است: اسیلاتورِ
 * ماندگار یعنی مدیریتِ دستیِ حافظه و نشتی.
 */
function note(freq, at, durSec, type, gain) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  // پوشِ نرم: حملهٔ ۱۵ms و رهایی تدریجی. بدون این، هر نُت «تیک»
  // می‌دهد چون موج ناگهان از صفر می‌پرد.
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(gain, at + 0.015);
  g.gain.setValueAtTime(gain, at + durSec * 0.6);
  g.gain.linearRampToValueAtTime(0, at + durSec);
  osc.connect(g);
  g.connect(master);
  osc.start(at);
  osc.stop(at + durSec + 0.02);
}

/**
 * یک شانزدهم را می‌سازد.
 *
 * ساختار: هر ۱۶ شانزدهم = یک میزان. هر چهار میزان = یک دور کامل از
 * پیش‌رَویِ آکورد. یعنی دورِ کامل ۶۴ شانزدهم است و بعد دوباره — ولی
 * چون ملودی تصادفی است، هرگز عیناً تکرار نمی‌شود.
 */
function scheduleStep(s, at) {
  const t = current;
  const beat = 60 / t.bpm;
  const sixteenth = beat / 4;
  const bar = Math.floor(s / 16) % 4;
  const inBar = s % 16;
  const chordRoot = t.root + t.chords[bar];

  // ── باس: روی ضربِ ۱ و ۳ هر میزان ───────────────────────────────
  if (inBar === 0 || inBar === 8) {
    note(hz(chordRoot - 12), at, beat * 0.9, t.bassWave, 0.5);
  }

  // ── آکورد: روی ضربِ ۱، سه نُتِ آرام ─────────────────────────────
  if (inBar === 0) {
    for (const iv of [0, 4, 7]) {
      note(hz(chordRoot + iv), at, beat * 1.6, t.wave, 0.13);
    }
  }

  // ── ضربِ سبک روی ضرب‌های زوج: حسِ ریتم بدون سازِ کوبه‌ای ────────
  // ⚠ نویزِ سفید برای درام لازم نیست و پردازش می‌خواهد. یک نُتِ
  // خیلی کوتاه و بم همان کار را می‌کند.
  if (inBar % 4 === 2 && t.mood === 'lively') {
    note(hz(t.root - 24), at, 0.05, 'square', 0.22);
  }

  // ── ملودی: تصادفی از پنتاتونیک، با چگالیِ خودِ آهنگ ─────────────
  //
  // ⚠ چرا تصادفی و نه نوشته‌شده: یک ملودیِ ثابتِ چهار‌میزانی بعد از
  // دو دقیقه آزاردهنده می‌شود — دقیقاً همان «تکرار» که قانون ۶
  // منعش می‌کند. با انتخابِ تصادفی از پنتاتونیک، آهنگ همیشه
  // خوش‌آهنگ است ولی هرگز همان نیست.
  if (Math.random() < t.density) {
    const stepIdx = PENTA_STEPS[Math.floor(Math.random() * PENTA_STEPS.length)];
    // ملودی روی آکوردِ جاری می‌نشیند، نه روی ریشهٔ ثابت.
    const m = chordRoot + stepIdx;
    const dur = inBar % 4 === 0 ? sixteenth * 3 : sixteenth * 1.8;
    note(hz(m), at, dur, t.wave, 0.1);
  }
}

function scheduler() {
  if (!ctx || !current) return;
  while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD) {
    scheduleStep(step, nextNoteTime);
    nextNoteTime += 60 / current.bpm / 4;
    step = (step + 1) % 64;
  }
  timer = setTimeout(scheduler, LOOKAHEAD_MS);
}

/**
 * یک آهنگ با حالِ خواسته‌شده پخش می‌کند — تصادفی، ولی نه تکراری.
 *
 * @param {'calm'|'lively'} mood
 */
export function playMusic(mood = 'calm') {
  if (isMuted()) return;
  if (!ensureCtx()) return;
  if (ctx.state === 'suspended') ctx.resume();

  const pool = TRACKS.filter((t) => t.mood === mood);
  // ⚠ «تصادفی» یعنی «هر بار متفاوت»، نه «گاهی همان». اگر آهنگِ
  // قبلی دوباره انتخاب شد، از فهرست بیرونش می‌گذاریم. با سه آهنگ
  // در هر حال، این همیشه ممکن است.
  const choices = pool.length > 1 ? pool.filter((t) => t.id !== lastId) : pool;
  const pick = choices[Math.floor(Math.random() * choices.length)];
  if (!pick) return;

  if (current && current.id === pick.id && timer) return; // همان که هست

  stopMusic(true);
  current = pick;
  lastId = pick.id;
  step = 0;
  nextNoteTime = ctx.currentTime + 0.08;

  // محوِ ورود: صدا از سکوت بالا می‌آید، نه ناگهان.
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(VOLUME, ctx.currentTime + 1.2);

  scheduler();
}

/**
 * آهنگ را متوقف می‌کند.
 * @param {boolean} instant بدون محوشدن (برای جای‌گزینیِ آهنگ)
 */
export function stopMusic(instant = false) {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (fadeTimer) {
    clearTimeout(fadeTimer);
    fadeTimer = null;
  }
  current = null;
  if (!ctx || !master) return;
  if (instant) {
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(0, ctx.currentTime);
    return;
  }
  // محوِ خروج ۶۰۰ms: قطعِ ناگهانی صدا خودش یک رویدادِ صوتی است و
  // کودک را می‌پراند.
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
}

/** آیا الان آهنگی پخش می‌شود؟ */
export function isPlaying() {
  return Boolean(current);
}

/** نامِ آهنگِ در حال پخش — برای نمایش در تنظیمات. */
export function currentTrackName() {
  return current ? current.name : null;
}
