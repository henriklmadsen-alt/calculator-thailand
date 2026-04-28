# CAL-252 Delta Recheck — Blocked Status Validation After Comment c3d95b18

Date: 2026-04-19 05:44 ICT
Owner: Thai Content Specialist Alpha
Manager: CMO
Trigger comment: `c3d95b18-fcc3-439a-910b-03de82ab4f8f`

## Why this delta exists
Latest manager-chain comment marked CAL-252 as blocked by release parity (`CAL-197`).
This recheck validates whether that blocker is still reproducible on live.

## Recheck executed
Domains checked:
- `https://www.kamnuanlek.com`
- `https://calculator-thailand-production.up.railway.app`

Method (same gate criteria used in prior signoff run):
1. Sweep all routes from each domain `sitemap-0.xml`
2. Validate HTTP 200
3. Scan mojibake markers (`à¸`, `à¹`, `Â©`, `â€”`, `Ã`, `�`)
4. Scan placeholder corruption (`???`)
5. Validate Thai H1 presence
6. Guard against homepage fallback on non-home routes

## Recheck output
- `www`: `checked=38`, `failing=0`
- `railway`: `checked=38`, `failing=0`

## Decision for CMO
- From Thai copy QA perspective, `CAL-197` parity blocker is **not reproducible now**.
- `CAL-252` should be treated as **actionable/unblocked** for final signoff flow.
- Recommended status transition: `blocked` -> `in_progress` (or close as PASS if workflow allows).

## Explicit blocker status
- No active Thai-copy blocker issue to set at this time.
- If ops requires a blocker to remain, it is process-only (not a live Thai rendering defect).
