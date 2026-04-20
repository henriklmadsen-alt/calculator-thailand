# CAL-216 Dark-Mode QA Evidence (Article Routes)

Generated at: 2026-04-17T10:49:29.713Z
Base URL: http://127.0.0.1:4321
Variant: local
Theme mode: dark (forced via localStorage key `ct.theme-preference.v1`)

## Summary

- Routes checked: 18
- PASS: 1
- FAIL: 17

## Route Matrix

| Route | Desktop HTTP | Mobile HTTP | Desktop Theme | Mobile Theme | Desktop Overflow | Mobile Overflow | Desktop Contrast Failures | Mobile Contrast Failures | Verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| /บทความ/ | 200 | 200 | dark | dark | pass | pass | 0 | 0 | PASS |
| /บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/ | 200 | 200 | dark | dark | pass | fail | 9 | 9 | FAIL |
| /บทความ/คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง/ | 200 | 200 | dark | dark | pass | fail | 6 | 6 | FAIL |
| /บทความ/คำนวณค่าน้ำ-2569-อัตราค่าน้ำประปา-กปน-กปภ/ | 200 | 200 | dark | dark | pass | fail | 6 | 6 | FAIL |
| /บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/ | 200 | 200 | dark | dark | pass | fail | 6 | 6 | FAIL |
| /บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/ | 200 | 200 | dark | dark | pass | fail | 6 | 6 | FAIL |
| /บทความ/คำนวณเงินเกษียณ-2569-วางแผนเงินพอใช้/ | 200 | 200 | dark | dark | pass | fail | 6 | 6 | FAIL |
| /บทความ/คำนวณเปอร์เซ็นต์-2569-ส่วนลด-กำไร/ | 200 | 200 | dark | dark | pass | fail | 6 | 6 | FAIL |
| /บทความ/คำนวณอัตราแลกเปลี่ยน-บาท-สกุลเงิน-2569/ | 200 | 200 | dark | dark | pass | fail | 3 | 3 | FAIL |
| /บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/ | 200 | 200 | dark | dark | pass | fail | 2 | 2 | FAIL |
| /บทความ/เงินฝาก-vs-กองทุน-เปรียบเทียบ-2569/ | 200 | 200 | dark | dark | pass | fail | 6 | 6 | FAIL |
| /บทความ/ดอกเบี้ยบัตรเครดิต-คิดยังไง-จ่ายขั้นต่ำ-2569/ | 200 | 200 | dark | dark | pass | fail | 9 | 9 | FAIL |
| /บทความ/ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร/ | 200 | 200 | dark | dark | pass | fail | 2 | 2 | FAIL |
| /บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/ | 200 | 200 | dark | dark | pass | fail | 9 | 9 | FAIL |
| /บทความ/ภาษีมูลค่าเพิ่ม-7-คิดยังไง-สูตรบวกภาษี-ถอดภาษี-ตั้งราคาขายให้ไม่ขาดทุน/ | 200 | 200 | dark | dark | pass | fail | 9 | 9 | FAIL |
| /บทความ/รีไฟแนนซ์บ้าน-2569-คุ้มไหม-ดอกเบี้ยใหม่ต้องลดเท่าไร/ | 200 | 200 | dark | dark | pass | fail | 9 | 9 | FAIL |
| /บทความ/รีไฟแนนซ์บ้าน-vs-โปะบ้าน-แบบไหนคุ้ม-2569/ | 200 | 200 | dark | dark | pass | fail | 6 | 6 | FAIL |
| /บทความ/bmi-คำนวณค่าดัชนีมวลกาย-วิธีลดน้ำหนัก/ | 200 | 200 | dark | dark | pass | fail | 7 | 7 | FAIL |

## /บทความ/

- Desktop screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ-mobile-dark.png`
- Desktop scanned text nodes: 182
- Mobile scanned text nodes: 180
- Contrast findings: none

## /บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/

- Desktop screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร-mobile-dark.png`
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

- Desktop screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง-mobile-dark.png`
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

## /บทความ/คำนวณค่าน้ำ-2569-อัตราค่าน้ำประปา-กปน-กปภ/

- Desktop screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_คำนวณค่าน้ำ-2569-อัตราค่าน้ำประปา-กปน-กปภ-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_คำนวณค่าน้ำ-2569-อัตราค่าน้ำประปา-กปน-กปภ-mobile-dark.png`
- Desktop scanned text nodes: 158
- Mobile scanned text nodes: 156
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

