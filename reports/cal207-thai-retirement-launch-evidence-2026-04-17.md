# CAL-207 Completion Evidence (Thai Content Specialist Alpha)

Date: 2026-04-17
Owner: Thai Content Specialist Alpha
Reporting line: CMO

## Scope delivered
- Retirement Calculator launch page (TH)
- Supporting SEO article (TH)
- Internal linking rollout from homepage + article hub

## Published URLs (routes)
1. /คำนวณเงินเกษียณ/
2. /บทความ/คำนวณเงินเกษียณ-2569-วางแผนเงินพอใช้/

## Metadata summary

### 1) Calculator: /คำนวณเงินเกษียณ/
- Title: คำนวณเงินเกษียณ 2569 (2026) | วางแผนเงินพอใช้หลังเกษียณ | เครื่องคำนวณไทย
- Description: คำนวณเงินเกษียณแบบละเอียด: ต้องมีเงินก้อนเท่าไร คาดว่าจะมีเงินเท่าไรเมื่อเกษียณ และขาด/เกินเท่าไร โดยคิดดอกเบี้ยทบต้น + เงินเฟ้อแบบรายเดือน
- Canonical: https://calculator-thailand-production.up.railway.app/คำนวณเงินเกษียณ/

### 2) Article: /บทความ/คำนวณเงินเกษียณ-2569-วางแผนเงินพอใช้/
- Title: คำนวณเงินเกษียณ 2569: ต้องมีเงินเท่าไรถึงพอใช้ | เครื่องคำนวณไทย
- Description: คู่มือคำนวณเงินเกษียณปี 2569 แบบทำได้จริง: ตั้งสมมติฐานเงินเฟ้อ/ผลตอบแทนอย่างไร ต้องมีเงินก้อนเท่าไร และลดช่องว่างเงินเกษียณด้วยแผนที่วัดผลได้
- Canonical: https://calculator-thailand-production.up.railway.app/บทความ/คำนวณเงินเกษียณ-2569-วางแผนเงินพอใช้/

## Internal links added

### Calculator page links
- /บทความ/คำนวณเงินเกษียณ-2569-วางแผนเงินพอใช้/
- /คำนวณดอกเบี้ยเงินฝาก/
- /คำนวณภาษีเงินได้บุคคลธรรมดา/
- /คำนวณเงินเดือนสุทธิ/

### Article page links
- /คำนวณเงินเกษียณ/ (CTA and inline links)
- /คำนวณเงินเดือนสุทธิ/
- /คำนวณดอกเบี้ยเงินฝาก/
- /คำนวณภาษีเงินได้บุคคลธรรมดา/

### Discovery links (site-level)
- Homepage quick chip: /คำนวณเงินเกษียณ/
- Homepage calculator card: /คำนวณเงินเกษียณ/
- Article hub entry: /บทความ/คำนวณเงินเกษียณ-2569-วางแผนเงินพอใช้/

## Formula/source QA
- Formula logic uses monthly compounding + inflation-adjusted retirement spending simulation.
- Example numbers in article align with calculator defaults.
- Source class referenced where relevant: BOT (planning steps + inflation target framework).
- No uncertain hard-claim formula source was added without reference.

## Verification evidence
- Command: npm run build
- Result: PASS
- Public content guard: PASS

## Blockers
- None