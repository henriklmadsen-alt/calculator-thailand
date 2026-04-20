# CAL-216 Subtask Report: Article Dark-Mode QA Evidence

Generated at: 2026-04-18T05:49:50.233Z
Execution source: reports/qa/cal-216/2026-04-18/alpha-live/darkmode-article-routes.json
Base URL: https://calculator-thailand-production.up.railway.app

## Goal Alignment

- Validate dark-mode readability on live article routes before parent CAL-214 close-out.
- Provide screenshot and selector-level evidence for desktop/mobile defects.

## Run Summary

- Routes checked: 3
- PASS: 0
- FAIL: 3

| Route (encoded pathname) | Desktop | Mobile | Theme Dark Applied | Overflow | Contrast Failures (Desktop/Mobile) | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| /%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93-%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%A7%E0%B8%94%E0%B8%A3%E0%B8%96%E0%B8%A2%E0%B8%99%E0%B8%95%E0%B9%8C-2569-%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B9%80%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%A3/ | 200 | 200 | fail | pass | 81/81 | FAIL |
| /%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B9%80%E0%B8%99%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99-2569-%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99-%E0%B8%88%E0%B8%94%E0%B8%88%E0%B8%B3%E0%B8%99%E0%B8%AD%E0%B8%87/ | 200 | 200 | fail | fail | 129/129 | FAIL |
| /%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3-2569-%E0%B8%AD%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%9B%E0%B8%B2-%E0%B8%81%E0%B8%9B%E0%B8%99-%E0%B8%81%E0%B8%9B%E0%B8%A0/ | 200 | 200 | fail | fail | 117/117 | FAIL |

## Route Evidence

### /%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93-%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%A7%E0%B8%94%E0%B8%A3%E0%B8%96%E0%B8%A2%E0%B8%99%E0%B8%95%E0%B9%8C-2569-%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B9%80%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%A3/

- Route URL: `https://calculator-thailand-production.up.railway.app/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93-%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%A7%E0%B8%94%E0%B8%A3%E0%B8%96%E0%B8%A2%E0%B8%99%E0%B8%95%E0%B9%8C-2569-%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B9%80%E0%B8%97%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%A3/`
- Desktop screenshot: `reports/qa/cal-216/2026-04-18/alpha-live/screenshots/บทความ_คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-18/alpha-live/screenshots/บทความ_คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร-mobile-dark.png`
- Desktop theme markers: theme=`null`, preference=`null`
- Mobile theme markers: theme=`null`, preference=`null`
- Desktop overflow: false
- Mobile overflow: false
- Contrast failures: desktop=81, mobile=81
- Selector-level findings (first 8 per viewport):
  - Desktop span.text-xs.text-gray-500: ratio 3.04 < 4.5
  - Desktop main.flex-1.max-w-3xl: ratio 1.14 < 4.5
  - Desktop nav.text-sm.text-gray-500: ratio 4.17 < 4.5
  - Desktop ol.flex.items-center: ratio 4.17 < 4.5
  - Desktop a.hover:text-primary-600.transition-colors: ratio 4.17 < 4.5
  - Desktop a.hover:text-primary-600.transition-colors: ratio 4.17 < 4.5
  - Desktop li.text-gray-700.font-medium: ratio 1.96 < 4.5
  - Desktop article.prose: ratio 1.14 < 4.5
  - Mobile span.text-xs.text-gray-500: ratio 3.04 < 4.5
  - Mobile main.flex-1.max-w-3xl: ratio 1.14 < 4.5
  - Mobile nav.text-sm.text-gray-500: ratio 4.17 < 4.5
  - Mobile ol.flex.items-center: ratio 4.17 < 4.5
  - Mobile a.hover:text-primary-600.transition-colors: ratio 4.17 < 4.5
  - Mobile a.hover:text-primary-600.transition-colors: ratio 4.17 < 4.5
  - Mobile li.text-gray-700.font-medium: ratio 1.96 < 4.5
  - Mobile article.prose: ratio 1.14 < 4.5

### /%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B9%80%E0%B8%99%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99-2569-%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99-%E0%B8%88%E0%B8%94%E0%B8%88%E0%B8%B3%E0%B8%99%E0%B8%AD%E0%B8%87/

