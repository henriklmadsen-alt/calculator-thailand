# CAL-68 Day-4 Due-Date / Pregnancy-Age Search Readiness Packet (2026-04-19)

## Scope
- Issue: `CAL-68`
- Day-4 cluster from `CAL-310`: `คำนวณวันคลอด`, `คำนวณอายุครรภ์`
- Surfaces audited: `/คำนวณวันคลอด/`, `/บทความ/คำนวณวันคลอด-คำนวณอายุครรภ์/`, `/คำนวณอายุ/`
- Evidence mode: source/dist + public crawl while GSC auth remains blocked by `CAL-260`

## Coordination with CAL-391 (non-overlap)
- `CAL-391` owns Thai content trust/caveat QA and copy approval.
- This slice stayed on SEO search-readiness and internal-link execution.
- No title/meta/H1 lock rewrites were done in this packet.

## First execution action taken in this heartbeat
- Added a post-result internal-link block on due-date calculator (`/คำนวณวันคลอด/`) to push users and crawlers to:
1. `/บทความ/คำนวณวันคลอด-คำนวณอายุครรภ์/`
2. `/คำนวณอายุ/`
- Added click tracking payload for these post-result links (`next_action_click` with `calculator_type: pregnancy_due_date`).
- Build verification completed: `npm run build` passed (Astro build + `scripts/verify-public-content.mjs`).

## Source-side improvement shipped (unblocked)
Updated `src/pages/คำนวณวันคลอด/index.astro`:
- Inserted hidden `#due-next-action` card shown after successful calculation.
- Added two contextual links for Day-4 intent continuity:
1. article deep-link to pregnancy-age explainer
2. age calculator follow-up link
- Updated ad reveal selector from `#due-results` to `#due-next-action` to keep post-result UX sequence aligned.

## Source/Dist readiness snapshot
Reference: `reports/qa/cal-68/2026-04-19/day4-due-date-pregnancy-age/source-dist-readiness-snapshot.json`

- `/คำนวณวันคลอด/`
  - title/meta present, canonical in dist uses custom domain
  - `FAQPage` + `WebApplication` schema present
  - key internal links to article + age calculator present
  - post-result CTA block present (`due-next-action=true`)
- `/บทความ/คำนวณวันคลอด-คำนวณอายุครรภ์/`
  - title/meta present, canonical in dist uses custom domain
  - Article + FAQ schema present
  - key internal links back to calculator + age calculator present
- `/คำนวณอายุ/`
  - title/meta present, canonical in dist uses custom domain
  - `FAQPage` + `WebApplication` schema present
  - Day-4 links to due-date calculator/article present in source

## Live public evidence snapshot
Reference: `reports/qa/cal-68/2026-04-19/day4-due-date-pregnancy-age/public-evidence-snapshot.json`

### Domain-level
- `robots.txt` = `200`, but sitemap directives still point to Railway host.
- `sitemap.xml` = `200`, contains 26 URLs, all on Railway host.

### Route-level (current production)
- `/คำนวณอายุ/` = `200`, canonical host still Railway, appears only in Railway-host sitemap.
- `/คำนวณวันคลอด/` = `404`, not in live sitemap.
- `/บทความ/คำนวณวันคลอด-คำนวณอายุครรภ์/` = `404`, not in live sitemap.

Implication: Day-4 due-date pair is source-ready but not yet deploy/live-indexable.

## Recrawl-ready URL order (post-deploy)
1. `https://www.kamnuanlek.com/คำนวณวันคลอด/`
2. `https://www.kamnuanlek.com/บทความ/คำนวณวันคลอด-คำนวณอายุครรภ์/`
3. `https://www.kamnuanlek.com/คำนวณอายุ/`

Rationale: publish missing Day-4 pair first, then refresh age calculator that now routes post-result users into the cluster.

## Exact owner handoffs

### CTO (deploy/indexability)
1. Deploy latest source so `/คำนวณวันคลอด/` and `/บทความ/คำนวณวันคลอด-คำนวณอายุครรภ์/` stop returning `404`.
2. Normalize live canonical host to `https://www.kamnuanlek.com` (currently Railway host on live HTML where route exists).
3. Include Day-4 pair in live sitemap and keep both discoverable on custom-domain host.
4. Keep robots sitemap directives on custom-domain URLs.

### CMO + Thai Content Specialist Alpha (CAL-391)
1. Continue trust/caveat/copy QA for Day-4 medical-intent pages.
2. Approve or adjust snippet-facing Thai copy without conflicting with this SEO internal-link implementation.

### SEO Specialist (completed in this slice)
1. Executed one unblocked internal-link improvement for Day-4 search intent continuity.
2. Delivered source/dist + public-evidence snapshot and recrawl order with explicit owner split.

## Dependency split
- Blocked by CTO deploy/indexability state: Day-4 due-date calculator/article still `404` on production.
- Blocked by `CAL-260`: authenticated GSC query/index metrics.
- Unblocked and completed now: source-side internal-link ranking improvement + crawl/readiness packet.
