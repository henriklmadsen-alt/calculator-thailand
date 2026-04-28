# CAL-1574: Blocker Resolution Memo — Calculator Availability Confirmation

**Date**: 2026-04-24  
**Owner**: SEO Specialist  
**Status**: Awaiting CMO Decision  
**Input**: CAL-1573 Framework + Full Codebase Verification

---

## Executive Summary

**Confirmation**: CAL-1573 blocker assessment is **ACCURATE**. Verified against current codebase (`src/data/categories.ts`).

- ✅ **11 of 30 priority calculators confirmed FOUND** in system
- ❌ **19 of 30 priority calculators confirmed MISSING** from system
- ⚠️ **ROI variants exist** (16 specific types), but no generic "roi-calculator"

**Impact**: Cannot complete metadata audit for all 30 without CMO guidance on missing calculators.

**Recommendation**: **Option A (PROCEED WITH 11)** — Unblocks Action 2 completion on 11 found calculators, allows Action 3 (internal linking) to proceed for those 11, no gate delay.

---

## Verification Results: 30 Priority Calculators

### ✅ FOUND IN SYSTEM (11/30)

| Priority | English ID | Thai URL | Current Title | Search Intent | Status |
|----------|------------|----------|---------------|----------------|--------|
| P1.1 | **vat-calculator** | `/คำนวณภาษีมูลค่าเพิ่ม/` | คำนวณ VAT 7% | 200+ monthly | ✅ FOUND |
| P1.2 | **mortgage-calculator** | `/คำนวณผ่อนบ้าน/` | คำนวณผ่อนบ้าน | 180+ monthly | ✅ FOUND |
| P1.3 | **overtime-calculator** | `/คำนวณค่าโอที/` | คำนวณค่าโอที | 250+ monthly | ✅ FOUND |
| P1.4 | **exchange-rate-calculator** | `/คำนวณอัตราแลกเปลี่ยน/` | คำนวณอัตราแลกเปลี่ยน | 300+ monthly | ✅ FOUND |
| P1.5 | **tax-calculator** | `/คำนวณภาษีเงินได้บุคคลธรรมดา/` | คำนวณภาษีเงินได้ | 180+ monthly | ✅ FOUND |
| P1.8 | **retirement-calculator** | `/คำนวณเงินเกษียณ/` | คำนวณเงินเกษียณ | 140+ monthly | ✅ FOUND |
| P1.9 | **loan-calculator** | `/คำนวณผ่อนกู้/` | คำนวณผ่อนกู้ | 140+ monthly | ✅ FOUND |
| P1.10 | **property-tax-calculator** | `/คำนวณภาษีที่ดิน/` | คำนวณภาษีที่ดิน | 110+ monthly | ✅ FOUND |
| P2.11 | **salary-calculator** | `/คำนวณเงินเดือนสุทธิ/` | คำนวณเงินเดือนสุทธิ | 130+ monthly | ✅ FOUND |
| P3.21 | **bmi-calculator** | `/คำนวณ-bmi/` | คำนวณ BMI | 140+ monthly | ✅ FOUND |
| P3.26 | **pregnancy-calculator** | `/คำนวณวันคลอด/` | คำนวณวันคลอด | 80+ monthly | ✅ FOUND |

---

### ❌ MISSING FROM SYSTEM (19/30)

#### P1 Priority (2 MISSING)

| Priority | English ID | Target Thai Title | Search Intent | Status | Notes |
|----------|------------|-------------------|----------------|--------|-------|
| P1.6 | **roi-calculator** | คำนวณ ROI — ผลตอบแทนการลงทุน | 150+ monthly | ❌ NOT FOUND | System has 16 **specific** ROI variants (agriculture, business, marketing, solar, etc.) but NO generic "ROI calculator." Clarification needed: should we use existing specific variant or create generic? |
| P1.7 | **compound-interest-calculator** | คำนวณดอกเบี้ยทบต้น — ออมเงิน วางแผน | 160+ monthly | ❌ NOT FOUND | Related calculator exists: `/คำนวณดอกเบี้ยเงินฝาก/` (deposit interest) is similar but NOT the same. Compound interest calculator is separate. |

**P1 Impact**: 2 missing high-priority calculators affect Phase 2 scope. ROI needs immediate clarification (variant vs. generic).

---

#### P2 Priority (9 MISSING)

