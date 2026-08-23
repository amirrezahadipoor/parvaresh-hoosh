// برنامهٔ درسی — تنها منبع حقیقت برای فهرست درس‌ها.
//
// قانون بنیادی این پروژه:
//   هر درسی که اینجا هست، محتوای واقعی دارد.
//   درس بدون محتوا اصلاً اینجا نوشته نمی‌شود.
//
// در نسخهٔ قبلی ۳۴۲ عنوان درس وجود داشت که ۲۰۰ تای آن هیچ محتوایی نداشت و
// موتور بازی جای آن‌ها را با محتوای ساختگی پر می‌کرد. آن الگو تکرار نمی‌شود:
// اعتبارسنج (scripts/validate.js) هر درس بدون محتوای کامل را مردود می‌کند.

export const TARGET_AGE = Object.freeze({
  min: 5,
  max: 8,
  label: '۵ تا ۸ سال',
});

// سه ردهٔ سنی واقعی. برخلاف نسخهٔ قبلی که ageTracks در هر ۱۴۲ درس
// بایت‌به‌بایت یکسان بود، اینجا هر رده پارامتر متفاوت دارد.
export const AGE_TRACKS = Object.freeze({
  early: Object.freeze({
    id: 'early',
    label: '۵ تا ۶ سال',
    optionCount: 2,
    hintDelayMs: 3000,
    maxNumber: 10,
    roundsPerLesson: 4,
  }),
  mid: Object.freeze({
    id: 'mid',
    label: '۶ تا ۷ سال',
    optionCount: 3,
    hintDelayMs: 4000,
    maxNumber: 20,
    roundsPerLesson: 5,
  }),
  school: Object.freeze({
    id: 'school',
    label: '۷ تا ۸ سال',
    optionCount: 4,
    hintDelayMs: 5500,
    maxNumber: 100,
    roundsPerLesson: 6,
  }),
});

export const TRACK_ORDER = Object.freeze(['early', 'mid', 'school']);

export const DOMAINS = Object.freeze([
  Object.freeze({
    id: 'reading',
    title: 'خواندن و نوشتن',
    description: 'شناخت حروف، صدای حروف و ساختن کلمه',
    color: '#E4572E',
    icon: 'book',
  }),
  Object.freeze({
    id: 'math',
    title: 'ریاضی',
    description: 'شمارش، مقایسه و جمع و تفریق ساده',
    color: '#2E86AB',
    icon: 'numbers',
  }),
  Object.freeze({
    id: 'science',
    title: 'تماشا و شناخت',
    description: 'دسته‌بندی، شکل و رنگ، و شمردن با تصویر',
    color: '#4CAF50',
    icon: 'leaf',
  }),
  Object.freeze({
    id: 'logic',
    title: 'منطق و الگو',
    description: 'الگویابی، دسته‌بندی و حل مسئله',
    color: '#7B4B94',
    icon: 'puzzle',
  }),
]);

export function domainById(id) {
  return DOMAINS.find((d) => d.id === id) || null;
}

export function trackForAge(age) {
  if (age <= 6) return AGE_TRACKS.early;
  if (age <= 7) return AGE_TRACKS.mid;
  return AGE_TRACKS.school;
}
