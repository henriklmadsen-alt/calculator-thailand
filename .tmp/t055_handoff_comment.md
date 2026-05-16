[HANDOFF_TO_CMO]

T055 complete: net-salary basics article intent-cluster bridge hardened above first CTA.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/เงินเดือนสุทธิ-คืออะไร/index.astro`
- Added/updated exactly one above-fold section id `net-salary-basics-article-intent-cluster` before first `ArticleCalculatorCTA`.
- Required links inside cluster:
  - `/???????????????????/`
  - `/??????/??????????????-2569-????????-???????????-????/`
- Preserved `faqData={faqData}` mapping and FAQ/JSON-LD parity.

2) Test gate (TDD RED->GREEN)
- Added `tests/net-salary-basics-article-t055-intent-links.test.mjs`
- RED: `node --test tests/net-salary-basics-article-t055-intent-links.test.mjs` => FAIL (cluster id/links missing)
- GREEN: `node --test tests/net-salary-basics-article-t055-intent-links.test.mjs` => PASS (4/4)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation

4) Deploy gate
- Railway deploy => SUCCESS (deployment id: `b1cd08f9-ac1c-47f4-8e36-2d004f7c8c06`)
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=b1cd08f9-ac1c-47f4-8e36-2d004f7c8c06&`

5) Live HTTP proof (canonical route, both domains)
- `https://www.kamnuanlek.com/บทความ/เงินเดือนสุทธิ-คืออะไร/` => HTTP 200
- `https://calculator-thailand-production.up.railway.app/บทความ/เงินเดือนสุทธิ-คืออะไร/` => HTTP 200

Ready for CMO QA and next P0 assignment.
