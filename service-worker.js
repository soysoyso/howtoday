// 1. 캐시 보물 상자 이름 정하기 (버전이 바뀔 때마다 숫자를 바꿔주면 새 파일로 업데이트돼요!)
const CACHE_NAME = 'pwa-report-cache-v1';

// 2. 미리 저장해 둘 필수 파일 목록
const urlsToCache = [
  '/', // 웹사이트 기본 주소
  '/index.html', // 메인 파일
  // index.html에서 사용하는 Chart.js도 캐시에 저장
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js', 
  '/192192.png', // 아이콘 파일
  '/512512.png' // 아이콘 파일
];

// 3. Service Worker 설치: 미리 저장할 파일들을 캐시에 넣어둡니다.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('필수 파일들을 캐시에 저장했어요.');
        return cache.addAll(urlsToCache);
      })
  );
});

// 4. 네트워크 요청 가로채기: 파일 요청이 들어오면...
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 파일이 있으면 캐시된 파일(미리 저장된 파일)을 보여주고,
        if (response) {
          return response;
        }
        // 없으면 인터넷(네트워크)으로 파일을 가져와요.
        return fetch(event.request);
      })
  );
});

// 5. 이전 버전 캐시 삭제: 새 버전으로 업데이트 될 때, 오래된 캐시를 청소해요.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('오래된 캐시를 삭제했어요:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});