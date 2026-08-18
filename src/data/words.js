// Persian vocabulary: frequent words, opposites, question words, sentences
window.FREQUENT_WORDS = [
    'بابا', 'مامان', 'خواهر', 'برادر', 'خانه', 'مدرسه', 'کتاب',
    'ميز', 'صندلي', 'در', 'پنجره', 'آب', 'نان', 'شير',
    'سيب', 'موز', 'هندوانه', 'توپ', 'عروسک', 'ماشين', 'دوچرخه',
    'خورشيد', 'ماه', 'ستاره', 'آسمان', 'ابر', 'باران', 'برف',
    'دريا', 'کوه', 'جنگل', 'گل', 'درخت', 'گربه', 'سگ'
];

window.OPPOSITES = [
    { a: 'بزرگ', b: 'کوچک', image: 'size' },
    { a: 'بلند', b: 'کوتاه', image: 'height' },
    { a: 'گرم', b: 'سرد', image: 'temperature' },
    { a: 'سريع', b: 'کند', image: 'speed' },
    { a: 'روشن', b: 'تاريک', image: 'light' },
    { a: 'زياد', b: 'کم', image: 'amount' },
    { a: 'بالا', b: 'پايين', image: 'position' },
    { a: 'جلو', b: 'عقب', image: 'direction' },
    { a: 'نزديک', b: 'دور', image: 'distance' },
    { a: 'آب', b: 'آتش', image: 'element' },
    { a: 'خوب', b: 'بد', image: 'quality' },
    { a: 'شيرين', b: 'تلخ', image: 'taste' }
];

// Sentence building: subject + verb + place (kids arrange word cards)
window.SENTENCE_POOL = [
    { words: ['بابا', 'نان', 'مي‌خرد'], subject: 'بابا', verb: 'مي‌خرد' },
    { words: ['مادر', 'گل', 'مي‌کارد'], subject: 'مادر', verb: 'مي‌کارد' },
    { words: ['گربه', 'شير', 'مي‌خورد'], subject: 'گربه', verb: 'مي‌خورد' },
    { words: ['علي', 'توپ', 'مي‌زند'], subject: 'علي', verb: 'مي‌زند' },
    { words: ['ماهي', 'در', 'آب', 'شنا', 'مي‌کند'] },
    { words: ['خورشيد', 'در', 'آسمان', 'مي‌درخشد'] },
    { words: ['پرنده', 'روي', 'شاخه', 'مي‌نشيند'] },
    { words: ['من', 'کتاب', 'مي‌خوانم'] }
];

// Words for "which word starts with sound X" style questions
window.SOUND_STARTS = {
    'ب': ['بابا', 'باد', 'برگ'],
    'د': ['دست', 'دريا', 'دوست'],
    'م': ['مادر', 'ماه', 'ميز'],
    'س': ['سيب', 'سر', 'سگ'],
    'گ': ['گل', 'گربه', 'گوش'],
    'ک': ['کتاب', 'کوه', 'کلاغ']
};

// Vocabulary with simple definitions (age 5-8)
window.WORD_MEANINGS = [
    { word: 'درخت', meaning: 'گياه بزرگي که ريشه و تنه و شاخه دارد', image: 'tree' },
    { word: 'کتاب', meaning: 'چيزي که صفحه صفحه است و داخلش داستان يا مطلب دارد', image: 'book' },
    { word: 'سيب', meaning: 'ميوه‌اي قرمز يا سبز که خوشمزه است', image: 'apple' },
    { word: 'گربه', meaning: 'حيواني کوچک و نرم که مي‌گويد ميو ميو', image: 'cat' },
    { word: 'ماه', meaning: 'تو آسمان شب مي‌درخشد', image: 'moon' },
    { word: 'خورشيد', meaning: 'تو آسمان روز است و به ما نور و گرما مي‌دهد', image: 'sun' },
    { word: 'باران', meaning: 'قطره‌هاي آب که از ابر مي‌بارند', image: 'rain' }
];
