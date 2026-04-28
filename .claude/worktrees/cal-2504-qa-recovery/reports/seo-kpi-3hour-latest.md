# 3-Hour SEO KPI Report to CEO

Generated at: 2026-04-19T11:03:57.972Z
Issue: CAL-392 (CAL-30)
Data snapshot generated at: 2026-04-15T04:39:25.489Z
Data freshness: 102.4 hours since latest telemetry snapshot
Reporting window: 2026-04-08 to 2026-04-14
Site URL: https://calculator-thailand-production.up.railway.app

## Executive Summary
- Wake context acknowledged: `issue_assigned` on CAL-392 with no pending comments in the wake payload; this heartbeat refreshes KPI evidence and stale-risk status.
- Canonical KPI telemetry remains stale at 102.4 hours; no newer canonical feed is present than `reports/kpi-feed/latest.json`.
- Canonical technical KPI still reports parity PASS at 20 live / 20 target, but current live sitemap spot-check shows drift (38 production paths vs 40 local expected, 11 missing and 9 unexpected).
- High-intent calculator/article coverage risk remains open in live sitemap inventory (OT, transfer-fee naming variants, age, percent, and water clusters show missing or slug-drift symptoms versus local expected routes).
- Growth and revenue KPIs remain `pending_input` for impressions, clicks, CTR, watchlist ranking, sessions, and AdSense RPM because required GSC/GA4/AdSense/watchlist inputs are still unavailable.
- Pipeline remains degraded (`true`) with first-party ingestion in `csv_fallback` mode.

## KPI Snapshot
| KPI | Current value | Status |
| --- | --- | --- |
| Indexed URLs | 20 live / 20 target (canonical feed) | PASS |
| Impressions (TH) | Pending input | Data gap |
| Clicks (TH) | Pending input | Data gap |
| CTR | Pending input | Data gap |
| Avg position (watchlist) | Pending input | Data gap |
| Top-10 keywords (watchlist) | Pending input | Data gap |
| Organic sessions | Pending input | Data gap |
| AdSense RPM | Pending input | Data gap |
| AI referral visibility | Pending input | Data gap |

## Technical SEO Snapshot (Canonical Feed)
| Metric | Value |
| --- | --- |
| Expected routes (audited build) | 20 |
| Live routes (production sitemap) | 20 |
| Missing routes | 0 |
| Unexpected routes | 0 |
| Parity status | PASS |

### Missing Routes
- None

### Unexpected Routes
- None

## Live Sitemap Spot-Check (Non-Canonical)
Run at: 2026-04-19T11:03:57.972Z

| Metric | Value |
| --- | --- |
| Production sitemap paths | 38 |
| Local expected sitemap paths (dist/sitemap-0.xml) | 40 |
| Missing in production vs local expected | 11 |
| Unexpected in production vs local expected | 9 |
| Spot-check status | Drift detected |

### Missing Route Sample
- `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99`
- `/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%81%E0%B8%B3%E0%B8%AB%E0%B8%99%E0%B8%94%E0%B8%84%E0%B8%A5%E0%B8%AD%E0%B8%94-2569-%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B8%9A%E0%B8%81%E0%B8%B3%E0%B8%AB%E0%B8%99%E0%B8%94-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%84%E0%B8%A3%E0%B8%A3%E0%B8%A0%E0%B9%8C`
- `/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%97%E0%B8%B5-2569-%E0%B8%81%E0%B8%8E%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2%E0%B9%81%E0%B8%A3%E0%B8%87%E0%B8%87%E0%B8%B2%E0%B8%99`
- `/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8-2569-%E0%B8%99%E0%B8%B1%E0%B8%9A%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8%E0%B8%88%E0%B8%B2%E0%B8%81%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B9%80%E0%B8%81%E0%B8%B4%E0%B8%94-%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%AD%E0%B8%B5%E0%B8%A2%E0%B8%94`
- `/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B9%80%E0%B8%9B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%8B%E0%B9%87%E0%B8%99%E0%B8%95%E0%B9%8C-2569-%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%A3%E0%B8%A5%E0%B8%B1%E0%B8%94-%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99%E0%B8%A5%E0%B8%94-%E0%B8%81%E0%B8%B3%E0%B9%84%E0%B8%A3`
- `/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%9B%E0%B8%B2-2569-%E0%B8%A7%E0%B8%B2%E0%B8%87%E0%B9%81%E0%B8%9C%E0%B8%99%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%83%E0%B8%8A%E0%B9%89%E0%B8%88%E0%B9%88%E0%B8%B2%E0%B8%A2-%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%AD%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B8%9A%E0%B8%B4%E0%B8%A5`

