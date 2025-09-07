self.addEventListener('install', event => {
  event.waitUntil(caches.open('bg-cache-v1').then(cache => cache.addAll([
    '/','/index.html','/styles.css','/icon-192.png','/icon-512.png','/apple-touch-icon.png','/avatar.jpg','/manifest.webmanifest'
  ])));
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});