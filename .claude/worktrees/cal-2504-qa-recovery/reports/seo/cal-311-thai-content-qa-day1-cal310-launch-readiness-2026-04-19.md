# CAL-311 Thai Content QA: Day 1 CAL-310 Launch-Wave Readiness (2026-04-19)

Reporting manager: CMO  
Issue lane: [CAL-311](/CAL/issues/CAL-311)  
Launch queue reference: [CAL-310](/CAL/issues/CAL-310) Day 1 (`#1-#2`)

## Wake-scope acknowledgement

- Used wake payload scope directly (`fallbackFetchNeeded: no`)
- Focused only on Day 1 launch pair QA: copy quality + internal-link readiness + source-backed formula claims

## QA scope (Day 1 pair)

- Calculator: `/คำนวณดอกเบี้ยบัตรเครดิต/`
- Supporting article: `/บทความ/คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว/`
- Calculator: `/คำนวณค่าไฟฟ้า/`
- Supporting article: `/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/`

## Readiness verdict

`READY` for Day 1 launch-wave copy/internal-link gate with one hardening edit applied.

## Findings and checks

1. Thai copy depth and calculator intent: `PASS`
- Both articles are long-form, actionable, and tightly aligned to calculation intent (not filler).
- Both include practical examples and direct CTA to calculator usage.

2. Title/meta intent alignment (time-sensitive year 2569): `PASS`
- Day 1 calculator/article pages contain year-specific title/description targeting 2569 intent.

3. Reciprocal internal links (calculator <-> article): `PASS`
- Calculator to article links present for both Day 1 pairs.
- Article back-links to corresponding calculator pages present for both Day 1 pairs.

4. Related-link density inside articles: `PASS`
- Electricity article includes related calculators (3) and related articles (3).
- Credit-card article includes related calculators and related articles beyond the primary pair.

5. Formula/source compliance (thai-formulas rule): `PASS`
- Credit-card pages cite BOT source lines for cap/minimum-payment policy context.
- Electricity pages cite PEA/MEA/Ft references; article also cites Revenue Department VAT notice.
- Worked examples are numerically consistent with calculator logic.

6. Internal discovery readiness (hub + homepage): `PASS`
- Homepage contains both Day 1 calculators.
- Article index contains both Day 1 article slugs and calculator mappings.

7. Schema/date readiness: `HARDENED`
- Applied explicit `modifiedDate` on electricity article to align metadata parity with Day 1 gate expectation.

## Change applied in this QA cycle

- Added `modifiedDate="2026-04-19"` to:
  - `src/pages/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/index.astro`

## Evidence commands and outcomes

```bash
# Explicit modified date after hardening edit
rg -n "modifiedDate" src/pages/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/index.astro -S

# Calculator -> article links for Day 1 pair
rg -n "คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ|คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว" \
  src/pages/คำนวณค่าไฟฟ้า/index.astro src/pages/คำนวณดอกเบี้ยบัตรเครดิต/index.astro -S

# Article -> calculator links for Day 1 pair
rg -n "/คำนวณค่าไฟฟ้า/|/คำนวณดอกเบี้ยบัตรเครดิต/" \
  src/pages/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/index.astro \
  src/pages/บทความ/คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว/index.astro -S

# Official source lines (BOT / PEA / MEA / RD)
rg -n "bot.or.th|pea.co.th|mea.or.th|rd.go.th" \
  src/pages/คำนวณดอกเบี้ยบัตรเครดิต/index.astro \
  src/pages/บทความ/คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว/index.astro \
  src/pages/คำนวณค่าไฟฟ้า/index.astro \
  src/pages/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/index.astro -S

# Hub/home readiness + full build gate
rg -n "คำนวณดอกเบี้ยบัตรเครดิต-2569-วิธีคิดและลดหนี้เร็ว|คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ|/คำนวณดอกเบี้ยบัตรเครดิต/|/คำนวณค่าไฟฟ้า/" \
  src/pages/index.astro src/pages/บทความ/index.astro -S
npm run build
```

Observed:

- All required Day 1 links and source lines are present.
- Build passed (`astro build` + `scripts/verify-public-content.mjs`).
- No blockers in Thai content/copy/internal-link readiness for Day 1.

## Files touched

- `src/pages/บทความ/คำนวณค่าไฟฟ้า-2569-สูตรคิดค่าไฟ/index.astro`
- `reports/seo/cal-311-thai-content-qa-day1-cal310-launch-readiness-2026-04-19.md`
