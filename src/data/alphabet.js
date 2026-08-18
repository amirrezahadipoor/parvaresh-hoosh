// Persian alphabet data
// Each letter: isolated form, name, audio text, example word, word audio
window.ALPHABET = [
    { letter: 'ا', name: 'الف', example: 'اسب', exampleTrans: 'asb', sound: 'a' },
    { letter: 'ب', name: 'به', example: 'بابا', exampleTrans: 'baba', sound: 'b' },
    { letter: 'پ', name: 'په', example: 'پنير', exampleTrans: 'panir', sound: 'p' },
    { letter: 'ت', name: 'ته', example: 'تاب', exampleTrans: 'tab', sound: 't' },
    { letter: 'ث', name: 'ثه', example: 'ثور', exampleTrans: 'sor', sound: 's' },
    { letter: 'ج', name: 'جيم', example: 'جوجه', exampleTrans: 'jooje', sound: 'j' },
    { letter: 'چ', name: 'چه', example: 'چاي', exampleTrans: 'chay', sound: 'ch' },
    { letter: 'ح', name: 'حه', example: 'حلزون', exampleTrans: 'halazoon', sound: 'h' },
    { letter: 'خ', name: 'خه', example: 'خروس', exampleTrans: 'khoroos', sound: 'kh' },
    { letter: 'د', name: 'دال', example: 'دست', exampleTrans: 'dast', sound: 'd' },
    { letter: 'ذ', name: 'ذال', example: 'ذره', exampleTrans: 'zarre', sound: 'z' },
    { letter: 'ر', name: 'ره', example: 'روباه', exampleTrans: 'roobah', sound: 'r' },
    { letter: 'ز', name: 'زه', example: 'زنبور', exampleTrans: 'zamboor', sound: 'z' },
    { letter: 'ژ', name: 'ژه', example: 'ژاله', exampleTrans: 'zhale', sound: 'zh' },
    { letter: 'س', name: 'سين', example: 'سيب', exampleTrans: 'sib', sound: 's' },
    { letter: 'ش', name: 'شين', example: 'شير', exampleTrans: 'shir', sound: 'sh' },
    { letter: 'ص', name: 'صاد', example: 'صندلي', exampleTrans: 'sandali', sound: 's' },
    { letter: 'ض', name: 'ضاد', example: 'ضربه', exampleTrans: 'zarbe', sound: 'z' },
    { letter: 'ط', name: 'طا', example: 'طوطي', exampleTrans: 'tooti', sound: 't' },
    { letter: 'ظ', name: 'ظا', example: 'ظرف', exampleTrans: 'zarf', sound: 'z' },
    { letter: 'ع', name: 'عين', example: 'عروسک', exampleTrans: 'aroosak', sound: '' },
    { letter: 'غ', name: 'غين', example: 'قورباغه', exampleTrans: 'ghoorgbaghe', sound: 'gh' },
    { letter: 'ف', name: 'فه', example: 'فيل', exampleTrans: 'fil', sound: 'f' },
    { letter: 'ق', name: 'قاف', example: 'قورباغه', exampleTrans: 'ghoorgbaghe', sound: 'gh' },
    { letter: 'ک', name: 'کاف', example: 'کتاب', exampleTrans: 'ketab', sound: 'k' },
    { letter: 'گ', name: 'گاف', example: 'گل', exampleTrans: 'gol', sound: 'g' },
    { letter: 'ل', name: 'لام', example: 'لاک پشت', exampleTrans: 'laakposht', sound: 'l' },
    { letter: 'م', name: 'ميم', example: 'مادر', exampleTrans: 'madar', sound: 'm' },
    { letter: 'ن', name: 'نون', example: 'نان', exampleTrans: 'naan', sound: 'n' },
    { letter: 'و', name: 'واو', example: 'وال', exampleTrans: 'vaal', sound: 'v' },
    { letter: 'ه', name: 'هه', example: 'هوا', exampleTrans: 'hava', sound: 'h' },
    { letter: 'ی', name: 'ي', example: 'يخ', exampleTrans: 'yakh', sound: 'y' }
];

