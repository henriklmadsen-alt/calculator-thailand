# CAL-6 Organic Traffic and AdSense Growth Strategy (90 Days)

## Scope and Baseline (2026-04-14)
- Current inventory: 8 calculator pages and 5 supporting articles.
- Structured data exists (WebApplication/FAQ on calculators, Article/FAQ on posts).
- Critical tracking gap: GA4 ID is still `G-XXXXXXXXXX`; event taxonomy exists but is not production-ready.
- Monetization gap: AdSense IDs/slots are placeholders; no production ads are active.
- Technical SEO risk: `robots.txt` points to `sitemap-index.xml` while repo currently ships `public/sitemap.xml`.

## 90-Day KPI Targets
- Organic sessions (Google Thailand): reach >= 5,000/month by Day 90.
- Top-10 ranking keywords in Thailand: reach >= 60 query terms by Day 90.
- Search CTR (GSC): reach >= 5.5% by Day 90.
- AdSense readiness: approval + live units on priority templates by Day 60.
- AdSense RPM: reach THB 70-150 by Day 90 with no major UX regression (<= 5% drop in calculator completion rate).

## Strategy Pillars
1. Capture high-intent Thai calculator demand.
2. Expand SERP surface with calculator + article clusters.
3. Improve revenue/session with low-intrusion ad placements and experiment discipline.
4. Build instrumentation so every content and monetization decision is measurable.

## Content + SEO Roadmap

### Phase 1 (Days 1-14): Foundation and Measurement
- Fix canonical/sitemap consistency and verify indexing health.
- Launch GA4 + Search Console with production IDs.
- Define page-level KPI dashboard (landing page, clicks, CTR, avg position, calculator completion).
- Refresh on-page templates for stronger SERP CTR:
  - Thai-first titles with year context (2569/2026).
  - Meta descriptions with explicit use-case intent.
  - FAQ blocks aligned with Thai long-tail intent.

### Phase 2 (Days 15-45): Build Topic Clusters
- Publish 2 high-intent pages/week (calculator-adjacent article guides).
- Priority clusters:
  - Salary + tax: net salary, withholding tax, annual tax planning.
  - Loan + installment: home loan, car installment, debt affordability.
  - Savings + deposit: fixed deposit, after-tax interest, comparison scenarios.
- Internal linking model:
  - Every article links to one primary calculator CTA above the fold.
  - Every calculator links to 3 relevant articles and 3 sibling calculators.

### Phase 3 (Days 46-90): Scale Winners + Monetize
- Double down on top 20% pages by click growth:
  - Add deeper FAQ and scenario blocks.
  - Add Thai SERP variants in headers/subheads.
  - Add comparison content around winning calculators.
- Expand publishing cadence to 3 pieces/week only for clusters with proven clicks and CTR.

## Prioritized Backlog (CMO -> CTO Implementation)
1. Analytics productionization (GA4/GSC IDs, event QA, dashboard exports).
2. Technical SEO integrity (sitemap/robots/canonical consistency).
3. Internal-link automation pattern for calculator/article templates.
4. Ad slot framework and experiment flags (without disruptive UX).

## Monetization Experiment Plan

### Stage A (After AdSense Approval)
- Placement tests:
  - A1: one in-content ad below calculator result block.
  - A2: article mid-content ad + end-of-article ad.
  - A3: mobile sticky anchor vs non-sticky control.
- Guardrails:
  - No ad above primary calculator input.
  - No interstitial or layout-shift-heavy formats.
  - Maintain Core Web Vitals and completion rate.

### Stage B (Optimization)
- Test frequency: one variable change per 7-day window.
- Success metric hierarchy:
  1) RPM uplift
  2) no material drop in completion rate
  3) stable bounce rate

## Weekly Operating Cadence
- Monday: rank/query review and content reprioritization.
- Wednesday: publish + internal link pass.
- Friday: KPI review and experiment decision log.

## Risks and Mitigation
- Risk: weak indexing velocity for new Thai URLs.
  - Mitigation: tighter internal links + manual GSC submission for priority pages.
- Risk: RPM uplift hurts UX.
  - Mitigation: strict guardrails and rollback criteria.
- Risk: low confidence from missing baseline data.
  - Mitigation: lock instrumentation in first 14 days and report deltas weekly.

## Deliverables Mapping
1. 90-day strategy with KPI targets: complete in this plan.
2. Prioritized content/distribution roadmap: phased roadmap + backlog above.
3. Monetization test plan: staged experiments + guardrails above.
