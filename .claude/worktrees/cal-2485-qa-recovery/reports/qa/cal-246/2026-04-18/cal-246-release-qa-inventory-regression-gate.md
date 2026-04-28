# CAL-246 Release QA: GitHub-vs-Live Calculator Inventory Regression Gate

Date: 2026-04-18 (ICT)
Reporter: Release QA Engineer Alpha
Escalation Target: CTO
Status: FAIL (Release Blocker)

## Wake Acknowledgment Impact
No pending issue comments were provided in this wake. Immediate action was shifted to direct gate execution using the release route-integrity verifier so the GitHub-approved inventory could be compared against live deployment inventory with artifacts.

## Verification Scope
1. Canonical approved inventory from GitHub workspace: `config/approved-calculator-inventory.json`
2. Live endpoint A: `https://www.kamnuanlek.com`
3. Live endpoint B: `https://calculator-thailand-production.up.railway.app`
4. Gate checks executed:
- Approved-vs-live sitemap inventory parity
- Approved-vs-homepage calculator link parity
- Per-approved-route HTTP 200 + visible calculator UI checks (mobile viewport)
- Before/after run pair with regression delta

## Commands Executed
```powershell
node scripts/release-route-integrity.mjs --base-url https://www.kamnuanlek.com --report-dir reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1 --phase before --release-sha cal-246-heartbeat --skip-screenshots
node scripts/release-route-integrity.mjs --base-url https://www.kamnuanlek.com --report-dir reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1 --phase after --release-sha cal-246-heartbeat --deployment-id live-snapshot --compare-report reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1/release-route-integrity-before.json
node scripts/release-route-integrity.mjs --base-url https://calculator-thailand-production.up.railway.app --report-dir reports/qa/cal-246/2026-04-18/inventory-gate-railway-20260418-1 --phase before --release-sha cal-246-heartbeat --skip-screenshots
node scripts/release-route-integrity.mjs --base-url https://calculator-thailand-production.up.railway.app --report-dir reports/qa/cal-246/2026-04-18/inventory-gate-railway-20260418-1 --phase after --release-sha cal-246-heartbeat --deployment-id railway-live-snapshot --compare-report reports/qa/cal-246/2026-04-18/inventory-gate-railway-20260418-1/release-route-integrity-before.json
```

## Results Summary
- Per-route functional availability: `12/12` approved calculators return HTTP `200` and pass visible UI checks.
- Inventory parity gate: FAIL on both live endpoints.
- Endpoint consistency: identical mismatches on both domains.

## Critical Defects (Release Blocking)
1. Approved routes missing from live sitemap (5):
- `/คำนวณดอกเบี้ยบัตรเครดิต/`
- `/คำนวณดอกเบี้ยเงินฝาก/`
- `/คำนวณผ่อนบ้าน/`
- `/คำนวณผ่อนรถ/`
- `/คำนวณอายุ/`

2. Unapproved routes present in live sitemap (2):
- `/คำนวณค่าโอนบ้าน/`
- `/คำนวณเปอร์เซ็นต์/`

3. Unapproved routes linked on homepage (2):
- `/คำนวณค่าโอนบ้าน/`
- `/คำนวณเปอร์เซ็นต์/`

## Repro Steps
1. Use current `origin/master` inventory file (`config/approved-calculator-inventory.json`).
2. Run the `after` phase verifier command against either production hostname.
3. Observe non-zero diff values and process exit code `1`.
4. Inspect generated `release-route-integrity-after.json` `failures` array for exact mismatch list.

## Evidence Artifacts
Primary (kamnuanlek):
- `reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1/release-route-integrity-before.json`
- `reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1/release-route-integrity-before.md`
- `reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1/release-route-integrity-after.json`
- `reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1/release-route-integrity-after.md`
- `reports/qa/cal-246/2026-04-18/inventory-gate-20260418-1/screenshots/*`

