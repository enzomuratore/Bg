self.addEventListener('install', event => {
  event.waitUntil(caches.open('bg-cache-v1').then(cache => cache.addAll([
    '/','/index.html','/styles.css','/icon-192.png','/icon-512.png','/apple-touch-icon.png','/avatar.jpg','/manifest.webmanifest'
  ])));
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});// sw.js
const CACHE_VERSION = 'v10';
const CACHE_NAME = 'bg-cache-' + CACHE_VERSION;
const CORE = [
  '/', '/index.html', '/menu.html',
  '/styles.css?v=' + CACHE_VERSION,
  '/manifest.webmanifest',
  '/apple-touch-icon.png', '/icon-192.png', '/icon-512.png', '/avatar.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => (k.startsWith('bg-cache-') && k !== CACHE_NAME) ? caches.delete(k) : null)
    ))
  );
  self.clients.claim();
});
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const isHTML = req.headers.get('accept')?.includes('text/html');
  if (isHTML) {
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }
  event.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy));
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
