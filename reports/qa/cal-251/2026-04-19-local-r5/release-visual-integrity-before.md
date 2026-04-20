# CAL-246 Release Visual Integrity (before)

- Generated at: 2026-04-18T19:59:11.320Z
- Base URL: http://127.0.0.1:4331
- Release SHA: n/a
- Deployment ID: n/a
- Verdict: PASS

## Summary

- Surfaces: 7
- Modes: 2
- Viewport checks: 28
- Passed checks: 18
- Failed checks: 10
- Failed surface-mode groups: 5

## Surface Matrix

| Surface | Path | Mode | Desktop | Mobile | Verdict |
| --- | --- | --- | --- | --- | --- |
| Article Page | /บทความ/ | dark | FAIL | FAIL | FAIL |
| Article Page | /บทความ/ | light | FAIL | FAIL | FAIL |
| Calculator Listing Chips | / | dark | PASS | PASS | PASS |
| Calculator Listing Chips | / | light | PASS | PASS | PASS |
| Calculator Page | /คำนวณภาษีเงินได้บุคคลธรรมดา/ | dark | FAIL | FAIL | FAIL |
| Calculator Page | /คำนวณภาษีเงินได้บุคคลธรรมดา/ | light | FAIL | FAIL | FAIL |
| Footer | / | dark | PASS | PASS | PASS |
| Footer | / | light | PASS | PASS | PASS |
| Header | / | dark | PASS | PASS | PASS |
| Header | / | light | PASS | PASS | PASS |
| Homepage Hero | / | dark | PASS | PASS | PASS |
| Homepage Hero | / | light | FAIL | FAIL | FAIL |
| Trust Section | / | dark | PASS | PASS | PASS |
| Trust Section | / | light | PASS | PASS | PASS |

## Detailed Checks

| Surface | Mode | Viewport | HTTP | Thai | Mojibake | Contrast Fails | Overflow | Verdict | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Header | light | desktop | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/header--light-desktop.png` |
| Header | light | mobile | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/header--light-mobile.png` |
| Header | dark | desktop | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/header--dark-desktop.png` |
| Header | dark | mobile | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/header--dark-mobile.png` |
| Footer | light | desktop | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/footer--light-desktop.png` |
| Footer | light | mobile | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/footer--light-mobile.png` |
| Footer | dark | desktop | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/footer--dark-desktop.png` |
| Footer | dark | mobile | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/footer--dark-mobile.png` |
| Homepage Hero | light | desktop | 200 | pass | pass | 1 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/homepage-hero--light-desktop.png` |
| Homepage Hero | light | mobile | 200 | pass | pass | 1 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/homepage-hero--light-mobile.png` |
| Homepage Hero | dark | desktop | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/homepage-hero--dark-desktop.png` |
| Homepage Hero | dark | mobile | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/homepage-hero--dark-mobile.png` |
| Trust Section | light | desktop | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/trust-section--light-desktop.png` |
| Trust Section | light | mobile | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/trust-section--light-mobile.png` |
| Trust Section | dark | desktop | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/trust-section--dark-desktop.png` |
| Trust Section | dark | mobile | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/trust-section--dark-mobile.png` |
| Calculator Listing Chips | light | desktop | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/calculator-chips--light-desktop.png` |
| Calculator Listing Chips | light | mobile | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/calculator-chips--light-mobile.png` |
| Calculator Listing Chips | dark | desktop | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/calculator-chips--dark-desktop.png` |
| Calculator Listing Chips | dark | mobile | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/calculator-chips--dark-mobile.png` |
| Calculator Page | light | desktop | 200 | pass | pass | 11 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/calculator-page-คำนวณภาษีเงินได้บุคคลธรรมดา-light-desktop.png` |
| Calculator Page | light | mobile | 200 | pass | pass | 11 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/calculator-page-คำนวณภาษีเงินได้บุคคลธรรมดา-light-mobile.png` |
| Calculator Page | dark | desktop | 200 | pass | pass | 60 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/calculator-page-คำนวณภาษีเงินได้บุคคลธรรมดา-dark-desktop.png` |
| Calculator Page | dark | mobile | 200 | pass | pass | 60 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/calculator-page-คำนวณภาษีเงินได้บุคคลธรรมดา-dark-mobile.png` |
| Article Page | light | desktop | 200 | pass | pass | 8 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/article-page-บทความ-light-desktop.png` |
| Article Page | light | mobile | 200 | pass | pass | 8 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/article-page-บทความ-light-mobile.png` |
| Article Page | dark | desktop | 200 | pass | pass | 7 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/article-page-บทความ-dark-desktop.png` |
| Article Page | dark | mobile | 200 | pass | pass | 7 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r5/screenshots/article-page-บทความ-dark-mobile.png` |

## Failures

- Homepage Hero (light/desktop): contrast failures 1
- Homepage Hero (light/mobile): contrast failures 1
- Calculator Page (light/desktop): contrast failures 11
- Calculator Page (light/mobile): contrast failures 11
- Calculator Page (dark/desktop): contrast failures 60
- Calculator Page (dark/mobile): contrast failures 60
- Article Page (light/desktop): contrast failures 8
- Article Page (light/mobile): contrast failures 8
- Article Page (dark/desktop): contrast failures 7
- Article Page (dark/mobile): contrast failures 7

