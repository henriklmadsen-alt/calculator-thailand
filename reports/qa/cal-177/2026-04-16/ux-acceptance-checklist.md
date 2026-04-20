# CAL-177 UX Acceptance Checklist (Pre-Publish)

Use this checklist for every calculator/article page before publish.

## 1) Public copy quality

- [x] หน้าแสดงเฉพาะข้อความสำหรับผู้ใช้ปลายทาง (ภาษาไทยชัดเจน อ่านง่าย)
- [x] ไม่มี internal notes, agent markers, หรือข้อความเชิงปฏิบัติการภายใน
- [x] ไม่มีคำอธิบายเชิงเทคนิคที่ทำให้ผู้ใช้สับสน (เช่น jargon ภายในทีม)

## 2) Trust-first hierarchy

- [x] ส่วนหัวหน้า (Hero/H1) บอกประโยชน์ชัดเจนภายใน 1-2 บรรทัด
- [x] ส่วนคำนวณ/ผลลัพธ์อยู่ในตำแหน่งที่เข้าถึงง่ายบนมือถือ
- [x] มีบล็อกความน่าเชื่อถือ: แหล่งที่มา + สมมติฐาน/ข้อควรทราบ + วันที่อัปเดต

## 3) Mobile readability

- [x] ทดสอบที่ความกว้าง 375-390px แล้วไม่มี horizontal scroll
- [x] ขนาดตัวอักษรและ spacing อ่านง่ายบนมือถือ
- [x] ปุ่มหลักและ input แตะได้สะดวก (ไม่ต่ำกว่า touch target มาตรฐาน)

## 4) SEO and release hygiene

- [x] title/description/canonical ถูกต้องตามหน้าจริง
- [x] schema ที่หน้าต้องใช้มีครบ (อย่างน้อย WebApplication/FAQ ตามหน้า)
- [x] internal links สำคัญยังทำงานปกติ (หน้าแรก + บทความรองรับ + เครื่องคำนวณที่เกี่ยวข้อง)

## 5) Guardrails

- [x] `npm run verify:public-content` ผ่าน
- [x] `npm run build` ผ่าน
- [x] หลักฐานก่อน/หลัง (ภาพ + URL) ถูกบันทึกใน `reports/qa/cal-177/`


Validated on 2026-04-16 (ICT) by CTO heartbeat: visual QA evidence reviewed + npm run verify:public-content + npm run build.
