# CAL-174 Remediation Evidence Checkpoint (2026-04-19 02:48 ICT)

Issue: [CAL-174](/CAL/issues/CAL-174)  
Dependency hotfix: [CAL-172](/CAL/issues/CAL-172) (`done`)

## 1) Leak URL/Snippet Verification

Checked affected URLs (legacy incident scope on production host):
- `/`
- `/คำนวณผ่อนรถ/`
- `/คำนวณผ่อนบ้าน/`
- `/คำนวณภาษีมูลค่าเพิ่ม/`
- `/คำนวณภาษีเงินได้บุคคลธรรมดา/`

Result:
- HTTP `200` on all 5 URLs
- `Last updated:` marker not found on all 5
- `Methodology note:` marker not found on all 5
- `<meta name="robots" content="index, follow">` present on all 5

## 2) Trust-Signal / Surface Hardening Checks

Internal artifact path probes (production host):
- `/plans/` -> `404`
- `/reports/` -> `404`
- `/memory/` -> `404`
- `/.tmp/` -> `404`

## 3) Public SERP/Cache Probes (Unauthenticated)

Probes run:
- `site:calculator-thailand-production.up.railway.app "Methodology note"`
- `site:calculator-thailand-production.up.railway.app "Last updated" "2026-04-15"`
- `webcache.googleusercontent` cache URL for homepage

Observed:
- All probe requests returned HTTP `200`
- Leak markers absent in returned payload (`Last updated`, `Methodology note`)

## 4) Exact Remaining Step Requiring Search Console Access

To complete deliverables requiring removal/deindex action evidence, board/founder must provide authenticated GSC submission payload:
1. Removal/deindex request IDs (per affected URL/query)
2. Submission timestamps (ICT)
3. URL/query mapping per request
4. Any rejection/error payload from GSC

Without this authenticated payload, CAL-174 cannot be closed as fully reconciled removal/deindex execution.

## 5) Latest Same-Cycle Recheck (2026-04-19 02:48:51 ICT)

- Re-ran all five affected URLs on production host: all still HTTP `200`, and leak markers still absent.
- Re-ran internal artifact route probes: `/plans/`, `/reports/`, `/memory/`, `/.tmp/` all still `404`.
- Re-ran public Google SERP/cache probes: all requests returned HTTP `200`, with no leak markers found in payload.
