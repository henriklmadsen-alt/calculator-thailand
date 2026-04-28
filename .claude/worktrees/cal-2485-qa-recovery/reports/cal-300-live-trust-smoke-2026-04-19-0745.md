# CAL-300 Live-Site Trust Smoke Check

- Run window (ICT): 2026-04-19 07:29-07:45
- Agent: Release QA Engineer Alpha
- Scope source: CAL-300 hourly live-site trust smoke check 2026-04-19 07:26 ICT
- Retest scope from CAL-293: apex availability, `/__release`, transfer-fee `404`, route inventory drift

## Verdict

FAIL (release trust is not healthy)

## Critical Defects (Release Blockers)

1. Apex hostname `https://kamnuanlek.com` is still unavailable.
   - `https://kamnuanlek.com/` timed out at 20s.
   - `https://kamnuanlek.com/__release` timed out at 20s.
   - Ownership route: CAL-197 (deployment/infrastructure trust surface).

2. Release attestation endpoint `/__release` is still unavailable on active release hosts.
   - `https://www.kamnuanlek.com/__release` => `404`.
   - `https://calculator-thailand-production.up.railway.app/__release` => `404`.
   - `verify-railway-release` timed out (90s) on both hosts because `/__release` never returned metadata.
   - Ownership route: CAL-197.

3. Transfer-fee calculator route remains broken.
   - Route: `/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/`
   - `https://www.kamnuanlek.com/...` => `404`.
   - `https://calculator-thailand-production.up.railway.app/...` => `404`.
   - Ownership route: CAL-273 (calculator route and content parity lane).

4. Live/source calculator inventory drift is unresolved.
   - Local calculator routes: `14`
   - Live calculator routes (sitemap): `17`
   - Missing from live: `/คำนวณค่าโอนบ้าน/`
   - Extra on live:
     - `/คำนวณเงินเกษียณ/`
     - `/คำนวณค่าธรรมเนียมโอนบ้าน/`
     - `/คำนวณค่าน้ำ/`
     - `/คำนวณอัตราแลกเปลี่ยน/`
   - Ownership route: CAL-273.

## Passed Checks

1. `www` trust surface availability is up for non-failed baseline routes in this probe.
   - `/` => `200`
   - `/คำนวณค่าไฟฟ้า/` => `200`
   - `/คำนวณเงินเดือนสุทธิ/` => `200`
2. Railway baseline availability is up for non-failed baseline routes in this probe.
   - `/` => `200`
   - `/คำนวณค่าไฟฟ้า/` => `200`

## Evidence

- `reports/cal-300-http-smoke-2026-04-19-0733.json`
- `reports/cal-300-release-gate-verify-2026-04-19-0742.txt`
- `reports/cal-300-route-inventory-2026-04-19-0744.json`

