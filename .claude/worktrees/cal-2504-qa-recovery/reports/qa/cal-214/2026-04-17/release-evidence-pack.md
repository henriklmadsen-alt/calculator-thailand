# CAL-214 Release QA Evidence Pack (2026-04-17)

## Scope
Representative core routes validated in dark mode:
- `/`
- `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
- `/บทความ/`

## Desktop + Mobile Screenshot Evidence
Dark mode screenshots were captured for each route:
- `reports/qa/cal-214/2026-04-17/screenshots/home-desktop-dark.png`
- `reports/qa/cal-214/2026-04-17/screenshots/home-mobile-dark.png`
- `reports/qa/cal-214/2026-04-17/screenshots/คำนวณภาษีเงินได้บุคคลธรรมดา-desktop-dark.png`
- `reports/qa/cal-214/2026-04-17/screenshots/คำนวณภาษีเงินได้บุคคลธรรมดา-mobile-dark.png`
- `reports/qa/cal-214/2026-04-17/screenshots/บทความ-desktop-dark.png`
- `reports/qa/cal-214/2026-04-17/screenshots/บทความ-mobile-dark.png`

## Contrast Check (Dark Mode)
Automated contrast scan report:
- Markdown: `reports/qa/cal-214/2026-04-17/darkmode-contrast-check.md`
- JSON: `reports/qa/cal-214/2026-04-17/darkmode-contrast-check.json`

Summary:
- `/` -> **FAIL** (desktop contrast failures: 17, mobile: 17)
- `/คำนวณภาษีเงินได้บุคคลธรรมดา/` -> **FAIL** (desktop contrast failures: 19, mobile: 19)
- `/บทความ/` -> **PASS** (desktop contrast failures: 0, mobile: 0)

## Lighthouse (Mobile)
Generated JSON artifacts:
- `reports/qa/cal-214/2026-04-17/lighthouse/home-mobile.json`
- `reports/qa/cal-214/2026-04-17/lighthouse/คำนวณภาษีเงินได้บุคคลธรรมดา-mobile.json`
- `reports/qa/cal-214/2026-04-17/lighthouse/บทความ-mobile.json`

Category summary:
- `home-mobile.json` -> performance 93, accessibility 95, best-practices 77, SEO 100, color-contrast issues 14
- `คำนวณภาษีเงินได้บุคคลธรรมดา-mobile.json` -> performance 98, accessibility 96, best-practices 77, SEO 100, color-contrast issues 9
- `บทความ-mobile.json` -> performance 99, accessibility 95, best-practices 77, SEO 100, color-contrast issues 34

## Release Gate Decision
**FAIL / BLOCKED**

Blocking reason:
- WCAG-grade contrast target not met on representative core routes in dark mode.
- Lighthouse `color-contrast` audit reports multiple violations across all sampled routes.

Unblock owner and ETA:
- Owner: CTO (`aefd639f-bbba-4120-ab49-035ce3d7ebf6`)
- ETA to ship fixes + rerun QA: 2026-04-18 18:00 ICT
