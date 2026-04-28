# CAL-5 Technical SEO and AdSense Readiness Audit (Aligned to CAL-1)
Date: 2026-04-14
Owner: CTO
Parent: [CAL-1](/CAL/issues/CAL-1)
Issue: [CAL-5](/CAL/issues/CAL-5)
Planning anchor: [CAL-1 plan](/CAL/issues/CAL-1#document-plan)

## Top Opportunities
1. Canonical domain consolidation
- Why it matters: all SEO authority is currently tied to a Railway default hostname, which weakens long-term brand/domain equity.
- Revenue tie-in: stronger index consolidation increases qualified organic sessions to calculator landing pages.
- Decision update: canonical source-of-truth is confirmed as `https://calculator-thailand-production.up.railway.app` until custom-domain cutover, with `PUBLIC_SITE_URL` as the swap point.

2. Sitemap authority simplification
- Why it matters: generated sitemap output is complete, but a separate static `public/sitemap.xml` is also shipped and can drift.
- Revenue tie-in: cleaner crawl/index coverage improves discoverability of calculator and article pages.

3. AdSense readiness foundation (policy-safe)
- Why it matters: technical consent/ad scaffolding is now implemented; remaining leverage is production value rollout (publisher ID, slot IDs, and launch flags).
- Revenue tie-in: this is the direct unblocker for compliant monetization launch.

4. CWV regression guardrails
- Why it matters: no automated performance budgets are in place, so regressions can ship silently.
- Revenue tie-in: preserves search ranking and ad viewability quality.

5. Structured internal-link systemization
- Why it matters: links are manually curated today; automation can increase crawl depth and topical relevance.
- Revenue tie-in: improves page discovery and session depth for higher ad impressions/session.

## Key Risks
1. Domain mismatch risk
- During custom-domain cutover, inconsistent `PUBLIC_SITE_URL` updates could fragment canonical/schema/sitemap signals.

2. Crawl ambiguity risk
- Dual sitemap sources increase chance of stale URL submissions and slower reindexing.

3. Ad policy/compliance risk
- No consent-mode implementation before ads can create policy and regional compliance exposure.

4. CWV/CLS monetization risk
- Ad rollout without strict reserved slot strategy and monitoring can degrade CLS and hurt both rankings and RPM.

5. Platform/security staleness risk
- Current Astro version is behind current major and `npm audit` reports 1 high + 2 moderate advisories.

## Prioritized Backlog (P0/P1/P2) with Rationale

## P0 - Immediate, highest impact, launch blockers
1. Canonical and site URL normalization (`PUBLIC_SITE_URL` source-of-truth)
- Rationale: foundational SEO integrity prerequisite for every other growth action.
- Effort: 0.5 day
- Dependencies: resolved (CEO decision posted; current source is Railway domain until cutover)
- Success signal: 100% pages emit canonical/schema/sitemap URLs on production domain.

2. Sitemap/robots cleanup to single authority
- Rationale: removes crawl ambiguity fast with low effort.
- Effort: 0.5 day
- Dependencies: none
- Success signal: one submitted sitemap source; no stale URLs in Search Console coverage.

3. AdSense readiness baseline (`ads.txt`, consent mode, pre-consent ad blocking)
- Rationale: direct blocker to monetization launch and policy safety.
- Effort: 1.5 days
- Dependencies: AdSense publisher data + consent/legal owner
- Success signal: valid `ads.txt`, consent events captured, ads do not render before consent where required.

4. CWV guardrail instrumentation (Lighthouse/Web Vitals budgets)
- Rationale: prevents revenue-negative regressions during ad rollout and SEO iterations.
- Effort: 1 day
- Dependencies: CI integration path
- Success signal: budget failures block regressions on LCP/CLS/INP thresholds.

## P1 - Growth acceleration after P0 stability
1. Standardized ad slot component rollout with CLS-safe containers
- Rationale: scales monetization without layout instability.
- Effort: 1 day
- Dependencies: P0 consent + AdSense IDs
- Success signal: CLS <= 0.1 on ad-enabled templates.

2. Structured data consistency pass (`Organization`, `WebSite`, calculator/article parity)
- Rationale: improves rich-result reliability across all high-intent pages.
- Effort: 1 day
- Dependencies: finalized brand/domain metadata
- Success signal: no critical schema errors in validation tools.

3. Internal-link automation from taxonomy map
- Rationale: lifts crawl depth and topic clustering efficiency versus manual linking.
- Effort: 1 day
- Dependencies: CMO taxonomy priorities
- Success signal: higher internal-link density with zero broken links.

## P2 - Hardening and scalability
1. Astro/toolchain modernization + regression sweep
- Rationale: reduces security/platform risk and long-term maintenance drag.
- Effort: 1.5 days
- Dependencies: regression window
- Success signal: no high-severity production dependency advisories.

2. Static delivery optimization review (compression/cache strategy)
- Rationale: improves transfer and TTFB efficiency as traffic scales.
- Effort: 1 day
- Dependencies: deployment path decision
- Success signal: measurable page weight/TTFB improvement on key landing routes.

## Sequencing Snapshot
- Week 1: Execute all P0 items.
- Week 2: Execute P1 items and begin P2 modernization prep.
- End of Week 2: report KPI movement to [CAL-1](/CAL/issues/CAL-1) for roadmap reprioritization.

## Current Blockers / Dependencies To Resolve Fast
- CEO + operations/legal owner: provide AdSense publisher details and consent policy ownership.
- CMO: provide final internal-link taxonomy priorities for automation pass.
