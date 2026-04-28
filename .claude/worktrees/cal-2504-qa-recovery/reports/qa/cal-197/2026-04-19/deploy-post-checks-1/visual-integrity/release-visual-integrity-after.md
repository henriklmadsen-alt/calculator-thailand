# CAL-246 Release Visual Integrity (after)

- Generated at: 2026-04-18T20:52:38.830Z
- Base URL: https://www.kamnuanlek.com
- Release SHA: 1ce9656210c1515918dc02b91120d4e9e8e1c73c
- Deployment ID: b2a4b50a-4d55-451a-b14a-ce77b79f1d8f
- Verdict: FAIL

## Summary

- Surfaces: 7
- Modes: 2
- Viewport checks: 28
- Passed checks: 3
- Failed checks: 25
- Failed surface-mode groups: 14

## Surface Matrix

| Surface | Path | Mode | Desktop | Mobile | Verdict |
| --- | --- | --- | --- | --- | --- |
| Article Page | /บทความ/ | dark | FAIL | FAIL | FAIL |
| Article Page | /บทความ/ | light | FAIL | FAIL | FAIL |
| Calculator Listing Chips | / | dark | FAIL | FAIL | FAIL |
| Calculator Listing Chips | / | light | FAIL | FAIL | FAIL |
| Calculator Page | /คำนวณภาษีเงินได้บุคคลธรรมดา/ | dark | FAIL | FAIL | FAIL |
| Calculator Page | /คำนวณภาษีเงินได้บุคคลธรรมดา/ | light | FAIL | FAIL | FAIL |
| Footer | / | dark | FAIL | PASS | FAIL |
| Footer | / | light | FAIL | PASS | FAIL |
| Header | / | dark | FAIL | FAIL | FAIL |
| Header | / | light | PASS | FAIL | FAIL |
| Homepage Hero | / | dark | FAIL | FAIL | FAIL |
| Homepage Hero | / | light | FAIL | FAIL | FAIL |
| Trust Section | / | dark | FAIL | FAIL | FAIL |
| Trust Section | / | light | FAIL | FAIL | FAIL |

## Detailed Checks

