const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

//the files that we will cache
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/index.js",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/assets/css/styles.css",
  "/assets/images/icons/icon-192x192.png",
  "/assets/images/icons/icon-512x512.png",
];

self.addEventListener("install", function(evt) {
  evt.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
          console.log("Your files were pre-cached successfully!");
          return cache.addAll(FILES_TO_CACHE);
      })
  );
  self.skipWaiting();
});
self.addEventListener("activate", function(evt) {
  evt.waitUntil(
      caches.keys().then(keyList => {
          return Promise.all(
              keyList.map(key => {
                  if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                      console.log("Removing old cache data", key);
                      return caches.delete(key);
                  }
              })
          );
      })
  );
  self.clients.claim();
});
// fetch
self.addEventListener("fetch", function(evt) {
  // cache successful requests to the API
  if (evt.request.url.includes("/api/")) {
      evt.respondWith(
          caches.open(DATA_CACHE_NAME).then(cache => {
              return fetch(evt.request)
                  .then(response => {
                      // If the response was good, clone it and store it in the cache.
                      if (response.status === 200) {
                          cache.put(evt.request.url, response.clone());
                      }
                      return response;
                  })
                  .catch(err => {
                      // Network request failed, try to get it from the cache.
                      return cache.match(evt.request);
                  });
          }).catch(err => console.log(err))
      );
      return;
  }
  // if the request is not for the API, serve static assets using "offline-first" approach.
  // see https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-falling-back-to-network
  evt.respondWith(
      fetch(evt.request).catch(function() {
          return caches.match(evt.request).then(function(response) {
              if (response) {
                  return response;
              } else if (evt.request.headers.get("accept").includes("text/html")) {
                  return caches.match("/");
              }
          });
      })
  )
});