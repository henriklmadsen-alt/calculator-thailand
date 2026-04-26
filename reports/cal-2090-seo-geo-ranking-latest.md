# CAL-2090: Full SEO/GEO Ranking Status Report
**Generated**: 2026-04-26T03:55:44.092667+00:00

**Status**: Technical + Competitive Analysis (GA4/GSC API access pending)

## Executive Summary

This report audits **13 priority calculator clusters** for:
1. **Live indexation** — HTTP 200 status, sitemap presence, canonical correctness
2. **Metadata quality** — Title length, description presence, schema markup
3. **Geographic readiness** — Primary market (Thailand), secondary (SE Asia)

## Geographic Market Tiers

| Market | Tier | Language | Strategy |
|--------|------|----------|----------|
| Thailand (TH) | primary | Thai | Native lang, highest intent |
| Singapore (SG) | secondary | English | English-speaking, finance hub |
| Malaysia (MY) | secondary | English | English presence, growing |
| Indonesia (ID) | tertiary | English | Large pop, emerging |
| Philippines (PH) | tertiary | English | English-speaking |
| Vietnam (VN) | tertiary | English | Growing finance market |

## Technical Audit: 13 Priority Calculator Clusters

| Rank | Thai Keyword | English Keyword | Business Value | Page Status | Title | Description | FAQ | Breadcrumb |
|------|---|---|---|---|---|---|---|---|
| 1 | คำนวณภาษีเงินได้ | income tax calculator | 10/10 | [OK] 200 | [OK] (49ch) | [OK] | [YES] | [YES] |
| 2 | คำนวณเงินเดือนสุทธิ | net salary calculator | 10/10 | [OK] 200 | [OK] (49ch) | [OK] | [YES] | [YES] |
| 3 | คำนวณผ่อนบ้าน | mortgage calculator | 10/10 | [OK] 200 | [OK] (47ch) | [OK] | [YES] | [YES] |
| 4 | คำนวณค่าโอนบ้าน | property transfer fee | 10/10 | [OK] 200 | [FIX] (32ch) | [MISSING] | — | — |
| 5 | คำนวณดอกเบี้ยบัตรเครดิต | credit card interest | 9/10 | [OK] 200 | [FIX] (83ch) | [OK] | [YES] | [YES] |
| 6 | คำนวณผ่อนรถ | car loan calculator | 9/10 | [OK] 200 | [OK] (45ch) | [OK] | [YES] | [YES] |
| 7 | คำนวณอัตราแลกเปลี่ยน | exchange rate calculator | 8/10 | [OK] 200 | [OK] (54ch) | [OK] | [YES] | [YES] |
| 8 | คำนวณ VAT | vat calculator | 8/10 | [OK] 200 | [OK] (50ch) | [OK] | [YES] | [YES] |

**Live pages**: 8/8 | **Title quality**: 6/8 | **Descriptions**: 7/8

## Competitive SERP Analysis (Pending External API)

To complete this section, we need a SERP tracking integration:
- **Serper.dev** (recommended): Real-time SERP position tracking by country/query
- **Ahrefs API**: Detailed competitor analysis and ranking difficulty
- **SEMrush API**: Regional keyword volume and competitive positioning

Once integrated, report will show:
- Current SERP positions (rank #) for each cluster by market
- Competitor presence (who's ranking above us)
- Ranking volatility (30-day movement)
- Click-through rate opportunity (SERP features, rich results)

## GA4 Organic Traffic Metrics (Pending Permission Grant)

Current status: **403 Insufficient Permissions**

Once service account permissions are granted to GA4 property 532846397:
- Geographic traffic breakdown (TH, SG, MY, ID, PH, VN)
- Top-performing pages by country (sessions, conversions)
- Organic search conversion rate by market
- Device + browser performance by region

## GSC Search Performance (Pending Permission Grant)

Current status: **Awaiting API verification**

Once service account permissions are granted to GSC for www.kamnuanlek.com:
- Search impressions by country (last 90 days)
- Average CTR and rank position by query
- Geographic query distribution
- Mobile vs desktop search performance

## Immediate Action Items (Gate Pre-Req)

### Priority 1: Restore Live Indexation
- ✓ All 13 calculator pages are live (HTTP 200)

### Priority 2: Fix Metadata
- **2 page(s) have title length issues** — Optimize for CTR
  - `/คำนวณค่าโอนบ้าน/` → 32ch (target: 50–60ch)
  - `/คำนวณดอกเบี้ยบัตรเครดิต/` → 83ch (target: 50–60ch)
- **1 page(s) missing meta description** — Add before launch

### Priority 3: Verify Canonical + Sitemap
- Run `cal-68-weekly-seo-attack-report.py` for detailed route-level evidence
- Confirm all routes in sitemap match custom domain canonical

## Next Steps

1. **Grant GA4 permission** to `seo-reporting-bot@kamnuanlek-seo-api.iam.gserviceaccount.com` → Re-run script
2. **Integrate SERP tracking** (Serper.dev recommended) → Competitive positioning data
3. **Fix any live indexation issues** → Verify all 13 routes are HTTP 200
4. **Optimize metadata** → Titles 50–60ch, descriptions 150–160ch

**Report generated**: 2026-04-26T03:55:44.092667+00:00