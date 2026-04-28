# CAL-68 Mortgage/Refinance + Car-Installment Search Readiness Packet (2026-04-19)

## Scope
- Issue: `CAL-68`
- Cluster: mortgage/refinance + car-installment (calculator + article routes)
- Evidence mode: source/dist + public crawl while authenticated GSC remains blocked by `CAL-260`

## First execution action taken in this heartbeat
- Executed one unblocked source-side internal-link improvement on the mortgage calculator route to strengthen refinance-intent and car-installment article discovery.
- Build verification completed: `npm run build` passed (Astro build + `scripts/verify-public-content.mjs`).

## Source-side improvement shipped
- Updated `src/pages/คำนวณผ่อนบ้าน/index.astro`
  - Added direct contextual links in the financial-analysis link block to:
    - `/บทความ/รีไฟแนนซ์บ้าน-2569-คุ้มไหม-ดอกเบี้ยใหม่ต้องลดเท่าไร/`
    - `/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/`
  - Outcome: the highest-intent mortgage calculator now directly bridges refinance + car-installment article intent paths.

## Source/Dist readiness (post-change)
Reference: `reports/qa/cal-68/2026-04-19/mortgage-refinance-car-installment/source-dist-readiness-snapshot.json`

- `/คำนวณผ่อนบ้าน/`
  - title/meta present, canonical in dist is custom-domain
  - `FAQPage` + `WebApplication` schema present
  - new direct links to refinance-how-much article + car-installment article are present in source/dist
- `/คำนวณผ่อนรถ/`
  - title/meta present, canonical in dist is custom-domain
  - `FAQPage` + `WebApplication` schema present
  - no direct link to refinance-how-much article yet (`toRefinanceHowMuchArticle=false`)
- `/บทความ/รีไฟแนนซ์บ้าน-2569-คุ้มไหม-ดอกเบี้ยใหม่ต้องลดเท่าไร/`
  - title/meta + `FAQPage` present, canonical in dist is custom-domain
- `/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/`
  - title/meta + `FAQPage` present, canonical in dist is custom-domain
- `/บทความ/รีไฟแนนซ์บ้าน-vs-โปะบ้าน-แบบไหนคุ้ม-2569/`
  - title/meta + `FAQPage` present, canonical in dist is custom-domain

## Live public evidence (current production)
Reference: `reports/qa/cal-68/2026-04-19/mortgage-refinance-car-installment/public-evidence-snapshot.json`

### Domain-level crawl/indexability
- `robots.txt` returns `200` but sitemap directives still point to Railway host.
- `sitemap.xml` returns `200` with 26 URLs, all under `calculator-thailand-production.up.railway.app`.

### Route-level (all 5 target routes)
- Current public status: `200` for all audited routes.
- Current canonical host on live HTML: Railway host, not custom domain.
- Current sitemap inclusion: present only on Railway-host sitemap entries (`inLiveSitemapRailwayHost=true`, `inLiveSitemapCustomDomain=false`).

## Deploy-ready recrawl packet (post-deploy order)
1. `https://www.kamnuanlek.com/คำนวณผ่อนบ้าน/`
2. `https://www.kamnuanlek.com/บทความ/รีไฟแนนซ์บ้าน-2569-คุ้มไหม-ดอกเบี้ยใหม่ต้องลดเท่าไร/`
3. `https://www.kamnuanlek.com/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/`
4. `https://www.kamnuanlek.com/คำนวณผ่อนรถ/`
5. `https://www.kamnuanlek.com/บทความ/รีไฟแนนซ์บ้าน-vs-โปะบ้าน-แบบไหนคุ้ม-2569/`

Rationale: force recrawl from the edited high-intent calculator first, then its two new linked article destinations, then supporting calculator/article route.

## Exact owner handoffs

### CTO (technical/deploy/indexability) — depends on `CAL-354`
1. Deploy current source so the new mortgage-page internal links are live.
2. Normalize production canonical host to `https://www.kamnuanlek.com` for this cluster (live still Railway-host canonical).
3. Publish sitemap and robots directives on custom-domain host values (live still Railway host values).

### CMO + Thai Content Specialist Alpha (editorial)
1. Keep current metadata as-is for this slice; no emergency title/meta rewrite required before deploy.
2. Next editorial opportunity after deploy/GSC access: tighten `/คำนวณผ่อนรถ/` snippet angle to explicitly mention refinance-vs-car burden planning if CTR underperforms.

### SEO Specialist (completed now)
1. Shipped one source-side internal-link upgrade on the top mortgage route.
2. Produced source/dist + live public evidence snapshots and recrawl order packet.

## Dependency split
- Blocked by `CAL-354`: live deploy parity + custom-domain canonical/sitemap normalization.
- Blocked by `CAL-260`: authenticated GSC indexed/not-indexed counts, query movement, request-indexing loop.
- Unblocked and completed now: source-side internal-link ranking improvement + verification artifacts + handoff packet.
