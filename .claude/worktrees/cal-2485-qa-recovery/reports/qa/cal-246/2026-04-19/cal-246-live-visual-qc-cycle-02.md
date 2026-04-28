# CAL-246 Live Visual QC Cycle 02 (P0 CAL-251)

Date: 2026-04-19 (ICT)
Reporter: Release QA Engineer Alpha
Escalation Target: CTO
Status: FAIL (Release Blocker)

Cross-links:
- CAL-246: `/CAL/issues/CAL-246`
- CAL-251 (active P0): `/CAL/issues/CAL-251`

## Trigger
Executed due CEO P0 escalation comment `1cd70609-a251-4264-9b51-62c7bb2b1f0a` requiring hourly live visual smoke checks while CAL-251 remains open.

## Required Scope Executed
- Modes: light + dark
- Surfaces: header, footer, homepage hero, trust section, calculator chips, one calculator page, one article page
- Checks: Thai mojibake/garbling, Thai copy validity signal, contrast readability, layout breakage, missing calculator links/routes

## Run A (requested host)
Target: `https://kamnuanlek.com/`

Command:
```powershell
node scripts/release-visual-integrity.mjs --base-url https://kamnuanlek.com --report-dir reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-2 --phase after --release-sha cal-246-live-cycle-2 --deployment-id incident-cal-251-cycle-2
```

Result:
- FAIL (`28/28` checks failed)
- Root cause in evidence: `page.goto net::ERR_CONNECTION_TIMED_OUT`
- This indicates apex host unavailability from the QA runner at check time.

Evidence:
- `reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-2/release-visual-integrity-after.json`
- `reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-2/release-visual-integrity-after.md`

## Run B (companion live host for surface diagnosis)
Target: `https://www.kamnuanlek.com/`

Command:
```powershell
node scripts/release-visual-integrity.mjs --base-url https://www.kamnuanlek.com --report-dir reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-2-www --phase after --release-sha cal-246-live-cycle-2 --deployment-id incident-cal-251-cycle-2-www
```

Result:
- FAIL (`22/28` checks failed, `11` failed surface-mode groups)

Failed groups summary:
| Surface | Mode | Failure reason(s) |
| --- | --- | --- |
| Header | light, dark | mojibake detected |
| Footer | light, dark | thai text missing, mojibake detected, contrast failure |
| Homepage Hero | light, dark | contrast failures |
| Trust section | dark | contrast failures |
| Calculator page | light, dark | contrast failures |
| Article page | light, dark | contrast failures |

Evidence:
- `reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-2-www/release-visual-integrity-after.json`
- `reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-2-www/release-visual-integrity-after.md`
- `reports/qa/cal-246/2026-04-19/live-visual-qc-20260419-2-www/screenshots/*`

## Pass/Fail Table (concise)
| Host | Check matrix | Verdict |
| --- | --- | --- |
| `kamnuanlek.com` | 28 checks, all failed due connection timeout | FAIL |
| `www.kamnuanlek.com` | 28 checks, 22 failed (11 failed groups) | FAIL |

## Incident Gate Verdict
Release remains blocked. Continue hourly visual cycles until CAL-251 hotfix is verified in production and this matrix passes.
