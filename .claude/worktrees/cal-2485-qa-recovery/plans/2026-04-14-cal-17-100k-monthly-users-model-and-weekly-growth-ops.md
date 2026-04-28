# CAL-17 Growth Model: 100k Monthly Users + Weekly Growth Operations

Date: 2026-04-14
Owner: CMO
Issue: [CAL-17](/CAL/issues/CAL-17)
Parent: [CAL-1](/CAL/issues/CAL-1)

## 1) Objective
Build a quantified path from current traffic to 100,000 monthly users, with an operating loop that can run weekly as soon as production GA4 ingestion is verified in [CAL-16](/CAL/issues/CAL-16).

## 2) Baseline Gate and Modeling Rules

### Baseline gate
- Source of truth starts only after [CAL-16](/CAL/issues/CAL-16) confirms production ingestion.
- Baseline window: first full 14 days after CAL-16 completion.
- Baseline variable: `B = monthly sessions run-rate` from that 14-day window.

### Modeling rules
- Use two anchors together:
  - multiplier targets based on `B` (so plan adapts to live baseline),
  - minimum absolute floor targets (so growth ambition stays aggressive).
- Revenue model:
  - `AdSense revenue = (sessions / 1000) * RPM`
- Main risk bands:
  - Low case = 0.7x target
  - Base case = 1.0x target
  - High case = 1.3x target

## 3) 30/60/90/180-Day Target Ladder

| Milestone | Session target formula | Minimum floor | Top-10 ranking keywords | Search CTR | Calculator completion rate | RPM target (THB) | Ad impressions/session |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Day 30 | `1.6 * B` | 2,500 | 35 | 4.5% | >= 68% | 40-70 | 0.8-1.0 |
| Day 60 | `2.6 * B` | 4,000 | 50 | 5.0% | >= 70% | 60-100 | 1.0-1.2 |
| Day 90 | `4.0 * B` | 6,500 | 80 | 5.5% | >= 72% | 80-130 | 1.2-1.4 |
| Day 180 | `11.0 * B` | 18,000 | 220 | 6.5% | >= 74% | 120-180 | 1.4-1.6 |

### 100k path extension (time-bound)
- Month 9 target: 45,000 sessions/month
- Month 12 target: 70,000 sessions/month
- Month 15 target: 100,000 sessions/month

This requires sustained compound monthly growth of roughly 25-30% from Day 180 to Month 15, with calculator inventory expansion and strong internal-link execution.

## 4) Channel Mix, Throughput, and Ranking Assumptions

### Channel mix assumptions (Month 6 to Month 15)
- Organic search: 88%
- Direct/returning: 8%
- Referral/social/other: 4%

### Content throughput assumptions
- Calculators:
  - Days 1-90: 1 net-new calculator every 2 weeks
  - Days 91-180: 1 net-new calculator per week
  - Month 7+: maintain 3-4 launches/month with update cycles
- Articles:
  - Days 1-90: 2 articles/week
  - Days 91-180: 3 articles/week in winning clusters only
- Refreshes:
  - Update top 20 landing pages every 4-6 weeks with fresh year and FAQ intent blocks

### Ranking assumptions
- Top-3 keywords:
  - Day 90: >= 15
  - Day 180: >= 60
  - Month 15: >= 180
- Top-10 keywords:
  - Day 180: >= 220
  - Month 15: >= 700

## 5) Weekly Operating Cadence Dashboard Spec

## Scorecard metrics (required each week)
| Metric | Definition | Source | Owner | Weekly trigger |
| --- | --- | --- | --- | --- |
| MAU | 30-day active users | GA4 | CMO | <10% WoW growth for 2 weeks |
| Sessions | Weekly sessions and monthly run-rate | GA4 | CMO | Off-target by >15% vs milestone |
| Search CTR | Clicks / impressions for key pages | GSC | CMO | Any priority page CTR <3.5% |
| Rankings | Top-3 and top-10 keyword counts | GSC + rank tracker export | CMO | Top-10 growth stalls for 2 weeks |
| Completion rate | `calculator_complete / calculator_start` by calculator | GA4 events | CMO + CTO | Any top page <65% |
| RPM | Revenue per 1,000 sessions | AdSense | CMO | RPM drops >10% WoW |
| Ad impressions/session | Ad impressions divided by sessions | AdSense + GA4 | CMO + CTO | >1.8 with completion drop |

## Weekly operating rhythm
- Monday:
  - KPI review vs ladder targets
  - reprioritize keyword/content cluster map
- Wednesday:
  - publish batch and internal-link QA pass
  - refresh low-CTR titles/meta for priority URLs
- Friday:
  - experiment decision log (keep/iterate/rollback)
  - next-week backlog lock and owner confirmation

## 6) Prioritized Growth Backlog With CTO Dependency Mapping

### P0 (immediate, must complete)
| Item | Owner | Dependency mapping | Exit criteria |
| --- | --- | --- | --- |
| GA4 production ingestion and event quality lock | CTO | [CAL-16](/CAL/issues/CAL-16) | Stable daily data and required events verified |
| Weekly KPI data pipeline and report automation | CTO + CMO | [CAL-9](/CAL/issues/CAL-9) | Weekly scorecard generated without manual spreadsheet merge |
| Safe monetization launch gate with rollback toggles | CTO | [CAL-11](/CAL/issues/CAL-11), [CAL-13](/CAL/issues/CAL-13) | A1/A2 variants launch-ready with hard-fail rollback |

### P1 (scale layer, start as soon as P0 is stable)
| Item | Owner | Dependency mapping | Exit criteria |
| --- | --- | --- | --- |
| Programmatic internal-link rules for calculator/article clusters | CTO + CMO | [CAL-10](/CAL/issues/CAL-10), [CAL-15](/CAL/issues/CAL-15) | No orphan posts; all new pages pass link checklist |
| Cluster expansion in salary/tax, loan, savings tracks | CMO | [CAL-12](/CAL/issues/CAL-12) | 2-3 quality publishes/week with CTR improvement |
| Top-landing-page refresh loop every 4-6 weeks | CMO + CTO | [CAL-14](/CAL/issues/CAL-14) | Refresh cadence documented and executed |

### P2 (optimization to reach 70k to 100k)
| Item | Owner | Dependency mapping | Exit criteria |
| --- | --- | --- | --- |
| Advanced SERP coverage (comparison pages, scenario pages) | CMO + CTO | P1 completion | Top-10 keyword acceleration continues |
| RPM optimization by intent segment and device | CMO + CTO | P0 monetization stability | RPM up >=15% with no completion hard-fail |
| Seasonality and tax-calendar campaign overlays | CMO | P1 content engine stable | Predictable seasonal traffic lifts |

## 7) Risk Bands and Escalation Triggers
- High risk: CAL-16 delays beyond 7 days from now.
  - Action: escalate to CEO immediately; growth ladder dates shift but not targets.
- Medium risk: CTR stagnation despite publishing throughput.
  - Action: switch to refresh-heavy sprint and title/meta rewrites before publishing more net-new volume.
- Revenue anomaly trigger:
  - RPM drop >20% WoW or completion drop >5% relative after ad changes.
  - Action: immediate rollback and CEO escalation same day.

## 8) Immediate Next 2-Week Execution
1. Close CAL-16 data-ingestion validation.
2. Start weekly scorecard run using CAL-9 workflow.
3. Start one P0 monetization-safe experiment (A1 only) after CAL-11 clears review.
4. Run first two weekly growth-ops cycles and lock reprioritization decisions in issue comments.
