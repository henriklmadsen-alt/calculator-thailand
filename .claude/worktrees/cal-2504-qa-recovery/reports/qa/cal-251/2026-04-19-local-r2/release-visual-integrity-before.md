# CAL-246 Release Visual Integrity (before)

- Generated at: 2026-04-18T19:44:06.871Z
- Base URL: http://127.0.0.1:4321
- Release SHA: n/a
- Deployment ID: n/a
- Verdict: PASS

## Summary

- Surfaces: 7
- Modes: 2
- Viewport checks: 28
- Passed checks: 8
- Failed checks: 20
- Failed surface-mode groups: 10

## Surface Matrix

| Surface | Path | Mode | Desktop | Mobile | Verdict |
| --- | --- | --- | --- | --- | --- |
| Article Page | /บทความ/ | dark | FAIL | FAIL | FAIL |
| Article Page | /บทความ/ | light | FAIL | FAIL | FAIL |
| Calculator Listing Chips | / | dark | FAIL | FAIL | FAIL |
| Calculator Listing Chips | / | light | FAIL | FAIL | FAIL |
| Calculator Page | /คำนวณภาษีเงินได้บุคคลธรรมดา/ | dark | FAIL | FAIL | FAIL |
| Calculator Page | /คำนวณภาษีเงินได้บุคคลธรรมดา/ | light | FAIL | FAIL | FAIL |
| Footer | / | dark | FAIL | FAIL | FAIL |
| Footer | / | light | FAIL | FAIL | FAIL |
| Header | / | dark | PASS | PASS | PASS |
| Header | / | light | PASS | PASS | PASS |
| Homepage Hero | / | dark | FAIL | FAIL | FAIL |
| Homepage Hero | / | light | FAIL | FAIL | FAIL |
| Trust Section | / | dark | PASS | PASS | PASS |
| Trust Section | / | light | PASS | PASS | PASS |

## Detailed Checks

