# WAVE4 BATCH AF & AG Calculator Specifications

## Overview
- **BATCH AF**: Elderly Care & Retirement Planning (KLC-0676-0700) — 25 calculators
- **BATCH AG**: Charity & Donations Tax (KLC-0701-0725) — 25 calculators
- **Status**: Specification Draft for Engineering Implementation
- **Category Type**: Financial Planning & Tax Relief

---

## BATCH AF: Elderly Care & Retirement Planning (KLC-0676-0700)

### Documented Calculators (KLC-0676-0683) — 8 complete

These 8 are already specified in CAL-726. Engineering can build these immediately.

### Specification Gap (KLC-0684-0700) — 17 missing

#### Social Security & Pensions (5 calculators)

**KLC-0684**: Thai Social Security Retirement Benefit Calculator
- Inputs: contribution years, current age, gender
- Output: estimated monthly pension, total lifetime benefits
- Thai Formula: Monthly = (Contribution Years × 5,000 THB) + (Age over 60 × 500 THB)

**KLC-0685**: Government Pension Estimate
- Inputs: years of service, final salary
- Output: monthly pension amount, lump-sum option
- Thai Reference: บำนาญปกติบุคลากรภาครัฐ per Pension Rules

**KLC-0686**: Provident Fund Withdrawal Calculator
- Inputs: fund balance, withdrawal type, age
- Output: available withdrawal amount, tax implications

**KLC-0687**: Deferred Income Pension Calculator
- Inputs: annuity purchase amount, life expectancy
- Output: monthly income, total payout period

**KLC-0688**: Foreign Pension Conversion
- Inputs: foreign pension amount, exchange rate, Thai tax
- Output: THB equivalent, after-tax amount

#### Healthcare & Insurance (5 calculators)

**KLC-0689**: Elderly Health Insurance Cost Estimator
- Inputs: age, health status, coverage level
- Output: annual premium, co-pay estimates

**KLC-0690**: Long-Term Care Facility Cost
- Inputs: facility type (government/private), years, room type
- Output: total cost, monthly cost

**KLC-0691**: Critical Illness Insurance Adequacy
- Inputs: current age, income, dependents
- Output: recommended coverage amount

**KLC-0692**: Dementia Care Cost Projection
- Inputs: age, family risk, care type
- Output: 5/10/15-year cost projection

**KLC-0693**: Nursing Home vs. In-Home Care Comparison
- Inputs: location, staffing needs, family support
- Output: cost comparison, monthly/total

#### Retirement Living & Lifestyle (4 calculators)

**KLC-0694**: Retirement Living Expense Calculator
- Inputs: province, lifestyle tier, healthcare needs
- Output: recommended monthly budget

**KLC-0695**: Condominium Maintenance & Fees
- Inputs: unit size, common areas, building age
- Output: monthly maintenance fee

**KLC-0696**: Utility Cost Projection (Age 60+)
- Inputs: province, AC usage, water usage
- Output: monthly utilities estimate

**KLC-0697**: Travel & Recreation Budget for Retirees
- Inputs: travel type (domestic/international), frequency
- Output: annual budget recommendation

#### Estate Planning & Inheritance (3 calculators)

**KLC-0698**: Inheritance Tax Calculator
- Inputs: estate value, heir relationship, deductions
- Output: estimated tax, tax-efficient strategies

**KLC-0699**: Will & Trust Administration Cost
- Inputs: estate complexity, executor type, property count
- Output: estimated legal and administrative costs

**KLC-0700**: Life Insurance Benefit Adequacy
- Inputs: current coverage, family needs, debt
- Output: recommended additional coverage, annual cost

---

## BATCH AG: Charity & Donations Tax Benefits (KLC-0701-0725)

### Full Specification — All 25 calculators (KLC-0701-0725)

#### Individual Charitable Giving (8 calculators)

**KLC-0701**: Charitable Donation Tax Deduction Calculator
- Inputs: donation amount, tax bracket, type (cash/property)
- Output: tax savings, after-tax cost
- Thai Law: Section 47, Revenue Code — limit 10% of income

**KLC-0702**: Non-Profit Contribution Impact
- Inputs: annual donation, years, organization type
- Output: cumulative impact, tax benefit history

