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
    rounds: [
      { kind: 'en-word-pic', prompt: 'این چیست؟ واژهٔ انگلیسی را پیدا کن.' },
      { kind: 'en-word-pic', prompt: 'این چیست؟ واژهٔ انگلیسی را پیدا کن.' },
      { kind: 'en-pic-word', prompt: '{w} کدام است؟' },
      { kind: 'en-word-pic', prompt: 'این چیست؟ واژهٔ انگلیسی را پیدا کن.' },
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
    rounds: [
      { kind: 'en-cvc', prompt: 'کدام واژه به خانوادهٔ {r} تعلق دارد؟' },
      { kind: 'en-cvc', prompt: 'کدام واژه به خانوادهٔ {r} تعلق دارد؟' },
      { kind: 'en-cvc', prompt: 'کدام واژه به خانوادهٔ {r} تعلق دارد؟' },
      { kind: 'en-cvc', prompt: 'کدام واژه به خانوادهٔ {r} تعلق دارد؟' },
      { kind: 'en-cvc', prompt: 'کدام واژه به خانوادهٔ {r} تعلق دارد؟' },
      { kind: 'en-cvc', prompt: 'کدام واژه به خانوادهٔ {r} تعلق دارد؟' },
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
    rounds: [
      { kind: 'en-translate', prompt: '{w} یعنی چه؟' },
      { kind: 'en-translate', prompt: '{w} یعنی چه؟' },
      { kind: 'en-translate', prompt: '{w} یعنی چه؟' },
      { kind: 'en-translate', prompt: '{w} یعنی چه؟' },
      { kind: 'en-translate', prompt: '{w} یعنی چه؟' },
      { kind: 'en-translate', prompt: '{w} یعنی چه؟' },
    ],
  },
]);
