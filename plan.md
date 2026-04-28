# English Translation Implementation Plan
**Project**: Calculator Thailand English Expansion  
**Timeline**: May 5–19, 2026 (2 weeks post-launch)  
**Launch gate**: 2026-04-29 08:00 UTC, Launch: 2026-04-30 00:00 UTC  
**Scope**: 6 core calculators + language toggle UI (articles follow in Phase 3)

---

## 1. WEEK 1 (May 5–11): Foundation & Core Calculators

### Phase 1.1: i18n Framework Selection & Setup (May 5–6, 2 days)
**Owner**: CTO/Tech Lead  
**Tasks**:
- Evaluate i18n frameworks: next-intl (Astro), @react-intl, or astro-i18n
- Compare effort: extraction, maintenance, SEO (hreflang, lang attributes)
- Decision memo with recommendation
- Set up project structure (namespaces, locale directories: en/, th/)

**Success Criteria**:
- Framework selected and POC running locally
- CI/CD updated to support bilingual builds
- Thai strings export tool ready

---

### Phase 1.2: String Extraction from 3 Core Calculators (May 5–8, 4 days)
**Owner**: CTO/Tech Lead (programming)  
**Co-owner**: CMO (content audit)  
**Tasks**:
- Audit 3 core calculators for all user-facing strings:
  - Income Tax Calculator
  - MDR (Medical Expense Relief) Calculator
  - Social Security Contribution Calculator
- Extract strings from: UI labels, error messages, result descriptions, meta tags
- Create Thai → English string mapping spreadsheet
- CMO audits strings for accuracy & branding consistency

**Success Criteria**:
- 3 calculators have 100% string extraction
- All strings in i18n config (en.json, th.json)
- Spreadsheet signed off by CMO

---

### Phase 1.3: English Translation (May 8–10, 3 days)
**Owner**: CMO (project lead) + Translator  
**Tasks**:
- Contract translator (fluent Thai→English, financial/legal domain)
- Translate strings (~300 total): Income Tax (~120), MDR (~80), Social Security (~100)
- Quality review: Translator + CMO cross-check for accuracy, tone, terminology
- Final sign-off on English terminology glossary

**Success Criteria**:
- All 300+ strings translated and reviewed
- Glossary document created
- CMO sign-off on quality

---

### Phase 1.4: Language Toggle UI & Deployment (May 9–11, 3 days)
**Owner**: CTO/Tech Lead (programming)  
**Co-owner**: UX Designer (UI design)  
**Tasks**:
- Design language toggle (dropdown or flag icons, mobile-friendly, accessible)
- Program toggle: client-side switching, URL structure, hreflang links, lang attributes
- Update sitemap for both language versions
- Deploy 3 calculators + toggle to staging environment
- Internal QA: All 3 calculators in both Thai and English

**Success Criteria**:
- Language toggle appears and works on all 3 calculator pages
- hreflang links correct in page source
- Mobile responsive (tested on 3 devices)
- Staging environment live

---

### Phase 1.5: Staging QA & Sign-off (May 10–11, 2 days)
**Owner**: QA Lead  
**Co-owners**: CTO, CMO, UX Designer  
**Test coverage**:
- All 3 calculators: Thai input → Thai output, English input → English output
- Language toggle: Switch languages, verify state preservation
- Mobile: iPhone 12, Android Galaxy (landscape/portrait)
- Accessibility: Screen reader, keyboard navigation
- SEO: hreflang validation, lang attributes, schema.org @context
- Browser compatibility: Chrome, Firefox, Safari (latest 2 versions)
- Performance: No Core Web Vitals regression

**Success Criteria**:
- All Severity 1 bugs fixed
- QA sign-off: "PASS"
- Staging link ready for board review

---

## 2. WEEK 2 (May 12–19): Remaining Calculators & Production Launch

### Phase 2.1: String Extraction & Translation for 3 Remaining Calculators (May 12–15, 4 days)
**Owner**: CTO/Tech Lead + Translator + CMO  
**Tasks**:
- Extract strings from: Property Tax, Land & Building Tax, Inheritance Tax (~280 strings)
- Translate using glossary from Phase 1.3 (consistency)
- CMO review for terminology alignment

**Success Criteria**:
- All 6 calculators have complete English translations
- Terminology consistent across all calculators
- CMO sign-off

---

### Phase 2.2: Production Deployment & SEO Setup (May 15–18, 4 days)
**Owner**: CTO/Tech Lead  
**Co-owners**: CMO, UX Designer  
**Tasks**:
- Deploy all 6 calculators (Thai + English) to production
- SEO checklist: hreflang, canonical tags, Open Graph, Twitter Card, sitemaps, schema.org
- Google Search Console: Submit both language sitemaps
- Google Analytics: Segment traffic by language

**Success Criteria**:
- All 6 calculators live in English and Thai
- hreflang validation passes
- Google Analytics showing traffic by language

