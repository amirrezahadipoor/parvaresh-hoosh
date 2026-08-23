// حروف الفبای فارسی — ۳۲ حرف، هم‌خوان با ۳۲ کلیپ صوتی ضبط‌شده.
// 32 Letters with isolated forms, Persian names, examples, phonetic hints, and syllables
export const ALPHABET = [
    { letter: 'ا', name: 'الف', sound: 'آ', example: 'اسب', category: 'حروف', words: ['اسب', 'ابر', 'انار', 'انگور', 'اردک', 'آب'] },
    { letter: 'ب', name: 'بِ', sound: 'بـ', example: 'بابا', category: 'حروف', words: ['بابا', 'بادکنک', 'باران', 'بستنی', 'ببر'] },
    { letter: 'پ', name: 'پِ', sound: 'پـ', example: 'پروانه', category: 'حروف', words: ['پروانه', 'پرنده', 'پنیر', 'پیراهن', 'پا'] },
    { letter: 'ت', name: 'تِ', sound: 'تـ', example: 'توپ', category: 'حروف', words: ['توپ', 'تاب', 'توت', 'تخم‌مرغ', 'تاج'] },
    { letter: 'ث', name: 'ثِ', sound: 'ثـ', example: 'ثعلب', category: 'حروف', words: ['ثعلب', 'مثلث', 'ثریا', 'ثابت'] },
    { letter: 'ج', name: 'جیم', sound: 'جـ', example: 'جوجه', category: 'حروف', words: ['جوجه', 'جنگل', 'جوراب', 'جعبه', 'جام'] },
    { letter: 'چ', name: 'چِه', sound: 'چـ', example: 'چتر', category: 'حروف', words: ['چتر', 'چای', 'چشم', 'چوب', 'چراغ'] },
    { letter: 'ح', name: 'حِ', sound: 'حـ', example: 'حلزون', category: 'حروف', words: ['حلزون', 'حوله', 'حوض', 'حیاط', 'حباب'] },
    { letter: 'خ', name: 'خِ', sound: 'خـ', example: 'خرگوش', category: 'حروف', words: ['خرگوش', 'خروس', 'خانه', 'خورشید', 'خرس'] },
    { letter: 'د', name: 'دال', sound: 'د', example: 'درخت', category: 'حروف', words: ['درخت', 'دست', 'دلفین', 'دریا', 'دندان'] },
    { letter: 'ذ', name: 'ذال', sound: 'ذ', example: 'ذرت', category: 'حروف', words: ['ذرت', 'ذره‌بین', 'ذره', 'لذیذ'] },
    { letter: 'ر', name: 'رِ', sound: 'ر', example: 'روباه', category: 'حروف', words: ['روباه', 'رنگین‌کمان', 'رودخانه', 'راکت', 'رادیو'] },
    { letter: 'ز', name: 'زِ', sound: 'ز', example: 'زنبور', category: 'حروف', words: ['زنبور', 'زرافه', 'زمین', 'زنگ', 'زرد'] },
    { letter: 'ژ', name: 'ژِ', sound: 'ژ', example: 'ژاله', category: 'حروف', words: ['ژاله', 'ژاکت', 'ژله', 'مژگان'] },
    { letter: 'س', name: 'سین', sound: 'سـ', example: 'سیب', category: 'حروف', words: ['سیب', 'ستاره', 'سگ', 'ساعت', 'سنجاب'] },
    { letter: 'ش', name: 'شین', sound: 'شـ', example: 'شیر', category: 'حروف', words: ['شیر', 'شانه', 'شمع', 'شکلات', 'شتر'] },
    { letter: 'ص', name: 'صاد', sound: 'صـ', example: 'صورت', category: 'حروف', words: ['صورت', 'صندلی', 'صابون', 'صندوق', 'صدف'] },
    { letter: 'ض', name: 'ضاد', sound: 'ضـ', example: 'ضربه', category: 'حروف', words: ['ضربه', 'رضا', 'حاضر', 'فضا'] },
    { letter: 'ط', name: 'طا', sound: 'طـ', example: 'طوطی', category: 'حروف', words: ['طوطی', 'طاووس', 'طناب', 'طبل', 'طلا'] },
    { letter: 'ظ', name: 'ظا', sound: 'ظـ', example: 'ظرف', category: 'حروف', words: ['ظرف', 'ظاهر', 'نظم', 'ظهر'] },
    { letter: 'ع', name: 'عین', sound: 'عـ', example: 'عینک', category: 'حروف', words: ['عینک', 'عسل', 'عروسک', 'عصا', 'عکس'] },
    { letter: 'غ', name: 'غین', sound: 'غـ', example: 'غار', category: 'حروف', words: ['غار', 'غذا', 'غنچه', 'قورباغه', 'غزال'] },
    { letter: 'ف', name: 'فِ', sound: 'فـ', example: 'فیل', category: 'حروف', words: ['فیل', 'فنجان', 'فرفره', 'فندق', 'فصل'] },
    { letter: 'ق', name: 'قاف', sound: 'قـ', example: 'قایق', category: 'حروف', words: ['قایق', 'قوری', 'قطار', 'قفل', 'قو'] },
    { letter: 'ک', name: 'کاف', sound: 'کـ', example: 'کتاب', category: 'حروف', words: ['کتاب', 'کلاه', 'کفش', 'کیک', 'کبوتر'] },
    { letter: 'گ', name: 'گاف', sound: 'گـ', example: 'گل', category: 'حروف', words: ['گل', 'گربه', 'گیلاس', 'گاو', 'گوسفند'] },
    { letter: 'ل', name: 'لام', sound: 'لـ', example: 'لاک‌پشت', category: 'حروف', words: ['لاک‌پشت', 'لیمو', 'لباس', 'لامپ', 'لانه'] },
    { letter: 'م', name: 'میم', sound: 'مـ', example: 'موز', category: 'حروف', words: ['موز', 'مادر', 'ماشین', 'ماهی', 'میمون'] },
    { letter: 'ن', name: 'نون', sound: 'نـ', example: 'نان', category: 'حروف', words: ['نان', 'نارنجی', 'نگین', 'نخود', 'نهنگ'] },
    { letter: 'و', name: 'واو', sound: 'و', example: 'ورزش', category: 'حروف', words: ['ورزش', 'وال', 'وزنه', 'ویولن'] },
    { letter: 'ه', name: 'هِ', sound: 'هـ', example: 'هویج', category: 'حروف', words: ['هویج', 'هواپیما', 'هندوانه', 'هدیه', 'هدهد'] },
    { letter: 'ی', name: 'یِ', sound: 'یـ', example: 'یخ', category: 'حروف', words: ['یخ', 'یاس', 'یکتا', 'یوزپلنگ'] }
];

// First-sound map
