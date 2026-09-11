self.addEventListener('install', (e) => {
  console.log('[ServiceWorker] Install');
});
self.addEventListener('fetch', (e) => {
  // Silent passthrough for offline capability check
});
