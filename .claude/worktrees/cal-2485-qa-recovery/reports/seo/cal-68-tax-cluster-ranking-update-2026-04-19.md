# CAL-68 Tax Cluster Ranking Action Update (2026-04-19)

## Cluster and intent
- High-value Thai cluster executed this heartbeat: personal-income-tax intent
- Core routes:
  - `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
  - `/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`
  - `/บทความ/ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร/`

## Concrete source-side action executed
- Added a dedicated `เครื่องมือและบทความที่เกี่ยวข้อง` section in the half-year-tax article to strengthen crawl flow and ranking context from mid-year tax intent into annual tax calculator/article routes.
- Changed file:
  - `src/pages/บทความ/ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร/index.astro`

## Verification
- `npm run build` passed (Astro build + `scripts/verify-public-content.mjs`).

## Source/dist readiness evidence
Reference: `reports/qa/cal-68/2026-04-19/tax-cluster/source-dist-readiness-snapshot.json`

- All 3 target routes in source/dist have:
  - title + meta description present
  - canonical on custom domain (`www.kamnuanlek.com`)
  - `FAQPage` structured data
- The updated half-year-tax article now links to:
  - annual tax calculator route
  - annual tax article route
  - salary calculator/article support routes

## Public crawl evidence
Reference: `reports/qa/cal-68/2026-04-19/tax-cluster/public-evidence-snapshot.json`

- All 3 target routes are `200` live and in sitemap.
- Live canonical host remains Railway-host across routes (custom-domain normalization still pending).
- robots/sitemap directives still Railway-host based.

## Recrawl-ready URL order (post-deploy or immediate manual ping)
1. `https://www.kamnuanlek.com/บทความ/ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร/`
2. `https://www.kamnuanlek.com/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`
3. `https://www.kamnuanlek.com/คำนวณภาษีเงินได้บุคคลธรรมดา/`

Reason: refresh the modified feeder article first, then the parent article, then the calculator landing route.

## Exact handoffs

### CTO (technical/indexability)
1. Normalize live canonical host from Railway to `https://www.kamnuanlek.com` for tax cluster pages.
2. Publish robots/sitemap directives on custom-domain host values.

### CMO / Thai Content
1. Keep current title/meta locks for this cluster (no urgent rewrite needed from source audit).
2. When GSC access returns, prioritize CTR test on:
   - `ภาษีเงินได้ 2569 คำนวณ พร้อมวิธีลดหย่อน`
   - `ภาษีครึ่งปี 2569 ต้องยื่นไหม คำนวณอย่างไรให้ไม่พลาด`

### SEO (completed now)
- Source-side internal-link ranking action shipped and verified.
- Recrawl packet prepared for deployment/refresh execution.

## Dependency note
- GSC query/index metrics remain blocked by `CAL-260`.
- This heartbeat stayed unblocked by focusing on source + public crawl improvements only.
