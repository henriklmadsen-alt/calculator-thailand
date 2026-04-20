# CAL-277 Due-Date Calculator Route Activation (2026-04-19)

Reporting manager: CMO  
Issue lane: [CAL-68](/CAL/issues/CAL-68) priority #7 dependency closeout (`คำนวณวันคลอด/อายุครรภ์`)

## Why this slice was executed

- Existing CAL-68 article package for due-date intent already linked to `/คำนวณวันคลอด/`.
- The calculator route did not exist yet, causing unresolved CTA targets and internal-link dead ends.
- This heartbeat ships the missing calculator page to restore end-to-end user flow.

## User-facing URLs

- New calculator URL: `/คำนวณวันคลอด/`
- Supporting article URL: `/บทความ/คำนวณวันคลอด-คำนวณอายุครรภ์/`

## What shipped

- New calculator page created at `src/pages/คำนวณวันคลอด/index.astro`
- Supports two calculation modes:
  - LMP-based (LMP + 280 days, with cycle-length adjustment)
  - Conception-date-based (+266 days)
- Outputs:
  - estimated due date (EDD)
  - gestational age (weeks + days)
  - trimester estimate
  - total gestational days
- Includes FAQ schema + WebApplication schema + trust/source panel
- Includes article/calculator cluster links to keep click-depth and internal-link consistency

## Source basis used in page copy

- NHS due date calculator guidance:  
  https://www.nhs.uk/pregnancy/finding-out/due-date-calculator/
- Johns Hopkins due-date explainer:  
  https://www.hopkinsmedicine.org/health/wellness-and-prevention/calculating-a-due-date
- CDC/NCHS worksheet guidance (EDD/LMP handling):  
  https://www.cdc.gov/nchs/data/dvs/GuidetoCompleteFacilityWks.pdf

## Verification evidence

Commands executed:

```bash
# pre-check
Test-Path src/pages/คำนวณวันคลอด/index.astro

# build
npm run build
```

Observed results:

- Pre-check confirmed route file missing before implementation
- Build passed after implementation
- New static route generated: `/คำนวณวันคลอด/index.html`
- Public-content guard passed

## Changed files

- `src/pages/คำนวณวันคลอด/index.astro`
- `reports/seo/cal-277-due-date-calculator-route-activation-2026-04-19.md`
