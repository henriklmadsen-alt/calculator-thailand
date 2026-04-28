# CAL-27 Weekly SEO Scorecard Export

Generated at: 2026-04-15T02:38:57.244Z
Reporting window: 2026-04-08 to 2026-04-14
Site URL: `https://calculator-thailand-production.up.railway.app`

## Input Sources
- Expected sitemap: `C:\Users\Henrik Madsen\.paperclip\instances\default\projects\3fee8de0-ac05-47ee-a8bd-b3b8a17cc09e\7bc34589-7df0-4922-a15b-7effc6367f4d\calculator-thailand\dist\sitemap-0.xml`
- GSC query CSV: `scripts/fixtures/cal-27/gsc-query.sample.csv`
- GSC page CSV: `scripts/fixtures/cal-27/gsc-page.sample.csv`
- GA4 organic CSV: `scripts/fixtures/cal-27/ga4-organic.sample.csv`
- AdSense CSV: `scripts/fixtures/cal-27/adsense.sample.csv`
- Watchlist CSV: `scripts/fixtures/cal-27/watchlist.sample.csv`
- GA4 property id (sync): `532846397`
- Public AdSense client id (sync): `ca-pub-5753152813183301`
- Normalized index baseline URLs: 20
- Normalized index target URLs: 20
- Telemetry schema JSON: `C:\Users\Henrik Madsen\.paperclip\instances\default\projects\3fee8de0-ac05-47ee-a8bd-b3b8a17cc09e\7bc34589-7df0-4922-a15b-7effc6367f4d\calculator-thailand\reports\kpi-feed\latest.json`

## Production Sitemap Parity
| Metric | Value |
| --- | --- |
| Expected routes (audited build) | 20 |
| Normalized index target (source-of-truth) | 20 |
| Live routes (production sitemap) | 20 |
| Missing routes | 0 |
| Unexpected routes | 0 |
| Parity status | PASS |

### Missing Routes
- None

### Unexpected Routes
- None

## CAL-23 Weekly Scorecard Schema

| KPI | Definition | Source | Baseline (2026-04-14) | Week target | Owner | Current week |
| --- | --- | --- | --- | --- | --- | --- |
| Indexed URLs | URLs in sitemap and index-valid in GSC | GSC + sitemap | 20 live URLs (normalized baseline) | 20 live URLs + GSC validation | CTO | 20 live / 20 normalized target (PASS) |
| Impressions (TH) | Search impressions from Thailand | GSC | Pending first-party export | +20% WoW after baseline week | CMO | 29,100 |
| Clicks (TH) | Organic clicks from Thailand | GSC | Pending first-party export | +15% WoW after baseline week | CMO | 696 |
| CTR | Clicks / impressions | GSC | Pending | +0.3 pp over baseline | CMO | 2.39% |
| Avg position (watchlist) | Mean rank across watchlist | GSC + manual spot checks | No Top 10 presence | Improve 3+ places on 4 terms | CMO | 11.31 |
| Top-10 keywords (watchlist) | Count of tracked terms in Top 10 | GSC + manual | 0/8 | 2/8 by week 4 | CMO | 3/8 |
| Organic sessions | Sessions with organic medium | GA4 | Pending confirmed baseline | +20% vs baseline by week 4 | CMO | 10,110 |
| AdSense RPM | Revenue per 1,000 sessions | AdSense + GA4 | Pending | Establish baseline + +10% by week 4 | CMO | 42.53 THB / 1,000 sessions |

- GSC weighted average position: 10.29
- Organic sessions source rows: 4
- AdSense revenue: 430.00

## Telemetry Schema Health (CAL-71)

| Telemetry metric | Source | Status |
| --- | --- | --- |
| Indexed URLs | expected_sitemap_routes | ok |
| Impressions/Clicks/CTR | gsc_page_csv | ok |
| Organic sessions | ga4_organic_csv | ok |
| AdSense RPM | adsense_revenue_with_ga4_sessions | ok |
| Watchlist position | watchlist_csv | ok |

### Fallback Events
- first_party_api_ingestion: csv_fallback (Missing pipeline env vars: GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN, GSC_SITE_URL, ADSENSE_ACCOUNT_ID)

### Residual Dependencies
- [CAL-16](/CAL/issues/CAL-16): Production GA4/GSC/AdSense API credential access (First-party API ingestion automation remains unavailable; CSV fallback continues.)

## GSC Top Queries (by clicks)

| Query | Clicks | Impressions | CTR | Avg position |
| --- | ---: | ---: | ---: | ---: |
| car loan calculator thailand | 180 | 7,400 | 2.43% | 11.20 |
| thai income tax calculator | 160 | 8,200 | 1.95% | 9.60 |
| mortgage refinance thailand | 98 | 3,900 | 2.51% | 13.40 |
| deposit interest calculator | 72 | 2,800 | 2.57% | 10.80 |
| net salary thailand | 64 | 2,600 | 2.46% | 12.30 |

## GSC Top Pages (by clicks)

| Page | Clicks | Impressions | CTR | Avg position |
| --- | ---: | ---: | ---: | ---: |
| /%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%A3%E0%B8%96/ | 210 | 8,600 | 2.44% | 10.10 |
| /%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%9A%E0%B8%B8%E0%B8%84%E0%B8%84%E0%B8%A5%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%94%E0%B8%B2/ | 188 | 9,100 | 2.07% | 8.90 |
| /%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/ | 120 | 4,800 | 2.50% | 12.60 |
| /%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%9D%E0%B8%B2%E0%B8%81/ | 92 | 3,400 | 2.71% | 10.40 |
| /%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%94%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B8%97%E0%B8%98%E0%B8%B4/ | 86 | 3,200 | 2.69% | 11.20 |

## Watchlist Snapshot

| Keyword | Position |
| --- | ---: |
| vat 7 calculator thailand | 7.20 |
| personal income tax thailand 2569 | 8.70 |
| car payment thai | 9.80 |
| deposit interest thailand | 10.90 |
| net salary thailand | 11.30 |
| mortgage refinance thailand | 12.40 |
| age calculator thai | 13.70 |
| calculator thailand | 16.50 |

## Notes
- This export keeps the CAL-23 KPI schema stable while adding current-week values and normalized index-target metadata.
- Full automation of first-party API pulls depends on production credential access tracked in [CAL-16](/CAL/issues/CAL-16).
- Fallback behavior is explicit: each degraded metric is listed in "Fallback Events" and mirrored in the telemetry JSON artifact.
- Re-run this script weekly after refreshing CSV exports from GSC, GA4, and AdSense.
