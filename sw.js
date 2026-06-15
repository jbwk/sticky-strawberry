// Sticky Strawberry — Service Worker
// Caches all game assets on install so the game works offline.

const CACHE = 'sticky-strawberry-v1';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  // Audio files (will be cached if present)
  './assets/audio/full_song.mp3',
  './assets/audio/instrumental_loop.mp3',
  './assets/audio/tap_squish.mp3',
  './assets/audio/sticky_peel.mp3',
  './assets/audio/falling_whistle.mp3',
  './assets/audio/pillow_bounce.mp3',
  './assets/audio/basket_pop.mp3',
  './assets/audio/teddy_hug.mp3',
  './assets/audio/head_boop.mp3',
  './assets/audio/giggle.mp3',
  './assets/audio/bedtime_chime.mp3',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      // Cache what exists; ignore missing audio placeholders
      return Promise.allSettled(
        PRECACHE.map(url => cache.add(url).catch(() => {}))
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(resp => {
      // Cache successful GET responses for same-origin assets
      if (resp.ok && e.request.method === 'GET' && e.request.url.startsWith(self.location.origin)) {
        const clone = resp.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
      }
      return resp;
    })).catch(() => caches.match('./index.html'))
  );
});
