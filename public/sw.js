// EVisitingCard service worker — Theme 6 / PWA support.
// Strategy:
//  - Navigations: network-first, fall back to the cached /offline page.
//  - Static assets (/_next/static, icons, favicon): stale-while-revalidate.
//  - Per-business manifest (/api/<slug>/manifest): network-first, cache fallback.
//  - Never cached: auth/admin/owner pages, mutations and private APIs
//    (/api/auth, /api/businesses, /api/owner, /api/upload, /api/view,
//    /api/track, /api/places, /api/reviews, /api/compress).
//  - No personal or private data is cached — only public static assets,
//    the generic offline page, and public business manifests.
const CACHE_NAME = "evisiting-card-v2";
const OFFLINE_URL = "/offline";
const PRECACHE = [
  OFFLINE_URL,
  "/favicon.ico",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
];

const NEVER_CACHE = [
  "/api/auth",
  "/api/businesses",
  "/api/owner",
  "/api/upload",
  "/api/view",
  "/api/track",
  "/api/places",
  "/api/reviews",
  "/api/compress",
  "/api/vcard",
  "/admin",
  "/owner",
  "/login",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        Promise.allSettled(PRECACHE.map((url) => cache.add(url)))
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

function isNeverCached(url) {
  return NEVER_CACHE.some((p) => url.pathname.startsWith(p));
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // third-party: leave alone
  if (isNeverCached(url)) return; // private/mutating routes: network only

  // Navigations (page loads): network first, offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache a copy of public business pages for offline revisits.
          if (response.ok && url.pathname !== OFFLINE_URL) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // Static assets: stale-while-revalidate (fast on 2G/3G, fresh in background).
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/web-app-manifest-") ||
    url.pathname.startsWith("/favicon")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        });
        return cached || network;
      })
    );
    return;
  }

  // Per-business manifest: network first, cached copy as fallback.
  if (/^\/api\/[^/]+\/manifest$/.test(url.pathname)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});
