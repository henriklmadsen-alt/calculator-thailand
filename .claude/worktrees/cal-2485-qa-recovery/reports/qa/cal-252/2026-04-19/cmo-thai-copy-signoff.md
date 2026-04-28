# CAL-252 CMO QA — Thai Copy Correctness Signoff (Mojibake Hotfix)

Date: 2026-04-19 (ICT)
Reviewer: CMO
Verdict: FAIL (do not sign off)

## Scope checked
- Live homepage: `/`
- Live article index: `/บทความ/`
- Live calculator pages: `/คำนวณดอกเบี้ยบัตรเครดิต/`, `/คำนวณค่าไฟฟ้า/`, `/คำนวณเปอร์เซ็นต์/`, `/คำนวณค่าโอที/`, `/คำนวณค่าน้ำ/`
- Live article detail: `/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/`

## Live scan summary
Automated marker scan (`à¸|à¹|Â©|â€”|Ã|�`) detected mojibake on every checked route.

- `/` -> markers=384
- `/บทความ/` -> markers=391
- `/คำนวณดอกเบี้ยบัตรเครดิต/` -> markers=391
- `/คำนวณค่าไฟฟ้า/` -> markers=391
- `/คำนวณเปอร์เซ็นต์/` -> markers=391
- `/คำนวณค่าโอที/` -> markers=391
- `/คำนวณค่าน้ำ/` -> markers=391
- `/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/` -> markers=632

## Failing sections and exact corrections
1. Global brand subtitle (`header`, `footer`, OG/WebSite/Organization alternate name)
- Broken: `à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸„à¸³à¸™à¸§à¸“à¹„à¸—à¸¢`
- Correct: `เครื่องคำนวณไทย`

2. Breadcrumb labels (UI + BreadcrumbList JSON-LD)
- Broken: `à¸«à¸™à¹‰à¸²à¹à¸£à¸` -> Correct: `หน้าแรก`
- Broken: `à¸šà¸—à¸„à¸§à¸²à¸¡` -> Correct: `บทความ`

3. Article summary heading
- Broken: `à¸ªà¸£à¸¸à¸›à¸ªà¸±à¹‰à¸™: à¸šà¸—à¸„à¸§à¸²à¸¡à¸™à¸µà¹‰à¸Šà¹ˆà¸§à¸¢à¸­à¸°à¹„à¸£`
- Correct: `สรุปสั้น: บทความนี้ช่วยอะไร`

4. Article disclaimer block
- Broken heading starts with: `à¸‚à¹‰à¸­à¸ˆà¸³à¸à¸±à¸”à¸„à¸§à¸²à¸¡à¸£à¸±à¸šà¸œà¸´à¸”à¸Šà¸­à¸š:`
- Correct full text:
  `ข้อจำกัดความรับผิดชอบ: บทความนี้จัดทำขึ้นเพื่อให้ความรู้ทั่วไปเท่านั้น ไม่ถือเป็นคำแนะนำทางการเงินหรือภาษี กรุณาปรึกษาผู้เชี่ยวชาญก่อนตัดสินใจทางการเงิน`

5. Related calculators heading and chips
- Broken heading: `à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸„à¸³à¸™à¸§à¸“à¸—à¸µà¹ˆà¹€à¸à¸µà¹ˆà¸¢à¸§à¸‚à¹‰à¸­à¸‡`
- Correct heading: `เครื่องคำนวณที่เกี่ยวข้อง`
- Broken labels/links for chips and footer nav should be restored to Thai slugs/text, for example:
  - `/คำนวณภาษีเงินได้บุคคลธรรมดา/` -> `คำนวณภาษี`
  - `/คำนวณเงินเดือนสุทธิ/` -> `เงินเดือนสุทธิ`
  - `/คำนวณผ่อนรถ/` -> `ผ่อนรถ`
  - `/คำนวณดอกเบี้ยเงินฝาก/` -> `ดอกเบี้ยเงินฝาก`

6. Footer legal line
- Broken: `Â© ... â€” ...`
- Correct: `© 2026 Kamnuanlek | เครื่องคำนวณไทย — ข้อมูลเพื่อการศึกษาเท่านั้น`

## Root-cause assessment
- Primary issue is encoding/mojibake regression, not Thai wording quality.
- Thai copy that remains properly encoded reads naturally and is acceptable.

## Signoff decision
- CMO Thai copy signoff: **FAIL**
- Action required: CTO must patch encoding corruption in shared layouts and redeploy before re-review.