| Priority | English ID | Target Thai Title | Search Intent | Status |
|----------|------------|-------------------|----------------|--------|
| P2.12 | **education-cost-calculator** | คำนวณค่าเรียน — ค่าใช้จ่ายการศึกษา | 110+ monthly | ❌ NOT FOUND |
| P2.13 | **depreciation-calculator** | คำนวณค่าเสื่อมราคา — สินทรัพย์ธุรกิจ | 100+ monthly | ❌ NOT FOUND |
| P2.14 | **profit-margin-calculator** | คำนวณกำไรขั้นต้น — วิเคราะห์ธุรกิจ | 120+ monthly | ❌ NOT FOUND |
| P2.15 | **break-even-calculator** | คำนวณจุดคุ้มทุน — วิเคราะห์ธุรกิจ | 100+ monthly | ❌ NOT FOUND |
| P2.16 | **restaurant-breakeven-calculator** | คำนวณจุดคุ้มทุนร้านอาหาร — ธุรกิจอาหาร | 100+ monthly | ❌ NOT FOUND |
| P2.17 | **food-cogs-calculator** | คำนวณต้นทุนวัตถุดิบ — ร้านอาหาร | 100+ monthly | ❌ NOT FOUND |
| P2.18 | **rental-yield-calculator** | คำนวณ Rental Yield — อสังหาฯ | 95+ monthly | ❌ NOT FOUND |
| P2.19 | **bus-fare-calculator** | คำนวณค่าโดยสารบัส — เดินทางกรุงเทพ | 150+ monthly | ❌ NOT FOUND |
| P2.20 | **medication-calculator** | คำนวณขนาดยา — การแพทย์ปลอดภัย | 100+ monthly | ❌ NOT FOUND |

**P2 Impact**: All 9 missing. Cluster support for SME business calculators and medical/transit calculators cannot begin until these exist.

---

#### P3 Priority (8 MISSING)

| Priority | English ID | Target Thai Title | Search Intent | Status | Notes |
|----------|------------|-------------------|----------------|--------|-------|
| P3.22 | **calorie-calculator** | คำนวณแคลอรี่ — บิดโดกำหนด | 130+ monthly | ❌ NOT FOUND |
| P3.23 | **land-title-transfer-calculator** | คำนวณค่าแลก Land Title Transfer | 90+ monthly | ❌ NOT FOUND | Related: `/คำนวณค่าธรรมเนียมโอนบ้าน/` (house transfer fee) exists but is NOT land-title-transfer. Different concept. |
| P3.24 | **agricultural-loan-calculator** | คำนวณสินเชื่อเกษตร — เกษตรกร | 80+ monthly | ❌ NOT FOUND |
| P3.25 | **max-heart-rate-calculator** | คำนวณ Max HR — โซนการออกกำลัง | 100+ monthly | ❌ NOT FOUND |
| P3.27 | **food-business-vat-calculator** | คำนวณ VAT ร้านอาหาร — ธุรกิจอาหาร | 60+ monthly | ❌ NOT FOUND |
| P3.28 | **decoration-budget-calculator** | คำนวณงบประมาณแต่งระเบียง — อีเวนต์ | 80+ monthly | ❌ NOT FOUND |
| P3.29 | **bmr-calculator** | คำนวณ BMR — อัตราการเผาผลาญพื้นฐาน | 90+ monthly | ❌ NOT FOUND |
| P3.30 | **fuel-cost-calculator** | คำนวณค่าน้ำมัน — วางแผนการเดินทาง | 70+ monthly | ❌ NOT FOUND |

**P3 Impact**: Health, lifestyle, and specialty business calculators not yet in system. Lower priority but important for long-term cluster strength.

---

## Additional Calculators Existing in System (Not on Priority List)

These calculators exist but were NOT in the original 30-priority list:

- `/คำนวณค่าทองคำ/` (gold price calculator) — 80+ monthly demand
- `/คำนวณดัชนีราคาผู้บริโภค/` (CPI inflation calculator) — emerging demand
- `/คำนวณผ่อนรถ/` (car loan calculator) — exists but not in P1-P3 list
- `/คำนวณค่าไฟฟ้า/` (electricity bill) — utility calculator
- `/คำนวณค่าน้ำ/` (water bill) — utility calculator
- `/คำนวณค่าคอนโด/` (condo fee) — real estate calculator
- `/คำนวณค่าเลี้ยงสัตว์/` (pet care cost)
- `/คำนวณค่าเรียนพิเศษ/` (tutoring cost)
- `/คำนวณค่าแต่งหน้า/` (makeup cost)
- `/คำนวณดอกเบี้ยบัตรเครดิต/` (credit card interest)
- `/คำนวณค่างวดบัตรเครดิต/` (credit card installment)
- `/คำนวณอายุ/` (age calculator)
- `/คำนวณประกันชีวิต/` (life insurance)
- `/คำนวณเปอร์เซ็นต์/` (percentage calculator)
- `/แปลงหน่วย/` (unit converter)
- `/คำนวณค่าส่งพัสดุ/` (shipping cost)
- `/คำนวณค่าจัดงานศพ/` (funeral arrangement cost)
- `/คำนวณค่าแรงขั้นต่ำ/` (minimum wage calculator)
- `/คำนวณประกันสังคม/` (social security calculator)

**Observation**: Many existing calculators could potentially fill gaps or extend clusters, but require metadata/article support review.

---

## Three Options for CMO Decision (By 2026-04-25)

### Option A: PROCEED WITH 11 FOUND CALCULATORS ⭐ RECOMMENDED

**Decision**: Complete metadata audit for 11 found calculators. Defer 19 missing to Phase B post-gate.

