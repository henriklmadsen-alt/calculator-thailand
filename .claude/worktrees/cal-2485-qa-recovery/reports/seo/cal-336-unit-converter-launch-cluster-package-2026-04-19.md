# CAL-336 Unit Converter Launch Cluster Package (2026-04-19)

## Scope
- Issue: [CAL-336](/CAL/issues/CAL-336)
- Parent calculator build dependency: [CAL-131](/CAL/issues/CAL-131)
- Target calculator route: `/แปลงหน่วย/` (pending CAL-131 publish)
- Supporting article route: `/บทความ/แปลงหน่วย-2569-เมตร-กิโลกรัม-เซลเซียส-ไร่/`

## 1) Thai Keyword / Intent Validation

### Primary keyword
- `แปลงหน่วย`

### High-intent supporting cluster (Google suggest, Thai locale)
- `แปลงหน่วยนิ้วเป็นเซน`
- `แปลงหน่วย mm เป็น cm`
- `แปลงหน่วยความยาว`
- `แปลง ไร่ งาน ตารางวา`
- `แปลง ไร่ งาน ตาราง วา เป็น ต ร ม`
- `สูตร แปลง ไร่ งาน ตาราง วา`
- `แปลงฟาเรนไฮต์เป็นเซลเซียส`
- `แปลงฟาเรนไฮต์เป็นเซลเซียส สูตร`

### Intent mapping
- Transactional: อยากแปลงหน่วยทันที -> ต้องมี CTA ไปหน้าเครื่องมือ `/แปลงหน่วย/`
- Informational: อยากเข้าใจสูตร -> บทความต้องอธิบายวิธีคิดเป็นขั้น
- Validation: อยากตรวจคำตอบก่อนซื้อ/คำนวณราคา -> ต้องมีตัวอย่างตัวเลขจริงและข้อผิดพลาดที่พบบ่อย

## 2) Official / Authoritative Source Set Used
- กรมที่ดิน (เผยแพร่ผ่าน Thai-GDC): ความสัมพันธ์ `1 ไร่ = 400 ตารางวา`, `1 งาน = 100 ตารางวา`
  - https://gdcatalognhic.nha.co.th/dataset/land-rights-document
- เอกสารอุตุนิยมวิทยาการบิน กองทัพอากาศ: ตารางแปลงฟาเรนไฮต์เป็นเซลเซียส
  - https://weather.rtaf.mi.th/observation/library_files/observer/9_TEMPERATURE%20AND%20DEWPOINT.pdf
- NIST SP 365 (2024): ตัวคูณแปลงหน่วยที่ใช้ทั่วไป (in, ft, mi, lb, temperature)
  - https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.365-2024.pdf
- NIST OWM: แนวปฏิบัติการแปลงหน่วยและการอ้างอิงค่าละเอียด (SP 811)
  - https://www.nist.gov/pml/owm/metric-si/unit-conversion/approximate-conversions-us-customary-measures-metric

## 3) Content Package Implemented

### Article page (publish-ready)
- File: `src/pages/บทความ/แปลงหน่วย-2569-เมตร-กิโลกรัม-เซลเซียส-ไร่/index.astro`
- Includes:
  - H1 ไทย + ปี 2569
  - Intro ที่อธิบายประโยชน์ต่อผู้ใช้ไทย
  - Formula walkthrough (length, mass, temperature, Thai area units)
  - Step-by-step THB-linked example
  - Common mistakes section
  - CTA to calculator route `/แปลงหน่วย/` with explicit dependency note to CAL-131
  - FAQ >= 3 questions
  - Related calculators links + related articles links
  - Source section (official/authoritative URLs)

### Article listing inclusion
- File: `src/pages/บทความ/index.astro`
- Added new article card entry so page is reachable from article listing.

## 4) SEO Metadata Package

### Article metadata (implemented)
- Title tag: `แปลงหน่วย ปี 2569 | เมตร กิโลกรัม ไร่ งาน | เครื่องคำนวณไทย`
- Meta description: `วิธีแปลงหน่วยปี 2569 ทั้งความยาว น้ำหนัก อุณหภูมิ และพื้นที่ไทย (ไร่-งาน-ตารางวา) พร้อมตัวอย่างคำนวณจริงและลิงก์เครื่องแปลงหน่วย`
- Canonical: `/บทความ/แปลงหน่วย-2569-เมตร-กิโลกรัม-เซลเซียส-ไร่/`
- Schema readiness: inherited from `BlogPostLayout.astro`
  - `Article`
  - `BreadcrumbList`
  - `FAQPage` (from `faqData`)

### Calculator metadata (for CAL-131 implementation)
- Route: `/แปลงหน่วย/`
- Recommended title: `แปลงหน่วยวัด | เมตร กิโลกรัม เซลเซียส ไร่ งาน | เครื่องคำนวณไทย`
- Recommended description: `แปลงหน่วยวัดครบในหน้าเดียว: ความยาว น้ำหนัก อุณหภูมิ และพื้นที่ไทย (ไร่ งาน ตารางวา) พร้อมผลลัพธ์ทันทีและสูตรตรวจสอบ`
- Recommended on-page FAQ focus:
  - นิ้วเป็นเซนติเมตร
  - mm/cm/m
  - ฟาเรนไฮต์เป็นเซลเซียส
  - ไร่-งาน-ตารางวา

## 5) Internal Linking Matrix

### Implemented now
- Article -> calculator: `/แปลงหน่วย/` (explicit dependency note shown on page)
- Article -> related calculators (existing):
  - `/คำนวณเปอร์เซ็นต์/`
  - `/คำนวณค่าโอนบ้าน/`
  - `/คำนวณค่าไฟฟ้า/`
- Article -> related articles (existing):
  - `/บทความ/คำนวณเปอร์เซ็นต์-2569-สูตรลัด-ส่วนลด-กำไร/`
  - `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/`
  - `/บทความ/ค่าโอนบ้าน-2569-มีอะไรบ้าง-คำนวณอย่างไร/`

### Pending on CAL-131 publish
- Calculator page `/แปลงหน่วย/` -> supporting article (this new page)
- Calculator page `/แปลงหน่วย/` -> 2-3 related calculators above
- Homepage calculator grid -> add `/แปลงหน่วย/` card (if CAL-131 scope includes homepage surfacing)

## 6) Launch Dependency and Ready State
- This content package is publish-ready from SEO/content side.
- Remaining dependency is engineering publish of calculator route `/แปลงหน่วย/` in CAL-131.
- Once CAL-131 is done, only final smoke check needed:
  - CTA resolves to live calculator route
  - calculator page reciprocally links back to this article