- Route URL: `https://calculator-thailand-production.up.railway.app/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B9%80%E0%B8%99%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99-2569-%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99-%E0%B8%88%E0%B8%94%E0%B8%88%E0%B8%B3%E0%B8%99%E0%B8%AD%E0%B8%87/`
- Desktop screenshot: `reports/qa/cal-216/2026-04-18/alpha-live/screenshots/บทความ_คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-18/alpha-live/screenshots/บทความ_คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง-mobile-dark.png`
- Desktop theme markers: theme=`null`, preference=`null`
- Mobile theme markers: theme=`null`, preference=`null`
- Desktop overflow: false
- Mobile overflow: true
- Contrast failures: desktop=129, mobile=129
- Selector-level findings (first 8 per viewport):
  - Desktop span.text-xs.text-gray-500: ratio 3.04 < 4.5
  - Desktop main.flex-1.max-w-3xl: ratio 1.14 < 4.5
  - Desktop nav.text-sm.text-gray-500: ratio 4.17 < 4.5
  - Desktop ol.flex.items-center: ratio 4.17 < 4.5
  - Desktop a.hover:text-primary-600.transition-colors: ratio 4.17 < 4.5
  - Desktop a.hover:text-primary-600.transition-colors: ratio 4.17 < 4.5
  - Desktop li.text-gray-700.font-medium: ratio 1.96 < 4.5
  - Desktop article.prose: ratio 1.14 < 4.5
  - Mobile span.text-xs.text-gray-500: ratio 3.04 < 4.5
  - Mobile main.flex-1.max-w-3xl: ratio 1.14 < 4.5
  - Mobile nav.text-sm.text-gray-500: ratio 4.17 < 4.5
  - Mobile ol.flex.items-center: ratio 4.17 < 4.5
  - Mobile a.hover:text-primary-600.transition-colors: ratio 4.17 < 4.5
  - Mobile a.hover:text-primary-600.transition-colors: ratio 4.17 < 4.5
  - Mobile li.text-gray-700.font-medium: ratio 1.96 < 4.5
  - Mobile article.prose: ratio 1.14 < 4.5

### /%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3-2569-%E0%B8%AD%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%9B%E0%B8%B2-%E0%B8%81%E0%B8%9B%E0%B8%99-%E0%B8%81%E0%B8%9B%E0%B8%A0/

- Route URL: `https://calculator-thailand-production.up.railway.app/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3-2569-%E0%B8%AD%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%9B%E0%B8%B2-%E0%B8%81%E0%B8%9B%E0%B8%99-%E0%B8%81%E0%B8%9B%E0%B8%A0/`
- Desktop screenshot: `reports/qa/cal-216/2026-04-18/alpha-live/screenshots/บทความ_คำนวณค่าน้ำ-2569-อัตราค่าน้ำประปา-กปน-กปภ-desktop-dark.png`
- Mobile screenshot: `reports/qa/cal-216/2026-04-18/alpha-live/screenshots/บทความ_คำนวณค่าน้ำ-2569-อัตราค่าน้ำประปา-กปน-กปภ-mobile-dark.png`
- Desktop theme markers: theme=`null`, preference=`null`
- Mobile theme markers: theme=`null`, preference=`null`
- Desktop overflow: false
- Mobile overflow: true
- Contrast failures: desktop=117, mobile=117
- Selector-level findings (first 8 per viewport):
  - Desktop span.text-xs.text-gray-500: ratio 3.04 < 4.5
  - Desktop main.flex-1.max-w-3xl: ratio 1.14 < 4.5
  - Desktop nav.text-sm.text-gray-500: ratio 4.17 < 4.5
  - Desktop ol.flex.items-center: ratio 4.17 < 4.5
  - Desktop a.hover:text-primary-600.transition-colors: ratio 4.17 < 4.5
  - Desktop a.hover:text-primary-600.transition-colors: ratio 4.17 < 4.5
  - Desktop li.text-gray-700.font-medium: ratio 1.96 < 4.5
  - Desktop article.prose: ratio 1.14 < 4.5
  - Mobile span.text-xs.text-gray-500: ratio 3.04 < 4.5
  - Mobile main.flex-1.max-w-3xl: ratio 1.14 < 4.5
  - Mobile nav.text-sm.text-gray-500: ratio 4.17 < 4.5
  - Mobile ol.flex.items-center: ratio 4.17 < 4.5
  - Mobile a.hover:text-primary-600.transition-colors: ratio 4.17 < 4.5
  - Mobile a.hover:text-primary-600.transition-colors: ratio 4.17 < 4.5
  - Mobile li.text-gray-700.font-medium: ratio 1.96 < 4.5
  - Mobile article.prose: ratio 1.14 < 4.5

## Full Detail

- Full selector list and raw payload: `reports/qa/cal-216/2026-04-18/alpha-live/darkmode-article-routes.json`
- Full markdown dump from runner: `reports/qa/cal-216/2026-04-18/alpha-live/darkmode-article-routes.md`
