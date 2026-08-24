// دادهٔ پایهٔ انگلیسی — از منابع مرجع بین‌المللی استخراج شده.
//
// منابع:
//  • فهرست Dolch (Edward Dolch, 1936) — ۲۲۰ واژهٔ پرکاربرد + ۹۵ اسم.
//    این واژه‌ها ۸۰٪ متن کتاب‌های کودک را می‌سازند. سطح‌بندی:
//    pre-primer → primer → first grade.
//  • خانواده‌های واژگانی CVC (صامت-مصوت-صامت) — ستون فقرات آواشناسی
//    انگلیسی برای نوآموز؛ کودک با تغییر یک حرف، واژهٔ تازه می‌سازد.
//  • Oxford 3000 سطح A1 برای گزینش واژگان پایه.
//
// ── قید سخت این پروژه ────────────────────────────────────────────────
// هیچ فایل صوتی انگلیسی نداریم (۷۹ کلیپ موجود همه فارسی‌اند) و ساخت
// گفتار مصنوعی ممنوع است. پس **هیچ گِرد انگلیسی نباید به صدا وابسته
// باشد**. همهٔ آموزش از راه تصویر و نوشتار است. اگر روزی صدای انگلیسی
// ضبط شد، می‌توان لایهٔ گفتار را اضافه کرد بدون تغییر این داده.

/** ۲۶ حرف الفبا با نمونه‌واژه. نمونه‌واژه‌ها از فهرست Dolch/A1 آمده‌اند. */
export const EN_ALPHABET = Object.freeze([
  { upper: 'A', lower: 'a', word: 'apple', fa: 'سیب', pic: 'سیب' },
  { upper: 'B', lower: 'b', word: 'ball', fa: 'توپ', pic: 'توپ' },
  { upper: 'C', lower: 'c', word: 'cat', fa: 'گربه', pic: 'گربه' },
  { upper: 'D', lower: 'd', word: 'dog', fa: 'سگ', pic: 'سگ' },
  { upper: 'E', lower: 'e', word: 'egg', fa: 'تخم‌مرغ', pic: 'تخم' },
  { upper: 'F', lower: 'f', word: 'fish', fa: 'ماهی', pic: 'ماهی' },
  { upper: 'G', lower: 'g', word: 'girl', fa: 'دختر', pic: null },
  { upper: 'H', lower: 'h', word: 'house', fa: 'خانه', pic: 'خانه' },
  { upper: 'I', lower: 'i', word: 'ice', fa: 'یخ', pic: null },
  { upper: 'J', lower: 'j', word: 'jump', fa: 'پریدن', pic: null },
  { upper: 'K', lower: 'k', word: 'key', fa: 'کلید', pic: 'کلید' },
  { upper: 'L', lower: 'l', word: 'leaf', fa: 'برگ', pic: 'برگ' },
  { upper: 'M', lower: 'm', word: 'moon', fa: 'ماه', pic: 'ماه' },
  { upper: 'N', lower: 'n', word: 'nose', fa: 'بینی', pic: 'بینی' },
  { upper: 'O', lower: 'o', word: 'orange', fa: 'پرتقال', pic: 'پرتقال' },
  { upper: 'P', lower: 'p', word: 'pencil', fa: 'مداد', pic: 'مداد' },
  { upper: 'Q', lower: 'q', word: 'queen', fa: 'ملکه', pic: null },
  { upper: 'R', lower: 'r', word: 'rabbit', fa: 'خرگوش', pic: 'خرگوش' },
  { upper: 'S', lower: 's', word: 'sun', fa: 'خورشید', pic: 'خورشید' },
  { upper: 'T', lower: 't', word: 'tree', fa: 'درخت', pic: 'درخت' },
  { upper: 'U', lower: 'u', word: 'up', fa: 'بالا', pic: null },
  { upper: 'V', lower: 'v', word: 'van', fa: 'ون', pic: 'ماشین' },
  { upper: 'W', lower: 'w', word: 'worm', fa: 'کرم', pic: 'کرم' },
  { upper: 'X', lower: 'x', word: 'box', fa: 'جعبه', pic: null },
  { upper: 'Y', lower: 'y', word: 'yellow', fa: 'زرد', pic: null },
  { upper: 'Z', lower: 'z', word: 'zoo', fa: 'باغ‌وحش', pic: null },
]);

