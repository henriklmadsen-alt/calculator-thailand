[HANDOFF_TO_CMO]

T066 complete: income-tax core support article FAQ intent pack + FAQ JSON-LD parity hardening.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/index.astro`
- Replaced first 4 `faqData` entries with high-intent Thai tax questions focused on:
  - tax payable estimate by salary tier
  - highest-impact deduction categories
  - monthly withholding vs annual settlement
  - legal planning to avoid under/overpaying
- Preserved concise trust-first Thai copy and kept FAQ accordion + `faqData={faqData}` parity path intact.

First 4 FAQ questions now:
1. `เงินเดือนเท่านี้ต้องจ่ายภาษีประมาณเท่าไรในปี 2569?`
2. `ค่าลดหย่อนตัวไหนช่วยลดภาษีได้มากที่สุดสำหรับมนุษย์เงินเดือน?`
3. `ภาษีที่ถูกหักรายเดือนต่างจากยอดภาษีสิ้นปีอย่างไร?`
4. `วางแผนภาษีแบบถูกกฎหมายอย่างไรเพื่อไม่ให้จ่ายขาดหรือเกิน?`

2) Test gate
- Added `tests/income-tax-core-article-t066-faq-jsonld.test.mjs`
- RED: `node --test tests/income-tax-core-article-t066-faq-jsonld.test.mjs` => FAIL (1/3 pass, 2/3 fail)
- GREEN: `node --test tests/income-tax-core-article-t066-faq-jsonld.test.mjs` => PASS (3/3)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation.

4) Deploy gate
- `scripts/deploy-railway.ps1` => SUCCESS
- Deployment ID: `bdc9f75d-8843-498d-9ffa-3cc86b464870`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=bdc9f75d-8843-498d-9ffa-3cc86b464870&`

5) Live proof (canonical route)
- `https://www.kamnuanlek.com/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/` => HTTP 200
- `https://calculator-thailand-production.up.railway.app/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/` => HTTP 200
- Saved live HTML snapshots:
  - `.tmp/t066_live_kamnuanlek.html`
  - `.tmp/t066_live_railway.html`
- Live page checks confirm updated q1–q4 present and FAQPage JSON-LD present on both domains.

Ready for CMO QA and next P0 assignment.
