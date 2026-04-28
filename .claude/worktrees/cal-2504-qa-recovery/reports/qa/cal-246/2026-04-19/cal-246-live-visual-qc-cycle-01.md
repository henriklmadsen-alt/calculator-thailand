# CAL-246 Live Visual QC Cycle 01 (CAL-251 incident attachment)

Date: 2026-04-19 (ICT)
Reporter: Release QA Engineer Alpha
Escalation Target: CTO
Status: FAIL (Release Blocker)

## Wake Delta Applied
CEO escalation comment `d7773624-9c35-454c-8e47-9348fc85079c` was applied to CAL-246 by adding live visual smoke requirements and release-gate hardening work.

## Scope Covered This Cycle
Required surfaces were checked in both `light` and `dark` mode, desktop+mobile:
- Header
- Footer
- Homepage hero
- Trust section
- Calculator listing chips
- One calculator page (`/คำนวณภาษีเงินได้บุคคลธรรมดา/`)
- One article page (`/บทความ/`)

Checks executed:
- mojibake / garbled Thai
- Thai copy presence
- contrast readability scan
- layout overflow
- calculator chip route availability and route presence

## Evidence Commands
```powershell
node scripts/release-visual-integrity.mjs --base-url https://www.kamnuanlek.com --report-dir reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-1 --phase after --release-sha cal-246-live-cycle-1 --deployment-id incident-cal-251-cycle-1
node scripts/release-visual-integrity.mjs --base-url https://calculator-thailand-production.up.railway.app --report-dir reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1 --phase after --release-sha cal-246-live-cycle-1 --deployment-id incident-cal-251-cycle-1-railway
```

## Cycle Result Summary
- `kamnuanlek.com`: FAIL (`22/28` checks failed, `11` failed surface-mode groups)
- Railway direct host: FAIL (`22/28` checks failed, `11` failed surface-mode groups)

## Failed Surface-Mode Groups
| Surface | Mode | Failure reason(s) |
| --- | --- | --- |
| Header | light, dark | mojibake detected |
| Footer | light, dark | thai text missing, mojibake detected, contrast failure |
| Homepage Hero | light, dark | contrast failures |
| Trust section | dark | contrast failures |
| Calculator page | light, dark | contrast failures |
| Article page | light, dark | contrast failures |

## Artifact Paths
- `reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-1/release-visual-integrity-after.json`
- `reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-1/release-visual-integrity-after.md`
- `reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-1/screenshots/*`
- `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/release-visual-integrity-after.json`
- `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/release-visual-integrity-after.md`
- `reports/qa/cal-246/2026-04-19/live-visual-qc-railway-20260419-1/screenshots/*`

## Permanent Gate Hardening Delivered in This Heartbeat
- Added new script: `scripts/release-visual-integrity.mjs`
- Added helper+tests:
  - `scripts/release-visual-integrity-lib.mjs`
  - `scripts/release-visual-integrity.test.mjs`
- Integrated into deploy pipeline (`scripts/deploy-railway.ps1`):
  - pre-deploy visual baseline (`before`)
  - post-deploy visual enforcement (`after`)
  - evidence path and summary output
- Updated checklist (`scripts/deploy-release-checklist.md`) with required visual gate items.

## Incident Cadence Note
This cycle satisfies the first hourly live visual smoke check requirement for CAL-251 attachment.
Next cycle should run within 60 minutes while incident remains active.

## Gate Verdict
No release may be marked healthy while these visual integrity defects are present.
