// Service Worker for Page Caching (Next.js-like)
const CACHE_NAME = 'uiug2026-v3'; // Bumped version to clear old redirect caches
const RUNTIME_CACHE = 'uiug2026-runtime-v3';

// Helper function to fetch and follow redirects (Safari-compatible)
async function fetchWithRedirects(url) {
  const response = await fetch(url, { redirect: 'follow' });
  // Only return if it's a final response (not a redirect)
  // Check both status and redirected flag
  if (response.status >= 200 && response.status < 300 && 
      response.type === 'basic' && !response.redirected) {
    return response;
  }
  return response;
}

// Pages to cache immediately
const STATIC_PAGES = [
  '/',
  '/speakers',
  '/projects',
];

// Install event - cache static pages (with redirect handling for Safari)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Use addAll but handle redirects properly
      const cachePromises = STATIC_PAGES.map(async (url) => {
        try {
          const response = await fetchWithRedirects(url);
          // Only cache if it's a successful final response (not a redirect)
          // Check redirected flag to ensure it's not a redirect response
          if (response.status === 200 && response.type === 'basic' && !response.redirected) {
            await cache.put(url, response);
          }
        } catch (error) {
          console.log(`Failed to cache ${url}:`, error);
        }
      });
      await Promise.all(cachePromises);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network (Safari-compatible)
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip non-HTML requests (images, fonts, etc. handled by browser cache)
  if (!event.request.headers.get('accept')?.includes('text/html')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(async (cachedResponse) => {
      // Check if cached response is valid (not a redirect)
      const isValidCachedResponse = cachedResponse && 
        cachedResponse.status === 200 && 
        cachedResponse.type === 'basic' &&
        !cachedResponse.redirected;

      // Return cached version if available and valid
      if (isValidCachedResponse) {
        // Update cache in background (with redirect handling)
        fetch(event.request, { redirect: 'follow' })
          .then((response) => {
            // Only cache final successful responses (not redirects)
            if (response && response.status === 200 && response.type === 'basic' && !response.redirected) {
              const responseToCache = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
          })
          .catch(() => {
            // Network failed, keep using cache
          });
        return cachedResponse;
      }

      // If cached response is invalid (redirect) or doesn't exist, fetch from network
      // Fetch from network and cache (follow redirects)
      try {
        const response = await fetch(event.request, { redirect: 'follow' });
        
        // Only cache final successful responses (not redirects)
        // Safari doesn't allow caching redirect responses
        if (response && response.status === 200 && response.type === 'basic' && !response.redirected) {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        
        return response;
      } catch (error) {
        // Network failed, return offline page if available
        const fallback = await caches.match('/');
        return fallback || new Response('Offline', { status: 503 });
      }
    })
  );
});

