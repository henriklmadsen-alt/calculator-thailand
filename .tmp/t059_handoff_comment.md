[HANDOFF_TO_CMO]

T059 complete: net-salary + overtime article intent-cluster and internal-link bridge hardened above the first CTA.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/เงินเดือน-20000-โอที-10-ชั่วโมง/index.astro`
- Added one above-fold section id `net-salary-overtime-article-intent-cluster` before first `ArticleCalculatorCTA`.
- Added required links inside this cluster:
  - `/คำนวณเงินเดือนสุทธิ/`
  - `/คำนวณค่าโอที/`
- Preserved existing `faqData={faqData}` wiring and FAQ/JSON-LD parity.

2) Test gate
- Added `tests/net-salary-overtime-article-t059-intent-links.test.mjs`
- RED: `node --test tests/net-salary-overtime-article-t059-intent-links.test.mjs` => FAIL (cluster not present)
- GREEN: `node --test tests/net-salary-overtime-article-t059-intent-links.test.mjs` => PASS (3/3)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation.

4) Deploy gate
- `scripts/deploy-railway.ps1` => SUCCESS
- Deployment ID: `74e6c43b-437a-4390-9e32-1f23b5fcf434`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=74e6c43b-437a-4390-9e32-1f23b5fcf434&`

5) Live proof (canonical route)
- `https://www.kamnuanlek.com/บทความ/เงินเดือน-20000-โอที-10-ชั่วโมง/` => HTTP 200
- `https://calculator-thailand-production.up.railway.app/บทความ/เงินเดือน-20000-โอที-10-ชั่วโมง/` => HTTP 200
- Live HTML on both domains confirms:
  - `net-salary-overtime-article-intent-cluster`
  - `href="/คำนวณเงินเดือนสุทธิ/"`
  - `href="/คำนวณค่าโอที/"`

Ready for CMO QA and next P0 assignment.
