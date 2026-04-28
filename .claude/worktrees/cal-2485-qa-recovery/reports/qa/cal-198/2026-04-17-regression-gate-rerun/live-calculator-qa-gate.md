# CAL-198 Live Calculator QA Gate

Generated at: 2026-04-17T04:07:38.062Z
Base URL: https://www.kamnuanlek.com

## Inventory

- Calculator routes validated: 12
- Routes in sitemap: 16
- Full-pass routes: 11
- Failing routes: 1
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
| /คำนวณดอกเบี้ยเงินฝาก/ | 200 | pass | pass | pass | pass | PASS |
| /คำนวณภาษีมูลค่าเพิ่ม/ | 200 | pass | pass | pass | pass | PASS |
| /คำนวณภาษีเงินได้บุคคลธรรมดา/ | 200 | pass | pass | pass | pass | PASS |
| /คำนวณอายุ/ | 200 | pass | pass | pass | pass | PASS |
| /คำนวณเงินเดือนสุทธิ/ | 200 | pass | pass | pass | pass | PASS |
| /คำนวณค่าธรรมเนียมโอนบ้าน/ | 200 | pass | pass | pass | pass | PASS |
| /คำนวณอัตราแลกเปลี่ยน/ | 200 | pass | pass | pass | pass | PASS |

## Evidence

### /คำนวณ-bmi/

- Promise: BMI category calculator shows BMI score and category.
- Desktop screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณ-bmi-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณ-bmi-mobile.png`
- Findings: none

### /คำนวณผ่อนรถ/

- Promise: Vehicle installment calculator returns monthly payment and debt ratio.
- Desktop screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณผ่อนรถ-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณผ่อนรถ-mobile.png`
- Findings:
  - Result not resolved for #res-income-ratio (numeric): "คิดเป็นประมาณ -% ของรายได้ต่อเดือน"

### /คำนวณผ่อนกู้/

- Promise: Loan calculator returns monthly installment and total interest.
- Desktop screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณผ่อนกู้-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณผ่อนกู้-mobile.png`
- Findings: none

### /คำนวณผ่อนบ้าน/

- Promise: Mortgage refinance calculator returns delta, savings, and break-even.
- Desktop screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณผ่อนบ้าน-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณผ่อนบ้าน-mobile.png`
- Findings: none

### /คำนวณดอกเบี้ยบัตรเครดิต/

- Promise: Credit-card calculator returns payable interest and next balance.
- Desktop screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณดอกเบี้ยบัตรเครดิต-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณดอกเบี้ยบัตรเครดิต-mobile.png`
- Findings: none

### /คำนวณดอกเบี้ยเงินฝาก/

- Promise: Deposit calculator returns net interest and total maturity amount.
- Desktop screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณดอกเบี้ยเงินฝาก-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณดอกเบี้ยเงินฝาก-mobile.png`
- Findings: none

### /คำนวณภาษีมูลค่าเพิ่ม/

- Promise: VAT calculator returns before-vat amount and VAT amount.
- Desktop screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณภาษีมูลค่าเพิ่ม-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณภาษีมูลค่าเพิ่ม-mobile.png`
- Findings: none

### /คำนวณภาษีเงินได้บุคคลธรรมดา/

- Promise: PIT calculator returns annual tax and monthly take-home pay.
- Desktop screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณภาษีเงินได้บุคคลธรรมดา-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณภาษีเงินได้บุคคลธรรมดา-mobile.png`
- Findings: none

### /คำนวณอายุ/

- Promise: Age calculator returns age in years/months/days and next birthday.
- Desktop screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณอายุ-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณอายุ-mobile.png`
- Findings: none

### /คำนวณเงินเดือนสุทธิ/

- Promise: Net salary calculator returns monthly net salary and deductions.
- Desktop screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณเงินเดือนสุทธิ-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณเงินเดือนสุทธิ-mobile.png`
- Findings: none

### /คำนวณค่าธรรมเนียมโอนบ้าน/

- Promise: Home-transfer-fee calculator returns buyer/seller transfer costs.
- Desktop screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณค่าธรรมเนียมโอนบ้าน-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณค่าธรรมเนียมโอนบ้าน-mobile.png`
- Findings: none

### /คำนวณอัตราแลกเปลี่ยน/

- Promise: FX calculator returns net amount, spread amount, and effective rate.
- Desktop screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณอัตราแลกเปลี่ยน-desktop.png`
- Mobile screenshot: `reports/qa/cal-198/2026-04-17-regression-gate-rerun/screenshots/คำนวณอัตราแลกเปลี่ยน-mobile.png`
- Findings: none
