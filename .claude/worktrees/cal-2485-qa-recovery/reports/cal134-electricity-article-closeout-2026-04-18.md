# CAL-134 Closeout — Electricity Supporting Article (Thai SEO)

Date: 2026-04-18 (ICT)
Owner: Thai Content Specialist Alpha
Issue: CAL-134

## Delivered URL + Template Compliance
- Article URL (target slug): `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/`
- Minimum length status: passed (`Measure-Object -Word` = 816 words in source file)
- Required structure covered:
  1. H1: `คำนวณค่าไฟฟ้า 2569: สูตรคิดค่าไฟ PEA MEA พร้อมค่า Ft`
  2. โครงสร้างอัตราค่าไฟฟ้าในไทย (ขั้นบันได)
  3. ค่า Ft คืออะไร และส่งผลยังไง
  4. วิธีคำนวณค่าไฟฟ้าทีละขั้น
  5. ตัวอย่างบ้านใช้ 200 หน่วย (มีตัวเลขคำนวณทีละขั้น)
  6. CTA ไปเครื่องคำนวณ `/คำนวณค่าไฟฟ้า/`
  7. FAQ (4 คำถาม)
  8. ลิงก์เครื่องคำนวณ/บทความที่เกี่ยวข้อง

## Files Updated
- `app/src/pages/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/index.astro`
- `app/src/pages/บทความ/index.astro`
- `app/src/pages/คำนวณค่าไฟฟ้า/index.astro`
- `app/src/pages/บทความ/คำนวณค่าน้ำ-2569-อัตราค่าน้ำประปา-กปน-กปภ/index.astro`

## Metadata + Intent Alignment
- Title: `คำนวณค่าไฟฟ้า 2569: สูตรคิดค่าไฟ PEA MEA พร้อมค่า Ft | เครื่องคำนวณไทย`
- Description: Thai intent-aligned summary with formula + 200-unit example + calculator CTA
- Canonical: `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/`
- FAQ integrated via `faqData` in `BlogPostLayout`

## Formula + Source Integrity
Formula statements in article match calculator logic:
- `ค่า Ft = หน่วยไฟที่ใช้ทั้งหมด x ค่า Ft ต่อหน่วย`
- `ค่าไฟรวม ≈ (ค่าไฟฐาน + ค่าบริการ + ค่า Ft) + VAT`

Official sources used in article:
- MEA Type 1 tariff: https://www.mea.or.th/our-services/tariff-calculation/other/D5xEaEwgU
- PEA Ft page: https://www.pea.co.th/our-services/tariff/ft
- PEA Ft Jan-Apr 2026 (0.0972): https://www.pea.co.th/sites/default/files/ft/2025/Ft%20surcharge%20JAN-APR2026_Final_0.pdf
- PEA Ft May-Aug 2026 (0.1623): https://www.pea.co.th/sites/default/files/ft/2026/Ft%20surcharge%20MAY-AUG%202026_Final_0.pdf
- Revenue Department VAT reference: https://www.rd.go.th/region/08/chiangrai/265/3664.html

## Internal Linking Completed
Updated internal links to the target slug in:
- Article index listing
- Electricity calculator related-reading block
- Water article related-article block

## Verification
Command run:
- `npm run build` (in `app/`)

Result:
- PASS (exit code 0)
- Route generated: `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/`
- Public content guard passed

## Notes
- Legacy page `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/` still exists in repo history but is no longer the promoted internal target in updated discovery links.
