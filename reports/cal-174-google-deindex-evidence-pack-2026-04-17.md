# CAL-174 Google Deindex Evidence Pack (2026-04-17 10:42 ICT)

Issue: [CAL-174](/CAL/issues/CAL-174)  
Dependency hotfix: [CAL-172](/CAL/issues/CAL-172) (`done`)

## 1) Before Proof (Incident State)

Source of truth from incident thread:
- [CAL-172 comment 642d293e](/CAL/issues/CAL-172#comment-642d293e-b932-431f-b7e5-435a7ed6637d) documents leaked text visible on public homepage:
  - `Last updated: 2026-04-15`
  - `Methodology note: formulas follow publicly available Thai financial/tax guidance...`

Artifacts attached on [CAL-172](/CAL/issues/CAL-172):
- Before screenshot: attachment `069eeb7c-48ba-46ee-bc1b-dd641a70a754` (`cal172-before-home-board.png`)

## 2) After Proof (Post-Hotfix + Current Recheck)

Post-fix artifacts already attached on [CAL-172](/CAL/issues/CAL-172):
- After screenshot (kamnuanlek): attachment `64947c7b-725e-4a10-aab8-36c0bfc8bfa1`
- After screenshot (railway): attachment `4ba1d765-3f15-4816-9433-95251a4be9e8`
- CTO evidence report attachment: `71acfa79-1dca-4b4d-a68f-4f908c1d4bb6`

Fresh live recheck in this heartbeat (2026-04-17 10:39-10:41 ICT):
- Checked 10 live URLs (5 affected paths across both domains):
  - `https://calculator-thailand-production.up.railway.app/` + 4 affected calculator routes
  - `https://www.kamnuanlek.com/` + same 4 affected calculator routes
- Result:
  - HTTP status: `200` on all checked URLs
  - `Last updated:` marker: not found
  - `Methodology note:` marker: not found
  - `2026-04-15` leak date marker: not found

## 3) Google Surface Probe (Current Run)

Probe URLs:
- `https://www.google.com/search?q=site:calculator-thailand-production.up.railway.app+"Methodology+note"`
- `https://www.google.com/search?q=site:calculator-thailand-production.up.railway.app+"Last+updated"+"2026-04-15"`
- `https://webcache.googleusercontent.com/search?q=cache:https://calculator-thailand-production.up.railway.app/`

Observed in this environment:
- HTTP `200` responses returned for all 3 probes.
- Returned HTML payloads do not include leak phrases (`Methodology note`, `Last updated`) in static body text.
- Responses are JS-driven Google shells in this runtime, so deterministic SERP/cache extraction remains limited without authenticated GSC evidence.

## 4) Request-ID Ledger (Required for Closure)

Current state:
- GSC temporary-removal request IDs: `not posted in CAL-174 thread`
- GSC outdated-snippet refresh request IDs: `not posted in CAL-174 thread`
- GSC sitemap resubmission request/reference IDs: `not posted in CAL-174 thread`
- URL Inspection recrawl request IDs: `not posted in CAL-174 thread`

## 5) Remaining Risks

1. Closure risk: without request IDs/timestamps, we cannot prove submission completion for removals/refresh/recrawl actions.
2. Cache-lag risk: stale Google cache/snippets can persist temporarily even when live HTML is clean.
3. Verification risk: unauthenticated probe pages are not a complete replacement for GSC action logs.

## 6) Escalation Trigger

Escalate immediately if any of these conditions occur:
- A submitted removal/refresh/recrawl request returns an error.
- Leak phrases reappear in any SERP/cache surface.
- Request IDs remain unavailable after execution claim.
