/* Gideon Crops service worker. The scanner and the symptom database work offline. */
const VERSION = "gideon-crops-v2";
const APP_SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;

const PRECACHE = [
  "/",
  "/scan",
  "/offline",
  "/data/symptoms.json",
  "/img/core-img/leaf.png",
  "/img/core-img/favicon.ico",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(APP_SHELL)
      .then((cache) =>
        Promise.all(
          PRECACHE.map((url) =>
            cache.add(new Request(url, { cache: "reload" })).catch(() => {
              /* a missing optional asset must not block the install */
            }),
          ),
        ),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== APP_SHELL && key !== RUNTIME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/img/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/fonts/") ||
    /\.(?:css|js|woff2?|ttf|eot|svg|png|jpg|jpeg|webp|ico)$/.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache authenticated API traffic or anything with a session.
  if (url.pathname.startsWith("/api/")) return;

  // The symptom database is the brain of the offline scanner.
  if (url.pathname === "/data/symptoms.json") {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(APP_SHELL).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => cached);
        return cached || network;
      }),
    );
    return;
  }

  // Scan page and app shell: network first, cache when the network fails.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => {
            if (cached) return cached;
            if (url.pathname === "/scan" || url.pathname === "/") {
              return caches.match(url.pathname).then((shell) => shell || caches.match("/scan"));
            }
            return caches.match("/offline").then((offline) => offline || caches.match("/scan"));
          }),
        ),
    );
    return;
  }

  // Static assets: cache first with a background refresh.
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          fetch(request)
            .then((response) => caches.open(RUNTIME).then((cache) => cache.put(request, response)))
            .catch(() => {});
          return cached;
        }
        return fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(RUNTIME).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => cached);
      }),
    );
  }
});

self.addEventListener("message", (event) => {
  if (event.data === "gideon:skip-waiting") {
    self.skipWaiting();
  }
});
