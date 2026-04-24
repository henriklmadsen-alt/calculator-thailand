# CAL-1567: RelatedCalculators Mapping + Internal Linking Strategy

**Status:** DELIVERED  
**Date:** 2026-04-24  
**Owner:** SEO Specialist  
**Scope:** Strategic internal linking blueprint for Phase 2 UX + SEO execution  
**Timeline:** Due 2026-04-28 for Phase 2 gate  
**Depends on:** CAL-1566 (Metadata Audit) ✅ COMPLETE

---

## Executive Summary

This document provides complete internal linking infrastructure for Calculator Thailand's highest-value calculators. It includes:

- **RelatedCalculators Mapping** (JSON/CSV): Which calculators link to which others
- **Cross-Cluster Linking Directives**: How to strengthen calculator clusters
- **Linking Priority Order**: Ranked by traffic potential, search intent alignment, and cluster strength
- **Article-to-Calculator Strategy**: How support articles drive calculator discovery
- **Implementation Checklist**: Ready for CTO/UX execution

**Goal:** Turn isolated pages into connected clusters so users find related tools, stay longer, and calculators benefit from shared authority.

---

## Part 1: Phase 1A Calculator Cluster Map

### Phase 1A Calculators (Tier 1A Priority)

These 5 calculators have highest search intent alignment and should be core linking hubs:

| Slug | Thai Name | Search Intent | Monthly Volume | Tier | Status |
|---|---|---|---|---|---|
| คำนวณ-apr | APR Calculator | Loan/Mortgage rates | 8,000-10,000 | 1A | Active |
| คำนวณ-bmi | BMI Calculator | Health/Wellness | 5,000-7,000 | 1A | Active |
| คำนวณ-ผ่อนบ้าน | Mortgage Calculator | Home financing | 6,000-8,000 | 1A | Active |
| คำนวณ-ผ่อนรถ | Vehicle Loan Calculator | Car financing | 4,000-5,000 | 1A | Active |
| คำนวณ-เงินเดือน | Salary Tax Calculator | Income tax | 3,000-4,000 | 1A | Active |

### Cluster 1: Loan & Financing Hub (APR, Bridge, Mortgage, Vehicle, Personal Loan)

**Primary Hub:** คำนวณ-apr  
**Supporting Calculators:**
- คำนวณ-bridge-loan (Bridge Loan)
- คำนวณ-ผ่อนบ้าน (Mortgage)
- คำนวณ-ผ่อนรถ (Vehicle Loan)
- คำนวณ-ผ่อนกู้ (Personal Loan)
- คำนวณ-ดอกเบี้ยบัตรเครดิต (Credit Card Interest)

**Linking Logic:** Loan-related search intent. User searches for "APR" or mortgage rates and should discover other loan types. Internal links improve time-on-site and calculator completion rate.

**Cross-Page Intent:** Users comparing loan types benefit from seeing options.

---

### Cluster 2: Health & Wellness Hub (BMI, Health Insurance, Medical Costs)

**Primary Hub:** คำนวณ-bmi  
**Supporting Calculators:**
- คำนวณ-klc0402-เบี้ยประกันสุขภาพ (Health Insurance Premium)
- คำนวณ-klc0401-ค่าเข้ารักษา (Medical Expenses)
- คำนวณ-klc0404-ค่าตรวจสุขภาพ (Health Checkup)
- คำนวณ-klc0425-งบสุขภาพปี (Annual Health Budget)

**Linking Logic:** Health & wellness journey. BMI → health insurance → medical cost planning.

**Cross-Page Intent:** Health-conscious users benefit from understanding health costs after BMI check.

---

### Cluster 3: Financial Planning Hub (Salary Tax, Budget, Savings, Investment)

**Primary Hub:** คำนวณ-เงินเดือน  
**Supporting Calculators:**
- คำนวณ-ภาษีมูลค่าเพิ่ม (VAT)
- คำนวณ-dca-เฉลี่ยต้นทุน (DCA/Cost Averaging)
- คำนวณ-irr-อัตราผลตอบแทนภายใน (IRR/Returns)
- คำนวณ-ดอกเบี้ยเงินฝาก (Savings Interest)
- คำนวณ-cashback (Cashback Comparison)

