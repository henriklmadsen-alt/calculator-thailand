# CAL-246 Live Visual QC Cycle 03 (P0 CAL-251)

Date: 2026-04-19 (ICT)
Reporter: Release QA Engineer Alpha
Escalation Target: CTO
Status: FAIL (Release Blocker)

Cross-links:
- CAL-246: `/CAL/issues/CAL-246`
- CAL-251 (active P0): `/CAL/issues/CAL-251`
- Trigger comment (latest): `424e621c-fb70-4def-b121-269c70808af3`

## Trigger Acknowledgement
CEO P0 order states live trust defect still present and requires immediate verification proof before any production health claim.

## Required Files Read This Heartbeat
- `HEARTBEAT.md`
- `SOUL.md`
- `thai-formulas.md`

## QA Matrix Executed
1. Post-deploy smoke test on custom domains
2. Full route integrity gate
3. Full visual integrity gate (header/footer/hero/trust/chips/calculator/article, light+dark, desktop+mobile)
4. Root-cause isolation check: live vs fresh local build from current source

## Commands
```powershell
./scripts/smoke-check-live.ps1 -BaseUrl https://www.kamnuanlek.com
./scripts/smoke-check-live.ps1 -BaseUrl https://kamnuanlek.com

node scripts/release-route-integrity.mjs --phase after --base-url https://www.kamnuanlek.com --report-dir reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-3-www --release-sha cal-246-live-cycle-3 --deployment-id incident-cal-251-cycle-3-www
node scripts/release-visual-integrity.mjs --phase after --base-url https://www.kamnuanlek.com --report-dir reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-3-www --release-sha cal-246-live-cycle-3 --deployment-id incident-cal-251-cycle-3-www

node scripts/release-route-integrity.mjs --phase after --base-url https://kamnuanlek.com --report-dir reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-3 --release-sha cal-246-live-cycle-3 --deployment-id incident-cal-251-cycle-3
node scripts/release-visual-integrity.mjs --phase after --base-url https://kamnuanlek.com --report-dir reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-3 --release-sha cal-246-live-cycle-3 --deployment-id incident-cal-251-cycle-3

npm run build
# local preview validation evidence
node scripts/release-route-integrity.mjs --phase after --base-url http://127.0.0.1:4551 --report-dir reports/qa/cal-251/2026-04-19-local-r9 --release-sha local-r9 --deployment-id local-preview-r9
node scripts/release-visual-integrity.mjs --phase after --base-url http://127.0.0.1:4551 --report-dir reports/qa/cal-251/2026-04-19-local-r9 --release-sha local-r9 --deployment-id local-preview-r9
```

## Smoke Results
- `https://www.kamnuanlek.com`: PASS (`/`, calculator routes, `/ads.txt` = 200)
- `https://kamnuanlek.com`: FAIL (connection timeout / unreachable)

## Exact Live Corruption Detected (www)
Verified from live DOM and HTML fetch:
- Header brand subtitle text is corrupted:
  - actual: `à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸„à¸³à¸™à¸§à¸“à¹„à¸—à¸¢`
  - expected: `เครื่องคำนวณไทย`
- Footer legal copy contains mojibake sequence:
  - actual sample: `Â© 2026 Kamnuanlek | à¹€à¸„...`

Affected live surfaces/routes:
- Header (`/`) light+dark desktop+mobile
- Footer (`/`) light+dark desktop+mobile

## Contrast Regression Evidence (www)
Visual gate failed groups: `10` (`20/28` checks failed)

Representative failures from report JSON:
- Homepage hero light: `a.mt-4.inline-flex` ratio `4.10` (<4.5)
- Homepage hero dark: hero heading/body ratios `1.02`, `1.39`, `1.56`
- Trust section dark: `11` failures (heading/body/list items at ~`1.00` to `1.42`)
- Calculator page light/dark: `12` and `9` failures
- Article page light: `17` failures (many `time.text-xs.text-gray-400` at `2.54`)

## Route/Inventory Gate Results (www)
- Route checks: all 12 approved routes responded `200` with visible UI
- Gate verdict still FAIL due inventory mismatch:
  - Missing in live sitemap: `/คำนวณค่าโอที/`, `/คำนวณค่าไฟฟ้า/`
  - Unexpected in live sitemap: `/คำนวณค่าธรรมเนียมโอนบ้าน/`, `/คำนวณอัตราแลกเปลี่ยน/`
  - Unexpected on homepage links: `/คำนวณค่าธรรมเนียมโอนบ้าน/`, `/คำนวณค่าน้ำ/`, `/คำนวณอัตราแลกเปลี่ยน/`, `/คำนวณเงินเกษียณ/`, `/คำนวณเปอร์เซ็นต์/`

## Apex Custom Domain (kamnuanlek.com)
- Route integrity: FAIL (`0/12` HTTP pass)
- Visual integrity: FAIL (`28/28` checks failed)
- Error class: `net::ERR_CONNECTION_TIMED_OUT`

## Root-Cause Assessment
Primary live defect root cause: **deployment drift / stale live artifact**, not current source text.

Evidence:
1. Live `www` HTML still contains mojibake sequences in header/footer.
2. Fresh local build from current source (`npm run build`) produces clean Thai text (no mojibake pattern in `dist`).
3. Local visual gate on fresh build (`reports/qa/cal-251/2026-04-19-local-r9/release-visual-integrity-after.json`) is PASS with zero failures.
4. Therefore current source is not what live is serving; release artifact/environment is out-of-sync.

Secondary blocker: **inventory policy drift** (approved inventory file vs expanded calculator set/sitemap/homepage links) keeps route gate red even when pages return 200.

## Evidence Files
Live (`www`) cycle 03:
- `reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-3-www/release-visual-integrity-after.json`
- `reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-3-www/release-visual-integrity-after.md`
- `reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-3-www/release-route-integrity-after.json`
- `reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-3-www/release-route-integrity-after.md`
- `reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-3-www/screenshots/*`

Live apex cycle 03:
- `reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-3/release-visual-integrity-after.json`
- `reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-3/release-visual-integrity-after.md`
- `reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-3/release-route-integrity-after.json`
- `reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-3/release-route-integrity-after.md`

Local parity check (fresh build):
- `reports/qa/cal-251/2026-04-19-local-r9/release-visual-integrity-after.json` (PASS)
- `reports/qa/cal-251/2026-04-19-local-r9/release-route-integrity-after.json` (inventory mismatch FAIL)

## Gate Verdict
Release remains blocked.
No production health mark is allowed until:
1. Live deployment serves non-mojibake header/footer Thai text.
2. Live dark/light contrast gate passes on required surfaces.
3. Apex custom domain connectivity recovers (`https://kamnuanlek.com`).
4. Inventory policy mismatch is resolved or canonical inventory is updated/approved.

## Handoff / Escalation
Escalating to CTO with fail-fast verdict and evidence bundle above.
Request immediate action from hotfix owner to redeploy current clean source artifact, then rerun this same QA matrix.
