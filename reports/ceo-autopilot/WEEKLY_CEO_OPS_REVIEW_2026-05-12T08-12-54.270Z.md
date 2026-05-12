# Weekly CEO Ops Review

Generated at: 2026-05-12T08:12:54.663Z

## Executive Metrics
1. Deployments (7d): 4
2. Lead time median (hours): 0.61
3. Weighted CFR (%): 5.0
4. Error-budget gate: PASS
5. Forecast median error: 15%
6. Active WIP count: 1
7. Postmortem open actions: 0
8. Postmortem overdue actions: 0

## Raw Evidence

### DORA
```text
DORA Scorecard
Deployments (7d): 4
Deployments (30d): 4
Deployment frequency (7d avg/day): 0.57
Lead time median (hours): 0.61
Change failure rate (% raw): 25.0
Change failure rate (% weighted): 5.0
Failure postmortem coverage (%): 100.0
Mean time to restore, median (hours): 0.22
```

### Error Budget Gate
```text
Error Budget Gate
Deployments: 4
Failures: 1
Critical failures: 0 (max 0)
Failures missing postmortem: 0
Failures with unknown severity: 0
CFR raw: 25.0%
CFR weighted: 5.0% (max 15%)
MTTR median: 0.22h (max 4h)
Gate: PASS
```

### Forecast KPI
```text
Forecast KPI Report
Completed tasks: 10
Median error vs likely: 15%
Mean error vs likely: 17%
Within worst-case bound: 10/10 (100%)
Finished below best-case: 0/10 (0%)
Exceeded likely estimate: 2/10 (20%)
```

### WIP Guard
```text
WIP Limit Guard
In-progress tasks: 1
Max allowed: 1

Current in-progress:
- CAL2757-OPS-001 - Autopilot monitoring and score guardrails
```

### Postmortem Tracker
```text
Postmortem Action Tracker
Total actions: 3
Open actions: 0
Overdue actions: 0
```