| Surface | Mode | Viewport | HTTP | Thai | Mojibake | Contrast Fails | Overflow | Verdict | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Header | light | desktop | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/header--light-desktop.png` |
| Header | light | mobile | 200 | pass | pass | 1 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/header--light-mobile.png` |
| Header | dark | desktop | 200 | pass | pass | 2 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/header--dark-desktop.png` |
| Header | dark | mobile | 200 | pass | pass | 1 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/header--dark-mobile.png` |
| Footer | light | desktop | 200 | pass | pass | 1 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/footer--light-desktop.png` |
| Footer | light | mobile | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/footer--light-mobile.png` |
| Footer | dark | desktop | 200 | pass | pass | 1 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/footer--dark-desktop.png` |
| Footer | dark | mobile | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/footer--dark-mobile.png` |
| Homepage Hero | light | desktop | 200 | fail | pass | 1 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/homepage-hero--light-desktop.png` |
| Homepage Hero | light | mobile | 200 | fail | pass | 1 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/homepage-hero--light-mobile.png` |
| Homepage Hero | dark | desktop | 200 | fail | pass | 1 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/homepage-hero--dark-desktop.png` |
| Homepage Hero | dark | mobile | 200 | fail | pass | 1 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/homepage-hero--dark-mobile.png` |
| Trust Section | light | desktop | 200 | fail | pass | 1 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/trust-section--light-desktop.png` |
| Trust Section | light | mobile | 200 | fail | pass | 1 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/trust-section--light-mobile.png` |
| Trust Section | dark | desktop | 200 | fail | pass | 1 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/trust-section--dark-desktop.png` |
| Trust Section | dark | mobile | 200 | fail | pass | 1 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/trust-section--dark-mobile.png` |
| Calculator Listing Chips | light | desktop | 200 | fail | pass | 1 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/calculator-chips--light-desktop.png` |
| Calculator Listing Chips | light | mobile | 200 | fail | pass | 1 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/calculator-chips--light-mobile.png` |
| Calculator Listing Chips | dark | desktop | 200 | fail | pass | 1 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/calculator-chips--dark-desktop.png` |
| Calculator Listing Chips | dark | mobile | 200 | fail | pass | 1 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/calculator-chips--dark-mobile.png` |
| Calculator Page | light | desktop | 200 | pass | pass | 11 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/calculator-page-คำนวณภาษีเงินได้บุคคลธรรมดา-light-desktop.png` |
| Calculator Page | light | mobile | 200 | pass | pass | 11 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/calculator-page-คำนวณภาษีเงินได้บุคคลธรรมดา-light-mobile.png` |
| Calculator Page | dark | desktop | 200 | pass | pass | 11 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/calculator-page-คำนวณภาษีเงินได้บุคคลธรรมดา-dark-desktop.png` |
| Calculator Page | dark | mobile | 200 | pass | pass | 11 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/calculator-page-คำนวณภาษีเงินได้บุคคลธรรมดา-dark-mobile.png` |
| Article Page | light | desktop | 200 | pass | pass | 8 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/article-page-บทความ-light-desktop.png` |
| Article Page | light | mobile | 200 | pass | pass | 8 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/article-page-บทความ-light-mobile.png` |
| Article Page | dark | desktop | 200 | pass | pass | 8 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/article-page-บทความ-dark-desktop.png` |
| Article Page | dark | mobile | 200 | pass | pass | 8 | pass | FAIL | `reports/qa/cal-197/2026-04-19/deploy-post-checks-1/visual-integrity/screenshots/article-page-บทความ-dark-mobile.png` |

## Failures

- Header (light/mobile): contrast failures 1
- Header (dark/desktop): contrast failures 2
- Header (dark/mobile): contrast failures 1
- Footer (light/desktop): contrast failures 1
- Footer (dark/desktop): contrast failures 1
- Homepage Hero (light/desktop): surface not visible; thai text missing; contrast failures 1; expected Thai copy keyword missing; surface selector not found for contrast scan
- Homepage Hero (light/mobile): surface not visible; thai text missing; contrast failures 1; expected Thai copy keyword missing; surface selector not found for contrast scan
- Homepage Hero (dark/desktop): surface not visible; thai text missing; contrast failures 1; expected Thai copy keyword missing; surface selector not found for contrast scan
- Homepage Hero (dark/mobile): surface not visible; thai text missing; contrast failures 1; expected Thai copy keyword missing; surface selector not found for contrast scan
- Trust Section (light/desktop): surface not visible; thai text missing; contrast failures 1; expected Thai copy keyword missing; surface selector not found for contrast scan
- Trust Section (light/mobile): surface not visible; thai text missing; contrast failures 1; expected Thai copy keyword missing; surface selector not found for contrast scan
- Trust Section (dark/desktop): surface not visible; thai text missing; contrast failures 1; expected Thai copy keyword missing; surface selector not found for contrast scan
- Trust Section (dark/mobile): surface not visible; thai text missing; contrast failures 1; expected Thai copy keyword missing; surface selector not found for contrast scan
- Calculator Listing Chips (light/desktop): surface not visible; thai text missing; contrast failures 1; expected Thai copy keyword missing; surface selector not found for contrast scan; required calculator chips missing (4)
  - Missing chip route: /คำนวณค่าไฟฟ้า/
  - Missing chip route: /คำนวณดอกเบี้ยบัตรเครดิต/
  - Missing chip route: /คำนวณผ่อนรถ/
  - Missing chip route: /คำนวณภาษีเงินได้บุคคลธรรมดา/
- Calculator Listing Chips (light/mobile): surface not visible; thai text missing; contrast failures 1; expected Thai copy keyword missing; surface selector not found for contrast scan; required calculator chips missing (4)
  - Missing chip route: /คำนวณค่าไฟฟ้า/
  - Missing chip route: /คำนวณดอกเบี้ยบัตรเครดิต/
  - Missing chip route: /คำนวณผ่อนรถ/
  - Missing chip route: /คำนวณภาษีเงินได้บุคคลธรรมดา/
- Calculator Listing Chips (dark/desktop): surface not visible; thai text missing; contrast failures 1; expected Thai copy keyword missing; surface selector not found for contrast scan; required calculator chips missing (4)
  - Missing chip route: /คำนวณค่าไฟฟ้า/
  - Missing chip route: /คำนวณดอกเบี้ยบัตรเครดิต/
  - Missing chip route: /คำนวณผ่อนรถ/
  - Missing chip route: /คำนวณภาษีเงินได้บุคคลธรรมดา/
- Calculator Listing Chips (dark/mobile): surface not visible; thai text missing; contrast failures 1; expected Thai copy keyword missing; surface selector not found for contrast scan; required calculator chips missing (4)
  - Missing chip route: /คำนวณค่าไฟฟ้า/
  - Missing chip route: /คำนวณดอกเบี้ยบัตรเครดิต/
  - Missing chip route: /คำนวณผ่อนรถ/
  - Missing chip route: /คำนวณภาษีเงินได้บุคคลธรรมดา/
- Calculator Page (light/desktop): contrast failures 11
- Calculator Page (light/mobile): contrast failures 11
- Calculator Page (dark/desktop): contrast failures 11
- Calculator Page (dark/mobile): contrast failures 11
- Article Page (light/desktop): contrast failures 8
- Article Page (light/mobile): contrast failures 8
- Article Page (dark/desktop): contrast failures 8
- Article Page (dark/mobile): contrast failures 8

