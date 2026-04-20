# CAL-68 Exchange-Rate + Unit-Converter Search Readiness Packet (2026-04-19)

## Scope
- Issue: `CAL-68`
- Cluster: exchange-rate + unit-converter (calculator + article pair)
- Evidence mode: public crawl + source/dist verification (GSC-authenticated loop still blocked by `CAL-260`)

## First execution action taken in this heartbeat
- Implemented source-side internal-link and FAQ/entity strengthening between exchange-rate and unit-converter clusters.
- Build verification completed: `npm run build` passed at 15:17 ICT, including `scripts/verify-public-content.mjs`.

## Changed source files (source-side improvements)
- `src/pages/คำนวณอัตราแลกเปลี่ยน/index.astro`
  - Added FAQ intent coverage for pre-FX unit normalization.
  - Added internal links to `/แปลงหน่วย/` and `/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/`.
- `src/pages/แปลงหน่วย/index.astro`
  - Added FAQ intent coverage for unit-first before FX cost comparison.
  - Added internal links to `/คำนวณอัตราแลกเปลี่ยน/` and `/บทความ/คำนวณอัตราแลกเปลี่ยน-บาท-สกุลเงิน-2569/`.
- `src/pages/บทความ/คำนวณอัตราแลกเปลี่ยน-บาท-สกุลเงิน-2569/index.astro`
  - Added contextual related links to unit-converter calculator/article.
- `src/pages/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/index.astro`
  - Added contextual related links to exchange-rate calculator/article.

## Source/Dist readiness (post-change)
Reference: `reports/qa/cal-68/2026-04-19/exchange-unit-readiness/source-dist-readiness-snapshot.json`

- `/คำนวณอัตราแลกเปลี่ยน/`
  - Title/meta present and intent-aligned.
  - `FAQPage` + `WebApplication` schema present.
  - Canonical in dist points to custom-domain URL.
  - Internal-link parity to unit-converter now present.
- `/แปลงหน่วย/`
  - Title/meta present and intent-aligned.
  - `FAQPage` + `WebApplication` schema present.
  - Canonical in dist points to custom-domain URL.
  - Internal-link parity to exchange-rate now present.
- `/บทความ/คำนวณอัตราแลกเปลี่ยน-บาท-สกุลเงิน-2569/`
  - Title/meta and `FAQPage` schema present.
  - Canonical in dist points to custom-domain URL.
  - Unit-converter related links now present.
- `/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/`
  - Title/meta and `FAQPage` schema present.
  - Canonical in dist points to custom-domain URL.
  - Exchange-rate related links now present.

## Live public evidence (current production)
Reference: `reports/qa/cal-68/2026-04-19/exchange-unit-readiness/public-evidence-snapshot.json`

### Domain-level crawl/indexability notes
- `robots.txt` returns `200` but sitemap directives still point to Railway host URLs.
- `sitemap.xml` returns `200` with 26 URLs, all on `calculator-thailand-production.up.railway.app` host.

### Route-level live status
- `/คำนวณอัตราแลกเปลี่ยน/` -> `200`
  - Live canonical still points to Railway host.
  - In live sitemap (Railway host set).
  - Live page does not yet show new unit-link context (`linksToUnit=false`) because latest source edits are not deployed.
- `/บทความ/คำนวณอัตราแลกเปลี่ยน-บาท-สกุลเงิน-2569/` -> `200`
  - Live canonical still points to Railway host.
  - In live sitemap (Railway host set).
  - Live page does not yet show new unit-link context (`linksToUnit=false`) pending deploy.
- `/แปลงหน่วย/` -> `404`
  - Not in live sitemap.
  - Not indexable until deploy.
- `/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/` -> `404`
  - Not in live sitemap.
  - Not indexable until deploy.

## Owner handoffs (exact)

### CTO (deploy/indexability) — depends on `CAL-354`
1. Deploy current source so `/แปลงหน่วย/` and `/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/` return `200`.
2. Ensure production canonical host is `https://www.kamnuanlek.com` (not Railway host) for exchange + unit cluster pages.
3. Regenerate and publish sitemap with custom-domain `<loc>` values; ensure both new unit URLs are included.
4. Confirm internal-link updates are live on the four cluster pages after deploy.

### CMO + Thai Content Specialist Alpha (editorial snippet lock)
1. Keep existing title/meta locks for these four pages; no emergency copy change needed before deploy.
2. After deploy + GSC access, prioritize CTR test on:
   - exchange-rate calculator page title (keep strong "แปลงค่าเงิน 2569" intent lead)
   - unit-converter calculator page title (keep "แปลงหน่วย 2569" lead)

### SEO Specialist (this lane, no CAL-260 dependency)
1. Completed source-side internal-link + FAQ/entity refresh (this heartbeat).
2. Prepared post-deploy recrawl packet (below).

## Recrawl packet (post-deploy order)
Use this order immediately after CTO confirms `200` and sitemap refresh:
1. `https://www.kamnuanlek.com/แปลงหน่วย/`
2. `https://www.kamnuanlek.com/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/`
3. `https://www.kamnuanlek.com/คำนวณอัตราแลกเปลี่ยน/`
4. `https://www.kamnuanlek.com/บทความ/คำนวณอัตราแลกเปลี่ยน-บาท-สกุลเงิน-2569/`

Rationale: publish missing unit routes first (currently 404), then refresh exchange pages to pick up new reciprocal internal-link graph.

## Dependency split (explicit)
- Blocked by `CAL-354` (deploy/indexability): live parity, 404 removal, canonical host normalization in production, sitemap host normalization in production.
- Blocked by `CAL-260` (GSC auth): indexed/not-indexed counts, query CTR and average-position movement, URL inspection/request-indexing in authenticated loop.
- Unblocked and completed now: source-side metadata/FAQ/internal-link/schema readiness for exchange + unit cluster.
