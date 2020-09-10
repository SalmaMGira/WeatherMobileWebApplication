// this is the actual serviceworker

const cacheName = 'v1';
// usually have the name 'v1' because if we have different versions of caches

// array of all the pages we have
const cacheAssets = [
    'index.html',
    'main.css',
    'main.js'
];

// call install event
// attach event listener to the actual event worker
self.addEventListener('install', (e) => {
    console.log('service worker is installed');

    // handle assets
    // tell the browser to wait until the promise is finished until it gets rid of the serviceworker
    e.waitUntil(
        // use cache storage API
        // open the cache, then pass the cache name
        caches.open(cacheName)
        // once we open it we will get a promise
        .then(cache => {
            console.log('service worker: caching files');
            cache.addAll(cacheAssets);
        })
        // when everything is all set we can skip waiting
        .then(() => self.skipWaiting)
    );
});

// call activate event
self.addEventListener('activate', (e) => {
    console.log('service worker is activated');

    // remove unwanted caches
    e.waitUntil(
        // we add a condition that if the current cache isn't the cache we are looking through the current iteration
        // we will delete it
        caches.keys().then(cacheNames => {
            return Promise.all(
                // map is a higher order function in js
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('service worker: clearing old cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    );
});

// show cached files if we are offline
// call fetch event
self.addEventListener('fetch', e => {
    console.log('service worker: fetching');
    // chech if the life site is available, if not we will load the cache site
    e.respondWith(
        // fetch the initial request
        fetch(e.request)
        // if no connection it will fail, so we make a catch
        // then we will load from the cache
        .catch(() => caches.match(e.request))
    )
})