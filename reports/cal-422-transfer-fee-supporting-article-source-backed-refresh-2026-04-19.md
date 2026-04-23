# CAL-422 Thai Content: Transfer-fee Supporting Article Source-backed Refresh

Generated: 2026-04-19 (ICT)
Owner: Thai Content Specialist Alpha
Manager line: CMO

## Scope delivered
- Refreshed supporting article `/บทความ/ค่าโอนบ้าน-2569-มีอะไรบ้าง-คำนวณอย่างไร/` with explicit formula-to-source mapping for transfer-fee statements.
- Added in-body contextual internal links aligned to next-step calculator intent (transfer planning -> mortgage cashflow -> annual tax planning).
- Added calculator-behavior section so article guidance matches runtime logic used on `/คำนวณค่าโอนบ้าน/`.
- Updated metadata description to emphasize source-backed formulas and calculator-aligned examples.

## Resume delta handled
- Acknowledged comment `39b82bcb-6681-4801-92d7-a4522bf7ad39` (description encoding correction).
- Confirmed scope remains unchanged for CAL-422 (Thai transfer-fee supporting article with official-source support).
- Rechecked delivered files for encoding corruption markers and found no broken placeholder text.

## Metadata summary
- Route: `/บทความ/ค่าโอนบ้าน-2569-มีอะไรบ้าง-คำนวณอย่างไร/`
- Title:
  - `ค่าโอนบ้าน 2569 มีอะไรบ้าง คำนวณอย่างไร | เครื่องคำนวณไทย`
  - Length: 57
- Description:
  - `สรุปค่าโอนบ้านปี 2569 พร้อมสูตรที่ใช้จริง แหล่งอ้างอิงทางการกรมที่ดิน/กรมสรรพากร และตัวอย่างคำนวณที่ตรงกับเครื่องคำนวณค่าโอนบ้าน`
  - Length: 128

## Formula + source mapping shipped
- Transfer fee (normal legal rate): `ราคาประเมินทุนทรัพย์ x 2%` -> [1]
- Specific business tax (SBT): `ฐานมูลค่าสูงกว่า x 3.3%` -> [1]
- Stamp duty (non-SBT case): `ฐานมูลค่าสูงกว่า x 0.5%` -> [1]
- Corporate withholding branch: `ฐานมูลค่าสูงกว่า x 1%` -> [1]
- Individual withholding branch: holding-year deduction + progressive method -> [2], [4]
- Caveat retained in article: temporary reduced transfer-fee measures can apply only when approved under cabinet criteria -> [1]

### Source URLs used in article
- [1] https://www.dol.go.th/dol-services/public-service-manual/land-registration/fees-taxes-duties/
- [2] https://www.dol.go.th/media/716929789247754240/migration/2025/10/dxtE3FP9oCjV4ThN86z5Jm0n.pdf
- [3] https://www.dol.go.th/media/813280203299229696/migration/2025/10/tTJRbqDE5jo7rNC2LdcGUWFn.pdf
- [4] https://rdsrv2.rd.go.th/landwht/landwht05.asp

### Source availability check (2026-04-19 ICT)
- [1] -> HTTP 200
- [2] -> HTTP 200
- [3] -> HTTP 200
- [4] -> HTTP 200

## Internal-link refresh summary
- Added/strengthened in-body contextual links:
  - `/คำนวณค่าโอนบ้าน/`
  - `/คำนวณผ่อนบ้าน/`
  - `/คำนวณผ่อนกู้/`
  - `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
- Existing related article links retained:
  - `/บทความ/รีไฟแนนซ์บ้าน-2569-คุ้มไหม-ดอกเบี้ยใหม่ต้องลดเท่าไร/`
  - `/บทความ/รีไฟแนนซ์บ้าน-vs-โปะบ้าน-แบบไหนคุ้ม-2569/`
  - `/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`

## Files changed
- `src/pages/บทความ/ค่าโอนบ้าน-2569-มีอะไรบ้าง-คำนวณอย่างไร/index.astro`
- `reports/cal-422-transfer-fee-supporting-article-source-backed-refresh-2026-04-19.md`

## Verification
- Command: `npm run build`
- Result: PASS
- Build summary:
  - `[build] 41 page(s) built`
  - Includes route `/บทความ/ค่าโอนบ้าน-2569-มีอะไรบ้าง-คำนวณอย่างไร/index.html`
