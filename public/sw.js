self.addEventListener('install', () => {
  console.log('[ServiceWorker] Install');
});
self.addEventListener('fetch', () => {
  // Silent passthrough for offline capability check
});
