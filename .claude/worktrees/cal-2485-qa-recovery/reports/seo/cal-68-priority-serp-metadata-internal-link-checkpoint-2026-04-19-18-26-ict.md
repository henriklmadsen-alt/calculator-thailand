# CAL-68 Public-Evidence SEO Checkpoint (2026-04-19 18:26 ICT)

## Scope for this wake
- Issue: `CAL-68`
- Constraint: continue non-GSC ranking work while `CAL-174` / `CAL-260` remain blocked behind `CAL-354`
- Requested output: current priority SERP/metadata/internal-link action list + at least one CMO/Thai executable action without GSC access

## First execution action taken
- Internal-link refresh shipped in credit-card calculator template:
  - updated electricity article link target from old slug to `...-สูตร-pea-mea/`
  - file: `src/pages/คำนวณดอกเบี้ยบัตรเครดิต/index.astro`

## Evidence artifacts
- Live public snapshot (top routes):
  - `reports/qa/cal-68/2026-04-19/priority-serp-metadata-internal-link/public-evidence-top-routes-ascii.json`
- Earlier broad non-GSC crawl snapshot (20 priority routes):
  - `reports/qa/cal-68/2026-04-19/non-gsc-priority-action-list/priority-serp-metadata-internal-link-snapshot.json`
- CMO/Thai copy package (ready for approval):
  - `reports/seo/cal-68-cmo-thai-electricity-serp-copy-pack-2026-04-19.md`

## Public snapshot summary (current)
From `public-evidence-top-routes-ascii.json`:
- `electricity_calc`: `200`, not in live sitemap, canonical not custom-domain
- `electricity_article`: `200`, not in live sitemap, canonical not custom-domain
- `ot_calc`: `200`, not in live sitemap, canonical not custom-domain
- `ot_article`: `200`, not in live sitemap, canonical not custom-domain
- `credit_card_installment_calc`: `404`, not in live sitemap
- `credit_card_installment_article`: `404`, not in live sitemap
- `fx_calc`: `200`, in live sitemap, canonical not custom-domain
- `unit_converter_calc`: `404`, not in live sitemap

Domain-level signal in same artifact:
- live sitemap is reachable (`200`) but host normalization is still not complete for ranking/indexing trust.

## Priority action list (non-GSC)

### P1 - Electricity cluster (highest immediate upside, already live 200)
Target URLs:
1. `https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2/`
2. `https://www.kamnuanlek.com/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2-2569-%E0%B8%AA%E0%B8%B9%E0%B8%95%E0%B8%A3-pea-mea/`

Actions:
- SEO (done): internal-link slug consistency fix in related-link context.
- CTO (`CAL-354`): include both URLs in live sitemap and normalize canonical host to `https://www.kamnuanlek.com/`.
- CMO/Thai (can execute now, no GSC): approve/apply title/meta/H1 lock package in `cal-68-cmo-thai-electricity-serp-copy-pack-2026-04-19.md`.

### P2 - OT cluster (live 200 + missing sitemap/canonical normalization)
Target URLs:
1. `https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%97%E0%B8%B5/`
2. `https://www.kamnuanlek.com/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%82%E0%B8%AD%E0%B8%97%E0%B8%B5-2569-%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B8%81%E0%B8%8E%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2%E0%B9%81%E0%B8%A3%E0%B8%87%E0%B8%87%E0%B8%B2%E0%B8%99/`

Actions:
- SEO: keep this pair high in internal-link graph from salary/work-hours pages.
- CTO (`CAL-354`): sitemap inclusion + canonical host normalization.
- CMO/Thai: optional snippet refresh after deploy parity if CTR underperforms.

### P3 - Credit-card installment cluster (source ready, live 404)
Target URLs:
1. `https://www.kamnuanlek.com/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%A7%E0%B8%94%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95/`
2. `https://www.kamnuanlek.com/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95-2569-%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%A7%E0%B8%94%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B9%89%E0%B8%A2/`

Actions:
- SEO (done in this wake): corrected one stale electricity article link slug inside calculator template.
- CTO (`CAL-354`): deploy to remove `404`, publish both URLs in sitemap, preserve indexable canonicals.
- CMO/Thai: after deploy, verify snippet readability/intent alignment against installment query wording.

## Post-deploy recrawl order
1. Electricity calculator
2. Electricity article (`...pea-mea`)
3. OT calculator
4. OT article
5. Credit-card installment calculator
6. Credit-card installment article

## Verification evidence
- `npm run build` passed at `18:26 ICT` (Astro build + `scripts/verify-public-content.mjs`).

## Exact blockers and owners
- `CAL-354` (CTO): deploy parity + sitemap/canonical normalization + 404 removal.
- `CAL-260` (GSC auth chain): authenticated indexing/performance loop.

Unblocked and completed in this slice:
- source-side internal-link correction,
- fresh public-evidence route snapshot,
- owner-tagged action list with one immediate CMO/Thai executable action.
