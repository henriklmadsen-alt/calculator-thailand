# Error Severity Policy (Release Gate)

Date: 2026-05-12
Applies to: `reports/ceo-autopilot/deploy-log.csv`, `scripts/error_budget_gate.mjs`

## Severity Definitions
1. `critical`
- User trust or calculation correctness is materially broken on live pages.
- Example: wrong tax formula output, major calculator unusable, widespread 5xx on money pages.
- Required: immediate incident handling, rollback/hotfix, mandatory postmortem.

2. `major`
- Significant functionality degradation with meaningful user impact, but core formulas remain correct.
- Example: broken related-link blocks on many pages, major tracking loss on priority flows.
- Required: same-day fix and postmortem linkage.

3. `minor`
- Localized issue, low user impact, no formula correctness breach.
- Example: score parser bug, cosmetic telemetry issue.
- Required: fix and action tracking; postmortem linkage still required for failures.

4. `none`
- No failure event.

## Weighted CFR Model
Used in error-budget gate:
- `critical = 1.0`
- `major = 0.6`
- `minor = 0.2`
- `none = 0.0`

Weighted CFR = `sum(severity weights for failed deployments) / total deployments * 100`

## Gate Policy
Release gate passes only if all conditions pass:
1. Weighted CFR <= configured threshold (default 15%).
2. MTTR median <= configured threshold (default 4h).
3. Critical failures <= configured threshold (default 0).
4. Every failure row has a non-empty `postmortem_id`.
5. Every failure row has recognized severity (`critical|major|minor`).
