# CAL-70 Week-1 Conversion Instrumentation + Mobile UX Evidence

Generated: 2026-04-14 (ICT)
Route scope: top 5 calculators (`vehicle`, `personal_income_tax`, `mortgage_refinance`, `net_salary`, `vat`)

## 1) 375px Mobile Screenshots (TH and TH+EN)

- TH: `reports/qa/cal-70/2026-04-14/vehicle-th-375.png`
- TH+EN: `reports/qa/cal-70/2026-04-14/vehicle-th-en-375.png`
- TH: `reports/qa/cal-70/2026-04-14/tax-th-375.png`
- TH+EN: `reports/qa/cal-70/2026-04-14/tax-th-en-375.png`
- TH: `reports/qa/cal-70/2026-04-14/mortgage-th-375.png`
- TH+EN: `reports/qa/cal-70/2026-04-14/mortgage-th-en-375.png`
- TH: `reports/qa/cal-70/2026-04-14/net-salary-th-375.png`
- TH+EN: `reports/qa/cal-70/2026-04-14/net-salary-th-en-375.png`
- TH: `reports/qa/cal-70/2026-04-14/vat-th-375.png`
- TH+EN: `reports/qa/cal-70/2026-04-14/vat-th-en-375.png`

## 2) GA4 Event Payload Samples

- Raw event log artifact:
  - `reports/qa/cal-70/2026-04-14/ga4-event-samples.json`

New week-1 entry and conversion events verified in payload logs:
- `calculator_quickstart_click`
- `calculator_card_click`
- `article_cta_click`
- `next_action_click`

Language context present in new-event payloads:
- `lang_mode`
- `content_locale`
- `ui_language`

## 3) Before/After Metric Snapshot (Sample Session)

Baseline from CAL-69 plan before this rollout:
- Homepage card click event: missing.
- Quick-start chip click event: missing.
- Article CTA click event: missing.
- Next-action click payload: partial / not normalized.

After implementation (from `ga4-event-samples.json` sample run):
- `calculator_quickstart_click`: 1
- `calculator_card_click`: 1
- `article_cta_click`: 1
- `calculator_start`: 1
- `calculator_complete`: 1
- `next_action_click`: 1

Derived sample conversion rates from the same run:
- Calculator start-to-complete rate: `1 / 1 = 100%`
- Post-result next-action click rate: `1 / 1 = 100%`

## 4) Technical Verification

- Build check: `npm run build` passed after rollout.
- Ad guardrail check (code-level): VAT first ad moved to guarded slot revealed after post-result next-action section (`revealAfterSelector="#vat-next-action"`).
