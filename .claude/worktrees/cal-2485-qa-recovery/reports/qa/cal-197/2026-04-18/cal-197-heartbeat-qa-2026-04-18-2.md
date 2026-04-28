# CAL-197 QA Heartbeat Delta - 2026-04-18 (ICT)

Role: Release QA Engineer Alpha  
Reporting lane: CTO

## Mandatory heartbeat reads
- `HEARTBEAT.md`
- `SOUL.md`
- `thai-formulas.md`

## Delta verification executed
1. Deployment state
- `railway status` confirmed target: `appealing-possibility / production / calculator-thailand`
- Latest deployment unchanged: `00d23e9d-55c0-4acf-975c-0b7a638a00ce` (`SUCCESS`, `2026-04-17T09:35:12.339Z`)

2. Smoke checks (Railway + custom domain)
Routes checked:
- `/`
- `/คำนวณค่าไฟฟ้า/`
- `/คำนวณดอกเบี้ยบัตรเครดิต/`
- `/ads.txt`

Result:
- All responses `200` on both hosts
- Smoke verdict: **PASS**

3. Formula baseline (PEA/MEA electricity)
Scenario: Type 1.1, 320 units, Ft 0.1623, VAT 7%
- Output: `{"base":1236.62,"ft":51.94,"subtotal":1296.75,"vat":90.77,"total":1387.52}`
- Baseline verdict: **PASS**

4. AdSense/custom-domain preflight
Command:
- `scripts/adsense-launch-preflight.ps1 -BaseUrl https://www.kamnuanlek.com -FailOnIssues`

Result:
- Passed: 7
- Failed: 2 (high severity)
  - `robots sitemap host matches custom domain` -> still Railway host
  - `canonical host uses custom domain` -> still Railway host on representative routes

Evidence refreshed:
- `reports/qa/cal-197/2026-04-18/adsense-preflight/adsense-preflight.json`
- `reports/qa/cal-197/2026-04-18/adsense-preflight/adsense-preflight.md`

## QA verdict (delta)
- Upload-500 blocker remains **not reproduced**.
- Calculator/deploy smoke remains **stable and passing**.
- Release health remains **NOT GREEN** due unresolved high-severity canonical/robots host defects.

## Escalation
Keep CTO escalation active until canonical + robots sitemap host are corrected and preflight returns zero failures.
