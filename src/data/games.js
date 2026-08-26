// تعریف بازی‌های آزاد — جدا از مسیر درس.
//
// چرا این فایل وجود دارد:
// تا امروز همه‌چیز «درس» بود: شش گِرد، یک ستاره، تمام. ولی کودکی که
// خسته است یا فقط می‌خواهد بازی کند، درس نمی‌خواهد. بازی چیز دیگری
// است — بی‌پایان، امتیازی، بدون درس‌نامه و بدون قفل.
//
// ⚠ تصمیم معماریِ اصلی: بازی‌ها **هیچ محتوای تازه‌ای نمی‌سازند**.
// از همان ۹۸ نوع گِرد و ۲۱۸٬۲۸۰ ترکیبِ موجود تغذیه می‌کنند و فقط
// قالبِ دورشان فرق می‌کند. یعنی هر درسی که به برنامه اضافه شود،
// خودبه‌خود بازی‌ها را هم غنی‌تر می‌کند و هیچ‌جا محتوا تکرار
// نمی‌شود.
//
// قواعد (از نقشهٔ راه، بخش ۷.۴):
//  • بدون اقتصاد سکه — امتیاز فقط عددِ همان بازی است.
//  • بی‌صدا و بی‌خواندن قابل انجام باشد.
//  • محدودیت زمانِ روزانه شامل بازی هم می‌شود.
//  • در دسترس، ولی نه سرِ راه: مسیر یادگیری پیش‌فرض می‌ماند.
//  • هر بازی یک رنگ، یک نشان، یک هویت — دو کارت نباید فقط با
//    برچسب‌شان فرق کنند.
//
// ⚠ `about` اینجا عمداً نیست: دادهٔ مرده بود (هیچ‌جا رندر نمی‌شد —
// درسِ §۷.۱۳). هر افزودنیِ تازه به این فایل باید در رابط هم دیده
// شود یا اصلاً نوشته نشود.

/**
 * هر بازی می‌گوید از کدام نوع گِرد تغذیه کند.
 *
 * `kinds` عمداً فهرستِ صریح است، نه «همهٔ گِردها»:
 * ⚠ گِردهای چیدنی (order) و حافظه در قالبِ مسابقهٔ زمان‌دار خراب
 * می‌شوند — کودک وسط چیدن، وقت تمام می‌کند و حس بی‌عدالتی می‌گیرد.
 * پس فقط گِردهای تک‌ضربه‌ای در بازی‌های زمان‌دار می‌آیند
 * (`test:games` این را مکانیکی می‌سنجد).
 */
// ⚠ نشانِ هر بازی باید *یکتا* باشد. نخست «برجِ پاسخ» و «جفتِ کلمه»
// هر دو کتاب داشتند و در فهرست از هم تشخیص داده نمی‌شدند — کودکی که
// نمی‌خواند، فهرست را از روی شکل می‌شناسد.
export const GAMES = Object.freeze([
  {
    id: 'speed',
    title: 'مسابقهٔ سرعت',
    tagline: 'یک دقیقه، هرچه بیشتر!',
    color: '#E4572E',
    mode: 'timed',
    seconds: 60,
    penaltySec: 5,
    icon: 'ساعت',
    // ترکیبی از همهٔ حوزه‌ها — بازیِ «همه‌چیز».
    kinds: [
      'count-objects', 'subitize', 'compare-groups', 'compare-numbers',
      'add', 'sub', 'doubles', 'ten-frame', 'pick-number', 'next-number',
      'category', 'odd-one-out', 'trait', 'same-different',
      'shape-color', 'shape-corners', 'count-shapes',
    ],
  },
  {
    id: 'tower',
    title: 'برجِ پاسخ',
    tagline: 'تا کجا بالا می‌روی؟',
    color: '#2E86AB',
    mode: 'lives',
    lives: 3,
    icon: 'کوه',
    kinds: [
      'add', 'sub', 'doubles', 'fact-family', 'make-ten', 'missing-addend',
      'number-bond', 'between', 'next-number', 'skip-count', 'count-tens',
      'pattern-next', 'odd-one-out', 'and-rule', 'true-false', 'not-rule',
    ],
  },
  {
    id: 'wordmatch',
    title: 'جفتِ کلمه',
    tagline: 'کلمه را با تصویرش جفت کن',
    color: '#3D9A50',
    mode: 'timed',
    seconds: 60,
    penaltySec: 5,
    icon: 'کتاب',
    kinds: ['word-pic', 'pic-word', 'letter-in-word', 'rhyme-pick', 'first-sound', 'sentence-pic'],
  },
  {
    id: 'memory',
    title: 'حافظهٔ بزرگ',
    tagline: 'هر مرحله سخت‌تر',
    color: '#7B4B94',
    mode: 'levels',
    icon: 'ستاره',
    // ⚠ این بازی زمان‌دار نیست، پس گِرد حافظه اینجا مشکلی ندارد.
    // مرحله‌ها با `pairs` بالا می‌روند، نه با سرعت.
    levels: [3, 4, 5, 6, 7, 8],
    kinds: ['memory-pairs'],
  },
  {
    id: 'count',
    title: 'سرعتِ شمارش',
    tagline: 'بشمار، قبل از تمام‌شدن وقت!',
    color: '#E08A1E',
    mode: 'timed',
    seconds: 60,
    penaltySec: 5,
    icon: 'توپ',
    // شمارشِ خالص: تشخیصِ فوریِ تعداد، بدون خواندن و بدون جمع.
    kinds: [
      'subitize', 'count-objects', 'count-shapes', 'count-tens', 'tally',
      'ten-frame', 'place-value', 'pick-number', 'next-number', 'compare-groups',
    ],
  },
  {
    id: 'nature',
    title: 'طبیعت‌گرد',
    tagline: 'به دنیای دور و برت نگاه کن',
    color: '#5C6BC0',
    mode: 'timed',
    seconds: 60,
    penaltySec: 5,
    icon: 'درخت',
    // مشاهدهٔ علمی: سایه، جنس، جانور، زیستگاه، فصل و آب‌وهوا.
    kinds: [
      'shadow', 'light-shadow', 'made-of', 'living', 'habitat', 'needs',
      'sense', 'weather-name', 'season', 'float-sink',
    ],
  },
  {
    id: 'pattern',
    title: 'الگوی بعدی',
    tagline: 'بعدی کدام است؟',
    color: '#00897B',
    mode: 'timed',
    seconds: 60,
    penaltySec: 5,
    icon: 'گل',
    // منطقِ دیداری: ادامهٔ الگو، تفاوت، طبقه‌بندی و قاعده.
    kinds: [
      'pattern-next', 'pattern-make', 'odd-one-out', 'same-different',
      'shape-color', 'two-rule', 'not-rule', 'between', 'category', 'trait',
    ],
  },
]);

/** یک بازی را با شناسه پیدا می‌کند. */
export function gameById(id) {
  return GAMES.find((g) => g.id === id) || null;
}