**Linking Logic:** Personal finance decision-making. Income tax → budget planning → savings & investment.

**Cross-Page Intent:** Income earners planning year-ahead should see tax impact → savings options.

---

## Part 2: RelatedCalculators JSON Mapping

### Structure

```json
{
  "relatedCalculators": [
    {
      "slug": "คำนวณ-apr",
      "thaiName": "APR Calculator",
      "cluster": "Loan & Financing",
      "priority": "P0-Hub",
      "relatedTo": [
        {
          "slug": "คำนวณ-bridge-loan",
          "reason": "Loan type comparison",
          "direction": "bidirectional",
          "linkText": "โครงการสะพาน (Bridge Loan)",
          "placement": "Related Calculators section"
        },
        {
          "slug": "คำนวณ-ผ่อนบ้าน",
          "reason": "APR → Mortgage rate comparison",
          "direction": "bidirectional",
          "linkText": "ผ่อนบ้าน + อัตราดอกเบี้ย",
          "placement": "Related Calculators section"
        },
        {
          "slug": "คำนวณ-ผ่อนรถ",
          "reason": "APR → Vehicle loan comparison",
          "direction": "bidirectional",
          "linkText": "ผ่อนรถ + ดอกเบี้ย",
          "placement": "Related Calculators section"
        },
        {
          "slug": "คำนวณ-ผ่อนกู้",
          "reason": "Personal loan rate comparison",
          "direction": "bidirectional",
          "linkText": "ผ่อนกู้ส่วนบุคคล",
          "placement": "Related Calculators section"
        }
      ]
    },
    {
      "slug": "คำนวณ-bmi",
      "thaiName": "BMI Calculator",
      "cluster": "Health & Wellness",
      "priority": "P0-Hub",
      "relatedTo": [
        {
          "slug": "คำนวณ-klc0402-เบี้ยประกันสุขภาพ",
          "reason": "Health status → Insurance need",
          "direction": "bidirectional",
          "linkText": "เบี้ยประกันสุขภาพ",
          "placement": "Related Calculators section"
        },
        {
          "slug": "คำนวณ-klc0401-ค่าเข้ารักษา",
          "reason": "Health planning → Cost awareness",
          "direction": "bidirectional",
          "linkText": "ค่าเข้ารักษา + งบประมาณ",
          "placement": "Related Calculators section"
        },
        {
          "slug": "คำนวณ-klc0425-งบสุขภาพปี",
          "reason": "Annual health budget planning",
          "direction": "bidirectional",
          "linkText": "งบสุขภาพประจำปี",
          "placement": "Related Calculators section"
        }
      ]
    },
    {
      "slug": "คำนวณ-เงินเดือน",
      "thaiName": "Salary Tax Calculator",
      "cluster": "Financial Planning",
      "priority": "P0-Hub",
      "relatedTo": [
        {
          "slug": "คำนวณ-ภาษีมูลค่าเพิ่ม",
          "reason": "Income tax → Business VAT (for business owners)",
          "direction": "unidirectional",
          "linkText": "ภาษีมูลค่าเพิ่ม (ผู้ประกอบการ)",
          "placement": "Related Calculators section"
        },
        {
          "slug": "คำนวณ-dca-เฉลี่ยต้นทุน",
          "reason": "After-tax income → Investment planning",
          "direction": "unidirectional",
          "linkText": "การลงทุน DCA",
          "placement": "Related Calculators section"
        },
        {
          "slug": "คำนวณ-ดอกเบี้ยเงินฝาก",
          "reason": "Salary → Savings & interest calculation",
          "direction": "unidirectional",
          "linkText": "ดอกเบี้ยเงินฝาก",
          "placement": "Related Calculators section"
        },
        {
          "slug": "คำนวณ-cashback",
          "reason": "Income optimization → Cashback shopping",
          "direction": "unidirectional",
          "linkText": "เปรียบเทียบคะแนนและแคชแบ็ก",
          "placement": "Related Calculators section"
        }
      ]
    },
    {
      "slug": "คำนวณ-ผ่อนบ้าน",
      "thaiName": "Mortgage Calculator",
      "cluster": "Loan & Financing",
      "priority": "P0-Hub",
      "relatedTo": [
        {
          "slug": "คำนวณ-apr",
          "reason": "Mortgage rate comparison (APR focus)",
          "direction": "bidirectional",
          "linkText": "เปรียบเทียบอัตราดอกเบี้ย (APR)",
          "placement": "Related Calculators section"
        },
        {
          "slug": "คำนวณ-bridge-loan",
          "reason": "Home purchase financing options",
          "direction": "bidirectional",
          "linkText": "โครงการสะพานเข้า",
          "placement": "Related Calculators section"
        },
        {
          "slug": "คำนวณ-klc0311-เสื่อมราคา",
          "reason": "Rental property investment calculation",
          "direction": "unidirectional",
          "linkText": "ค่าเสื่อมราคาที่ดิน",
          "placement": "Advanced Options"
        }
      ]
    },
    {
      "slug": "คำนวณ-ผ่อนรถ",
      "thaiName": "Vehicle Loan Calculator",
      "cluster": "Loan & Financing",
      "priority": "P0-Hub",
      "relatedTo": [
        {
          "slug": "คำนวณ-apr",
          "reason": "Car loan rate comparison",
          "direction": "bidirectional",
          "linkText": "เปรียบเทียบอัตราดอกเบี้ยกู้รถ",
          "placement": "Related Calculators section"
        },
        {
          "slug": "คำนวณ-deductible-ประกันรถ",
          "reason": "Vehicle insurance cost after loan decision",
          "direction": "bidirectional",
          "linkText": "ประกันรถ + ค่าประกัน",
          "placement": "Related Calculators section"
        },
        {
          "slug": "คำนวณ-ผ่อนกู้",
          "reason": "Alternative personal loan option",
          "direction": "bidirectional",
          "linkText": "ผ่อนกู้ส่วนบุคคล (ทางเลือก)",
          "placement": "Related Calculators section"
        }
      ]
    }
  ]
}
```

