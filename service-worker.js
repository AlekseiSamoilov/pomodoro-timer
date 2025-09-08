// Cache name
const CACHE_NAME = 'pomodoro-timer-v1';

// Assets to cache
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/tomato.png',
  '/alarm.mp3'
];

let timerEndTime = null;
let timerMode = null;

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean old caches
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

// Timer functionality
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SET_TIMER') {
        timerEndTime = event.data.endTime;
        timerMode = event.data.mode;
        setTimer();
    } else if (event.data && event.data.type === 'CANCEL_TIMER') {
        timerEndTime = null;
        timerMode = null;
    }
});
