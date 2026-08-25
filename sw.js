// Minimal service worker: caches the app shell (static pages + shared
// scripts + manifest + icons) so the site meets PWA install criteria.
// Deliberately does NOT cache or queue Supabase data — sync.js still
// needs a live connection for reads/writes; this only makes the app
// shell itself load offline.
const CACHE_NAME = 'row-shell-v1';
const SHELL_ASSETS = [
  'index.html',
  'habits.html',
  'gym.html',
  'health.html',
  'po-water.html',
  'topbar.js',
  'sync.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
