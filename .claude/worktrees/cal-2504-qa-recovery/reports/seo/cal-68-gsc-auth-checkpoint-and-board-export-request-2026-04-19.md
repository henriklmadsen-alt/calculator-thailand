# CAL-68 GSC Auth Checkpoint + Board Export Request (2026-04-19)

## CEO directive checkpoint status
- Property provided: `https://search.google.com/search-console?resource_id=https%3A%2F%2Fcalculator-thailand-production.up.railway.app%2F`
- Runtime auth result: `BLOCKED`
- Evidence artifact:
  - `reports/qa/cal-68/2026-04-19/gsc-auth-live/gsc-auth-attempt-snapshot.json`

## Exact access blocker (verified now)
1. Browserless open to provided property URL redirects to `https://search.google.com/search-console/about`.
2. HTTP HEAD check returns `302` to `/about` (not property dashboard).
3. Runtime has no authenticated Google session tokens for Search Console.

Result: cannot retrieve Performance (7d/28d/WoW), Queries, Pages, Indexing, or Sitemaps metrics directly from authenticated GSC in this heartbeat.

## Immediate board export request (required now)
Please provide exports/screenshots from the same property for these exact datasets:
1. Performance > Search results > Queries: Last 7 days vs previous 7 days (`query, clicks, impressions, ctr, position`).
2. Performance > Search results > Queries: Last 28 days vs previous 28 days (`query, clicks, impressions, ctr, position`).
3. Performance > Search results > Pages: Last 28 days vs previous 28 days (`page, clicks, impressions, ctr, position`).
4. Indexing > Pages: indexed vs not indexed counts and reason buckets.
5. Indexing > Sitemaps: submitted sitemap URLs, status, last read, discovered URLs.

Working templates prepared for immediate fill after export:
- `reports/qa/cal-68/2026-04-19/gsc-auth-live/top20-queries-template.csv`
- `reports/qa/cal-68/2026-04-19/gsc-auth-live/top10-fastest-win-actions-template.csv`

## Provisional Top-10 page actions (public evidence, owner-tagged)
These are execution-ready now and do not require authenticated query metrics.
1. `/คำนวณวันคลอด/` returns `404` on production -> deploy route to `200` and include in sitemap. Owner: CTO.
2. `/บทความ/คำนวณวันคลอด-คำนวณอายุครรภ์/` returns `404` on production -> deploy route to `200` and include in sitemap. Owner: CTO.
3. `/คำนวณภาษีที่ดิน/` returns `404` on production -> deploy route and include in sitemap. Owner: CTO.
4. `/แปลงหน่วย/` returns `404` on production -> deploy route and include in sitemap. Owner: CTO.
5. `/คำนวณค่างวดบัตรเครดิต/` returns `404` on production -> deploy route and include in sitemap. Owner: CTO.
6. `/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวดและดอกเบี้ย/` returns `404` on production -> deploy route and include in sitemap. Owner: CTO.
7. `robots.txt` sitemap directives still point to Railway host -> switch to `https://www.kamnuanlek.com` sitemap URLs. Owner: CTO.
8. Live canonical tags on indexed pages still use Railway host -> normalize canonical host to custom domain. Owner: CTO.
9. Live sitemap coverage is behind source inventory (missing multiple calculators/articles) -> regenerate sitemap from current deployed routes after release. Owner: CTO.
10. Credit-card-interest legacy article canonical mismatch (`/บทความ/ดอกเบี้ยบัตรเครดิต-คิดยังไง-จ่ายขั้นต่ำ-2569/`) -> keep one canonical winner and align internal links/title-snippet strategy. Owner: CMO + SEO.

## CAL-68 owner actions prepared now (can run without GSC auth)

### CTO / Frontend Release
1. Deploy missing Day-4 due-date routes now (`/คำนวณวันคลอด/`, `/บทความ/คำนวณวันคลอด-คำนวณอายุครรภ์/`) because live still returns `404`.
2. Keep sitemap and canonical normalized to custom-domain host (live still Railway-host canonical/sitemap in prior audits).
3. Re-submit sitemap after deploy so Day-4 and other new calculators/articles become discoverable.

### SEO / CMO
1. Keep executing source-side internal-link and metadata freshness for high-intent clusters while waiting for GSC exports.
2. On export arrival, map top impression terms with avg position `8-30` and weak CTR into title/meta/internal-link fixes.

### Thai Content
1. Prepare snippet-tight Thai query answers for the expected top pages once query list is available.
2. Prioritize FAQ/example additions for terms with high impressions and weak CTR.

## Definition-of-done dependency note
- Top 20 ranking queries and Top 10 fastest-win keyword/page actions cannot be finalized until board-provided GSC export/screenshots arrive.
- This heartbeat completed the required immediate blocker declaration plus export request packet instead of leaving CAL-68 idle.
