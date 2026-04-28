# CAL-9 Weekly KPI Reporting Workflow

This workflow produces a weekly KPI summary for Calculator Thailand with:

- sessions
- clicks
- CTR
- completion by calculator (`calculator_complete / calculator_start`)

## 1. Configure production GA4 ID

Set this environment variable in Railway production:

```bash
PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

`BaseLayout.astro` and `BlogPostLayout.astro` now read this variable directly, so no hardcoded GA ID is required in templates.

## 2. Export weekly source CSVs

Export date range = last 7 complete days.

1. GA4 Sessions export (`sessions.csv`)
   - Required columns:
     - `sessions`
     - either `calculator_type` or page path (`page path`, `landing page`, etc.)

2. GA4 Events export (`events.csv`)
   - Filter events to:
     - `calculator_start`
     - `calculator_complete`
     - `calculator_used`
     - `result_viewed`
   - Required columns:
     - `event_name`
     - `event_count`
     - `calculator_type`

3. Click/CTR export (`clicks.csv`) (optional but recommended)
   - Can come from AdSense, Search Console, or other reporting source
   - Required columns:
     - `clicks`
     - optional `ctr`
     - either `calculator_type` or page path

## 3. Generate report

```bash
npm run kpi:weekly -- \
  --sessions reports/sessions.csv \
  --events reports/events.csv \
  --clicks reports/clicks.csv \
  --out reports/weekly-kpi-summary.md
```

If `--clicks` is omitted, the report still computes completion metrics from GA4 events and sessions.

## 4. Publish weekly summary

1. Commit `reports/weekly-kpi-summary.md` (or paste its table into the weekly update issue/comment).
2. Highlight:
   - calculators with low completion rate
   - calculators with high sessions but low CTR
   - calculators with strong completion and CTR to prioritize for SEO/content scale

## 5. Calculator type mapping (production)

- `personal_income_tax`
- `vat`
- `loan`
- `vehicle`
- `deposit`
- `net_salary`
- `bmi`
- `age`