---

## Part 3: Cross-Cluster Linking Directives

### Directive 1: Loan Hub → Related Clusters

**Goal:** Loan-comparison users also see investment/savings options

| From | To | Intent Bridge | Link Anchor | CTA | Priority |
|------|-----|---|---|---|---|
| APR → Salary Tax | Alternative: Invest vs. Borrow | "After borrowing, see savings rate" | "ดูตัวเลือกการลงทุน" | P1-High |
| Mortgage → Financial Planning | Home ownership + tax benefits | "Homeowners can deduct interest" | "ดูผลกระทบภาษี" | P1-High |
| Vehicle Loan → Insurance | Insurance required after financing | "Get insurance quote next" | "ประกันรถ + ดอกเบี้ย" | P1-Medium |

### Directive 2: Health Hub → Financial Planning

**Goal:** Health users see insurance/budget planning

| From | To | Intent Bridge | Link Anchor | CTA | Priority |
|------|-----|---|---|---|---|
| BMI → Health Insurance | "Understand what insurance costs" | Link to insurance premium calc | "เบี้ยประกันตามสุขภาพ" | P1-High |
| Health Checkup → Annual Budget | Budget planning across life stages | "Plan annual health budget" | "งบสุขภาพปี" | P2-Medium |

### Directive 3: Financial Planning Hub → All Clusters

**Goal:** Salary/tax users see loan and health options

| From | To | Intent Bridge | Link Anchor | CTA | Priority |
|------|-----|---|---|---|---|
| Salary Tax → Mortgage | Home affordability after taxes | "See mortgage options" | "ผ่อนบ้าน (ตามเงินเดือนจริง)" | P1-High |
| Salary Tax → Health Insurance | Work benefits & tax deductions | "Insurance payroll deductions" | "เบี้ยประกัน (หักเงินเดือน)" | P2-Medium |

