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
function tone(freq, durationMs, type = 'sine', gain = 0.15) {
  if (muted) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    vol.gain.setValueAtTime(gain, ctx.currentTime);
    vol.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
    osc.connect(vol).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch {
    /* صدا در دسترس نیست */
  }
}

export const sfx = {
  correct() {
    tone(660, 120);
    setTimeout(() => tone(880, 180), 110);
  },
  wrong() {
    tone(300, 200, 'triangle', 0.12);
  },
  tap() {
    tone(520, 60, 'sine', 0.08);
  },
  win() {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 160), i * 120));
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
