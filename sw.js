
const CACHE_VERSION = 'v12';
const CACHE_NAME = 'bg-cache-' + CACHE_VERSION;
const CORE = [
  '/', '/index.html', '/menu.html',
  '/styles.css?v=v12',
  '/manifest.webmanifest',
  '/apple-touch-icon.png', '/icon-192.png', '/icon-512.png', '/avatar.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => (k.startsWith('bg-cache-') && k!==CACHE_NAME)?caches.delete(k):null))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const req = e.request;
  const html = req.headers.get('accept')?.includes('text/html');
  if (html) {
    e.respondWith(fetch(req).then(res => {const cp=res.clone(); caches.open(CACHE_NAME).then(c=>c.put(req,cp)); return res;})
      .catch(()=>caches.match(req)));
    return;
  }
  e.respondWith(caches.match(req).then(cached => {
    const net = fetch(req).then(res => {const cp=res.clone(); caches.open(CACHE_NAME).then(c=>c.put(req,cp)); return res;}).catch(()=>cached);
    return cached || net;
  }));
});