## /บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/

- Desktop screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea-mobile-dark.png`
- Desktop scanned text nodes: 165
- Mobile scanned text nodes: 163
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

## /บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/

- Desktop screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน-mobile-dark.png`
- Desktop scanned text nodes: 151
- Mobile scanned text nodes: 149
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

## /บทความ/คำนวณเงินเกษียณ-2569-วางแผนเงินพอใช้/

- Desktop screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_คำนวณเงินเกษียณ-2569-วางแผนเงินพอใช้-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_คำนวณเงินเกษียณ-2569-วางแผนเงินพอใช้-mobile-dark.png`
- Desktop scanned text nodes: 117
- Mobile scanned text nodes: 115
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

## /บทความ/คำนวณเปอร์เซ็นต์-2569-ส่วนลด-กำไร/

- Desktop screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_คำนวณเปอร์เซ็นต์-2569-ส่วนลด-กำไร-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_คำนวณเปอร์เซ็นต์-2569-ส่วนลด-กำไร-mobile-dark.png`
- Desktop scanned text nodes: 145
- Mobile scanned text nodes: 143
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

## /บทความ/คำนวณอัตราแลกเปลี่ยน-บาท-สกุลเงิน-2569/

- Desktop screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_คำนวณอัตราแลกเปลี่ยน-บาท-สกุลเงิน-2569-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_คำนวณอัตราแลกเปลี่ยน-บาท-สกุลเงิน-2569-mobile-dark.png`
- Desktop scanned text nodes: 106
- Mobile scanned text nodes: 104
- Contrast findings:
  - Desktop a.mt-3.inline-flex: ratio 2.46 < 4.5
  - Desktop span: ratio 2.46 < 4.5
  - Desktop span.text-[11px].font-medium: ratio 3.57 < 4.5
  - Mobile a.mt-3.inline-flex: ratio 2.46 < 4.5
  - Mobile span: ratio 2.46 < 4.5
  - Mobile span.text-[11px].font-medium: ratio 3.57 < 4.5

## /บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/

- Desktop screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี-mobile-dark.png`
- Desktop scanned text nodes: 146
- Mobile scanned text nodes: 144
- Contrast findings:
  - Desktop a.inline-block.px-5: ratio 2.46 < 4.5
  - Desktop a.inline-block.px-5: ratio 2.46 < 4.5
  - Mobile a.inline-block.px-5: ratio 2.46 < 4.5
  - Mobile a.inline-block.px-5: ratio 2.46 < 4.5

## /บทความ/เงินฝาก-vs-กองทุน-เปรียบเทียบ-2569/

- Desktop screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_เงินฝาก-vs-กองทุน-เปรียบเทียบ-2569-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_เงินฝาก-vs-กองทุน-เปรียบเทียบ-2569-mobile-dark.png`
- Desktop scanned text nodes: 188
- Mobile scanned text nodes: 186
- Contrast findings:
  - Desktop a.inline-block.px-5: ratio 2.46 < 4.5
  - Desktop td.border.border-gray-200: ratio 3.54 < 4.5
  - Desktop td.border.border-gray-200: ratio 3.60 < 4.5
  - Desktop td.border.border-gray-200: ratio 4.02 < 4.5
  - Desktop td.border.border-gray-200: ratio 3.54 < 4.5
  - Desktop a.inline-block.px-5: ratio 2.46 < 4.5
  - Mobile a.inline-block.px-5: ratio 2.46 < 4.5
  - Mobile td.border.border-gray-200: ratio 3.54 < 4.5
  - Mobile td.border.border-gray-200: ratio 3.60 < 4.5
  - Mobile td.border.border-gray-200: ratio 4.02 < 4.5
  - Mobile td.border.border-gray-200: ratio 3.54 < 4.5
  - Mobile a.inline-block.px-5: ratio 2.46 < 4.5

## /บทความ/ดอกเบี้ยบัตรเครดิต-คิดยังไง-จ่ายขั้นต่ำ-2569/

- Desktop screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_ดอกเบี้ยบัตรเครดิต-คิดยังไง-จ่ายขั้นต่ำ-2569-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_ดอกเบี้ยบัตรเครดิต-คิดยังไง-จ่ายขั้นต่ำ-2569-mobile-dark.png`
- Desktop scanned text nodes: 155
- Mobile scanned text nodes: 153
- Contrast findings:
  - Desktop a.mt-3.inline-flex: ratio 2.46 < 4.5
  - Desktop span: ratio 2.46 < 4.5
  - Desktop span.text-[11px].font-medium: ratio 3.57 < 4.5
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
  - Mobile a.mt-3.inline-flex: ratio 2.46 < 4.5
  - Mobile span: ratio 2.46 < 4.5
  - Mobile span.text-[11px].font-medium: ratio 3.57 < 4.5

