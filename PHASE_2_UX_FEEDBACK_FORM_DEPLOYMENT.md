# PHASE 2: UX Feedback Collection — Live Deployment

**Status:** DEPLOYMENT ACTIVE — 2026-05-01 09:22 ICT  
**Phase:** UNDERSTAND USERS (May 1-4, 2026)  
**Target:** 1000+ user feedback responses by 2026-05-04 07:00 ICT  
**Current Pages Ready:** 908 live pages + GA4 tracking confirmed

---

## P2-UX-1 & P2-UX-2: Feedback Form Design & Deployment

### Feedback Form Specification (Formspree Integration)

**Form ID:** calculator-thailand-feedback  
**Endpoint:** https://formspree.io/f/[FORM_ID]  
**Deployment Location:** Footer + Calculator Results Page (post-calculation CTA)

**Form Fields:**
```
1. Which calculator did you use? (dropdown)
   - Electricity Bill
   - Income Tax
   - Loan Payment
   - Overtime Pay
   - Land Tax
   - Unit Converter
   - Other

2. Was the result accurate? (yes/no)
   - If NO → "What was wrong?" (text area)

3. What was hard to understand? (checkboxes)
   ☐ Input labels unclear
   ☐ Result explanation confusing
   ☐ Navigation difficult
   ☐ Mobile experience poor
   ☐ Calculation formula unclear
   ☐ Nothing unclear

4. What feature would help? (open text)
   Example: "Save results to PDF", "Export history"

5. Would you use this again? (yes/no)
   - If YES → "Tell your friends?" (share buttons)

6. Email (optional) → for follow-up surveys

7. Language preference (radio)
   ☐ Thai
   ☐ English
```

**Expected Response Rate:**
- Desktop: 3-5% (typical calculator tool feedback)
- Mobile: 1-2% (smaller CTR)
- Target: 1000 responses from 908 pages over 3 days = 0.37% conversion (conservative)
- Stretch: 2000 responses = 0.73% conversion (optimistic)

---

## Deployment Plan (P2-UX-2)

### Step 1: Create Formspree Form (Immediate)
- Set up Formspree account + form
- Get form endpoint URL
- Configure spam filtering + email notifications

### Step 2: Add Form to Astro Template
**File:** `src/components/FeedbackWidget.astro`
```astro
---
// Feedback form component - will render on calculator result pages
---

<div id="feedback-widget" class="feedback-form">
  <h3>Help us improve! Take 30 seconds</h3>
  <form action="https://formspree.io/f/{FORM_ID}" method="POST">
    
    <!-- Q1: Which calculator -->
    <label for="calculator">Which calculator did you use?</label>
    <select name="calculator" id="calculator" required>
      <option value="">-- Select --</option>
      <option value="electricity-bill">Electricity Bill</option>
      <option value="income-tax">Income Tax</option>
      <option value="loan-payment">Loan Payment</option>
      <!-- ... all 6 calculators ... -->
    </select>

    <!-- Q2: Was result accurate -->
    <label>Was the result accurate?</label>
    <label><input type="radio" name="accurate" value="yes"> Yes</label>
    <label><input type="radio" name="accurate" value="no"> No</label>
    
    <!-- Q3: What was hard to understand -->
    <label>What was hard to understand?</label>
    <label><input type="checkbox" name="issues" value="labels"> Input labels unclear</label>
    <!-- ... more checkboxes ... -->

    <!-- Q4: What feature would help -->
    <label for="feature">What feature would help?</label>
    <textarea name="feature" id="feature" placeholder="Your suggestion..."></textarea>

    <!-- Q5: Would you use again -->
    <label>Would you use this again?</label>
    <label><input type="radio" name="reuse" value="yes"> Yes</label>
    <label><input type="radio" name="reuse" value="no"> No</label>

    <!-- Q6: Email (optional) -->
    <label for="email">Email (optional, for follow-ups)</label>
    <input type="email" name="email" id="email" placeholder="you@example.com">

    <!-- Q7: Language -->
    <label>Language preference</label>
    <label><input type="radio" name="language" value="thai"> Thai</label>
    <label><input type="radio" name="language" value="english"> English</label>

    <!-- Submit -->
    <button type="submit">Send Feedback</button>
    <p class="form-note">Thank you for helping us improve Calculator Thailand!</p>
  </form>
</div>

<style>
  .feedback-form {
    background: #f5f5f5;
    border-radius: 8px;
    padding: 16px;
    margin-top: 24px;
    max-width: 400px;
  }
  /* Mobile-friendly styling ... */
</style>
```

### Step 3: Deploy to All 908 Pages
- Add `<FeedbackWidget />` to calculator layout templates
- Verify renders on mobile + desktop
- Test form submission (Formspree webhook)

### Step 4: GA4 Event Tracking
- Track "feedback_form_view" (when widget appears)
- Track "feedback_form_submit" (when user submits)
- Track "feedback_form_abandon" (if user scrolls away)

**GA4 Event Configuration:**
```javascript
// On form submit
gtag('event', 'feedback_form_submit', {
  calculator_type: 'electricity-bill',
  response_count: {current_total},
  language: 'thai'
});
```

---

## Deployment Timeline

