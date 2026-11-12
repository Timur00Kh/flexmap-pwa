/* postbuild replaces BUILD_HASH with the content hash for this export. */
const BUILD_HASH = '__BUILD_HASH__';
const CACHE_VERSION = `flexmap-pwa-v2-${BUILD_HASH}`;
const SCOPE_URL = new URL('/flexmap-pwa/', self.location.origin);
const SHELL = [
  new URL('./', SCOPE_URL).href,
  new URL('en/', SCOPE_URL).href,
  new URL('ru/', SCOPE_URL).href,
  new URL('manifest.webmanifest', SCOPE_URL).href,
  new URL('icon-192.png', SCOPE_URL).href,
  new URL('icon-512.png', SCOPE_URL).href,
  new URL('maskable-512.png', SCOPE_URL).href,
];
const MAX_RUNTIME_ENTRIES = 160;

self.addEventListener('install', (event) => {
  // addAll is atomic: a failed shell fetch leaves the previous worker/cache intact.
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    const manifestResponse = await fetch(new URL('precache.json', SCOPE_URL), { cache: 'no-store' });
    if (!manifestResponse.ok) throw new Error(`Precache manifest failed: ${manifestResponse.status}`);
    const manifest = await manifestResponse.json();
    if (manifest.version !== BUILD_HASH || !Array.isArray(manifest.assets)) throw new Error('Invalid precache manifest');
    const assets = [...new Set(manifest.assets.map((assetPath) => new URL(assetPath, SCOPE_URL).href))];
    if (assets.some((url) => !url.startsWith(SCOPE_URL.href))) throw new Error('Precache asset outside app scope');
    // Install succeeds only after every shell and JS/CSS asset is stored.
    // The previous worker remains active if any request fails.
    await cache.addAll(assets);
  })());
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
          const removable = keys.filter((key) => {
            const keyUrl = new URL(key.url);
            return !SHELL.includes(key.url) && !keyUrl.pathname.includes('/_next/static/');
          });
          const excess = keys.length - MAX_RUNTIME_ENTRIES;
          if (excess > 0 && removable.length) {
            await Promise.all(removable.slice(0, excess).map((key) => cache.delete(key)));
          }
        }
      }
      return response;
    } catch {
      const hit = await cache.match(request);
      if (hit) return hit;
      if (isNavigation) {
        const fallback = /\/ru(?:\/|$)/.test(url.pathname) ? SHELL[2] : /\/en(?:\/|$)/.test(url.pathname) ? SHELL[1] : SHELL[0];
        const shell = await cache.match(fallback);
        if (shell) return shell;
      }
      return new Response('Offline', { status: 503, statusText: 'Offline', headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
  })());
});