// First-sound questions: pick a letter, present 3 images/words, find which starts with that sound
// word lists grouped by starting sound (first letter)
window.FIRST_SOUND_WORDS = {
    'ا': ['اسب', 'انار', 'الک', 'ابر'],
    'ب': ['بابا', 'بچه', 'بستنی', 'باران'],
    'پ': ['پنير', 'پدر', 'پروانه', 'پنجره'],
    'ت': ['تاب', 'توت', 'تخم مرغ', 'توپ'],
    'ج': ['جوجه', 'جنگل', 'جوراب', 'جعبه'],
    'چ': ['چاي', 'چتر', 'چشم', 'چراغ'],
    'خ': ['خروس', 'خورشيد', 'خواب', 'خانه'],
    'د': ['دست', 'دندان', 'دريا', 'دوست'],
    'ر': ['روباه', 'رنگ', 'روز', 'ريش'],
    'ز': ['زنبور', 'زمستان', 'زنگ', 'زرد'],
    'س': ['سيب', 'سبز', 'ستاره', 'سگ'],
    'ش': ['شير', 'شب', 'شمع', 'شتر'],
    'ع': ['عروسک', 'عسل', 'عکس', 'عينک'],
    'ف': ['فيل', 'فنجان', 'فرش', 'فردا'],
    'ق': ['قورباغه', 'قند', 'قلب', 'قلم'],
    'ک': ['کتاب', 'کفش', 'کوه', 'کلاغ'],
    'گ': ['گل', 'گربه', 'گوش', 'گردو'],
    'ل': ['لاک پشت', 'لب', 'ليمو', 'لانه'],
    'م': ['مادر', 'ماه', 'ميز', 'موز'],
    'ن': ['نان', 'نخود', 'ني', 'نخ'],
    'ه': ['هوا', 'هويج', 'هندوانه', 'هفته'],
    'ي': ['يخ', 'يک', 'يزد', 'يال']
};

// Rhyming word pairs (قافیه)
window.RHYMES = [
    ['ماه', 'راه'], ['تاب', 'آب'], ['گل', 'مل'], ['شير', 'پير'],
    ['بابا', 'نوبابا'], ['مادر', 'بابا'], ['سيب', 'لبيب'], ['نان', 'جان'],
    ['توپ', 'شلوپ'], ['کتاب', 'خواب'], ['موز', 'سوز'], ['دست', 'شست']
];

// Simple 2 and 3 letter words for blending practice
window.BLEND_WORDS_2 = [
    { word: 'اب', parts: ['ا', 'ب'], syllables: ['آ', 'ب'] },
    { word: 'او', parts: ['ا', 'و'], syllables: ['آ', 'و'] },
    { word: 'مو', parts: ['م', 'و'], syllables: ['مُ', 'و'] },
    { word: 'بو', parts: ['ب', 'و'], syllables: ['بُ', 'و'] },
    { word: 'پا', parts: ['پ', 'ا'], syllables: ['پ', 'ا'] },
    { word: 'ما', parts: ['م', 'ا'], syllables: ['م', 'ا'] }
];

window.BLEND_WORDS_3 = [
    { word: 'باب', parts: ['ب', 'ا', 'ب'], syllables: ['با', 'ب'] },
    { word: 'مام', parts: ['م', 'ا', 'م'], syllables: ['ما', 'م'] },
    { word: 'نان', parts: ['ن', 'ا', 'ن'], syllables: ['نا', 'ن'] },
    { word: 'تاب', parts: ['ت', 'ا', 'ب'], syllables: ['تا', 'ب'] },
    { word: 'کبک', parts: ['ک', 'ب', 'ک'], syllables: ['کب', 'ک'] },
    { word: 'داد', parts: ['د', 'ا', 'د'], syllables: ['دا', 'د'] }
];

window.BLEND_WORDS_4 = [
    { word: 'کتاب', parts: ['ک', 'ت', 'ا', 'ب'], syllables: ['کت', 'اب'] },
    { word: 'مادر', parts: ['م', 'ا', 'د', 'ر'], syllables: ['ما', 'در'] },
    { word: 'پدر', parts: ['پ', 'د', 'ر'], syllables: ['پ', 'در'] },
    { word: 'برگ', parts: ['ب', 'ر', 'گ'], syllables: ['بر', 'گ'] },
    { word: 'بست', parts: ['ب', 'س', 'ت'], syllables: ['بست'] }
];
