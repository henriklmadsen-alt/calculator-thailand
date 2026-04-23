# CAL-174 SEO Remediation Evidence (2026-04-16)

## Scope
Issue: [CAL-174](/CAL/issues/CAL-174)
Parent hotfix: [CAL-172](/CAL/issues/CAL-172)

## Known affected URLs from CAL-172
- https://calculator-thailand-production.up.railway.app/
- https://calculator-thailand-production.up.railway.app/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%A3%E0%B8%96/
- https://calculator-thailand-production.up.railway.app/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/
- https://calculator-thailand-production.up.railway.app/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B8%A1%E0%B8%B9%E0%B8%A5%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%88%E0%B8%A1/
- https://calculator-thailand-production.up.railway.app/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%9A%E0%B8%B8%E0%B8%84%E0%B8%84%E0%B8%A5%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%94%E0%B8%B2/

## Production content verification
Executed live HTTP checks on all affected URLs.

Result summary:
- HTTP status: `200` for all affected URLs.
- Leak strings absent on all affected URLs:
  - `Last updated:` -> not found
  - `Methodology note:` -> not found
- Indexability meta present as expected on public pages:
  - `<meta name="robots" content="index, follow">`

## Internal-route exposure verification
Checked likely internal artifact paths on production:
- `/plans/` -> `404`
- `/reports/` -> `404`
- `/memory/` -> `404`
- `/.tmp/` -> `404`

Production robots baseline observed:
- `https://calculator-thailand-production.up.railway.app/robots.txt` currently advertises
  `Sitemap: https://www.kamnuanlek.com/sitemap-index.xml`

## Search-surface checks (Google)
Attempted automated checks for:
- `site:calculator-thailand-production.up.railway.app "Methodology note"`
- `site:calculator-thailand-production.up.railway.app "Last updated" "2026-04-15"`

Current environment result:
- Google request is blocked in automation context (`429 Too Many Requests` / CAPTCHA).
- No Search Console credentials are available in runtime env to run authenticated URL-removal/sitemap actions.

## Repo hardening shipped in this heartbeat
1. `server.mjs`
- Added hard blocks (`410 Gone`) + `X-Robots-Tag: noindex, nofollow, noarchive` for internal/non-public patterns:
  - `/plans`, `/reports`, `/memory`, `/.tmp`, `/scripts`, `/.git`, `/.astro`, `/node_modules`, and paths containing `internal-note`.
- Added `X-Robots-Tag: noindex, nofollow, noarchive` on `404` responses.
- Added `X-Robots-Tag: noindex, nofollow, noarchive` on `/__release` response.

2. `public/robots.txt`
- Added explicit disallow directives:
  - `/plans/`, `/reports/`, `/memory/`, `/.tmp/`, `/scripts/`, `/node_modules/`, `/.git/`, `/__release`.

Validation:
- `npm run build` passed after changes.

## Manual actions ready for immediate execution (requires GSC access)
1. Submit temporary removals for affected URLs in Google Search Console > Removals.
2. Submit "Outdated content" snippet refresh for each affected URL if stale snippets persist.
3. Resubmit sitemap: `https://calculator-thailand-production.up.railway.app/sitemap-index.xml`.
4. Request recrawl/indexing for affected URLs in URL Inspection.

## Remaining risks
- Until a human-authenticated GSC session submits removals/recrawls, stale Google cache/snippets may persist temporarily even though live pages are now sanitized.
