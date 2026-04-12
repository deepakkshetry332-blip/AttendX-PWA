// AttendX Service Worker v1.0
const CACHE_NAME = ‘attendx-v1’;
const ASSETS_TO_CACHE = [
‘/’,
‘/index.html’,
‘/manifest.json’
];

// Install event - cache core assets
self.addEventListener(‘install’, event => {
event.waitUntil(
caches.open(CACHE_NAME).then(cache => {
return cache.addAll(ASSETS_TO_CACHE);
})
);
self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener(‘activate’, event => {
event.waitUntil(
caches.keys().then(keys =>
Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
)
);
self.clients.claim();
});

// Fetch event - network first, fall back to cache
self.addEventListener(‘fetch’, event => {
// Skip non-GET and Firebase/Google API requests
if (event.request.method !== ‘GET’) return;
if (event.request.url.includes(‘firebaseapp.com’) ||
event.request.url.includes(‘googleapis.com’) ||
event.request.url.includes(‘gstatic.com’)) return;

event.respondWith(
fetch(event.request)
.then(response => {
const clone = response.clone();
caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
return response;
})
.catch(() => caches.match(event.request))
);
});

// Background sync placeholder
self.addEventListener(‘sync’, event => {
if (event.tag === ‘sync-attendance’) {
// Future: sync offline attendance records
console.log(’[SW] Background sync triggered’);
}
});