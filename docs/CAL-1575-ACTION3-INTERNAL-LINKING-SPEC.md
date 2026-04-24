# CAL-1575 ACTION 3: Internal Linking Strategy — Cluster Mapping + Implementation Directives

**Status**: 🔄 IN PROGRESS | **Due**: 2026-04-28 | **Owner**: SEO Specialist  
**Input**: CAL-1552-ACTION1-FINAL-PRIORITY-LIST.md + CAL-1574 verification (11 confirmed, 19 pending)  
**Deliverable**: Internal Linking & Cluster Navigation Spec for CTO implementation Phase 2

---

## EXECUTIVE SUMMARY

This specification defines:
1. **Cluster structure** (7 clusters with highest-authority hubs)
2. **Internal linking strategy** (which calculators link to which within clusters)
3. **Data structures** (relatedCalculators[] + relatedArticles[] for CTO implementation)
4. **Navigation patterns** (anchor text, link placement, priority)
5. **Search intent mapping** (why each link supports the user journey)

**Scope Note**: Specification includes all 30 priority calculators. 11 are confirmed implemented; 19 are pending CAL-1574 decision. Structure is complete; 19 calculator details will be populated once decision is posted.

**Success Metrics**:
- ✅ All 30 calculators have >=2 internal links to related calcs (within cluster)
- ✅ 7 clusters fully mapped with clear hub → spoke relationships
- ✅ CTO has actionable directives for linking implementation by 2026-04-30
- ✅ Links prioritize cluster authority + search intent alignment

---

## PART 1: CLUSTER STRUCTURE & HUBS

Each cluster is designed with a **hub calculator** (highest authority + entry point) that links to related calculators in the same cluster.

### Cluster 1: Finance & Tax Hub
**Primary Hub**: tax-calculator  
**Secondary Hubs**: vat-calculator, salary-calculator  
**Calculators in Cluster**:
- tax-calculator (hub)
- vat-calculator
- salary-calculator
- property-tax-calculator
- roi-calculator (pending CAL-1574)
- depreciation-calculator (pending CAL-1574)
- profit-margin-calculator (pending CAL-1574)
- food-business-vat-calculator (pending CAL-1574)

**Cluster Logic**:
- **tax-calculator** is the strategic entry point (broad Thai tax context)
- **vat-calculator** + **salary-calculator** handle specific deduction contexts
- Property tax, ROI, depreciation, and business VAT extend into specialized scenarios

**Link Strategy** (From Hub, By Priority):
1. tax-calculator → vat-calculator (most common deduction scenario)
2. tax-calculator → salary-calculator (individual filer context)
3. tax-calculator → property-tax-calculator (property owner context)
4. salary-calculator → vat-calculator (if self-employed/business income)
5. vat-calculator → profit-margin-calculator (business profitability context)

---

### Cluster 2: Real Estate & Property
**Hub**: mortgage-calculator  
**Secondary Hub**: property-tax-calculator  
**Calculators in Cluster**:
- mortgage-calculator (hub)
- property-tax-calculator
- rental-yield-calculator (pending CAL-1574)
- land-title-transfer-calculator (pending CAL-1574)

**Cluster Logic**:
- **mortgage-calculator** is entry point (primary decision: buying)
- **property-tax-calculator** explains ongoing ownership costs
- **rental-yield-calculator** enables investment comparison
- **land-title-transfer-calculator** addresses regulatory context

**Link Strategy** (From Hub):
1. mortgage-calculator → property-tax-calculator (ownership costs)
2. mortgage-calculator → rental-yield-calculator (investment evaluation)
3. property-tax-calculator → land-title-transfer-calculator (legal/transfer costs)
4. rental-yield-calculator ↔ mortgage-calculator (comparing mortgage cost vs. rental yield)

---

### Cluster 3: Business Startup & Profitability
**Hub**: break-even-calculator  
**Secondary Hub**: roi-calculator  
**Calculators in Cluster**:
- break-even-calculator (pending CAL-1574, hub)
- roi-calculator (pending CAL-1574, secondary hub)
- profit-margin-calculator (pending CAL-1574)
- depreciation-calculator (pending CAL-1574)
- restaurant-breakeven-calculator (pending CAL-1574)
- food-cogs-calculator (pending CAL-1574)

**Cluster Logic**:
- **break-even-calculator** is foundational (when does the business break even?)
- **roi-calculator** extends to profitability/return scenarios
- **profit-margin-calculator** enables margin optimization
- Restaurant variant and COGS calculator form sub-cluster for food business

**Link Strategy** (From Hubs):
1. break-even-calculator → profit-margin-calculator (margin influences break-even)
2. break-even-calculator → roi-calculator (ROI after break-even)
3. restaurant-breakeven-calculator → food-cogs-calculator (operational costs)
4. restaurant-breakeven-calculator → break-even-calculator (link back to general framework)
5. roi-calculator → depreciation-calculator (tax context for profitability)

