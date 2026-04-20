# CAL-214 Release QA Evidence Pack (2026-04-18)

## Scope
Representative core routes (desktop + mobile) and article template checks:
- `/`
- `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%9A%E0%B8%B8%E0%B8%84%E0%B8%84%E0%B8%A5%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%94%E0%B8%B2/`
- `/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/`
- sampled article detail pages (3 routes)

Base URL under release validation:
- `https://calculator-thailand-production.up.railway.app`

## Evidence Artifacts
Core dark-mode contrast + screenshots (live):
- `reports/qa/cal-214/2026-04-18-live/darkmode-contrast-check.md`
- `reports/qa/cal-214/2026-04-18-live/darkmode-contrast-check.json`
- `reports/qa/cal-214/2026-04-18-live/screenshots/*`

Article-route dark-mode QA (CTO run):
- `reports/qa/cal-216/2026-04-18/cto-live/darkmode-article-routes.md`
- `reports/qa/cal-216/2026-04-18/cto-live/darkmode-article-routes.json`
- `reports/qa/cal-216/2026-04-18/cto-live/screenshots/*`

Article-route dark-mode QA (delegated Alpha verification):
- `reports/qa/cal-214/2026-04-18/alpha-verification/darkmode-article-verification.md`
- `reports/qa/cal-214/2026-04-18/alpha-verification/darkmode-article-verification.json`
- `reports/qa/cal-214/2026-04-18/alpha-verification/screenshots/*`

Mobile Lighthouse (live):
- `reports/qa/cal-214/2026-04-18/lighthouse-live/home-mobile.json`
- `reports/qa/cal-214/2026-04-18/lighthouse-live/pit-mobile.json`
- `reports/qa/cal-214/2026-04-18/lighthouse-live/article-index-mobile.json`

## Results Summary
### Core route contrast gate (live)
- Routes checked: 3
- PASS: 0
- FAIL: 3
- Contrast failures per route (desktop/mobile):
  - `/`: 20 / 20
  - `/pit`: 20 / 20
  - `/article-index`: 20 / 20

### Article template gate (live)
- Routes checked: 3
- PASS: 0
- FAIL: 3
- Theme markers (`html[data-theme]`, `html[data-theme-preference]`): null on all sampled desktop/mobile views
- Contrast failures per route (desktop/mobile):
  - `/article-index`: 40 / 40
  - `/article-car-loan`: 81 / 81
  - `/article-transfer-fee`: 129 / 129
- Mobile overflow: fail on `/article-transfer-fee`

### Lighthouse mobile (live)
- `/`: performance 68, accessibility 91, best-practices 77, seo 100
  - color-contrast score: 0
  - LCP: 5269 ms, CLS: 0.0048, TBT: 109 ms
- `/pit`: performance 44, accessibility 94, best-practices 77, seo 100
  - color-contrast score: 0
  - LCP: 5409 ms, CLS: 0.6307, TBT: 107 ms
- `/article-index`: performance 44, accessibility 90, best-practices 77, seo 100
  - color-contrast score: 0
  - LCP: 5231 ms, CLS: 1.0021, TBT: 85 ms

## Release Gate Decision
Status: **BLOCKED**

Blocking reasons:
- Dark-mode contrast gate fails on all representative core routes in production.
- Article templates in production do not apply theme markers (`data-theme`, `data-theme-preference`) when dark mode is forced.
- Mobile Lighthouse release thresholds are not met on representative routes (performance and color-contrast).

Unblock owner and ETA:
- Owner: CTO (`aefd639f-bbba-4120-ab49-035ce3d7ebf6`)
- ETA for patch + redeploy + rerun evidence: 2026-04-18 21:30 ICT

## Delegation Throughput Note
- Delegated QA verification to Calculator Engineer Alpha in this heartbeat.
- Alpha delivered an independent evidence set under `reports/qa/cal-214/2026-04-18/alpha-verification/` and confirmed live failures.
