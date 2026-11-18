const CACHE_NAME = 'act-manager-v48-stock-linked-day-close';
const APP_SHELL = ['./', './index.html', './owner.html', './style.css', './script.js', './act-workspace-persistence.js', './fix-activation.js', './customer-contact.js', './owner-console.js', './act-control-config.js', './i18n-en.js', './pwa-install.js', './subscription-ui.js', './manifest.json', './repair-tracking.html', './icons/icon-192.png', './icons/icon-512.png'];
const FIREBASE_CDN = 'https://www.gstatic.com';
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  const firebaseModule = url.origin === FIREBASE_CDN && url.pathname.endsWith('.js');
  if (!sameOrigin && !firebaseModule) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    if (url.pathname.endsWith('/act-control-config.js')) {
      try {
        const fresh = await fetch(request, { cache: 'no-store' });
        if (fresh && fresh.ok) await cache.put(request, fresh.clone());
        return fresh;
      } catch (error) {
        const fallbackConfig = await cache.match(request);
        if (fallbackConfig) return fallbackConfig;
        throw error;
      }
    }
    const isAppFile = request.mode === 'navigate' || /\.(?:js|css|html|json)$/.test(url.pathname) || url.pathname.endsWith('/');
    if (isAppFile && sameOrigin) {
      try {
        const fresh = await fetch(request, { cache: 'no-cache' });
        if (fresh && fresh.ok) { await cache.put(request, fresh.clone()); return fresh; }
      } catch (error) { /* offline: fall back to cache below */ }
    }
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok && (response.type === 'basic' || response.type === 'cors')) await cache.put(request, response.clone());
      return response;
    } catch (error) {
      if (sameOrigin) {
        const fallback = await cache.match('./index.html');
        if (fallback) return fallback;
      }
      throw error;
    }
  })());
});
