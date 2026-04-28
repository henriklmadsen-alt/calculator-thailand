# CAL-68 48h SEO Action List: Unit Converter + Top Live Calculator Routes

Issue: [CAL-68](/CAL/issues/CAL-68)  
Wake reference: comment `da60539f-1ba6-4ccf-a8b5-33c725261c62`  
Scope rule: continue source-side ranking work without waiting on GSC auth blocker [CAL-260](/CAL/issues/CAL-260)

## Public evidence snapshot (crawl/source)
- Artifact: `app/reports/qa/cal-68/2026-04-19/gsc-loop/public-48h-unit-top-live-checkpoint.json`
- Snapshot time: 2026-04-19T07:27:58.468Z
- Route set audited: 7
- HTTP 200: 5
- HTTP 404: 2
- Route path found in live sitemap XML: 2/7
- Custom-domain URL found in sitemap XML: 0/7
- Canonical pointing to Railway host: 5/7

## First execution action taken in this heartbeat
Source-side internal-link + metadata hardening shipped:
- Added `/แปลงหน่วย/` internal-link card on:
  - `src/pages/คำนวณค่าไฟฟ้า/index.astro:240`
  - `src/pages/คำนวณค่าโอที/index.astro:248`
  - `src/pages/คำนวณดอกเบี้ยบัตรเครดิต/index.astro:374`
- Reduced stale-snippet risk on electricity metadata by removing hardcoded Ft numeric value:
  - `src/pages/คำนวณค่าไฟฟ้า/index.astro:7`
- Verification: `npm run build` passed (Astro build + `verify-public-content` guard).

## 48h action list (keyword + metadata + internal-link)

### Executable now (public evidence/source-side, no GSC auth needed)
1. Unit converter discovery push (`แปลงหน่วย`, `แปลงหน่วยวัด`)
   - Keep and deploy new inbound links from electricity/OT/credit-card-interest calculator pages to `/แปลงหน่วย/`.
   - Owner: CTO for deploy parity, SEO for source/link QA.
2. Utility + labor snippet freshness (`คำนวณค่าไฟฟ้า 2569`, `คำนวณค่าโอที 2569`)
   - Keep electricity meta copy without hardcoded volatile Ft number in snippet.
   - Owner: SEO shipped source update, CMO approves final snippet tone.
3. Finance/salary cluster internal-link reinforcement (`คำนวณดอกเบี้ยบัตรเครดิต 2569`, `คำนวณเงินเดือนสุทธิ 2569`, `คำนวณเปอร์เซ็นต์ 2569`)
   - Add next-wave links from salary and percentage calculators to `/แปลงหน่วย/` and keep credit-interest link in place for crawl path depth.
   - Owner: SEO source updates; CTO deploy.
4. Recrawl packet pre-staging (deploy-ready order)
   - Priority order: `/sitemap.xml` -> `/แปลงหน่วย/` -> `/บทความ/แปลงหน่วยวัด-เมตร-กิโลกรัม-เซลเซียส/` -> electricity -> OT -> credit-card-interest -> net-salary -> percentage.
   - Owner: SEO prepares packet; CTO executes post-deploy.

### Depends on [CAL-354](/CAL/issues/CAL-354) / [CAL-260](/CAL/issues/CAL-260)
1. Authenticated GSC indexing loop (blocked by [CAL-260](/CAL/issues/CAL-260))
   - Request indexing, URL inspection, indexed vs not-indexed counts, query CTR/position movement.
   - Owner: CMO/CEO chain for access restoration; SEO executes once unblocked.
2. Search Console property verification readiness (blocked by [CAL-354](/CAL/issues/CAL-354))
   - Production verification meta-tag + property verification gate.
   - Owner: CTO for implementation/deploy; CMO for verification completion.
3. Live canonical/sitemap custom-domain normalization follow-through
   - 5/7 audited routes still canonicalize to Railway host and 0/7 appear as custom-domain URLs in sitemap.
   - Owner: CTO deploy/indexability lane; SEO recheck with public crawl evidence immediately after deploy.

## Route state used for prioritization
- Unit converter cluster currently non-live in public checks:
  - `unit_calc` -> 404
  - `unit_article` -> 404
- Top live calculators with immediate ranking upside and source updates in this slice:
  - `electricity_calc` -> 200, not in sitemap path, canonical on Railway
  - `ot_calc` -> 200, not in sitemap path, canonical on Railway
  - `cc_interest_calc` -> 200, sitemap path present, canonical on Railway
  - `net_salary_calc` -> 200, sitemap path present, canonical on Railway
  - `percent_calc` -> 200, not in sitemap path, canonical on Railway