---

## Part 4: Article-to-Calculator Linking Strategy

Based on **CAL-1568** article priority list, here are the article → calculator links:

### Tier 1 Articles (Next 2 weeks)

#### Article 1: ทำไมคุณต้องมีที่ปรึกษาการเงิน? 7 สถานการณ์
**Status:** Brief ready (CAL-1351)  
**Search Volume:** 1,200-1,500/mo  
**Article Purpose:** Authority + calculator discovery  

**Calculator Links (7 total):**
1. **Scenario: "Confused about mortgage rates?"** → คำนวณ-ผ่อนบ้าน
2. **Scenario: "Car loan shopping?"** → คำนวณ-ผ่อนรถ  
3. **Scenario: "Salary vs. taxes?"** → คำนวณ-เงินเดือน
4. **Scenario: "Investment questions?"** → คำนวณ-dca-เฉลี่ยต้นทุน
5. **Scenario: "Insurance costs?"** → คำนวณ-klc0402-เบี้ยประกันสุขภาพ
6. **Scenario: "Retirement planning?"** → คำนวณ-irr-อัตราผลตอบแทนภายใน (if available)
7. **Scenario: "Health & wellness?"** → คำนวณ-bmi

**Link Placement:** In-article CTAs after each scenario explanation + footer "Try this calculator"

**Expected Flow:** Article (search) → 1 of 7 calculators → Related Calculators sidebar → other tools

---

#### Article 2: วิธีขอปรึกษาการเงินจาก AI ฟรี — คำถาม 3 ข้อแรก
**Status:** Brief ready  
**Search Volume:** 600-800/mo  
**Article Purpose:** Direct AI Advisor funnel + calculator context  

**Calculator Links (3 example-based):**
1. **Example 1: Mortgage question** → คำนวณ-ผ่อนบ้าน
2. **Example 2: Tax question** → คำนวณ-เงินเดือน
3. **Example 3: Loan question** → คำนวณ-apr

**Link Placement:** Inline with example Q&A + footer

**Expected Flow:** Article (search) → Calculator (context) → AI Advisor (question)

---

#### Article 3: ปรึกษาเรื่องเงินฟรี: ที่ไหน? และใครควรใช้ AI?
**Status:** Brief ready  
**Search Volume:** 2,000-2,500/mo  
**Article Purpose:** Comparison + education + calculator as free alternative  

**Calculator Links (5 major clusters):**
1. **Section: "Online calculators"** → APR, Mortgage, Vehicle, Salary (4 links)
2. **Section: "Budget planning"** → ดอกเบี้ยเงินฝาก, DCA
3. **Section: "AI Advisor positioning"** → AI Advisor page CTA

**Link Placement:** Context paragraph + visual calculator comparison table

---

#### Article 4: ติดเงิน ควรทำอะไร? 5 วิธี + AI ช่วย
**Status:** Brief ready  
**Search Volume:** 3,000-4,000/mo (HIGHEST Tier 1B)  
**Article Purpose:** Problem-solver article → loan + budget calculators  

**Calculator Links (problem-solving path):**
1. **Option 1: Budget tightening** → Budget calculator (need to verify exists)
2. **Option 2: Borrow money** → APR + Mortgage + Vehicle + Personal Loan
3. **Option 3: Extra income** → Not applicable (no income calc yet)
4. **Option 4: Savings optimization** → Cashback, Savings Interest

**Link Placement:** Each option has primary calculator link + secondary option links

**Expected Flow:** Article (high-intent problem) → Loan calculator → Related calculators (other options)

---

### Tier 2 Articles (Weeks 3-4)

**Pattern:** Each article links to 3-5 primary calculators in its domain

