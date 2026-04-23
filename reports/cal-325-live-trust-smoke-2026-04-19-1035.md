# CAL-325 Live-Site Trust Smoke Check

- Run window (ICT): 2026-04-19 10:19-10:35
- Agent: Release QA Engineer Alpha
- Scope source: CAL-325 hourly live-site trust smoke check 2026-04-19 10:15 ICT
- Escalation chain: CTO

## Verdict

FAIL (live site is not trust-safe right now)

## Critical Defects (Release Blockers)

1. Apex hostname is still unavailable.
   - URL: `https://kamnuanlek.com/`
   - Result: timeout/unreachable (`fetch failed`), desktop/mobile visual captures failed `10/10`.
   - Severity: critical
   - Recommended owner: [CAL-197](/CAL/issues/CAL-197)

2. Release attestation endpoint `/__release` is unavailable on active release hosts.
   - `https://www.kamnuanlek.com/__release` -> `404`
   - `https://calculator-thailand-production.up.railway.app/__release` -> `404`
   - `verify-railway-release` timed out against expected SHA `cd6486339ca6382aeab2cf26a17f221e851a3083` on both hosts.
   - Severity: critical
   - Recommended owner: [CAL-197](/CAL/issues/CAL-197)

3. Transfer-fee calculator route is still broken on production hosts.
   - Route: `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
   - `www` status: `404`
   - Railway status: `404`
   - Viewports/modes affected: desktop + mobile, light + dark
   - Section: full route unavailable (404 page)
   - Severity: critical
   - Recommended owner: [CAL-273](/CAL/issues/CAL-273)

4. Source/live calculator inventory drift remains open.
   - Local calculator routes: `14`
   - Live calculator routes in sitemap: `12`
   - Missing from live sitemap: `4`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%97%E0%B8%B5/`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2/`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B9%80%E0%B8%9B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B9%80%E0%B8%8B%E0%B9%87%E0%B8%99%E0%B8%95%E0%B9%8C/`
   - Extra on live sitemap: `2`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B9%80%E0%B8%99%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%AD%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%81%E0%B9%80%E0%B8%9B%E0%B8%A5%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%99/`
   - Severity: critical
   - Recommended owner: [CAL-273](/CAL/issues/CAL-273)

## User-Visible Readability Defects (Non-Blocking, But High Risk)

1. Light-mode contrast failures across content surfaces.
   - URL: `https://www.kamnuanlek.com/`
   - Viewports: desktop + mobile
   - Mode: light
   - Selector/section: `main p` (hero/support copy)
   - Measured minimum ratio: `2.03` (< 4.5)
   - Severity: high

2. Light-mode contrast failures on calculator/article headings and body copy.
   - URL: `https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2/`
   - URL: `https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%94%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B8%97%E0%B8%98%E0%B8%B4/`
   - URL: `https://www.kamnuanlek.com/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/`
   - URL: `https://www.kamnuanlek.com/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%94%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B8%97%E0%B8%98%E0%B8%B4-2569-%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%AB%E0%B8%B1%E0%B8%81-%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%81%E0%B8%B1%E0%B8%99%E0%B8%AA%E0%B8%B1%E0%B8%87%E0%B8%84%E0%B8%A1-%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5/`
   - Viewports: desktop + mobile
   - Mode: light
   - Selector/section: `main h1`, `main h2`, `main p` (content headings/body)
   - Measured minimum ratio: `1.18` (< 4.5)
   - Severity: high
   - Recommended owner: [CAL-273](/CAL/issues/CAL-273)

## Passed Checks

1. Thai formula validation passed.
   - Domains: Revenue Department, BOT, SSO, Land Department, MEA/PEA
   - Result: `8/8` scenarios passed.

2. Local functional + edge regression passed.
   - Result: `49/49` tests passed.

3. `www` visual matrix capture completed on required scope.
   - Routes: `/`, `/ads.txt`, electricity calculator, salary calculator, transfer-fee calculator route, article index, salary article
   - Viewports: desktop + mobile
   - Result: `14/14` captures completed.

4. Thai mojibake scan on required sections passed.
   - Scope: header/nav/footer, hero/trust sections, calculator chips/result zones, article headings
   - Result: no mojibake patterns detected in sampled DOM text across desktop/mobile and light/dark combinations.

## CAL-318 Retest Status

- `apex unreachable`: NOT cleared
- `/__release` unavailable on `www` + Railway: NOT cleared
- transfer-fee route `404`: NOT cleared
- route inventory drift: NOT cleared

## Evidence Artifacts

- `reports/cal-325-local-regression-2026-04-19-1019.txt`
- `reports/cal-325-thai-formula-validation-2026-04-19T03-20-57Z.json`
- `reports/cal-325-http-smoke-2026-04-19T03-22-00Z.json`
- `reports/cal-325-route-inventory-2026-04-19T03-23-34Z.json`
- `reports/cal-325-release-gate-verify-2026-04-19-1023.txt`
- `reports/cal-325-live-visual-www-2026-04-19-1025/manifest.json`
- `reports/cal-325-live-visual-apex-2026-04-19-1026/manifest.json`
- `reports/cal-325-live-visual-apex-2026-04-19-1026.log.txt`
- `reports/cal-325-contrast-mojibake-2026-04-19T03-32-31Z/contrast-mojibake-report.json`
- `reports/cal-325-contrast-fail-details-2026-04-19T03-35-46Z.json`
