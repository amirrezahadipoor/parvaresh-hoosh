// درس‌های انگلیسی — از فهرست Dolch و خانواده‌های واژگانی CVC.
//
// چیدمان آموزشی (از منابع بین‌المللی):
//   ۱. الفبا + نمونه‌واژهٔ تصویری  → شناخت شکل حرف
//   ۲. واژگان تصویری موضوعی        → معنا پیش از هجی
//   ۳. رنگ و عدد                    → واژه‌هایی که خودشان دیدنی‌اند
//   ۴. خانواده‌های CVC              → کشف الگوی آوایی
//   ۵. تطبیق دوزبانه                → پل بین فارسی و انگلیسی
//
// قید: هیچ گِردی به صدا وابسته نیست (کلیپ انگلیسی نداریم).

export const ENGLISH_LESSONS = Object.freeze([
  {
    id: 'en-abc-01',
    domain: 'english',
    order: 1,
    goal: 'کودک شکل حرف‌های بزرگ و کوچک انگلیسی را می‌شناسد و به تصویر واژهٔ متناظر وصل می‌کند.',
    title: 'حرف‌های انگلیسی',
    minutes: 5,
    parentNote:
      'کودک شکل حرف بزرگ و کوچک انگلیسی را با تصویر واژه‌ای که با آن حرف شروع می‌شود می‌بیند. هنوز هجی‌کردن مطرح نیست؛ هدف آشنایی چشم با شکل حروف است.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'en-letter-pic', prompt: 'کدام تصویر با حرف {L} شروع می‌شود؟' },
      { kind: 'en-letter-pic', prompt: 'کدام تصویر با حرف {L} شروع می‌شود؟' },
      { kind: 'en-letter-pic', prompt: 'کدام تصویر با حرف {L} شروع می‌شود؟' },
      { kind: 'en-letter-pic', prompt: 'کدام تصویر با حرف {L} شروع می‌شود؟' },
      { kind: 'en-letter-pic', prompt: 'کدام تصویر با حرف {L} شروع می‌شود؟' },
      { kind: 'en-letter-pic', prompt: 'کدام تصویر با حرف {L} شروع می‌شود؟' },
    ],
  },
  {
    id: 'en-words-01',
    domain: 'english',
    order: 2,
    goal: 'کودک هفده واژهٔ پایهٔ انگلیسی را از راه تصویر می‌شناسد، بدون ترجمه.',
    title: 'اولین واژه‌ها',
    minutes: 5,
    parentNote:
      'واژه‌های پایه‌ای که همه تصویر دارند. کودک معنا را از تصویر می‌گیرد، نه از ترجمه — همان روشی که زبان مادری را یاد گرفت.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'en-word-pic', prompt: 'این چیست؟' },
      { kind: 'en-word-pic', prompt: 'این چیست؟' },
      { kind: 'en-pic-word', prompt: '{w} کدام است؟' },
      { kind: 'en-word-pic', prompt: 'این چیست؟' },
      { kind: 'en-pic-word', prompt: '{w} کدام است؟' },
      { kind: 'en-pic-word', prompt: '{w} کدام است؟' },
    ],
  },
  {
    id: 'en-colors-01',
    domain: 'english',
    order: 3,
    goal: 'کودک نام شش رنگ اصلی را به انگلیسی تشخیص می‌دهد.',
    title: 'رنگ‌ها به انگلیسی',
    minutes: 5,
    parentNote:
      'رنگ‌ها برای شروع زبان ایده‌آل‌اند: هم واژه‌اند هم دیدنی، پس نیازی به ترجمه ندارند.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'en-color', prompt: '{w} کدام رنگ است؟' },
      { kind: 'en-color', prompt: '{w} کدام رنگ است؟' },
      { kind: 'en-color', prompt: '{w} کدام رنگ است؟' },
      { kind: 'en-color', prompt: '{w} کدام رنگ است؟' },
      { kind: 'en-color', prompt: '{w} کدام رنگ است؟' },
      { kind: 'en-color', prompt: '{w} کدام رنگ است؟' },
    ],
  },
  {
    id: 'en-numbers-01',
    domain: 'english',
    order: 4,
    goal: 'کودک عددهای یک تا ده را به انگلیسی می‌شناسد و به مقدار وصل می‌کند.',
    title: 'شمردن به انگلیسی',
    minutes: 5,
    parentNote:
      'عددهای یک تا ده. چون کودک عدد را در ریاضی یاد گرفته، فقط نام تازه‌ای روی مفهوم آشنا می‌گذارد — بار شناختی کم.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'en-number', max: 5, prompt: '{w} یعنی چند؟' },
      { kind: 'en-number', max: 5, prompt: '{w} یعنی چند؟' },
      { kind: 'en-number', max: 10, prompt: '{w} یعنی چند؟' },
      { kind: 'en-number', max: 10, prompt: '{w} یعنی چند؟' },
      { kind: 'en-number', max: 10, prompt: '{w} یعنی چند؟' },
      { kind: 'en-number', max: 10, prompt: '{w} یعنی چند؟' },
    ],
  },
  {
    id: 'en-cvc-01',
    domain: 'english',
    order: 5,
    goal: 'کودک الگوی خانواده‌های واژگانی CVC را کشف می‌کند و واژهٔ هم‌خانواده را می‌یابد.',
    title: 'خانوادهٔ واژه‌ها',
    minutes: 6,
    parentNote:
      'خانواده‌های واژگانی CVC ستون فقرات آواشناسی انگلیسی‌اند: cat، bat، hat. کودک کشف می‌کند که با عوض کردن یک حرف، واژهٔ تازه می‌سازد.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'en-cvc', prompt: 'کدام‌یک {r} دارد؟' },
      { kind: 'en-cvc', prompt: 'کدام‌یک {r} دارد؟' },
      { kind: 'en-cvc', prompt: 'کدام‌یک {r} دارد؟' },
      { kind: 'en-cvc', prompt: 'کدام‌یک {r} دارد؟' },
      { kind: 'en-cvc', prompt: 'کدام‌یک {r} دارد؟' },
      { kind: 'en-cvc', prompt: 'کدام‌یک {r} دارد؟' },
    ],
  },
  {
    id: 'en-meaning-01',
    domain: 'english',
    order: 6,
    goal: 'کودک معنی فارسی واژه‌های پرکاربرد انگلیسی را تطبیق می‌دهد.',
    title: 'یعنی چه؟',
    minutes: 5,
    parentNote:
      'واژه‌های پرکاربرد فهرست Dolch که ۸۰٪ متن کتاب‌های کودک انگلیسی را می‌سازند. اینجا معنی فارسی را تطبیق می‌دهد.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'en-translate', prompt: '{w} یعنی چه؟' },
      { kind: 'en-translate', prompt: '{w} یعنی چه؟' },
      { kind: 'en-translate', prompt: '{w} یعنی چه؟' },
      { kind: 'en-translate', prompt: '{w} یعنی چه؟' },
      { kind: 'en-translate', prompt: '{w} یعنی چه؟' },
      { kind: 'en-translate', prompt: '{w} یعنی چه؟' },
    ],
  },
  // ── دستهٔ دوم: واژه‌های دیداری و ساخت واژه ────────────────────────
  // دادهٔ Dolch و خانواده‌های CVC از قبل در english.js بود ولی هیچ
  // درسی از آن استفاده نمی‌کرد — یعنی نیمی از سرمایهٔ این حوزه بی‌کار
  // مانده بود. این شش درس همان را به کار می‌گیرد.

  {
    id: 'en-sight-01',
    domain: 'english',
    order: 7,
    title: 'واژه‌های پرکاربرد',
    goal: 'کودک نخستین واژه‌های دیداری انگلیسی را می‌شناسد.',
    minutes: 6,
    parentNote:
      'واژه‌های دیداری (sight words) را نمی‌شود صدا کشید؛ باید مثل یک تصویر شناخته شوند. همین ۴۰ واژه حدود نیمی از متن کتاب‌های کودک انگلیسی را می‌سازند.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'en-translate', prompt: '{w} یعنی چه؟' },
      { kind: 'en-translate', prompt: '{w} یعنی چه؟' },
      { kind: 'en-sight-find', prompt: '«{w}» به انگلیسی کدام است؟' },
      { kind: 'en-translate', prompt: '{w} یعنی چه؟' },
      { kind: 'en-sight-find', prompt: '«{w}» به انگلیسی کدام است؟' },
      { kind: 'en-translate', prompt: '{w} یعنی چه؟' },
    ],
  },
  {
    id: 'en-sight-02',
    domain: 'english',
    order: 8,
    title: 'واژه‌ها را پیدا کن',
    goal: 'کودک از معنی فارسی به واژهٔ انگلیسی می‌رسد.',
    minutes: 6,
    parentNote:
      'شناختن با تولید یکی نیست: کودکی که «big» را می‌فهمد لزوماً نمی‌تواند از «بزرگ» به «big» برسد. هر دو جهت باید تمرین شود.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'en-sight-find', prompt: '«{w}» به انگلیسی کدام است؟' },
      { kind: 'en-sight-find', prompt: '«{w}» به انگلیسی کدام است؟' },
      { kind: 'en-sight-find', prompt: '«{w}» به انگلیسی کدام است؟' },
      { kind: 'en-translate', prompt: '{w} یعنی چه؟' },
      { kind: 'en-sight-find', prompt: '«{w}» به انگلیسی کدام است؟' },
      { kind: 'en-sight-find', prompt: '«{w}» به انگلیسی کدام است؟' },
    ],
  },
  {
    id: 'en-build-01',
    domain: 'english',
    order: 9,
    title: 'واژه بساز',
    goal: 'کودک با گذاشتن حرف اول، واژهٔ انگلیسی می‌سازد.',
    minutes: 6,
    parentNote:
      'این مهم‌ترین کشف آواشناسی است: با عوض کردن یک حرف، واژهٔ تازه ساخته می‌شود. cat ← bat ← hat. پژوهش نشان می‌دهد ترکیب (blending) پیش از تجزیه یاد گرفته می‌شود.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'en-rime-build', prompt: 'کدام حرف؟ {r}' },
      { kind: 'en-rime-build', prompt: 'کدام حرف؟ {r}' },
      { kind: 'en-cvc', prompt: 'کدام‌یک {r} دارد؟' },
      { kind: 'en-rime-build', prompt: 'کدام حرف؟ {r}' },
      { kind: 'en-cvc', prompt: 'کدام‌یک {r} دارد؟' },
      { kind: 'en-rime-build', prompt: 'کدام حرف؟ {r}' },
    ],
  },
  {
    id: 'en-abc-02',
    domain: 'english',
    order: 10,
    title: 'حرف‌ها و واژه‌ها',
    goal: 'کودک حرف آغازین واژه‌های انگلیسی را تشخیص می‌دهد.',
    minutes: 6,
    parentNote:
      'حرف انگلیسی دو شکل دارد (A و a) و کودک باید هر دو را یکی بداند. در نوشته‌های اطراف دنبال حرف‌ها بگردید.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'en-letter-pic', prompt: 'کدام تصویر با حرف {L} شروع می‌شود؟' },
      { kind: 'en-word-pic', prompt: 'این چیست؟' },
      { kind: 'en-letter-pic', prompt: 'کدام تصویر با حرف {L} شروع می‌شود؟' },
      { kind: 'en-pic-word', prompt: '{w} کدام است؟' },
      { kind: 'en-letter-pic', prompt: 'کدام تصویر با حرف {L} شروع می‌شود؟' },
      { kind: 'en-word-pic', prompt: 'این چیست؟' },
    ],
  },
  {
    id: 'en-words-02',
    domain: 'english',
    order: 11,
    title: 'واژه‌های بیشتر',
    goal: 'کودک دایرهٔ واژگان تصویری انگلیسی را گسترش می‌دهد.',
    minutes: 6,
    parentNote:
      'واژه‌ای که تصویر دارد در ذهن می‌ماند؛ واژه‌ای که فقط ترجمه شده، فراموش می‌شود. برای همین همهٔ واژه‌های این درس تصویر دارند.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'en-word-pic', prompt: 'این چیست؟' },
      { kind: 'en-pic-word', prompt: '{w} کدام است؟' },
      { kind: 'en-word-pic', prompt: 'این چیست؟' },
      { kind: 'en-pic-word', prompt: '{w} کدام است؟' },
      { kind: 'en-number', max: 10, prompt: '{w} یعنی چند؟' },
      { kind: 'en-color', prompt: '{w} کدام رنگ است؟' },
    ],
  },
  {
    id: 'en-mixed-01',
    domain: 'english',
    order: 12,
    title: 'همه‌چیز به انگلیسی',
    goal: 'کودک همهٔ آموخته‌های انگلیسی را در یک درس مرور می‌کند.',
    minutes: 7,
    parentNote:
      'درس مرور. انگلیسی این برنامه بدون صداست و کاملاً دیداری — پس تلفظ را شما بگویید تا کودک بشنود.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'en-translate', prompt: '{w} یعنی چه؟' },
      { kind: 'en-word-pic', prompt: 'این چیست؟' },
      { kind: 'en-rime-build', prompt: 'کدام حرف؟ {r}' },
      { kind: 'en-color', prompt: '{w} کدام رنگ است؟' },
      { kind: 'en-sight-find', prompt: '«{w}» به انگلیسی کدام است؟' },
      { kind: 'en-number', max: 10, prompt: '{w} یعنی چند؟' },
    ],
  },

]);