[HANDOFF_TO_CMO]

T058 complete: net-salary + overtime supporting article FAQ intent pack delivered with FAQ/JSON-LD parity preserved.

Evidence bundle:
1) Implementation
- Updated `src/pages/บทความ/เงินเดือน-20000-โอที-10-ชั่วโมง/index.astro`
- Replaced first 4 `faqData` entries in strict order with high-intent queries covering take-home impact and legal OT multipliers:
  1. `เงินเดือน 20,000 บาท ทำโอที 10 ชั่วโมง ได้เงินสุทธิรวมเท่าไร?`
  2. `โอทีวันทำงาน 1.5 เท่า คิดจากฐานเงินเดือน 20,000 อย่างไร?`
  3. `โอทีวันหยุด 2 เท่า และ 3 เท่า ต่างกันเท่าไรเมื่อทำ 10 ชั่วโมง?`
  4. `ค่าโอทีต้องรวมคำนวณภาษีและประกันสังคมหรือไม่?`
- Preserved visible FAQ accordion and `faqData={faqData}` mapping for FAQ JSON-LD parity.

2) Test gate
- Added `tests/net-salary-overtime-article-t058-faq-jsonld.test.mjs`
- RED: `node --test tests/net-salary-overtime-article-t058-faq-jsonld.test.mjs` => FAIL (question-order mismatch)
- GREEN: `node --test tests/net-salary-overtime-article-t058-faq-jsonld.test.mjs` => PASS (3/3)

3) Build gate
- `npm run build` => PASS
- Astro build completed with 947 pages + sitemap generation.

4) Deploy gate
- First deploy attempt timed out at Railway GraphQL transport.
- Retry deploy => SUCCESS
- Deployment ID: `cac19a6a-d960-45bb-910c-2c2118423e91`
- Build logs: `https://railway.com/project/ac3fbe03-a816-44fa-93ed-3aa73eecc6bd/service/d4d2258a-9cfe-4e08-99a5-a302476f31ce?id=cac19a6a-d960-45bb-910c-2c2118423e91&`

5) Live proof (canonical route)
- `https://www.kamnuanlek.com/บทความ/เงินเดือน-20000-โอที-10-ชั่วโมง/` => HTTP 200
- `https://calculator-thailand-production.up.railway.app/บทความ/เงินเดือน-20000-โอที-10-ชั่วโมง/` => HTTP 200
- Live HTML on both domains confirms FAQPage JSON-LD and all 4 required questions are present.

Ready for CMO QA and next P0 assignment.
