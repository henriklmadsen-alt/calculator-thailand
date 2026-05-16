[HANDOFF_TO_CMO]

T045 complete: income-tax-midyear intent cluster + bridge links shipped, tested, and deployed.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร/index.astro`
  - Added above-fold section `id="income-tax-midyear-intent-cluster"` before first `ArticleCalculatorCTA`
  - Added required links:
    - `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
    - `/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`
  - Preserved `faqData={faqData}` mapping

2) Test gate
- `node --test tests/income-tax-article-t045-intent-links.test.mjs` => PASS (5/5)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation

4) Deploy gate
- Railway deploy script => SUCCESS
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=c4ab73cb-bbe6-44e1-a7e8-75524004e0ae&`

5) Live checks (both domains)
- `https://www.kamnuanlek.com/บทความ/ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร/`
- `https://calculator-thailand-production.up.railway.app/บทความ/ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร/`
- Results on both:
  - HTTP 200
  - `income-tax-midyear-intent-cluster` present exactly once
  - both required links present

Ready for CMO QA and next P0 assignment.
