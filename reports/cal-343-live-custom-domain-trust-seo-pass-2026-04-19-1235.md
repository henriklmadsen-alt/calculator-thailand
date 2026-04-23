# CAL-343 Live Custom-Domain Trust SEO Pass

- Run window (ICT): 2026-04-19 12:23-12:35
- Issue: [CAL-343](/CAL/issues/CAL-343)
- Scope: homepage + 5 highest-risk live routes from current release lane, plus transfer-fee article spot-check

## Verdict

FAIL (search-visible trust defects remain on live custom-domain surface)

## Tested Routes (Route-Level Findings)

1. `https://www.kamnuanlek.com/`
   - Status: `200`
   - Result: FAIL
   - Findings:
     - `HIGH`: Canonical points to Railway origin (`https://calculator-thailand-production.up.railway.app/`) instead of `https://www.kamnuanlek.com/`.
     - `MEDIUM`: Title length is 68 chars (likely truncation risk in SERP snippets).
   - Owner recommendation: CTO ([CAL-273](/CAL/issues/CAL-273)) for canonical host alignment.

2. `https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
   - Status: `404` (`www`) and `404` (`railway`)
   - Result: FAIL
   - Findings:
     - `CRITICAL`: High-intent calculator route unavailable on both live hosts.
     - `CRITICAL`: No indexable title/meta/H1/canonical (hard SEO loss + user trust loss).
   - Owner recommendation: CTO ([CAL-273](/CAL/issues/CAL-273)) immediate route restore/deploy parity.

3. `https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B9%80%E0%B8%9B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%8B%E0%B9%87%E0%B8%99%E0%B8%95%E0%B9%8C/`
   - Status: `200`
   - Result: FAIL
   - Findings:
     - `HIGH`: Canonical points to Railway origin, not custom domain.
     - `PASS`: H1, meta description, FAQ schema, breadcrumb schema present.
   - Owner recommendation: CTO ([CAL-273](/CAL/issues/CAL-273)).

4. `https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95/`
   - Status: `200`
   - Result: FAIL
   - Findings:
     - `HIGH`: Canonical points to Railway origin, not custom domain.
     - `PASS`: H1, meta description, FAQ schema, breadcrumb schema present.
   - Owner recommendation: CTO ([CAL-273](/CAL/issues/CAL-273)).

5. `https://www.kamnuanlek.com/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95-%E0%B8%84%E0%B8%B4%E0%B8%94%E0%B8%A2%E0%B8%B1%E0%B8%87%E0%B9%84%E0%B8%87-%E0%B8%88%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B8%82%E0%B8%B1%E0%B9%89%E0%B8%99%E0%B8%95%E0%B9%88%E0%B8%B3-2569/`
   - Status: `200`
   - Result: FAIL
   - Findings:
     - `HIGH`: Canonical points to Railway origin.
     - `HIGH`: URL-canonical-sitemap inconsistency:
       - Current URL is in sitemap.
       - Canonical target URL is `200` on both hosts.
       - Canonical target URL is **not** in sitemap.
       - Net effect: duplicate URL set with mixed canonical + sitemap hints.
     - `MEDIUM`: Title length is 69 chars (SERP truncation risk).
   - Owner recommendation: CTO ([CAL-273](/CAL/issues/CAL-273)) + CMO content normalization follow-up after host/canonical correction.

6. `https://www.kamnuanlek.com/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2-2569-%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%A3-pea-mea/`
   - Status: `200`
   - Result: FAIL
   - Findings:
     - `HIGH`: Canonical points to Railway origin.
     - `PASS`: Article schema + breadcrumb + FAQ present; article->calculator links detected.
   - Owner recommendation: CTO ([CAL-273](/CAL/issues/CAL-273)).

7. Spot-check: `https://www.kamnuanlek.com/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99-2569-%E0%B8%A1%E0%B8%B5%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%87-%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%84%E0%B8%A3/`
   - Status: `404` (`www`) and `404` (`railway`)
   - Result: FAIL
   - Findings:
     - `CRITICAL`: Supporting article for transfer-fee cluster is also unavailable.
   - Owner recommendation: CTO ([CAL-273](/CAL/issues/CAL-273)).

## Pass Notes

- No mojibake pattern detected in fetched HTML for audited routes.
- Sampled calculator/article pages generally retain H1 + metadata + FAQ/Breadcrumb schema when route is live (`200`).

## Evidence

- `reports/cal-343-live-seo-audit-2026-04-19-122717.json`
- `reports/cal-343-route-spotchecks-2026-04-19-1229.json`
