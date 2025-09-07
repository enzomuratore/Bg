// --- sw.js (BG) ---
const CACHE_VERSION = 'v9';               // <— PODBIJAJ przy każdym deployu
const CACHE_NAME = 'bg-cache-' + CACHE_VERSION;

// Zasoby krytyczne
const CORE = [
  '/', '/index.html', '/menu.html',
  '/styles.css?v=' + CACHE_VERSION,
  '/manifest.webmanifest',
  '/apple-touch-icon.png', '/icon-192.png', '/icon-512.png'
];

// Instalacja: wrzuć do cache i aktywuj od razu
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE)));
  self.skipWaiting();            // <— ważne
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => (k.startsWith('bg-cache-') && k !== CACHE_NAME) ? caches.delete(k) : null)
    ))
  );
  self.clients.claim();          // <— ważne
});

// Strategia:
// - HTML = network-first (zawsze pobierz najnowsze, a jak brak sieci: cache)
// - reszta = stale-while-revalidate (szybko z cache, z tła odśwież)
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
