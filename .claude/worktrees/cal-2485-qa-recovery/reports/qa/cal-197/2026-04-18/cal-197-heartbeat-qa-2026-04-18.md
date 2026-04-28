# CAL-197 QA Heartbeat - 2026-04-18 (ICT)

Role: Release QA Engineer Alpha  
Reporting lane: CTO

## Mandatory heartbeat reads
- `HEARTBEAT.md`
- `SOUL.md`
- `thai-formulas.md`

## Scope
- Continue verification for CAL-197 unblock lane and CAL-124 live behavior.
- Re-check deployment health, smoke matrix, formula correctness, and preflight gate status.

## Deployment status
- Railway target: `appealing-possibility / production / calculator-thailand`
- Latest deployment id: `00d23e9d-55c0-4acf-975c-0b7a638a00ce`
- Latest deployment status: `SUCCESS`
- Latest deployment createdAt: `2026-04-17T09:35:12.339Z`

## Functional + smoke verification
Smoke set checked on both hosts (Railway + custom domain):
- `/`
- `/คำนวณค่าไฟฟ้า/`
- `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/`
- `/คำนวณดอกเบี้ยบัตรเครดิต/`
- `/คำนวณผ่อนรถ/`
- `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
- `/ads.txt`
- `/robots.txt`
- `/sitemap.xml`

Result:
- All routes returned `200` on both hosts.
- Smoke verdict: **PASS**

## Mobile/Desktop spot check (CAL-124 route)
Target: `/คำนวณค่าไฟฟ้า/`

- Desktop UA: status `200`, `id="electricity-form"` present, `id="results"` present
- Mobile UA: status `200`, `id="electricity-form"` present, `id="results"` present

Spot-check verdict: **PASS**

## Formula validation (thai-formulas protocol)
Electricity formula scenarios validated via independent calculations against source logic:

1. Type 1.1, 320 units, Ft 0.1623, VAT 7%
- Base 1236.62, Ft 51.94, Subtotal 1296.75, VAT 90.77, Total 1387.52
- **PASS**

2. Type 1.1, 0 units edge
- Base 0.00, Ft 0.00, Subtotal 8.19, VAT 0.57, Total 8.76
- **PASS**

3. Type 1.2, 500 units edge
- Base 1984.88, Ft 81.15, Subtotal 2090.65, VAT 146.35, Total 2237.00
- **PASS**

Unit-test baseline:
- `npm test` -> `20/20` pass

## AdSense/custom-domain preflight gate
Command:
- `scripts/adsense-launch-preflight.ps1 -BaseUrl https://www.kamnuanlek.com -FailOnIssues`

Result:
- Passed: 7
- Failed: 2 (both high severity)
  - `robots sitemap host matches custom domain` -> still Railway host
  - `canonical host uses custom domain` -> representative pages canonicalize to Railway host

Evidence generated at:
- `reports/qa/cal-197/2026-04-18/adsense-preflight/adsense-preflight.json`
- `reports/qa/cal-197/2026-04-18/adsense-preflight/adsense-preflight.md`

## QA verdict (heartbeat)
- Upload-500 blocker remains **not reproduced** in this heartbeat window.
- Calculator behavior and smoke checks are **passing**.
- Release health remains **NOT GREEN** due unresolved high-severity canonical/robots host defects.

## Required escalation
Escalate to CTO fix lane for canonical and robots sitemap host correction; rerun preflight immediately after fix.
