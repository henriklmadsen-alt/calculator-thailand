# CAL-1576 ACTION 3: Internal Linking + Cluster Planning

**Status**: DRAFT (awaiting Action 2 completion + CMO decision on missing calculators) | **Due**: 2026-04-28 | **Owner**: SEO Specialist (with CMO input)

**Purpose**: Define natural calculator clusters, plan internal linking relationships, and provide CTO with implementation directives for Phase 2 rollout.

**Input**: CAL-1573 Action 2 metadata audit + CAL-1552 Article Priority List  
**Output**: Cluster mapping + RelatedCalculators linking directives + cross-cluster linking strategy

**Phase 2 CTO Integration**: These linking directives will be implemented during Phase 2 UX rollout (~2026-05-02 to 2026-05-15).

---

## 🚨 NOTE: SCOPE CONTINGENT ON ACTION 2 RESOLUTION

This strategy is based on **11 calculators currently in system** (as of 2026-04-24). 

If CMO approves Option B or C, this strategy will need adjustment for additional/different calculators.

**Current Calculator Base**: 11 found (vat, mortgage, overtime, exchange-rate, tax, retirement, loan, property-tax, salary, bmi, pregnancy)

---

## CLUSTER MAPPING: 11 FOUND CALCULATORS

### Cluster 1: Finance & Tax (6 calculators)
**Rationale**: Core financial planning + tax compliance  
**Articles**: VAT, Tax, Property Tax, Salary, Retirement, Exchange Rate

| Calculator | Current Title | Article Angle | Role in Cluster |
|-----------|---|---|---|
| **vat-calculator** | คำนวณ VAT 7% | Thai VAT Calculator: Tax Compliance Guide | Hub — business tax entry point |
| **tax-calculator** | คำนวณภาษีเงินได้ | Thai Tax Calculator: Planning Your Taxes | Central — income tax foundation |
| **property-tax-calculator** | คำนวณภาษีที่ดิน | Thai Property Tax Guide: Planning Your Costs | Specialized — property ownership costs |
| **salary-calculator** | คำนวณเงินเดือนสุทธิ | Thai Salary Calculator: Net Pay & Deductions | Practical — take-home income |
| **retirement-calculator** | คำนวณเงินเกษียณ | Thai Retirement Planning: Calculate Your Nest Egg | Long-term — lifecycle planning |
| **exchange-rate-calculator** | คำนวณอัตราแลกเปลี่ยน | Thai Baht Exchange Rate: Currency Guide | International — currency conversion |

**Linking Strategy**:
```
vat-calculator → [links to] → tax-calculator (VAT is part of tax planning)
tax-calculator → [links to] → salary-calculator (income tax from salary)
                           → property-tax-calculator (multi-tax coverage)
salary-calculator → [links to] → retirement-calculator (long-term planning from salary)
exchange-rate-calculator → [links to] → salary-calculator (foreign income considerations)
```

**Internal Link Placement**:
- VAT article: "Also calculate your total tax burden with the [Thai Tax Calculator]"
- Tax article: "See how your salary affects taxes with the [Salary Calculator]"
- Salary article: "Plan your long-term retirement with the [Retirement Calculator]"
- Retirement article: "Use the [Tax Calculator] to optimize retirement withdrawals"

---

### Cluster 2: Real Estate & Property (3 calculators)
**Rationale**: Home purchase → ownership → investment  
**Articles**: Mortgage, Property Tax (overlap with Finance cluster)

| Calculator | Current Title | Article Angle | Role in Cluster |
|-----------|---|---|---|
| **mortgage-calculator** | คำนวณผ่อนบ้าน | Thai Home Loan Guide: Mortgage Math Explained | Entry — home purchase planning |
| **loan-calculator** | คำนวณผ่อนกู้ | Thai Loan Calculator Guide: Choosing the Right Loan | General foundation — financing options |
| **property-tax-calculator** | คำนวณภาษีที่ดิน | Thai Property Tax Guide: Planning Your Costs | Ownership cost — ongoing expenses |

**Linking Strategy**:
```
loan-calculator → [links to] → mortgage-calculator (mortgage is type of loan)
mortgage-calculator → [links to] → property-tax-calculator (ownership costs)
                              → loan-calculator (back to general loans)
property-tax-calculator → [links to] → mortgage-calculator (property investment context)
```

