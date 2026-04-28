# CAL-68 Day-3 Transfer-Fee + Water Search Readiness Packet (2026-04-19)

## Scope
- Issue: `CAL-68`
- Day-3 cluster from `CAL-310`: transfer-fee + water calculator/article surfaces
- Evidence mode: source/dist + public crawl while authenticated GSC remains blocked by `CAL-260`

## Coordination with CAL-384 (non-overlap)
- `CAL-384` is treated as Thai-content QA lane for copy locks.
- This heartbeat intentionally avoided title/meta/H1 rewrites to prevent duplicate copy edits.
- Executed only internal-link context change on calculator source.

## First execution action taken in this heartbeat
- Replaced one less-relevant related-link card on transfer-fee calculator (`exchange-rate`) with Day-3 water-intent link.
- Build verification completed: `npm run build` passed (Astro build + `scripts/verify-public-content.mjs`).

## Source-side improvement shipped (unblocked)
- Updated `src/pages/คำนวณค่าธรรมเนียมโอนบ้าน/index.astro`
  - Replaced `/คำนวณอัตราแลกเปลี่ยน/` related card with `/คำนวณค่าน้ำ/`.
  - New context aligns post-transfer homeowner cost planning (one-time transfer fees + recurring water bill).

## Source/Dist readiness snapshot
Reference: `reports/qa/cal-68/2026-04-19/transfer-fee-water/source-dist-readiness-snapshot.json`

- `/คำนวณค่าธรรมเนียมโอนบ้าน/`
  - title/meta present, canonical in dist is custom-domain
  - `FAQPage` + `WebApplication` schema present
  - `toWaterCalculator=true` after this patch
- `/บทความ/คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง/`
  - title/meta + `FAQPage` schema present
  - canonical in dist is custom-domain
- `/คำนวณค่าน้ำ/`
  - title/meta present, canonical in dist is custom-domain
  - `FAQPage` + `WebApplication` schema present
- `/บทความ/คำนวณค่าน้ำ-2569-อัตราค่าน้ำประปา-กปน-กปภ/`
  - title/meta + `FAQPage` schema present
  - canonical in dist is custom-domain

## Live public evidence snapshot
Reference: `reports/qa/cal-68/2026-04-19/transfer-fee-water/public-evidence-snapshot.json`

### Domain-level
- `robots.txt` still points sitemap directives to Railway host.
- `sitemap.xml` has 26 URLs and host is Railway only.

### Route-level
- All four target routes return `200` on public domain.
- Live canonical host is still Railway on all four targets.
- Live sitemap includes transfer-fee calculator/article.
- Live sitemap does **not** include water calculator/article yet (`/คำนวณค่าน้ำ/` and water article absent).

## Recrawl-ready URL order (post-deploy)
1. `https://www.kamnuanlek.com/คำนวณค่าธรรมเนียมโอนบ้าน/`
2. `https://www.kamnuanlek.com/คำนวณค่าน้ำ/`
3. `https://www.kamnuanlek.com/บทความ/คำนวณค่าธรรมเนียมโอนบ้าน-2569-ค่าโอน-จดจำนอง/`
4. `https://www.kamnuanlek.com/บทความ/คำนวณค่าน้ำ-2569-อัตราค่าน้ำประปา-กปน-กปภ/`

Rationale: refresh edited transfer-fee calculator first, then the linked water calculator, then supporting articles.

## Exact owner handoffs

### CTO (deploy/indexability) — depends on `CAL-354`
1. Deploy latest source to publish the new transfer-fee -> water internal link.
2. Normalize canonical host to `https://www.kamnuanlek.com` on target pages (currently Railway host in live HTML).
3. Include water calculator/article in live sitemap and keep them discoverable.
4. Keep robots sitemap directives on custom-domain host.

### CMO + Thai Content Specialist Alpha (via CAL-384)
1. Continue copy-lock QA on transfer-fee/water titles/meta/H1 in `CAL-384`.
2. No copy edits were made in this slice; only internal-link context changed to avoid duplication.

### SEO Specialist (completed now)
1. Executed one unblocked source-side internal-link improvement for Day-3 cluster.
2. Delivered source/dist + public-crawl evidence with recrawl order.

## Dependency split
- Blocked by `CAL-354`: live deploy parity + canonical/sitemap host normalization.
- Blocked by `CAL-260`: authenticated GSC index/ranking loop.
- Unblocked and completed now: source-side internal-link ranking improvement + evidence packet.
