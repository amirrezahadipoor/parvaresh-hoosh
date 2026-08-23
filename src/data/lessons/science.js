// درس‌های تماشا و دسته‌بندی — کاملاً تصویری (SVG).
//
// این حوزه برای کودکی است که هنوز روان نمی‌خواند: همه‌چیز با تصویر
// پرسیده می‌شود، نه با متن. گفتار پرسش‌ها هم کوتاه است.

export const SCIENCE_LESSONS = [
  {
    id: 'science-category-01',
    domain: 'science',
    order: 1,
    title: 'حیوان‌ها را بشناس',
    goal: 'کودک حیوان‌ها را از چیزهای دیگر جدا می‌کند.',
    minutes: 5,
    parentNote: 'در پارک با هم حیوان‌ها را نام ببرید و صدایشان را تقلید کنید.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'category', category: 'حیوان', prompt: 'کدام یکی {cat} است؟' },
      { kind: 'category', category: 'حیوان', prompt: 'کدام یکی {cat} است؟' },
      { kind: 'shadow', prompt: 'این سایهٔ کدام است؟' },
      { kind: 'category', category: 'حیوان', prompt: 'کدام یکی {cat} است؟' },
      { kind: 'shadow', prompt: 'این سایهٔ کدام است؟' },
      { kind: 'category', category: 'حیوان', prompt: 'کدام یکی {cat} است؟' },
    ],
  },
  {
    id: 'science-category-02',
    domain: 'science',
    order: 2,
    title: 'میوه یا نه؟',
    goal: 'کودک میوه‌ها را از اشیاء و گیاهان دیگر تشخیص می‌دهد.',
    minutes: 5,
    parentNote: 'سر خرید، از کودک بخواهید میوه‌ها را نشان دهد.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'category', category: 'میوه', prompt: 'کدام یکی {cat} است؟' },
      { kind: 'category', category: 'میوه', prompt: 'کدام یکی {cat} است؟' },
      { kind: 'category', category: 'میوه', prompt: 'کدام یکی {cat} است؟' },
      { kind: 'shadow', prompt: 'این سایهٔ کدام است؟' },
      { kind: 'category', category: 'طبیعت', prompt: 'کدام یکی از {cat} است؟' },
      { kind: 'category', category: 'وسیله', prompt: 'کدام یکی {cat} است؟' },
    ],
  },
  {
    id: 'science-shape-01',
    domain: 'science',
    order: 3,
    title: 'شکل‌ها و رنگ‌ها',
    goal: 'کودک شکل و رنگ را هم‌زمان دنبال می‌کند.',
    minutes: 6,
    parentNote: 'در خانه دنبال چیزهای «دایره‌ای قرمز» یا «مربع آبی» بگردید.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'shape-color', shape: 'دایره', prompt: 'کدام {shape} {color} است؟' },
      { kind: 'shape-color', shape: 'مربع', prompt: 'کدام {shape} {color} است؟' },
      { kind: 'shape-color', shape: 'مثلث', prompt: 'کدام {shape} {color} است؟' },
      { kind: 'shape-color', shape: 'ستاره', prompt: 'کدام {shape} {color} است؟' },
      { kind: 'shape-color', shape: 'قلب', prompt: 'کدام {shape} {color} است؟' },
      { kind: 'shape-color', shape: 'لوزی', prompt: 'کدام {shape} {color} است؟' },
    ],
  },
  {
    id: 'science-count-01',
    domain: 'science',
    order: 4,
    title: 'بشمار و پیدا کن',
    goal: 'کودک اشیاء پراکنده را بدون جا انداختن می‌شمارد.',
    minutes: 6,
    parentNote: 'شمردن چیزهای پخش‌شده سخت‌تر از ردیف منظم است؛ اجازه دهید با انگشت اشاره کند.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'count-shapes', max: 5, prompt: 'چند تا هست؟' },
      { kind: 'count-shapes', max: 7, prompt: 'چند تا هست؟' },
      { kind: 'count-shapes', max: 9, prompt: 'چند تا هست؟' },
      { kind: 'count-shapes', max: 7, prompt: 'چند تا هست؟' },
      { kind: 'count-shapes', max: 9, prompt: 'چند تا هست؟' },
      { kind: 'count-shapes', max: 9, prompt: 'چند تا هست؟' },
    ],
  },
];
