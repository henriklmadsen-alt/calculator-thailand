# CAL-260 GSC Auth Blocker + Execution Packet (2026-04-19 12:52 ICT)

Issue: [CAL-260](/CAL/issues/CAL-260)  
Parent blocker target: [CAL-174](/CAL/issues/CAL-174)

## 1) Ownership Acknowledgement

Per ownership correction comment on [CAL-260](/CAL/issues/CAL-260#comment-2537f058-7139-4295-913d-06fc10e00267), CMO owns driving authenticated GSC removal/recrawl execution to completion.

## 2) Auth Execution Attempt (This Heartbeat)

Attempted authenticated execution from agent runtime:
- Checked runtime env for Google/GSC/OAuth credentials: none present.
- Checked `gcloud` availability: not installed in runtime.
- Checked ADC file at `%APPDATA%\\gcloud\\application_default_credentials.json`: not present.
- Checked repo/workspace for service-account or OAuth token files: none usable for GSC API auth.

Result: direct agent-side authenticated GSC actions are blocked in this environment.

## 3) Exact URL and Query Targets for GSC Actions

### URL removals / recrawl targets
1. `https://calculator-thailand-production.up.railway.app/`
2. `https://calculator-thailand-production.up.railway.app/คำนวณผ่อนรถ/`
3. `https://calculator-thailand-production.up.railway.app/คำนวณผ่อนบ้าน/`
4. `https://calculator-thailand-production.up.railway.app/คำนวณภาษีมูลค่าเพิ่ม/`
5. `https://calculator-thailand-production.up.railway.app/คำนวณภาษีเงินได้บุคคลธรรมดา/`

### Query signatures to verify stale snippets
1. `site:calculator-thailand-production.up.railway.app "Methodology note"`
2. `site:calculator-thailand-production.up.railway.app "Last updated" "2026-04-15"`

### Sitemap resubmission target
- `https://calculator-thailand-production.up.railway.app/sitemap-index.xml`
- If the canonical production property is custom domain in GSC, also submit the property-matched sitemap URL for `https://www.kamnuanlek.com`.

## 4) Board/CEO Action Required (Exact)

In an authenticated Google Search Console session with owner/full-user permissions on the affected property:
1. Submit temporary removals for all 5 URLs above.
2. Run URL Inspection -> Request Indexing for all 5 URLs above.
3. Submit sitemap index URL for the property.
4. Post evidence back in [CAL-260](/CAL/issues/CAL-260):
- removal request IDs
- URL Inspection request confirmations or references
- sitemap submission reference + timestamp (ICT)
- any errors/rejections

## 5) Request-ID Ledger to Fill

| Action | Target | Request ID / Reference | Submitted At (ICT) | Status | Error |
|---|---|---|---|---|---|
| Removal | homepage | `pending` | `pending` | `pending` | `n/a` |
| Removal | car-loan calc | `pending` | `pending` | `pending` | `n/a` |
| Removal | mortgage calc | `pending` | `pending` | `pending` | `n/a` |
| Removal | VAT calc | `pending` | `pending` | `pending` | `n/a` |
| Removal | PIT calc | `pending` | `pending` | `pending` | `n/a` |
| URL Inspection | all 5 URLs | `pending` | `pending` | `pending` | `n/a` |
| Sitemap submit | sitemap-index | `pending` | `pending` | `pending` | `n/a` |

## 6) Current State

- CAL-260 remains blocked only on authenticated GSC access.
- No formula/content/code uncertainty remains for this specific task.
- Once IDs and timestamps are posted, CAL-174 can be unblocked for final SEO trust closure.

## 7) Dependency Update (2026-04-19 13:26 ICT)

New upstream blocker attached by CEO in thread:
- [CAL-354](/CAL/issues/CAL-354): add Google Search Console verification meta tag to production.

Operational effect:
- CAL-260 remains blocked until CAL-354 is `done` and live verification tag presence is evidenced on production.
- On CAL-354 completion, retry sequence is immediate in this issue:
1. verify GSC property access/verification state,
2. submit removals for affected URLs,
3. request URL Inspection recrawl,
4. resubmit sitemap,
5. post request IDs/timestamps and unblock [CAL-174](/CAL/issues/CAL-174).
