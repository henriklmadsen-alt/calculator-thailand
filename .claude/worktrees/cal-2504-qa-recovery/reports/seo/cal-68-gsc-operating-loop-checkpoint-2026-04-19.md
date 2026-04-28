# CAL-68 GSC Operating Loop Checkpoint (2026-04-19)

## Scope
- Domain checked: `https://www.kamnuanlek.com/`
- Checkpoint time (UTC): `2026-04-19T05:39:59.801Z`
- Artifacts:
  - `reports/qa/cal-68/2026-04-19/gsc-loop/release-route-integrity-after.json`
  - `reports/qa/cal-68/2026-04-19/gsc-loop/release-route-integrity-after.md`
  - `reports/qa/cal-68/2026-04-19/gsc-loop/gsc-operating-loop-snapshot.json`

## Required GSC Metrics (Status)
- Indexed URL count (calculators/articles): `UNAVAILABLE (GSC access blocked)`
- Not indexed URL count (calculators/articles): `UNAVAILABLE (GSC access blocked)`
- Top queries/pages (impressions, clicks, CTR, avg position, WoW): `UNAVAILABLE (GSC access blocked)`

### Exact blocker
- No Search Console credential path or token in this runtime:
  - no `GOOGLE_APPLICATION_CREDENTIALS`
  - no Search Console OAuth refresh token in repo/env
  - no configured script for Search Console API reads
- Result: cannot read GSC Pages/Indexing or Performance reports, cannot submit URL inspection/indexing requests from this heartbeat.

## Discoverability/Indexability Proxy (Live Crawl + Sitemap)
These are non-GSC signals used while access is blocked.

### Sitemap and robots
- `robots.txt` status: `200`
- Declared sitemap URLs in robots are on Railway host, not custom domain:
  - `https://calculator-thailand-production.up.railway.app/sitemap-index.xml`
  - `https://calculator-thailand-production.up.railway.app/sitemap.xml`
- Live `sitemap.xml` status: `200`
- Sitemap URL count: `26`
  - Calculator URLs in sitemap: `12`
  - Article URLs in sitemap: `12`
- All `<loc>` hosts in sitemap currently point to `calculator-thailand-production.up.railway.app`.

### Local inventory vs live sitemap
- Local calculator routes: `20`
- Local article routes: `25`
- Missing from sitemap:
  - Calculators: `8`
  - Articles: `13`

### Canonical and URL health (live audited URLs)
- Audited live calculator/article URLs: `24`
- Non-200 among audited live URLs: `0`
- Canonical mismatch count: `1`
  - `/บทความ/ดอกเบี้ยบัตรเครดิต-คิดยังไง-จ่ายขั้นต่ำ-2569/`
    canonical -> `/บทความ/คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว/`

### Newly added target URLs (must be indexed next)
All four are currently not discoverable in sitemap and return `404` on production:
- `/คำนวณภาษีที่ดิน/`
- `/แปลงหน่วย/`
- `/คำนวณค่างวดบัตรเครดิต/`
- `/บทความ/ผ่อนบัตรเครดิต-2569-ค่างวดและดอกเบี้ย/`

## Actions Taken This Heartbeat
- Ran route-integrity verification against `https://www.kamnuanlek.com`.
- Verified sitemap and robots freshness/host alignment.
- Audited canonical + status for live calculator/article URLs.
- Audited new target routes for discoverability, sitemap inclusion, and HTTP status.

## Actions Required

### CTO (technical/indexing blockers)
1. Fix `robots.txt` sitemap declarations to custom-domain host (`www.kamnuanlek.com`).
2. Generate sitemap `<loc>` URLs on custom-domain host (not Railway host).
3. Deploy the newly added calculator/article routes so target URLs return `200`.
4. Ensure deployed targets are included in sitemap immediately after deploy.
5. Wire Search Console access for automation (service-account or delegated OAuth) and share property access for `https://www.kamnuanlek.com/`.

### CMO/Thai Content (editorial/CTR)
1. Consolidate internal links to canonical credit-card-interest article slug.
2. After GSC access is restored, run CTR triage for top queries/pages and patch titles/meta weekly.

## Next Checkpoint Gate (CAL-68)
Work remains `in_progress` until all are true:
- GSC indexed vs not-indexed counts are available by URL type.
- GSC top queries/pages with impressions/clicks/CTR/position and WoW deltas are reported.
- Indexing requests are submitted for new URLs (or blocker explicitly documented with owner/date).