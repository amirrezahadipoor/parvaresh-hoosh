const CACHE_NAME = 'parvaresh-hoosh-v44-perf-bundle';
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
  // Bundled Persian narration (Android WebView has no fa-IR speech voice).,
    './src/data/narration-map.js',
    './assets/audio/kid/fixed-balloons.mp3',
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
    './assets/audio/kid/letter-zad.mp3',
    './assets/audio/kid/letter-zal.mp3',
    './assets/audio/kid/letter-ze.mp3',
    './assets/audio/kid/letter-zhe.mp3',
    './assets/audio/kid/praise-great.mp3',
    './assets/audio/kid/praise-lesson-done.mp3',
    './assets/audio/kid/praise-retry.mp3',
    './assets/audio/kid/praise-set.mp3',
    './assets/audio/kid/t1-01-memory.mp3',
    './assets/audio/kid/t1-02-order-size.mp3',
    './assets/audio/kid/t1-03-good-behavior.mp3',
    './assets/audio/kid/t1-04-story-order.mp3',
    './assets/audio/kid/t1-05-painting.mp3',
    './assets/audio/kid/t1-06-sort-behavior.mp3',
    './assets/audio/kid/t1-07-next-color.mp3',
    './assets/audio/kid/t1-08-next-shape.mp3',
    './assets/audio/kid/t1-09-complete-pattern.mp3',
    './assets/audio/kid/t1-10-order-words.mp3',
    './assets/audio/kid/t1-11-match-material.mp3',
    './assets/audio/kid/t1-12-shadow.mp3',
    './assets/audio/kid/t2-13-balance.mp3',
    './assets/audio/kid/t2-14-build-sentence.mp3',
    './assets/audio/kid/t2-15-smaller-number.mp3',
    './assets/audio/kid/t2-16-bigger-number.mp3',
    './assets/audio/kid/t2-17-odd-one-out.mp3',
    './assets/audio/kid/t2-18-color-purple.mp3',
    './assets/audio/kid/t2-19-opposites.mp3',
    './assets/audio/kid/t2-20-color-green.mp3',
    './assets/audio/kid/t2-21-color-red.mp3',
    './assets/audio/kid/t2-22-color-yellow.mp3',
    './assets/audio/kid/t2-23-put-in-place.mp3',
    './assets/audio/kid/t2-24-month-season.mp3',
    './assets/audio/kid/t2-25-emotion-situation.mp3',
    './assets/audio/kid/t2-26-color-blue.mp3',
    './assets/audio/kid/t2-27-plant-growth.mp3',
    './assets/audio/kid/t3-30-syllables.mp3',
    './assets/audio/kid/t3-31-friend-sad.mp3',
    './assets/audio/kid/t3-32-new-friend.mp3',
    './assets/audio/kid/t3-33-sort-animals-fruit.mp3',
    './assets/audio/kid/t3-34-remember-bells.mp3',
    './assets/audio/kid/t3-35-order-colors.mp3',
    './assets/audio/kid/t3-36-remember-tray.mp3',
    './assets/audio/kid/t3-37-black-white-mix.mp3',
    './assets/audio/kid/t3-38-how-many-shapes.mp3',
    './assets/audio/kid/t3-39-fill-blank.mp3',
    './assets/audio/kid/topic-addition.mp3',
    './assets/audio/kid/topic-animals.mp3',
    './assets/audio/kid/topic-art.mp3',
    './assets/audio/kid/topic-classify.mp3',
    './assets/audio/kid/topic-counting.mp3',
    './assets/audio/kid/topic-create.mp3',
    './assets/audio/kid/topic-emotions.mp3',
    './assets/audio/kid/topic-energy.mp3',
    './assets/audio/kid/topic-experiment.mp3',
    './assets/audio/kid/topic-logic.mp3',
    './assets/audio/kid/topic-matching.mp3',
    './assets/audio/kid/topic-measure.mp3',
    './assets/audio/kid/topic-memory.mp3',
    './assets/audio/kid/topic-music.mp3',
    './assets/audio/kid/topic-reading.mp3',
    './assets/audio/kid/topic-recycle.mp3',
    './assets/audio/kid/topic-seasons.mp3',
    './assets/audio/kid/topic-senses.mp3',
    './assets/audio/kid/topic-sentence.mp3',
    './assets/audio/kid/topic-sequence.mp3',
    './assets/audio/kid/topic-shapes.mp3',
    './assets/audio/kid/topic-subtraction.mp3',
    './assets/audio/kid/topic-time.mp3',
    './assets/audio/kid/topic-words.mp3'
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
