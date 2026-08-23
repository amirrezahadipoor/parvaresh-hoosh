// درس‌های مهارت زندگی — احساس، ایمنی، بهداشت و مهربانی.
//
// چرا این حوزه وجود دارد:
//   والدی که برای کودک ۵ تا ۸ ساله برنامه می‌خرد، فقط «خواندن و
//   ریاضی» نمی‌خواهد؛ می‌خواهد کودکش بلد باشد بگوید ناراحت است،
//   دستش را بشوید، و اگر کسی اذیتش کرد به او خبر بدهد.
//
// ترتیب درس‌ها از برنامه‌های معتبر سِل (SEL) گرفته شده است:
//   ۱. شناختن احساس (خودآگاهی)
//   ۲. آرام‌کردن خود (مدیریت هیجان)
//   ۳. فهمیدن حس دیگری (همدلی)
//   ۴. ایمنی — چیزهای خطرناک
//   ۵. ایمنی شخصی — «نه، برو، بگو»
//   ۶. بهداشت فردی
//   ۷. مهربانی و نوبت
//   ۸. حل مسئله
// این همان توالیِ چارچوب CASEL و برنامهٔ Second Step است: اول کودک
// باید حسِ خودش را بشناسد، بعد بتواند مدیریتش کند، و تنها بعد از آن
// می‌تواند حسِ دیگری را بفهمد. جابه‌جا کردن این ترتیب کار نمی‌کند.
//
// نکتهٔ مهم دربارهٔ ایمنی شخصی: فرمول «نه، برو، بگو» عیناً از راهنمای
// رسمی مهارت زندگی سازمان بهزیستی آمده و در درس ۵ هم تمرین و هم در
// یادداشت والد توضیح داده شده است — چون این درسی است که کودک باید
// بیرون از برنامه، با والدش، دوباره مرور کند.
//
// همهٔ گِردها بدون خواندن و بدون صدا حل می‌شوند: موقعیت تصویر است،
// پاسخ هم تصویر.

