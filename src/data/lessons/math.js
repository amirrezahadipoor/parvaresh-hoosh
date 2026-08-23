// درس‌های ریاضی — تألیف دستی.
//
// اینجا هیچ درسی از روی «عنوان» ساخته نمی‌شود. هر گِرد یک نوع مشخص دارد
// و موتور بازی فقط همان را اجرا می‌کند. اگر نوعی پشتیبانی نشود،
// اعتبارسنج شکست می‌خورد.
//
// دامنهٔ اعداد از ردهٔ سنی می‌آید (AGE_TRACKS.maxNumber)، پس یک درس
// برای کودک ۵ ساله و ۸ ساله واقعاً متفاوت اجرا می‌شود.

export const MATH_LESSONS = [
  {
    id: 'math-count-01',
    domain: 'math',
    order: 1,
    title: 'شمردن تا ۵',
    goal: 'کودک تعداد اشیاء را تا ۵ می‌شمارد و عدد درست را انتخاب می‌کند.',
    minutes: 5,
    parentNote: 'سر سفره از کودک بخواهید قاشق‌ها را بشمارد.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'count-objects', max: 5, prompt: 'چند تا هست؟' },
      { kind: 'count-objects', max: 5, prompt: 'چند تا هست؟' },
      { kind: 'count-objects', max: 5, prompt: 'چند تا هست؟' },
      { kind: 'pick-number', max: 5, prompt: 'کدام عدد {n} است؟' },
      { kind: 'count-objects', max: 5, prompt: 'چند تا هست؟' },
      { kind: 'pick-number', max: 5, prompt: 'کدام عدد {n} است؟' },
    ],
  },
  {
    id: 'math-count-02',
    domain: 'math',
    order: 2,
    title: 'شمردن تا ۱۰',
    goal: 'کودک تا ۱۰ می‌شمارد و عددها را به ترتیب می‌شناسد.',
    minutes: 6,
    parentNote: 'موقع بالا رفتن از پله‌ها با هم بشمارید.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'count-objects', max: 10, prompt: 'چند تا هست؟' },
      { kind: 'count-objects', max: 10, prompt: 'چند تا هست؟' },
      { kind: 'pick-number', max: 10, prompt: 'کدام عدد {n} است؟' },
      { kind: 'next-number', max: 10, prompt: 'بعد از {n} چه عددی می‌آید؟' },
      { kind: 'count-objects', max: 10, prompt: 'چند تا هست؟' },
      { kind: 'next-number', max: 10, prompt: 'بعد از {n} چه عددی می‌آید؟' },
    ],
  },
  {
    id: 'math-compare-01',
    domain: 'math',
    order: 3,
    title: 'کم و زیاد',
    goal: 'کودک دو گروه را مقایسه می‌کند و گروه بیشتر یا کمتر را می‌یابد.',
    minutes: 5,
    parentNote: 'دو مشت کشمش بردارید و بپرسید کدام بیشتر است.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'compare-groups', max: 10, mode: 'more', prompt: 'کدام گروه بیشتر است؟' },
      { kind: 'compare-groups', max: 10, mode: 'less', prompt: 'کدام گروه کمتر است؟' },
      { kind: 'compare-groups', max: 10, mode: 'more', prompt: 'کدام گروه بیشتر است؟' },
      { kind: 'compare-numbers', max: 20, mode: 'more', prompt: 'کدام عدد بزرگ‌تر است؟' },
      { kind: 'compare-numbers', max: 20, mode: 'less', prompt: 'کدام عدد کوچک‌تر است؟' },
      { kind: 'compare-groups', max: 10, mode: 'less', prompt: 'کدام گروه کمتر است؟' },
    ],
  },
  {
    id: 'math-add-01',
    domain: 'math',
    order: 4,
    title: 'جمع کردن',
    goal: 'کودک دو گروه را با هم جمع می‌کند و حاصل را می‌گوید.',
    minutes: 7,
    parentNote: 'با انگشت‌های دو دست جمع‌های کوچک تمرین کنید.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'add', max: 10, prompt: '{a} به‌علاوهٔ {b} چند می‌شود؟' },
      { kind: 'add', max: 10, prompt: '{a} به‌علاوهٔ {b} چند می‌شود؟' },
      { kind: 'add', max: 10, prompt: '{a} به‌علاوهٔ {b} چند می‌شود؟' },
      { kind: 'add', max: 20, prompt: '{a} به‌علاوهٔ {b} چند می‌شود؟' },
      { kind: 'add', max: 20, prompt: '{a} به‌علاوهٔ {b} چند می‌شود؟' },
      { kind: 'add', max: 20, prompt: '{a} به‌علاوهٔ {b} چند می‌شود؟' },
    ],
  },
  {
    id: 'math-sub-01',
    domain: 'math',
    order: 5,
    title: 'کم کردن',
    goal: 'کودک از یک گروه تعدادی برمی‌دارد و باقی‌مانده را می‌شمارد.',
    minutes: 7,
    parentNote: 'چند بیسکویت بگذارید، یکی بردارید و بپرسید چند تا ماند.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'sub', max: 10, prompt: '{a} منهای {b} چند می‌شود؟' },
      { kind: 'sub', max: 10, prompt: '{a} منهای {b} چند می‌شود؟' },
      { kind: 'sub', max: 10, prompt: '{a} منهای {b} چند می‌شود؟' },
      { kind: 'sub', max: 20, prompt: '{a} منهای {b} چند می‌شود؟' },
      { kind: 'sub', max: 20, prompt: '{a} منهای {b} چند می‌شود؟' },
      { kind: 'sub', max: 20, prompt: '{a} منهای {b} چند می‌شود؟' },
    ],
  },
];
