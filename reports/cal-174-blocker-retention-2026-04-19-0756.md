# CAL-174 Blocker Retention Checkpoint (2026-04-19 07:56 ICT)

Issue: [CAL-174](/CAL/issues/CAL-174)  
Dependency blocker: [CAL-260](/CAL/issues/CAL-260) (`todo`, board-owned authenticated GSC actions)

Wake-comment acknowledgement:
- Latest ownership correction confirms CAL-174 remains SEO-owned but should stay `blocked` until CAL-260 evidence exists.
- This checkpoint keeps remediation evidence current and preserves the blocker with exact missing payload fields.

## 1) New Evidence Collected This Heartbeat

Artifacts generated:
- `reports/cal-174-google-deindex-checks-2026-04-19T07-54-38+07-00-utf8.json`

Verification command output:
- `node scripts/server-seo-remediation.test.mjs`
- Result: 5/5 tests passed (blocked paths, internal-note pattern, `__release` noindex, 404 noindex, host redirect)

## 2) Live Surface Findings (Current State)

Public URL sample (`www` + railway host):
- 10/10 requests returned HTTP `200`
- 10/10 pages did not contain `Last updated:`
- 10/10 pages did not contain `Methodology note:`
- 10/10 pages did not contain `2026-04-15`
- 10/10 pages still expose `<meta name="robots" content="index, follow">`

Internal artifact probes on `https://www.kamnuanlek.com`:
- 9/9 probes blocked with HTTP `404` (`/plans/`, `/reports/`, `/memory/`, `/.tmp/`, `/scripts/`, `/.git/`, `/.astro/`, `/node_modules/`, `/foo-internal-note-bar`)
- 0/9 response bodies showed internal leak markers
- 0/9 returned `X-Robots-Tag` header (parity risk vs current server hardening baseline)

## 3) Crawl-Control / Trust-Signal Parity Gaps

`robots.txt` mismatch remains on live surfaces:
- Live robots files do not include `Disallow` directives for internal paths (`/plans/`, `/reports/`, `/memory/`, `/.tmp/`, `/scripts/`, `/node_modules/`, `/.git/`, `/__release`).
- Live robots files still point sitemap to railway host.
- Repo baseline `public/robots.txt` currently points sitemap to `https://www.kamnuanlek.com/sitemap-index.xml` and includes internal-path `Disallow` rules.

Implication:
- Leak text appears remediated on live pages, but crawl-control trust signals are still not aligned with source hardening.

## 4) Google Probe Reality (Unauthenticated)

Probes executed:
- `site:calculator-thailand-production.up.railway.app "Methodology note"`
- `site:calculator-thailand-production.up.railway.app "Last updated" "2026-04-15"`
- `webcache.googleusercontent` cache probe

Observed:
- 3/3 probes returned HTTP `200`
- Leak strings were not present as deterministic leaked snippets
- One SERP payload still contained `2026-04-15` text in the returned document payload, which is not sufficient authenticated proof of deindex/removal completion

## 5) Blocker Ledger (Must Remain Open)

CAL-174 cannot be closed without authenticated CAL-260 payload:
1. GSC removal/deindex request IDs
2. Submission timestamps (ICT)
3. URL/query mapping per request
4. Rejection/error payloads (if any)

## 6) Required Next Actions (Manager Chain Correct)

Escalate to CMO now:
1. Keep CAL-174 in `blocked` until CAL-260 payload is posted.
2. Request board-owned CAL-260 evidence packet (IDs/timestamps/mapping/errors).
3. Route crawl-control parity fix (live robots/header mismatch) to CTO through CMO, because this is technical deployment surface ownership.

Closure gate:
- Do not mark CAL-174 done until both authenticated GSC evidence and crawl-control parity evidence are attached.