# CAL-27 Weekly SEO Scorecard Export

Generated at: 2026-04-15T04:39:25.489Z
Reporting window: 2026-04-08 to 2026-04-14
Site URL: `https://calculator-thailand-production.up.railway.app`

## Input Sources
- Expected sitemap: `C:\Users\Henrik Madsen\.paperclip\instances\default\projects\3fee8de0-ac05-47ee-a8bd-b3b8a17cc09e\7bc34589-7df0-4922-a15b-7effc6367f4d\calculator-thailand\dist\sitemap-0.xml`
- GSC query CSV: `not provided`
- GSC page CSV: `not provided`
- GA4 organic CSV: `not provided`
- AdSense CSV: `not provided`
- Watchlist CSV: `not provided`
- GA4 property id (sync): `not provided`
- Public AdSense client id (sync): `not provided`
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
| Impressions (TH) | Search impressions from Thailand | GSC | Pending first-party export | +20% WoW after baseline week | CMO | Pending input |
| Clicks (TH) | Organic clicks from Thailand | GSC | Pending first-party export | +15% WoW after baseline week | CMO | Pending input |
| CTR | Clicks / impressions | GSC | Pending | +0.3 pp over baseline | CMO | Pending input |
| Avg position (watchlist) | Mean rank across watchlist | GSC + manual spot checks | No Top 10 presence | Improve 3+ places on 4 terms | CMO | Pending input |
| Top-10 keywords (watchlist) | Count of tracked terms in Top 10 | GSC + manual | 0/8 | 2/8 by week 4 | CMO | Pending input |
| Organic sessions | Sessions with organic medium | GA4 | Pending confirmed baseline | +20% vs baseline by week 4 | CMO | Pending input |
| AdSense RPM | Revenue per 1,000 sessions | AdSense + GA4 | Pending | Establish baseline + +10% by week 4 | CMO | Pending input |

- GSC weighted average position: Pending input
- Organic sessions source rows: 0
- AdSense revenue: Pending input

## Telemetry Schema Health (CAL-71)

| Telemetry metric | Source | Status |
| --- | --- | --- |
| Indexed URLs | expected_sitemap_routes | ok |
| Impressions/Clicks/CTR | missing | pending_input |
| Organic sessions | missing_ga4_organic_csv | pending_input |
| AdSense RPM | missing | pending_input |
| Watchlist position | missing | pending_input |

### Fallback Events
- organic_sessions: pending_input (GA4 organic CSV not provided)
- adsense_rpm: pending_input (AdSense CSV input not provided)
- avg_position_watchlist: pending_input (Watchlist and GSC inputs are both unavailable)
- gsc_core_metrics: pending_input (GSC query/page CSV inputs were not provided)
- first_party_api_ingestion: csv_fallback (Missing pipeline env vars: GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN, GA4_PROPERTY_ID, GSC_SITE_URL, ADSENSE_ACCOUNT_ID)

### Residual Dependencies
- [CAL-16](/CAL/issues/CAL-16): Production GA4/GSC/AdSense API credential access (First-party API ingestion automation remains unavailable; CSV fallback continues.)

## GSC Top Queries (by clicks)

- No data provided.

## GSC Top Pages (by clicks)

- No data provided.

## Watchlist Snapshot

- No watchlist input provided.

## Notes
- This export keeps the CAL-23 KPI schema stable while adding current-week values and normalized index-target metadata.
- Full automation of first-party API pulls depends on production credential access tracked in [CAL-16](/CAL/issues/CAL-16).
- Fallback behavior is explicit: each degraded metric is listed in "Fallback Events" and mirrored in the telemetry JSON artifact.
- Re-run this script weekly after refreshing CSV exports from GSC, GA4, and AdSense.
