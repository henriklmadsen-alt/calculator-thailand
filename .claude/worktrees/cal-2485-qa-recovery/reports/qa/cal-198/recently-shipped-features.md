# CAL-198 Recently Shipped Features Baseline

Purpose: baseline regression checklist for post-deploy verification.

Owner: `CTO`  
Update rule: add each newly shipped production calculator here with baseline selectors and sample inputs.

## Top Calculators (Regression Critical)

| Route | Baseline behavior to preserve | Baseline result selectors |
| --- | --- | --- |
| `/คำนวณผ่อนรถ/` | Monthly payment and income ratio render after submit | `#res-monthly`, `#res-income-ratio` |
| `/คำนวณดอกเบี้ยบัตรเครดิต/` | Total interest and next balance render after submit | `#res-total-interest`, `#res-next-balance` |
| `/คำนวณภาษีเงินได้บุคคลธรรมดา/` | Annual tax and monthly take-home render after submit | `#result-annual-tax`, `#result-monthly-take-home` |
| `/คำนวณเงินเดือนสุทธิ/` | Net salary and deductions render after submit | `#res-net`, `#res-total-deductions` |
| `/คำนวณค่าธรรมเนียมโอนบ้าน/` | Transfer fee and total costs render after submit | `#res-transfer-fee`, `#res-total-costs` |
| `/คำนวณอัตราแลกเปลี่ยน/` | Net amount and effective rate render after submit | `#res-net-amount`, `#res-effective-rate` |

## Regression Gate Rule

- Any fail in this table means release regression gate is `FAIL`.
- On fail: escalate immediately in CAL-198 issue comment and open/link fix lane(s).
- On pass: include artifact links (`.md`, `.json`, screenshots) in the issue comment.