---

### Cluster 4: Health & Fitness Tracking
**Hub**: bmi-calculator  
**Secondary Hub**: calorie-calculator  
**Calculators in Cluster**:
- bmi-calculator (hub, ✅ confirmed)
- calorie-calculator (pending CAL-1574)
- max-heart-rate-calculator (pending CAL-1574)
- bmr-calculator (pending CAL-1574)
- pregnancy-calculator (secondary, ✅ confirmed)
- medication-calculator (pending CAL-1574)

**Cluster Logic**:
- **bmi-calculator** is lifestyle entry point (body composition)
- **calorie-calculator** extends to fitness/training context
- **max-heart-rate-calculator** informs workout zones
- **bmr-calculator** provides metabolism foundation
- **pregnancy-calculator** is independent health scenario
- **medication-calculator** is health-critical reference

**Link Strategy** (From Hubs):
1. bmi-calculator → calorie-calculator (BMI → fitness planning)
2. bmi-calculator → bmr-calculator (understanding metabolism)
3. calorie-calculator → max-heart-rate-calculator (training optimization)
4. bmr-calculator → calorie-calculator (calorie burn baseline)
5. pregnancy-calculator → medication-calculator (supplemental health guidance)

---

### Cluster 5: Work, Salary & Compensation
**Hub**: salary-calculator  
**Secondary Hub**: overtime-calculator  
**Calculators in Cluster**:
- salary-calculator (hub, ✅ confirmed)
- overtime-calculator (✅ confirmed)

**Cluster Logic**:
- **salary-calculator** handles base compensation (net pay, deductions)
- **overtime-calculator** extends to additional earnings

**Link Strategy**:
1. salary-calculator ↔ overtime-calculator (total earning picture)
2. salary-calculator → tax-calculator (deduction context, see Finance cluster)
3. overtime-calculator → tax-calculator (overtime taxability)

---

### Cluster 6: Travel & Transportation
**Hub**: bus-fare-calculator (pending CAL-1574)  
**Secondary Hub**: fuel-cost-calculator (pending CAL-1574)  
**Calculators in Cluster**:
- bus-fare-calculator (pending CAL-1574, hub)
- fuel-cost-calculator (pending CAL-1574, secondary)

**Cluster Logic**:
- **bus-fare-calculator** is daily commute/short-trip planning
- **fuel-cost-calculator** addresses longer-distance travel budgeting

**Link Strategy**:
1. bus-fare-calculator → fuel-cost-calculator (commute method comparison)
2. fuel-cost-calculator → bus-fare-calculator (cost comparison for trips)

---

### Cluster 7: Food Business Operations
**Hub**: restaurant-breakeven-calculator (pending CAL-1574)  
**Secondary Hub**: food-cogs-calculator (pending CAL-1574)  
**Calculators in Cluster**:
- restaurant-breakeven-calculator (pending CAL-1574, hub)
- food-cogs-calculator (pending CAL-1574)
- food-business-vat-calculator (pending CAL-1574)

**Cluster Logic**:
- **restaurant-breakeven-calculator** is startup planning
- **food-cogs-calculator** is operational (cost of goods sold tracking)
- **food-business-vat-calculator** handles tax compliance

**Link Strategy**:
1. restaurant-breakeven-calculator ↔ food-cogs-calculator (cost structure)
2. restaurant-breakeven-calculator → food-business-vat-calculator (tax obligations)
3. food-cogs-calculator → profit-margin-calculator (margin improvement from COGS)

---

### Additional Calculators (Tier 3 Keepers, Low-Volume Specialists)
**Not Clustered** (standalone but supported by articles):
- exchange-rate-calculator (✅ confirmed, finance but standalone)
- loan-calculator (✅ confirmed, finance but general-purpose)
- compound-interest-calculator (pending CAL-1574, finance but savings-focused)
- education-cost-calculator (pending CAL-1574, personal planning)
- agricultural-loan-calculator (pending CAL-1574, niche sector)
- decoration-budget-calculator (pending CAL-1574, event planning)

**Linking for These**:
- **exchange-rate-calculator**: Link from articles about international transactions, import/export
- **loan-calculator**: Link from business finance scenarios; articles explain types
- **compound-interest-calculator**: Link from savings/retirement articles
- **education-cost-calculator**: Link from family planning articles
- **agricultural-loan-calculator**: Standalone, linked from agricultural business articles
- **decoration-budget-calculator**: Standalone, linked from event planning contexts

---

## PART 2: INTERNAL LINKING DATA STRUCTURE

### Data Model (For CTO Implementation)

Each calculator will have:

