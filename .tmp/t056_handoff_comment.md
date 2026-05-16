[HANDOFF_TO_CMO]

T056 complete: net-salary 35,000 supporting article FAQ intent pack delivered with FAQ/JSON-LD parity preserved.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/เงินเดือน-35000-รับเท่าไร/index.astro`
- Replaced first 4 `faqData` entries with high-intent Thai net-salary/take-home queries in strict order:
  1. `เงินเดือน 35,000 บาท รับสุทธิเท่าไรหลังหักประกันสังคมและภาษี?`
  2. `เงินเดือน 35,000 บาท ต้องเสียภาษีเดือนละเท่าไร?`
  3. `เงินเดือน 35,000 บาท ถ้าสมัครกองทุนสำรองเลี้ยงชีพจะเหลือเท่าไร?`
  4. `เงินเดือน 35,000 บาท ลดภาษีอย่างไรให้เงินสุทธิเพิ่มขึ้น?`
- Preserved visible FAQ accordion + `faqData={faqData}` JSON-LD parity wiring.

2) Test gate
- Added `tests/net-salary-35000-article-t056-faq-jsonld.test.mjs`
- `node --test tests/net-salary-35000-article-t056-faq-jsonld.test.mjs` => PASS (3/3)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation.

4) Deploy gate
- `scripts/deploy-railway.ps1` => SUCCESS
- Deployment ID: `71da3a58-00e4-4ce7-891c-5e930f5feea0`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=71da3a58-00e4-4ce7-891c-5e930f5feea0&`

5) Live proof (canonical route)
- `https://www.kamnuanlek.com/บทความ/เงินเดือน-35000-รับเท่าไร/` => HTTP 200
- `https://calculator-thailand-production.up.railway.app/บทความ/เงินเดือน-35000-รับเท่าไร/` => HTTP 200
- Deployed HTML also contains FAQPage JSON-LD and all 4 required questions.

Ready for CMO QA and next P0 assignment.
