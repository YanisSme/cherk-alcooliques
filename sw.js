const CACHE_KEY = 'network_or_cache_key-v1';

const resourceNames = [
  '/calendar-my-inner-alcoholic/assets/images/app-icon-512.png',
  '/calendar-my-inner-alcoholic/src/css/icons/chevron-left.svg',
  '/calendar-my-inner-alcoholic/src/css/icons/empty-glass.svg',
  '/calendar-my-inner-alcoholic/src/css/icons/full-glass.svg',
  '/calendar-my-inner-alcoholic/src/css/main.css',
  '/calendar-my-inner-alcoholic/src/css/reset.css',
  '/calendar-my-inner-alcoholic/src/css/calendar.css',
  '/calendar-my-inner-alcoholic/src/module/calendar.js',
  '/calendar-my-inner-alcoholic/src/module/viewSelector.js',
  '/calendar-my-inner-alcoholic/src/utils/dateUtils.js',
  '/calendar-my-inner-alcoholic/src/config.js',
  '/calendar-my-inner-alcoholic/src/main.js',
  '/calendar-my-inner-alcoholic/src/store.js',
  '/calendar-my-inner-alcoholic/favicon.ico',
  '/calendar-my-inner-alcoholic/',
  '/calendar-my-inner-alcoholic',
]

self.addEventListener('install', (event) => {
  console.log('Установлен');
  event.waitUntil(
  caches.open(CACHE_KEY).then((cache) => cache.addAll(resourceNames))
  );
});

self.addEventListener('activate', (event) => {
  console.log('Активирован');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(cacheName => resourceNames.includes(cacheName))
          .map(function(cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('Происходит запрос на сервер');

  event.respondWith(fromNetwork(event.request)
    .catch(async () => {
      return fromCache(event.request)
    }))
});

function fromNetwork(request) {
  return new Promise((resolve, reject) => {
    fetch(request).then(resolve, reject)
  })
}

function fromCache(request) {
// Открываем наше хранилище кэша (CacheStorage API), выполняем поиск запрошенного ресурса.
// Обратите внимание, что в случае отсутствия соответствия значения Promise выполнится успешно, но со значением `undefined`
  return caches.open(CACHE_KEY).then((cache) =>
    cache.match(request).then((matching) =>
      matching || Promise.reject('no-match')
    ));
}
