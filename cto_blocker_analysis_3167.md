# CAL-3167: CTO Hourly Error Monitor — Blocker Analysis

**Issue**: CAL-3163 marks build as BLOCKED due to "4/6 core calculators" vs. expected "6/6"

**CTO Investigation Result**: ⚠️ FALSE POSITIVE — Measurement inconsistency, not actual regression

## Root Cause Analysis

**What QA Measured (CAL-3163)**:
- `/calculator/income-tax/` — NOT FOUND
- `/calculator/net-salary/` — NOT FOUND
- Conclusion: "4/6 calculators missing"

**What Actually Exists (CTO Verification)**:
- ✓ `/คำนวณภาษีเงินได้บุคคลธรรมดา/` (Thai income-tax) — PRESENT & BUILT
- ✓ `/คำนวณเงินเดือนสุทธิ/` (Thai net-salary) — PRESENT & BUILT
- All 6 core Thai calculator pages: GENERATING SUCCESSFULLY

## The Real Issue: English Routes Not Configured

The `/calculator/[english-name]/` routes are supposed to be 301 redirects defined in `astro.config.mjs`:

**Current config defines** 6 redirects:
- ✓ electricity-bill → /คำนวณค่าไฟฟ้า/
- ✓ land-tax → /คำนวณภาษีที่ดิน/
- ✓ loan-payment → /คำนวณผ่อนกู้/
- ✓ overtime-pay → /คำนวณค่าโอที/
- ✓ property-transfer-tax → /คำนวณค่าธรรมเนียมโอนบ้าน/
- ✓ unit-converter → /แปลงหน่วย/

**Missing from config**:
- ✗ income-tax → /คำนวณภาษีเงินได้บุคคลธรรมดา/ (NOT CONFIGURED)
- ✗ net-salary → /คำนวณเงินเดือนสุทธิ/ (NOT CONFIGURED)

These redirects are **not present** in git history — they were never added.

## CTO Recommendation

**Option 1 (Recommended): Add Missing Redirects**
- Add income-tax and net-salary to `astro.config.mjs` redirects
- Aligns with English route pattern for all core calculators
- Takes <5 minutes to fix

**Option 2: Update QA Verification Method**
- QA should verify Thai URLs, not English `/calculator/` routes
- English routes are nice-to-have, not critical for Phase 1 gate
- Thai calculator content is what drives ranking

## Decision Required

1. **What are the actual core calculators for Phase 1?**
   - Thai URLs only (6 total)? → QA method needs update
   - English + Thai redirects (8 total routes)? → Add 2 redirects to config

2. **Is this a blocker or a nice-to-have?**
   - If English routes required for Phase 1 launch → Add redirects now
   - If not needed for traffic → Deprioritize, mark non-blocking

## Status

- ✓ Thai calculators: All present, building, functional
- ✗ English routes: 2 missing redirect config entries
- ⏳ **Awaiting CTO/CEO decision on Phase 1 requirement**

**Next Step**: CTO to clarify calculator routing requirement with CEO/CMO before marking QA gate decision.
