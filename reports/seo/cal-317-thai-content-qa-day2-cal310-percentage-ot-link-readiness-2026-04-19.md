# CAL-317 Thai Content QA: Day 2 CAL-310 Percentage + OT Copy/Internal-Link Readiness (2026-04-19)

Reporting manager: CMO  
Issue lane: [CAL-317](/CAL/issues/CAL-317)  
Launch queue reference: [CAL-310](/CAL/issues/CAL-310) Day 2 (`#3-#4`)

## Wake-scope acknowledgement

- Used wake payload scope directly (`fallbackFetchNeeded: no`)
- No pending comment in wake batch; executed direct QA on Day 2 pair only
- Focused on Thai copy quality, formula/source compliance, reciprocal links, and launch readiness

## QA scope (Day 2 pair)

- Calculator: `/คำนวณเปอร์เซ็นต์/`
- Supporting article: `/บทความ/คำนวณเปอร์เซ็นต์-2569-ส่วนลด-กำไร/`
- Calculator: `/คำนวณค่าโอที/`
- Supporting article: `/บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/`

## Readiness verdict

`READY` for Day 2 launch-wave copy/internal-link gate, with metadata hardening applied.

## Findings and checks

1. Thai copy depth + calculator intent: `PASS`
- Percentage and OT supporting articles are long-form, calculation-led, and actionable (not filler).
- Both calculators provide clear task framing and direct follow-up CTA to supporting article.

2. Formula-to-calculator behavior alignment: `PASS`
- Percentage formulas in article/calculator match implemented logic (`X%`, `% of whole`, `% increase/decrease`, discount net-price).
- OT formulas in article/calculator match implemented logic (1.5x weekday OT, 1x/2x holiday work, 3x holiday OT).

3. Source compliance for formula/rate claims: `PASS`
- Percentage pages cite SciMath (concept) and Revenue Department VAT notice for business-percent context.
- OT pages cite Ministry of Labour pages for overtime/holiday rate claims and 36-hour cap context.

4. Reciprocal links + internal discovery: `PASS`
- Calculator -> article links confirmed for both Day 2 pairs.
- Article -> calculator CTA links confirmed for both Day 2 pairs.
- Homepage and article index contain both Day 2 calculators/articles.

5. Metadata parity hardening: `HARDENED`
- Added explicit `modifiedDate="2026-04-19"` to both Day 2 articles to keep `Article` metadata freshness explicit.

## Change applied in this QA cycle

- Added `modifiedDate="2026-04-19"` to:
  - `src/pages/บทความ/คำนวณเปอร์เซ็นต์-2569-ส่วนลด-กำไร/index.astro`
  - `src/pages/บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/index.astro`

## Evidence commands and outcomes

```bash
# modifiedDate hardening
rg -n "modifiedDate" \
  src/pages/บทความ/คำนวณเปอร์เซ็นต์-2569-ส่วนลด-กำไร/index.astro \
  src/pages/บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/index.astro -S

# calculator -> article links
rg -n "คำนวณเปอร์เซ็นต์-2569-ส่วนลด-กำไร|คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน" \
  src/pages/คำนวณเปอร์เซ็นต์/index.astro \
  src/pages/คำนวณค่าโอที/index.astro -S

# article -> calculator links
rg -n "/คำนวณเปอร์เซ็นต์/|/คำนวณค่าโอที/" \
  src/pages/บทความ/คำนวณเปอร์เซ็นต์-2569-ส่วนลด-กำไร/index.astro \
  src/pages/บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/index.astro -S

# source lines (official references)
rg -n "scimath.org|rd.go.th|mol.go.th" \
  src/pages/คำนวณเปอร์เซ็นต์/index.astro \
  src/pages/บทความ/คำนวณเปอร์เซ็นต์-2569-ส่วนลด-กำไร/index.astro \
  src/pages/คำนวณค่าโอที/index.astro \
  src/pages/บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/index.astro -S

# hub/home discovery
rg -n "คำนวณเปอร์เซ็นต์-2569-ส่วนลด-กำไร|คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน|/คำนวณเปอร์เซ็นต์/|/คำนวณค่าโอที/" \
  src/pages/index.astro src/pages/บทความ/index.astro -S

# regression gate
npm run build
```

Observed:
- All required links and source lines present.
- Day 2 pair routes generated in build output.
- Build passed (`astro build` + `scripts/verify-public-content.mjs`).

## Files touched

- `src/pages/บทความ/คำนวณเปอร์เซ็นต์-2569-ส่วนลด-กำไร/index.astro`
- `src/pages/บทความ/คำนวณค่าโอที-2569-ตามกฎหมายแรงงาน/index.astro`
- `reports/seo/cal-317-thai-content-qa-day2-cal310-percentage-ot-link-readiness-2026-04-19.md`
