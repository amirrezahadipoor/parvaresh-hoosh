const CACHE_NAME = 'parvaresh-hoosh-v19-persian-voice';
const PRECACHE = [
  './', './index.html', './manifest.webmanifest', './privacy.html', './terms.html',
  './content/curriculum.json', './content/content_manifest.json',
  './assets/icon.svg', './assets/icon-192.png', './assets/icon-512.png',
  './vendor/gsap.min.js',
  // Bundled Persian typeface. Without these in the precache the app fell back to
  // Tahoma on a cold offline start, which looks wrong for Persian text.
  './assets/fonts/Vazirmatn-Regular.woff2',
  './assets/fonts/Vazirmatn-Medium.woff2',
  './assets/fonts/Vazirmatn-Bold.woff2',
  './assets/fonts/Vazirmatn-ExtraBold.woff2',
  './assets/fonts/Vazirmatn-Black.woff2',
  // Bundled Persian narration (Android WebView has no fa-IR speech voice).
  './assets/audio/lesson-R-L1-L01.mp3',
  './assets/audio/lesson-R-L1-L02.mp3',
  './assets/audio/lesson-R-L1-L03.mp3',
  './assets/audio/lesson-R-L1-L04.mp3',
  './assets/audio/lesson-R-L1-L05.mp3',
  './assets/audio/lesson-R-L1-L06.mp3',
  './assets/audio/lesson-R-L1-L07.mp3',
  './assets/audio/lesson-R-L1-L08.mp3',
  './assets/audio/letter-alef.mp3',
  './assets/audio/letter-be.mp3',
  './assets/audio/letter-che.mp3',
  './assets/audio/letter-dal.mp3',
  './assets/audio/letter-eyn.mp3',
  './assets/audio/letter-fe.mp3',
  './assets/audio/letter-gaf.mp3',
  './assets/audio/letter-ghaf.mp3',
  './assets/audio/letter-gheyn.mp3',
  './assets/audio/letter-he.mp3',
  './assets/audio/letter-heh.mp3',
  './assets/audio/letter-jim.mp3',
  './assets/audio/letter-kaf.mp3',
  './assets/audio/letter-khe.mp3',
  './assets/audio/letter-lam.mp3',
  './assets/audio/letter-mim.mp3',
  './assets/audio/letter-nun.mp3',
  './assets/audio/letter-pe.mp3',
  './assets/audio/letter-re.mp3',
  './assets/audio/letter-sad.mp3',
  './assets/audio/letter-se.mp3',
  './assets/audio/letter-shin.mp3',
  './assets/audio/letter-sin.mp3',
  './assets/audio/letter-ta.mp3',
  './assets/audio/letter-te.mp3',
  './assets/audio/letter-vav.mp3',
  './assets/audio/letter-ye.mp3',
  './assets/audio/letter-za.mp3',
  './assets/audio/letter-zad.mp3',
  './assets/audio/letter-zal.mp3',
  './assets/audio/letter-ze.mp3',
  './assets/audio/letter-zhe.mp3',
  './assets/audio/topic-addition.mp3',
  './assets/audio/topic-animals.mp3',
  './assets/audio/topic-art.mp3',
  './assets/audio/topic-classify.mp3',
  './assets/audio/topic-counting.mp3',
  './assets/audio/topic-create.mp3',
  './assets/audio/topic-emotions.mp3',
  './assets/audio/topic-logic.mp3',
  './assets/audio/topic-memory.mp3',
  './assets/audio/topic-music.mp3',
  './assets/audio/topic-reading.mp3',
  './assets/audio/topic-seasons.mp3',
  './assets/audio/topic-senses.mp3',
  './assets/audio/topic-sentence.mp3',
  './assets/audio/topic-sequence.mp3',
  './assets/audio/topic-shapes.mp3',
  './assets/audio/topic-subtraction.mp3',
  './assets/audio/topic-words.mp3'
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
