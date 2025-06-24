// Nama cache untuk application shell
const CACHE_NAME = 'story-app-shell-v1';
// Nama cache untuk konten dinamis
const DATA_CACHE_NAME = 'story-app-data-v1';

// Daftar aset yang akan di-cache (application shell)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/index.css',
  '/src/App.css',
  '/src/main.js',
  '/src/App.js',
  '/src/components/Navbar.js',
  '/src/components/LoadingIndicator.js',
  '/src/components/StoryItem.js',
  '/src/components/NotificationToggle.js',
  '/src/utils/auth.js',
  '/src/utils/notification.js',
  '/src/pages/HomePage.js',
  '/src/pages/LoginPage.js',
  '/src/pages/RegisterPage.js',
  '/src/pages/AddStoryPage.js',
  '/src/pages/DetailStoryPage.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  '/icons/notification-icon.png',
  '/icons/badge-icon.png',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

// Install event - cache application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log('Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
    .then(() => self.clients.claim())
  );
});

// Fetch event - network first with cache fallback for API requests, cache first for static assets
self.addEventListener('fetch', (event) => {
  // Handle API requests (network first, then cache)
  if (event.request.url.includes('story-api.dicoding.dev')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response to store in cache
          const clonedResponse = response.clone();
          caches.open(DATA_CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          return response;
        })
        .catch(() => {
          // If network fails, try to get from cache
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Jika tidak ada di cache, tampilkan halaman offline
              if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match('/offline.html');
              }
              // Untuk API request yang gagal dan tidak ada di cache
              return new Response(
                JSON.stringify({ 
                  error: true, 
                  message: 'Tidak dapat terhubung ke server. Menggunakan data lokal.' 
                }),
                { 
                  headers: { 'Content-Type': 'application/json' } 
                }
              );
            });
        })
    );
  } else {
    // For non-API requests (static assets), use cache first, then network
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request)
            .then((fetchResponse) => {
              // Add fetched files to cache if they're part of our static assets
              if (STATIC_ASSETS.some(asset => 
                event.request.url.endsWith(asset) || 
                event.request.url.includes(asset)) && 
                event.request.method === 'GET') {  // Hanya cache permintaan GET
                return caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                  });
              }
              return fetchResponse;
            });
        })
        .catch((error) => {
          console.log('Fetch failed:', error);
          // Return a custom offline page if needed
          // return caches.match('/offline.html');
        })
    );
  }
});

// Push notification handler (existing code)
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/notification-icon.png',
    badge: '/icons/badge-icon.png',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    self.clients.openWindow(event.notification.data.url)
  );
});


