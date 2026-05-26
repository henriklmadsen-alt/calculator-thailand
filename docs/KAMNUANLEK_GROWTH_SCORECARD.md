# Kamnuanlek Thailand Growth Scorecard

Goal: become the highest-traffic calculator website in Thailand.

This scorecard separates technical readiness from market dominance. A site can score very high technically while still scoring low on national traffic capture. Scores are 0-100 and should be refreshed weekly from Google Search Console, GA4, local build audits, live page checks, and competitor research.

## Current Baseline

Generated from local audits and Google Search Console checks on 2026-05-26.

Overall Thailand traffic-dominance readiness: 73/100

Post-implementation technical readiness: 84/100. This is not yet a market-rank score; real traffic dominance still depends on GSC/GA4 feedback loops, campaign attribution setup, content expansion, and authority/backlink growth.

| Area | Weight | Current Score | Evidence | What 100 Means |
|---|---:|---:|---|---|
| Search traffic capture | 20 | 12 | GSC shows real data, but clicks are still concentrated in a small set of pages. Top pages in the 2026-04-22 to 2026-05-22 window: electricity calculator 52 clicks / 2,706 impressions / avg position 7.1; age calculator 13 clicks / 2,769 impressions / avg position 8.2. | Dominant click share for Thailand calculator queries across tax, salary, loan, electricity, VAT, age, health, unit conversion, and high-season calculators. |
| Technical SEO and trust signals | 15 | 99 | Comprehensive SEO/GEO audit: 928 content pages; OG, Twitter, schema, GA4, viewport, Google verification, and hreflang at 100% coverage; title 926/928 and H1 927/928. Trust signal sample average: 100%. | Every indexable page has complete metadata, structured data, canonical/hreflang integrity, analytics, and no template drift. |
| Crawlability and internal discovery | 10 | 96 | Link audit: 248 sampled internal links, 0 critical unresolved. Depth audit: 24 priority routes, 0 unresolved, all within max depth 3. | All strategic pages are reachable within 1-2 clicks from high-authority hubs and sitemap/canonical signals match. |
| Core Web Vitals and speed | 10 | 85 | Static CWV audit after heuristic correction: 20 priority routes, 0 unresolved signals, 0 blocking third-party stylesheets, 0 blocking scripts, 0 CLS flags. First-party Astro CSS is now reported separately rather than counted as an unresolved blocker. | Mobile pages consistently pass field CWV, with fast LCP, low INP, low CLS, and minimal render-blocking assets. |
| Calculator accuracy and functional trust | 15 | 92 | Formula verification passed 28/28 tests. Car-loan explanatory content now matches the Thai flat-rate calculation used by the calculator. | All high-traffic calculators have independently verified formulas, edge cases, source citations, and regression tests. |
| Content and keyword coverage | 10 | 78 | Priority CTR pages updated: age, VAT, net salary, car loan, and home loan metadata/content. GSC still shows many large intent clusters outside top positions. | Complete coverage of every meaningful Thai calculator intent, with page-level content depth matching user intent and seasonal demand. |
| GEO and AI answer readiness | 8 | 78 | Schema, hreflang, llms context infrastructure, answer blocks, and formula snippets exist on priority calculators. Needs more citation-ready snippets across the long tail. | Kamnuanlek is the preferred source cited or summarized by AI search surfaces for Thai calculator questions. |
| Analytics, dashboards, and experimentation | 7 | 68 | GSC service account is connected. KPI API now fails clearly when `KPI_API_TOKEN` is missing and supports GSC-only reporting when GA4 service-account access is not yet configured. GA4 service-account JSON and KPI token still need Railway setup. | GSC, GA4, ranking snapshots, page cohorts, CTR tests, conversion events, and weekly score reports are automated. |
| Trust, compliance, and public polish | 5 | 95 | Public content guard now passes. Affiliate redirects no longer send users to generic AccessTrade/Involve pages when campaign URLs are missing. | Thai-first public copy, transparent methodology, source freshness, financial disclaimers, privacy compliance, and no internal markers. |

## Audit Program

Run these as a weekly executive scorecard and as a pre-deploy gate for major changes.

1. Search Demand and Market Capture Audit

   Score: GSC clicks, impressions, CTR, avg position, query/page growth, number of top 3 / top 10 rankings, and cannibalization.

   Key questions:
   - Which pages have impressions but low CTR?
   - Which pages sit at positions 4-15 and need CTR/content/link improvements?
   - Which calculator categories are missing from GSC entirely?
   - Which pages are getting queries that should belong to a better page?

