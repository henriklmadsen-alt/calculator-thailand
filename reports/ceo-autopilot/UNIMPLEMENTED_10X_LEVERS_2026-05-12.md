# Unimplemented 10x Levers (Post-Baseline)

Date: 2026-05-12
Issue: CAL-2757

## Already Implemented in Baseline
1. DORA scorecard script
2. Error-budget release gate
3. Reference-class estimation script
4. Forecast accuracy ledger + KPI report
5. WIP limit guard script
6. Blameless postmortem template + action tracker

## Remaining High-ROI Levers

### Priority A
1. Severity policy hardening for release gate
- Gap: formal definitions for `critical`, `major`, `minor` and required escalation per severity.
- Estimate: 1-2 hours.

2. Auto-generation of weekly CEO ops review pack
- Gap: no single weekly artifact combining DORA, forecast accuracy, open postmortem actions, and WIP compliance.
- Estimate: 3-5 hours.

3. Mandatory postmortem linkage for failures
- Gap: release failure rows are not yet enforced to reference a postmortem ID.
- Estimate: 1-2 hours.

### Priority B
1. SPACE dashboard (Satisfaction, Performance, Activity, Collaboration, Efficiency)
- Gap: output-focused tracking only; no multi-dimensional productivity instrumentation.
- Estimate: 6-10 hours.

2. Workflow-stage WIP automation beyond a single markdown guard
- Gap: WIP guard checks one backlog file only.
- Estimate: 4-8 hours.

3. Toil budget tracking and alerting
- Gap: manual/ops toil time is not yet systematically measured.
- Estimate: 2-4 hours.

### Priority C
1. Failure-mode library and pre-mortem checklist by release type
- Gap: no reusable risk checklist before high-impact releases.
- Estimate: 3-6 hours.

2. Work-type portfolio split analytics (feature/reliability/toil)
- Gap: no ongoing visibility of effort allocation.
- Estimate: 2-4 hours.