| Article | Primary Calculators | Volume |
|---------|---|---|
| Loan rate comparison | APR, Mortgage, Vehicle, Bridge | 1,500-2,000 |
| Salary & tax planning | Salary Tax, VAT, DCA | 1,200-1,500 |
| Home affordability | Mortgage, APR, Bridge Loan | 800-1,200 |
| Investment & savings | DCA, IRR, Savings Interest | 600-800 |
| Health & insurance | BMI, Health Insurance, Medical Costs | 1,000-1,500 |

---

## Part 5: Linking Priority Order (Ranked)

### P0: CRITICAL LINKS (Deploy Week 1)

Must exist for Phase 2 UX launch:

| From | To | Why | Format |
|------|-----|-----|--------|
| APR | Mortgage | Core loan cluster | Related Calculators widget |
| APR | Vehicle | Core loan cluster | Related Calculators widget |
| Mortgage | APR | Bidirectional authority | Related Calculators widget |
| Vehicle | APR | Bidirectional authority | Related Calculators widget |
| BMI | Health Insurance | Health cluster foundation | Related Calculators widget |
| Salary Tax | DCA | Financial planning flow | Related Calculators widget |
| AI Advisor article #1 | 7 calculators | Article discovery | Inline CTAs |
| AI Advisor article #4 | 5 loan calculators | High-volume funnel | Inline CTAs |

**Implementation Time:** CTO 2-3 hours (Related Calculators component + article markdown)

---

### P1: HIGH-PRIORITY LINKS (Deploy Week 1-2)

Strategic secondary links:

| From | To | Why | Format |
|------|-----|-----|--------|
| Mortgage | Bridge Loan | Financing options | Related Calculators widget |
| Vehicle | Insurance (Deductible) | Post-loan requirement | Related Calculators widget |
| Salary Tax | Health Insurance | Payroll deduction angle | Related Calculators widget |
| Article 2 | 3 example calculators | Example-driven content | Inline CTAs |
| Article 3 | 5 financial calculators | Comparison positioning | Table + CTAs |

**Implementation Time:** CTO additional 2 hours

---

### P2: MEDIUM-PRIORITY LINKS (Deploy Week 2-3)

Cluster-strengthening links:

| From | To | Why | Format |
|------|-----|-----|--------|
| APR | Personal Loan | Loan type completeness | Related Calculators widget |
| APR | Credit Card Interest | Debt comparison | Related Calculators widget |
| Mortgage | Property Depreciation | Investor angle | Advanced section |
| BMI | Annual Health Budget | Budget planning flow | Related Calculators widget |
| All health calcs | 2-way reciprocal | Cluster strength | Related Calculators widget |

**Implementation Time:** CTO 1-2 additional hours

---

### P3: NICE-TO-HAVE LINKS (Week 3+)

Volume/authority expansion:

| From | To | Why | Format |
|------|-----|-----|--------|
| All Tier 1A | AI Advisor | AI funnel support | Footer + sidebar |
| All financial calc | Relevant articles | Content support | Article links back to calcs |
| Health articles | BMI + insurance | Discovery support | Natural in-article CTAs |

---

## Part 6: Related Calculators CSV Format

For CTO database/component implementation:

