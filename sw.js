const CACHE_NAME = 'parvaresh-hoosh-v2-shell';
const PRECACHE = [
    './',
    './index.html',
    './manifest.webmanifest',
    './privacy.html',
    './terms.html',
    './src/styles/main.css',
    './src/data/alphabet.js',
    './src/data/words.js',
    './src/data/math-data.js',
    './src/data/world-data.js',
    './src/data/curriculum.js',
    './src/data/lesson-guide.js',
    './content/curriculum.json',
    './content/content_manifest.json',
    './src/core/config.js',
    './src/core/audio.js',
    './src/core/storage.js',
    './src/core/engagement.js',
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
    './assets/fonts/Vazirmatn-Regular.woff2',
    './assets/fonts/Vazirmatn-Medium.woff2',
    './assets/fonts/Vazirmatn-Bold.woff2',
    './assets/fonts/Vazirmatn-ExtraBold.woff2',
    './assets/fonts/Vazirmatn-Black.woff2',
    './assets/icon-192.png',
    './assets/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
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
                if (response && response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                }
                return response;
            }).catch(() => caches.match('./index.html'));
        })
    );
});
