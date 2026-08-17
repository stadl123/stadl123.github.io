/* Eisenbuch Service Worker — Netz zuerst, Cache als Ersatz (macht die App offline nutzbar) */
const CACHE = 'eisenbuch-app-v1';
self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then((r) => {
      const copy = r.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
      return r;
    }).catch(() =>
      caches.match(e.request).then((m) => m || new Response('Offline', { status: 503 }))
    )
  );
});
