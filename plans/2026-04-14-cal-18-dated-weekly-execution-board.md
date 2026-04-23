# CAL-18 Dated Weekly Execution Board (Weeks 1-8)

Date: 2026-04-14  
Owner: CMO  
Issue: [CAL-18](/CAL/issues/CAL-18)  
Parent: [CAL-17](/CAL/issues/CAL-17)

## 1) Scope and Gate

This board operationalizes the approved [CAL-17](/CAL/issues/CAL-17) model into dated weekly execution for P0 and first-wave P1 work.

Baseline gate rule:
- No milestone-ladder scoring starts until [CAL-16](/CAL/issues/CAL-16) confirms production GA4 ingestion and event quality.
- If [CAL-16](/CAL/issues/CAL-16) is not done by 2026-04-22, escalate same day to CEO and keep status on P0 data tasks as blocked.

## 2) Dependency Map (Must Stay Intact)

| Dependency | Status at board creation | Why it matters in this board |
| --- | --- | --- |
| [CAL-9](/CAL/issues/CAL-9) | done | Weekly KPI pipeline/reporting foundation for scorecard automation |
| [CAL-10](/CAL/issues/CAL-10) | done | Internal-link QA rules used in P1 link-system work |
| [CAL-11](/CAL/issues/CAL-11) | in_review | Monetization-safe experiment config dependency for P0 launch gate |
| [CAL-12](/CAL/issues/CAL-12) | done | Content ops engine dependency for P1 cluster expansion |
| [CAL-13](/CAL/issues/CAL-13) | done | Ad UX guardrail dependency for safe monetization decisions |
| [CAL-14](/CAL/issues/CAL-14) | done | Metadata refresh foundation for P1 refresh loop |
| [CAL-15](/CAL/issues/CAL-15) | done | Internal-link coverage baseline used by P1 link scaling |
| [CAL-16](/CAL/issues/CAL-16) | in_progress | Hard gate for baseline variable `B` and CAL-17 milestone tracking |

## 3) 8-Week Dated Board (P0 + First P1)

Owners:
- CMO = strategy, SEO priorities, KPI interpretation, cadence control
- CTO = implementation, data/event integrity, monetization switches

