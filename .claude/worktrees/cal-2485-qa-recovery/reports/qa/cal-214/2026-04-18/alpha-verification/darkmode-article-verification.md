# CAL-214 Alpha Verification: Dark Mode Article Routes (2026-04-18)

- Base URL tested: https://calculator-thailand-production.up.railway.app
- Scope: Focused dark-mode verification on 3 representative article routes (desktop + mobile)
- Routes checked: 3
- Pass/Fail: 0 pass, 3 fail
- Viewports checked: 6

## Exact command(s) run

- `$env:CAL216_BASE_URL='https://calculator-thailand-production.up.railway.app'; $env:CAL216_RUN_DATE='2026-04-18'; $env:CAL216_VARIANT='alpha-verification'; $env:CAL216_MAX_ROUTES='3'; $env:CAL216_INCLUDE_INDEX='true'; node scripts/cal216-darkmode-article-qa.mjs`

## Check summaries

- Theme markers (html[data-theme] + html[data-theme-preference]): 0 pass, 6 fail
- Horizontal overflow: 5 pass, 1 fail
- Contrast scan (failureCount == 0): 0 pass, 6 fail

## Route matrix

| Route | Desktop theme markers | Mobile theme markers | Desktop overflow | Mobile overflow | Desktop contrast fails | Mobile contrast fails | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| /บทความ/ | fail (null/null) | fail (null/null) | pass | pass | 40 | 40 | FAIL |
| /บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/ | fail (null/null) | fail (null/null) | pass | pass | 81 | 81 | FAIL |
| /บทความ/คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง/ | fail (null/null) | fail (null/null) | pass | fail | 129 | 129 | FAIL |

## Top failing selectors

- `time.text-xs.text-gray-400`: 34
- `p`: 16
- `strong`: 10
- `li`: 10
- `a.hover:text-primary-600.transition-colors`: 8
- `span.text-xs.text-gray-500`: 6
- `h2`: 6
- `main.flex-1.max-w-3xl`: 4
- `nav.text-sm.text-gray-500`: 4
- `ol.flex.items-center`: 4

## Screenshot artifacts

- /บทความ/
- Desktop: `reports/qa/cal-214/2026-04-18/alpha-verification/screenshots/บทความ-desktop-dark.png`
- Mobile: `reports/qa/cal-214/2026-04-18/alpha-verification/screenshots/บทความ-mobile-dark.png`
- /บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/
- Desktop: `reports/qa/cal-214/2026-04-18/alpha-verification/screenshots/บทความ_คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร-desktop-dark.png`
- Mobile: `reports/qa/cal-214/2026-04-18/alpha-verification/screenshots/บทความ_คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร-mobile-dark.png`
- /บทความ/คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง/
- Desktop: `reports/qa/cal-214/2026-04-18/alpha-verification/screenshots/บทความ_คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง-desktop-dark.png`
- Mobile: `reports/qa/cal-214/2026-04-18/alpha-verification/screenshots/บทความ_คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง-mobile-dark.png`
