# CAL-409 Thai Content: VAT 7% SERP Copy / Source / Internal-link Refresh

Generated: 2026-04-19 (ICT)  
Owner: Thai Content Specialist Alpha  
Manager line: CMO

## Scope delivered
- Refreshed VAT calculator page copy for stronger search-intent match on high-intent queries (`คำนวณ VAT 7%`, `บวกภาษี`, `ถอดภาษี`, `สูตร VAT`).
- Added source-backed trust section and date-specific VAT-rate caveat (VAT 7% extension to 30 กันยายน 2569).
- Added contextual in-body internal links (not only related cards) to next-step calculators/articles by user intent.
- Refreshed VAT supporting article metadata and added source mapping section for formula/policy statements.

## Metadata summary
- Calculator page: `/คำนวณภาษีมูลค่าเพิ่ม/`
  - Title: `คำนวณ VAT 7% 2569 (บวกภาษี/ถอดภาษี) พร้อมสูตร | เครื่องคำนวณไทย`
  - Title length: 63
  - Description: `เครื่องคำนวณภาษีมูลค่าเพิ่ม VAT 7% ออนไลน์ฟรี คิดราคารวมภาษีหรือถอด VAT จากราคารวม รองรับหลายรายการ พร้อมสูตรและแหล่งอ้างอิงกรมสรรพากร`
  - Description length: 134
- Supporting article: `/บทความ/ภาษีมูลค่าเพิ่ม-7-คิดยังไง-สูตรบวกภาษี-ถอดภาษี-ตั้งราคาขายให้ไม่ขาดทุน/`
  - Title: `ภาษีมูลค่าเพิ่ม 7% คิดยังไง 2569: สูตรบวกภาษี ถอดภาษี ตั้งราคาขายไม่ขาดทุน | เครื่องคำนวณไทย`
  - Title length: 92
  - Description: `สรุปวิธีคิด VAT 7% ปี 2569 ทั้งสูตรบวกและสูตรถอด พร้อมตัวอย่างตั้งราคา ข้อพลาดที่พบบ่อย ลิงก์คำนวณต่อ และแหล่งอ้างอิงกรมสรรพากร`
  - Description length: 127

## Formula + source mapping
- Formula statements used:
  - `VAT = ราคาก่อน VAT x 0.07`
  - `ราคารวม VAT = ราคาก่อน VAT x 1.07`
  - `ราคาก่อน VAT = ราคารวม VAT ÷ 1.07`
  - `VAT = ราคารวม VAT - ราคาก่อน VAT`
- Policy statements used:
  - VAT current applied rate = 7% (extension statement to 30 กันยายน 2569)
  - Registration threshold context = 1,800,000 บาทต่อปี
  - Exemption/legal context = มาตรา 81(1), 81/1 (อ้างอิงประมวลรัษฎากร)
- Source URLs referenced in-page:
  - https://www.rd.go.th/fileadmin/user_upload/news/2568thai/news34_2568.pdf
  - https://www.rd.go.th/5206.html
  - https://www.rd.go.th/27801.html

### Source availability check (2026-04-19 ICT)
- `https://www.rd.go.th/fileadmin/user_upload/news/2568thai/news34_2568.pdf` -> HTTP 200
- `https://www.rd.go.th/5206.html` -> HTTP 200
- `https://www.rd.go.th/27801.html` -> HTTP 200

## Internal-link refresh summary
- Added/strengthened contextual links in VAT calculator page:
  - `/คำนวณเปอร์เซ็นต์/`
  - `/บทความ/ภาษีมูลค่าเพิ่ม-7-คิดยังไง-สูตรบวกภาษี-ถอดภาษี-ตั้งราคาขายให้ไม่ขาดทุน/`
  - `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
  - `/คำนวณค่าไฟฟ้า/`
  - `/คำนวณดอกเบี้ยบัตรเครดิต/`
- Added contextual links in VAT supporting article:
  - `/คำนวณภาษีมูลค่าเพิ่ม/`
  - `/คำนวณเปอร์เซ็นต์/`
  - `/คำนวณเงินเดือนสุทธิ/`
  - `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
  - `/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`

## Files changed
- `src/pages/คำนวณภาษีมูลค่าเพิ่ม/index.astro`
- `src/pages/บทความ/ภาษีมูลค่าเพิ่ม-7-คิดยังไง-สูตรบวกภาษี-ถอดภาษี-ตั้งราคาขายให้ไม่ขาดทุน/index.astro`
- `docs/superpowers/plans/2026-04-19-cal-409-vat-serp-copy-source-internal-link-refresh.md`
- `reports/cal-409-vat-7-serp-copy-source-internal-link-refresh-2026-04-19.md`

## Verification
- Command: `npm run build`
- Result: PASS
- Build summary: `41 page(s) built`
- Build output included VAT routes:
  - `/คำนวณภาษีมูลค่าเพิ่ม/index.html`
  - `/บทความ/ภาษีมูลค่าเพิ่ม-7-คิดยังไง-สูตรบวกภาษี-ถอดภาษี-ตั้งราคาขายให้ไม่ขาดทุน/index.html`
- Internal-link route check in `dist`: PASS for all newly added links
