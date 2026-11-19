// Offline support: the app shell is cached so Bill Ledger opens without a connection.
// Bump CACHE when you change any file below so phones pick up the new version.
const CACHE = 'bill-ledger-v5';
const SHELL = ['./', './index.html', './config.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Only same-origin files, Google Fonts and the Firebase SDK files are cached.
  // Everything else (bill reading, Firebase sign-in and database calls) always goes to the network.
  const cacheable = url.origin === location.origin || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com' ||
    (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/'));
  if (!cacheable) return;
  // Network first for the page and its config, so updates arrive; cache fallback offline.
  if (req.mode === 'navigate' || url.pathname.endsWith('/config.js')) {
    const key = req.mode === 'navigate' ? './index.html' : req;
    e.respondWith(fetch(req).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(key, copy)); } return r; })
      .catch(() => caches.match(key)));
    return;
  }
  // Cache first for static files and fonts.
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok) {
      const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy));
    }
    return r;
  })));
});
