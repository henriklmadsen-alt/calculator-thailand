# CAL-82 Zero-Idle Execution Runbook

Source issue: [CAL-82](/CAL/issues/CAL-82)

## Objective

Prevent critical growth lanes (CTO, CMO, UX, SEO) from going idle without automatic detection and escalation.

## Operating Baseline

- Watchdog command: `npm run ops:no-idle-watchdog`
- Automation owner: CTO (`aefd639f-bbba-4120-ab49-035ce3d7ebf6`)
- Routine cadence: every 30 minutes, Asia/Bangkok
- Monitored statuses: `todo`, `in_progress`, `in_review`
- Monitored priority: `critical`
- Monitored lanes: `CTO`, `CMO`, `UXDesigner`, `SEO Specialist`

## Current Critical Lane Streams (2026-04-15)

- CTO lane: [CAL-82](/CAL/issues/CAL-82)
- CMO lane: [CAL-66](/CAL/issues/CAL-66)
- UX lane continuity: [CAL-93](/CAL/issues/CAL-93)
- SEO lane: [CAL-68](/CAL/issues/CAL-68)

## SLA Thresholds

- Checkpoint SLA (`NO_IDLE_CHECKPOINT_SLA_MINUTES`): 30 minutes
- Hard escalation SLA (`NO_IDLE_HARD_ESCALATION_SLA_MINUTES`): 60 minutes
- Alert cooldown (`NO_IDLE_ALERT_COOLDOWN_MINUTES`): 30 minutes

Interpretation:

- If lane inactivity >= 30 minutes, watchdog posts checkpoint alert to freshest critical issue for that lane.
- If lane inactivity >= 60 minutes, watchdog posts hard alert with CEO escalation.

## Escalation Chain

1. Watchdog posts lane-level checkpoint alert in the affected issue with lane @mention.
2. If hard SLA breached, watchdog adds `@CEO` in the same alert.
3. If a lane has no active critical issue, watchdog posts assignment escalation to the configured alert issue (`NO_IDLE_ALERT_ISSUE_ID`, set to [CAL-82](/CAL/issues/CAL-82) for this rollout).

## Routine Configuration

Routine:

- Title: `CTO: 30-min no-idle critical lane watchdog`
- Project: `7bc34589-7df0-4922-a15b-7effc6367f4d`
- Goal: `7b708edb-ae43-4747-8602-beee783da582`
- Parent issue: `ede86728-eba6-4e3d-bed2-9719387e4f7b` ([CAL-82](/CAL/issues/CAL-82))
- Concurrency policy: `coalesce_if_active`
- Catch-up policy: `skip_missed`
- Trigger: schedule cron `*/30 * * * *` timezone `Asia/Bangkok`

## Evidence Log Contract

Each watchdog run writes:

- JSON snapshot: `reports/no-idle-watchdog/<timestamp>.json`
- Markdown snapshot: `reports/no-idle-watchdog/<timestamp>.md`
- Rolling latest JSON: `reports/no-idle-watchdog/latest.json`
- Rolling latest markdown: `reports/no-idle-watchdog/latest.md`
- Append-only history: `reports/no-idle-watchdog/events.jsonl`

## 12-Hour Verification Procedure

1. Keep routine active for a continuous 12-hour window.
2. Review `events.jsonl` for all watchdog runs in that window.
3. Confirm each monitored lane is either:
   - healthy inside 30-minute checkpoint SLA, or
   - automatically alerted and escalated by watchdog when breached.
4. Post final verification summary to [CAL-82](/CAL/issues/CAL-82) with links to evidence artifacts.

## Manual Run Command

Use this for immediate checkpoint or incident response:

```bash
NO_IDLE_ALERT_ISSUE_ID=ede86728-eba6-4e3d-bed2-9719387e4f7b npm run ops:no-idle-watchdog
```

## UX Checkpoint Template Helper (CAL-97)

Use this helper to generate a watchdog-compliant UX checkpoint comment with required fields and closure checklist:

```bash
npm run ops:ux-checkpoint-template -- \
  --issue CAL-93 \
  --active-scope "CRO experiment status + UX QA tasks for next window" \
  --blocker-status "none" \
  --escalation-owner "@UXDesigner" \
  --next-checkpoint-minutes 30 \
  --successor-issue CAL-104
```

Operator rule:

- Always post the generated markdown as multiline text.
- Keep `--next-checkpoint-minutes` at `30` or less.
- Before marking the active UX lane issue done, complete every item in the generated successor closure checklist with `/CAL/issues/...` links.
