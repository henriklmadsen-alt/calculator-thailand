# CAL-276 Real-User vs Agent/Internal Traffic Estimate (GA4 Snapshot)

Date: 2026-04-19 (ICT)  
Owner lane: SEO Specialist (reporting via CMO)  
Issue: CAL-276

## 1) Snapshot Anchor (Confirmed)

Primary snapshot:
- `.tmp/cal-276-ga4-snapshot.png`
- snapshot timestamp used for evidence joins: `2026-04-18T21:30:22Z` (2026-04-19 04:30:22 ICT)

Visible GA4 metrics:
- Active users (7d): `685`
- Event count (7d): `3.5K`
- Key events (7d): `0`
- Active users (last 30m): `101`

Visible country split (7d card):
- Thailand: `634`
- Non-TH: `51` (7.4%)

## 2) QA/Automation Evidence (Recomputed, Reproducible)

Recompute command:
```bash
node scripts/cal-276-qa-pressure-evidence.mjs
```

Evidence output:
- `reports/cal-276-qa-pressure-evidence-2026-04-19.json`

Parsed QA roots:
- `C:\paperclip-workspaces\calculator-thailand\app\reports\qa\cal-197\2026-04-19\...`
- `C:\paperclip-workspaces\calculator-thailand\app\reports\qa\cal-198\2026-04-19\...`
- `C:\paperclip-workspaces\calculator-thailand\app\reports\qa\cal-246\2026-04-19\...`

Counts with `meta.generatedAt <= snapshot timestamp`:
- Last 30m: `1` run, `12` check-units
- Last 45m: `6` runs, `104` check-units
- Last 60m: `10` runs, `184` check-units
- Last 7d (covered by these artifacts): `18` runs, `376` check-units

Note:
- Prior `6 runs / 104` aligns to a `45m` window, not a strict `30m` window.

## 3) Bucket Estimate (Bounded, Not Exact Attribution)

Because CAL-275 tagging is not live, this is a bounded estimate, not event-level truth.

Model used (documented in JSON evidence file):
- Agent/internal lower bound = `max(non-TH users, 4 users per QA run in 7d)`
- Agent/internal upper bound = `0.85 * QA check-units in 7d`
- Unknown bucket = `11.7%-17.5%` of raw 7d users for overlap/untagged ambiguity
- Real users = raw users - agent/internal - unknown

Observed raw users (7d): `685`

Point estimate:
- Likely real users: `389` (56.8%)
- Likely agent/internal: `196` (28.6%)
- Unknown/mixed: `100` (14.6%)

Working range:
- Likely real users: `245-533` (35.8%-77.8%)
- Likely agent/internal: `72-320` (10.5%-46.7%)
- Unknown/mixed: `80-120` (11.7%-17.5%)

## 4) Confidence and Decision Safety

Confidence levels:
- Contamination present in this snapshot: `High`
- Exact split percentages: `Medium-Low`
- Exact real-user count: `Low` (until CAL-275 lands)

Board-safe statement now:
- We can confirm the GA4 snapshot is materially mixed with non-user traffic risk.
- We cannot claim a precise organic-user count from this snapshot yet.
- We should use bounded ranges above for growth decisions until tagging ships.

## 5) Current Blocker and Next Action

Blocking dependency:
- `CAL-275` (CTO lane): GA4 traffic actor tagging (`traffic_actor=paperclip_agent`) is still backlog/not shipped.

Needed to close uncertainty:
1. CAL-275 implementation and QA marker rollout.
2. GA4 custom dimension/report filter using `traffic_actor`.
3. A re-cut of this estimate using tagged exclusion so real-user count is directly measurable.