/**
 * واژگان تصویردار — تنها واژه‌هایی که شکل SVG واقعی داریم.
 * قانون: واژهٔ انگلیسی بدون تصویر، به کودک ۵ ساله چیزی یاد نمی‌دهد.
 */
export const EN_PICTURE_WORDS = Object.freeze([
  { en: 'cat', fa: 'گربه', pic: 'گربه', group: 'animals' },
  { en: 'dog', fa: 'سگ', pic: 'سگ', group: 'animals' },
  { en: 'fish', fa: 'ماهی', pic: 'ماهی', group: 'animals' },
  { en: 'bird', fa: 'پرنده', pic: 'پرنده', group: 'animals' },
  { en: 'rabbit', fa: 'خرگوش', pic: 'خرگوش', group: 'animals' },
  { en: 'apple', fa: 'سیب', pic: 'سیب', group: 'food' },
  { en: 'banana', fa: 'موز', pic: 'موز', group: 'food' },
  { en: 'flower', fa: 'گل', pic: 'گل', group: 'nature' },
  { en: 'tree', fa: 'درخت', pic: 'درخت', group: 'nature' },
  { en: 'star', fa: 'ستاره', pic: 'ستاره', group: 'nature' },
  { en: 'moon', fa: 'ماه', pic: 'ماه', group: 'nature' },
  { en: 'sun', fa: 'خورشید', pic: 'خورشید', group: 'nature' },
  { en: 'cloud', fa: 'ابر', pic: 'ابر', group: 'nature' },
  { en: 'ball', fa: 'توپ', pic: 'توپ', group: 'things' },
  { en: 'book', fa: 'کتاب', pic: 'کتاب', group: 'things' },
  { en: 'house', fa: 'خانه', pic: 'خانه', group: 'things' },
  { en: 'car', fa: 'ماشین', pic: 'ماشین', group: 'things' },

  // ── گسترش: هر شکلی که در svg.js آرت واقعی دارد و واژه‌اش در فهرست
  // Cambridge YLE Pre-A1 Starters یا Oxford 3000 سطح A1 هست.
  // موضوع‌بندی از برنامهٔ استاندارد ESL کودکان: حیوان، خوراک، طبیعت،
  // بدن، پوشیدنی، اشیای روزمره، فصل، آب‌وهوا.
  { en: 'cow', fa: 'گاو', pic: 'گاو', group: 'animals' },
  { en: 'chick', fa: 'جوجه', pic: 'جوجه', group: 'animals' },
  { en: 'butterfly', fa: 'پروانه', pic: 'پروانه', group: 'animals' },
  { en: 'bee', fa: 'زنبور', pic: 'زنبور', group: 'animals' },
  { en: 'turtle', fa: 'لاکپشت', pic: 'لاکپشت', group: 'animals' },
  { en: 'worm', fa: 'کرم', pic: 'کرم', group: 'animals' },
  { en: 'egg', fa: 'تخم‌مرغ', pic: 'تخم', group: 'food' },
  { en: 'orange', fa: 'پرتقال', pic: 'پرتقال', group: 'food' },
  { en: 'carrot', fa: 'هویج', pic: 'هویج', group: 'food' },
  { en: 'cherry', fa: 'گیلاس', pic: 'گیلاس', group: 'food' },
  { en: 'bread', fa: 'نان', pic: 'نان', group: 'food' },
  { en: 'leaf', fa: 'برگ', pic: 'برگ', group: 'nature' },
  { en: 'mountain', fa: 'کوه', pic: 'کوه', group: 'nature' },
  { en: 'river', fa: 'رودخانه', pic: 'رودخانه', group: 'nature' },
  { en: 'snow', fa: 'برف', pic: 'برف', group: 'nature' },
  { en: 'rainbow', fa: 'رنگین‌کمان', pic: 'رنگین‌کمان', group: 'nature' },
  { en: 'stone', fa: 'سنگ', pic: 'سنگ', group: 'nature' },
  { en: 'wood', fa: 'چوب', pic: 'چوب', group: 'nature' },
  { en: 'plant', fa: 'گیاه', pic: 'گیاه', group: 'nature' },
  { en: 'seed', fa: 'دانه', pic: 'دانه', group: 'nature' },
  { en: 'eye', fa: 'چشم', pic: 'چشم', group: 'body' },
  { en: 'ear', fa: 'گوش', pic: 'گوش', group: 'body' },
  { en: 'nose', fa: 'بینی', pic: 'بینی', group: 'body' },
  { en: 'hand', fa: 'دست', pic: 'دست', group: 'body' },
  { en: 'shoe', fa: 'کفش', pic: 'کفش', group: 'clothes' },
  { en: 'hat', fa: 'کلاه', pic: 'کلاه', group: 'clothes' },
  { en: 'shirt', fa: 'پیراهن', pic: 'پیراهن', group: 'clothes' },
  { en: 'umbrella', fa: 'چتر', pic: 'چتر', group: 'things' },
  { en: 'clock', fa: 'ساعت', pic: 'ساعت', group: 'things' },
  { en: 'key', fa: 'کلید', pic: 'کلید', group: 'things' },
  { en: 'pencil', fa: 'مداد', pic: 'مداد', group: 'things' },
  { en: 'paper', fa: 'کاغذ', pic: 'کاغذ', group: 'things' },
  { en: 'spoon', fa: 'قاشق', pic: 'قاشق', group: 'things' },
  { en: 'coin', fa: 'سکه', pic: 'سکه', group: 'things' },
]);

