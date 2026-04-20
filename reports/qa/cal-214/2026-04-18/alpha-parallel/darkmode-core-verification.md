# CAL-214 Alpha Parallel Dark-Mode Verification (Production)

- Generated at: 2026-04-18T12:11:08.442Z
- Base URL: https://calculator-thailand-production.up.railway.app
- Ownership path: `reports/qa/cal-214/2026-04-18/alpha-parallel/`
- Routes checked: 3
- Route PASS/FAIL: 0 pass, 3 fail
- Theme marker PASS/FAIL: 0 pass, 3 fail

## Exact Commands

- `$env:CAL214_BASE_URL='https://calculator-thailand-production.up.railway.app'; $env:CAL214_RUN_DATE='2026-04-18'; node scripts/cal214-darkmode-qa.mjs`
- `node - (inline Playwright theme-marker check for /, /%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%9A%E0%B8%B8%E0%B8%84%E0%B8%84%E0%B8%A5%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%94%E0%B8%B2/, /%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/ with localStorage ct.theme-preference.v1='dark')`

## Route Results

| Route | Desktop screenshot | Mobile screenshot | Desktop theme | Mobile theme | Desktop contrast failures | Mobile contrast failures | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| / | `reports/qa/cal-214/2026-04-18/alpha-parallel/screenshots/home-desktop-dark.png` | `reports/qa/cal-214/2026-04-18/alpha-parallel/screenshots/home-mobile-dark.png` | null / null | null / null | 20 | 20 | FAIL |
| /คำนวณภาษีเงินได้บุคคลธรรมดา/ | `reports/qa/cal-214/2026-04-18/alpha-parallel/screenshots/คำนวณภาษีเงินได้บุคคลธรรมดา-desktop-dark.png` | `reports/qa/cal-214/2026-04-18/alpha-parallel/screenshots/คำนวณภาษีเงินได้บุคคลธรรมดา-mobile-dark.png` | null / null | null / null | 20 | 20 | FAIL |
| /บทความ/ | `reports/qa/cal-214/2026-04-18/alpha-parallel/screenshots/บทความ-desktop-dark.png` | `reports/qa/cal-214/2026-04-18/alpha-parallel/screenshots/บทความ-mobile-dark.png` | null / null | null / null | 20 | 20 | FAIL |

## Top Failing Selectors

- `span.absolute.top-4`: 22
- `a.hover:text-primary-600.transition-colors`: 21
- `strong`: 10
- `main.flex-1.max-w-5xl`: 6
- `h1.text-2xl.sm:text-3xl`: 4
- `h3.text-lg.font-semibold`: 4
- `span.hidden.sm:block`: 3
- `span.text-sm.font-semibold`: 3
- `div.text-center.mb-10`: 2
- `h1.text-3xl.sm:text-4xl`: 2

## Artifact Files

- `darkmode-core-verification.md`
- `darkmode-core-verification.json`
- `darkmode-contrast-check.raw.md`
- `darkmode-contrast-check.raw.json`
- `theme-marker-check.json`
- `screenshots/` (desktop+mobile)
