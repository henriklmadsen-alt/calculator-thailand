# CAL-152 QA Checkpoint - Electricity Article (2026-04-16)

## Scope
- Issue: [CAL-152](/CAL/issues/CAL-152)
- Route: /บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ-pea-mea/
- Source file: $articleSrc

## Build + Render Validation
- Build: 
pm run build passed in current workspace
- Dist output exists: $articleDist

## SEO Metadata Validation
- Title length: 59 (target <= 60)
- Description length: 129 (target <= 160)
- Title: คำนวณค่าไฟฟ้า ปี 2569 | สูตร PEA/MEA + Ft | เครื่องคำนวณไทย
- Description: คำนวณค่าไฟฟ้า 2569 แบบเข้าใจง่าย สรุปอัตราขั้นบันได PEA/MEA ค่า Ft ล่าสุด พร้อมตัวอย่างบ้านใช้ไฟ 200 หน่วยและจุดที่คนชอบคำนวณพลาด

## Schema Validation (rendered HTML)
- Article schema: True
- BreadcrumbList schema: True
- FAQPage schema: True

## Source Verification Set (official)
- PEA Ft hub: https://www.pea.co.th/our-services/tariff/ft
- Ft Jan-Apr 2569: https://www.pea.co.th/sites/default/files/ft/2025/Ft%20surcharge%20JAN-APR2026_Final_0.pdf
- Ft May-Aug 2569: https://www.pea.co.th/sites/default/files/ft/2026/Ft%20surcharge%20MAY-AUG2026.pdf
- MEA tariff page: https://www.mea.or.th/our-services/tariff-calculation/other/D5xEaEwgU
- PEA base tariff table: https://www.pea.co.th/sites/default/files/documents/tariff/Electricity_Tariff_2015.pdf
- VAT 7% extension: https://www.rd.go.th/region/08/chiangrai/265/3664.html

## Dependency Status
- CTA target /คำนวณค่าไฟฟ้า/ is still dependent on [CAL-124](/CAL/issues/CAL-124)
- CAL-152 can ship final publish sign-off immediately after CTA target route is available
