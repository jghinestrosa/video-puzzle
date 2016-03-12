'use strict';

var version = 'v1';
var cacheName = 'resources';

// TODO: Add the favicon when it's made
var resources = [
  '/js/main.js',
  '/css/main.css',
  'index.html'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches
      .open(version + cacheName)
      .then(function(cache) {
        cache.addAll(resources);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys()
      .then(function(cacheNames) {
        return Promise.all(cacheNames.map(function(cacheName) {
          if (cacheName.indexOf(version) !== 0) {
            return caches.delete(cacheName);
          }
        }));
      }));
});

self.addEventListener('fetch', function(event) {
  var request = event.request;

  event.respondWith(caches
    .match(request)
    .then(function(cached) {
      var networked = fetch(request)
        .then(function(response) {
          caches.open(version + cacheName)
            .then(function(cache) {
              cache.put(request, response.clone());
            });

          return response;
        });

        return cached || networked;
    })
  );
});
