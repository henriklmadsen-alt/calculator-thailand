# CAL-124 Source Validation + Readiness Evidence

Generated: 2026-04-16 23:48:34 +07:00

## Scope

Calculator: /คำนวณค่าไฟฟ้า/ (Electricity Bill Calculator)

## Formula Summary (Implemented)

- ค่าไฟฟ้าฐาน = ผลรวมหน่วยไฟตามอัตราขั้นบันไดของประเภทผู้ใช้
- ค่า Ft = หน่วยไฟฟ้าที่ใช้ x ค่า Ft (บาท/หน่วย)
- รวมก่อน VAT = ค่าไฟฟ้าฐาน + ค่า Ft + ค่าบริการรายเดือน
- VAT = รวมก่อน VAT x 7%
- รวมทั้งสิ้น = รวมก่อน VAT + VAT

Tariff mapping used in code:

- บ้านอยู่อาศัย <= 150 หน่วย: ประเภท 1.1, ค่าบริการ 8.19 บาท/เดือน
- บ้านอยู่อาศัย > 150 หน่วย: ประเภท 1.2, ค่าบริการ 24.62 บาท/เดือน
- กิจการขนาดเล็กแรงดัน < 12kV: ประเภท 2.1.2, ค่าบริการ 33.29 บาท/เดือน

## Official Source Validation (Thai Government / State Utilities)

1. ERC tariff table (ประเภท 1 และ 2): https://www.erc.or.th/th/tariff/1288
2. PEA Ft landing page (latest cycles): https://www.pea.co.th/our-services/tariff/ft
3. PEA Ft PDF Jan-Apr 2026 (ม.ค.-เม.ย. 2569, 0.0972): https://www.pea.co.th/sites/default/files/ft/2025/Ft%20surcharge%20JAN-APR2026_Final_0.pdf
4. PEA Ft PDF May-Aug 2026 (พ.ค.-ส.ค. 2569, 0.1623): https://www.pea.co.th/sites/default/files/ft/2026/Ft%20surcharge%20MAY-AUG%202026_Final_0.pdf
5. Revenue Department VAT 7% extension: https://www.rd.go.th/region/08/chiangrai/265/3664.html

Validation notes:

- ERC page confirms tariff steps 2.3488, 2.9882, 3.2405, 3.6237, 3.7171, 3.2484, 4.2218, 4.4217 and service charges 8.19 / 24.62 / 33.29
- PEA Ft documents confirm 0.0972 (Jan-Apr 2569) and 0.1623 (May-Aug 2569)
- RD confirms VAT remains 7% through 30 Sep 2569

## Example Calculation (Regression Reference)

Example: บ้านอยู่อาศัย 200 หน่วย, Ft = 0.0972 บาท/หน่วย (งวด ม.ค.-เม.ย. 2569)

- ค่าไฟฟ้าฐาน = (150 x 3.2484) + (50 x 4.2218) = 698.35
- ค่า Ft = 200 x 0.0972 = 19.44
- ค่าบริการ = 24.62
- รวมก่อน VAT = 698.35 + 19.44 + 24.62 = 742.41
- VAT 7% = 51.97
- รวมทั้งสิ้น = 794.38 บาท

## Implementation Verification

- node --test src/lib/electricity-bill.test.ts -> PASS (5/5)
- npm run build -> PASS (Astro static build completed)

## Performance Verification (Mobile Lighthouse)

Report: reports/cal124-lighthouse-mobile-2026-04-16.json

- URL tested: http://127.0.0.1:4450/คำนวณค่าไฟฟ้า/
- Performance score: 97
- FCP: 1.6s
- LCP: 1.6s
- CLS: 0.032
- TBT: 160ms

## Deployment Gate Status

- Code and QA checks are ready.
- Per policy, production deployment is pending CEO approval comment on this issue.
