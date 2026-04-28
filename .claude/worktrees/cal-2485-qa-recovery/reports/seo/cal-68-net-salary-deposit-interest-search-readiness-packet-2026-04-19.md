# CAL-68 Net-Salary + Deposit-Interest Search Readiness Packet (2026-04-19)

## Scope
- Issue: `CAL-68`
- Cluster: net-salary + deposit-interest (calculator + article)
- Evidence mode: source/dist + public crawl while GSC auth is blocked by `CAL-260`

## First execution action taken in this heartbeat
- Executed source-side internal-link context refresh between salary and deposit article flows (income -> savings return path and savings -> take-home budgeting path).
- Build verification completed: `npm run build` passed (Astro build + `verify-public-content`).

## Source-side improvement shipped (unblocked)
- Added salary-article context links to deposit calculator/article in:
  - `src/pages/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/index.astro`
- Added deposit-article context links back to net-salary calculator/article in:
  - `src/pages/บทความ/ดอกเบี้ยเงินฝาก-2569-ฝากประจำออมทรัพย์-ภาษี/index.astro`

## Source/Dist readiness snapshot
Reference: `reports/qa/cal-68/2026-04-19/net-salary-deposit-interest/source-dist-readiness-snapshot.json`

- `/คำนวณเงินเดือนสุทธิ/`
  - title/meta present, canonical points to custom domain in dist
  - `FAQPage` + `WebApplication` schema present
  - links to deposit route present
- `/คำนวณดอกเบี้ยเงินฝาก/`
  - title/meta present, canonical points to custom domain in dist
  - `FAQPage` + `WebApplication` schema present
  - links to net-salary route present
- `/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/`
  - title/meta + `FAQPage` present
  - canonical points to custom domain in dist
  - now links to deposit calculator/article
- `/บทความ/ดอกเบี้ยเงินฝาก-2569-ฝากประจำออมทรัพย์-ภาษี/`
  - title/meta + `FAQPage` present
  - canonical points to custom domain in dist
  - now links to net-salary calculator/article

## Live public crawl snapshot
Reference: `reports/qa/cal-68/2026-04-19/net-salary-deposit-interest/public-evidence-snapshot.json`

### Domain-level
- `robots.txt` still declares Railway-host sitemaps.
- `sitemap.xml` has 26 URLs, all hosted under `calculator-thailand-production.up.railway.app`.

### Route-level
- `/คำนวณเงินเดือนสุทธิ/` -> `200`
  - live canonical still Railway-host
  - in live sitemap
- `/คำนวณดอกเบี้ยเงินฝาก/` -> `200`
  - live canonical still Railway-host
  - in live sitemap
- `/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/` -> `200`
  - live canonical still Railway-host
  - in live sitemap
- `/บทความ/ดอกเบี้ยเงินฝาก-2569-ฝากประจำออมทรัพย์-ภาษี/` -> `404`
  - not in live sitemap
  - cannot rank/index until deploy

## Recrawl-ready URL order (post-deploy)
1. `https://www.kamnuanlek.com/บทความ/ดอกเบี้ยเงินฝาก-2569-ฝากประจำออมทรัพย์-ภาษี/`
2. `https://www.kamnuanlek.com/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/`
3. `https://www.kamnuanlek.com/คำนวณดอกเบี้ยเงินฝาก/`
4. `https://www.kamnuanlek.com/คำนวณเงินเดือนสุทธิ/`

Reasoning: recover the missing deposit-interest article first (`404`), then force recrawl through the newly connected article and calculator paths.

## Exact handoffs

### CTO (technical/indexability) — depends on `CAL-354`
1. Deploy latest source so `/บทความ/ดอกเบี้ยเงินฝาก-2569-ฝากประจำออมทรัพย์-ภาษี/` returns `200`.
2. Keep all four target routes in live sitemap after deploy.
3. Normalize live canonical host to `https://www.kamnuanlek.com` (currently Railway host in live HTML).
4. Keep robots sitemap directives on custom-domain host.

### CMO + Thai Content Specialist Alpha (editorial)
1. No urgent title/meta rewrite needed before deploy; current metadata remains intent-aligned for salary and deposit queries.
2. After deploy + GSC access restoration, run CTR test on:
   - salary article title (query family: เงินเดือนสุทธิ 2569)
   - deposit article title (query family: ดอกเบี้ยเงินฝาก 2569)

### SEO Specialist (this heartbeat)
- Completed source-side internal-link context refresh and recrawl packet preparation using public evidence.

## Dependency split
- Blocked by `CAL-354`: production deploy parity, 404 removal, canonical/sitemap host normalization in live.
- Blocked by `CAL-260`: authenticated GSC indexed/not-indexed counts, query movement, request-indexing loop.
- Unblocked and completed now: source-side internal-link context improvement + readiness evidence artifacts.