## /บทความ/ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร/

- Desktop screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร-mobile-dark.png`
- Desktop scanned text nodes: 92
- Mobile scanned text nodes: 90
- Contrast findings:
  - Desktop a.inline-block.px-5: ratio 2.46 < 4.5
  - Desktop a.inline-block.px-5: ratio 2.46 < 4.5
  - Mobile a.inline-block.px-5: ratio 2.46 < 4.5
  - Mobile a.inline-block.px-5: ratio 2.46 < 4.5

## /บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/

- Desktop screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน-mobile-dark.png`
- Desktop scanned text nodes: 184
- Mobile scanned text nodes: 182
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

## /บทความ/ภาษีมูลค่าเพิ่ม-7-คิดยังไง-สูตรบวกภาษี-ถอดภาษี-ตั้งราคาขายให้ไม่ขาดทุน/

- Desktop screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_ภาษีมูลค่าเพิ่ม-7-คิดยังไง-สูตรบวกภาษี-ถอดภาษี-ตั้งราคาขายให้ไม่ขาดทุน-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_ภาษีมูลค่าเพิ่ม-7-คิดยังไง-สูตรบวกภาษี-ถอดภาษี-ตั้งราคาขายให้ไม่ขาดทุน-mobile-dark.png`
- Desktop scanned text nodes: 177
- Mobile scanned text nodes: 175
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

## /บทความ/รีไฟแนนซ์บ้าน-2569-คุ้มไหม-ดอกเบี้ยใหม่ต้องลดเท่าไร/

- Desktop screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_รีไฟแนนซ์บ้าน-2569-คุ้มไหม-ดอกเบี้ยใหม่ต้องลดเท่าไร-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_รีไฟแนนซ์บ้าน-2569-คุ้มไหม-ดอกเบี้ยใหม่ต้องลดเท่าไร-mobile-dark.png`
- Desktop scanned text nodes: 133
- Mobile scanned text nodes: 131
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

## /บทความ/รีไฟแนนซ์บ้าน-vs-โปะบ้าน-แบบไหนคุ้ม-2569/

- Desktop screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_รีไฟแนนซ์บ้าน-vs-โปะบ้าน-แบบไหนคุ้ม-2569-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_รีไฟแนนซ์บ้าน-vs-โปะบ้าน-แบบไหนคุ้ม-2569-mobile-dark.png`
- Desktop scanned text nodes: 105
- Mobile scanned text nodes: 103
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

## /บทความ/bmi-คำนวณค่าดัชนีมวลกาย-วิธีลดน้ำหนัก/

- Desktop screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_bmi-คำนวณค่าดัชนีมวลกาย-วิธีลดน้ำหนัก-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-17/local/screenshots/บทความ_bmi-คำนวณค่าดัชนีมวลกาย-วิธีลดน้ำหนัก-mobile-dark.png`
- Desktop scanned text nodes: 141
- Mobile scanned text nodes: 139
- Contrast findings:
  - Desktop a.inline-block.px-5: ratio 2.46 < 4.5
  - Desktop td.border.border-gray-200: ratio 4.10 < 4.5
  - Desktop td.border.border-gray-200: ratio 3.54 < 4.5
  - Desktop td.border.border-gray-200: ratio 3.54 < 4.5
  - Desktop td.border.border-gray-200: ratio 4.10 < 4.5
  - Desktop td.border.border-gray-200: ratio 3.43 < 4.5
  - Desktop a.inline-block.px-5: ratio 2.46 < 4.5
  - Mobile a.inline-block.px-5: ratio 2.46 < 4.5
  - Mobile td.border.border-gray-200: ratio 4.10 < 4.5
  - Mobile td.border.border-gray-200: ratio 3.54 < 4.5
  - Mobile td.border.border-gray-200: ratio 3.54 < 4.5
  - Mobile td.border.border-gray-200: ratio 4.10 < 4.5
  - Mobile td.border.border-gray-200: ratio 3.43 < 4.5
  - Mobile a.inline-block.px-5: ratio 2.46 < 4.5