**KLC-0703**: Religious Donation Tax Exemption
- Inputs: merit-making donation amount, temple
- Output: tax-exempted amount, receipt handling

**KLC-0704**: Educational Scholarship Donation
- Inputs: scholarship amount, recipient count
- Output: tax deduction, impact

**KLC-0705**: Emergency Disaster Relief Donation
- Inputs: donation amount, charity approval date
- Output: tax deduction eligibility, documentation

**KLC-0706**: Medical Research & Hospital Donation
- Inputs: donation to public hospital/foundation
- Output: tax benefit, organization verification

**KLC-0707**: Environmental Conservation Donation
- Inputs: forest/wildlife conservation donation
- Output: tax deduction, conservation impact

**KLC-0708**: Arts & Cultural Preservation Donation
- Inputs: museum/cultural center donation
- Output: tax benefit, cultural metrics

#### Corporate & Business Giving (6 calculators)

**KLC-0709**: Corporate Charitable Contribution Deduction
- Inputs: corporate profit, donation amount, type
- Output: taxable income reduction, net cost

**KLC-0710**: Employee Volunteer Time Valuation
- Inputs: employee hours, hourly rate, organization
- Output: corporate tax benefit, IRS valuation

**KLC-0711**: Cause Marketing Campaign ROI
- Inputs: campaign cost, sales impact, donation
- Output: net cost after tax deduction, brand value

**KLC-0712**: Inventory Donation (Excess Stock) Tax Benefit
- Inputs: inventory cost, FMV, recipient type
- Output: tax deduction, CGS benefit

**KLC-0713**: Real Estate Donation (Corporate)
- Inputs: property value, mortgage, donation details
- Output: tax benefit calculation, gains impact

**KLC-0714**: Matching Gift Program Budget
- Inputs: employee donations, corporate match %, cap
- Output: corporate expense, employee benefit, impact

#### Non-Profit Organization Impact (6 calculators)

**KLC-0715**: Grant Funding vs. Fundraising Efficiency
- Inputs: grant amount, fundraising cost, overhead
- Output: net program funds, ROI

**KLC-0716**: Donor Lifetime Value & Retention
- Inputs: first gift, average annual gift, retention %
- Output: lifetime value, acquisition cost

**KLC-0717**: Charitable Auction & Event Revenue
- Inputs: auction items, attendees, ticket price
- Output: gross revenue, profit, deductible portion

**KLC-0718**: Non-Profit Grant Management Tracker
- Inputs: grant amount, fund allocation
- Output: remaining balance, spending rate

**KLC-0719**: Donor Recognition & Sponsorship Levels
- Inputs: fundraising goal, sponsorship tiers
- Output: tier targets, recognition strategy

**KLC-0720**: Endowment Fund Sustainability
- Inputs: principal, annual spending %, inflation
- Output: sustainable distribution, growth

#### Tax Planning for Wealthy Donors (5 calculators)

**KLC-0721**: Charitable Remainder Trust (CRT) Tax Benefit
- Inputs: asset value, income stream %, life expectancy
- Output: charitable deduction, income, tax efficiency

**KLC-0722**: Donor-Advised Fund (DAF) Strategy
- Inputs: lump-sum contribution, grant schedule
- Output: immediate tax deduction, flexibility

**KLC-0723**: Appreciated Asset vs. Cash Donation
- Inputs: FMV, cost basis, capital gains rate
- Output: optimal strategy, tax savings

**KLC-0724**: Charitable Deduction Phase-Out
- Inputs: AGI, total donations, filing status
- Output: deductible amount, carryforward

**KLC-0725**: Legacy Giving & Estate Tax Reduction
- Inputs: estate value, charitable bequest, heirs
- Output: estate tax savings, heir impact

---

## Building Requirements (WAVE3/WAVE4 Standards)

1. Full Thai UI (title, description, labels, FAQs)
2. Working formula with Thai-specific values
3. Minimum 3 FAQ items per calculator
4. Trust panel with government/authority citations
5. JSON-LD schema (WebApplication + FAQPage)
6. Register in src/lib/calculators.ts
7. Build passes with no errors
8. Commit & push after each calculator

---

**CTO Specification**  
**Status**: Draft for Engineer Review  
**Date**: 2026-04-30