# CAL-68 Next Source Slice (Unit Converter + Top Live Calculators)

Issue: [CAL-68](/CAL/issues/CAL-68)  
Wake comment: `c1f49ee2-cc7f-4432-9634-443dbf106165`  
Mode: public crawl/source execution while [CAL-260](/CAL/issues/CAL-260) and [CAL-354](/CAL/issues/CAL-354) remain blockers for authenticated GSC actions.

## Public evidence baseline used
- Source: `app/reports/qa/cal-68/2026-04-19/gsc-loop/public-48h-unit-top-live-checkpoint.json`
- Unit-converter cluster: `unit_calc` 404, `unit_article` 404
- Top live calculators: `electricity_calc` 200, `ot_calc` 200, `cc_interest_calc` 200, `net_salary_calc` 200, `percent_calc` 200
- Sitemap path presence gap remains on high-intent pages (notably electricity/OT/percentage).

## First concrete implementation action taken
- Added direct unit-converter internal link card on percentage calculator:
  - `src/pages/คำนวณเปอร์เซ็นต์/index.astro:268`

## Source-side improvements shipped in this slice
1. Internal-link context expansion from top live calculators into unit-converter cluster
- Added `/แปลงหน่วย/` internal link in:
  - `src/pages/คำนวณเปอร์เซ็นต์/index.astro:268`
  - `src/pages/คำนวณเงินเดือนสุทธิ/index.astro:333`
  - `src/pages/คำนวณเงินเดือนสุทธิ/index.astro:334` (supporting unit-converter article link)

2. Unit-converter reciprocal link coverage to top live calculators
- Added related-link cards on unit-converter page:
  - `src/pages/แปลงหน่วย/index.astro:208` (`/คำนวณเงินเดือนสุทธิ/`)
  - `src/pages/แปลงหน่วย/index.astro:212` (`/คำนวณเปอร์เซ็นต์/`)

3. Metadata + FAQ/entity freshness for unit-converter landing
- Updated description to emphasize immediate use with popular calculators:
  - `src/pages/แปลงหน่วย/index.astro:7`
- Added new FAQ item to improve entity/intent coverage for cross-calculator use:
  - `src/pages/แปลงหน่วย/index.astro:25`

## Verification
- `npm run build` passed (Astro build + `verify-public-content` guard).

## Handoff clarity (owner-by-owner)
- CTO (deploy/indexability): deploy these source updates; resolve unit-converter route/article 404; ensure sitemap/custom-domain parity for recrawl readiness.
- CMO/Thai Content: keep snippet tone aligned to Thai intent for updated unit-converter meta/FAQ language if editorial refinement is required.
- SEO: re-run public route/sitemap check and publish recrawl order immediately after deploy (GSC-auth steps remain gated by [CAL-260](/CAL/issues/CAL-260) and [CAL-354](/CAL/issues/CAL-354)).
