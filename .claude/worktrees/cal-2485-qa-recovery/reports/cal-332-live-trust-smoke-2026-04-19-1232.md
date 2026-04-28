# CAL-332 Live-Site Trust Smoke Check (Dispatch Revived)

- Run window (ICT): 2026-04-19 12:20-12:32
- Agent: Release QA Engineer Alpha
- Scope source: revived dispatch comment `03eafb4e-9235-45f6-9617-108316c9b0d0`
- Parent dispatch: [CAL-341](/CAL/issues/CAL-341)
- Escalation chain: CTO

## Verdict

FAIL (custom-domain trust and release integrity remain unhealthy)

## Critical Defects (Release Blockers)

1. Apex custom domain is still unavailable.
   - `https://kamnuanlek.com/` -> timeout/unreachable (`fetch failed`)
   - `https://kamnuanlek.com/__release` -> timeout/unreachable (`fetch failed`)
   - Apex visual matrix failed `12/12` (desktop + mobile across required route set)
   - Recommended owner: [CAL-197](/CAL/issues/CAL-197)

2. Release attestation endpoint `/__release` is still unavailable on active release hosts.
   - `https://www.kamnuanlek.com/__release` -> `404`
   - `https://calculator-thailand-production.up.railway.app/__release` -> `404`
   - `verify-railway-release` timed out at `45s` on both hosts (`ExitCode: 1` each)
   - Expected SHA checked: `cd6486339ca6382aeab2cf26a17f221e851a3083`
   - Recommended owner: [CAL-197](/CAL/issues/CAL-197)

3. Transfer-fee calculator route remains broken on live hosts.
   - Route: `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
   - `www` status: `404`
   - Railway status: `404`
   - Recommended owner: [CAL-273](/CAL/issues/CAL-273)

4. Calculator route inventory drift is still unresolved.
   - Local calculator routes: `14`
   - Live calculator routes in sitemap: `17`
   - Missing from live sitemap: `1`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
   - Extra on live sitemap: `4`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B9%80%E0%B8%99%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%89%E0%B8%B3/`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%AD%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%81%E0%B9%80%E0%B8%9B%E0%B8%A5%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%99/`
     - `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%81%E0%B8%A9%E0%B8%B5%E0%B8%A2%E0%B8%93/`
   - Recommended owner: [CAL-273](/CAL/issues/CAL-273)

## User-Visible Readability Defects (High Risk, Non-Blocking)

1. Dark-mode readability failures persist across sampled homepage/calculator/article routes.
   - Viewports: desktop + mobile
   - Mode: dark
   - Selectors: `main h1`, `main h2`, `main p`
   - Minimum measured ratio: `1.05` (< 4.5)

2. Thai mojibake scan passed on sampled content surfaces.
   - Result: no mojibake patterns detected

## Passed Checks

1. Local functional + edge regression passed.
   - Result: `53/53` tests passed

2. Thai formula validation passed.
   - Domains covered: Revenue Department, BOT, SSO, Land Department, MEA/PEA
   - Result: `8/8` scenarios passed

3. `www` visual matrix passed for required route scope.
   - Result: `12/12` captures completed

## Evidence Artifacts

- `reports/cal-332-local-regression-2026-04-19-1220.txt`
- `reports/cal-332-thai-formula-validation-2026-04-19T05-20-49Z.json`
- `reports/cal-332-http-smoke-2026-04-19T05-21-44Z.json`
- `reports/cal-332-route-inventory-2026-04-19T05-22-19Z.json`
- `reports/cal-332-release-gate-verify-2026-04-19-1220.txt`
- `reports/cal-332-live-visual-www-2026-04-19-1220/manifest.json`
- `reports/cal-332-live-visual-apex-2026-04-19-1220/manifest.json`
- `reports/cal-332-live-visual-apex-2026-04-19-1220.log.txt`
- `reports/cal-332-contrast-mojibake-2026-04-19T05-29-08Z/contrast-mojibake-report.json`
- `reports/cal-332-contrast-fail-details-2026-04-19T05-29-08Z.json`
