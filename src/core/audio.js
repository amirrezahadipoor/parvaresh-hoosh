// پخش صدا — کلیپ‌های ضبط‌شده و افکت‌های صوتی.
//
// ⚠ اینجا هرگز از Text-to-Speech استفاده نمی‌شود.
// WebView اندروید صدای فارسی ندارد؛ TTS یا سکوت مطلق است یا با لهجهٔ
// بزرگسالانه و تلفظ غلط. هر خط گفتاری باید کلیپ ضبط‌شده داشته باشد.
// اگر کلیپ نبود، خط بی‌صدا می‌ماند — و اعتبارسنج جلوی این را می‌گیرد.

import { NARRATION } from '../data/narration.js';

const CLIP_DIR = 'assets/audio/kid';

let muted = false;
let current = null;
let ctx = null;

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = !!value;
  if (muted) stop();
  return muted;
}

export function stop() {
  if (current) {
    try {
      current.pause();
      current.currentTime = 0;
    } catch {
      /* پخش قبلاً متوقف شده */
    }
    current = null;
  }
}

export function hasClip(text) {
  return Boolean(NARRATION[text]);
}

/**
 * یک خط را می‌گوید. اگر ضبط نشده باشد false برمی‌گرداند و سکوت می‌کند.
 * @returns {Promise<boolean>} وقتی پخش تمام شد
 */
export function speak(text) {
  const clip = NARRATION[text];
  if (!clip || muted) return Promise.resolve(false);

  stop();
  return new Promise((resolve) => {
    const audio = new Audio(`${CLIP_DIR}/${clip}.mp3`);
    current = audio;
    const done = (ok) => {
      if (current === audio) current = null;
      resolve(ok);
    };
    audio.addEventListener('ended', () => done(true), { once: true });
    audio.addEventListener('error', () => done(false), { once: true });
    audio.play().catch(() => done(false));
  });
}

// ── افکت‌های صوتی (اسیلاتور، بدون فایل) ─────────────────────────────────
//
// ⚠ این بخش قانون «هرگز صدای تازه نساز» را نقض نمی‌کند. آن قانون
// دربارهٔ *گفتار* است: کلیپ‌های فارسی ۷۹ تا هستند و قفل، و TTS
// ممنوع. صدای موسیقایی چیز دیگری است — با نوسان‌ساز ساخته می‌شود و
// **صفر بایت فایل** به برنامه اضافه نمی‌کند.

/**
 * گام پنج‌نتیِ ماژور (C-D-E-G-A) در دو اکتاو.
 *
 * چرا پنج‌نتی: در این گام **هر نُت با هر نُتِ دیگر خوش‌آهنگ است** —
 * فاصلهٔ نیم‌پرده‌ای وجود ندارد، پس هیچ ترکیبی ناکوک نمی‌شود. یعنی
 * می‌توانیم نُت را بر اساس *وضعیت بازی* انتخاب کنیم و هرگز نگران
 * هارمونی نباشیم. همان چیزی که سازهای کودکانه (زایلوفون اسباب‌بازی)
 * از آن استفاده می‌کنند.
 */
const PENTA = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.7, 1318.5];

// شمارندهٔ پاسخ‌های درستِ پشت‌سرهم. هر پاسخ درست یک پله بالاتر
// می‌نوازد، پس زنجیرهٔ موفقیت خودش یک ملودیِ بالارونده می‌سازد و
// کودک *می‌شنود* که دارد خوب پیش می‌رود. با یک اشتباه صفر می‌شود.
let streak = 0;

/**
 * یک نُت با پوشِ ADSR.
 *
 * ⚠ نسخهٔ اول `setValueAtTime(gain)` می‌گذاشت، یعنی صدا از بلندترین
 * حالت شروع می‌شد. نتیجه یک «کلیک» یا «بوق» بود، نه نُت. حملهٔ
 * ۱۲ میلی‌ثانیه‌ای همان چیزی است که صدا را نرم می‌کند — کمتر از آن
 * تق‌تق می‌کند، بیشتر از آن تنبل به‌نظر می‌رسد.
 */
