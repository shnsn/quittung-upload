// Service Worker — immer neueste Version laden
const CACHE = 'quittung-v1.4';

self.addEventListener('install', e => {
  self.skipWaiting(); // sofort aktivieren, nicht auf Tab-Schließen warten
});

self.addEventListener('activate', e => {
  // Alte Caches löschen
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim()) // alle offenen Tabs übernehmen
  );
});

self.addEventListener('fetch', e => {
  // Network-first: immer aktuellste Version versuchen
  e.respondWith(
    fetch(e.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request)) // offline: aus Cache
  );
});
