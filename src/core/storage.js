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

export function resetAll() {
  cache = { ...EMPTY, lessons: {} };
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* بی‌اهمیت */
  }
  return getState();
}
