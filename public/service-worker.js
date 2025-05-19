// Service worker for PDF Splitter application
// Handles offline caching of static assets and application code

const CACHE_NAME = 'pdf-splitter-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/file.svg',
  '/favicon.ico',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(err => console.error('Service Worker install error:', err))
  );
  
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated and ready to handle fetches');
      return self.clients.claim();
    })
  );
});

// Fetch event - respond with cached resource if available, otherwise fetch from network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    // First try the network
    fetch(event.request)
      .then(response => {
        // Clone the response since it can only be consumed once
        const responseCopy = response.clone();
        
        // Open the cache and store a copy of the response
        if (event.request.method === 'GET') {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseCopy);
          });
        }
        
        return response;
      })
      .catch(() => {
        // If network fails, try the cache
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If it's an API request or another resource we didn't cache,
          // return a simple offline message for HTML requests
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/');
          }
          
          // For other resources that aren't in the cache, return a basic error
          return new Response('Network error, you appear to be offline', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});
