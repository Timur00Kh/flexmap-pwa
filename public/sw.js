/* FlexMap offline shell. Bump CACHE_VERSION when the shell changes. */
const CACHE_VERSION = 'flexmap-pwa-v1';
const SCOPE_URL = new URL('/flexmap-pwa/', self.location.origin);
const SHELL = [
  new URL('./', SCOPE_URL).href,
  new URL('manifest.webmanifest', SCOPE_URL).href,
  new URL('icon-192.png', SCOPE_URL).href,
  new URL('icon-512.png', SCOPE_URL).href,
  new URL('maskable-512.png', SCOPE_URL).href,
];
const MAX_RUNTIME_ENTRIES = 160;

self.addEventListener('install', (event) => {
  // addAll is atomic: a failed shell fetch leaves the previous worker/cache intact.
  event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(SHELL)));
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith('flexmap-pwa-') && name !== CACHE_VERSION).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(SCOPE_URL.href)) return;
  const isNavigation = request.mode === 'navigate';
  const isAppAsset = ['script', 'style', 'image', 'font', 'worker', 'manifest'].includes(request.destination)
    || url.pathname.includes('/_next/static/');
  if (!isNavigation && !isAppAsset) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    if (!isNavigation) {
      const hit = await cache.match(request);
      if (hit) return hit;
    }

    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        await cache.put(request, response.clone());
        const keys = await cache.keys();
        if (keys.length > MAX_RUNTIME_ENTRIES) {
          await Promise.all(keys.slice(0, keys.length - MAX_RUNTIME_ENTRIES).map((key) => cache.delete(key)));
        }
      }
      return response;
    } catch {
      const hit = await cache.match(request);
      if (hit) return hit;
      if (isNavigation) {
        const shell = await cache.match(new URL('./', SCOPE_URL).href);
        if (shell) return shell;
      }
      return new Response('Offline', { status: 503, statusText: 'Offline', headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
  })());
});
