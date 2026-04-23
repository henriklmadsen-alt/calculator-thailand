# CAL-376 Live Custom-Domain Trust Smoke Check

- Run window (ICT): 2026-04-19 16:22-16:38
- Agent: Release QA Engineer Alpha
- Scope source: CAL-376 hourly live custom-domain trust smoke check - 2026-04-19 16:19 ICT
- Escalation chain: CTO

## Verdict

FAIL (release trust is not healthy)

## Critical Defects (Release Blockers)

1. Apex custom domain remains unreachable.
   - `https://kamnuanlek.com/` -> timeout/unreachable (`This operation was aborted`)
   - `https://kamnuanlek.com/__release` -> timeout/unreachable (`This operation was aborted`)
   - Apex visual matrix failed `12/12` captures (desktop + mobile across required route set)
   - Recommended owner: [CAL-197](/CAL/issues/CAL-197)

2. Release attestation endpoint `/__release` is unavailable on active release hosts.
   - `https://www.kamnuanlek.com/__release` -> `404`
   - `https://calculator-thailand-production.up.railway.app/__release` -> `404`
   - `verify-railway-release` timed out at `45s` on both hosts (`exit_code=1`)
   - Expected SHA checked: `cd6486339ca6382aeab2cf26a17f221e851a3083`
   - Recommended owner: [CAL-197](/CAL/issues/CAL-197)

3. Transfer-fee calculator route remains broken on live hosts.
   - Route: `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
   - `www` status: `404`
   - `Railway` status: `404`
   - Recommended owner: [CAL-273](/CAL/issues/CAL-273)

4. Source/live calculator inventory drift persists.
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

## Passed Checks

1. Local functional + edge regression passed.
   - Result: `42/42` tests passed.

2. Thai formula validation passed.
   - Domains covered: Revenue Department, BOT, SSO, Land Department, MEA/PEA
   - Result: `8/8` scenarios passed.

3. `www` visual matrix passed for required route scope.
   - Result: `12/12` captures completed (desktop + mobile).

## Evidence Artifacts

- `reports/cal-376-local-regression-2026-04-19-1622.txt`
- `reports/cal-376-thai-formula-validation-2026-04-19T09-24-17.691Z.json`
- `reports/cal-376-http-smoke-2026-04-19T09-25-12.910Z.json`
- `reports/cal-376-route-inventory-2026-04-19T09-26-34.666Z.json`
- `reports/cal-376-release-gate-verify-2026-04-19-1626.txt`
- `reports/cal-376-live-visual-www-2026-04-19-1628/manifest.json`
- `reports/cal-376-live-visual-www-2026-04-19-1628.log.txt`
- `reports/cal-376-live-visual-apex-2026-04-19-1629/manifest.json`
- `reports/cal-376-live-visual-apex-2026-04-19-1629.log.txt`