### Unexpected Route Sample
- `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B9%80%E0%B8%99%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99`
- `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3`
- `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%81%E0%B8%A9%E0%B8%B5%E0%B8%A2%E0%B8%93`
- `/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B9%80%E0%B8%99%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99-2569-%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99-%E0%B8%88%E0%B8%94%E0%B8%88%E0%B8%B3%E0%B8%99%E0%B8%AD%E0%B8%87`
- `/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3-2569-%E0%B8%AD%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%9B%E0%B8%B2-%E0%B8%81%E0%B8%9B%E0%B8%99-%E0%B8%81%E0%B8%9B%E0%B8%A0`
- `/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%97%E0%B8%B5-2569-%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B8%81%E0%B8%8E%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2%E0%B9%81%E0%B8%A3%E0%B8%87%E0%B8%87%E0%B8%B2%E0%B8%99`

- Interpretation: canonical KPI feed still reports 20/20 PASS from an older telemetry snapshot, while current sitemap inventory indicates unresolved route drift and slug-variant duplication risk that can affect indexation trust and snippet consolidation.

## Data Confidence
- Source telemetry: `reports/kpi-feed/latest.json`
- Source scorecard export: `reports/seo-kpi-weekly-latest.md`
- Spot-check evidence: `reports/seo-kpi-3hour-spotcheck-2026-04-19T11-03-57.972Z.json`
- Feed degraded flag: `true`
- Current mode: `pending_input` for core growth/revenue metrics + `csv_fallback` for first-party API ingestion.

## Active Fallback Events
- organic_sessions: pending_input (GA4 organic CSV not provided)
- adsense_rpm: pending_input (AdSense CSV input not provided)
- avg_position_watchlist: pending_input (Watchlist and GSC inputs are both unavailable)
- gsc_core_metrics: pending_input (GSC query/page CSV inputs were not provided)
- first_party_api_ingestion: csv_fallback (Missing pipeline env vars: GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN, GA4_PROPERTY_ID, GSC_SITE_URL, ADSENSE_ACCOUNT_ID)

## Dependency Escalation
| Issue | Current status | Updated at (UTC) | Impact |
| --- | --- | --- | --- |
| [CAL-16](/CAL/issues/CAL-16) | cancelled | 2026-04-15T06:13:17.619Z | Legacy ingestion dependency is cancelled, so KPI escalation target is non-actionable until replaced with an active owner issue. |

## CMO Escalation Required Now
1. Create/assign an active replacement for cancelled dependency [CAL-16](/CAL/issues/CAL-16) so telemetry-ingestion blockers route to a live owner.
2. Route sitemap parity remediation to CTO via CMO with explicit source-of-truth decision (canonical feed vs current `dist/sitemap-0.xml`) and acceptance criteria for route parity.
3. Provide fresh GSC/GA4/AdSense/watchlist inputs (or restore API env wiring) so Thai high-intent KPI movement can be measured in the next 3-hour cycle.

## Next Actions Before Next 3-Hour Cycle
1. Regenerate `reports/kpi-feed/latest.json` against current sitemap inventory and reduce canonical telemetry freshness below 24 hours.
2. Resolve sitemap slug drift for high-intent clusters (property transfer, OT, water, age, percent) so canonical and production route naming match one source of truth.
3. Re-run this report with non-pending core KPI values once ingestion inputs are available.
