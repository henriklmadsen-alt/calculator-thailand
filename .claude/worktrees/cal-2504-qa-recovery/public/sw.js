// kamnuanlek.com — Service Worker v2
// Handles: offline cache, push notifications, background sync
// CAL-1053: Enhanced offline support for Thai mobile users with spotty connections

const CACHE_NAME = 'kamnuanlek-v2';
const ASSETS_CACHE_NAME = 'kamnuanlek-assets-v2';
const API_CACHE_NAME = 'kamnuanlek-api-v2';
const OFFLINE_PAGE = '/';

// TOP-10 priority calculators + core pages for precache
// Selected by: PWA shortcuts (most visited), Astro priority config, Thai use cases
const PRECACHE_URLS = [
  '/',
  // Priority 1.0 — High-traffic, high-intent search
  '/คำนวณผ่อนรถ/',           // Car loan installment (car purchase decision)
  '/เปรียบเทียบสินเชื่อรถ/',  // Car loan comparison
  '/คำนวณประกันรถ/',         // Car insurance
  // Priority 0.9 — Essential tax & salary calculators
  '/คำนวณภาษีเงินได้บุคคลธรรมดา/',  // Income tax (most complex, highest value)
  '/คำนวณเงินเดือนสุทธิ/',          // Net salary calculation
  '/คำนวณผ่อนกู้/',                 // General loan payment
  '/คำนวณภาษีมูลค่าเพิ่ม/',          // VAT (business calculator)
  '/คำนวณประกันสังคม/',             // Social security deductions
  '/คำนวณค่าโอที/',                 // Overtime pay (labor calculator)
  '/คำนวณภาษีที่ดิน/',             // Land/property tax
  // Priority 0.5+ — Health, lifestyle, utilities
  '/คำนวณ-bmi/',             // BMI (health, popular)
  '/คำนวณดอกเบี้ยเงินฝาก/',   // Savings interest (finance planning)
  '/คำนวณค่าไฟฟ้า/',         // Electricity bill (utilities, daily use)
  '/แปลงหน่วยวัด/',          // Unit converter (universal utility)
];

// ── Install: precache key pages + assets ──────────────────────────────
// Precaches top 10+ calculators so they work immediately offline
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    Promise.all([
      // HTML pages
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(PRECACHE_URLS).catch((err) => {
          console.warn('Failed to precache some URLs:', err);
          // Continue even if some URLs fail (e.g., 404 on build)
        });
      }),
      // CSS/JS assets (common bundles shared across calculators)
      caches.open(ASSETS_CACHE_NAME).then((cache) => {
        const assetPatterns = [
          '/_astro/',  // Astro build output
          '/logo.svg',
          '/favicon.svg',
        ];
        // Try to cache asset directories if they exist
        return Promise.allSettled(
          assetPatterns.map((pattern) =>
            fetch(pattern, { method: 'HEAD' })
              .then(() => cache.add(pattern))
              .catch(() => {}) // Silently fail for missing assets during install
          )
        );
      }),
    ])
  );
});

// ── Activate: clean old caches, claim clients ───────────────────────────────
self.addEventListener('activate', (event) => {
  const CURRENT_CACHES = [CACHE_NAME, ASSETS_CACHE_NAME, API_CACHE_NAME];
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !CURRENT_CACHES.includes(k))
            .map((k) => {
              console.log(`Deleting old cache: ${k}`);
              return caches.delete(k);
            })
        )
      )
      .then(() => {
        console.log('Old caches cleaned, claiming clients');
        return self.clients.claim();
      })
  );
});

// ── Fetch: Smart caching strategy ──────────────────────────────────────────
// Strategy:
// 1. HTML pages (calculators): Cache-first (instant offline load)
// 2. API calls: Network-first (get fresh data, fallback to stale cache)
// 3. Assets (CSS/JS): Network-first with cache fallback
// 4. Cross-origin: Skip (don't cache, let browser handle)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;
  // Skip cross-origin requests (avoid cache pollution)
  if (url.origin !== self.location.origin) return;

  const isHtmlPage = request.headers.get('accept')?.includes('text/html');
  const isApiCall = url.pathname.startsWith('/api/');
  const isAsset = /\.(js|css|woff2?|png|jpg|svg)$/i.test(url.pathname);

  // ┌─ STRATEGY 1: HTML pages (calculator pages) → Cache-first
  // │  Benefits: Instant offline load, smooth UX on flaky connections
  // └─
  if (isHtmlPage) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Serve from cache immediately
          // Optionally fetch in background to update cache (stale-while-revalidate)
          fetch(request).then((freshResponse) => {
            if (freshResponse && freshResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, freshResponse.clone());
              });
            }
          });
          return cached;
        }
        // Not in cache, try network
        return fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, response.clone());
              });
            }
            return response;
          })
          .catch(() => caches.match(OFFLINE_PAGE)); // Fallback to home if offline
      })
    );
  }
  // ┌─ STRATEGY 2: API calls → Network-first (get fresh, fallback to cache)
  // │  Benefits: Fresh calculator results, stale data when offline
  // └─
  else if (isApiCall) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses for offline fallback
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // Network error → try to return cached response
          return caches.match(request).catch(() => {
            // No cache fallback, return a JSON error response
            return new Response(
              JSON.stringify({
                error: 'offline',
                message: 'API unavailable. Check your connection.',
              }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' },
              }
            );
          });
        })
    );
  }
  // ┌─ STRATEGY 3: Assets (CSS/JS/fonts) → Network-first with cache fallback
  // │  Benefits: Latest styles/scripts, cached fallback on slow connections
  // └─
  else if (isAsset) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(ASSETS_CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => caches.match(request)) // Fallback to cached asset
    );
  }
  // Otherwise: let browser handle (no caching for other requests)
});

// ── Push: show notification ───────────────────────────────────
self.addEventListener('push', (event) => {
  let data = { title: 'คำนวณเลข', body: 'มีอัปเดตใหม่สำหรับคุณ', url: '/' };
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