---

### Phase 2.3: Production QA & Monitoring (May 18–19, 2 days)
**Owner**: QA Lead  
**Co-owners**: CTO, CMO  
**Tasks**:
- Smoke tests: All 6 calculators in both languages, toggle switching, results accuracy
- Real-world testing: Access from US, Singapore, Thailand IPs
- Error monitoring setup (Sentry/similar)
- Support process ready for translation feedback

**Success Criteria**:
- QA sign-off: "PASS"
- Zero Severity 1 bugs in production
- Error monitoring active
- Support process ready

---

## 3. TEAM ROLES & RESPONSIBILITIES

| Role | Accountability | Key Tasks | Success Metric |
|------|----------------|-----------|-----------------|
| **CEO (You)** | Overall project success, board communication | Daily standup, timeline decisions, gate approvals | On-time delivery, launch success |
| **CTO / Tech Lead** | Engineering delivery (i18n, deployment, SEO) | Framework selection, string extraction, toggle programming, production deployment | Zero deployment errors, on-time |
| **CMO / Content Lead** | Translation quality, terminology consistency, SEO metadata | Content audit, translation management, glossary, bilingual SEO tags | Glossary complete, quality sign-off |
| **Translator (Contract)** | Thai → English translation accuracy | Translate 500+ strings (financial domain), rate ~$50–80/hr (~$2,000–3,200) | 100% translated, zero rework |
| **UX Designer** | Language toggle UI, accessibility, mobile UX | Toggle design, responsive testing | Accessible, responsive on all devices |
| **QA Lead** | Testing coverage, production readiness | Staging QA (test matrix), production QA, monitoring | QA sign-off, zero Severity 1 bugs |

---

## 4. TIMELINE & MILESTONES

| Date | Milestone | Owner |
|------|-----------|-------|
| May 1 | Launch stabilization, team planning kickoff | CEO |
| May 5 | i18n framework selected, local POC running | CTO |
| May 6 | String extraction begins (3 core calculators) | CTO |
| May 8 | Translation begins | Translator |
| May 9 | Language toggle UI design ready | UX |
| May 10 | English translation of 3 core complete & reviewed | CMO |
| May 11 | **Week 1 Gate**: Staging QA sign-off (3 core live in staging) | QA |
| May 12 | String extraction begins (3 remaining calculators) | CTO |
| May 14 | Translation of 3 remaining calculators begins | Translator |
| May 15 | All 6 calculators translated & reviewed | CMO |
| May 18 | All 6 calculators live in production (Thai + English) | CTO |
| May 19 | **Week 2 Gate**: Production QA sign-off + monitoring active | QA |

---

## 5. RESOURCE SUMMARY

| Resource | Allocation | Cost |
|----------|-----------|------|
| CTO / Tech Lead | 30% (week 1), 25% (week 2) | Salary |
| CMO | 40% (week 1), 30% (week 2) | Salary |
| Translator (Contract) | 40 hours over 2 weeks | ~$2,000–3,200 |
| UX Designer | 15% (week 1), 10% (week 2) | Salary |
| QA Lead | 25% (week 1), 35% (week 2) | Salary |
| **Total new spend** | — | **~$2,500–3,500** |

---

## 6. SUCCESS CRITERIA & GATE CHECKS

### **Week 1 Gate (May 11)**
- 3 core calculators live in staging (Thai + English)
- QA sign-off: PASS
- Language toggle functional, no Severity 1 bugs
- **Approval**: CEO (board notification)

### **Week 2 Gate (May 19)**
- All 6 calculators live in production (Thai + English)
- Production QA sign-off: PASS
- SEO setup verified, error monitoring active
- **Approval**: CEO (board notification + US/Singapore traffic report)

---

## 7. RISK MITIGATION

| Risk | Probability | Mitigation |
|------|-------------|-----------|
| Translator unavailable | Medium | Identify backup by May 1; glossary ready for handoff |
| i18n performance regression | Low | Benchmark bundle size in Phase 1.1; optimize if >10% |
| SEO hreflang errors | Medium | Validate with Google Search Console before prod |
| Mobile UI breaking | Medium | Test on real devices, not just emulator |
| String extraction misses | Low | Audit against live calculators; screenshot comparison |

---

## 8. DECISION GATES

1. **May 5**: CEO approves i18n framework
2. **May 11**: CEO approves staging promotion; board notified
3. **May 18**: CEO approves production deployment
4. **May 19**: QA sign-off; board notified of impact (US/Singapore traffic)

**Rule**: If Severity 1 bugs exist at any gate, extend by 1–2 days; do not ship with critical issues.

---

## 9. PHASE 3 PREP (Article Translation)

After May 19 sign-off:
- Identify top 10–15 articles by traffic (CMO)
- Estimate scope (CMO)
- Plan Phase 3 sprint (CEO, CTO, CMO)
- Target start: Early June 2026
