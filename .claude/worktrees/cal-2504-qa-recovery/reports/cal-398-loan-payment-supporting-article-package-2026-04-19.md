# CAL-398 Loan Payment Supporting Article + Internal-link Package (2026-04-19)

Generated: 2026-04-19 (ICT)
Owner: Thai Content Specialist Alpha
Manager line: CMO

## CMO correction pass (executor revision)
- Review blockers addressed from return comment:
  - Increased Thai article depth to pass the >=800 word-like token gate.
  - Updated SEO title to required brand-suffix format.
- Updated page:
  - `/บทความ/คำนวณผ่อนกู้-2569-วิธีคิดค่างวดลดต้นลดดอก-vs-คงที่/`
- Metadata correction:
  - `title`: `คำนวณผ่อนกู้ 2569 | เทียบคงที่-ลดต้นลดดอก | เครื่องคำนวณไทย`
- Content-depth evidence:
  - Internal check command (Thai `Intl.Segmenter` word-like method): `wordLike 1197`
- Scope intentionally preserved:
  - Formula parity, internal-link structure, and build verification remained intact.

## Scope delivered
- New Thai supporting article published for loan-payment intent:
  - `/บทความ/คำนวณผ่อนกู้-2569-วิธีคิดค่างวดลดต้นลดดอก-vs-คงที่/`
- Article includes:
  - SEO metadata (`title`, `description`, `canonical`)
  - calculator CTA to `/คำนวณผ่อนกู้/`
  - worked payment examples aligned to calculator logic
  - formula section with explicit source mapping
  - FAQ block (4 entries)
  - internal links to related calculators and articles

## Internal-link package (added)
- Added from calculator pages to new article:
  - `/คำนวณผ่อนกู้/`
  - `/คำนวณผ่อนรถ/`
  - `/คำนวณผ่อนบ้าน/` (next-action and related-tools blocks)
- Added discoverability in article hub:
  - `/บทความ/` (new card entry)
- Added from new article to cluster routes:
  - `/คำนวณผ่อนกู้/`
  - `/คำนวณผ่อนบ้าน/`
  - `/คำนวณผ่อนรถ/`
  - `/คำนวณเงินเดือนสุทธิ/`
  - `/บทความ/รีไฟแนนซ์บ้าน-2569-คุ้มไหม-ดอกเบี้ยใหม่ต้องลดเท่าไร/`
  - `/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/`

## Formula + source mapping
- Formula statements used in article:
  - Reducing-balance annuity payment formula: `M = P × [r(1+r)^n] / [(1+r)^n - 1]`
  - Flat-rate formulas:
    - `ดอกเบี้ยรวม = P × อัตราดอกเบี้ยต่อปี × จำนวนปี`
    - `ค่างวด = (เงินต้น + ดอกเบี้ยรวม) ÷ จำนวนงวด`
- Source mapping:
  - BOT Effective/Reducing concept + comparison context:
    - https://www.bot.or.th/th/satang-story/rights-responsibility/effectiverate.html
  - BOT Flat-rate context (hire purchase):
    - https://www.bot.or.th/th/satang-story/managing-debt/hirepurchase-loan.html
  - BOT flat-to-effective rough conversion (`Flat Rate x 1.8`):
    - https://www.bot.or.th/th/satang-story/managing-debt/debt-prioritise.html
- Calculator parity evidence:
  - Numeric examples were aligned with site calculator logic in `src/lib/loan-calculator.ts`

## Files changed
- `src/pages/บทความ/คำนวณผ่อนกู้-2569-วิธีคิดค่างวดลดต้นลดดอก-vs-คงที่/index.astro`
- `src/pages/คำนวณผ่อนกู้/index.astro`
- `src/pages/คำนวณผ่อนรถ/index.astro`
- `src/pages/คำนวณผ่อนบ้าน/index.astro`
- `src/pages/บทความ/index.astro`
- `reports/cal-398-loan-payment-supporting-article-package-2026-04-19.md`

## Verification
- Command: `npm run build`
- Result: PASS
- Key output lines:
  - `/บทความ/คำนวณผ่อนกู้-2569-วิธีคิดค่างวดลดต้นลดดอก-vs-คงที่/index.html`
  - `/คำนวณผ่อนกู้/index.html`
  - `/คำนวณผ่อนรถ/index.html`
  - `/คำนวณผ่อนบ้าน/index.html`
  - `/บทความ/index.html`
  - `[build] 41 page(s) built in 2.53s`