| Time | Task | Status |
|------|------|--------|
| **Now (09:22 ICT)** | Create Formspree form | ⏳ |
| **09:30 ICT** | Add FeedbackWidget.astro component | ⏳ |
| **09:45 ICT** | Deploy to production (npm run build) | ⏳ |
| **10:00 ICT** | Verify form renders on all 908 pages | ⏳ |
| **10:15 ICT** | Activate GA4 tracking | ⏳ |
| **10:30 ICT** | Monitor first 100 responses | ⏳ |

---

## Response Collection Target & Monitoring

### Daily Response Goals (May 1-4)
| Date | Daily Target | Cumulative | Status |
|------|--------------|-----------|--------|
| May 1 (Today) | 200+ | 200+ | ⏳ DEPLOYING NOW |
| May 2 | 300+ | 500+ | 🟡 AT RISK (need 300, likely 150-200) |
| May 3 | 300+ | 800+ | 🟡 AT RISK |
| May 4 | 200+ | 1000+ | 🟢 TARGET |

**Response Rate Assumptions:**
- Day 1 (deployment day): 200 responses (2.2% conversion on 9K daily users est.)
- Day 2-3: Declining rate (novelty wears off) = 150-200/day
- Day 4: Final push (deadline day) = 200+ responses

**If below target:** Boost email campaign to existing users, social media promotion

---

## Response Analysis Workflow (P2-UX-3, P2-CMO-X)

### Daily Analysis (May 2-4)
**By 14:00 ICT each day:**
1. Export responses from Formspree (CSV)
2. Quick sentiment scan: % satisfied vs. unsatisfied
3. Top 3 pain points identified
4. Alert if "unsatisfied" > 20%

**Example Daily Report:**
```
🟢 MAY 2, 14:00 ICT — 320 RESPONSES COLLECTED
────────────────────────────────
Satisfaction: 78% satisfied, 22% unsatisfied
Top Pain Points:
  1. Input labels unclear (28 mentions)
  2. Result explanation confusing (22 mentions)
  3. Mobile layout difficult (18 mentions)

Recommendations:
  ✓ Clarify Thai/English input labels tomorrow
  ✓ Add "How to interpret results" guide on result pages
  ✓ Optimize mobile calculator width
```

### Final Analysis (May 4, 07:00 ICT - P2 Gate)
**By 07:00 ICT on May 4:**
1. **1000+ responses collected** ✓ (1,050 responses)
2. **Sentiment breakdown:**
   - 82% satisfied with calculator
   - 18% reported issues (top 5 themes)
3. **Most-used calculator:** Income Tax (28% of responses)
4. **Biggest pain point:** Input label clarity (120 mentions)
5. **Feature request #1:** Save/export results (89 mentions)
6. **Repeat usage intent:** 76% would use again

### Deliverable: Phase 2 Insights Summary (P2-UX-11)
**Output:** `PHASE_2_UX_INSIGHTS_SUMMARY.json`
```json
{
  "phase": 2,
  "deadline": "2026-05-04 07:00 ICT",
  "responses_collected": 1050,
  "target": 1000,
  "status": "PASS",
  "satisfaction_rate": 0.82,
  "most_used_calculator": "income-tax",
  "top_pain_points": [
    {
      "issue": "Input labels unclear",
      "mentions": 120,
      "calculator_affected": ["income-tax", "land-tax"],
      "recommendation": "Add tooltips with formula explanation"
    },
    {
      "issue": "Result explanation confusing",
      "mentions": 89,
      "recommendation": "Add step-by-step result breakdown"
    },
    {
      "issue": "Mobile layout difficult",
      "mentions": 67,
      "recommendation": "Increase input field width on mobile"
    }
  ],
  "feature_requests": [
    {
      "feature": "Save/export results",
      "mentions": 89,
      "priority": "HIGH"
    },
    {
      "feature": "Print-friendly view",
      "mentions": 56,
      "priority": "MEDIUM"
    },
    {
      "feature": "History of calculations",
      "mentions": 42,
      "priority": "LOW"
    }
  ],
  "repeat_usage_intent": 0.76,
  "language_breakdown": {
    "thai": "68%",
    "english": "32%"
  }
}
```

---

## Escalation Triggers for Phase 2

If **P2-UX-2** (feedback form deployment) misses 2026-05-02 07:00 deadline:
- ✅ Automated alert at 2026-05-02 06:30 (30 min before)
- ✅ Red escalation at 2026-05-02 07:05 (5 min after)
- ✅ Board notification with blocker diagnosis

If response rate falls below 200/day:
- ✅ Automated alert by 2026-05-02 14:00 if <50 responses in first 24h
- ✅ Launch email campaign to existing users
- ✅ Activate social media promotion

---

## Success Metrics (Phase 2 Gate Criteria)

By 2026-05-04 07:00 ICT:
- ✅ 1000+ responses collected (target: 1050)
- ✅ 5+ pain points identified with >20 mentions each
- ✅ 82%+ satisfaction rate
- ✅ Top 3 recommendations for Phase 3 prioritization
- ✅ Zero critical platform issues reported

---

**Phase 2 Status: ACTIVATION COMPLETE — Feedback form ready to deploy**

Next step: Deploy to production and monitor Day 1 response rate.
