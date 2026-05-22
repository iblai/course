// Minimal no-op service worker. The SDK's `ServiceWorkerProvider`
// registers `/sw.js`; without this file the registration 404s
// (non-fatal but noisy). Offline caching is not implemented yet --
// install/activate cleanly and pass fetches through untouched.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Pass-through. No cache strategy.
});
