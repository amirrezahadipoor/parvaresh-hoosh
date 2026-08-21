const CACHE_NAME = 'parvaresh-hoosh-v3.3.3';
const PRECACHE = [
  './',
  './index.html',
  './privacy.html',
  './terms.html',
  './content/curriculum.json',
  './content/content_manifest.json',
  './assets/icon.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/fonts/Vazirmatn-Regular.woff2',
  './assets/fonts/Vazirmatn-Medium.woff2',
  './assets/fonts/Vazirmatn-Bold.woff2',
  './assets/fonts/Vazirmatn-ExtraBold.woff2',
  './assets/fonts/Vazirmatn-Black.woff2',
  './manifest.webmanifest',
  './src/styles/main.css',
  './vendor/gsap.min.js',
  './src/data/narration-map.js',
  './src/data/alphabet.js',
  './src/data/words.js',
  './src/data/math-data.js',
  './src/data/world-data.js',
  './src/data/curriculum.js',
  './src/data/lesson-guide.js',
  './src/data/lesson-packages.js',
  './src/core/config.js',
  './src/core/icons.js',
  './src/core/audio.js',
  './src/core/storage.js',
  './src/core/backup.js',
  './src/core/engagement.js',
  './src/core/game-progress.js',
  './src/core/adaptive.js',
  './src/core/iq-assessment.js',
  './src/core/living-world.js',
  './src/core/mascot.js',
  './src/core/svg-art.js',
  './src/core/fx.js',
  './src/core/nav.js',
  './src/activities/generator.js',
  './src/activities/adventure-journey.js',
  './src/activities/arcade-games.js',
  './src/activities/iq-engines.js',
  './src/activities/quiz.js',
  './src/activities/memory.js',
  './src/activities/dragdrop.js',
  './src/activities/tracing.js',
  './src/activities/ordering.js',
  './src/activities/painting.js',
  './src/activities/balloon-pop.js',
  './src/main.js',
  './assets/audio/kid/letter-alef.mp3',
  './assets/audio/kid/letter-be.mp3',
  './assets/audio/kid/letter-che.mp3',
  './assets/audio/kid/letter-dal.mp3',
  './assets/audio/kid/letter-eyn.mp3',
  './assets/audio/kid/letter-fe.mp3',
  './assets/audio/kid/letter-gaf.mp3',
  './assets/audio/kid/letter-ghaf.mp3',
  './assets/audio/kid/letter-gheyn.mp3',
  './assets/audio/kid/letter-he.mp3',
  './assets/audio/kid/letter-heh.mp3',
  './assets/audio/kid/letter-jim.mp3',
  './assets/audio/kid/letter-kaf.mp3',
  './assets/audio/kid/letter-khe.mp3',
  './assets/audio/kid/letter-lam.mp3',
  './assets/audio/kid/letter-mim.mp3',
  './assets/audio/kid/letter-nun.mp3',
  './assets/audio/kid/letter-pe.mp3',
  './assets/audio/kid/letter-re.mp3',
  './assets/audio/kid/letter-sad.mp3',
  './assets/audio/kid/letter-se.mp3',
  './assets/audio/kid/letter-shin.mp3',
  './assets/audio/kid/letter-sin.mp3',
  './assets/audio/kid/letter-ta.mp3',
  './assets/audio/kid/letter-te.mp3',
  './assets/audio/kid/letter-vav.mp3',
  './assets/audio/kid/letter-ye.mp3',
  './assets/audio/kid/letter-za.mp3',
  './assets/audio/kid/letter-zad.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') return caches.match('./index.html');
        return new Response('', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