```csv
from_slug,to_slug,reason,direction,link_text_th,placement,priority
คำนวณ-apr,คำนวณ-bridge-loan,Loan type comparison,bidirectional,โครงการสะพาน,Related Calculators,P0
คำนวณ-apr,คำนวณ-ผ่อนบ้าน,APR → Mortgage comparison,bidirectional,ผ่อนบ้าน + อัตราดอกเบี้ย,Related Calculators,P0
คำนวณ-apr,คำนวณ-ผ่อนรถ,APR → Vehicle loan,bidirectional,ผ่อนรถ + ดอกเบี้ย,Related Calculators,P0
คำนวณ-apr,คำนวณ-ผ่อนกู้,Personal loan comparison,bidirectional,ผ่อนกู้ส่วนบุคคล,Related Calculators,P1
คำนวณ-apr,คำนวณ-ดอกเบี้ยบัตรเครดิต,Credit card debt comparison,bidirectional,ดอกเบี้ยบัตรเครดิต,Related Calculators,P1
คำนวณ-bmi,คำนวณ-klc0402-เบี้ยประกันสุขภาพ,Health → Insurance need,bidirectional,เบี้ยประกันสุขภาพ,Related Calculators,P0
คำนวณ-bmi,คำนวณ-klc0401-ค่าเข้ารักษา,Health planning → Cost,bidirectional,ค่าเข้ารักษา + งบประมาณ,Related Calculators,P1
คำนวณ-bmi,คำนวณ-klc0425-งบสุขภาพปี,Annual health budget,bidirectional,งบสุขภาพประจำปี,Related Calculators,P1
คำนวณ-เงินเดือน,คำนวณ-ภาษีมูลค่าเพิ่ม,Income → Business VAT,unidirectional,ภาษีมูลค่าเพิ่ม,Related Calculators,P1
คำนวณ-เงินเดือน,คำนวณ-dca-เฉลี่ยต้นทุน,After-tax → Investment,unidirectional,การลงทุน DCA,Related Calculators,P0
คำนวณ-เงินเดือน,คำนวณ-ดอกเบี้ยเงินฝาก,Salary → Savings,unidirectional,ดอกเบี้ยเงินฝาก,Related Calculators,P0
คำนวณ-เงินเดือน,คำนวณ-cashback,Income optimization,unidirectional,เปรียบเทียบคะแนนและแคชแบ็ก,Related Calculators,P1
คำนวณ-ผ่อนบ้าน,คำนวณ-apr,Mortgage rate comparison,bidirectional,เปรียบเทียบอัตราดอกเบี้ย,Related Calculators,P0
คำนวณ-ผ่อนบ้าน,คำนวณ-bridge-loan,Home financing options,bidirectional,โครงการสะพานเข้า,Related Calculators,P1
คำนวณ-ผ่อนรถ,คำนวณ-apr,Car loan rates,bidirectional,เปรียบเทียบอัตราดอกเบี้ย,Related Calculators,P0
คำนวณ-ผ่อนรถ,คำนวณ-deductible-ประกันรถ,Insurance after loan,bidirectional,ประกันรถ + ค่าประกัน,Related Calculators,P0
คำนวณ-ผ่อนรถ,คำนวณ-ผ่อนกู้,Alternative personal loan,bidirectional,ผ่อนกู้ส่วนบุคคล,Related Calculators,P2
```

---

## Part 7: Implementation Checklist

### CTO Checklist (RelatedCalculators Component)

- [ ] Create `RelatedCalculators` component (displays 3-5 links)
- [ ] Query related-calc data from JSON/CSV above
- [ ] Place component on all calculator pages (post-calculator, pre-footer)
- [ ] Bidirectional linking: if A→B, then B→A automatically
- [ ] Mobile responsive: 375px vertical stack, desktop 2-col
- [ ] Dark mode parity with main calculator
- [ ] No rel="follow" for related calcs (stay on domain)
- [ ] Verify P0 links deployed before Phase 2 gate
- [ ] Add P1 links within 1 week post-Phase 2
- [ ] Monitor CTR lift on related calculators

**Estimated Effort:** 4-6 hours (component + integration + QA)

---

### Content Specialist Checklist (Article Links)

- [ ] Write Tier 1 articles (CAL-1568 Top 4)
- [ ] Embed calculator CTAs (inline paragraph links)
- [ ] Use provided link text Thai copy
- [ ] Test calculator links on 375px & desktop
- [ ] Verify footer reciprocal links
- [ ] Add utm_source=article&utm_medium=guide to AI Advisor links
- [ ] QA: All 28 article links live before Phase 2 gate

**Estimated Effort:** 2-4 hours (article editing + link insertion)

---

### UX Designer Checklist (Link Placement & Hierarchy)

- [ ] Design "Related Calculators" widget (visual hierarchy)
- [ ] Review placement: post-calculator primary position
- [ ] Create dark mode variant
- [ ] Ensure 48px touch targets (mobile)
- [ ] Verify contrast (WCAG AAA)
- [ ] Add animation if needed (fade-in on scroll)
- [ ] QA on 375px and desktop

