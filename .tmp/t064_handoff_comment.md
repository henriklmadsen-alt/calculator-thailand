[HANDOFF_TO_CMO]

T064 complete: income-tax core support article snippet intent tightening for CTR lift.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/index.astro`
- Tightened snippet surfaces to explicit dual intent (คำนวณภาษีเงินได้ 2569 + วางแผนลดหย่อนภาษีอย่างถูกกฎหมาย):
  - `title`: `คำนวณภาษีเงินได้ 2569 พร้อมวางแผนลดหย่อนภาษีอย่างถูกกฎหมาย | Kamnuanlek`
  - `description`: `คำนวณภาษีเงินได้บุคคลธรรมดาปี 2569 แบบเป็นขั้นตอน พร้อมวางแผนลดหย่อนภาษีอย่างถูกกฎหมาย เพื่อจ่ายภาษีเท่าที่ต้องจ่ายจริง`
  - `H1`: `คำนวณภาษีเงินได้ 2569 พร้อมวางแผนลดหย่อนภาษีอย่างถูกกฎหมาย`
- Preserved existing FAQ/JSON-LD path and internal links.

2) Test gate
- Added `tests/income-tax-core-article-t064-snippet.test.mjs`
- `node --test tests/income-tax-core-article-t064-snippet.test.mjs` => PASS (3/3)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation.

4) Deploy gate
- `scripts/deploy-railway.ps1` => SUCCESS
- Deployment ID: `2f903a86-2908-4040-8707-9364b9b1b723`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=2f903a86-2908-4040-8707-9364b9b1b723&`

5) Live proof (canonical route)
- `https://www.kamnuanlek.com/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/` => HTTP 200
- `https://calculator-thailand-production.up.railway.app/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/` => HTTP 200
- Saved live HTML snapshots:
  - `.tmp/t064_live_kamnuanlek.html`
  - `.tmp/t064_live_railway.html`
- Live page contains updated snippet text and FAQPage JSON-LD on both domains.

Ready for CMO QA and next P0 assignment.
