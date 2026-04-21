// kamnuanlek.com — Service Worker v1
// Handles: offline cache, push notifications, background sync

const CACHE_NAME = 'kamnuanlek-v1';
const OFFLINE_PAGE = '/';

// Precache the most important pages
const PRECACHE_URLS = [
  '/',
  '/คำนวณภาษีเงินได้บุคคลธรรมดา/',
  '/คำนวณเงินเดือนสุทธิ/',
  '/คำนวณผ่อนกู้/',
  '/คำนวณภาษีมูลค่าเพิ่ม/',
  '/คำนวณ-bmi/',
  '/คำนวณดอกเบี้ยเงินฝาก/',
];

// ── Install: precache key pages ──────────────────────────────
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
  );
});

// ── Activate: clean old caches ───────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for pages, network-first for API ──────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, cross-origin, and API requests
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached || caches.match(OFFLINE_PAGE));

      // Cache-first for HTML, network-first for everything else
      return request.headers.get('accept')?.includes('text/html')
        ? cached || networkFetch
        : networkFetch;
    })
  );
});

// ── Push: show notification ───────────────────────────────────
self.addEventListener('push', (event) => {
  let data = { title: 'เครื่องคำนวณไทย', body: 'มีอัปเดตใหม่สำหรับคุณ', url: '/' };
  try {
    data = event.data ? event.data.json() : data;
  } catch {
    data.body = event.data ? event.data.text() : data.body;
  }

  const options = {
    body: data.body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: data.tag || 'kamnuanlek-notification',
    renotify: true,
    requireInteraction: false,
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'คำนวณเลย' },
      { action: 'dismiss', title: 'ปิด' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// ── Notification click: open the target URL ───────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
