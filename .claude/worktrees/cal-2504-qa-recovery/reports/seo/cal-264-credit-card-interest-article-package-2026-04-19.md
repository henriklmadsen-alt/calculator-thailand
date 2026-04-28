# CAL-264 Credit-Card Interest Article Package (2026-04-19)

Reporting manager: CMO  
Issue lane: [CAL-68](/CAL/issues/CAL-68) priority #1

## User-facing URLs

- Primary article URL (new): `/บทความ/คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว/`
- Legacy URL kept live as compatibility route: `/บทความ/ดอกเบี้ยบัตรเครดิต-คิดยังไง-จ่ายขั้นต่ำ-2569/`
- Primary calculator URL: `/คำนวณดอกเบี้ยบัตรเครดิต/`

## Metadata shipped (article)

- Title: `คำนวณดอกเบี้ยบัตรเครดิต 2569 | วิธีคิดและลดหนี้เร็ว | เครื่องคำนวณไทย`
- Description: `อธิบายวิธีคำนวณดอกเบี้ยบัตรเครดิตแบบรายวันตามเกณฑ์ ธปท. ปี 2569 พร้อมตัวอย่างจ่ายขั้นต่ำ 8% จุดพลาดที่ทำให้หนี้ยืด และแผนลดดอกเบี้ยที่ทำได้จริง`
- Canonical: `/บทความ/คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว/`
- Published/Modified: `2026-04-19`

## Content package shipped

- Thai long-form support content aligned to calculator intent (`word_count=1153` via `Intl.Segmenter`)
- Formula section aligned to calculator behavior:
  - daily-rate split (before due / after payment)
  - next-statement balance
  - minimum payment in this tool = statement balance x minimum-payment-rate
- Worked numeric example with consistent outputs:
  - interest before due: `394.52`
  - interest after payment: `405.48`
  - total interest: `800.00`
  - next statement balance: `37,800.00`
  - minimum payment (8%): `3,600.00`
- FAQ block (4 items) + calculator CTAs + related calculators/articles

## Internal-link map updated

- Calculator to article:
  - `/คำนวณดอกเบี้ยบัตรเครดิต/` -> `/บทความ/คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว/`
- Article listing:
  - `/บทความ/` card slug updated to new URL
- Related article references updated to new slug in:
  - `/บทความ/คำนวณอัตราแลกเปลี่ยน-บาท-สกุลเงิน-2569/`
  - `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/`
  - `/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/`
  - `/บทความ/คำนวณเปอร์เซ็นต์-2569-ส่วนลด-กำไร/`
  - `/บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/`

## Official source verification (formula/rate claims)

- BOT credit-card explainer: https://www.bot.or.th/th/satang-story/digital-fin-lit/creditcard.html
- BOT News 47/2568 (minimum payment extension): https://www.bot.or.th/th/news-and-media/news/news-20251204-2.html

## Verification evidence

Commands executed:

```bash
rg -n "คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว" src/pages -S
rg -n "ดอกเบี้ยบัตรเครดิต-คิดยังไง-จ่ายขั้นต่ำ-2569" src/pages -S
npm run build
```

Observed results:

- New slug references present in calculator + article cluster pages
- No stale old-slug references remain in `src/pages` content links
- Build succeeded (`astro build` + `scripts/verify-public-content.mjs`), new and legacy routes generated

## Changed files

- `src/pages/บทความ/คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว/index.astro`
- `src/pages/บทความ/ดอกเบี้ยบัตรเครดิต-คิดยังไง-จ่ายขั้นต่ำ-2569/index.astro`
- `src/pages/คำนวณดอกเบี้ยบัตรเครดิต/index.astro`
- `src/pages/บทความ/index.astro`
- `src/pages/บทความ/คำนวณอัตราแลกเปลี่ยน-บาท-สกุลเงิน-2569/index.astro`
- `src/pages/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/index.astro`
- `src/pages/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/index.astro`
- `src/pages/บทความ/คำนวณเปอร์เซ็นต์-2569-ส่วนลด-กำไร/index.astro`
- `src/pages/บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/index.astro`
