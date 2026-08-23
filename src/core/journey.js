// سفر — مسیر یکپارچهٔ یادگیری.
//
// چرا این فایل وجود دارد:
// در طرح قبلی کودک باید دو بار تصمیم می‌گرفت تا به بازی برسد: اول حوزه،
// بعد درس. برای کودک ۵ ساله این دو تپ، دو مانع‌اند نه دو امکان. او
// نمی‌خواهد از میان ۲۳ درس انتخاب کند؛ می‌خواهد بازی کند. انتخاب زیاد
// همان شلوغی است با ظاهر تازه.
//
// پس برنامه خودش تصمیم می‌گیرد: یک دکمه، و بازی شروع می‌شود.
// فهرست کامل درس‌ها از بین نمی‌رود — در «نقشهٔ سفر» یک‌جا دیده می‌شود،
// ولی برای مرور و انتخاب دلخواه است، نه مسیر اصلی.
//
// ترتیب مسیر از الگوی Khan Academy Kids می‌آید: مسیر یادگیری بین
// حوزه‌ها می‌چرخد تا تنوع حفظ شود، به‌جای اینکه ده درس خواندن پشت هم بیاید.

import { DOMAINS } from '../data/curriculum.js';
import { lessonsByDomain, LESSONS } from '../data/lessons/index.js';
import * as store from './storage.js';

/**
 * ترتیب سراسری درس‌ها: حوزه‌ها در هم بافته می‌شوند.
 *
 * روش: هر درس در حوزهٔ خودش یک «موقعیت نسبی» بین ۰ و ۱ می‌گیرد
 * ‎((i + ۰٫۵) / تعداد)‎ و همهٔ درس‌ها بر اساس آن مرتب می‌شوند. نتیجه این است
 * که حوزهٔ پرتعدادتر (خواندن، ۱۰ درس) بیشتر ظاهر می‌شود ولی هیچ حوزه‌ای
 * پشت سر هم تلنبار نمی‌شود — بدون آنکه ترتیب داخلی هیچ حوزه‌ای به هم بخورد.
 *
 * قطعی است: خروجی همیشه یکسان است، پس پیشرفت کودک معنا دارد.
 */
function buildSequence() {
  const marked = [];
  DOMAINS.forEach((d, di) => {
    const list = lessonsByDomain(d.id);
    list.forEach((lesson, i) => {
      marked.push({
        lesson,
        domainId: d.id,
        // موقعیت نسبی؛ di فقط برای شکستن تساوی به‌شکل قطعی است
        pos: (i + 0.5) / list.length,
        di,
        i,
      });
    });
  });
  marked.sort((a, b) => a.pos - b.pos || a.di - b.di || a.i - b.i);
  return marked.map((m, order) => ({ ...m, order }));
}

/** مسیر کامل: آرایه‌ای از { lesson, domainId, order }. */
export const SEQUENCE = Object.freeze(buildSequence());

/** درس را در مسیر پیدا می‌کند. */
export function stepOf(lessonId) {
  return SEQUENCE.find((s) => s.lesson.id === lessonId) || null;
}

/**
 * قدم بعدی: نخستین درس انجام‌نشده در مسیر.
 * اگر همه تمام شده باشند، ضعیف‌ترین نتیجه برای مرور برمی‌گردد
 * تا مسیر هیچ‌وقت به بن‌بست «دیگر کاری نیست» نرسد.
 */
export function nextStep() {
  const fresh = SEQUENCE.find((s) => !store.isCompleted(s.lesson.id));
  if (fresh) return { step: fresh, mode: 'new' };

  let weakest = SEQUENCE[0];
  let low = Infinity;
  for (const s of SEQUENCE) {
    const score = store.lessonProgress(s.lesson.id).bestScore ?? 0;
    if (score < low) {
      low = score;
      weakest = s;
    }
  }
  return { step: weakest, mode: 'review' };
}

/** درس پس از این یکی — برای زنجیرهٔ «ادامه» در پایان درس. */
export function stepAfter(lessonId) {
  const cur = stepOf(lessonId);
  if (!cur) return nextStep().step;
  const following = SEQUENCE.slice(cur.order + 1).find((s) => !store.isCompleted(s.lesson.id));
  return following || nextStep().step;
}

/**
 * آیا این درس هنوز قفل است؟
 *
 * قفلِ سفت (فقط یک درس بعدی) کودک را زندانی می‌کند: اگر امروز حالِ
 * خواندن ندارد و می‌خواهد بشمارد، نباید مجبور شود. از سوی دیگر باز
 * گذاشتنِ همه‌چیز، همان انتخاب فلج‌کنندهٔ قبلی است.
 *
 * راه میانه: نخستین درسِ *هر حوزه* همیشه باز است، و در هر حوزه یک قدم
 * جلوتر از پیشرفت کودک باز می‌شود. یعنی چهار در باز، نه بیست‌وسه در.
 */
export function isLocked(lessonId) {
  const s = stepOf(lessonId);
  if (!s) return true;
  if (store.isCompleted(s.lesson.id)) return false;

  // درون همان حوزه: چند درس انجام شده؟
  const inDomain = SEQUENCE.filter((x) => x.domainId === s.domainId);
  const idx = inDomain.findIndex((x) => x.lesson.id === lessonId);
  const doneInDomain = inDomain.filter((x) => store.isCompleted(x.lesson.id)).length;
  return idx > doneInDomain;
}

/** خلاصهٔ پیشرفت برای صفحهٔ خانه و پنل والدین. */
export function progress() {
  const total = SEQUENCE.length;
  const done = SEQUENCE.filter((s) => store.isCompleted(s.lesson.id)).length;
  const byDomain = DOMAINS.map((d) => {
    const list = lessonsByDomain(d.id);
    return {
      id: d.id,
      title: d.title,
      color: d.color,
      total: list.length,
      done: list.filter((l) => store.isCompleted(l.id)).length,
    };
  });
  return { total, done, percent: total ? Math.round((done / total) * 100) : 0, byDomain };
}

/** بررسی سلامت مسیر — اعتبارسنج از آن استفاده می‌کند. */
export function auditSequence() {
  const problems = [];
  if (SEQUENCE.length !== LESSONS.length) {
    problems.push(`مسیر ${SEQUENCE.length} درس دارد ولی ${LESSONS.length} درس وجود دارد`);
  }
  const seen = new Set();
  for (const s of SEQUENCE) {
    if (seen.has(s.lesson.id)) problems.push(`درس تکراری در مسیر: ${s.lesson.id}`);
    seen.add(s.lesson.id);
  }
  // ترتیب داخلی هر حوزه نباید به هم خورده باشد
  for (const d of DOMAINS) {
    const inPath = SEQUENCE.filter((s) => s.domainId === d.id).map((s) => s.lesson.id);
    const natural = lessonsByDomain(d.id).map((l) => l.id);
    if (inPath.join('|') !== natural.join('|')) {
      problems.push(`ترتیب درس‌های «${d.title}» در مسیر به هم خورده است`);
    }
  }
  // بیش از سه درس پشت‌سرهم از یک حوزه = تنوع کم
  let run = 1;
  for (let i = 1; i < SEQUENCE.length; i++) {
    if (SEQUENCE[i].domainId === SEQUENCE[i - 1].domainId) {
      run++;
      if (run > 3) {
        problems.push(`${run} درس پشت‌سرهم از «${SEQUENCE[i].domainId}» — تنوع مسیر کم است`);
        break;
      }
    } else run = 1;
  }
  return problems;
}
