# CAL-174 heartbeat checkpoint (2026-04-19 18:56 ICT)

Issue: [CAL-174](/CAL/issues/CAL-174)
Dependencies: [CAL-260](/CAL/issues/CAL-260) `blocked`, upstream blocker [CAL-354](/CAL/issues/CAL-354) `todo`
Raw artifact: `reports/cal-174-heartbeat-verification-latest.json`

## Current leak-remediation verification

Affected URL sample checked on both hosts:
- `https://www.kamnuanlek.com`
- `https://calculator-thailand-production.up.railway.app`
- Paths: `/`, `/คำนวณผ่อนรถ/`, `/คำนวณผ่อนบ้าน/`, `/คำนวณภาษีมูลค่าเพิ่ม/`, `/คำนวณภาษีเงินได้บุคคลธรรมดา/`

Results:
- 10/10 sampled pages returned HTTP `200`
- 10/10 sampled pages did not contain `Last updated:`
- 10/10 sampled pages did not contain `Methodology note:`
- 10/10 sampled pages did not contain `2026-04-15`
- 10/10 sampled pages still expose `<meta name="robots" content="index, follow">`

## Internal artifact probe results

Probed paths on both hosts:
- `/plans/`, `/reports/`, `/memory/`, `/.tmp/`, `/scripts/`, `/.git/`, `/.astro/`, `/node_modules/`, `/foo-internal-note-bar`

Results:
- 18/18 probes returned HTTP `404`
- 18/18 response bodies were free of leak markers
- 18/18 responses still lacked `X-Robots-Tag`

## Live crawl-control / trust-signal gaps still open

1. Cross-domain canonical mismatch remains live:
   - all sampled `www.kamnuanlek.com` pages canonicalize to `https://calculator-thailand-production.up.railway.app/...`
2. `robots.txt` still points sitemap to railway host on both surfaces:
   - `Sitemap: https://calculator-thailand-production.up.railway.app/sitemap-index.xml`
   - `Sitemap: https://calculator-thailand-production.up.railway.app/sitemap.xml`
3. Live `robots.txt` still lacks repo-baseline internal-path `Disallow` rules.
4. Live blocked responses still do not emit `X-Robots-Tag`, despite local remediation tests passing.

## Google surface probe status

Unauthenticated probes executed:
- `site:calculator-thailand-production.up.railway.app "Methodology note"`
- `site:calculator-thailand-production.up.railway.app "Last updated" "2026-04-15"`
- `cache:https://calculator-thailand-production.up.railway.app/`

Observed:
- 3/3 probe requests returned HTTP `200`
- `Last updated:` absent from all returned payloads
- `Methodology note:` absent from all returned payloads
- `2026-04-15` still appears in one Google response payload, but this runtime only receives generic Google Search HTML, not deterministic authenticated SERP/cache proof

## Local source validation

Command:
- `node scripts/server-seo-remediation.test.mjs`

Result:
- PASS (`5/5` tests)
- Local server hardening expectation still requires blocked-path noindex behavior and railway-host redirect

## Blocking reason

CAL-174 is not closable yet.

Required external evidence is still missing from the GSC lane:
1. removal request IDs
2. recrawl request confirmations/timestamps
3. sitemap resubmission confirmation
4. any rejection/error payloads

Because [CAL-260](/CAL/issues/CAL-260) is now itself blocked by [CAL-354](/CAL/issues/CAL-354), this issue should remain `blocked` until authenticated GSC execution is possible and live crawl-control parity is restored.
