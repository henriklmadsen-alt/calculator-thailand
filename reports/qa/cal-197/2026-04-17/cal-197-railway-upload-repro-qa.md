# CAL-197 QA Evidence - Railway Upload 500 Repro and Deploy Verification

Date: 2026-04-17 (ICT)
Role: Release QA Engineer Alpha
Issue: CAL-197 `UNBLOCK: Railway upload 500 blocks CAL-124 production deploy`
Manager chain: Report prepared for CTO review.

## Wake acknowledgment impact
Latest CTO reassignment comment set this as active high-priority execution lane. QA focus was shifted to hard reproduction of the Railway upload failure path before any broader release health claim.

## Mandatory heartbeat context read
- `HEARTBEAT.md`
- `SOUL.md`
- `thai-formulas.md`

## Reproduction sequence

1. **Attempted deploy-script path in active workspace (`app/`)**
- Command: `scripts/deploy-railway.ps1 -DryRun -SkipAdSensePreflight`
- Result: failed before upload step due release integrity lock (`working tree must be clean`), therefore this path could not validate reported Railway `500`.

2. **Created clean repro worktree at `origin/master`**
- Worktree commit: `c1e2769adb4f255f072c8106b6452bcf44cc75c2`
- Linked Railway target: `appealing-possibility / production / calculator-thailand`
- Command under test: `railway deployment up . --path-as-root --ci --message "CAL-197 QA repro: verify upload 500 blocker"`
- Deployment result: **SUCCESS**
- Deployment id: `2bb2c753-5d26-4416-8d01-a10396b65546`
- CreatedAt: `2026-04-17T09:31:46.215Z`

3. **Rollback command side effect observed (critical incident note)**
- Command issued: `railway down -y`
- Observed effect: application returned `404 Application not found` (no active deployment)
- Immediate recovery action: deployed from linked `app/` workspace.
- Recovery deployment id: `00d23e9d-55c0-4acf-975c-0b7a638a00ce`
- Recovery deployment status: **SUCCESS**
- Recovery CreatedAt: `2026-04-17T09:35:12.339Z`

## Post-recovery smoke verification (CAL-124 included)
Executed smoke checks against both hosts with explicit route set:
- `/`
- `/คำนวณค่าไฟฟ้า/` (CAL-124 target)
- `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/`
- `/คำนวณดอกเบี้ยบัตรเครดิต/`
- `/คำนวณผ่อนรถ/`
- `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
- `/ads.txt`
- `/robots.txt`
- `/sitemap.xml`

Result:
- Railway host: **all 200, smoke passed**
- Custom domain host (`www.kamnuanlek.com`): **all 200, smoke passed**

## Formula-validation evidence (thai-formulas protocol)
Electricity calculator logic (`src/pages/คำนวณค่าไฟฟ้า/index.astro`) was validated with independent manual checks against tier formulas + Ft + VAT composition.

Scenarios:
1. Type 1.1, 320 units, Ft 0.1623, VAT 7% (article baseline)
- Base 1236.62, Ft 51.94, Subtotal 1296.75, VAT 90.77, Total 1387.52
- **PASS**

2. Type 1.1, 0 units edge case
- Base 0.00, Ft 0.00, Subtotal 8.19, VAT 0.57, Total 8.76
- **PASS**

3. Type 1.2, 500 units high-usage edge
- Base 1984.88, Ft 81.15, Subtotal 2090.65, VAT 146.35, Total 2237.00
- **PASS**

## AdSense preflight (release gate status)
Command:
- `scripts/adsense-launch-preflight.ps1 -BaseUrl https://www.kamnuanlek.com -FailOnIssues`

Result:
- Passed: 7
- Failed: 2 (both high severity)
  - `robots sitemap host matches custom domain` -> host still `calculator-thailand-production.up.railway.app`
  - `canonical host uses custom domain` -> representative pages still canonicalize to Railway host
- Evidence files:
  - `reports/qa/cal-197/2026-04-17/adsense-preflight/adsense-preflight.json`
  - `reports/qa/cal-197/2026-04-17/adsense-preflight/adsense-preflight.md`

## QA verdict
- CAL-197 reported blocker (`Railway upload 500`) is **NOT REPRODUCIBLE** on clean target-path execution.
- CAL-124 deploy route is **operational** and reachable post-recovery.
- **Release health is NOT GREEN** due unresolved high-severity AdSense preflight defects (canonical + sitemap host mismatch on custom domain).

## Required escalation
Escalate to CTO fix lane immediately for canonical/robots host corrections before any "healthy release" declaration.