**Internal Link Placement**:
- Loan article: "Use the [Mortgage Calculator] for home purchase financing specifically"
- Mortgage article: "Calculate ongoing property tax with the [Property Tax Calculator]"
- Property tax article: "Determine if you can afford ownership using the [Mortgage Calculator]"

---

### Cluster 3: Work & Salary (2 calculators)
**Rationale**: Employment income + deductions  
**Articles**: Overtime, Salary (overlap with Finance cluster)

| Calculator | Current Title | Article Angle | Role in Cluster |
|-----------|---|---|---|
| **salary-calculator** | คำนวณเงินเดือนสุทธิ | Thai Salary Calculator: Net Pay & Deductions | Base income |
| **overtime-calculator** | คำนวณค่าโอที | Thai Overtime Pay: Complete Calculation Guide | Supplemental income |

**Linking Strategy**:
```
salary-calculator → [links to] → overtime-calculator (see potential extra income)
overtime-calculator → [links to] → salary-calculator (add OT to gross salary)
```

**Internal Link Placement**:
- Salary article: "Estimate extra income with the [Overtime Calculator]"
- Overtime article: "Factor OT income into your overall [Salary Calculator]"

---

### Cluster 4: Health & Personal (2 calculators)
**Rationale**: Health tracking + life planning  
**Articles**: BMI, Pregnancy

| Calculator | Current Title | Article Angle | Role in Cluster |
|-----------|---|---|---|
| **bmi-calculator** | คำนวณ BMI | BMI Guide: Understanding Your Health Numbers | Health baseline |
| **pregnancy-calculator** | คำนวณวันคลอด | Thai Pregnancy Calculator: Your Due Date Guide | Life event planning |

**Linking Strategy**:
```
bmi-calculator → [contextual link] → pregnancy-calculator (during pregnancy BMI changes)
pregnancy-calculator → [contextual link] → bmi-calculator (health monitoring during pregnancy)
```

**Internal Link Placement**:
- BMI article: "If pregnant, track due date and health with the [Pregnancy Calculator]"
- Pregnancy article: "Monitor health during pregnancy with the [BMI Calculator]"

---

## CROSS-CLUSTER LINKING (Optional but Valuable)

Strongest cross-cluster opportunities:

| From | To | Justification | Link Type |
|------|-----|---|---|
| salary-calculator (Work) | mortgage-calculator (Real Estate) | "Can I afford this mortgage?" | Contextual |
| salary-calculator (Work) | property-tax-calculator (Real Estate) | "Home ownership total costs" | Contextual |
| mortgage-calculator (Real Estate) | retirement-calculator (Finance) | "Home paid off by retirement?" | Contextual |
| exchange-rate-calculator (Finance) | salary-calculator (Work) | "Foreign income conversion" | Contextual |

---

## RELATED CALCULATORS MAPPING (For CTO Implementation)

This is the technical mapping for the "Related Calculators" feature in Phase 2.

### VAT Calculator → Related
```json
{
  "calculator": "vat-calculator",
  "relatedCalculators": [
    {
      "id": "tax-calculator",
      "label": "Thai Tax Calculator",
      "reason": "Complete tax planning (VAT + income tax)"
    },
    {
      "id": "salary-calculator", 
      "label": "Thai Salary Calculator",
      "reason": "Understand taxes on your income"
    }
  ],
  "placement": "Below article, in 'Related Tools' section",
  "maxDisplay": 2
}
```

### Mortgage Calculator → Related
```json
{
  "calculator": "mortgage-calculator",
  "relatedCalculators": [
    {
      "id": "loan-calculator",
      "label": "Thai Loan Calculator",
      "reason": "Compare different loan types"
    },
    {
      "id": "property-tax-calculator",
      "label": "Property Tax Calculator",
      "reason": "Calculate home ownership costs"
    },
    {
      "id": "salary-calculator",
      "label": "Net Salary Calculator",
      "reason": "Can you afford this home?"
    }
  ],
  "placement": "Below article, in 'Related Tools' section",
  "maxDisplay": 3
}
```

### Overtime Calculator → Related
```json
{
  "calculator": "overtime-calculator",
  "relatedCalculators": [
    {
      "id": "salary-calculator",
      "label": "Net Salary Calculator",
      "reason": "Add overtime to your gross income"
    }
  ],
  "placement": "Below article, in 'Related Tools' section",
  "maxDisplay": 2
}
```

