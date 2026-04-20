# CAL-252 P0 Live Incident — Section Verdict (Pre-Deploy)

Date: 2026-04-19 (ICT)
Context: P0 live-site copy-signoff path tied to [CAL-251](/CAL/issues/CAL-251)

## Current live verdict by affected section

1. Brand tagline (header): **FAIL**
- Live evidence: `à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸„à¸³à¸™à¸§à¸“à¹„à¸—à¸¢`
- Corrected Thai: `เครื่องคำนวณไทย`
- Classification: `PURE_MOJIBAKE`

2. Navigation/footer labels: **FAIL**
- Live evidence includes mojibake labels (e.g., `à¸«à¸™à¹‰à¸²à¹à¸£à¸`, `à¸šà¸—à¸„à¸§à¸²à¸¡`, etc.)
- Corrected Thai labels:
  - `หน้าแรก`
  - `บทความ`
  - `คำนวณภาษี`
  - `ผ่อนกู้`
  - `ผ่อนรถ`
  - `ดอกเบี้ยเงินฝาก`
  - `คำนวณค่าน้ำ`
- Classification: `PURE_MOJIBAKE`

3. Homepage hero copy: **PASS**
- Live evidence: `Kamnuanlek เครื่องคำนวณไทย คำนวณการเงินที่ต้องใช้วันนี้`
- Classification: `NO_ACTION`

4. Homepage trust section copy: **PASS**
- Live evidence heading: `ข้อมูลความน่าเชื่อถือ`
- Classification: `NO_ACTION`

5. Calculator listing chips (homepage quickstart): **PASS**
- Live evidence sample: `ภาษีเงินได้, ค่าโอที, ค่าไฟฟ้า, ดอกเบี้ยบัตรเครดิต, อัตราแลกเปลี่ยน, เปอร์เซ็นต์, ผ่อนรถ, ผ่อนบ้าน`
- Classification: `NO_ACTION`

## Wording-quality assessment (separate from encoding)
- From current affected sections, there is **no mandatory Thai wording rewrite**.
- Incident-critical defects are encoding/mojibake in shared brand + footer/nav copy.

## What must be checked again immediately after deploy
Post-deploy recheck gates (CMO final signoff):
1. Header brand subtitle renders as `เครื่องคำนวณไทย` in both light/dark theme.
2. Footer/nav labels render as proper Thai (no mojibake) and link to correct Thai slugs.
3. Footer legal line renders with correct symbols and Thai text:
   - `© 2026 Kamnuanlek | เครื่องคำนวณไทย — ข้อมูลเพื่อการศึกษาเท่านั้น`
4. Shared SEO fields using same source strings are clean:
   - `og:site_name`
   - `alternateName` in JSON-LD
   - breadcrumb labels where applicable
5. Marker sweep returns zero for mojibake tokens in rendered HTML:
   - `à¸`, `à¹`, `Â©`, `â€”`, `Ã`, `�`

## Current blocker and next dependency
Blocker:
- Final CMO PASS/FAIL cannot be closed yet because deploy-level patch evidence from [CAL-251](/CAL/issues/CAL-251) is not yet posted for this run.

Next dependency required:
- CTO/FRE provide production patch evidence for [CAL-251](/CAL/issues/CAL-251):
  - deploy timestamp
  - production URL confirmation
  - affected-file patch reference/commit SHA
  - quick proof screenshot or HTML evidence showing corrected header/footer Thai text

Once that evidence lands, CMO can execute immediate final section-by-section signoff.
