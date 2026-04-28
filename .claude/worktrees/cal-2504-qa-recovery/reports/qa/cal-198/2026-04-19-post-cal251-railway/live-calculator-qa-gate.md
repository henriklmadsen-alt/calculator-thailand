# CAL-198 Live Calculator QA Gate

Generated at: 2026-04-19T16:27:56.315Z
Base URL: https://calculator-thailand-production.up.railway.app

## Inventory

- Calculator routes validated: 12
- Routes in sitemap: 17
- Full-pass routes: 10
- Failing routes: 2
- Top-calculator regression checks: 6
- Top-calculator regressions passed: 5
- Release gate verdict: FAIL
- Regression gate owner: CTO

## Post-Deploy Regression Gate

| Route | Tier | Verdict |
| --- | --- | --- |
| /คำนวณผ่อนรถ/ | top | FAIL |
| /คำนวณดอกเบี้ยบัตรเครดิต/ | top | PASS |
| /คำนวณภาษีเงินได้บุคคลธรรมดา/ | top | PASS |
| /คำนวณเงินเดือนสุทธิ/ | top | PASS |
| /คำนวณค่าธรรมเนียมโอนบ้าน/ | top | PASS |
| /คำนวณอัตราแลกเปลี่ยน/ | top | PASS |

Regression gate failed: release must be treated as failed and escalated immediately.

## Pass/Fail Matrix

| Route | HTTP | Thai Copy | Desktop Overflow | Mobile Overflow | Functional | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| /คำนวณ-bmi/ | 200 | pass | pass | pass | pass | PASS |
| /คำนวณผ่อนรถ/ | 200 | pass | pass | pass | fail | FAIL |
| /คำนวณผ่อนกู้/ | 200 | pass | pass | pass | pass | PASS |
| /คำนวณผ่อนบ้าน/ | 200 | pass | pass | pass | pass | PASS |
| /คำนวณดอกเบี้ยบัตรเครดิต/ | 200 | pass | pass | pass | pass | PASS |
| /คำนวณดอกเบี้ยเงินฝาก/ | 200 | pass | pass | pass | fail | FAIL |
| /คำนวณภาษีมูลค่าเพิ่ม/ | 200 | pass | pass | pass | pass | PASS |
| /คำนวณภาษีเงินได้บุคคลธรรมดา/ | 200 | pass | pass | pass | pass | PASS |
| /คำนวณอายุ/ | 200 | pass | pass | pass | pass | PASS |
| /คำนวณเงินเดือนสุทธิ/ | 200 | pass | pass | pass | pass | PASS |
| /คำนวณค่าธรรมเนียมโอนบ้าน/ | 200 | pass | pass | pass | pass | PASS |
| /คำนวณอัตราแลกเปลี่ยน/ | 200 | pass | pass | pass | pass | PASS |

## Evidence

### /คำนวณ-bmi/

- Promise: BMI category calculator shows BMI score and category.
- Desktop screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณ-bmi-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณ-bmi-mobile.png`
- Findings: none

### /คำนวณผ่อนรถ/

- Promise: Vehicle installment calculator returns monthly payment and debt ratio.
- Desktop screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณผ่อนรถ-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณผ่อนรถ-mobile.png`
- Findings:
  - Unhandled error: Error: page.goto: net::ERR_NO_BUFFER_SPACE at https://calculator-thailand-production.up.railway.app/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%A3%E0%B8%96/
Call log:
[2m  - navigating to "https://calculator-thailand-production.up.railway.app/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%A3%E0%B8%96/", waiting until "domcontentloaded"[22m


### /คำนวณผ่อนกู้/

- Promise: Loan calculator returns monthly installment and total interest.
- Desktop screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณผ่อนกู้-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณผ่อนกู้-mobile.png`
- Findings: none

### /คำนวณผ่อนบ้าน/

- Promise: Mortgage refinance calculator returns delta, savings, and break-even.
- Desktop screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณผ่อนบ้าน-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณผ่อนบ้าน-mobile.png`
- Findings: none

### /คำนวณดอกเบี้ยบัตรเครดิต/

- Promise: Credit-card calculator returns payable interest and next balance.
- Desktop screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณดอกเบี้ยบัตรเครดิต-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณดอกเบี้ยบัตรเครดิต-mobile.png`
- Findings: none

### /คำนวณดอกเบี้ยเงินฝาก/

- Promise: Deposit calculator returns net interest and total maturity amount.
- Desktop screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณดอกเบี้ยเงินฝาก-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณดอกเบี้ยเงินฝาก-mobile.png`
- Findings:
  - Unhandled error: Error: page.goto: net::ERR_NO_BUFFER_SPACE at https://calculator-thailand-production.up.railway.app/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%9D%E0%B8%B2%E0%B8%81/
Call log:
[2m  - navigating to "https://calculator-thailand-production.up.railway.app/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%9D%E0%B8%B2%E0%B8%81/", waiting until "domcontentloaded"[22m


### /คำนวณภาษีมูลค่าเพิ่ม/

- Promise: VAT calculator returns before-vat amount and VAT amount.
- Desktop screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณภาษีมูลค่าเพิ่ม-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณภาษีมูลค่าเพิ่ม-mobile.png`
- Findings: none

### /คำนวณภาษีเงินได้บุคคลธรรมดา/

- Promise: PIT calculator returns annual tax and monthly take-home pay.
- Desktop screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณภาษีเงินได้บุคคลธรรมดา-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณภาษีเงินได้บุคคลธรรมดา-mobile.png`
- Findings: none

### /คำนวณอายุ/

- Promise: Age calculator returns age in years/months/days and next birthday.
- Desktop screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณอายุ-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณอายุ-mobile.png`
- Findings: none

### /คำนวณเงินเดือนสุทธิ/

- Promise: Net salary calculator returns monthly net salary and deductions.
- Desktop screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณเงินเดือนสุทธิ-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณเงินเดือนสุทธิ-mobile.png`
- Findings: none

### /คำนวณค่าธรรมเนียมโอนบ้าน/

- Promise: Home-transfer-fee calculator returns buyer/seller transfer costs.
- Desktop screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณค่าธรรมเนียมโอนบ้าน-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณค่าธรรมเนียมโอนบ้าน-mobile.png`
- Findings: none

### /คำนวณอัตราแลกเปลี่ยน/

- Promise: FX calculator returns net amount, spread amount, and effective rate.
- Desktop screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณอัตราแลกเปลี่ยน-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-19-post-cal251-railway/screenshots/คำนวณอัตราแลกเปลี่ยน-mobile.png`
- Findings: none