Cross-check (Railway):
- `reports/qa/cal-246/2026-04-18/inventory-gate-railway-20260418-1/release-route-integrity-before.json`
- `reports/qa/cal-246/2026-04-18/inventory-gate-railway-20260418-1/release-route-integrity-before.md`
- `reports/qa/cal-246/2026-04-18/inventory-gate-railway-20260418-1/release-route-integrity-after.json`
- `reports/qa/cal-246/2026-04-18/inventory-gate-railway-20260418-1/release-route-integrity-after.md`
- `reports/qa/cal-246/2026-04-18/inventory-gate-railway-20260418-1/screenshots/*`

## Additional Heartbeat Verification (Functional + Formula Matrix)
Executed to satisfy QA matrix coverage from `HEARTBEAT.md` and `thai-formulas.md`.

### Commands
```powershell
npm test
node --test scripts/release-route-integrity.test.mjs
$env:CAL198_BASE_URL='https://www.kamnuanlek.com'; $env:CAL198_RUN_DATE='2026-04-18'; node scripts/cal198-live-qa.mjs
$env:CAL198_BASE_URL='https://calculator-thailand-production.up.railway.app'; $env:CAL198_RUN_DATE='2026-04-18-railway'; node scripts/cal198-live-qa.mjs
```

### Outcomes
- Formula/unit validation: PASS (`24/24` tests).
- Route-integrity helper tests: PASS (`4/4` tests).
- Live functional matrix on `kamnuanlek.com`: FAIL (`8/12` full pass, `4/12` fail).
- Live functional matrix on Railway direct URL: FAIL (`10/12` full pass, `2/12` fail).

### New Critical Defects
1. Domain deployment parity drift (critical):
- `/คำนวณค่าธรรมเนียมโอนบ้าน/` and `/คำนวณอัตราแลกเปลี่ยน/` are `HTTP 404` on `https://www.kamnuanlek.com` but `HTTP 200` on Railway direct host.
- This indicates production domain routing/content parity mismatch and breaks promised live behavior.

2. Functional regression on `/คำนวณผ่อนรถ/` (critical):
- Missing expected result selector `#res-income-ratio` after submit.
- Route returns `200` but result contract is incomplete.

3. Functional regression on `/คำนวณดอกเบี้ยบัตรเครดิต/` (critical):
- `#res-total-interest` resolves to `"-"` instead of numeric output.
- `#res-next-balance` resolves to `"-"` instead of numeric output.
- Calculator returns `200` but fails output promise.

4. Inventory signal mismatch retained:
- `/คำนวณค่าธรรมเนียมโอนบ้าน/` and `/คำนวณอัตราแลกเปลี่ยน/` remain absent from sitemap inventory despite being live on Railway.

### Additional Evidence Paths
- `reports/qa/cal-198/2026-04-18/live-calculator-qa-gate.md`
- `reports/qa/cal-198/2026-04-18/live-calculator-qa-gate.json`
- `reports/qa/cal-198/2026-04-18/screenshots/*`
- `reports/qa/cal-198/2026-04-18-railway/live-calculator-qa-gate.md`
- `reports/qa/cal-198/2026-04-18-railway/live-calculator-qa-gate.json`
- `reports/qa/cal-198/2026-04-18-railway/screenshots/*`

## QA Gate Verdict
Release is not healthy. Block deploy/release promotion until approved inventory and live inventory parity are restored and this gate passes with zero diff.

## Follow-up
Live visual incident-cycle evidence for CAL-251 attachment was added on 2026-04-19:
- `reports/qa/cal-246/2026-04-19/cal-246-live-visual-qc-cycle-01.md`
- `reports/qa/cal-246/2026-04-19/cal-246-live-visual-qc-cycle-02.md`
- `reports/qa/cal-246/2026-04-19/cal-246-queue-check-inventory-snapshot-01.md`
- `reports/qa/cal-246/2026-04-19/cal-246-blocked-by-cal-251.md`
- `reports/qa/cal-246/2026-04-19/cal-246-blocked-by-cal-197.md`