**Estimated Effort:** 2-3 hours (design + handoff)

---

### Release QA Checklist

- [ ] All P0 links present on Tier 1A calculators
- [ ] Bidirectional links verified (A→B, B→A)
- [ ] Article links functional (no 404s)
- [ ] Mobile responsive (375px, 768px, desktop)
- [ ] Dark mode contrast verified
- [ ] No broken anchors or typos
- [ ] Reciprocal links follow no-follow best practice
- [ ] Performance: page load not degraded

---

## Part 8: Success Metrics

### Phase 2 Launch (Week of 2026-04-28)

| Metric | Target | Measurement |
|--------|--------|---|
| P0 links live | 100% | Manual QA verification |
| Calculator discoverability | 3-5 rel calcs per page | Component verification |
| Article → calc CTR | 2-3% (lift from 0%) | UTM tracking |
| Related calc clicks/user | 0.5+ average | Analytics segmentation |

### Post-Phase 2 (Weeks 5-8)

| Metric | Target | Measurement |
|--------|--------|---|
| Phase 1A avg time-on-site | +15% vs. baseline | GA4 segments |
| Related calculator CTR lift | +20-30% vs. no links | Cohort analysis |
| Article → calculator funnel | 50-70 clicks/month per article | Conversion funnel |
| Cross-cluster discovery | 15-20% users | Event tracking |

---

## Part 9: Dependencies & Blockers

### Required for Implementation

- ✅ **CAL-1566** (Metadata Audit) — DONE
- ✅ **CAL-1568** (Article Priority List) — DONE
- ⏳ **CAL-1351** (AI Advisor Article Strategy) — Needed for article briefs
- ⏳ **CTO Related-Calculators Component** — Implementation task
- ⏳ **Article writing** (CAL-1568 Top 4) — Content Specialist execution

### Known Gaps

1. **Budget calculator** — Referenced in "Low on Cash" article but unclear if exists. CTO to verify slug.
2. **Retirement calculator** — Article 1 scenario references retirement planning. Verify availability.
3. **Rental property cluster** — Property depreciation calculator exists but limited inventory. Defer to P2.

---

## Part 10: Design Pattern Reference

### Article Link Pattern (Markdown)

```markdown
ถ้าคุณลังเลเกี่ยวกับ 
**[อัตราดอกเบี้ยหรือการผ่อนบ้าน](คำนวณ-ผ่อนบ้าน)**
ลอง **ใช้เครื่องคำนวณแบบดำเนินการ** เพื่อดูตัวเลขจริง

[ลองผ่อนบ้านแบบดำเนินการ →](คำนวณ-ผ่อนบ้าน)
```

### Related Calculators Component Pattern

```
┌─ Related Calculators ─┐
│                       │
│ • APR Calculator      │ (click → loan hub)
│ • Mortgage + Rates    │ (click → financing)
│ • Car Loan Payment    │ (click → vehicle)
│                       │
└───────────────────────┘
```

---

## Approval & Sign-Off

**Delivered by:** SEO Specialist (ef423a59-de48-41df-9ab2-c81b7360a766)  
**Date:** 2026-04-24  
**Status:** READY FOR CTO/CONTENT SPECIALIST IMPLEMENTATION

**Awaiting approval from:**
- [ ] CMO review + routing approval
- [ ] CTO technical feasibility sign-off
- [ ] Content Specialist capacity confirmation

---

## Next Steps

1. **CMO:** Review & approve linking strategy alignment with CAL-1346 (keyword research)
2. **CTO:** Estimate RelatedCalculators component effort; create implementation subtask
3. **Content Specialist:** Confirm article writing timeline; ready for link insertion
4. **Release QA:** Prepare verification checklist for Phase 2 gate

**Timeline:** 
- Approval: 2026-04-24 (today)
- CTO implementation: 2026-04-25 to 2026-04-26  
- Content specialist deployment: parallel (article writing)
- Phase 2 gate verification: 2026-04-28
