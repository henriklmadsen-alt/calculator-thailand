# CAL-384 Thai Content QA: Day 3 CAL-310 Transfer-fee + Water Copy/Internal-link Readiness

Generated: 2026-04-19 (ICT)
Owner: Thai Content Specialist Alpha
Manager line: CMO

## Scope delivered
- Rebuilt the transfer-fee supporting article at `/บทความ/ค่าโอนบ้าน-2569-มีอะไรบ้าง-คำนวณอย่างไร/` from corrupted placeholder content (`?`) into complete Thai production copy.
- Added source-backed formula context and practical pre-transfer workflow guidance aligned to calculator intent.
- Delivered water-cluster copy/internal-link readiness by publishing a new supporting article and wiring reciprocal contextual links from electricity article + electricity calculator page.

## Transfer-fee QA outcome
- Route: `/บทความ/ค่าโอนบ้าน-2569-มีอะไรบ้าง-คำนวณอย่างไร/`
- Restored/updated:
  - SEO metadata (title, description, canonical)
  - FAQ block (4 entries)
  - Primary calculator CTA to `/คำนวณค่าโอนบ้าน/`
  - Related calculators and related-article internal links
  - Official source section for formula-bearing statements
- Formula statements included and source-mapped:
  - Transfer fee 2%
  - SBT 3.3%
  - Stamp duty 0.5% (non-SBT case)
  - Corporate withholding 1%

## Water copy/internal-link readiness outcome
- New supporting article route published:
  - `/บทความ/ค่าน้ำประปา-2569-วางแผนค่าใช้จ่าย-และอ่านบิล/`
- Added readiness messaging and links in electricity supporting content:
  - `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/`
- Added readiness card in electricity calculator page:
  - `/คำนวณค่าไฟฟ้า/`
- Readiness policy in copy:
  - Declares planned water calculator path `/คำนวณค่าน้ำ/`
  - Avoids unsupported tariff formula claims while route is pending
  - Keeps users on live, non-broken internal routes for immediate utility-budget planning

## Source links used
### Transfer-fee formula references
- https://www.dol.go.th/dol-services/public-service-manual/land-registration/fees-taxes-duties/
- https://www.dol.go.th/media/716929789247754240/migration/2025/10/dxtE3FP9oCjV4ThN86z5Jm0n.pdf
- https://www.dol.go.th/media/813280203299229696/migration/2025/10/tTJRbqDE5jo7rNC2LdcGUWFn.pdf

### Water copy references (official organization pages)
- https://www.mwa.co.th/
- https://www.pwa.co.th/
- https://www.rd.go.th/

## Internal-link additions/refresh
- Transfer-fee article -> calculator:
  - `/คำนวณค่าโอนบ้าน/`
- Transfer-fee article -> related calculators:
  - `/คำนวณผ่อนบ้าน/`
  - `/คำนวณผ่อนกู้/`
  - `/คำนวณภาษีเงินได้บุคคลธรรมดา/`
- Transfer-fee article -> related articles:
  - `/บทความ/รีไฟแนนซ์บ้าน-2569-คุ้มไหม-ดอกเบี้ยใหม่ต้องลดเท่าไร/`
  - `/บทความ/รีไฟแนนซ์บ้าน-vs-โปะบ้าน-แบบไหนคุ้ม-2569/`
  - `/บทความ/ภาษีเงินได้-2569-คำนวณ-วิธีลดหย่อน/`
- Electricity article/calculator -> water-supporting route:
  - `/บทความ/ค่าน้ำประปา-2569-วางแผนค่าใช้จ่าย-และอ่านบิล/`

## Files changed
- `src/pages/บทความ/ค่าโอนบ้าน-2569-มีอะไรบ้าง-คำนวณอย่างไร/index.astro`
- `src/pages/บทความ/ค่าน้ำประปา-2569-วางแผนค่าใช้จ่าย-และอ่านบิล/index.astro`
- `src/pages/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/index.astro`
- `src/pages/คำนวณค่าไฟฟ้า/index.astro`
- `reports/cal-384-thai-content-qa-day3-cal-310-transfer-fee-water-readiness-2026-04-19.md`

## Verification
- Command: `npm run build`
- Result: PASS
- Build evidence highlights:
  - `/บทความ/ค่าโอนบ้าน-2569-มีอะไรบ้าง-คำนวณอย่างไร/index.html`
  - `/บทความ/ค่าน้ำประปา-2569-วางแผนค่าใช้จ่าย-และอ่านบิล/index.html`
  - `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/index.html`
  - `/คำนวณค่าไฟฟ้า/index.html`
  - `[build] 39 page(s) built in 2.26s`

## Blocker / escalation note (for CMO)
- Copy/internal-link readiness is complete.
- Dedicated calculator route `/คำนวณค่าน้ำ/` is still a publish dependency outside this content QA scope.
- Interim mitigation shipped: explicit readiness path messaging + live internal-link loop through water-supporting article and electricity utility pages.
