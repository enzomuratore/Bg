
const CACHE_NAME='bg-pwa-v1';
const CORE=['/','/index.html','/styles.css','/manifest.webmanifest','/icon-192.png','/icon-512.png','/apple-touch-icon.png','/assets/avatar-256.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.headers.get('accept')?.includes('text/html')){
    e.respondWith(fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(req,copy));return res}).catch(()=>caches.match(req)));
  }else{
    e.respondWith(caches.match(req).then(res=>res||fetch(req).then(net=>{const copy=net.clone();caches.open(CACHE_NAME).then(c=>c.put(req,copy));return net})));
  }
});
