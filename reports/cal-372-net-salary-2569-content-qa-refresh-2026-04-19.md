# CAL-372 Content QA: Net Salary 2569 Supporting Article / Source / Internal-link Refresh

Generated: 2026-04-19 (ICT)
Owner: Thai Content Specialist Alpha
Manager line: CMO

## Scope delivered
- Refreshed the supporting article for `/คำนวณเงินเดือนสุทธิ/` with updated 2569 assumptions, source citations, and stronger internal-link coverage.
- Updated calculator-page content and formula constants to keep article examples and calculator output aligned.
- Added reciprocal internal-link paths between the calculator and supporting article cluster.

## Metadata summary
- Supporting article title:
  - `เงินเดือนสุทธิ 2569 (2026): คำนวณหักประกันสังคม-ภาษี | เครื่องคำนวณไทย`
- Supporting article description:
  - `สรุปวิธีคำนวณเงินเดือนสุทธิปี 2569 (2026) หลังหักประกันสังคมมาตรา 33 และภาษีเงินได้ พร้อมตัวอย่างตามเกณฑ์ล่าสุดและลิงก์เครื่องคำนวณทันที`
- Canonical:
  - `/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/`
- Publish/Modified date:
  - `2026-04-12 / 2026-04-19`

## Source links used (formula statements)
- ราชกิจจานุเบกษา (กฎกระทรวงฐานค่าจ้าง ม.33 มีผล 1 ม.ค. 2569):
  - https://ratchakitcha.soc.go.th/documents/98728.pdf
- กรมสรรพากร (โครงสร้างภาษี: ค่าใช้จ่าย 50% ไม่เกิน 100,000 + ลดหย่อนส่วนตัว 60,000):
  - https://www.rd.go.th/59668.html
- กรมสรรพากร (บัญชีอัตราภาษีเงินได้บุคคลธรรมดา):
  - https://www.rd.go.th/fileadmin/user_upload/borkor/tax121260.pdf
- กรมสรรพากร (ตารางสรุปลดหย่อน รวมวงเงินประกันสังคมลดหย่อนตามจ่ายจริง):
  - https://www.rd.go.th/59674.html

## Internal links added/refreshed
- Supporting article -> calculators:
  - `/คำนวณเงินเดือนสุทธิ/`
  - `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
  - `/คำนวณค่าโอที/`
- Supporting article -> related articles:
  - `/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`
  - `/บทความ/คำนวณค่าโอที-2569-กฎหมายแรงงาน/`
  - `/บทความ/ภาษีครึ่งปี-2569-ยื่นอย่างไร-คำนวณเท่าไร/`
- Calculator page -> supporting article links:
  - `/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/`
  - plus related tax/OT article links in the related-content section

## Calculator/article alignment update
- Updated social security cap assumptions from `750` to `875` (phase 2569-2571 cap at 17,500 salary base).
- Updated annual social-security deduction cap used in tax-deduction math from `9,000` to `10,500`.
- Updated on-page worked example and FAQ threshold values to match runtime calculator behavior.

## Files changed
- `src/pages/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/index.astro`
- `src/pages/คำนวณเงินเดือนสุทธิ/index.astro`
- `reports/cal-372-net-salary-2569-content-qa-refresh-2026-04-19.md`

## Verification
- Command: `npm run build`
- Result: PASS
- Key route evidence:
  - `/คำนวณเงินเดือนสุทธิ/index.html`
  - `/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/index.html`
  - `[build] 38 page(s) built in 2.18s`

## CMO QA follow-up (2026-04-19)
- Discovered mismatch between article comparison table and calculator formula for `80,000` and `100,000` salary rows.
- Corrected rows in supporting article to align with runtime assumptions:
  - `80,000` => tax `6,075`, net `73,050`
  - `100,000` => tax `10,198`, net `88,927`
- Added regression test:
  - `scripts/cal-372-net-salary-article-table.test.mjs`
- Re-verification:
  - `node --test scripts/cal-372-net-salary-article-table.test.mjs` PASS
  - `npm run build` PASS (38 pages)
