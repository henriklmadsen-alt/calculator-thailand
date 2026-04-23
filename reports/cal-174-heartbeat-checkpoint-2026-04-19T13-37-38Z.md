# CAL-174 heartbeat checkpoint (2026-04-19 13:37 UTC)

Issue: [CAL-174](/CAL/issues/CAL-174)
Dependencies: [CAL-260](/CAL/issues/CAL-260) `blocked`, upstream blocker [CAL-354](/CAL/issues/CAL-354) `todo`
Raw artifact: `reports/cal-174-heartbeat-verification-2026-04-19T13-37-38Z.json`

## Current leak-remediation verification

Affected URL sample checked on both hosts:
- `https://www.kamnuanlek.com`
- `https://calculator-thailand-production.up.railway.app`
- Paths: `/`, `/คำนวณผ่อนรถ/`, `/คำนวณผ่อนบ้าน/`, `/คำนวณภาษีมูลค่าเพิ่ม/`, `/คำนวณภาษีเงินได้บุคคลธรรมดา/`

Results:
- 10/10 sampled pages returned HTTP `200`
- 10/10 sampled pages were free of `Last updated:`, `Methodology note:`, and `2026-04-15`
- 10/10 sampled pages still canonicalize to `https://calculator-thailand-production.up.railway.app/...`
- All sampled pages still expose `<meta name="robots" content="index, follow">`

## Internal artifact probe results

Probed paths on both hosts:
- `/plans/`, `/reports/`, `/memory/`, `/.tmp/`, `/scripts/`, `/.git/`, `/.astro/`, `/node_modules/`, `/foo-internal-note-bar`, `/__release`

Results:
- 20/20 probes returned HTTP `404`
- 20/20 probes still lacked `X-Robots-Tag`
- `0`/20 blocked responses showed leak markers

## Live crawl-control / trust-signal gaps still open

1. Cross-domain canonical mismatch remains live on the custom domain.
2. Both live `robots.txt` surfaces still serve railway-host sitemap entries:
   - `Sitemap: https://calculator-thailand-production.up.railway.app/sitemap-index.xml`
   - `Sitemap: https://calculator-thailand-production.up.railway.app/sitemap.xml`
3. Live `robots.txt` still lacks repo-baseline internal-path `Disallow` rules.
4. Live `/__release` still returns `404` on both hosts, so deployed commit/release cannot be tied back to the hardened workspace.
5. Live blocked responses still do not emit `X-Robots-Tag`, despite local remediation tests passing.

## Google surface probe status

Unauthenticated probes executed:
- `site:calculator-thailand-production.up.railway.app "Methodology note"`
- `site:calculator-thailand-production.up.railway.app "Last updated" "2026-04-15"`
- `cache:https://calculator-thailand-production.up.railway.app/`

Observed:
- Google still returned anti-automation / CAPTCHA signals on all 3 probes in this runtime.
- Leak strings were not deterministically visible in returned payloads.
- One anti-bot response payload still contained `2026-04-15`, which is not sufficient authenticated proof of indexed leak retention or removal completion.

## Local source validation

Command:
- `node scripts/server-seo-remediation.test.mjs`

Result:
- PASS (`5/5` tests)
- Local server expectations still require blocked-path noindex behavior, a live `/__release` noindex endpoint, and redirect away from the legacy railway host.

## Blocking reason

CAL-174 is still not closable.

Required external evidence is still missing from the GSC lane:
1. removal request IDs
2. recrawl request confirmations/timestamps
3. sitemap resubmission confirmation
4. rejection/error payloads

Because [CAL-260](/CAL/issues/CAL-260) remains `blocked` by [CAL-354](/CAL/issues/CAL-354) and live deploy/runtime parity is still broken, CAL-174 should remain `blocked` until both conditions are cleared.
