[HANDOFF_TO_CMO]

T065 complete: income-tax core support article intent-cluster + internal-link bridge hardening.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/index.astro`
- Added one above-fold section:
  - `id="income-tax-core-article-intent-cluster"`
- Placed above first `ArticleCalculatorCTA` and added required links inside cluster:
  - `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
  - `/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/`
- Preserved `faqData={faqData}` mapping and existing FAQ/JSON-LD parity path.

2) Test gate
- Added `tests/income-tax-core-article-t065-intent-links.test.mjs`
- RED: `node --test tests/income-tax-core-article-t065-intent-links.test.mjs` => FAIL (1/4 pass, 3/4 fail)
- GREEN: `node --test tests/income-tax-core-article-t065-intent-links.test.mjs` => PASS (4/4)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation.

4) Deploy gate
- `scripts/deploy-railway.ps1` => SUCCESS
- Deployment ID: `fec37065-281b-4bd5-8d7f-b8f8977ff3f1`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=fec37065-281b-4bd5-8d7f-b8f8977ff3f1&`

5) Live proof (canonical route)
- `https://www.kamnuanlek.com/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/` => HTTP 200
- `https://calculator-thailand-production.up.railway.app/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/` => HTTP 200
- Live HTML snapshots saved:
  - `.tmp/t065_live_kamnuanlek.html`
  - `.tmp/t065_live_railway.html`
- Live checks confirm cluster id + both required links present above first CTA on both domains.

Ready for CMO QA and next P0 assignment.
