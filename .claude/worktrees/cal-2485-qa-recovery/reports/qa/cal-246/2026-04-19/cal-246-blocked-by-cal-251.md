# CAL-246 Blocked State Update (Dependency: CAL-251)

Date: 2026-04-19 (ICT)
Reporter: Release QA Engineer Alpha
Escalation Target: CTO
State: BLOCKED by CAL-251

Superseded by latest dependency correction:
- Current first-class blocker is CAL-197 post-deploy sequencing.
- See `reports/qa/cal-246/2026-04-19/cal-246-blocked-by-cal-197.md`.

## Trigger
Applied instruction from comment `823d43e5-8432-4243-afd4-79d6eb05ef42`:
- CAL-246 verification is blocked until CAL-251 provides hotfix build/deploy evidence.

Blocked-state correction acknowledged from comment `a3927e18-d66e-4077-a976-82be07e36e65`:
- CAL-251 is now set as first-class blocker for CAL-246 wake routing.
- No extra CAL-246 QA execution should start before CAL-251 hotfix evidence exists.

Final status correction acknowledged from comment `d4585d11-878b-405f-88df-8795e496ad9e`:
- CAL-246 is blocked and not actively executable until CAL-251 posts hotfix build/deploy evidence.

## Block Condition
Do not close or mark CAL-246 healthy until CAL-251 provides all of:
- Hotfix build evidence (commit SHA / artifact reference)
- Production deploy evidence (deployment ID + target URL)
- Confirmation timestamp for when hotfix reached production

## Immediate Next QA Action Once Unblocked
Run inventory regression verification against production using hotfix evidence values:

```powershell
# 1) Inventory regression gate (post-hotfix)
node scripts/release-route-integrity.mjs --base-url https://www.kamnuanlek.com --report-dir reports/qa/cal-246/<date>/post-hotfix-inventory-<stamp> --phase after --release-sha <hotfix-sha> --deployment-id <deployment-id>

# 2) Visual regression gate (post-hotfix)
node scripts/release-visual-integrity.mjs --base-url https://www.kamnuanlek.com --report-dir reports/qa/cal-246/<date>/post-hotfix-visual-<stamp> --phase after --release-sha <hotfix-sha> --deployment-id <deployment-id>

# 3) Optional companion host parity check
node scripts/release-route-integrity.mjs --base-url https://calculator-thailand-production.up.railway.app --report-dir reports/qa/cal-246/<date>/post-hotfix-inventory-railway-<stamp> --phase after --release-sha <hotfix-sha> --deployment-id <deployment-id>
```

## Required Post-Hotfix Output (CAL-246)
- GitHub calculator count
- Production calculator count
- Route mismatches (missing/unexpected)
- Visual smoke matrix verdict (light/dark required surfaces)
- Reusable release gate checklist confirmation

## Current Verdict
CAL-246 remains release-blocking and unresolved until CAL-251 hotfix evidence is delivered and post-hotfix regression checks pass.
