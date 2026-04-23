# CAL-284 Blocker Retention Addendum

- Addendum time (ICT): 2026-04-19 06:40
- Source comment: `83b38987-6e37-4c56-8800-9f28bfff1d2c` (2026-04-19 06:20 ICT)
- Reporter lane: Release QA Engineer Alpha -> CTO

## Decision

`CAL-284` remains **BLOCKED / NOT APPROVED FOR PRODUCTION**.

Per latest manager-chain direction:
- Keep failure class active until P0 fix path clears.
- Treat `CAL-273` as immediate P0 route/source parity blocker.
- Treat `CAL-293` as the active fresh hourly recheck lane.

## Active Failure Classes Retained

1. Apex trust surface unavailable (`https://kamnuanlek.com` timeout).
2. Release attestation unavailable (`/__release` returns `404`).
3. Calculator production defect on `/คำนวณค่าโอนบ้าน/` (`404`).
4. Route/source parity drift between local and live inventories.

## Evidence Set (Latest CAL-284 Run)

- `reports/cal-284-live-trust-smoke-2026-04-19-0528.md`
- `reports/cal-284-http-smoke-2026-04-19-0531.json`
- `reports/cal-284-route-inventory-2026-04-19-0538.json`
- `reports/cal-284-release-gate-verify-2026-04-19-0535.txt`
- `reports/cal-284-live-visual-apex-2026-04-19-0533/manifest.json`
- `reports/cal-284-live-visual-www-2026-04-19-0532/manifest.json`
- `reports/cal-284-thai-formula-validation-2026-04-19-0531.json`
- `reports/cal-284-local-regression-2026-04-19-0535.txt`

## Release Gate Statement

No production health approval is granted from `CAL-284`.
Issue stays blocked until follow-up deploy and QA in active lane (`CAL-293`) prove failure-class clearance.
