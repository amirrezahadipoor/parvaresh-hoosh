// تسلط و تکرار فاصله‌دار.
//
// مسئله‌ای که حل می‌کند:
// کودک درسی را یک بار تمام می‌کند و دیگر هرگز نمی‌بیندش. ولی دانش
// بدون مرور فراموش می‌شود — «منحنی فراموشی». از سوی دیگر مرور بی‌هدفِ
// همه‌چیز، وقت کودک را هدر می‌دهد.
//
// راه‌حل متعارف: تکرار فاصله‌دار. هر درس پس از ۱، ۳ و ۷ روز مرور
// می‌شود (فیلد reviewDays که در ۳۴ درس وجود داشت ولی هرگز خوانده
// نمی‌شد — دادهٔ مرده بود).
//
// تصمیم مهم: مرور **جایگزین** درس تازه نمی‌شود، بلکه هرچند وقت یک بار
// بین درس‌های تازه می‌آید. کودکی که فقط مرور کند، حس پیشرفت را از دست
// می‌دهد؛ و پیشرفت، انگیزهٔ درونی است.

import { LESSONS } from '../data/lessons/index.js';
import * as store from './storage.js';

const DAY_MS = 24 * 60 * 60 * 1000;

/** فاصله‌های پیش‌فرض، اگر درسی reviewDays نداشته باشد. */
const DEFAULT_REVIEW_DAYS = [1, 3, 7];

/** آستانهٔ تسلط: زیر این نمره، درس هنوز جا نیفتاده است. */
export const MASTERY_SCORE = 80;

/** چند روز از آخرین بازیِ این درس گذشته؟ null یعنی هرگز بازی نشده. */
export function daysSince(lessonId) {
  const p = store.lessonProgress(lessonId);
  if (!p.lastPlayed) return null;
  const t = Date.parse(p.lastPlayed);
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / DAY_MS);
}

/**
 * آیا این درس الان سررسید مرور است؟
 *
 * درس در دو حالت مرور می‌خواهد:
 *   ۱. نمره‌اش زیر آستانهٔ تسلط است → هر روز پس از یک روز.
 *   ۲. مسلط شده ولی به یکی از نقطه‌های فاصله‌دار رسیده (۱، ۳، ۷ روز).
 */
export function isDue(lessonId) {
  const p = store.lessonProgress(lessonId);
  if (!p.completions) return false; // هنوز بازی نشده — مرور معنا ندارد
  const d = daysSince(lessonId);
  if (d === null) return false;

  if (p.bestScore < MASTERY_SCORE) return d >= 1;

  const lesson = LESSONS.find((l) => l.id === lessonId);
  const days = lesson?.reviewDays?.length ? lesson.reviewDays : DEFAULT_REVIEW_DAYS;
  const last = days[days.length - 1];
  // پس از آخرین نقطه، هر «last» روز یک بار مرور سبک ادامه می‌یابد.
  if (d > last) return d % last === 0;
  return days.includes(d);
}

/** همهٔ درس‌هایی که الان سررسید مرورند، ضعیف‌ترین اول. */
export function dueLessons() {
  return LESSONS.filter((l) => isDue(l.id)).sort(
    (a, b) => store.lessonProgress(a.id).bestScore - store.lessonProgress(b.id).bestScore,
  );
}

/**
 * آیا نوبت یک مرور است؟
 *
 * قاعده: پس از هر ۳ درس تازه، اگر مروری سررسید باشد، یکی می‌آید.
 * این نسبت عمدی است — مرور نباید جای پیشرفت را بگیرد.
 */
export function shouldReviewNow() {
  const due = dueLessons();
  if (!due.length) return null;
  const completed = LESSONS.filter((l) => store.isCompleted(l.id)).length;
  return completed > 0 && completed % 3 === 0 ? due[0] : null;
}

/** خلاصهٔ تسلط برای پنل والدین. */
export function masterySummary() {
  const played = LESSONS.filter((l) => store.lessonProgress(l.id).completions > 0);
  const mastered = played.filter((l) => store.lessonProgress(l.id).bestScore >= MASTERY_SCORE);
  const weak = played
    .filter((l) => store.lessonProgress(l.id).bestScore < MASTERY_SCORE)
    .sort((a, b) => store.lessonProgress(a.id).bestScore - store.lessonProgress(b.id).bestScore)
    .slice(0, 3)
    .map((l) => ({ title: l.title, score: store.lessonProgress(l.id).bestScore }));
  return {
    played: played.length,
    mastered: mastered.length,
    due: dueLessons().length,
    weak,
  };
}

/** بررسی سلامت — اعتبارسنج استفاده می‌کند. */
export function auditReviewData() {
  const problems = [];
  for (const l of LESSONS) {
    if (!l.reviewDays) continue;
    if (!Array.isArray(l.reviewDays) || !l.reviewDays.length) {
      problems.push(`${l.id}: reviewDays باید آرایهٔ ناتهی باشد`);
      continue;
    }
    const bad = l.reviewDays.filter((d) => !Number.isInteger(d) || d < 1 || d > 60);
    if (bad.length) problems.push(`${l.id}: فاصلهٔ نامعتبر ${bad.join('، ')}`);
    const sorted = l.reviewDays.every((d, i, a) => i === 0 || a[i - 1] < d);
    if (!sorted) problems.push(`${l.id}: reviewDays باید صعودی باشد`);
  }
  return problems;
}
