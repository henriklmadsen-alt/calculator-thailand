# CAL-318 Live-Site Trust Smoke Check

- Run window (ICT): 2026-04-19 09:34-09:50
- Agent: Release QA Engineer Alpha
- Scope source: CAL-318 hourly live-site trust smoke check 2026-04-19 09:28 ICT
- Delta applied: CEO comment `8c79a058-b309-439a-a298-fc771145dc81` (continue QA in dirty workspace, report-only artifacts)

## Verdict

FAIL (release trust is not healthy)

## Critical Defects (Release Blockers)

1. Apex hostname `https://kamnuanlek.com` is unavailable.
   - HTTP smoke:
     - `https://kamnuanlek.com/` -> timeout (`fetch failed`)
     - `https://kamnuanlek.com/__release` -> timeout (`fetch failed`)
   - Visual smoke on apex failed `10/10` captures (desktop+mobile across required routes).
   - Route ownership: [CAL-197](/CAL/issues/CAL-197)

2. Release attestation endpoint `/__release` is unavailable on active release hosts.
   - `https://www.kamnuanlek.com/__release` -> `404`
   - `https://calculator-thailand-production.up.railway.app/__release` -> `404`
   - `verify-railway-release` timed out at `90s` on both hosts.
   - Route ownership: [CAL-197](/CAL/issues/CAL-197)

3. Property-transfer calculator route is broken on production hosts.
   - Route: `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
   - `www` status: `404`
   - Railway status: `404`
   - Route ownership: [CAL-273](/CAL/issues/CAL-273)

4. Live/source calculator inventory drift remains open.
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
   - Route ownership: [CAL-273](/CAL/issues/CAL-273)

## Passed Checks

1. Thai formula validation passed.
   - Domains covered: Revenue Department, BOT, SSO, Land Department, MEA/PEA
   - Result: `8/8` scenarios passed.

2. Local functional/edge regression passed.
   - Result: `49/49` tests passed.

3. `www` visual smoke passed.
   - Required route set captured on desktop+mobile.
   - Result: `10/10` captures passed.

4. Non-blocked baseline route availability passed on `www` and Railway.
   - `/` -> `200`
   - Electricity calculator -> `200`
   - Net salary calculator -> `200`

## Evidence Artifacts

- `reports/cal-318-local-regression-2026-04-19-0934.txt`
- `reports/cal-318-thai-formula-validation-2026-04-19-0937.json`
- `reports/cal-318-http-smoke-2026-04-19-0938.json`
- `reports/cal-318-route-inventory-2026-04-19-0940.json`
- `reports/cal-318-release-gate-verify-2026-04-19-0944.txt`
- `reports/cal-318-live-visual-www-2026-04-19-0947/manifest.json`
- `reports/cal-318-live-visual-apex-2026-04-19-0948/manifest.json`
