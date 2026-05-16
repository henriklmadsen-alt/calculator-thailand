[HANDOFF_TO_CMO]
T081 completed and validated.

Scope delivered:
- Updated first 4 FAQ entries in:
  - `src/pages/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/index.astro`
- Replaced with high-intent Thai filing + deduction decision questions.
- Preserved visible FAQ accordion + FAQ JSON-LD parity via `faqData` mapping.

First 4 FAQ questions now:
1) `ยื่นภาษีเงินได้ปี 2569 ต้องเตรียมข้อมูลอะไรบ้าง?`
2) `คำนวณภาษีเงินได้จากเงินเดือนต้องเริ่มตรงไหน?`
3) `ค่าลดหย่อนแบบไหนช่วยลดภาษีได้คุ้มที่สุดในปี 2569?`
4) `ควรเลือกหักภาษีรายเดือนเท่าไรเพื่อไม่ต้องจ่ายเพิ่มตอนยื่นจริง?`

Acceptance evidence:
1) Regression test added:
- `tests/income-tax-main-article-t081-faq-jsonld.test.mjs`

2) Target test:
- Command: `node --test tests/income-tax-main-article-t081-faq-jsonld.test.mjs`
- Result: PASS (3/3)

3) Build:
- Command: `npm run build`
- Result: PASS (947 pages + sitemap generation)

4) Railway deploy:
- Command: `powershell -ExecutionPolicy Bypass -File scripts/deploy-railway.ps1`
- Result: SUCCESS
- Deployment ID: `6fbcf31f-d12a-4e0c-b4b0-8626de01d0d2`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=6fbcf31f-d12a-4e0c-b4b0-8626de01d0d2&`

5) Live checks on canonical route:
- `https://www.kamnuanlek.com/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89-2569-%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93-%E0%B8%A7%E0%B8%B4%E0%B8%98%E0%B8%B5%E0%B8%A5%E0%B8%94%E0%B8%AB%E0%B8%A2%E0%B9%88%E0%B8%AD%E0%B8%99//`
  - HTTP 200
  - FAQPage present = true
  - intent_count = 4
- `https://calculator-thailand-production.up.railway.app/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89-2569-%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93-%E0%B8%A7%E0%B8%B4%E0%B8%98%E0%B8%B5%E0%B8%A5%E0%B8%94%E0%B8%AB%E0%B8%A2%E0%B9%88%E0%B8%AD%E0%B8%99//`
  - HTTP 200
  - FAQPage present = true
  - intent_count = 4
- Evidence snapshots:
  - `.tmp/t081_live_kamnuanlek.headers.txt`
  - `.tmp/t081_live_kamnuanlek.html`
  - `.tmp/t081_live_railway.headers.txt`
  - `.tmp/t081_live_railway.html`

Ready for independent QA and next P0 assignment.
