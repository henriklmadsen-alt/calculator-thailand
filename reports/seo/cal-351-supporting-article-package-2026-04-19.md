# CAL-351 Supporting Article Package for Unit Converter Cluster (2026-04-19)

## Scope
- Issue: [CAL-351](/CAL/issues/CAL-351)
- Lane: Thai Content Specialist Alpha (reporting via CMO)
- Revision trigger: CMO comment `dc95850d-8d07-4c50-98aa-8fd95cec71a5` (changes requested)
- Goal: deliver supporting Thai content with sufficient depth, compliant title length, calculator-intent internal links, and source-mapped formulas

## CMO Findings Closed

### 1) Thin-content gap on 3 supporting pages
Expanded all 3 pages with additional non-filler sections focused on practical calculator intent:
- process/checklist for error prevention
- scenario-based real usage
- decision workflow for document, ops, and pricing contexts
- cross-tool flow to relevant calculators

Files updated:
- `src/pages/บทความ/แปลงนิ้วเป็นเซนติเมตร-2569-สูตร-ตารางเทียบ/index.astro`
- `src/pages/บทความ/แปลงฟาเรนไฮต์เป็นเซลเซียส-2569-สูตร-พร้อมตัวอย่าง/index.astro`
- `src/pages/บทความ/แปลงไร่-งาน-ตารางวา-เป็นตารางเมตร-2569/index.astro`

Internal QA count snapshot (post-edit, whitespace token method):
- inch/cm page: `468`
- fahrenheit/celsius page: `448`
- land-unit page: `458`

### 2) Title length > 60 chars on 3 pages
Updated titles (line 5 in each file) to <= 60 chars:
- `แปลงนิ้วเป็นเซนติเมตร 2569: สูตร 2.54 และตารางเทียบ` (51)
- `แปลงฟาเรนไฮต์เป็นเซลเซียส 2569: สูตรและตารางเทียบ` (49)
- `แปลงไร่ งาน ตารางวา เป็นตารางเมตร 2569: สูตรที่ดินไทย` (53)

### 3) Primary calculator CTA dependency not yet live
- Kept intent-aligned CTA links to `/แปลงหน่วย/` on all 3 pages.
- Explicitly retained launch dependency note in content while route is pending.
- Dependency status:
  - Blocked route issue: [CAL-131](/CAL/issues/CAL-131)
  - Required coordination: once CAL-131 ships route `src/pages/แปลงหน่วย/index.astro`, add reciprocal links from calculator page back to CAL-351 supporting articles.

### 4) Land-unit citation transparency
- Added direct Department of Lands URL (non-aggregator):
  - `https://www.dol.go.th/question-answer/1504-123733`
- Added official legal/standards references:
  - `https://www.dit.go.th/media/dmucbmb4/20260212092135_9492.pdf`
  - `https://www.dol.go.th/landmap/DocLib1/standard_kmr101_305_2554.pdf`

## Formula-to-Source Mapping (Explicit)

### A) Inch/Centimeter formulas
- `cm = in × 2.54`
  - Source 1: NIST SP 365 (2024) conversion factors
  - URL: `https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.365-2024.pdf`
  - Source 2 (Thai official): กรมอนามัย กระทรวงสาธารณสุข, รายงานการประเมินพฤติกรรมสุขภาพฯ 2568 (ตารางแปลผล Q5 รอบเอว) ระบุ `1 นิ้ว เท่ากับ 2.54 เซนติเมตร` และ `รอบเอว (นิ้ว) x 2.54 เซนติเมตร`
  - URL: `https://hp.anamai.moph.go.th/web-upload/4xceb3b571ddb70741ad132d75876bc41d/tinymce/OPDC/OPDC2568S/IDC37/OPDC2568_IDC3-7_06.pdf`
- `mm = in × 25.4`
  - Source: Derived from `cm = in × 2.54` and SI relation `1 cm = 10 mm` (NIST SP 365 + Thai official source above)
  - URL: `https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.365-2024.pdf`
- `m = in × 0.0254`
  - Source: Derived from `cm = in × 2.54` and SI relation `100 cm = 1 m` (NIST SP 365 + Thai official source above)
  - URL: `https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.365-2024.pdf`
