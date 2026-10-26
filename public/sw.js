// Baharaz - Zero Second PWA - No Cache Slow - Instant Load
const CACHE_NAME = 'baharaz-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    })
  );
  self.clients.claim();
});

// ✅ Zero Second - Network First - Cache Slow করবে না
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/_next/') || event.request.url.includes('/api/')) {
    return; // Next.js + API - No SW - Fastest
  }
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});