// Service worker — برنامه باید کاملاً آفلاین کار کند.
//
// در نسخهٔ قبلی این فایل ۶۷ بار بازنویسی شد، چون هیچ‌وقت یک تصمیم روشن
// دربارهٔ راهبرد کش گرفته نشده بود. تصمیم اینجا صریح است و تغییر نمی‌کند:
//
//   همهٔ دارایی‌ها cache-first هستند.
//
// دلیل: این برنامه آفلاین است، هیچ API ای ندارد، و محتوایش فقط هنگام
// انتشار نسخهٔ جدید عوض می‌شود. برای به‌روزرسانی، CACHE را عوض کنید.

const CACHE = 'parvaresh-hoosh-v4.1.0';

const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './src/main.js',
  './src/styles/main.css',
  './src/ui/screens.js',
  './src/core/audio.js',
  './src/core/rounds.js',
  './src/core/svg.js',
  './src/core/storage.js',
  './src/data/curriculum.js',
  './src/data/narration.js',
  './src/data/neshaneh.js',
  './src/data/word-bank.js',
  './src/data/alphabet.js',
  './src/data/words.js',
  './src/data/math-data.js',
  './src/data/lessons/index.js',
  './src/data/lessons/reading.js',
  './src/data/lessons/math.js',
  './src/data/lessons/logic.js',
  './src/data/lessons/science.js',
  './assets/fonts/Vazirmatn-Regular.woff2',
  './assets/fonts/Vazirmatn-Bold.woff2',
  './assets/fonts/Vazirmatn-Black.woff2',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      // یک دارایی گمشده نباید کل نصب را شکست دهد.
      .then((c) => Promise.allSettled(SHELL.map((u) => c.add(u))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;

  e.respondWith(
    caches.match(request).then((hit) => {
      if (hit) return hit;
      return fetch(request)
        .then((res) => {
          // فقط پاسخ‌های سالمِ هم‌مبدأ را کش می‌کنیم (صداها هم همین‌جا).
          if (res.ok && new URL(request.url).origin === self.location.origin) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => caches.match('./index.html'));
    }),
  );
});