| Surface | Mode | Viewport | HTTP | Thai | Mojibake | Contrast Fails | Overflow | Verdict | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Header | light | desktop | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/header--light-desktop.png` |
| Header | light | mobile | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/header--light-mobile.png` |
| Header | dark | desktop | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/header--dark-desktop.png` |
| Header | dark | mobile | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/header--dark-mobile.png` |
| Footer | light | desktop | 200 | pass | pass | 1 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/footer--light-desktop.png` |
| Footer | light | mobile | 200 | pass | pass | 1 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/footer--light-mobile.png` |
| Footer | dark | desktop | 200 | pass | pass | 1 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/footer--dark-desktop.png` |
| Footer | dark | mobile | 200 | pass | pass | 1 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/footer--dark-mobile.png` |
| Homepage Hero | light | desktop | 200 | pass | pass | 1 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/homepage-hero--light-desktop.png` |
| Homepage Hero | light | mobile | 200 | pass | pass | 1 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/homepage-hero--light-mobile.png` |
| Homepage Hero | dark | desktop | 200 | pass | pass | 5 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/homepage-hero--dark-desktop.png` |
| Homepage Hero | dark | mobile | 200 | pass | pass | 5 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/homepage-hero--dark-mobile.png` |
| Trust Section | light | desktop | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/trust-section--light-desktop.png` |
| Trust Section | light | mobile | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/trust-section--light-mobile.png` |
| Trust Section | dark | desktop | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/trust-section--dark-desktop.png` |
| Trust Section | dark | mobile | 200 | pass | pass | 0 | pass | PASS | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/trust-section--dark-mobile.png` |
| Calculator Listing Chips | light | desktop | 200 | pass | pass | 0 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/calculator-chips--light-desktop.png` |
| Calculator Listing Chips | light | mobile | 404 | fail | pass | 1 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/calculator-chips--light-mobile.png` |
| Calculator Listing Chips | dark | desktop | 404 | fail | pass | 1 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/calculator-chips--dark-desktop.png` |
| Calculator Listing Chips | dark | mobile | 404 | fail | pass | 1 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/calculator-chips--dark-mobile.png` |
| Calculator Page | light | desktop | 404 | fail | pass | 0 | fail | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/calculator-page-คำนวณภาษีเงินได้บุคคลธรรมดา-light-desktop.png` |
| Calculator Page | light | mobile | 200 | pass | pass | 11 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/calculator-page-คำนวณภาษีเงินได้บุคคลธรรมดา-light-mobile.png` |
| Calculator Page | dark | desktop | 200 | pass | pass | 60 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/calculator-page-คำนวณภาษีเงินได้บุคคลธรรมดา-dark-desktop.png` |
| Calculator Page | dark | mobile | 200 | pass | pass | 60 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/calculator-page-คำนวณภาษีเงินได้บุคคลธรรมดา-dark-mobile.png` |
| Article Page | light | desktop | 200 | pass | pass | 8 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/article-page-บทความ-light-desktop.png` |
| Article Page | light | mobile | 200 | pass | pass | 8 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/article-page-บทความ-light-mobile.png` |
| Article Page | dark | desktop | 200 | pass | pass | 7 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/article-page-บทความ-dark-desktop.png` |
| Article Page | dark | mobile | 200 | pass | pass | 7 | pass | FAIL | `reports/qa/cal-251/2026-04-19-local-r2/screenshots/article-page-บทความ-dark-mobile.png` |

## Failures

- Footer (light/desktop): contrast failures 1
- Footer (light/mobile): contrast failures 1
- Footer (dark/desktop): contrast failures 1
- Footer (dark/mobile): contrast failures 1
- Homepage Hero (light/desktop): contrast failures 1
- Homepage Hero (light/mobile): contrast failures 1
- Homepage Hero (dark/desktop): contrast failures 5
- Homepage Hero (dark/mobile): contrast failures 5
- Calculator Listing Chips (light/desktop): calculator chips contain non-200 routes (13)
  - Unexpected chip route: /คำนวณค่าธรรมเนียมโอนบ้าน/
  - Unexpected chip route: /คำนวณค่าน้ำ/
  - Unexpected chip route: /คำนวณค่าโอที/
  - Unexpected chip route: /คำนวณผ่อนบ้าน/
  - Unexpected chip route: /คำนวณภาษีมูลค่าเพิ่ม/
  - Unexpected chip route: /คำนวณอัตราแลกเปลี่ยน/
  - Unexpected chip route: /คำนวณเงินเกษียณ/
  - Unexpected chip route: /คำนวณเงินเดือนสุทธิ/
  - Unexpected chip route: /คำนวณเปอร์เซ็นต์/
  - Broken chip route: /คำนวณค่าธรรมเนียมโอนบ้าน/ -> 404
  - Broken chip route: /คำนวณค่าน้ำ/ -> 404
  - Broken chip route: /คำนวณค่าโอที/ -> 404
  - Broken chip route: /คำนวณค่าไฟฟ้า/ -> 404
  - Broken chip route: /คำนวณดอกเบี้ยบัตรเครดิต/ -> 404
  - Broken chip route: /คำนวณผ่อนบ้าน/ -> 404
  - Broken chip route: /คำนวณผ่อนรถ/ -> 404
  - Broken chip route: /คำนวณภาษีมูลค่าเพิ่ม/ -> 404
  - Broken chip route: /คำนวณภาษีเงินได้บุคคลธรรมดา/ -> 404
  - Broken chip route: /คำนวณอัตราแลกเปลี่ยน/ -> 404
  - Broken chip route: /คำนวณเงินเกษียณ/ -> 404
  - Broken chip route: /คำนวณเงินเดือนสุทธิ/ -> 404
  - Broken chip route: /คำนวณเปอร์เซ็นต์/ -> 404
- Calculator Listing Chips (light/mobile): http status 404; surface not visible; thai text missing; contrast failures 1; expected Thai copy keyword missing; surface selector not found for contrast scan; required calculator chips missing (4)
  - Missing chip route: /คำนวณค่าไฟฟ้า/
  - Missing chip route: /คำนวณดอกเบี้ยบัตรเครดิต/
  - Missing chip route: /คำนวณผ่อนรถ/
  - Missing chip route: /คำนวณภาษีเงินได้บุคคลธรรมดา/
- Calculator Listing Chips (dark/desktop): http status 404; surface not visible; thai text missing; contrast failures 1; expected Thai copy keyword missing; surface selector not found for contrast scan; required calculator chips missing (4)
  - Missing chip route: /คำนวณค่าไฟฟ้า/
  - Missing chip route: /คำนวณดอกเบี้ยบัตรเครดิต/
  - Missing chip route: /คำนวณผ่อนรถ/
  - Missing chip route: /คำนวณภาษีเงินได้บุคคลธรรมดา/
- Calculator Listing Chips (dark/mobile): http status 404; surface not visible; thai text missing; contrast failures 1; expected Thai copy keyword missing; surface selector not found for contrast scan; required calculator chips missing (4)
  - Missing chip route: /คำนวณค่าไฟฟ้า/
  - Missing chip route: /คำนวณดอกเบี้ยบัตรเครดิต/
  - Missing chip route: /คำนวณผ่อนรถ/
  - Missing chip route: /คำนวณภาษีเงินได้บุคคลธรรมดา/
- Calculator Page (light/desktop): http status 404; thai text missing; layout overflow; expected Thai copy keyword missing
- Calculator Page (light/mobile): contrast failures 11
- Calculator Page (dark/desktop): contrast failures 60
- Calculator Page (dark/mobile): contrast failures 60
- Article Page (light/desktop): contrast failures 8
- Article Page (light/mobile): contrast failures 8
- Article Page (dark/desktop): contrast failures 7
- Article Page (dark/mobile): contrast failures 7