| Week | Date window | Commitment | Owner | Due date |
| --- | --- | --- | --- | --- |
| W1 | 2026-04-20 to 2026-04-26 | Confirm CAL-16 gate state and publish go/no-go note for baseline start | CTO + CMO | 2026-04-22 |
| W1 | 2026-04-20 to 2026-04-26 | Finalize weekly scorecard field contract and owners using CAL-9 output | CTO + CMO | 2026-04-24 |
| W1 | 2026-04-20 to 2026-04-26 | Complete A1 monetization launch-readiness checklist against CAL-11/CAL-13 guardrails | CTO | 2026-04-24 |
| W1 | 2026-04-20 to 2026-04-26 | Publish P1 kickoff map: salary/tax, loan, savings clusters + internal-link rule backlog | CMO | 2026-04-24 |
| W2 | 2026-04-27 to 2026-05-03 | Run scorecard automation dry-run #1 and resolve data mismatches | CTO + CMO | 2026-05-01 |
| W2 | 2026-04-27 to 2026-05-03 | Decide A1 launch state: launch, hold, or rollback-ready hold | CTO + CMO | 2026-05-01 |
| W2 | 2026-04-27 to 2026-05-03 | Ship internal-link rules v0.1 spec aligned to CAL-10/CAL-15 coverage | CTO + CMO | 2026-05-01 |
| W3 | 2026-05-04 to 2026-05-10 | Publish baseline checkpoint report (if gate open): first 7 days trend quality | CMO | 2026-05-06 |
| W3 | 2026-05-04 to 2026-05-10 | Move scorecard automation to weekly production run with alert thresholds | CTO | 2026-05-08 |
| W3 | 2026-05-04 to 2026-05-10 | Deliver cluster expansion batch #1 briefs tied to CAL-12 framework | CMO | 2026-05-08 |
| W4 | 2026-05-11 to 2026-05-17 | Lock baseline variable `B` after full 14-day window and publish target table | CMO | 2026-05-15 |
| W4 | 2026-05-11 to 2026-05-17 | Launch safe monetization A1 and start guardrail monitoring | CTO + CMO | 2026-05-15 |
| W4 | 2026-05-11 to 2026-05-17 | Deploy internal-link rules v1 (no orphan new pages) | CTO | 2026-05-15 |
| W5 | 2026-05-18 to 2026-05-24 | Complete week-1 post-launch monetization decision log (keep/iterate/rollback) | CMO + CTO | 2026-05-22 |
| W5 | 2026-05-18 to 2026-05-24 | Publish cluster expansion batch #1 and run CTR/title refresh pass | CMO | 2026-05-22 |
| W5 | 2026-05-18 to 2026-05-24 | Validate scorecard QA and ranking delta reliability | CTO + CMO | 2026-05-22 |
| W6 | 2026-05-25 to 2026-05-31 | Integrate rank-tracker delta into weekly dashboard package | CTO | 2026-05-29 |
| W6 | 2026-05-25 to 2026-05-31 | Deliver cluster expansion batch #2 briefs and publishing order | CMO | 2026-05-29 |
| W6 | 2026-05-25 to 2026-05-31 | Start top-landing-page refresh loop (first 10 URLs) | CMO + CTO | 2026-05-29 |
| W7 | 2026-06-01 to 2026-06-07 | Publish month-to-date trajectory vs CAL-17 ladder and risk-band status | CMO | 2026-06-05 |
| W7 | 2026-06-01 to 2026-06-07 | Run monetization stability check (RPM/completion/ad impression guardrails) | CMO + CTO | 2026-06-05 |
| W7 | 2026-06-01 to 2026-06-07 | Publish cluster expansion batch #2 and internal-link QA outcome | CMO + CTO | 2026-06-05 |
| W8 | 2026-06-08 to 2026-06-14 | Complete 8-week retrospective and next-8-week board draft | CMO | 2026-06-12 |
| W8 | 2026-06-08 to 2026-06-14 | Lock weekly dashboard governance (owner SLA and escalation protocol) | CMO + CTO | 2026-06-12 |
| W8 | 2026-06-08 to 2026-06-14 | Prioritize P1 continuation set for Weeks 9-16 | CMO + CTO | 2026-06-12 |

## 4) Weekly Cadence Comment Template (Mon/Wed/Fri)

Use this template each operating day and post in [CAL-17](/CAL/issues/CAL-17):

```md
## Weekly Growth Ops Update - Week {{N}} - {{YYYY-MM-DD}} ({{Mon|Wed|Fri}})

Status: {{On track | At risk | Blocked}}

- Baseline gate ([CAL-16](/CAL/issues/CAL-16)): {{state + impact}}
- Scorecard/Pipeline ([CAL-9](/CAL/issues/CAL-9)): {{state}}
- Monetization guardrails ([CAL-11](/CAL/issues/CAL-11), [CAL-13](/CAL/issues/CAL-13)): {{state}}
- Internal-link/content dependencies ([CAL-10](/CAL/issues/CAL-10), [CAL-12](/CAL/issues/CAL-12), [CAL-14](/CAL/issues/CAL-14), [CAL-15](/CAL/issues/CAL-15)): {{state}}

Completed since last update:
- {{owner}} - {{output}} (due {{YYYY-MM-DD}})

Next commitments:
- {{owner}} - {{commitment}} (due {{YYYY-MM-DD}})
- {{owner}} - {{commitment}} (due {{YYYY-MM-DD}})

Risk triggers:
- {{none OR trigger + action + same-day escalation target}}
```

## 5) Escalation Rules (Same Day to CEO)

- [CAL-16](/CAL/issues/CAL-16) delayed beyond 2026-04-22 gate checkpoint.
- RPM drops >20% WoW after monetization changes.
- Calculator completion rate drops >5% relative after ad changes.
- Priority page CTR falls below 3.5% for 2 consecutive weekly checks.
