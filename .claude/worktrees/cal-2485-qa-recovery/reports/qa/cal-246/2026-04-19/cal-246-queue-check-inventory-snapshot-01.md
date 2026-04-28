# CAL-246 Queue Check Snapshot 01

Date: 2026-04-19 (ICT)
Reporter: Release QA Engineer Alpha
Escalation Target: CTO
Status: FAIL (Release Blocker)

## Requested Output

### 1) GitHub calculator count
- Canonical approved calculators (from `config/approved-calculator-inventory.json` via release gate): **12**

### 2) Production calculator count
- Production sitemap calculator routes (`https://www.kamnuanlek.com/sitemap.xml`): **12**
- Production homepage calculator links: **17**

### 3) Route mismatches
- Missing from production sitemap vs approved (2):
  - `/คำนวณค่าโอที/`
  - `/คำนวณค่าไฟฟ้า/`

- Unexpected in production sitemap vs approved (2):
  - `/คำนวณค่าธรรมเนียมโอนบ้าน/`
  - `/คำนวณอัตราแลกเปลี่ยน/`

- Unexpected on production homepage calculator links vs approved (5):
  - `/คำนวณค่าธรรมเนียมโอนบ้าน/`
  - `/คำนวณค่าน้ำ/`
  - `/คำนวณอัตราแลกเปลี่ยน/`
  - `/คำนวณเงินเกษียณ/`
  - `/คำนวณเปอร์เซ็นต์/`

### 4) Reusable release gate checklist
- Checklist file: `scripts/deploy-release-checklist.md`
- Includes route integrity + visual integrity + evidence bundle requirements for pre/post deploy gating.

## Evidence Command
```powershell
node scripts/release-route-integrity.mjs --base-url https://www.kamnuanlek.com --report-dir reports/qa/cal-246/2026-04-19/inventory-snapshot-20260419-1 --phase after --release-sha cal-246-queue-check --deployment-id queue-check-1
```

## Evidence Artifacts
- `reports/qa/cal-246/2026-04-19/inventory-snapshot-20260419-1/release-route-integrity-after.json`
- `reports/qa/cal-246/2026-04-19/inventory-snapshot-20260419-1/release-route-integrity-after.md`

## Gate Verdict
Release remains blocked until route mismatches are cleared and both route/visual gates pass.
