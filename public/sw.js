const CACHE_NAME = 'blisslearn-v1';
const urlsToCache = [
  '/',
  '/offline',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
  '/grid.svg',
  '/globe.svg'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Stratégie de cache : Network First, fallback to cache
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') return;
  
  // Ignorer les requêtes API
  if (event.request.url.includes('/api/')) return;
  
  // Ignorer les requêtes d'images Google pour éviter les erreurs 429
  if (event.request.url.includes('googleusercontent.com')) return;
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Vérifier que la réponse est valide
        if (!response || response.status !== 200) {
          throw new Error('Invalid response');
        }
        
        // Cache les ressources statiques
        if (
          event.request.url.includes('.css') ||
          event.request.url.includes('.js') ||
          event.request.url.includes('.svg') ||
          event.request.url.includes('.png') ||
          event.request.url.includes('.ico')
        ) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseClone))
            .catch((error) => {
              console.warn('Failed to cache response:', error);
            });
        }
        return response;
      })
      .catch((error) => {
        console.log('Fetch failed, trying cache:', error);
        // Fallback vers le cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            // Si pas de cache, retourner la page offline pour les pages HTML
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/offline');
            }
            // Retourner une réponse vide pour éviter l'erreur "Failed to convert value to 'Response'"
            return new Response('', { status: 404, statusText: 'Not Found' });
          })
          .catch((cacheError) => {
            console.error('Cache match failed:', cacheError);
            // Retourner une réponse d'erreur valide
            return new Response('', { status: 404, statusText: 'Not Found' });
          });
      })
  );
}); 