/** رنگ‌ها — هم واژه‌اند هم دیدنی، پس برای نوآموز ایده‌آل‌اند. */
export const EN_COLORS = Object.freeze([
  { en: 'red', fa: 'قرمز', hex: '#E4572E' },
  { en: 'blue', fa: 'آبی', hex: '#2E86AB' },
  { en: 'yellow', fa: 'زرد', hex: '#F4B942' },
  { en: 'green', fa: 'سبز', hex: '#4CAF50' },
  { en: 'purple', fa: 'بنفش', hex: '#7B4B94' },
  { en: 'orange', fa: 'نارنجی', hex: '#F07818' },
]);

/** عددهای ۱ تا ۱۰ به انگلیسی — با تصویر شمردنی معنا پیدا می‌کنند. */
export const EN_NUMBERS = Object.freeze([
  { n: 1, en: 'one', fa: 'یک' },
  { n: 2, en: 'two', fa: 'دو' },
  { n: 3, en: 'three', fa: 'سه' },
  { n: 4, en: 'four', fa: 'چهار' },
  { n: 5, en: 'five', fa: 'پنج' },
  { n: 6, en: 'six', fa: 'شش' },
  { n: 7, en: 'seven', fa: 'هفت' },
  { n: 8, en: 'eight', fa: 'هشت' },
  { n: 9, en: 'nine', fa: 'نُه' },
  { n: 10, en: 'ten', fa: 'ده' },
]);

/**
 * خانواده‌های واژگانی CVC — قلب آواشناسی انگلیسی.
 * کودک می‌بیند که با عوض کردن یک حرف، واژهٔ تازه می‌سازد؛
 * این «کشف الگو» است، نه حفظ کردن.
 */
