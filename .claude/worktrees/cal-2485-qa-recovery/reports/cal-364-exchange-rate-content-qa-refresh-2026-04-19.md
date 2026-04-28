# CAL-364 Content QA: Exchange-rate 2569 Article / Source / Internal-link Refresh

Generated: 2026-04-19 (ICT)
Owner: Thai Content Specialist Alpha
Manager line: CMO

## Scope delivered
- Refreshed exchange-rate article + calculator metadata to target cleaner SERP snippet lengths.
- Added explicit BOT JPY source-unit caveat (`100 YEN`) in both article and calculator content.
- Expanded related-link coverage on both routes with clear calculator links and related article links.
- Updated this QA report for CMO signoff.

## Metadata summary
- Article title:
  - `คำนวณอัตราแลกเปลี่ยน 2569 | เช็กเรทก่อนแลก | เครื่องคำนวณไทย`
  - Length: 60 characters
- Article description:
  - `คู่มือคำนวณอัตราแลกเปลี่ยนบาทกับสกุลเงินต่างประเทศปี 2569 พร้อมสูตรไป-กลับ ค่าธรรมเนียม จุดเช็กเรท BOT และข้อควรระวัง JPY ที่อาจแสดงเป็น 100 YEN.`
  - Length: 145 characters
- Calculator title:
  - `คำนวณอัตราแลกเปลี่ยน 2569 (2026) | บาท-สกุลเงินต่างประเทศ`
  - Length: 57 characters
- Calculator description:
  - `คำนวณแลกเงินบาทกับสกุลเงินต่างประเทศปี 2569 แบบไป-กลับ ใส่ค่าธรรมเนียมได้ พร้อมคำเตือนหน่วยเรท JPY 100 YEN จาก BOT ก่อนตัดสินใจโอนหรือแลกเงินจริง.`
  - Length: 146 characters
- Canonical:
  - `/บทความ/คำนวณอัตราแลกเปลี่ยน-บาท-สกุลเงิน-2569/`

## Source links used in article/calculator
- BOT Daily Foreign Exchange Rates:
  - https://www.bot.or.th/en/statistics/exchange-rate.html
- BOT Statistics FM_FX_001_S3:
  - https://app.bot.or.th/BTWS_STAT/statistics/BOTWEBSTAT.aspx?language=ENG&reportID=123
- BOT Exchange Rate Description:
  - https://www.bot.or.th/content/dam/bot/documents/en/statistics/exchange%20rate%20description_en.pdf
- Source-unit caveat applied:
  - Added on both pages: if JPY is shown as `THB per 100 YEN`, convert to `THB per 1 YEN` by dividing by 100 before calculation.

### Source link availability check (2026-04-19 16:16 ICT)
- `https://www.bot.or.th/en/statistics/exchange-rate.html` -> HTTP 200
- `https://app.bot.or.th/BTWS_STAT/statistics/BOTWEBSTAT.aspx?language=ENG&reportID=123` -> HTTP 200
- `https://www.bot.or.th/content/dam/bot/documents/en/statistics/exchange%20rate%20description_en.pdf` -> HTTP 200

## Internal links added
- From article to calculator:
  - `/คำนวณอัตราแลกเปลี่ยน/`
- Article related calculators:
  - `/คำนวณเปอร์เซ็นต์/`
  - `/คำนวณดอกเบี้ยเงินฝาก/`
- Article related articles:
  - `/บทความ/คำนวณเปอร์เซ็นต์-2569-สูตรลัด-ส่วนลด-กำไร/`
  - `/บทความ/เงินฝาก-vs-กองทุน-เปรียบเทียบ-2569/`
  - `/บทความ/ดอกเบี้ยบัตรเครดิต-คิดยังไง-จ่ายขั้นต่ำ-2569/`
- Calculator related calculators:
  - `/คำนวณเปอร์เซ็นต์/`
  - `/คำนวณดอกเบี้ยเงินฝาก/`
- Calculator related articles:
  - `/บทความ/คำนวณอัตราแลกเปลี่ยน-บาท-สกุลเงิน-2569/`
  - `/บทความ/คำนวณเปอร์เซ็นต์-2569-สูตรลัด-ส่วนลด-กำไร/`
  - `/บทความ/เงินฝาก-vs-กองทุน-เปรียบเทียบ-2569/`

## Files changed
- `src/pages/บทความ/คำนวณอัตราแลกเปลี่ยน-บาท-สกุลเงิน-2569/index.astro`
- `src/pages/คำนวณอัตราแลกเปลี่ยน/index.astro`
- `reports/cal-364-exchange-rate-content-qa-refresh-2026-04-19.md`

## Verification
- Metadata count recheck:
  - `article_title`: 60
  - `article_description`: 145
  - `calculator_title`: 57
  - `calculator_description`: 146
- Command: `npm run build`
- Result: PASS
- Build time: 2026-04-19 16:51 ICT
- Route generation includes:
  - `/คำนวณอัตราแลกเปลี่ยน/index.html`
  - `/บทความ/คำนวณอัตราแลกเปลี่ยน-บาท-สกุลเงิน-2569/index.html`

## Deploy / indexing blocker (explicit)
- Deploy blocker: none from content QA scope.
- Indexing verification blocker: this workspace has no direct production deploy control and no Google Search Console access, so live crawl/index confirmation cannot be executed from this heartbeat.
- Handoff needed to close indexing loop: run deploy pipeline, then submit/request indexing for `/บทความ/คำนวณอัตราแลกเปลี่ยน-บาท-สกุลเงิน-2569/` and verify in GSC.
