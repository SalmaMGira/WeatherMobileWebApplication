// this is the actual serviceworker

const cacheName = 'v2';
// usually have the name 'v1' because if we have different versions of caches

// call install event
// attach event listener to the actual event worker
self.addEventListener('install', (e) => {
    console.log('service worker is installed');
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
        fetch(e.request)
        .then(res => {
            // we will take a copy of the response that we get from the server
            // make a copy/clone of response
            const resClone = res.clone();
            // open cache
            caches.open(cacheName).then(cache => {
                // this is an object
                // add response to cache
                cache.put(e.request, resClone);
            });
            return res;
        })
        // if the connection drops, this .catch will run
        .catch(err => caches.match(
            // it should be in the caches, as long as the user get through the site once it should be in the cache
            e.request)
            .then(res => res)
            )
    );
});