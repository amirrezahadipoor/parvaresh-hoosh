// Persian Mathematics & Cognitive Number Data
export const NUMBERS = [
    { n: 0, fa: 'صفر', digit: '۰' },
    { n: 1, fa: 'یک', digit: '۱' },
    { n: 2, fa: 'دو', digit: '۲' },
    { n: 3, fa: 'سه', digit: '۳' },
    { n: 4, fa: 'چهار', digit: '۴' },
    { n: 5, fa: 'پنج', digit: '۵' },
    { n: 6, fa: 'شش', digit: '۶' },
    { n: 7, fa: 'هفت', digit: '۷' },
    { n: 8, fa: 'هشت', digit: '۸' },
    { n: 9, fa: 'نه', digit: '۹' },
    { n: 10, fa: 'ده', digit: '۱۰' },
    { n: 11, fa: 'یازده', digit: '۱۱' },
    { n: 12, fa: 'دوازده', digit: '۱۲' },
    { n: 13, fa: 'سیزده', digit: '۱۳' },
    { n: 14, fa: 'چهارده', digit: '۱۴' },
    { n: 15, fa: 'پانزده', digit: '۱۵' },
    { n: 16, fa: 'شانزده', digit: '۱۶' },
    { n: 17, fa: 'هفده', digit: '۱۷' },
    { n: 18, fa: 'هجده', digit: '۱۸' },
    { n: 19, fa: 'نوزده', digit: '۱۹' },
    { n: 20, fa: 'بیست', digit: '۲۰' }
];

export const SHAPES = [
    { id: 'circle', fa: 'دایره', sides: 0, color: '#FF6B6B', desc: 'کاملاً گرد بدون گوشه' },
    { id: 'triangle', fa: 'مثلث', sides: 3, color: '#4ECDC4', desc: 'دارای ۳ گوشه و ۳ ضلع' },
    { id: 'square', fa: 'مربع', sides: 4, color: '#A29BFE', desc: 'دارای ۴ ضلع کاملاً برابر' },
    { id: 'rectangle', fa: 'مستطیل', sides: 4, color: '#F9CA24', desc: 'دارای ۲ ضلع بلند و ۲ ضلع کوتاه' },
    { id: 'oval', fa: 'بیضی', sides: 0, color: '#FF8A5C', desc: 'شبیه تخم‌مرغ کشیده' },
    { id: 'diamond', fa: 'لوزی', sides: 4, color: '#F368E0', desc: 'چهارضلعی مایل شبیه بادبادک' },
    { id: 'star', fa: 'ستاره', sides: 5, color: '#F9CA24', desc: 'شکل ۵ پر درخشان' },
    { id: 'heart', fa: 'قلب', sides: 0, color: '#FF6B6B', desc: 'نماد عشق و محبت' }
];

export const PATTERN_COLORS = ['#FF6B6B', '#4ECDC4', '#F9CA24', '#A29BFE', '#F368E0', '#FF8A5C', '#00B894'];

export const PATTERNS = [
    { type: 'color', seq: [0, 1, 0, 1, null], answer: 0 },
    { type: 'color', seq: [0, 0, 1, 0, 0, null], answer: 1 },
    { type: 'color', seq: [0, 1, 2, 0, 1, null], answer: 2 },
    { type: 'shape', seq: ['circle', 'square', 'circle', 'square', null], answer: 'circle' },
    { type: 'shape', seq: ['triangle', 'triangle', 'circle', 'triangle', 'triangle', null], answer: 'circle' },
    { type: 'shape', seq: ['square', 'triangle', 'diamond', 'square', 'triangle', null], answer: 'diamond' }
];