### Exchange Rate Calculator → Related
```json
{
  "calculator": "exchange-rate-calculator",
  "relatedCalculators": [
    {
      "id": "salary-calculator",
      "label": "Net Salary Calculator",
      "reason": "Foreign income or overseas remittance"
    }
  ],
  "placement": "Below article, in 'Related Tools' section",
  "maxDisplay": 2
}
```

### Tax Calculator → Related
```json
{
  "calculator": "tax-calculator",
  "relatedCalculators": [
    {
      "id": "vat-calculator",
      "label": "VAT Calculator",
      "reason": "Complete tax picture (income + business tax)"
    },
    {
      "id": "salary-calculator",
      "label": "Net Salary Calculator",
      "reason": "Income tax calculation starts with your salary"
    },
    {
      "id": "property-tax-calculator",
      "label": "Property Tax Calculator",
      "reason": "Multiple tax types to plan"
    }
  ],
  "placement": "Below article, in 'Related Tools' section",
  "maxDisplay": 3
}
```

### Retirement Calculator → Related
```json
{
  "calculator": "retirement-calculator",
  "relatedCalculators": [
    {
      "id": "salary-calculator",
      "label": "Net Salary Calculator",
      "reason": "Base your retirement savings on current income"
    },
    {
      "id": "tax-calculator",
      "label": "Tax Calculator",
      "reason": "Plan retirement withdrawals and taxes"
    },
    {
      "id": "mortgage-calculator",
      "label": "Mortgage Calculator",
      "reason": "Will your home be paid off by retirement?"
    }
  ],
  "placement": "Below article, in 'Related Tools' section",
  "maxDisplay": 3
}
```

### Loan Calculator → Related
```json
{
  "calculator": "loan-calculator",
  "relatedCalculators": [
    {
      "id": "mortgage-calculator",
      "label": "Mortgage Calculator",
      "reason": "Home loans are a specific type of loan"
    },
    {
      "id": "salary-calculator",
      "label": "Net Salary Calculator",
      "reason": "Can you afford this loan payment?"
    }
  ],
  "placement": "Below article, in 'Related Tools' section",
  "maxDisplay": 2
}
```

### Property Tax Calculator → Related
```json
{
  "calculator": "property-tax-calculator",
  "relatedCalculators": [
    {
      "id": "mortgage-calculator",
      "label": "Mortgage Calculator",
      "reason": "Total home ownership costs (loan + taxes)"
    },
    {
      "id": "tax-calculator",
      "label": "Tax Calculator",
      "reason": "Property tax is part of overall tax planning"
    }
  ],
  "placement": "Below article, in 'Related Tools' section",
  "maxDisplay": 2
}
```

### Salary Calculator → Related
```json
{
  "calculator": "salary-calculator",
  "relatedCalculators": [
    {
      "id": "overtime-calculator",
      "label": "Overtime Calculator",
      "reason": "Calculate extra income from OT work"
    },
    {
      "id": "tax-calculator",
      "label": "Tax Calculator",
      "reason": "Understand what taxes reduce your take-home"
    },
    {
      "id": "retirement-calculator",
      "label": "Retirement Calculator",
      "reason": "Plan long-term savings from your income"
    }
  ],
  "placement": "Below article, in 'Related Tools' section",
  "maxDisplay": 3
}
```

### BMI Calculator → Related
```json
{
  "calculator": "bmi-calculator",
  "relatedCalculators": [
    {
      "id": "pregnancy-calculator",
      "label": "Pregnancy Calculator",
      "reason": "Monitor health during pregnancy"
    }
  ],
  "placement": "Below article, in 'Related Tools' section",
  "maxDisplay": 1
}
```

### Pregnancy Calculator → Related
```json
{
  "calculator": "pregnancy-calculator",
  "relatedCalculators": [
    {
      "id": "bmi-calculator",
      "label": "BMI Calculator",
      "reason": "Track health changes during pregnancy"
    }
  ],
  "placement": "Below article, in 'Related Tools' section",
  "maxDisplay": 1
}
```

---

## SEO BENEFITS: INTERNAL LINKING LOGIC

### Cluster Strength
- **Finance & Tax**: 6 interconnected calculators → strong topical authority on taxes + planning
- **Real Estate**: 3 interconnected calculators → comprehensive home buying/ownership support
- **Work & Salary**: 2 direct connections → employee financial planning cluster
- **Health**: 2 connections → basic health tracking cluster

