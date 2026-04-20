# CAL-246 Release Visual Integrity (after)

- Generated at: 2026-04-18T17:44:20.788Z
- Base URL: https://calculator-thailand-production.up.railway.app
- Release SHA: cal-246-live-cycle-1
- Deployment ID: incident-cal-251-cycle-1-railway
- Verdict: FAIL

## Summary

- Surfaces: 7
- Modes: 2
- Viewport checks: 28
- Passed checks: 6
- Failed checks: 22
- Failed surface-mode groups: 11

## Surface Matrix

| Surface | Path | Mode | Desktop | Mobile | Verdict |
| --- | --- | --- | --- | --- | --- |
| Article Page | /บทความ/ | dark | FAIL | FAIL | FAIL |
| Article Page | /บทความ/ | light | FAIL | FAIL | FAIL |
| Calculator Listing Chips | / | dark | PASS | PASS | PASS |
| Calculator Listing Chips | / | light | PASS | PASS | PASS |
| Calculator Page | /คำนวณภาษีเงินได้บุคคลธรรมดา/ | dark | FAIL | FAIL | FAIL |
| Calculator Page | /คำนวณภาษีเงินได้บุคคลธรรมดา/ | light | FAIL | FAIL | FAIL |
| Footer | / | dark | FAIL | FAIL | FAIL |
| Footer | / | light | FAIL | FAIL | FAIL |
| Header | / | dark | FAIL | FAIL | FAIL |
| Header | / | light | FAIL | FAIL | FAIL |
| Homepage Hero | / | dark | FAIL | FAIL | FAIL |
| Homepage Hero | / | light | FAIL | FAIL | FAIL |
| Trust Section | / | dark | FAIL | FAIL | FAIL |
| Trust Section | / | light | PASS | PASS | PASS |

## Detailed Checks

| Surface | Mode | Viewport | HTTP | Thai | Mojibake | Contrast Fails | Overflow | Verdict | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Header | light | desktop | 200 | pass | fail | 0 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/header--light-desktop.png` |
| Header | light | mobile | 200 | pass | fail | 0 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/header--light-mobile.png` |
| Header | dark | desktop | 200 | pass | fail | 0 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/header--dark-desktop.png` |
| Header | dark | mobile | 200 | pass | fail | 0 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/header--dark-mobile.png` |
| Footer | light | desktop | 200 | fail | fail | 1 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/footer--light-desktop.png` |
| Footer | light | mobile | 200 | fail | fail | 1 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/footer--light-mobile.png` |
| Footer | dark | desktop | 200 | fail | fail | 1 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/footer--dark-desktop.png` |
| Footer | dark | mobile | 200 | fail | fail | 1 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/footer--dark-mobile.png` |
| Homepage Hero | light | desktop | 200 | pass | pass | 1 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/homepage-hero--light-desktop.png` |
| Homepage Hero | light | mobile | 200 | pass | pass | 1 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/homepage-hero--light-mobile.png` |
| Homepage Hero | dark | desktop | 200 | pass | pass | 5 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/homepage-hero--dark-desktop.png` |
| Homepage Hero | dark | mobile | 200 | pass | pass | 5 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/homepage-hero--dark-mobile.png` |
| Trust Section | light | desktop | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/trust-section--light-desktop.png` |
| Trust Section | light | mobile | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/trust-section--light-mobile.png` |
| Trust Section | dark | desktop | 200 | pass | pass | 16 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/trust-section--dark-desktop.png` |
| Trust Section | dark | mobile | 200 | pass | pass | 16 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/trust-section--dark-mobile.png` |
| Calculator Listing Chips | light | desktop | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/calculator-chips--light-desktop.png` |
| Calculator Listing Chips | light | mobile | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/calculator-chips--light-mobile.png` |
| Calculator Listing Chips | dark | desktop | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/calculator-chips--dark-desktop.png` |
| Calculator Listing Chips | dark | mobile | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/calculator-chips--dark-mobile.png` |
| Calculator Page | light | desktop | 200 | pass | pass | 13 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/calculator-page-คำนวณภาษีเงินได้บุคคลธรรมดา-light-desktop.png` |
| Calculator Page | light | mobile | 200 | pass | pass | 13 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/calculator-page-คำนวณภาษีเงินได้บุคคลธรรมดา-light-mobile.png` |
| Calculator Page | dark | desktop | 200 | pass | pass | 74 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/calculator-page-คำนวณภาษีเงินได้บุคคลธรรมดา-dark-desktop.png` |
| Calculator Page | dark | mobile | 200 | pass | pass | 74 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/calculator-page-คำนวณภาษีเงินได้บุคคลธรรมดา-dark-mobile.png` |
| Article Page | light | desktop | 200 | pass | pass | 17 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/article-page-บทความ-light-desktop.png` |
| Article Page | light | mobile | 200 | pass | pass | 17 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/article-page-บทความ-light-mobile.png` |
| Article Page | dark | desktop | 200 | pass | pass | 7 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/article-page-บทความ-dark-desktop.png` |
| Article Page | dark | mobile | 200 | pass | pass | 7 | pass | FAIL | `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/article-page-บทความ-dark-mobile.png` |

## Failures

- Header (light/desktop): mojibake detected
- Header (light/mobile): mojibake detected
- Header (dark/desktop): mojibake detected
- Header (dark/mobile): mojibake detected
- Footer (light/desktop): thai text missing; mojibake detected; contrast failures 1; expected Thai copy keyword missing
- Footer (light/mobile): thai text missing; mojibake detected; contrast failures 1; expected Thai copy keyword missing
- Footer (dark/desktop): thai text missing; mojibake detected; contrast failures 1; expected Thai copy keyword missing
- Footer (dark/mobile): thai text missing; mojibake detected; contrast failures 1; expected Thai copy keyword missing
- Homepage Hero (light/desktop): contrast failures 1
- Homepage Hero (light/mobile): contrast failures 1
- Homepage Hero (dark/desktop): contrast failures 5
- Homepage Hero (dark/mobile): contrast failures 5
- Trust Section (dark/desktop): contrast failures 16
- Trust Section (dark/mobile): contrast failures 16
- Calculator Page (light/desktop): contrast failures 13
- Calculator Page (light/mobile): contrast failures 13
- Calculator Page (dark/desktop): contrast failures 74
- Calculator Page (dark/mobile): contrast failures 74
- Article Page (light/desktop): contrast failures 17
- Article Page (light/mobile): contrast failures 17
- Article Page (dark/desktop): contrast failures 7
- Article Page (dark/mobile): contrast failures 7

