// Service Worker for Valentine's Photo Showcase
const CACHE_NAME = 'valentine-showcase-v1';
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/page.html',
  '/style.css',
  '/style2.css',
  '/main-modern.js',
  '/js/utils.js',
  '/js/heartAnimation.js',
  '/js/themeManager.js',
  '/main2.js',
  '/1.png',
  '/2.png',
  '/3.jpg',
  '/manifest.json'
];

// Install event - cache static resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static resources');
        return cache.addAll(STATIC_RESOURCES);
      })
      .catch(error => {
        console.error('Failed to cache resources:', error);
        // Don't fail installation if some resources can't be cached
        return Promise.resolve();
      })
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
  );
  
  // Take control of all clients immediately
  return self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('Serving from cache:', event.request.url);
          return cachedResponse;
        }

        console.log('Fetching from network:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone response for caching
            const responseClone = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              })
              .catch(error => {
                console.error('Failed to cache response:', error);
              });

            return response;
          })
          .catch(error => {
            console.error('Network request failed:', error);
            
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            throw error;
          });
      })
  );
});

// Handle background sync for future offline functionality
self.addEventListener('sync', event => {
  console.log('Background sync:', event.tag);
  // Could be used for offline actions like saving user preferences
});

// Handle push notifications (for future features)
self.addEventListener('push', event => {
  console.log('Push notification received');
  // Could be used for Valentine's reminders or updates
});

// Handle messages from main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker loaded');