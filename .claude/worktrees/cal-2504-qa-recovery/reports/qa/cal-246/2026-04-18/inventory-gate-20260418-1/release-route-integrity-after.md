# CAL-197 Release Route Integrity (after)

- Generated at: 2026-04-18T12:07:32.181Z
- Base URL: https://www.kamnuanlek.com
- Release SHA: cal-246-heartbeat
- Deployment ID: live-snapshot
- Sitemap source: https://www.kamnuanlek.com/sitemap.xml
- Verdict: FAIL

## Inventory

- Approved routes: 12
- Live routes from sitemap: 9
- Live calculator links on homepage: 14
- Missing live routes: 5
- Unexpected live routes: 2
- Homepage missing routes: 0
- Homepage unexpected routes: 2
- Route checks (HTTP): 12/12
- Route checks (UI): 12/12

## Approved vs Live Diff

- Missing live route: /คำนวณดอกเบี้ยบัตรเครดิต/
- Missing live route: /คำนวณดอกเบี้ยเงินฝาก/
- Missing live route: /คำนวณผ่อนบ้าน/
- Missing live route: /คำนวณผ่อนรถ/
- Missing live route: /คำนวณอายุ/
- Unexpected live route: /คำนวณค่าโอนบ้าน/
- Unexpected live route: /คำนวณเปอร์เซ็นต์/

## Approved vs Homepage Diff

- Unexpected homepage link: /คำนวณค่าโอนบ้าน/
- Unexpected homepage link: /คำนวณเปอร์เซ็นต์/

## Before/After Delta

- Baseline report: reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1/release-route-integrity-before.json
- Regressed routes: 0
- Recovered routes: 0

## Route Checklist

| Route | HTTP | UI Visible | Screenshot |
| --- | --- | --- | --- |
| /คำนวณ-bmi/ | 200 | pass | `reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1/screenshots/คำนวณ-bmi.png` |
| /คำนวณค่าโอที/ | 200 | pass | `reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1/screenshots/คำนวณค่าโอที.png` |
| /คำนวณค่าไฟฟ้า/ | 200 | pass | `reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1/screenshots/คำนวณค่าไฟฟ้า.png` |
| /คำนวณดอกเบี้ยบัตรเครดิต/ | 200 | pass | `reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1/screenshots/คำนวณดอกเบี้ยบัตรเครดิต.png` |
| /คำนวณดอกเบี้ยเงินฝาก/ | 200 | pass | `reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1/screenshots/คำนวณดอกเบี้ยเงินฝาก.png` |
| /คำนวณผ่อนกู้/ | 200 | pass | `reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1/screenshots/คำนวณผ่อนกู้.png` |
| /คำนวณผ่อนบ้าน/ | 200 | pass | `reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1/screenshots/คำนวณผ่อนบ้าน.png` |
| /คำนวณผ่อนรถ/ | 200 | pass | `reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1/screenshots/คำนวณผ่อนรถ.png` |
| /คำนวณภาษีมูลค่าเพิ่ม/ | 200 | pass | `reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1/screenshots/คำนวณภาษีมูลค่าเพิ่ม.png` |
| /คำนวณภาษีเงินได้บุคคลธรรมดา/ | 200 | pass | `reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1/screenshots/คำนวณภาษีเงินได้บุคคลธรรมดา.png` |
| /คำนวณอายุ/ | 200 | pass | `reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1/screenshots/คำนวณอายุ.png` |
| /คำนวณเงินเดือนสุทธิ/ | 200 | pass | `reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1/screenshots/คำนวณเงินเดือนสุทธิ.png` |

## Failures

- Missing approved routes in live sitemap: /คำนวณดอกเบี้ยบัตรเครดิต/, /คำนวณดอกเบี้ยเงินฝาก/, /คำนวณผ่อนบ้าน/, /คำนวณผ่อนรถ/, /คำนวณอายุ/
- Unexpected calculator routes in live sitemap: /คำนวณค่าโอนบ้าน/, /คำนวณเปอร์เซ็นต์/
- Unexpected calculator links on homepage: /คำนวณค่าโอนบ้าน/, /คำนวณเปอร์เซ็นต์/

