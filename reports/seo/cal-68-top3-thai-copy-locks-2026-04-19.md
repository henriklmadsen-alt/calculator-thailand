# CAL-68 Thai Copy Lock Package (Top-3 upside routes)

Issue: [CAL-68](/CAL/issues/CAL-68)
Trigger comments:
- [comment 1ac51ab7](/CAL/issues/CAL-68#comment-1ac51ab7-fb75-4ac3-ab0e-0146de176094)
- [comment 4bcd0174](/CAL/issues/CAL-68#comment-4bcd0174-9341-46b9-9251-95bcb01481ed)

Scope: production-ready Title/Meta/H1 locks for electricity, OT, and credit-card-installment routes.

## 1) Electricity route
- Route: `https://www.kamnuanlek.com/คำนวณค่าไฟฟ้า/`
- Title lock: `คำนวณค่าไฟฟ้า 2569 | สูตร PEA/MEA + Ft ล่าสุด`
- Meta lock: `คำนวณค่าไฟฟ้า 2569 จากหน่วยใช้งานจริง เช็กค่าไฟฐาน ค่า Ft และยอดรวมก่อน-หลัง VAT สำหรับบ้านอยู่อาศัย พร้อมสรุปทันที`
- H1 lock: `คำนวณค่าไฟฟ้า 2569 (สูตร PEA/MEA + Ft ล่าสุด)`
- Thai search-intent rationale: ผู้ใช้ต้องการ “เช็กบิลทันที” และ “อัปเดตปี 2569” จึงต้องขึ้นคำว่าค่าไฟ+Ft ตั้งแต่ Title/H1
- Assumption/source note: ค่า Ft และโครงสร้างอัตราไฟฟ้าให้อ้างอิงประกาศล่าสุดของ PEA/MEA และ กกพ.; หากมีงวดใหม่ต้องอัปเดตข้อความทันที

## 2) OT route
- Route: `https://www.kamnuanlek.com/คำนวณค่าโอที/`
- Title lock: `คำนวณค่าโอที 2569 | OT 1.5x 2x 3x ตามกฎหมายแรงงาน`
- Meta lock: `คำนวณค่าโอที 2569 จากค่าจ้างและชั่วโมงทำงาน แยกค่าล่วงเวลา วันหยุด และ OT วันหยุดแบบบาทต่อบาท เพื่อเช็กยอดจ่ายก่อนรับเงินเดือน`
- H1 lock: `คำนวณค่าโอที 2569 (OT 1.5x 2x 3x ตามกฎหมายแรงงาน)`
- Thai search-intent rationale: คำค้นหลักคือ “คำนวณค่าโอที” และ “คิด OT ยังไง” จึงต้องใส่ตัวคูณ 1.5x/2x/3x ให้ชัดเพื่อเพิ่ม CTR
- Assumption/source note: ตัวคูณ OT ให้อ้างอิง พ.ร.บ.คุ้มครองแรงงานและข้อมูลสิทธิแรงงานบนเว็บไซต์กระทรวงแรงงาน; หากกฎหมายแก้ไขต้องอัปเดตทันที

## 3) Credit-card installment route
- Route: `https://www.kamnuanlek.com/คำนวณค่างวดบัตรเครดิต/`
- Title lock: `คำนวณค่างวดบัตรเครดิต 2569 | ผ่อนบัตรให้หนี้ลดจริง`
- Meta lock: `คำนวณค่างวดบัตรเครดิต 2569 จากยอดคงค้าง ยอดชำระ และจำนวนวันในรอบบิล เพื่อวางแผนจ่ายเกินขั้นต่ำ ลดดอกเบี้ยสะสม และปิดหนี้เร็วขึ้น`
- H1 lock: `คำนวณค่างวดบัตรเครดิต 2569 (ดอกเบี้ยรายวัน + แผนจ่ายจริง)`
- Thai search-intent rationale: ผู้ค้นหาต้องการ “ผ่อนเท่าไรหนี้ถึงลด” มากกว่าแค่สูตร จึงต้องเน้นผลลัพธ์การลดดอกเบี้ย/ปิดหนี้
- Assumption/source note: เกณฑ์ดอกเบี้ยและการชำระขั้นต่ำอาจเปลี่ยนตามประกาศ ธปท. และเงื่อนไขผู้ออกบัตร; หลีกเลี่ยงตัวเลขคงที่ถ้ายังไม่ยืนยันรอบล่าสุด

## CMO approval notes
- Copy set intentionally avoids hardcoded legal/rate figures in snippets to reduce stale-snippet risk while GSC/deploy parity is still blocked.
- Ready for CMO approval and CTO/SEO application once route/indexability parity is restored.
