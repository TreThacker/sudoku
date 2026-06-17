const CACHE_NAME = "sudoku-cache-v1-00";
const FILES_TO_CACHE = [
	"./",
	"./index.html",
	"./styles.css",
	"./app.js",
	"./manifest.json",
	"./favicon.ico",
	"./image/icon/icon-16.png",
	"./image/icon/icon-32.png",
	"./image/icon/icon-180.png",
	"./image/icon/icon-192.png",
	"./image/icon/icon-512.png",
	"./image/icon/icon-512.webp"
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(FILES_TO_CACHE);
		})
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames
					.filter((cacheName) => cacheName !== CACHE_NAME)
					.map((cacheName) => caches.delete(cacheName))
			);
		})
	);
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			return cachedResponse || fetch(event.request);
		})
	);
});