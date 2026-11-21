/**
 * Service Worker: chơi offline sau lần tải đầu.
 * Chỉ cache các tài nguyên tĩnh của game (không cache API bảng xếp hạng).
 */
const CACHE = 'dieu-say-gio-v1';

const SHELL = [
  './',
  './index.html',
  './style.css',
  './manifest.webmanifest',
  './assets/icon.svg',
  './src/main.js',
  './src/config.js',
  './src/i18n.js',
  './src/core/game.js',
  './src/core/input.js',
  './src/core/physics.js',
  './src/core/progression.js',
  './src/core/perks.js',
  './src/core/stamps.js',
  './src/entities/rocket.js',
  './src/entities/laserPillar.js',
  './src/entities/energyCell.js',
  './src/entities/ghosts.js',
  './src/graphics/starfield.js',
  './src/graphics/weather.js',
  './src/graphics/scenicLandmarks.js',
  './src/graphics/nightLights.js',
  './src/graphics/particles.js',
  './src/graphics/renderer.js',
  './src/graphics/themes.js',
  './src/audio/audioSynth.js',
  './src/ui/hud.js',
  './src/ui/infoPanels.js',
  './src/ui/storyOverlay.js',
  './src/ui/leaderboardModal.js',
  './src/ui/shareCard.js',
  './src/ui/stampBook.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Không đụng tới backend bảng xếp hạng / API ngoài
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.ok && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
