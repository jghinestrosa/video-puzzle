'use strict';

/* globals caches, Promise */

var version = 'v1';
var cacheName = 'resources';

var resources = [
  '/js/main.js',
  '/css/main.css',
  'index.html',
  'favicon.ico',
  '/meta/apple-touch-icon-57x57.png',
  '/meta/apple-touch-icon-60x60.png',
  '/meta/apple-touch-icon-72x72.png',
  '/meta/apple-touch-icon-76x76.png',
  '/meta/apple-touch-icon-114x114.png',
  '/meta/apple-touch-icon-120x120.png',
  '/meta/apple-touch-icon-144x144.png',
  '/meta/apple-touch-icon-152x152.png',
  '/meta/apple-touch-icon-180x180.png',
  '/meta/favicon-32x32.png',
  '/meta/android-chrome-192x192.png',
  '/meta/favicon-96x96.png',
  '/meta/favicon-16x16.png',
  '/manifest.json',
  '/meta/safari-pinned-tab.svg',
  '/meta/mstile-144x144.png'
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
