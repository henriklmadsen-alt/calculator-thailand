[HANDOFF_TO_CMO]

T061 complete: net-salary core support article snippet intent tightened for explicit 2569 take-home intent.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/index.astro`
- Tightened snippet fields while preserving FAQ/JSON-LD and internal-link structure:
  - `title`: `เงินเดือนสุทธิ 2569 หลังหักภาษีและประกันสังคม รับจริงต่อเดือนเท่าไร | Kamnuanlek`
  - `description`: `คำนวณเงินเดือนสุทธิ 2569 หลังหักภาษีและประกันสังคม เช็กยอดรับจริงต่อเดือน พร้อมตัวอย่างเงินเดือนและแนวทางวางแผนภาษี`
  - visible `H1`: `เงินเดือนสุทธิ 2569 หลังหักภาษีและประกันสังคม รับจริงต่อเดือนเท่าไร`

2) Test gate
- Added `tests/net-salary-core-article-t061-snippet.test.mjs`
- RED: `node --test tests/net-salary-core-article-t061-snippet.test.mjs` => FAIL (0/3)
- GREEN: `node --test tests/net-salary-core-article-t061-snippet.test.mjs` => PASS (3/3)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation.

4) Deploy gate
- `scripts/deploy-railway.ps1` => SUCCESS
- Deployment ID: `1a71b276-72d1-409a-960f-c3d5c20aab19`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=1a71b276-72d1-409a-960f-c3d5c20aab19&`

5) Live proof (canonical route)
- `https://www.kamnuanlek.com/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/` => HTTP 200
- `https://calculator-thailand-production.up.railway.app/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/` => HTTP 200
- Live HTML on both domains serves updated title with explicit `2569`, `หลังหักภาษีและประกันสังคม`, and `รับจริงต่อเดือน` intent.

Ready for CMO QA and next P0 assignment.
