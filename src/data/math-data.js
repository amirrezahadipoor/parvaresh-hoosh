// Math content data: numbers, shapes, patterns
window.NUMBERS = [
    { n: 0, fa: 'صفر' }, { n: 1, fa: 'يک' }, { n: 2, fa: 'دو' },
    { n: 3, fa: 'سه' }, { n: 4, fa: 'چهار' }, { n: 5, fa: 'پنج' },
    { n: 6, fa: 'شش' }, { n: 7, fa: 'هفت' }, { n: 8, fa: 'هشت' },
    { n: 9, fa: 'نه' }, { n: 10, fa: 'ده' }, { n: 11, fa: 'يازده' },
    { n: 12, fa: 'دوازده' }, { n: 13, fa: 'سيزده' }, { n: 14, fa: 'چهارده' },
    { n: 15, fa: 'پانزده' }, { n: 16, fa: 'شانزده' }, { n: 17, fa: 'هفده' },
    { n: 18, fa: 'هجده' }, { n: 19, fa: 'نوزده' }, { n: 20, fa: 'بيست' }
];

window.SHAPES = [
    { id: 'circle', fa: 'دايره', sides: 0, color: '#FF6B6B', emoji: null },
    { id: 'triangle', fa: 'مثلث', sides: 3, color: '#4ECDC4', emoji: null },
    { id: 'square', fa: 'مربع', sides: 4, color: '#A29BFE', emoji: null },
    { id: 'rectangle', fa: 'مستطيل', sides: 4, color: '#F9CA24', emoji: null },
    { id: 'oval', fa: 'بيضي', sides: 0, color: '#FF8A5C', emoji: null },
    { id: 'diamond', fa: 'لوزي', sides: 4, color: '#F368E0', emoji: null }
];

// Pattern items: color sequences, shape sequences
window.PATTERN_COLORS = ['#FF6B6B', '#4ECDC4', '#F9CA24', '#A29BFE', '#F368E0', '#FF8A5C'];

window.PATTERNS = [
    { type: 'color', seq: [0, 1, 0, 1, null], answer: 0 },     // red teal red teal red
    { type: 'color', seq: [0, 0, 1, 0, 0, null], answer: 1 },  // red red teal red red teal
    { type: 'color', seq: [0, 1, 2, 0, 1, null], answer: 2 },  // red teal yellow red teal yellow
    { type: 'shape', seq: ['circle', 'square', 'circle', null], answer: 'square' },
    { type: 'shape', seq: ['triangle', 'triangle', 'circle', 'triangle', 'triangle', null], answer: 'circle' },
    { type: 'size', seq: [1, 2, 3, 1, 2, null], answer: 3 }    // small med big small med big
];

// Addition/subtraction problem generator config per level
window.ARITH_RANGES = {
    'add-5': { op: '+', max: 5, count: 6 },
    'add-10': { op: '+', max: 10, count: 6 },
    'sub-5': { op: '-', max: 5, count: 6 },
    'sub-10': { op: '-', max: 10, count: 6 },
    'add-20': { op: '+', max: 20, count: 6 },
    'sub-20': { op: '-', max: 20, count: 6 },
    'mixed-10': { op: 'both', max: 10, count: 8 }
};
