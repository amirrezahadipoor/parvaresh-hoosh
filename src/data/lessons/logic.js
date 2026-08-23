// درس‌های منطق و الگو — تألیف دستی.
//
// هر گِرد داده‌های خودش را همراه دارد؛ هیچ چیزی از عنوان درس حدس زده نمی‌شود.

export const LOGIC_LESSONS = [
  {
    id: 'logic-pattern-01',
    domain: 'logic',
    order: 1,
    title: 'الگوی رنگ‌ها',
    goal: 'کودک الگوی تکرارشوندهٔ رنگ را تشخیص می‌دهد و ادامه می‌دهد.',
    minutes: 5,
    parentNote: 'با دکمه یا مهره الگوی قرمز-آبی-قرمز بسازید و بخواهید ادامه دهد.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'pattern-next', unit: 'color', sequence: ['قرمز', 'آبی', 'قرمز', 'آبی'], answer: 'قرمز', prompt: 'رنگ بعدی کدام است؟' },
      { kind: 'pattern-next', unit: 'color', sequence: ['زرد', 'زرد', 'سبز', 'زرد', 'زرد'], answer: 'سبز', prompt: 'رنگ بعدی کدام است؟' },
      { kind: 'pattern-next', unit: 'color', sequence: ['آبی', 'سبز', 'زرد', 'آبی', 'سبز'], answer: 'زرد', prompt: 'رنگ بعدی کدام است؟' },
      { kind: 'pattern-next', unit: 'shape', sequence: ['دایره', 'مربع', 'دایره', 'مربع'], answer: 'دایره', prompt: 'شکل بعدی کدام است؟' },
      { kind: 'pattern-next', unit: 'shape', sequence: ['مثلث', 'دایره', 'دایره', 'مثلث', 'دایره'], answer: 'دایره', prompt: 'شکل بعدی کدام است؟' },
    ],
  },
  {
    id: 'logic-odd-01',
    domain: 'logic',
    order: 2,
    title: 'کدام فرق دارد؟',
    goal: 'کودک عضو ناهمگون یک دسته را پیدا می‌کند و دلیلش را می‌گوید.',
    minutes: 5,
    parentNote: 'از کودک بپرسید «چرا این یکی فرق دارد؟» — دلیل مهم‌تر از جواب است.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'odd-one-out', items: ['سیب', 'موز', 'پرتقال', 'ماشین'], answer: 'ماشین', because: 'بقیه میوه هستند.', prompt: 'کدام یکی فرق دارد؟' },
      { kind: 'odd-one-out', items: ['گربه', 'سگ', 'اسب', 'درخت'], answer: 'درخت', because: 'بقیه حیوان هستند.', prompt: 'کدام یکی فرق دارد؟' },
      { kind: 'odd-one-out', items: ['قرمز', 'آبی', 'سبز', 'دایره'], answer: 'دایره', because: 'بقیه رنگ هستند.', prompt: 'کدام یکی فرق دارد؟' },
      { kind: 'odd-one-out', items: ['کفش', 'کلاه', 'پیراهن', 'نان'], answer: 'نان', because: 'بقیه پوشیدنی هستند.', prompt: 'کدام یکی فرق دارد؟' },
      { kind: 'odd-one-out', items: ['یک', 'دو', 'سه', 'گل'], answer: 'گل', because: 'بقیه عدد هستند.', prompt: 'کدام یکی فرق دارد؟' },
    ],
  },
  {
    id: 'logic-sort-01',
    domain: 'logic',
    order: 3,
    title: 'مرتب کردن',
    goal: 'کودک چیزها را از کوچک به بزرگ مرتب می‌کند.',
    minutes: 6,
    parentNote: 'لیوان‌های خانه را با هم از کوچک به بزرگ بچینید.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'order-size', count: 3, prompt: 'از کوچک به بزرگ بچین' },
      { kind: 'order-size', count: 3, prompt: 'از کوچک به بزرگ بچین' },
      { kind: 'order-size', count: 4, prompt: 'از کوچک به بزرگ بچین' },
      { kind: 'order-number', count: 4, max: 20, prompt: 'عددها را از کم به زیاد بچین' },
      { kind: 'order-number', count: 5, max: 20, prompt: 'عددها را از کم به زیاد بچین' },
    ],
  },
  {
    id: 'logic-memory-01',
    domain: 'logic',
    order: 4,
    title: 'بازی حافظه',
    goal: 'کودک جای کارت‌ها را به یاد می‌آورد و جفت‌ها را پیدا می‌کند.',
    minutes: 6,
    parentNote: 'با کارت‌های واقعی هم همین بازی را انجام دهید.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'memory-pairs', pairs: 3, prompt: 'جفت‌های مثل هم را پیدا کن' },
      { kind: 'memory-pairs', pairs: 4, prompt: 'جفت‌های مثل هم را پیدا کن' },
      { kind: 'memory-pairs', pairs: 5, prompt: 'جفت‌های مثل هم را پیدا کن' },
    ],
  },
];
