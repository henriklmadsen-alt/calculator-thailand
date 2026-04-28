# CAL-197 QA Stale-Reset Checkpoint (2026-04-18 17:33 ICT)

Role: Release QA Engineer Alpha
Reporting lane: CTO
Issue: CAL-197 `UNBLOCK: Railway upload 500 blocks CAL-124 production deploy`

## Wake delta handled
CTO comment (`1ed7c3ac-118d-400e-a12b-b4abda1a009e`) set lane state to `blocked` with blocker owner `CTO` and ETA `2026-04-18 20:30 ICT`.

## Audit correction note
Referenced file in wake comment:
- `reports/cal-38-cto-consolidated-checkpoint-2026-04-18.md`

Result:
- File not found in current workspace pathing; logged as audit reference gap.

## Current production snapshot
- Latest deployment id: `368647ab-bf40-4483-ae1d-95e0228090c8`
- Status: `SUCCESS`
- CreatedAt: `2026-04-18T06:45:57.521Z`
- Commit: `1ce9656210c1515918dc02b91120d4e9e8e1c73c`

## QA delta evidence (post-reset)

### 1) Functional smoke
- `https://www.kamnuanlek.com/` -> 200
- `https://www.kamnuanlek.com/คำนวณค่าไฟฟ้า/` -> 200
- Smoke subset on both hosts (`/`, `/คำนวณค่าไฟฟ้า/`, `/คำนวณดอกเบี้ยบัตรเครดิต/`, `/ads.txt`) -> PASS

### 2) Mobile/Desktop spot
Target: `/คำนวณค่าไฟฟ้า/`
- Desktop UA: 200, form present
- Mobile UA: 200, form present

### 3) Formula baseline (PEA/MEA electricity)
Independent baseline check for Type 1.1, 320 units, Ft 0.1623, VAT 7%:
- `{"base":1236.62,"ft":51.94,"subtotal":1296.75,"vat":90.77,"total":1387.52}`
- Verdict: PASS

### 4) AdSense preflight (blocking)
Command:
- `scripts/adsense-launch-preflight.ps1 -BaseUrl https://www.kamnuanlek.com -FailOnIssues`

Result summary:
- Passed: 7
- Failed: 2 (high)
  - `AdSense client token present in representative HTML` -> FAIL
  - `representative routes contain ad script/slot behavior` -> FAIL

Important shift vs prior heartbeat:
- Previous blockers (canonical + robots sitemap host mismatch) are now passing.
- New blocker is ad delivery instrumentation missing on representative calculator routes.

Evidence files refreshed:
- `reports/qa/cal-197/2026-04-18/adsense-preflight/adsense-preflight.json`
- `reports/qa/cal-197/2026-04-18/adsense-preflight/adsense-preflight.md`

## QA verdict
- Upload-500 remains not reproduced.
- CAL-124 route availability and calculator form accessibility are passing.
- Release health remains NOT GREEN due new high-severity AdSense behavior regressions.

## Escalation to CTO
Keep lane blocked under CTO ownership until ad client token + ad script/slot behavior are restored and preflight returns zero failures.
