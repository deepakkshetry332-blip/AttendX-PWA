// AttendX Service Worker v1.0
const CACHE_NAME = ‘attendx-v1’;
const OFFLINE_URL = ‘/offline.html’;

// Files to cache for offline shell
const SHELL_ASSETS = [
‘/’,
‘/index.html’,
‘/offline.html’,
‘/manifest.json’,
‘https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap’
];

// Install - cache shell
self.addEventListener(‘install’, event => {
event.waitUntil(
caches.open(CACHE_NAME).then(cache => {
return cache.addAll(SHELL_ASSETS).catch(() => {
// Silently fail for external resources
return cache.addAll([’/’, ‘/index.html’]);
});
}).then(() => self.skipWaiting())
);
});

// Activate - clean old caches
self.addEventListener(‘activate’, event => {
event.waitUntil(
caches.keys().then(keys =>
Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
).then(() => self.clients.claim())
);
});

// Fetch strategy:
// - HTML pages: Network first, fallback to cache, fallback to offline page
// - Firebase/API: Network only (can’t work offline)
// - Fonts/CSS/JS: Cache first, then network
self.addEventListener(‘fetch’, event => {
const { request } = event;
const url = new URL(request.url);

// Skip non-GET and Firebase requests (auth, firestore)
if (request.method !== ‘GET’) return;
if (url.hostname.includes(‘firebase’) ||
url.hostname.includes(‘firestore’) ||
url.hostname.includes(‘googleapis.com’) && url.pathname.includes(‘firestore’)) return;

// HTML navigation - network first
if (request.mode === ‘navigate’) {
event.respondWith(
fetch(request)
.then(response => {
// Cache successful response
const clone = response.clone();
caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
return response;
})
.catch(async () => {
const cached = await caches.match(request);
return cached || caches.match(’/offline.html’) || caches.match(’/index.html’);
})
);
return;
}

// Fonts and static assets - cache first
if (url.hostname.includes(‘fonts.googleapis.com’) ||
url.hostname.includes(‘fonts.gstatic.com’) ||
request.destination === ‘style’ ||
request.destination === ‘script’ ||
request.destination === ‘font’) {
event.respondWith(
caches.match(request).then(cached => {
if (cached) return cached;
return fetch(request).then(response => {
const clone = response.clone();
caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
return response;
}).catch(() => cached);
})
);
return;
}

// Default - network with cache fallback
event.respondWith(
fetch(request).catch(() => caches.match(request))
);
});

// Listen for skip waiting message
self.addEventListener(‘message’, event => {
if (event.data === ‘skipWaiting’) self.skipWaiting();
});
