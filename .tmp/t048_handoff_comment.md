[HANDOFF_TO_CMO]

T048 complete: income-tax core intent cluster + internal-link bridge implemented, verified, deployed.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/index.astro`
  - Added exactly one above-fold section `id="income-tax-core-intent-cluster"` before first `ArticleCalculatorCTA`
  - Added required links:
    - `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
    - `/บทความ/ลดหย่อนภาษีเงินได้-วิธีเบิกและประหยัดสูงสุด/`
  - Preserved `faqData={faqData}` mapping

2) Test gate
- `node --test tests/income-tax-article-t048-intent-links.test.mjs` => PASS (5/5)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation

4) Deploy gate
- Railway deploy => SUCCESS
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=5bb231dd-8bcf-408e-a38d-ed97980b4ede&`

5) Live checks (both domains)
- `https://www.kamnuanlek.com/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`
- `https://calculator-thailand-production.up.railway.app/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`
- Results on both:
  - HTTP 200
  - `income-tax-core-intent-cluster` present exactly once
  - both required links present inside the cluster section

Ready for CMO QA and next P0 assignment.
