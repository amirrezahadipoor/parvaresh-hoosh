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
  {
    id: 'math-subitize-01',
    domain: 'math',
    order: 6,
    title: 'یک نگاه، چند تا؟',
    goal: 'کودک تعداد کم را با یک نگاه تشخیص می‌دهد، بدون شمردن.',
    minutes: 5,
    parentNote:
      'تشخیص فوری تعداد (subitizing) پایهٔ حس عدد است. اگر کودک انگشت‌شماری کرد اشکالی ندارد؛ با تکرار، نگاه جای شمردن را می‌گیرد. الگوی تاس عمداً آشناست.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'subitize', max: 3, prompt: 'چند نقطه می‌بینی؟' },
      { kind: 'subitize', max: 4, prompt: 'چند نقطه می‌بینی؟' },
      { kind: 'subitize', max: 5, prompt: 'چند نقطه می‌بینی؟' },
      { kind: 'subitize', max: 5, prompt: 'چند نقطه می‌بینی؟' },
      { kind: 'subitize', max: 5, prompt: 'چند نقطه می‌بینی؟' },
      { kind: 'subitize', max: 5, prompt: 'چند نقطه می‌بینی؟' },
    ],
  },
  {
    id: 'math-tenframe-01',
    domain: 'math',
    order: 7,
    title: 'قاب ده‌تایی',
    goal: 'کودک با قاب ده‌تایی مقدار را می‌بیند و می‌فهمد چقدر تا ده مانده.',
    minutes: 5,
    parentNote:
      'قاب ده‌تایی ابزار متعارف کلاس‌های ریاضی دنیاست: کودک بدون شمردن می‌بیند که ۷ یعنی «یک ردیف پنج‌تایی و دو تا». این پل ورود به جمع و تفریق است.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'ten-frame', prompt: 'چند خانه پر است؟' },
      { kind: 'ten-frame', prompt: 'چند خانه پر است؟' },
      { kind: 'ten-frame', mode: 'remain', prompt: 'چند خانه خالی مانده؟' },
      { kind: 'ten-frame', prompt: 'چند خانه پر است؟' },
      { kind: 'ten-frame', mode: 'remain', prompt: 'چند خانه خالی مانده؟' },
      { kind: 'ten-frame', mode: 'remain', prompt: 'چند خانه خالی مانده؟' },
    ],
  },
  {
    id: 'math-bond-01',
    domain: 'math',
    order: 8,
    title: 'عدد را بشکن',
    goal: 'کودک یک عدد را به دو بخش تجزیه می‌کند — پایهٔ جمع و تفریق.',
    minutes: 6,
    parentNote:
      'تجزیهٔ عدد («۵ می‌شود ۳ و ۲») مهم‌تر از حفظ‌کردن جدول جمع است. کودکی که می‌داند ۵ چطور می‌شکند، جمع و تفریق را می‌فهمد نه اینکه حفظ کند.',
    reviewDays: [1, 3, 7],
    rounds: [
      { kind: 'number-bond', max: 5, prompt: '{t} می‌شود {p} و چند؟' },
      { kind: 'number-bond', max: 5, prompt: '{t} می‌شود {p} و چند؟' },
      { kind: 'number-bond', max: 8, prompt: '{t} می‌شود {p} و چند؟' },
      { kind: 'number-bond', max: 8, prompt: '{t} می‌شود {p} و چند؟' },
      { kind: 'number-bond', max: 10, prompt: '{t} می‌شود {p} و چند؟' },
      { kind: 'number-bond', max: 10, prompt: '{t} می‌شود {p} و چند؟' },
    ],
  },

];
