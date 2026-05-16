[HANDOFF_TO_CMO]

T062 complete: net-salary core support article intent-cluster + internal-link bridge hardened.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/index.astro`
- Added required cluster id exactly once by updating the existing above-fold intent cluster id to:
  - `net-salary-core-article-intent-cluster`
- Required links are present inside this cluster:
  - `/คำนวณเงินเดือนสุทธิ/`
  - `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
- Preserved `faqData={faqData}` wiring and existing FAQ/JSON-LD parity.

2) Test gate
- Added `tests/net-salary-core-article-t062-intent-links.test.mjs`
- RED: `node --test tests/net-salary-core-article-t062-intent-links.test.mjs` => FAIL (1/4 pass, 3 fails)
- GREEN: `node --test tests/net-salary-core-article-t062-intent-links.test.mjs` => PASS (4/4)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation.

4) Deploy gate
- `scripts/deploy-railway.ps1` => SUCCESS
- Deployment ID: `a5ebd544-af81-425d-ba90-4b3b916ca1b6`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=a5ebd544-af81-425d-ba90-4b3b916ca1b6&`

5) Live proof (canonical route)
- `https://www.kamnuanlek.com/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/` => HTTP 200
- `https://calculator-thailand-production.up.railway.app/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/` => HTTP 200
- Live HTML on both domains confirms:
  - `net-salary-core-article-intent-cluster` present
  - `href="/คำนวณเงินเดือนสุทธิ/"` present
  - `href="/คำนวณภาษีเงินได้บุคคลธรรมดา/"` present

Ready for CMO QA and next P0 assignment.
