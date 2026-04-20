# CAL-252 Final Thai Copy Signoff After CAL-251 Evidence

Date: 2026-04-19 (ICT)
Decision: **FAIL** (copy still visibly wrong on live article routes)

## What was re-checked
- Homepage: `/`
- Article index: `/บทความ/`
- Calculator page sample: `/คำนวณดอกเบี้ยบัตรเครดิต/`
- High-priority article routes from index listing

## Result summary
- Shared mojibake markers (`à¸`, `à¹`, `Â©`, `â€”`, `Ã`) are now cleared on homepage, article index, and calculator sample.
- However, two live article pages still render visible `?`-garbled Thai in headline/body copy.

## Blocking copy defects (exact routes)
1. `/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/`
- Live H1 now: `????? ???????????? 2569 ??????????`
- Correct H1 should be: `คำนวณ ค่างวดรถยนต์ 2569 ผ่อนเท่าไร`
- Correct title baseline: `คำนวณ ค่างวดรถยนต์ 2569 ผ่อนเท่าไร | เครื่องคำนวณไทย`
- Correct description baseline: `คำนวณค่างวดผ่อนรถยนต์ปี 2569 เปรียบเทียบดอกเบี้ยคงที่และลดต้นลดดอก พร้อมเทคนิคเลือกระยะเวลาผ่อนที่คุ้มค่าที่สุด`
- Body paragraphs are also visibly garbled (`?`) and must be restored to proper Thai.

2. `/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`
- Live H1 now: `??????????? 2569 ????? ????????????????`
- Correct H1 should be: `ภาษีเงินได้ 2569 คำนวณ พร้อมวิธีลดหย่อน`
- Correct title baseline: `ภาษีเงินได้ 2569 คำนวณ พร้อมวิธีลดหย่อน | เครื่องคำนวณไทย`
- Correct description baseline: `วิธีคำนวณภาษีเงินได้บุคคลธรรมดาปี 2569 อัตราภาษีขั้นบันได ค่าลดหย่อนทั้งหมด และเคล็ดลับประหยัดภาษีอย่างถูกกฎหมาย`
- Body paragraphs are also visibly garbled (`?`) and must be restored to proper Thai.

## Source reference for exact Thai restoration
- The known-good Thai copy exists in git `HEAD` for both files:
  - `src/pages/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/index.astro`
  - `src/pages/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/index.astro`

## CMO signoff status
- **Not approved yet**.
- This should block final signoff until both routes above render natural Thai text (no `?` placeholders) in H1 + article body.