function tone(freq, durationMs, type = 'sine', gain = 0.15, delayMs = 0) {
  if (muted) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const t0 = ctx.currentTime + delayMs / 1000;
    const dur = durationMs / 1000;
    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);

    // ADSR: حمله ← نگه‌داشت ← رهایش
    vol.gain.setValueAtTime(0.0001, t0);
    vol.gain.linearRampToValueAtTime(gain, t0 + 0.012);
    vol.gain.setValueAtTime(gain, t0 + dur * 0.35);
    vol.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(vol).connect(ctx.destination);
    osc.start(t0);
    // ⚠ کمی بعد از پایانِ پوش متوقف می‌شود: اگر دقیقاً روی صفر
    // قطع شود، انتهای موج بریده می‌شود و «تق» می‌دهد.
    osc.stop(t0 + dur + 0.02);
  } catch {
    /* صدا در دسترس نیست */
  }
}

/** دو نُت با هم — آکورد. صدای پر، بی‌آنکه بلندتر شود. */
function chord(freqs, durationMs, type = 'sine', gain = 0.1) {
  freqs.forEach((f) => tone(f, durationMs, type, gain));
}

/**
 * رنگِ صوتیِ هر حوزه.
 *
 * «یک رنگ = یک معنی» قانونِ دیداریِ برنامه است؛ اینجا همان قانون در
 * صداست. کودک پس از چند جلسه می‌فهمد صدای ریاضی با صدای خواندن فرق
 * دارد، حتی پیش از آنکه عنوان را بخواند.
 */
const DOMAIN_VOICE = {
  reading: 'sine', // نرم و گرد
  math: 'triangle', // زنگ‌دار و دقیق
  logic: 'sine',
  science: 'triangle',
  life: 'sine',
  english: 'triangle',
};
let voice = 'sine';

/** حوزهٔ جاری را تعیین می‌کند تا رنگِ صدا با درس بخواند. */
export function setDomainVoice(domainId) {
  voice = DOMAIN_VOICE[domainId] || 'sine';
}

/** زنجیرهٔ موفقیت را صفر می‌کند — آغاز هر درس. */
export function resetStreak() {
  streak = 0;
}

export const sfx = {
  correct() {
    // هر پاسخ درست یک پله در گام پنج‌نتی بالاتر. زنجیره که طولانی
    // شود، ملودی بالا می‌رود؛ کودک پیشرفت را *می‌شنود*.
    const i = Math.min(streak, PENTA.length - 2);
    streak += 1;
    tone(PENTA[i], 130, voice, 0.14);
    tone(PENTA[i + 1], 200, voice, 0.12, 100);
  },
  wrong() {
    streak = 0;
    // ⚠ صدای «اشتباه» نباید تنبیه‌گر باشد — قانون «هرگز ضربدر قرمز»
    // در صدا هم صادق است. دو نُتِ پایین‌روندهٔ نرم، یعنی «دوباره»،
    // نه «باختی».
    tone(392, 140, 'sine', 0.1);
    tone(349.23, 180, 'sine', 0.09, 120);
  },
  tap() {
    tone(880, 45, 'sine', 0.05);
  },
  win() {
    streak = 0;
    // آهنگِ پایانِ درس: چهار نُتِ بالارونده و یک آکوردِ پایانی.
    [0, 2, 4, 5].forEach((k, i) => tone(PENTA[k], 170, voice, 0.13, i * 130));
    setTimeout(() => chord([PENTA[0], PENTA[2], PENTA[4]], 520, voice, 0.09), 560);
  },
  /** یک پله در بازی‌ها — کوتاه‌تر از correct، برای ضرب‌آهنگ تند. */
  point() {
    const i = Math.min(streak, PENTA.length - 1);
    streak += 1;
    tone(PENTA[i], 90, voice, 0.11);
  },
};

/** صدا را با اولین لمس کاربر آماده می‌کند (سیاست autoplay مرورگر). */
export function unlockAudio() {
  const unlock = () => {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
    } catch {
      /* بی‌اهمیت */
    }
    document.removeEventListener('pointerdown', unlock);
  };
  document.addEventListener('pointerdown', unlock, { once: true });
}
