# CAL-174 Google Removal/Deindex Evidence Pack (2026-04-19 07:37 ICT)

Issue: [CAL-174](/CAL/issues/CAL-174)  
Dependency hotfix: [CAL-172](/CAL/issues/CAL-172) (`done`)

Raw probe artifact:
- `reports/cal-174-google-deindex-checks-2026-04-19T07-34-04+07-00.json`

## 1) Before Proof (Incident State)

Source evidence from incident/hotfix lane:
- [CAL-172 comment 642d293e](/CAL/issues/CAL-172#comment-642d293e-b932-431f-b7e5-435a7ed6637d) captured leaked markers on public page:
  - `Last updated: 2026-04-15`
  - `Methodology note: ...`
- Before screenshot attachment on CAL-172: `069eeb7c-48ba-46ee-bc1b-dd641a70a754` (`cal172-before-home-board.png`)

## 2) After Proof (Current Recheck, 2026-04-19 07:37 ICT)

Affected URL scope rechecked on both hosts:
- `https://calculator-thailand-production.up.railway.app`
- `https://www.kamnuanlek.com`
- Paths: `/`, `/คำนวณผ่อนรถ/`, `/คำนวณผ่อนบ้าน/`, `/คำนวณภาษีมูลค่าเพิ่ม/`, `/คำนวณภาษีเงินได้บุคคลธรรมดา/`

Current result summary:
- 10/10 requests returned HTTP `200`
- 10/10 pages: `Last updated:` not found
- 10/10 pages: `Methodology note:` not found
- 10/10 pages: leak date marker `2026-04-15` not found
- 10/10 pages include `<meta name="robots" content="index, follow">`

## 3) Internal Artifact Exposure Check

Production host probes:
- `/plans/`, `/reports/`, `/memory/`, `/.tmp/`, `/scripts/`, `/.git/`, `/.astro/`, `/node_modules/`, `/foo-internal-note-bar`

Current result summary:
- 9/9 probes return blocked response (`404`)
- No internal content rendered in response body

Important discrepancy found (risk):
- Live `404` responses currently do **not** expose `X-Robots-Tag` header.
- Live `robots.txt` currently differs from repo baseline (`public/robots.txt`) and does not include internal-path `Disallow` directives from source.

## 4) Google Surface Probes

Probes executed:
- `site:calculator-thailand-production.up.railway.app "Methodology note"`
- `site:calculator-thailand-production.up.railway.app "Last updated" "2026-04-15"`
- `webcache.googleusercontent` cache probe for production homepage

Observed in this run:
- 3/3 probes returned HTTP `200`
- Leak phrases `Last updated:` and `Methodology note:` absent in returned payload
- 3/3 probe payloads are Google anti-automation/interstitial responses in this runtime (not stable SERP/cache render output)
- One SERP payload echoes query-string text containing `2026-04-15` in script markup, so authenticated GSC confirmation is still required for deterministic closure evidence

## 5) Removal/Deindex Request-ID Ledger

Current authenticated execution state:
- [CAL-260](/CAL/issues/CAL-260) (`Board Action: Execute GSC removals and recrawl for leak cleanup`) is still `todo`
- No GSC removal/recrawl request IDs are present in CAL-174 thread

Missing fields required to reconcile removal execution:
1. Removal/deindex request IDs (per affected URL/query)
2. Submission timestamps (ICT)
3. URL/query mapping per request
4. Any GSC rejection/error payloads

## 6) Remaining Risk List

1. **Authenticated proof risk:** without CAL-260 request IDs/timestamps, removal/deindex execution cannot be fully evidenced.
2. **Cache-lag risk:** Google cache/snippet persistence may continue temporarily despite clean live pages.
3. **Crawl-control parity risk:** live `robots.txt` and missing `X-Robots-Tag` behavior do not match current repo hardening baseline, reducing confidence in deindex enforcement resilience.

## 7) Escalation Trigger Status

Escalation required now:
- CAL-260 is still `todo` (no authenticated GSC payload yet).
- Production crawl-control parity mismatch (headers/robots baseline) should be treated as a trust-signal risk until reconciled.

Escalate immediately if any of these occur:
- Any GSC removal/recrawl submission fails.
- Leak phrases reappear in SERP/cache snippets.
- Cache persists beyond expected recrawl window after CAL-260 submissions.
