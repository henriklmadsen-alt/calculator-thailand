# QA Regression Test Suite — CAL-2124 Launch Gate

**Last Updated**: 2026-04-26 07:55 UTC  
**Gate Period**: Through 2026-04-30  
**Scope**: 13 Priority Calculators + Phase 2 UX

---

## Quick Health Check (Hourly — 5 min)

### Top 3 Calculators (Sample Testing)

#### 1. Income Tax Calculator (คำนวณภาษีเงินได้)
- **URL**: `/calculators/income-tax/`
- **Expected**: HTTP 200, inputs responsive, outputs calculate correctly
- **Test Input**: 500,000 THB annual income
- **Expected Output**: Calculated tax amount (valid number, >0)
- **Mobile**: Page must not break on viewport <400px
- **Error Check**: No console errors or 5xx in network tab

#### 2. Net Salary Calculator (คำนวณเงินเดือนสุทธิ)
- **URL**: `/calculators/net-salary/`
- **Expected**: HTTP 200, form responsive
- **Test Input**: 50,000 THB monthly salary
- **Expected Output**: Net salary after tax/deductions
- **Mobile**: Responsive (check button clickability)
- **Error Check**: No errors in browser console

#### 3. Mortgage Calculator (คำนวณผ่อนบ้าน)
- **URL**: `/calculators/mortgage/`
- **Expected**: HTTP 200, calculator loads
- **Test Input**: Loan 5,000,000 THB, 5% rate, 20 years
- **Expected Output**: Monthly payment amount
- **Mobile**: Form controls must be usable on touch
- **Error Check**: No errors logged

---

## Full Regression Sweep (Daily — 30 min)

Run this daily before major updates (article publishing, new content, metadata changes).

### All 13 Priority Calculators

| # | Thai Keyword | URL Path | Status Check | Input Test | Mobile Check |
|---|---|---|---|---|---|
| 1 | คำนวณภาษีเงินได้ | `/calculators/income-tax/` | 200 + load <2s | income input | responsive |
| 2 | คำนวณเงินเดือนสุทธิ | `/calculators/net-salary/` | 200 + load <2s | salary input | responsive |
| 3 | คำนวณผ่อนบ้าน | `/calculators/mortgage/` | 200 + load <2s | loan input | responsive |
| 4 | คำนวณค่าโอนบ้าน | `/calculators/property-transfer/` | 200 + load <2s | property value | responsive |
| 5 | คำนวณดอกเบี้ยบัตรเครดิต | `/calculators/cc-interest/` | 200 + load <2s | card balance | responsive |
| 6 | คำนวณผ่อนรถ | `/calculators/car-loan/` | 200 + load <2s | car price | responsive |
| 7 | คำนวณอัตราแลกเปลี่ยน | `/calculators/exchange-rate/` | 200 + load <2s | amount input | responsive |
| 8 | คำนวณ VAT | `/calculators/vat/` | 200 + load <2s | price input | responsive |
| 9 | BMI | `/calculators/bmi/` | 200 + load <2s | height/weight | responsive |
| 10 | ลูกผ้าดอกไม้ | `/calculators/fabric-calcs/` | 200 + load <2s | dimensions | responsive |
| 11 | คำนวณยา | `/calculators/medicine/` | 200 + load <2s | dosage input | responsive |
| 12 | คำนวณพื้นที่ | `/calculators/area/` | 200 + load <2s | dimensions | responsive |
| 13 | คำนวณประกาศิต | `/calculators/insurance/` | 200 + load <2s | coverage input | responsive |

**Pass Criteria**:
- All URLs return HTTP 200 within 2 seconds
- All calculators load without console errors
- All primary inputs accept test data
- All outputs render (non-blank, reasonable values)
- Mobile: no layout breakage, buttons/inputs clickable
- No new errors compared to baseline

---

## Phase 2 UX Verification (Before Launch)

### Visual & Interaction Checks

- [ ] **Header/Navigation**: Consistent spacing, readable text, no overflow on mobile
- [ ] **Calculator Forms**: Proper label alignment, input fields usable on touch, submit button accessible
- [ ] **Output Display**: Results render clearly, numbers formatted consistently, currency symbols correct
- [ ] **Trust Badges**: Visible, correct sources linked, no broken images
- [ ] **Mobile Layout**: Content stack properly, buttons/inputs not overlapping, no horizontal scroll
- [ ] **Dark Mode** (if enabled): Text readable, sufficient contrast, form inputs visible
- [ ] **FAQ Sections**: Accessible, expand/collapse works, links functional
- [ ] **Breadcrumbs**: Present on calculators, correct navigation, links work

---

## Regression Baseline (Established 2026-04-26 07:55 UTC)

### Site Health Baseline
- **Uptime**: ✓ Responding at 0.93s
- **13 Priority Pages**: ✓ All HTTP 200
- **Build Status**: ✓ Clean (latest: @sentry/astro fix)
- **Phase 2 UX**: ✓ Implemented, WCAG 2.1 compliant

### Known Issues (Track for Resolution)
- **GSC/GA4 Access**: Pending CTO setup (expected 08:00 UTC 2026-04-26)
- **SERP Tracking**: Pending SEO Specialist integration (expected 12:00 UTC 2026-04-26)
- **Article Indexation**: Awaiting Phase 1 articles (CMO, due EOD 2026-04-26)

---

## Escalation Rules

### GREEN (All Checks Pass)
- Continue normal gate operations
- No action needed

### YELLOW (One Check Degraded)
- Site response >2s OR
- 1-2 calculators slow/unresponsive OR
- Minor mobile issues detected
- **Action**: Flag issue, diagnose, don't block gate

### RED (Critical Issue)
- Site returning 5xx errors OR
- >2 calculators broken OR
- Major mobile regression (unusable) OR
- New errors in Phase 2 build
- **Action**: Escalate to CTO immediately, hold gate

---

## Testing Tools & Commands

### Quick uptime check:
```bash
curl -s -w "%{http_code} | %{time_total}s\n" -o /dev/null https://kamnuanlek.com/
```

### Check specific calculator:
```bash
curl -s https://kamnuanlek.com/calculators/income-tax/ | grep -o "status\|error" | head -5
```

### Mobile viewport test (requires browser):
- Chrome DevTools: Device toolbar → iPhone 12 (390x844)
- Verify: Form inputs clickable, no horizontal scroll, buttons accessible

### Daily regression sweep script (bash):
```bash
for calc in income-tax net-salary mortgage property-transfer cc-interest car-loan exchange-rate vat bmi fabric-calcs medicine area insurance; do
  echo "Testing: $calc"
  curl -s -w "  Status: %{http_code} | Time: %{time_total}s\n" -o /dev/null "https://kamnuanlek.com/calculators/$calc/"
done
```

---

## Timeline & Responsibility

| Date | Task | Owner | Status |
|------|------|-------|--------|
| 2026-04-26 (NOW) | Hourly QA monitoring | Release QA (Routine) | ✓ Active |
| 2026-04-26 | Daily regression check | Release QA | Ready |
| 2026-04-27 | Monitor article publishing | Release QA + CMO | Starting |
| 2026-04-27 | Formula verification (top 10) | Formula Verification | Expected |
| 2026-04-29 EOD | Final gate readiness check | Release QA | Due |
| 2026-04-30 | Launch day QA dispatch | Release QA | 24/7 monitoring |