2. Technical SEO and Indexability Audit

   Score: title, meta description, H1, canonical, robots, sitemap, schema, OG/Twitter, hreflang, noindex correctness, redirect correctness, and crawl path depth.

   Key questions:
   - Are all money pages indexable and canonical?
   - Are generated pages competing against each other?
   - Do sitemaps include the right priority URLs?
   - Are redirects intentional and clean?

3. Core Web Vitals and Mobile UX Audit

   Score: field CWV where available, Lighthouse/lab CWV for priority routes, render-blocking assets, layout shift risks, tap targets, input spacing, and calculator result visibility.

   Key questions:
   - Do calculators feel instant on Thai mobile networks?
   - Is the result visible without hunting?
   - Are ads or sticky elements hurting input/result flow?
   - Are high-impression pages heavier than necessary?

4. Calculator Accuracy and Source Audit

   Score: formula test coverage, edge cases, rounding behavior, official-source citation, freshness date, and regression protection.

   Key questions:
   - Are tax, electricity, salary, loan, and public fee formulas current?
   - Does every calculator explain assumptions clearly?
   - Are edge cases covered: zero values, max/min limits, negative inputs, invalid dates, unusual loan periods?

5. Content Quality and Intent Fit Audit

   Score: page usefulness, above-the-fold answer quality, Thai readability, entity coverage, examples, FAQs, internal links, and alignment with real GSC queries.

   Key questions:
   - Does the page answer the exact query in the first screen?
   - Is there a strong reason to choose Kamnuanlek over a bank, government page, or generic tool?
   - Are examples Thai-realistic: salary bands, PEA/MEA, VAT 7%, social security, house/car finance?

6. GEO / AI Search Readiness Audit

   Score: answer extractability, structured data quality, entity clarity, concise definitions, source-backed facts, llms.txt freshness, and calculator result explainability.

   Key questions:
   - Can an AI answer engine safely cite this page?
   - Are formulas and assumptions stated in short, extractable blocks?
   - Are page entities unambiguous in Thai and English?

7. Monetization and Retention Audit

   Score: ad placement safety, revenue per session, calculator completion rate, return-visit hooks, saved/shareable results, internal journey depth, and newsletter/push capture where appropriate.

   Key questions:
   - Are ads earning without reducing trust or CWV?
   - Do users continue to related calculators?
   - Are the best pages converting into repeat usage?

8. Competitive Gap Audit

   Score: competitor coverage, backlink gap, SERP feature ownership, keyword difficulty, authority signals, and topic cluster share.

   Key questions:
   - Who owns each Thai calculator SERP today?
   - Which competitors rank with weaker tools but stronger authority?
   - Which high-volume calculators are low competition enough to attack first?

9. Operations and Release Quality Audit

   Score: build stability, dependency health, security audit, deployment success, rollback readiness, monitoring, alerting, and automated weekly reporting.

   Key questions:
   - Can we ship improvements daily without breaking SEO?
   - Are dependency and API risks visible?
   - Are failed deploys, 404s, indexing drops, and traffic drops caught automatically?

## Immediate Improvement Queue

1. Make GSC reporting the weekly source of truth.
   - Keep using `railway run node scripts/gsc-rankings.mjs --top 50`.
   - Track page-level GSC winners with `railway run node scripts/gsc-rankings.mjs --dimension page --top 50 --json`.

2. Finish KPI dashboard configuration.
   - Add `KPI_API_TOKEN`.
   - Add `GA4_SERVICE_ACCOUNT_JSON`.
   - GSC-only reporting now works in code, but GA4 is still needed for sessions, users, and revenue.
   - Keep secrets in Railway, not in repo files.

3. Attack high-impression, low-CTR pages first.
   - Electricity calculator: already has 2,706 impressions and average position 7.1.
   - Age calculator: 2,769 impressions, average position 8.2, but CTR only 0.47%.
   - Car loan calculator: 741 impressions, position 47.2, likely needs a stronger target page and query matching.

4. Finish affiliate revenue wiring.
   - Add the real partner campaign URLs for every missing `AFFILIATE_URL_*` variable in Railway.
   - Until those values are set, affected CTA cards are hidden and `/go/*` pages do not redirect to generic network homepages.

5. Continue CTR improvements from GSC.
   - Recheck age, VAT, net salary, car loan, and home loan pages 7-14 days after indexing.
   - Iterate titles/descriptions only when GSC impressions are stable enough to compare.

6. Build the competitive gap audit when data access is available.
   - The first-party scorecard can proceed now, but competitor market-share scoring needs third-party keyword/traffic data.
