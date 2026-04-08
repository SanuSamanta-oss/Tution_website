const CACHE_NAME = "genz-biolab-cache";

const assetsToCache = [
  "./",
  "./index.html",
  "./404.html",
  "./404.css"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        assetsToCache.map(async (url) => {
          try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed ${url}`);
            await cache.put(url, response);
          } catch (err) {
            console.error("Cache failed:", url);
          }
        })
      );
    })
  );
});

self.addEventListener("activate", event => {
  return self.clients.claim();
});


// 🔥 FIXED FETCH HANDLER (IMPORTANT)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(res => res)
      .catch(() => {
        // Handle HTML pages
        if (event.request.destination === "document") {
          return caches.match("./404.html");
        }

        // Handle CSS specifically
        if (event.request.destination === "style") {
          return caches.match("./404.css");
        }

        // Fallback: try cache anyway
        return caches.match(event.request);
      })
  );
});