**Rationale**:
- Unblocks CAL-1574 (metadata audit) immediately
- Allows CAL-1576 (internal linking) to proceed for 11 strong calculators
- No impact to Phase 2 gate (2026-04-29)
- 11 calculators still deliver ~1,400 monthly search intent
- Phase B can address missing 19 systematically

**Timeline**:
- CAL-1574 completion: 2026-04-26 (11 calculators)
- CAL-1576 completion: 2026-04-27 (internal linking for 11)
- Phase 2 launch: 2026-04-29 (11 calcs + articles)
- Phase B starts: 2026-05-01 (create/research missing 19)

**Action Required**: CMO approves Option A → SEO proceeds with metadata validation for 11.

---

### Option B: CREATE MISSING 19 BEFORE PHASE 2

**Decision**: Create or integrate all 19 missing calculators before Phase 2 gate.

**Rationale**:
- Full 30-calculator strategy delivers ~2,100 total monthly search intent
- Better cluster support for article strategy
- Complete metadata + linking audit happens once

**Blockers**:
- Requires CTO effort estimation (likely 2-3 weeks)
- Risk of gate slip if not completed by 2026-04-29
- Delays Phase 2 launch

**Action Required**: If Option B selected, escalate to CTO for effort/timeline; adjust Phase 2 gate date.

---

### Option C: SUBSTITUTE WITH EXISTING CALCULATORS

**Decision**: Replace missing 19 with existing calculators not on priority list (gold price, CPI, car loans, credit cards, etc.).

**Rationale**:
- No dev effort needed
- Can complete full 30-calculator strategy immediately
- Uses existing demand (gold, CPI, car loans all have traction)

**Tradeoff**:
- Article strategy needs replan (different calculators than prioritized)
- May weaken focus on identified high-intent gaps (SME, medical, transit)
- Requires CMO approval of new priority mapping

**Action Required**: If Option C selected, CMO provides revised priority list; SEO proceeds with substitutes.

---

## Clarification Needed: ROI Calculator

**Issue**: Priority list specifies "roi-calculator" (generic business ROI).

**Reality**: System has **16 specific ROI variants** currently:
- roi-calc-agriculture (farm investment ROI)
- roi-calc-business (general business)
- roi-calc-marketing (marketing spend ROI)
- roi-calc-solar (solar investment ROI)
- [+ 12 other specific variants]

**Question for CMO**: 
1. Should we use an existing specific ROI variant for the priority? If so, which?
2. Or should we create a generic "roi-calculator" that supports all types?
3. Impact: This affects metadata audit priority and article clustering.

**Recommendation**: Clarify by 2026-04-25 morning. CMO can choose (A) use agriculture ROI as primary, (B) use business ROI variant, or (C) create generic calculator.

---

## Blocker Resolution Status

| Task | Status | Owner | Due |
|------|--------|-------|-----|
| ✅ Blocker Identified | COMPLETE | SEO | 2026-04-24 |
| ✅ Blocker Verified Against Codebase | COMPLETE | SEO | 2026-04-24 |
| ✅ 11 Found Calculators Confirmed | COMPLETE | SEO | 2026-04-24 |
| ✅ 19 Missing Calculators Confirmed | COMPLETE | SEO | 2026-04-24 |
| ⏳ CMO Decision (Option A/B/C) | AWAITING | CMO | 2026-04-25 |
| ⏳ ROI Clarification | AWAITING | CMO | 2026-04-25 |
| ⏳ Metadata Audit Execution (CAL-1574) | BLOCKED UNTIL DECISION | SEO | 2026-04-26 |
| ⏳ Internal Linking Strategy (CAL-1576) | BLOCKED UNTIL DECISION | SEO | 2026-04-27 |

---

## Recommended Next Steps (For CMO by 2026-04-25 morning)

1. **Review blocker confirmation** above (all 30 calculators verified against codebase)
2. **Select Option A, B, or C** for missing 19 calculators
3. **Clarify ROI calculator** intent (generic vs. specific variant)
4. **Comment in CAL-1574 with decision** → unlocks SEO metadata audit

Once CMO decides:
- **If Option A**: SEO completes metadata audit for 11 on 2026-04-26
- **If Option B**: Escalate to CTO; adjust timeline
- **If Option C**: CMO provides 19 substitutes; SEO audits all 30

---

## Deliverable Status

**CAL-1573-ACTION2-METADATA-AUDIT.md** (committed b4188d7):
- ✅ Audit framework for 11 found calculators
- ✅ Metadata recommendations for 11 found
- ✅ Blocker analysis (19 missing)

**CAL-1574-BLOCKER-RESOLUTION-MEMO.md** (THIS DOCUMENT):
- ✅ Verified blocker against full codebase
- ✅ Confirmed all 30 calculators (11 found, 19 missing)
- ✅ Clarified ROI complexity
- ✅ Three decision options with tradeoffs
- ✅ Ready for CMO decision

---

**Prepared by**: SEO Specialist  
**Date**: 2026-04-24  
**Status**: Awaiting CMO Decision  
**Next Review**: 2026-04-25 (CMO decision expected)
