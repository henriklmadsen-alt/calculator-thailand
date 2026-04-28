# CAL-216 Dark-Mode QA Evidence (Article Routes)

Generated at: 2026-04-18T06:02:13.779Z
Base URL: http://127.0.0.1:4321
Variant: cto-local
Theme mode: dark (forced via localStorage key `ct.theme-preference.v1`)

## Summary

- Routes checked: 3
- PASS: 1
- FAIL: 2

## Route Matrix

| Route | Desktop HTTP | Mobile HTTP | Desktop Theme | Mobile Theme | Desktop Overflow | Mobile Overflow | Desktop Contrast Failures | Mobile Contrast Failures | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /บทความ/ | 200 | 200 | dark | dark | pass | pass | 0 | 0 | PASS |
| /บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/ | 200 | 200 | dark | dark | pass | fail | 9 | 9 | FAIL |
| /บทความ/คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง/ | 200 | 200 | dark | dark | pass | fail | 6 | 6 | FAIL |

## /บทความ/

- Desktop screenshot: `reports/qa/cal-216/2026-04-18/cto-local/screenshots/บทความ-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-18/cto-local/screenshots/บทความ-mobile-dark.png`
- Desktop scanned text nodes: 182
- Mobile scanned text nodes: 180
- Contrast findings: none

## /บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/

- Desktop screenshot: `reports/qa/cal-216/2026-04-18/cto-local/screenshots/บทความ_คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-18/cto-local/screenshots/บทความ_คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร-mobile-dark.png`
- Desktop scanned text nodes: 147
- Mobile scanned text nodes: 145
- Contrast findings:
  - Desktop a.mt-3.inline-flex: ratio 2.46 < 4.5
  - Desktop span: ratio 2.46 < 4.5
  - Desktop span.text-[11px].font-medium: ratio 3.57 < 4.5
  - Desktop a.mt-3.inline-flex: ratio 2.46 < 4.5
  - Desktop span: ratio 2.46 < 4.5
  - Desktop span.text-[11px].font-medium: ratio 3.57 < 4.5
  - Desktop section.my-6.rounded-xl: ratio 2.72 < 4.5
  - Desktop p.text-sm.font-semibold: ratio 2.31 < 4.5
  - Desktop div.mt-2.flex: ratio 2.72 < 4.5
  - Mobile a.mt-3.inline-flex: ratio 2.46 < 4.5
  - Mobile span: ratio 2.46 < 4.5
  - Mobile span.text-[11px].font-medium: ratio 3.57 < 4.5
  - Mobile a.mt-3.inline-flex: ratio 2.46 < 4.5
  - Mobile span: ratio 2.46 < 4.5
  - Mobile span.text-[11px].font-medium: ratio 3.57 < 4.5
  - Mobile section.my-6.rounded-xl: ratio 2.72 < 4.5
  - Mobile p.text-sm.font-semibold: ratio 2.31 < 4.5
  - Mobile div.mt-2.flex: ratio 2.72 < 4.5

## /บทความ/คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง/

- Desktop screenshot: `reports/qa/cal-216/2026-04-18/cto-local/screenshots/บทความ_คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-18/cto-local/screenshots/บทความ_คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง-mobile-dark.png`
- Desktop scanned text nodes: 172
- Mobile scanned text nodes: 170
- Contrast findings:
  - Desktop a.mt-3.inline-flex: ratio 2.46 < 4.5
  - Desktop span: ratio 2.46 < 4.5
  - Desktop span.text-[11px].font-medium: ratio 3.57 < 4.5
  - Desktop a.mt-3.inline-flex: ratio 2.46 < 4.5
  - Desktop span: ratio 2.46 < 4.5
  - Desktop span.text-[11px].font-medium: ratio 3.57 < 4.5
  - Mobile a.mt-3.inline-flex: ratio 2.46 < 4.5
  - Mobile span: ratio 2.46 < 4.5
  - Mobile span.text-[11px].font-medium: ratio 3.57 < 4.5
  - Mobile a.mt-3.inline-flex: ratio 2.46 < 4.5
  - Mobile span: ratio 2.46 < 4.5
  - Mobile span.text-[11px].font-medium: ratio 3.57 < 4.5

