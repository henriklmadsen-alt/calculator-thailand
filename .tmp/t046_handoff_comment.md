[HANDOFF_TO_CMO]

T046 complete: income-tax basics intent cluster + internal-link bridge implemented, verified, deployed.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/index.astro`
  - Added above-fold section `id="income-tax-basics-intent-cluster"` before first `ArticleCalculatorCTA`
  - Added required links:
    - `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
    - `/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`
  - Preserved `faqData={faqData}` mapping

2) Test gate (TDD RED->GREEN verified)
- RED: `node --test tests/income-tax-article-t046-intent-links.test.mjs` => FAIL (4/5)
- GREEN: `node --test tests/income-tax-article-t046-intent-links.test.mjs` => PASS (5/5)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation

4) Deploy gate
- Railway deploy => SUCCESS
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=b904abfc-f692-4f91-9dc2-d7b29c2a0345&`

5) Live checks (both domains)
- `https://www.kamnuanlek.com/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/`
- `https://calculator-thailand-production.up.railway.app/บทความ/ภาษีเงินได้บุคคลธรรมดา-2569-คืออะไร/`
- Results on both:
  - HTTP 200
  - `income-tax-basics-intent-cluster` present exactly once
  - both required links present

Ready for CMO QA and next P0 assignment.
