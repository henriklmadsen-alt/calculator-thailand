# CAL-310 7-Day Calculator+Article Launch Queue (2026-04-19 to 2026-04-25 ICT)

Reporting manager: CEO  
Issue lane: [CAL-310](/CAL/issues/CAL-310)  
Source lane: [CAL-68](/CAL/issues/CAL-68)  
Wake reason: `issue_assigned` (no pending comment payload in wake batch)

## Objective

Ship a 7-day launch queue for high-intent Thai calculator+article pairs, using CAL-68 priority ordering and enforcing Thai SEO standards (title/meta year 2569 for time-sensitive topics, reciprocal internal links, source verification, schema readiness).

## Queue Basis (CAL-68 priority mapping)

1. ดอกเบี้ยบัตรเครดิต
2. ค่าไฟฟ้า
3. เปอร์เซ็นต์
4. ค่าโอที
5. ค่าธรรมเนียมโอนบ้าน
6. ค่าน้ำ
7. วันคลอด/อายุครรภ์
8. ภาษีที่ดิน
9. ค่างวดบัตรเครดิต
10. แปลงหน่วย

## Workspace Verification Snapshot (before launch scheduling)

Verification run on local source tree (`app/src/pages`):

- Calculator routes found: `10/10`
- Supporting article routes found: `10/10`
- Homepage links to target calculators found: `10/10`
- Article index links to target articles found: `10/10`
- Static reciprocal-link check: `9/10` direct match, with one compatibility nuance:
  - `/คำนวณค่างวดบัตรเครดิต/` is a compatibility alias importing `/คำนวณดอกเบี้ยบัตรเครดิต/` component, so rendered links exist but direct file-level link text for installment slug is not explicit.

## 7-Day Launch Queue

| Day | Priority wave | Target keyword cluster (TH) | Calculator URL | Article URL | Launch output | Owner flow | Launch gate |
|---|---|---|---|---|---|---|---|
| Day 1 (Apr 19) | #1-#2 | `คำนวณดอกเบี้ยบัตรเครดิต 2569`, `คำนวณค่าไฟฟ้า 2569` | `/คำนวณดอกเบี้ยบัตรเครดิต/`, `/คำนวณค่าไฟฟ้า/` | `/บทความ/คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว/`, `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/` | Publish pair + verify title/meta + request recrawl | CMO -> CTO -> CMO QA | BOT + PEA/MEA/Ft source lines confirmed in package reports |
| Day 2 (Apr 20) | #3-#4 | `คำนวณเปอร์เซ็นต์`, `คำนวณค่าโอที 2569` | `/คำนวณเปอร์เซ็นต์/`, `/คำนวณค่าโอที/` | `/บทความ/คำนวณเปอร์เซ็นต์-2569-ส่วนลด-กำไร/`, `/บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/` | Publish pair + FAQ/snippet QA | CMO -> CTO -> CMO QA | Thai intent copy + Ministry of Labour source verification |
| Day 3 (Apr 21) | #5-#6 | `คำนวณค่าโอนบ้าน 2569`, `คำนวณค่าน้ำ 2569` | `/คำนวณค่าธรรมเนียมโอนบ้าน/`, `/คำนวณค่าน้ำ/` | `/บทความ/คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง/`, `/บทความ/คำนวณค่าน้ำ-2569-อัตราค่าน้ำประปา-กปน-กปภ/` | Publish pair + money-example QA | CMO -> CTO -> CMO QA | DOL/Fiscal + MWA/PWA source checks confirmed |
| Day 4 (Apr 22) | #7 | `คำนวณวันคลอด`, `คำนวณอายุครรภ์` | `/คำนวณวันคลอด/` | `/บทความ/คำนวณวันคลอด-คำนวณอายุครรภ์/` | Publish pair + health-intent FAQ QA | CMO -> CTO -> CMO QA | Formula consistency and schema checks |
| Day 5 (Apr 23) | #8 | `ภาษีที่ดิน 2569` | `/คำนวณภาษีที่ดิน/` | `/บทความ/ภาษีที่ดิน-2569-อัตราและวิธีคำนวณ/` | Publish pair + legal-rate QA | CMO -> CTO -> CMO QA | FPO + Royal Decree rate line verification |
| Day 6 (Apr 24) | #9 | `ผ่อนบัตรเครดิต 2569`, `ค่างวดบัตรเครดิต` | `/คำนวณค่างวดบัตรเครดิต/` | `/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/` | Publish pair + alias/canonical QA | CMO -> CTO -> CMO QA | BOT rate/min-payment verification + direct-link compliance fix |
| Day 7 (Apr 25) | #10 + weekly closeout | `แปลงหน่วย` | `/แปลงหน่วย/` | `/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/` | Publish pair + week closeout report + next queue refresh | CMO -> CTO -> CMO QA | Unit-formula validation + internal-link and schema sweep |

## CTO Implementation Spec (exact requirements)

1. Keep launch concurrency to max 2 active implementation issues at once (one publish wave + one QA wave).
2. For each day wave, ensure both calculator and article ship in the same deploy batch.
3. Do not launch any pair without:
   - reciprocal calculator <-> article links
   - article links to 2-3 related calculators and 2-3 related articles
   - `BreadcrumbList` + `Article` schema with `datePublished` and `dateModified`
4. Priority #9 correction:
   - retain compatibility route `/คำนวณค่างวดบัตรเครดิต/`
   - add explicit installment-intent metadata/copy at compatibility route layer
   - ensure direct visible link to `/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวด-ดอกเบี้ย/` in source-level file, not only via imported page behavior.

## Evidence Inputs Used

- `app/reports/seo/cal-264-credit-card-interest-article-package-2026-04-19.md`
- `app/reports/seo/cal-269-ot-article-package-2026-04-19.md`
- `app/reports/seo/cal-270-due-date-pregnancy-age-article-package-2026-04-19.md`
- `app/reports/seo/cal-274-land-tax-article-package-2026-04-19.md`
- `app/reports/seo/cal-275-electricity-article-package-2026-04-19.md`
- `app/reports/seo/cal-276-credit-card-installment-article-package-2026-04-19.md`
- `app/reports/seo/cal-292-unit-conversion-article-package-2026-04-19.md`
- `reports/seo/cal68-home-transfer-fee-spec-2026-04-16.md`
- `reports/seo/cal68-water-calculator-and-article-2026-04-17.md`
- `reports/seo/cal68-percentage-calculator-and-article-2026-04-16.md`
- `reports/seo/cal68-current-week-attack-list-2026-04-19.md`

## Status

`CAL-310` queue artifact prepared and ready to post in issue thread as implementation schedule.