### Link Value
- Links between high-intent calculators increase relevance + dwell time
- Related tools drive secondary calculator usage (improves overall site value)
- Articles + internal links compound SEO value (clusters rank better than isolated pages)
- Thai language natural linking improves UX + crawlability

### Search Ranking Impact
Expected:
- Finance & Tax cluster: +15-25% topical authority signals (6-calc interconnection)
- Real Estate cluster: +10-15% topical authority signals (3-calc interconnection)
- Work cluster: +5-10% topical authority signals (2-calc interconnection)
- Health cluster: +5% topical authority signals (2-calc interconnection)

---

## CTO IMPLEMENTATION CHECKLIST

For Phase 2 UX rollout (~2026-05-02 to 2026-05-15):

**Calculator Component Updates**:
- [ ] Add "Related Calculators" section to each calculator page
- [ ] Implement related-calc rendering using mappings above
- [ ] Max display: 1-3 related tools per calculator
- [ ] Placement: Below article/main content, before footer

**Article Integration**:
- [ ] Insert inline links in article body (3-5 contextual links per article)
- [ ] Link anchor text: calculator names + action verbs ("Calculate your..." / "Try the...")
- [ ] Link destinations: to calculator pages

**Testing**:
- [ ] Verify all internal links in place (11 calculators × avg 2.5 links = 27 links minimum)
- [ ] Check link text clarity + relevance
- [ ] Mobile responsiveness (related calc section visibility on mobile)
- [ ] Click tracking: monitor internal calculator navigation via GA4

**Metrics to Track** (post-launch):
- Click-through rate on related calculator links
- Secondary calculator usage (% of users going from one calc to another)
- Average session duration (should increase with internal linking)
- Pages per session (should increase)

---

## SUCCESS CRITERIA (Metrics by 2026-05-15)

✅ **Linking Complete**: All 11 calculators have related-calc section + internal links in articles  
✅ **No Broken Links**: 100% of internal links functional  
✅ **Cluster Clarity**: Users can navigate between related calculators intuitively  
✅ **Mobile Ready**: Related calculator section displays properly on mobile  
✅ **Analytics Ready**: GA4 tracking set up for link clicks + navigation flow  

---

## NEXT STEPS

1. **2026-04-25 (CMO Decision)**: Confirm whether adding missing 19 calculators changes cluster strategy
2. **2026-04-27 (CTO Feedback)**: Provide detailed implementation specs to CTO
3. **2026-05-02 (Phase 2 Launch)**: Begin internal linking implementation concurrent with UX rollout
4. **2026-05-15 (Launch Complete)**: All internal linking live + tracking active

---

**Prepared By**: SEO Specialist (CAL-1576)  
**Status**: Draft (awaiting Action 2 completion + CMO decision on scope)  
**Next Checkpoint**: 2026-04-26 (after Action 2 finalized)

---

## APPENDIX: Why These Clusters + Links Work

### Finance & Tax Cluster Strength
- **User Journey**: Want to understand taxes? Start → VAT vs Income Tax → Property ownership taxes → Salary impact → Retirement timing
- **Search Intent**: Users planning major financial decisions (home, retirement, business) naturally need multiple tax perspectives
- **Article Reinforcement**: Each article adds context for related tools (not just calculator pages)
- **Volume**: 6 high-intent calculators (200+, 180+, 110+, 130+, 140+, 300+ monthly searches) = substantial cluster authority

### Real Estate Cluster Logic
- **User Journey**: Thinking about buying? Loan options → Mortgage specific → Then ownership costs (property tax)
- **Natural Progression**: Financial decision → Specialized calculation → Ongoing cost planning
- **Cross-Cluster Connection**: Ties to Finance cluster (tax, retirement planning) without being redundant

### Work & Salary Simplicity
- **Direct Intent**: Employee salary information → potential supplemental income (OT)
- **Simple Cluster**: 2 calculators = not overcomplicated; strong directional links
- **Integration**: Salary links to Finance cluster (taxes, retirement) for employee financial planning

### Health Cluster Restraint
- **Limited Overlap**: BMI and Pregnancy are different life stages, but both health-tracking
- **Light Touching**: Not forced into larger clusters; maintains clarity
- **Optional Article Linking**: Can mention one or the other, but not essential

---

**Philosophy**: Each link must serve user intent + improve discovery. Avoid random link injection that waters down cluster authority.
