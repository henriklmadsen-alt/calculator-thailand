# CAL-404 Electricity SERP Copy + Internal-Link Refresh (2026-04-19)

## Scope
- Issue: [CAL-404](/CAL/issues/CAL-404)
- Lane: Thai Content Specialist Alpha (reporting via CMO)
- Goal: refresh electricity-cluster SERP copy and strengthen calculator-intent internal-link flow

## Files Updated
- `src/pages/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/index.astro`
- `src/pages/คำนวณค่าไฟฟ้า/index.astro`
- `src/pages/บทความ/index.astro`
- `docs/superpowers/plans/2026-04-19-cal-404-electricity-serp-internal-link-refresh.md`

## SERP Copy Refresh

### 1) Electricity article route
- Route: `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/`
- Updated `title`:
  - `คำนวณค่าไฟฟ้า 2569 | สูตรคิดค่าไฟบ้าน PEA/MEA + Ft | เครื่องคำนวณไทย`
- Updated `description`:
  - `เช็กบิลค่าไฟบ้านปี 2569 แบบทีละขั้น: ค่าไฟฐาน ค่า Ft ค่าบริการ และ VAT 7% พร้อมตัวอย่าง 200/300/400 หน่วย และลิงก์เครื่องคำนวณค่าไฟฟ้า`
- Updated H1 to align with search intent:
  - `คำนวณค่าไฟฟ้า 2569: สูตรคิดค่าไฟบ้าน PEA/MEA และวิธีเช็กบิลจริง`
- Updated `modifiedDate` to `2026-04-19`.

### 2) Electricity calculator route
- Route: `/คำนวณค่าไฟฟ้า/`
- Updated `pageTitle`:
  - `คำนวณค่าไฟฟ้า 2569 | เช็กบิลบ้าน MEA/PEA พร้อม Ft และ VAT | เครื่องคำนวณไทย`
- Updated `pageDescription`:
  - `เครื่องคำนวณค่าไฟฟ้าบ้านปี 2569 เช็กบิลจากหน่วยใช้จริง รองรับ MEA/PEA คิดค่าไฟฐาน ค่า Ft ค่าบริการ และ VAT 7% พร้อมตารางรายขั้น`
- Updated H1 and intro copy to include common query intent (`เช็กบิล`, `200/300/400 หน่วย`).

### 3) Article hub card alignment
- Route: `/บทความ/`
- Updated electricity card description to match refreshed SERP messaging:
  - `เช็กบิลค่าไฟบ้านปี 2569 แบบทีละขั้น พร้อมสูตร PEA/MEA ค่า Ft ล่าสุด และตัวอย่าง 200/300/400 หน่วยก่อนใช้เครื่องคำนวณ`

## Internal-Link Refresh

### Article -> Cluster links (`/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/`)
- `/คำนวณค่าไฟฟ้า/` (primary calculator CTA and related-tools link)
- `/คำนวณภาษีมูลค่าเพิ่ม/`
- `/คำนวณเปอร์เซ็นต์/`
- `/บทความ/ค่าน้ำประปา-2569-วางแผนค่าใช้จ่าย-และอ่านบิล/`
- `/บทความ/`

### Calculator -> Cluster links (`/คำนวณค่าไฟฟ้า/`)
- `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/` (refreshed promo block + related card)
- `/คำนวณภาษีมูลค่าเพิ่ม/`
- `/คำนวณเปอร์เซ็นต์/`
- `/บทความ/ค่าน้ำประปา-2569-วางแผนค่าใช้จ่าย-และอ่านบิล/`
- `/คำนวณผ่อนกู้/`

## Formula/Source Integrity
- No formula logic changes.
- No numeric claim changes.
- Existing official references on electricity and VAT remain intact (MEA/PEA/กกพ./กรมสรรพากร links unchanged in content).

## Verification
- Command: `npm run build`
- Result: PASS
- Key output:
  - `src/pages/คำนวณค่าไฟฟ้า/index.astro -> /คำนวณค่าไฟฟ้า/index.html`
  - `src/pages/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/index.astro -> /บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/index.html`
  - `src/pages/บทความ/index.astro -> /บทความ/index.html`
  - `41 page(s) built`
