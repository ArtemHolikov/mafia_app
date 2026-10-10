const CACHE_NAME = "mafia-manager-v1";
const APP_SHELL_URL = new URL("./", self.registration.scope).toString();

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async (cache) => {
        const shellResponse = await fetch(APP_SHELL_URL);
        if (!shellResponse.ok) {
          throw new Error(`Unable to cache app shell: ${shellResponse.status}`);
        }
        await cache.put(APP_SHELL_URL, shellResponse.clone());

        const shellHtml = await shellResponse.text();
        const assetPaths = Array.from(
          shellHtml.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css))["']/g),
          (match) => match[1],
        );
        const assetUrls = assetPaths
          .map((path) => new URL(path, APP_SHELL_URL))
          .filter((url) => url.origin === self.location.origin);

        await Promise.all(
          assetUrls.map(async (url) => {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Unable to cache app asset: ${url.pathname}`);
            }
            await cache.put(url, response);
          }),
        );
      })
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter(
              (cacheName) =>
                cacheName.startsWith("mafia-manager-") &&
                cacheName !== CACHE_NAME,
            )
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);

  if (request.method !== "GET" || requestUrl.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            try {
              const cache = await caches.open(CACHE_NAME);
              await cache.put(APP_SHELL_URL, response.clone());
            } catch (error) {
              console.error("Unable to update the cached app shell:", error);
            }
            return response;
          }
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match(APP_SHELL_URL)) || response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const appShell = await cache.match(APP_SHELL_URL);
          if (appShell) {
            return appShell;
          }
          throw new Error("The app shell is not available offline.");
        }),
    );
    return;
  }

  if (!["script", "style", "image", "font"].includes(request.destination)) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkResponse = fetch(request)
        .then(async (response) => {
          if (response.ok) {
            try {
              const cache = await caches.open(CACHE_NAME);
              await cache.put(request, response.clone());
            } catch (error) {
              console.error("Unable to cache app resource:", error);
            }
          }
          return response;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkResponse;
    }),
  );
});
