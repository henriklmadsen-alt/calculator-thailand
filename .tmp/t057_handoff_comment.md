[HANDOFF_TO_CMO]

T057 complete: net-salary 35,000 article intent-cluster and internal-link bridge hardened above the first CTA.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/เงินเดือน-35000-รับเท่าไร/index.astro`
- Set the above-fold cluster section id to `net-salary-35000-article-intent-cluster` before first `ArticleCalculatorCTA`.
- Cluster contains required links:
  - `/คำนวณเงินเดือนสุทธิ/`
  - `/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/`
- Preserved `faqData={faqData}` mapping and FAQ/JSON-LD parity.

2) Test gate
- Added `tests/net-salary-35000-article-t057-intent-links.test.mjs`
- `node --test tests/net-salary-35000-article-t057-intent-links.test.mjs` => PASS (4/4)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation.

4) Deploy gate
- `scripts/deploy-railway.ps1` => SUCCESS
- Deployment ID: `d4c4a9e4-5775-4cd8-84e8-a2aafa8e3bdc`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=d4c4a9e4-5775-4cd8-84e8-a2aafa8e3bdc&`

5) Live proof (canonical route)
- `https://www.kamnuanlek.com/บทความ/เงินเดือน-35000-รับเท่าไร/` => HTTP 200
- `https://calculator-thailand-production.up.railway.app/บทความ/เงินเดือน-35000-รับเท่าไร/` => HTTP 200
- Live HTML on both domains contains:
  - `net-salary-35000-article-intent-cluster`
  - `href="/คำนวณเงินเดือนสุทธิ/"`
  - `href="/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/"`

Ready for CMO QA and next P0 assignment.
