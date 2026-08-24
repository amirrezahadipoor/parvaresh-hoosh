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
  {
    id: 'life-solve-01',
    domain: 'life',
    order: 9,
    title: 'مشکل را حل کن',
    goal: 'کودک برای موقعیت‌های روزمره بهترین کار را انتخاب می‌کند.',
    minutes: 5,
    parentNote:
      'این درس «تصمیم‌گیری مسئولانه» از چارچوب CASEL است. هر موقعیت یک پاسخ آشکارا بهتر دارد. در خانه هم همین را بازی کنید: «اگر... چه کار می‌کنی؟»',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'problem-solve', prompt: 'کِی باید «{b}»؟' },
      { kind: 'problem-solve', prompt: 'کِی باید «{b}»؟' },
      { kind: 'problem-solve', prompt: 'کِی باید «{b}»؟' },
      { kind: 'problem-solve', prompt: 'کِی باید «{b}»؟' },
      { kind: 'good-habit', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'safe-pick', want: 'hazard', prompt: 'کدام خطرناک است؟' },
    ],
  },
  {
    id: 'life-calm-02',
    domain: 'life',
    order: 10,
    title: 'آرام شدن ۲',
    goal: 'کودک برای هر حس سخت، راهی برای آرام شدن می‌شناسد.',
    minutes: 5,
    parentNote:
      'کودک باید بداند حس بد اشکالی ندارد و می‌شود کاری برایش کرد. نفس عمیق را در لحظهٔ آرامش تمرین کنید، نه وسط عصبانیت — آن موقع دیر است.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'feeling-fix', prompt: 'کِی «{m}»؟' },
      { kind: 'feeling-fix', prompt: 'کِی «{m}»؟' },
      { kind: 'feeling-fix', prompt: 'کِی «{m}»؟' },
      { kind: 'feeling-fix', prompt: 'کِی «{m}»؟' },
      { kind: 'name-face', prompt: 'این چه حسی است؟' },
      { kind: 'feel-face', prompt: 'چه حسی پیدا می‌کند؟' },
    ],
  },
  {
    id: 'life-feel-03',
    domain: 'life',
    order: 11,
    title: 'حس‌ها را بشناس ۳',
    goal: 'کودک حس‌های بیشتری را روی صورت تشخیص می‌دهد و نام می‌برد.',
    minutes: 5,
    parentNote:
      'خواندن حالت صورت، پایهٔ همدلی است. جلوی آینه با هم شکلک بسازید و نامش را بگویید.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'name-face', prompt: 'این چه حسی است؟' },
      { kind: 'feel-face', prompt: 'چه حسی پیدا می‌کند؟' },
      { kind: 'name-face', prompt: 'این چه حسی است؟' },
      { kind: 'feel-face', prompt: 'چه حسی پیدا می‌کند؟' },
      { kind: 'name-face', prompt: 'این چه حسی است؟' },
      { kind: 'feel-face', prompt: 'چه حسی پیدا می‌کند؟' },
    ],
  },
  {
    id: 'life-safe-03',
    domain: 'life',
    order: 12,
    title: 'ایمنی در خانه',
    goal: 'کودک چیزهای خطرناک خانه را می‌شناسد و می‌داند چه کند.',
    minutes: 5,
    parentNote:
      'هدف ترساندن نیست، آگاه کردن است. به‌جای «دست نزن!»، بگویید «این برای بزرگ‌ترهاست». کودکی که دلیل را بداند، بهتر رعایت می‌کند.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'safe-pick', want: 'hazard', prompt: 'کدام خطرناک است؟' },
      { kind: 'safe-pick', want: 'safe', prompt: 'کدام بی‌خطر است؟' },
      { kind: 'safe-pick', want: 'hazard', prompt: 'کدام خطرناک است؟' },
      { kind: 'safe-pick', want: 'safe', prompt: 'کدام بی‌خطر است؟' },
      { kind: 'problem-solve', prompt: 'کِی باید «{b}»؟' },
      { kind: 'safety-order', prompt: 'به ترتیب بچین' },
    ],
  },
  {
    id: 'life-habit-02',
    domain: 'life',
    order: 13,
    title: 'عادت‌های خوب ۲',
    goal: 'کودک عادت‌های بهداشتی روزانه را تمرین می‌کند.',
    minutes: 5,
    parentNote:
      'عادت با تکرار ساخته می‌شود نه با توضیح. مسواک و شستن دست را به یک زمان ثابت روز گره بزنید.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'good-habit', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'good-habit', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'good-habit', pool: 'kind', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'good-habit', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'problem-solve', prompt: 'کِی باید «{b}»؟' },
      { kind: 'good-habit', pool: 'kind', prompt: 'کدام برای تو خوب است؟' },
    ],
  },
  {
    id: 'life-kind-02',
    domain: 'life',
    order: 14,
    title: 'مهربان باش ۲',
    goal: 'کودک رفتارهای مهربانانه را در موقعیت‌های تازه تشخیص می‌دهد.',
    minutes: 5,
    parentNote:
      'مهربانی آموختنی است. وقتی کودک کار مهربانانه‌ای کرد، دقیقاً همان کار را نام ببرید: «دیدم اسباب‌بازی‌ات را دادی» — این از «آفرین» خیلی مؤثرتر است.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'good-habit', pool: 'kind', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'good-habit', pool: 'kind', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'feel-face', prompt: 'چه حسی پیدا می‌کند؟' },
      { kind: 'problem-solve', prompt: 'کِی باید «{b}»؟' },
      { kind: 'good-habit', pool: 'kind', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'name-face', prompt: 'این چه حسی است؟' },
    ],
  },
  {
    id: 'life-body-01',
    domain: 'life',
    order: 15,
    title: 'بدن من مال من است',
    goal: 'کودک می‌فهمد بدنش مال خودش است و می‌تواند «نه» بگوید.',
    minutes: 5,
    parentNote:
      'بر پایهٔ راهنمای رسمی مهارت زندگی سازمان بهزیستی: کودک باید بداند بدنش مال خودش است، «نه» گفتن حق اوست، و اگر چیزی ناراحتش کرد باید به بزرگ‌ترِ مطمئن بگوید — حتی اگر قول داده باشد نگوید.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'problem-solve', prompt: 'کِی باید «{b}»؟' },
      { kind: 'problem-solve', prompt: 'کِی باید «{b}»؟' },
      { kind: 'safety-order', prompt: 'به ترتیب بچین' },
      { kind: 'feeling-fix', prompt: 'کِی «{m}»؟' },
      { kind: 'name-face', prompt: 'این چه حسی است؟' },
      { kind: 'problem-solve', prompt: 'کِی باید «{b}»؟' },
    ],
  },
  {
    id: 'life-order-02',
    domain: 'life',
    order: 16,
    title: 'به ترتیب انجام بده',
    goal: 'کودک کارهای چندمرحله‌ای را به ترتیب درست می‌چیند.',
    minutes: 5,
    parentNote:
      'دنبال کردن دستور چندمرحله‌ای، مهارت اجرایی مهمی است که مستقیم به آمادگی مدرسه ربط دارد. در خانه دستور دو مرحله‌ای بدهید و کم‌کم سه مرحله‌ای.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'safety-order', prompt: 'به ترتیب بچین' },
      { kind: 'safety-order', prompt: 'به ترتیب بچین' },
      { kind: 'safety-order', prompt: 'به ترتیب بچین' },
      { kind: 'problem-solve', prompt: 'کِی باید «{b}»؟' },
      { kind: 'good-habit', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'feeling-fix', prompt: 'کِی «{m}»؟' },
    ],
  },
  {
    id: 'life-feel-04',
    domain: 'life',
    order: 17,
    title: 'حس دیگران',
    goal: 'کودک حس دیگران را از موقعیت حدس می‌زند.',
    minutes: 5,
    parentNote:
      'همدلی یعنی فهمیدن اینکه دیگری چه حسی دارد — حتی وقتی با حس خودمان فرق دارد. موقع کتاب خواندن بپرسید «الان این شخصیت چه حسی دارد؟»',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'feel-face', prompt: 'چه حسی پیدا می‌کند؟' },
      { kind: 'feel-face', prompt: 'چه حسی پیدا می‌کند؟' },
      { kind: 'name-face', prompt: 'این چه حسی است؟' },
      { kind: 'feeling-fix', prompt: 'کِی «{m}»؟' },
      { kind: 'feel-face', prompt: 'چه حسی پیدا می‌کند؟' },
      { kind: 'problem-solve', prompt: 'کِی باید «{b}»؟' },
    ],
  },
  {
    id: 'life-day-02',
    domain: 'life',
    order: 18,
    title: 'یک روز کامل ۲',
    goal: 'کودک برنامهٔ روزانه‌اش را به ترتیب می‌چیند.',
    minutes: 5,
    parentNote:
      'برنامهٔ قابل پیش‌بینی به کودک احساس امنیت می‌دهد. یک تابلوی تصویری از کارهای روز بسازید و بگذارید خودش تیک بزند.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'safety-order', prompt: 'به ترتیب بچین' },
      { kind: 'good-habit', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'safety-order', prompt: 'به ترتیب بچین' },
      { kind: 'problem-solve', prompt: 'کِی باید «{b}»؟' },
      { kind: 'feeling-fix', prompt: 'کِی «{m}»؟' },
      { kind: 'good-habit', pool: 'kind', prompt: 'کدام برای تو خوب است؟' },
    ],
  },
  {
    id: 'life-mixed-02',
    domain: 'life',
    order: 19,
    title: 'مهارت‌های من ۲',
    goal: 'کودک همهٔ مهارت‌های زندگی‌اش را به‌صورت درهم مرور می‌کند.',
    minutes: 5,
    parentNote:
      'مرور درهم: حس، ایمنی، عادت و تصمیم با هم می‌آیند.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'feeling-fix', prompt: 'کِی «{m}»؟' },
      { kind: 'problem-solve', prompt: 'کِی باید «{b}»؟' },
      { kind: 'safe-pick', want: 'hazard', prompt: 'کدام خطرناک است؟' },
      { kind: 'good-habit', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'name-face', prompt: 'این چه حسی است؟' },
      { kind: 'safety-order', prompt: 'به ترتیب بچین' },
    ],
  },
  {
    id: 'life-mixed-03',
    domain: 'life',
    order: 20,
    title: 'مهارت‌های پایانی',
    goal: 'کودک همهٔ نوزده درس مهارت زندگی را در یک درس پایانی مرور می‌کند.',
    minutes: 7,
    parentNote:
      'درس پایانی مهارت زندگی. مهم‌ترین چیزی که کودک باید از این حوزه ببرد: حس بد اشکالی ندارد، «نه» گفتن حق توست، و همیشه یک بزرگ‌ترِ مطمئن هست که می‌شود به او گفت.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'problem-solve', prompt: 'کِی باید «{b}»؟' },
      { kind: 'feeling-fix', prompt: 'کِی «{m}»؟' },
      { kind: 'safe-pick', want: 'safe', prompt: 'کدام بی‌خطر است؟' },
      { kind: 'good-habit', pool: 'kind', prompt: 'کدام برای تو خوب است؟' },
      { kind: 'feel-face', prompt: 'چه حسی پیدا می‌کند؟' },
      { kind: 'safety-order', prompt: 'به ترتیب بچین' },
    ],
  },
];