- Supporting implementation guidance:
  - URL: `https://www.nist.gov/pml/owm/metric-si/unit-conversion/approximate-conversions-us-customary-measures-metric`

### B) Fahrenheit/Celsius formulas
- `C = (F - 32) / 1.8`
  - Source: NIST SP 365 (temperature conversion)
  - URL: `https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.365-2024.pdf`
- `F = (C × 1.8) + 32`
  - Source: NIST SP 365
  - URL: `https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.365-2024.pdf`
- Secondary Thai reference table used in content:
  - URL: `https://weather.rtaf.mi.th/observation/library_files/observer/9_TEMPERATURE%20AND%20DEWPOINT.pdf`

### C) Thai land-unit formulas
- Base relation: `1 ไร่ = 400 ตารางวา`
  - Direct DOL source
  - URL: `https://www.dol.go.th/question-answer/1504-123733`

- Base relation: `1 ตารางวา = 4 ตารางเมตร`
  - DOL standards reference
  - URL: `https://www.dol.go.th/landmap/DocLib1/standard_kmr101_305_2554.pdf`

- Base relation: `1 งาน = 400 ตารางเมตร`
  - DOL standards reference
  - URL: `https://www.dol.go.th/landmap/DocLib1/standard_kmr101_305_2554.pdf`

- Base relation: `1 ไร่ = 1,600 ตารางเมตร`
  - DOL standards reference
  - URL: `https://www.dol.go.th/landmap/DocLib1/standard_kmr101_305_2554.pdf`

- Legal standards basis used for Thai unit normalization:
  - `พระราชบัญญัติมาตราชั่งตวงวัด พ.ศ. 2542` (ฉบับรวมเผยแพร่โดยกรมการค้าภายใน)
  - URL: `https://www.dit.go.th/media/dmucbmb4/20260212092135_9492.pdf`

- Derived (from base relations above):
  - `1 งาน = 100 ตารางวา`
  - `ตารางวารวม = (ไร่ × 400) + (งาน × 100) + ตารางวา`
  - `ตารางเมตร = ตารางวารวม × 4`

Note: the three derived formulas are arithmetic derivations from cited base relations, not independent source claims.

## Cluster Internal Linking Status

- Updated article index listing already contains the 3 CAL-351 pages:
  - `src/pages/บทความ/index.astro`
- Pillar article already links to these supporting pages:
  - `src/pages/บทความ/แปลงหน่วย-2569-เมตร-กิโลกรัม-เซลเซียส-ไร่/index.astro`
- Per-page links retained:
  - CTA to `/แปลงหน่วย/`
  - Related calculator links (`/คำนวณเปอร์เซ็นต์/`, `/คำนวณค่าไฟฟ้า/`, `/คำนวณค่าโอนบ้าน/`)
  - Cross-links among sibling/supporting pages

## Verification Evidence

- Structural checks run:
  - title length check on 3 files: PASS (`51`, `49`, `53`)
  - post-edit content expansion check (internal token method): PASS
  - inch/cm article includes official Thai source citation in body + reference list: PASS
  - section A formula mapping includes explicit Thai source-to-formula linkage: PASS
- Build command run: `npm run build` (2026-04-19, ICT)
- Build output (key lines):
  - `[build] ✓ Completed in 2.03s.`
  - `/บทความ/แปลงนิ้วเป็นเซนติเมตร-2569-สูตร-ตารางเทียบ/index.html (+2ms)`
  - `/บทความ/แปลงฟาเรนไฮต์เป็นเซลเซียส-2569-สูตร-พร้อมตัวอย่าง/index.html (+2ms)`
  - `/บทความ/แปลงไร่-งาน-ตารางวา-เป็นตารางเมตร-2569/index.html (+2ms)`
  - `[build] 35 page(s) built in 2.54s`
  - `[build] Complete!`

## Revision Summary
- 3/3 target supporting pages expanded significantly and aligned to calculator intent.
- 3/3 target titles now <= 60 characters.
- `/แปลงหน่วย/` dependency explicitly documented with CAL-131 linkage.
- Land-unit formula provenance upgraded from aggregator-only to direct DOL/legal standards with explicit formula mapping.
