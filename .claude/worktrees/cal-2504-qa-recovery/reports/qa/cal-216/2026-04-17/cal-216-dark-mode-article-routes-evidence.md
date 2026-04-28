# CAL-216 Dark-Mode QA Evidence on Article Routes

Generated: 2026-04-17 (ICT)
Owner: Calculator Engineer Alpha
Parent: CAL-214

## Goal Alignment

Validate dark-mode behavior and accessibility quality on all article routes (`/บทความ/*`) with local verification first, then production verification.

## Evidence Commands

```bash
node --test src/lib/theme.test.ts
npm run build
node scripts/cal216-darkmode-article-qa.mjs
# with env overrides:
# CAL216_BASE_URL, CAL216_RUN_DATE, CAL216_VARIANT
```

## Result Snapshot

| Environment | Base URL | Routes | PASS | FAIL | Primary failure signals |
| --- | --- | --- | --- | --- | --- |
| local | `http://127.0.0.1:4321` | 18 | 1 | 17 | mobile overflow + contrast failures on article detail routes |
| production | `https://www.kamnuanlek.com` | 18 | 0 | 18 | dark theme not applied (`data-theme` missing), contrast failures |
| production-railway | `https://calculator-thailand-production.up.railway.app` | 18 | 0 | 18 | dark theme not applied (`data-theme` missing), contrast failures |

## Key Findings

1. Local build has dark mode active (`theme=dark`), but most article detail routes still fail WCAG contrast checks and show mobile horizontal overflow.
2. Both production hosts return HTTP 200 on all 18 article routes, but none apply dark theme (`theme=null`, `themePreference=null`) even with forced localStorage preference.
3. Production behavior indicates rollout gap for dark-mode runtime/theme wiring on article pages, not just isolated route regressions.

## Artifact Index

- Local detailed report: `reports/qa/cal-216/2026-04-17/local/darkmode-article-routes.md`
- Local machine-readable report: `reports/qa/cal-216/2026-04-17/local/darkmode-article-routes.json`
- Production detailed report: `reports/qa/cal-216/2026-04-17/production/darkmode-article-routes.md`
- Production machine-readable report: `reports/qa/cal-216/2026-04-17/production/darkmode-article-routes.json`
- Railway production detailed report: `reports/qa/cal-216/2026-04-17/production-railway/darkmode-article-routes.md`
- Railway production machine-readable report: `reports/qa/cal-216/2026-04-17/production-railway/darkmode-article-routes.json`
- Screenshots: `reports/qa/cal-216/2026-04-17/{local|production|production-railway}/screenshots/*.png`

## Blocker

Issue remains blocked for closure until:

1. Article-route dark theme is actually active in production.
2. Failing contrast pairs on article CTA/table/text components are corrected to WCAG AA.
3. Mobile overflow on article detail layouts is removed.

## Next Step

Execute CAL-214 deployment/fix lane for shared article layout/theme rollout and rerun this exact CAL-216 QA pack as the post-deploy gate.
