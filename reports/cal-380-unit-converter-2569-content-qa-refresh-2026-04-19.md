# CAL-380 Content QA: Unit-converter 2569 Article / Source / Internal-link Refresh

Generated: 2026-04-19 (ICT)
Owner: Thai Content Specialist Alpha
Manager line: CMO

## Scope delivered
- Refreshed supporting article content on `/บทความ/แปลงหน่วย-2569-เมตร-กิโลกรัม-เซลเซียส-ไร่/` to strengthen source attribution for formula statements.
- Added contextual internal links inside formula sections (length/inch, temperature, Thai land area) so users can continue by intent without relying only on footer links.
- Added explicit fallback links in the CTA notice while `/แปลงหน่วย/` calculator route remains unpublished.
- Expanded source section with direct NIST formula reference (Guide to SI Appendix B.8).

## Metadata summary
- Title:
  - `แปลงหน่วย ปี 2569 | เมตร กิโลกรัม ไร่ งาน | เครื่องคำนวณไทย`
  - Length: 59 characters
- Description:
  - `วิธีแปลงหน่วยปี 2569 ทั้งความยาว น้ำหนัก อุณหภูมิ และพื้นที่ไทย (ไร่-งาน-ตารางวา) พร้อมตัวอย่างคำนวณจริงและลิงก์เครื่องแปลงหน่วย`
  - Length: 128 characters
- Canonical:
  - `/บทความ/แปลงหน่วย-2569-เมตร-กิโลกรัม-เซลเซียส-ไร่/`

## Source links used (formula statements)
- กรมที่ดิน (ผ่าน Thai-GDC):
  - https://gdcatalognhic.nha.co.th/dataset/land-rights-document
  - Used for: `1 ไร่ = 400 ตารางวา`, `1 งาน = 100 ตารางวา`
- กองทัพอากาศไทย (อุตุนิยมวิทยาการบิน):
  - https://weather.rtaf.mi.th/observation/library_files/observer/9_TEMPERATURE%20AND%20DEWPOINT.pdf
  - Used for: Thai operational context for Fahrenheit/Celsius usage
- NIST SP 365 (2024):
  - https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.365-2024.pdf
  - Used for: inch/metric factors and temperature conversion reference set
- NIST Guide to SI Appendix B.8:
  - https://www.nist.gov/physical-measurement-laboratory/nist-guide-si-appendix-b8
  - Used for: explicit formula mapping `°F ↔ °C`
- NIST OWM conversion guidance:
  - https://www.nist.gov/pml/owm/metric-si/unit-conversion/approximate-conversions-us-customary-measures-metric

### Source link availability check (2026-04-19 16:53 ICT)
- `https://gdcatalognhic.nha.co.th/dataset/land-rights-document` -> HTTP 200
- `https://weather.rtaf.mi.th/observation/library_files/observer/9_TEMPERATURE%20AND%20DEWPOINT.pdf` -> HTTP 200
- `https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.365-2024.pdf` -> HTTP 200
- `https://www.nist.gov/physical-measurement-laboratory/nist-guide-si-appendix-b8` -> HTTP 200
- `https://www.nist.gov/pml/owm/metric-si/unit-conversion/approximate-conversions-us-customary-measures-metric` -> HTTP 200

## Internal-link refresh summary
- Added contextual links in body content:
  - `/บทความ/แปลงนิ้วเป็นเซนติเมตร-2569-สูตร-ตารางเทียบ/`
  - `/บทความ/แปลงฟาเรนไฮต์เป็นเซลเซียส-2569-สูตร-พร้อมตัวอย่าง/`
  - `/บทความ/แปลงไร่-งาน-ตารางวา-เป็นตารางเมตร-2569/`
- Existing related-calculator/article links retained and revalidated.

### Internal-link route audit (article page)
- OK:
  - `/คำนวณเปอร์เซ็นต์/`
  - `/คำนวณค่าโอนบ้าน/`
  - `/คำนวณค่าไฟฟ้า/`
  - `/บทความ/แปลงนิ้วเป็นเซนติเมตร-2569-สูตร-ตารางเทียบ/`
  - `/บทความ/แปลงฟาเรนไฮต์เป็นเซลเซียส-2569-สูตร-พร้อมตัวอย่าง/`
  - `/บทความ/แปลงไร่-งาน-ตารางวา-เป็นตารางเมตร-2569/`
  - `/บทความ/คำนวณเปอร์เซ็นต์-2569-สูตรลัด-ส่วนลด-กำไร/`
  - `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/`
  - `/บทความ/ค่าโอนบ้าน-2569-มีอะไรบ้าง-คำนวณอย่างไร/`
- Dependency (still missing route file):
  - `/แปลงหน่วย/`

## Files changed
- `src/pages/บทความ/แปลงหน่วย-2569-เมตร-กิโลกรัม-เซลเซียส-ไร่/index.astro`
- `reports/cal-380-unit-converter-2569-content-qa-refresh-2026-04-19.md`

## Verification
- Command: `npm run build`
- Result: PASS
- Build evidence:
  - `/บทความ/แปลงหน่วย-2569-เมตร-กิโลกรัม-เซลเซียส-ไร่/index.html`
  - `[build] 38 page(s) built in 2.26s`

## Blocker / escalation note (for CMO)
- Content QA scope is complete.
- Engineering dependency remains: calculator route `/แปลงหน่วย/` is not present in `src/pages` at this heartbeat.
- Mitigation shipped in article: explicit fallback links to the three unit-specific supporting articles until CAL-131 publishes the calculator route.