export const CVC_FAMILIES = Object.freeze([
  { rime: 'at', words: ['cat', 'bat', 'hat', 'mat', 'rat', 'sat'], fa: 'خانوادهٔ ـat' },
  { rime: 'an', words: ['can', 'man', 'pan', 'ran', 'van', 'fan'], fa: 'خانوادهٔ ـan' },
  { rime: 'ap', words: ['cap', 'map', 'nap', 'tap', 'lap'], fa: 'خانوادهٔ ـap' },
  { rime: 'ig', words: ['big', 'dig', 'pig', 'wig', 'fig'], fa: 'خانوادهٔ ـig' },
  { rime: 'in', words: ['pin', 'win', 'bin', 'fin', 'tin'], fa: 'خانوادهٔ ـin' },
  { rime: 'it', words: ['sit', 'hit', 'bit', 'fit', 'pit'], fa: 'خانوادهٔ ـit' },
  { rime: 'og', words: ['dog', 'log', 'fog', 'jog', 'hog'], fa: 'خانوادهٔ ـog' },
  { rime: 'op', words: ['top', 'hop', 'mop', 'pop', 'stop'], fa: 'خانوادهٔ ـop' },
  { rime: 'ot', words: ['hot', 'pot', 'dot', 'got', 'not'], fa: 'خانوادهٔ ـot' },
  { rime: 'ug', words: ['bug', 'hug', 'rug', 'mug', 'jug'], fa: 'خانوادهٔ ـug' },
  { rime: 'un', words: ['sun', 'run', 'fun', 'bun', 'gun'], fa: 'خانوادهٔ ـun' },
  { rime: 'ed', words: ['bed', 'red', 'fed', 'led', 'wed'], fa: 'خانوادهٔ ـed' },
]);

/**
 * واژه‌های دیداری Dolch — به ترتیب آموزشی.
 * این‌ها را نمی‌شود «صدا کشید»؛ باید به‌صورت کل شناخته شوند،
 * برای همین جدا از CVC آموزش داده می‌شوند.
 */
export const SIGHT_WORDS = Object.freeze({
  prePrimer: Object.freeze([
    'a', 'and', 'away', 'big', 'blue', 'can', 'come', 'down', 'find', 'for',
    'funny', 'go', 'help', 'here', 'I', 'in', 'is', 'it', 'jump', 'little',
    'look', 'make', 'me', 'my', 'not', 'one', 'play', 'red', 'run', 'said',
    'see', 'the', 'three', 'to', 'two', 'up', 'we', 'where', 'yellow', 'you',
  ]),
  primer: Object.freeze([
    'all', 'am', 'are', 'at', 'ate', 'be', 'black', 'brown', 'but', 'came',
    'did', 'do', 'eat', 'four', 'get', 'good', 'have', 'he', 'into', 'like',
    'must', 'new', 'no', 'now', 'on', 'our', 'out', 'please', 'pretty', 'ran',
    'ride', 'saw', 'say', 'she', 'so', 'soon', 'that', 'there', 'they', 'this',
    'too', 'under', 'want', 'was', 'well', 'went', 'what', 'white', 'who',
    'will', 'with', 'yes',
  ]),
});

/** معنی فارسی واژه‌های دیداریِ قابل ترجمه (برای گِرد تطبیق دوزبانه). */
export const SIGHT_WORD_FA = Object.freeze({
  big: 'بزرگ', little: 'کوچک', blue: 'آبی', red: 'قرمز', yellow: 'زرد',
  black: 'سیاه', brown: 'قهوه‌ای', white: 'سفید', green: 'سبز',
  come: 'بیا', go: 'برو', run: 'بدو', jump: 'بپر', look: 'نگاه کن',
  see: 'دیدن', eat: 'خوردن', play: 'بازی کن', help: 'کمک',
  one: 'یک', two: 'دو', three: 'سه', four: 'چهار',
  up: 'بالا', down: 'پایین', in: 'داخل', out: 'بیرون', under: 'زیر',
  yes: 'بله', no: 'نه', good: 'خوب', new: 'نو', pretty: 'زیبا',
  me: 'من', you: 'تو', we: 'ما', he: 'او', she: 'او',
  here: 'اینجا', there: 'آنجا', where: 'کجا', what: 'چه', who: 'کی',
  funny: 'بامزه', fast: 'تند', cold: 'سرد', hot: 'داغ',
});

/** واژه‌های دیداری‌ای که معنی فارسی دارند — قابل استفاده در تطبیق. */
export const TRANSLATABLE_SIGHT_WORDS = Object.freeze(
  Object.keys(SIGHT_WORD_FA).filter(
    (w) => SIGHT_WORDS.prePrimer.includes(w) || SIGHT_WORDS.primer.includes(w),
  ),
);
