# CAL-252 Pre-Deploy Copy Pack (from CAL-38 board screenshots)

Date: 2026-04-19 (ICT)
Owner: CMO
Source screenshots:
- `499230d1-77b8-47b3-b8d9-ef404702ea06` (footer/nav mojibake)
- `7bec91bf-63d1-4b4d-9bc4-82d23845d082` (header/home/trust view)

## Scope completed now (unblocked prep)
- Reviewed board screenshots in [CAL-38 comment 8197a1b6](/CAL/issues/CAL-38#comment-8197a1b6-6b65-4d29-9486-fbc1d8553668)
- Extracted visible copy defects in brand/header/footer/homepage/trust areas
- Prepared corrected Thai strings for CTO patch
- Classified each item as:
  - `PURE_MOJIBAKE` (encoding corruption only)
  - `WORDING_IMPROVEMENT` (Thai wording should be improved too)

## Corrected Thai copy list

### A) PURE_MOJIBAKE (fix encoding, keep intended wording)

1. Brand subtitle (header + footer)
- Broken: `à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸„à¸³à¸™à¸§à¸“à¹„à¸—à¸¢`
- Correct: `เครื่องคำนวณไทย`

2. Footer navigation labels (visible in screenshot 4992…)
- Broken: `à¸«à¸™à¹‰à¸²à¹à¸£à¸` -> Correct: `หน้าแรก`
- Broken: `à¸šà¸—à¸„à¸§à¸²à¸¡` -> Correct: `บทความ`
- Broken: `à¸„à¸³à¸™à¸§à¸“à¸ à¸²à¸©à¸µ` -> Correct: `คำนวณภาษี`
- Broken: `à¸œà¹ˆà¸­à¸™à¸à¸¹à¹‰` -> Correct: `ผ่อนกู้`
- Broken: `à¸œà¹ˆà¸­à¸™à¸£à¸–` -> Correct: `ผ่อนรถ`
- Broken: `à¸”à¸­à¸à¹€à¸šà¸µà¹‰à¸¢à¹€à¸‡à¸´à¸™à¸à¸²à¸` -> Correct: `ดอกเบี้ยเงินฝาก`
- Broken: `à¸„à¸³à¸™à¸§à¸“à¸„à¹ˆà¸²à¸™à¹‰à¸³` -> Correct: `คำนวณค่าน้ำ`

3. Footer legal line
- Broken pattern: `Â© ... â€” ...` + mojibake Thai
- Correct (current brand format): `© 2026 Kamnuanlek | เครื่องคำนวณไทย — ข้อมูลเพื่อการศึกษาเท่านั้น`

4. Structured data fields tied to brand/breadcrumb (same strings rendered in HTML)
- `alternateName` should be: `เครื่องคำนวณไทย`
- Breadcrumb labels should be: `หน้าแรก`, `บทความ`

### B) WORDING_IMPROVEMENT

Result from screenshot review: **none required right now**.

- Trust panel copy visible in screenshot 7bec… is readable and natural Thai.
- Homepage chips and primary CTA text are readable and acceptable.
- Remaining critical defects in screenshots are encoding/mojibake, not Thai phrasing quality.

## Implementation notes for CTO
- Prioritize shared layout files first (header/footer + shared JSON-LD source), since one fix there clears many routes.
- Verify both light and dark mode after patch.
- Verify that footer links use proper Thai slugs and labels (not mojibake path fragments).

## Ready-for-signoff criteria after deploy
CMO can immediately do final production signoff when [CAL-251](/CAL/issues/CAL-251) is deployed and these checks pass:
1. No mojibake tokens visible (`à¸`, `à¹`, `Â©`, `â€”`, `�`) in rendered brand/header/footer/breadcrumb/trust contexts.
2. Correct Thai strings from section A appear on live pages.
3. No new Thai wording regressions introduced by the patch.
