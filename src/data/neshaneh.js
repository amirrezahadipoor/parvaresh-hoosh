// ترتیب رسمی آموزش نشانه‌ها — کتاب فارسی اول دبستان، وزارت آموزش و پرورش.
//
// چرا این فایل وجود دارد:
// ترتیب الفبا (ا ب پ ت ث ج ...) ترتیبِ *آموزش* نیست. در مدرسه، نشانه‌ها به
// ترتیبی آموزش داده می‌شوند که هرچه زودتر بتوان با آن‌ها کلمهٔ واقعی ساخت.
// برای همین «د» و «م» و «س» خیلی زود می‌آیند (درس ۲ و ۳) ولی «ژ» و «ظ» آخر.
//
// منبع: فهرست درس‌های ۱ تا ۲۲ کتاب فارسی اول دبستان.
// نمونه: درس ۱ «آ ا ــ بـ ب» / درس ۲ «اَ ـَ ــ د» / درس ۳ «مـ م ــ سـ س»
//
// نتیجهٔ عملی: کودک بعد از درس ۳ می‌تواند «ماست»، «سام»، «باد» را بخواند.
// با ترتیب الفبایی بعد از سه درس فقط «ا ب پ ت» را می‌دانست و هیچ کلمه‌ای
// نمی‌توانست بسازد.

/** درس‌های کتاب فارسی اول، به ترتیب واقعی تدریس. */
export const NESHANEH_LESSONS = Object.freeze([
  { lesson: 1, letters: ['ا', 'ب'], label: 'آ ا ــ بـ ب' },
  { lesson: 2, letters: ['د'], label: 'اَ ــ د' },
  { lesson: 3, letters: ['م', 'س'], label: 'مـ م ــ سـ س' },
  { lesson: 4, letters: ['و', 'ت'], label: 'او و ــ تـ ت' },
  { lesson: 5, letters: ['ر', 'ن'], label: 'ر ــ نـ ن' },
  { lesson: 6, letters: ['ی', 'ز'], label: 'ایـ یـ ی ــ ز' },
  { lesson: 7, letters: ['ه', 'ش'], label: 'اِ ـه ه ــ شـ ش' },
  { lesson: 9, letters: ['ک'], label: 'کـ ک ــ و' },
  { lesson: 10, letters: ['پ', 'گ'], label: 'پـ پ ــ گـ گ' },
  { lesson: 11, letters: ['ف', 'خ'], label: 'فـ ف ــ خـ خ' },
  { lesson: 12, letters: ['ق', 'ل'], label: 'قـ ق ــ لـ ل' },
  { lesson: 13, letters: ['ج'], label: 'جـ ج' },
  { lesson: 14, letters: ['چ'], label: 'هـ ه ــ چـ چ' },
  { lesson: 15, letters: ['ژ'], label: 'ژ ــ خوا' },
  { lesson: 17, letters: ['ص', 'ذ'], label: 'صـ ص ــ ذ' },
  { lesson: 18, letters: ['ع', 'ث'], label: 'عـ ع ــ ثـ ث' },
  { lesson: 19, letters: ['ح'], label: 'حـ ح' },
  { lesson: 20, letters: ['ض', 'ط'], label: 'ضـ ض ــ ط' },
  { lesson: 21, letters: ['غ'], label: 'غـ غ' },
  { lesson: 22, letters: ['ظ'], label: 'ظ' },
]);

/** ترتیب تخت حروف، به ترتیب تدریس مدرسه. */
export const TEACHING_ORDER = Object.freeze(NESHANEH_LESSONS.flatMap((l) => l.letters));

/** رتبهٔ آموزشی یک حرف (۰ = زودترین). حرف ناشناخته آخر می‌رود. */
export function teachRank(letter) {
  const i = TEACHING_ORDER.indexOf(letter);
  return i === -1 ? 999 : i;
}