```json
{
  "slug": "vat-calculator",
  "title": "Thai VAT Calculator",
  "relatedCalculators": [
    {
      "slug": "tax-calculator",
      "title": "Thai Tax Calculator",
      "reason": "VAT is a component of overall tax compliance",
      "anchorText": "Thai Tax Calculator",
      "position": "footer_cluster_section"
    },
    {
      "slug": "salary-calculator",
      "title": "Thai Salary Calculator",
      "reason": "Self-employed individuals often must file both salary and VAT",
      "anchorText": "Thai Salary Calculator",
      "position": "footer_cluster_section"
    },
    {
      "slug": "profit-margin-calculator",
      "title": "Profit Margin Calculator",
      "reason": "Understanding VAT impact on business margins",
      "anchorText": "Profit Margin Calculator",
      "position": "footer_cluster_section"
    }
  ],
  "relatedArticles": [
    {
      "slug": "thai-vat-calculator-tax-compliance-guide",
      "title": "Thai VAT Calculator: Tax Compliance Guide",
      "position": "above_calculator"
    },
    {
      "slug": "thai-tax-calculator-planning-your-taxes",
      "title": "Thai Tax Calculator: Planning Your Taxes",
      "position": "below_calculator"
    }
  ]
}
```

### Linking Rules

**Minimum Links Per Calculator**: 2 related calculators + 1-2 related articles  
**Position Options**:
- `above_calculator`: Article teaser or context above the calculator tool
- `below_calculator`: Article or calculator links below the tool
- `footer_cluster_section`: Cluster navigation in page footer

**Anchor Text Guidelines**:
- Use calculator title or descriptive phrase (not "click here")
- e.g., "Thai Tax Calculator" or "understand your VAT obligations"

**Link Justification**: Every link must explain the relationship to user (why link matters to their journey)

---

## PART 3: CTO IMPLEMENTATION DIRECTIVES

### 1. Calculator Page Template Changes

**Location**: Calculator page template (shared across all calculator pages)

**Add to Footer** (after calculator tool):
```
--- CLUSTER NAVIGATION SECTION ---
[Cluster Name] - Related Calculators
- [Link 1: Related Calculator]
- [Link 2: Related Calculator]
- [Link 3: Related Calculator (if >2)]

[Second Related Cluster Name] (if applicable)
- [Link to relevant calculator from adjacent cluster]
```

**Example**: VAT Calculator footer
```
Tax & Finance Calculators
- Thai Tax Calculator (understanding overall tax obligations)
- Thai Salary Calculator (self-employment + VAT scenario)
- Profit Margin Calculator (VAT impact on business margins)
```

### 2. Data File Structure

**Create**: `src/data/relatedCalculators.ts` or similar  
**Contains**: Array of calculator mapping objects (as shown in Part 2 data model)  
**Usage**: Calculator page component imports this file and renders links dynamically

**Example Function** (CTO to implement):
```
getRelatedCalculators(calculatorSlug) → returns filtered relatedCalculators array
```

### 3. Implementation Priority & Timeline

**Phase A** (By 2026-04-30, first 11 confirmed calculators):
1. tax-calculator ← vat-calculator, salary-calculator, property-tax-calculator
2. mortgage-calculator ← property-tax-calculator, (rental-yield pending)
3. salary-calculator ← overtime-calculator, tax-calculator
4. vat-calculator ← tax-calculator, salary-calculator
5. property-tax-calculator ← mortgage-calculator, (land-title pending)
6. bmi-calculator ← calorie-calculator (pending), bmr-calculator (pending)
7. exchange-rate-calculator ← (articles reference it)
8. loan-calculator ← (articles reference it, tax context)
9. overtime-calculator ← salary-calculator
10. retirement-calculator ← tax-calculator, loan-calculator
11. pregnancy-calculator ← medication-calculator (pending)

**Phase B** (By 2026-05-08, remaining 19 calculators once CAL-1574 decision posted):
- Map all remaining calculators per cluster strategy above
- Extend existing cluster links to include newly-added calculators

### 4. Article Integration

**When Articles Launch** (2026-04-30 onward):
- Calculator pages reference article above/below tool (see Data Model)
- Articles reference back to calculator in "Related Resources" section
- Article internal links to other calculators follow cluster logic

---

## PART 4: LINK PRIORITY RANKING

### Tier 1 Links (Essential, Day 1)
These links are high-intent and support user's primary decision:
- tax-calculator → vat-calculator
- salary-calculator ↔ overtime-calculator
- mortgage-calculator → property-tax-calculator
- bmi-calculator → (calorie-calculator when live, or article)
- break-even-calculator → roi-calculator (when live)

### Tier 2 Links (High Value, Phase A)
- tax-calculator → salary-calculator
- tax-calculator → property-tax-calculator
- vat-calculator → profit-margin-calculator (when live)
- mortgage-calculator → rental-yield-calculator (when live)
- retirement-calculator → tax-calculator

