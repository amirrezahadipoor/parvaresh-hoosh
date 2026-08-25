// ذخیره‌سازی محلی — پیشرفت کودک، کاملاً آفلاین و روی همین دستگاه.
//
// هیچ داده‌ای به هیچ سروری فرستاده نمی‌شود.

const KEY = 'parvaresh-hoosh/v4';

const EMPTY = {
  childName: '',
  age: 6,
  muted: false,
  lessons: {}, // id -> { completions, bestScore, lastPlayed }
  stars: 0,
  // پنل والدین
  dailyLimitMin: 0, // ۰ یعنی بدون محدودیت
  playLog: {}, // 'YYYY-MM-DD' -> دقیقهٔ بازی
  sessionStart: 0,
  // بهترین امتیاز هر بازی آزاد — id بازی → عدد.
  // ⚠ عمداً «امتیاز کل» یا سکه نیست: قانون پروژه اقتصاد سکه را رد
  // می‌کند. این فقط رکوردِ خودِ کودک در همان بازی است تا بتواند با
  // خودش رقابت کند، نه با دیگری.
  gameScores: {},
};

let cache = null;

function read() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...JSON.parse(raw) } : { ...EMPTY };
  } catch {
    cache = { ...EMPTY };
  }
  return cache;
}

function write(state) {
  cache = state;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* حافظه پر است یا در دسترس نیست — بازی ادامه پیدا می‌کند */
  }
  return state;
}

export function getState() {
  return { ...read() };
}

export function setProfile({ childName, age }) {
  const s = read();
  if (typeof childName === 'string') s.childName = childName.trim().slice(0, 20);
  if (Number.isFinite(age)) s.age = Math.min(8, Math.max(5, Math.round(age)));
  return write(s);
}

export function setMutedPref(muted) {
  const s = read();
  s.muted = !!muted;
  return write(s);
}

export function lessonProgress(id) {
  const s = read();
  return s.lessons[id] || { completions: 0, bestScore: 0, lastPlayed: null };
}

export function recordLesson(id, { correct, total }) {
  const s = read();
  const prev = s.lessons[id] || { completions: 0, bestScore: 0, lastPlayed: null };
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;
  s.lessons[id] = {
    completions: prev.completions + 1,
    bestScore: Math.max(prev.bestScore, score),
    lastPlayed: new Date().toISOString(),
  };
  s.stars += correct;
  return write(s);
}

export function isCompleted(id) {
  return lessonProgress(id).completions > 0;
}

/** بهترین امتیاز یک بازی. */
export function gameBest(gameId) {
  return read().gameScores?.[gameId] ?? 0;
}

/** امتیاز تازه را ثبت می‌کند و می‌گوید آیا رکورد شکسته شد. */
export function recordGame(gameId, score) {
  const s = read();
  if (!s.gameScores) s.gameScores = {};
  const prev = s.gameScores[gameId] ?? 0;
  const isRecord = score > prev;
  if (isRecord) s.gameScores[gameId] = score;
  write(s);
  return isRecord;
}

export function resetAll() {
  // ⚠ gameScores هم باید صفر شود، وگرنه پس از «پاک‌کردن پیشرفت»
  // رکوردهای بازی می‌مانند و والد فکر می‌کند پاک نشده.
  cache = { ...EMPTY, lessons: {}, gameScores: {} };
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* بی‌اهمیت */
  }
  return getState();
}


// ── پنل والدین ──────────────────────────────────────────────────────────
// پژوهش: والدین در نقد بی‌رحم‌اند و انتظار کنترل دارند. این بخش برای
// آن‌هاست، نه برای کودک — و پشت یک دروازهٔ ساده پنهان می‌ماند.

/** کلید امروز به وقت محلی. */
function today() {
  const d = new Date();
  const p = (x) => String(x).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** دقیقهٔ بازی امروز. */
export function todayMinutes() {
  return read().playLog[today()] || 0;
}

/** ثبت زمان بازی. با هر پایان درس صدا زده می‌شود. */
export function addPlayTime(minutes) {
  const s = read();
  const log = { ...s.playLog };
  const key = today();
  log[key] = Math.round(((log[key] || 0) + minutes) * 10) / 10;
  // فقط ۳۰ روز اخیر نگه داشته می‌شود؛ حافظهٔ دستگاه بی‌جهت پر نشود.
  const keys = Object.keys(log).sort();
  while (keys.length > 30) delete log[keys.shift()];
  return write({ ...s, playLog: log });
}

export function setDailyLimit(minutes) {
  const s = read();
  return write({ ...s, dailyLimitMin: Math.max(0, Math.min(180, minutes | 0)) });
}

/** آیا سهم امروز تمام شده؟ */
export function limitReached() {
  const s = read();
  if (!s.dailyLimitMin) return false;
  return todayMinutes() >= s.dailyLimitMin;
}

/** گزارش هفت روز اخیر برای نمودار پنل والدین. */
export function weekLog() {
  const s = read();
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const p = (x) => String(x).padStart(2, '0');
    const key = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
    out.push({ key, minutes: s.playLog[key] || 0, day: d.getDay() });
  }
  return out;
}

/** پشتیبان‌گیری — والد می‌تواند پیشرفت را نگه دارد. */
export function exportData() {
  return JSON.stringify(read(), null, 2);
}

export function importData(json) {
  try {
    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object') return false;
    write({ ...EMPTY, ...parsed });
    return true;
  } catch {
    return false;
  }
}