export const LIFE_LESSONS = [
  {
    id: 'life-emotion-01',
    domain: 'life',
    order: 1,
    title: 'حس‌ها را بشناس',
    goal: 'کودک چهار حس پایه را از روی چهره تشخیص می‌دهد و نام می‌برد.',
    minutes: 5,
    parentNote:
      'سر شام از کودک بپرسید «امروز چه حسی داشتی؟». اگر واژه‌اش را نداشت، شما نام ببرید: «انگار خسته‌ای».',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'name-face', emotion: 'شاد', prompt: 'او چه حسی دارد؟' },
      { kind: 'name-face', emotion: 'غمگین', prompt: 'او چه حسی دارد؟' },
      { kind: 'name-face', emotion: 'عصبانی', prompt: 'او چه حسی دارد؟' },
      { kind: 'name-face', emotion: 'ترسیده', prompt: 'او چه حسی دارد؟' },
      { kind: 'name-face', prompt: 'او چه حسی دارد؟' },
      { kind: 'name-face', prompt: 'او چه حسی دارد؟' },
    ],
  },
  {
    id: 'life-emotion-02',
    domain: 'life',
    order: 2,
    title: 'چه حسی پیدا می‌کند؟',
    goal: 'کودک حس را به موقعیت وصل می‌کند، نه فقط به چهره.',
    minutes: 5,
    parentNote:
      'وقتی کتاب می‌خوانید، وسط داستان بایستید و بپرسید «حالا او چه حسی دارد؟». این تمرین همان مهارت است.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'feel-face', situation: 'هدیه', prompt: 'او چه حسی دارد؟' },
      { kind: 'feel-face', situation: 'برج‌خراب', prompt: 'او چه حسی دارد؟' },
      { kind: 'feel-face', situation: 'اتاق‌تاریک', prompt: 'او چه حسی دارد؟' },
      { kind: 'feel-face', situation: 'بستنی‌افتاده', prompt: 'او چه حسی دارد؟' },
      { kind: 'feel-face', situation: 'رعدوبرق', prompt: 'او چه حسی دارد؟' },
      { kind: 'feel-face', situation: 'باغچه‌آرام', prompt: 'او چه حسی دارد؟' },
    ],
  },
  {
    id: 'life-calm-01',
    domain: 'life',
    order: 3,
    title: 'آرام شدن',
    goal: 'کودک می‌داند وقتی عصبانی یا ترسیده است، نفس عمیق کمکش می‌کند.',
    minutes: 5,
    parentNote:
      'نفس عمیق را با هم تمرین کنید: دست روی شکم، چهار شماره دم، چهار شماره بازدم. در لحظهٔ آرامش تمرین کنید، نه وسط دعوا.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'name-face', emotion: 'آرام', prompt: 'او چه حسی دارد؟' },
      { kind: 'good-habit', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'name-face', emotion: 'عصبانی', prompt: 'او چه حسی دارد؟' },
      { kind: 'feel-face', situation: 'باغچه‌آرام', prompt: 'او چه حسی دارد؟' },
      { kind: 'name-face', emotion: 'خسته', prompt: 'او چه حسی دارد؟' },
      { kind: 'good-habit', prompt: 'کدام برای تو خوب است؟' },
    ],
  },
  {
    id: 'life-safety-01',
    domain: 'life',
    order: 4,
    title: 'خطرناک یا بی‌خطر؟',
    goal: 'کودک چیزهای خطرناک خانه را می‌شناسد و دست نمی‌زند.',
    minutes: 5,
    parentNote:
      'در خانه با هم بگردید و خطرها را نشان دهید: پریز، چاقو، دارو، کبریت. قانون ساده است — دست نزن، به من بگو.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'safe-pick', want: 'hazard', prompt: 'کدام خطرناک است؟' },
      { kind: 'safe-pick', want: 'hazard', prompt: 'کدام خطرناک است؟' },
      { kind: 'safe-pick', want: 'safe', prompt: 'کدام بی‌خطر است؟' },
      { kind: 'safe-pick', want: 'hazard', prompt: 'کدام خطرناک است؟' },
      { kind: 'safe-pick', want: 'safe', prompt: 'کدام بی‌خطر است؟' },
      { kind: 'safe-pick', want: 'hazard', prompt: 'کدام خطرناک است؟' },
    ],
  },
  {
    id: 'life-safety-02',
    domain: 'life',
    order: 5,
    title: 'نه، برو، بگو',
    goal: 'کودک سه گام ایمنی شخصی را به ترتیب می‌داند.',
    minutes: 6,
    parentNote:
      'مهم‌ترین درس این بخش. بدن کودک مال خودش است و هیچ‌کس بدون اجازه‌اش حق لمس آن را ندارد. سه گام را با او تمرین کنید: «نه» بگو، از آنجا دور شو، و به یک بزرگ‌ترِ مورد اعتماد بگو. با هم فهرستی از آدم‌های امن بسازید و به کودک بگویید هر وقت چیزی ناراحتش کرد، حتی اگر قول داده باشد که نگوید، باید به شما بگوید.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'safety-order', prompt: 'سه کار را به ترتیب بچین.' },
      { kind: 'name-face', emotion: 'ترسیده', prompt: 'او چه حسی دارد؟' },
      { kind: 'safety-order', prompt: 'سه کار را به ترتیب بچین.' },
      { kind: 'safe-pick', want: 'hazard', prompt: 'کدام خطرناک است؟' },
      { kind: 'safety-order', prompt: 'سه کار را به ترتیب بچین.' },
    ],
  },
  {
    id: 'life-hygiene-01',
    domain: 'life',
    order: 6,
    title: 'مراقب خودم هستم',
    goal: 'کودک کارهای روزانهٔ بهداشت را می‌شناسد.',
    minutes: 5,
    parentNote:
      'شستن دست پیش از غذا و بعد از دستشویی، مسواک صبح و شب، دستمال هنگام عطسه. با بازی یاد بگیرد، نه با تذکر.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'good-habit', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'good-habit', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'good-habit', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'safe-pick', want: 'safe', prompt: 'کدام بی‌خطر است؟' },
      { kind: 'good-habit', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'good-habit', prompt: 'کدام برای تو خوب است؟' },
    ],
  },
  {
    id: 'life-kind-01',
    domain: 'life',
    order: 7,
    title: 'مهربان باش',
    goal: 'کودک کمک‌کردن و نوبت‌گرفتن را کارِ درست می‌داند.',
    minutes: 5,
    parentNote:
      'وقتی کودک کمک کرد یا نوبت داد، دقیقاً همان کار را نام ببرید: «صبر کردی تا نوبتت شود» — بهتر از «آفرین» کلی.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'good-habit', pool: 'kind', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'good-habit', pool: 'kind', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'feel-face', situation: 'هدیه', prompt: 'او چه حسی دارد؟' },
      { kind: 'good-habit', pool: 'kind', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'name-face', emotion: 'شاد', prompt: 'او چه حسی دارد؟' },
      { kind: 'good-habit', prompt: 'کدام برای تو خوب است؟' },
    ],
  },
  {
    id: 'life-mixed-01',
    domain: 'life',
    order: 8,
    title: 'یک روز کامل',
    goal: 'کودک آموخته‌های حس، ایمنی و بهداشت را با هم به کار می‌برد.',
    minutes: 6,
    parentNote:
      'این درس مرور است. اگر جایی مکث کرد، همان موضوع را در روزهای بعد در خانه تکرار کنید.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'feel-face', prompt: 'او چه حسی دارد؟' },
      { kind: 'good-habit', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'safe-pick', want: 'hazard', prompt: 'کدام خطرناک است؟' },
      { kind: 'name-face', prompt: 'او چه حسی دارد؟' },
      { kind: 'safety-order', prompt: 'سه کار را به ترتیب بچین.' },
      { kind: 'good-habit', pool: 'kind', prompt: 'کدام برای تو خوب است؟' },
    ],
  },
];