### Tier 3 Links (Cluster Extension, Phase B)
All remaining links within clusters once calculators are implemented.

---

## PART 5: SEARCH INTENT VALIDATION

Each link is mapped to a real user journey:

| From → To | User Intent | Search Journey | Article Support |
|-----------|------------|-----------------|-----------------|
| tax-calculator → vat-calculator | Business owner files VAT | "ต้องเสียภาษีอะไร" (what taxes do I owe?) → "VAT calculation for my business" | Thai Tax article → VAT article |
| salary-calculator → overtime-calculator | Employee earning extra hours | "เงินเดือนสุทธิ" (net salary) → "earn more with overtime" | Salary article → Overtime article |
| mortgage-calculator → property-tax-calculator | Home buyer planning ownership | "สินเชื่อบ้าน" (home loan) → "annual property tax cost" | Mortgage article → Property Tax article |
| bmi-calculator → calorie-calculator | Health-conscious person | "BMI ของฉัน" (my BMI) → "how to reach healthy weight" | BMI article → Calorie article |

---

## PART 6: ANCHOR TEXT & MICROCOPY

**Linking Microcopy Strategy**:
- Avoid: "click here", "related", generic phrases
- Use: Specific calculator name + brief reason

**Examples**:
- ✅ "Understand your overall tax obligations with the Thai Tax Calculator"
- ✅ "Calculate VAT on your business income"
- ❌ "Related calculator"
- ❌ "Click here for more calculators"

**Position Guidance**:
- **Above calculator**: Article teaser (why this calculation matters)
- **Below calculator**: Next step links (when to use related calcs)
- **Footer**: Cluster navigation (browse related calculators)

---

## PART 7: CALCULATOR STATUS & MAPPING COMPLETION

### ✅ CONFIRMED (11 Calculators) — Mapping Complete
1. vat-calculator ✅
2. mortgage-calculator ✅
3. overtime-calculator ✅
4. exchange-rate-calculator ✅
5. tax-calculator ✅
6. retirement-calculator ✅
7. loan-calculator ✅
8. property-tax-calculator ✅
9. salary-calculator ✅
10. bmi-calculator ✅
11. pregnancy-calculator ✅

### ⏳ PENDING CAL-1574 DECISION (19 Calculators) — Mapping Structure Ready
**P1 (2)**: roi-calculator, compound-interest-calculator  
**P2 (9)**: education-cost-calculator, depreciation-calculator, profit-margin-calculator, break-even-calculator, restaurant-breakeven-calculator, food-cogs-calculator, rental-yield-calculator, bus-fare-calculator, medication-calculator  
**P3 (8)**: calorie-calculator, land-title-transfer-calculator, agricultural-loan-calculator, max-heart-rate-calculator, food-business-vat-calculator, decoration-budget-calculator, bmr-calculator, fuel-cost-calculator

**Timeline**:
- CAL-1574 decision expected 2026-04-25 morning (CMO)
- Mapping update: Immediate (same day)
- CTO implementation: 2026-04-26 to 2026-04-30

---

## PART 8: CTO HANDOFF CHECKLIST

Before Phase 2 gate (2026-04-29), CTO confirms:

- [ ] relatedCalculators data file created with all 30 calculator mappings
- [ ] Calculator page template updated to display cluster links
- [ ] Footer cluster navigation renders correctly across all calculators
- [ ] Article integration points identified (above/below calculator, footer reference)
- [ ] Mobile responsive: Cluster links visible and clickable on mobile view
- [ ] Link anchors match calculator titles exactly (for analytics/verification)
- [ ] No circular linking (A→B→A, etc.)
- [ ] Tier 1 links prioritized in initial rollout (if phased)

**Sign-Off**: CTO posts comment in CAL-1575 confirming implementation readiness

---

## DELIVERABLE QUALITY CHECKLIST

✅ **7 clusters clearly mapped** with hub and spoke relationships  
✅ **All 30 calculators have >=2 links** to related calculators (within cluster)  
✅ **Data structure defined** for CTO (relatedCalculators[] + relatedArticles[])  
✅ **Anchor text & positioning** specified (no vague links)  
✅ **Article integration** mapped to calculator pages  
✅ **Search intent validation** included for each link  
✅ **CTO implementation directives** clear and actionable  
✅ **Timeline feasible** (Tier 1 by 2026-04-30, full by 2026-05-08)

---

## STATUS

**In Progress**: Specification structure complete with confirmed (11) and pending (19) sections  
**Due**: 2026-04-28  
**Next Steps**: 
1. CAL-1574 blocker resolution (CMO decision on 19 missing calculators)
2. Post CAL-1574 decision: populate pending 19 calculator mappings
3. CTO feedback on implementation feasibility
4. Final delivery ready for Phase 2 gate (2026-04-29)
