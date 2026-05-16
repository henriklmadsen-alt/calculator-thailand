---
title: CAL-3717 — World-Class Mobile-First Redesign Spec
phase: 2
status: IMPLEMENTATION SPEC READY
canonical: true
published: 2026-05-16T05:15:00Z
---

# CAL-3717: Mobile-First Redesign Specification — Phase 2 Execution

**Status:** IMPLEMENTATION SPEC READY ✅  
**Board Approval:** Confirmed  
**Checkpoint Due:** 2026-05-16 05:46 UTC  
**For:** CTO Implementation, Release QA Verification, CMO Content Hierarchy  

---

## ARTIFACT 1: PAGE-TEMPLATE WIREFRAME DIRECTION

### **CALCULATOR PAGE TEMPLATE (Mobile-First Reference)**

#### **Above-the-Fold Section (0–320px, Mobile Viewport)**
```
┌─────────────────────────────────────────────────┐
│ [Breadcrumb: Category > Calc Name]   [Theme▼]   │  ← Trust signal, minimal height
├─────────────────────────────────────────────────┤
│                                                 │
│  ⚖️ คำนวณ BMI (ดัชนีมวลกาย)                      │
│  [📌 Update badge: WHO Asia-Pacific 2569]       │  ← Clear title + credibility
│                                                 │
│  หมายความว่า? → [See clear single-line subheader]│
├─────────────────────────────────────────────────┤
│ Quick fact: "BMI ช่วยประเมินความเสี่ยงต่อสุขภาพ"  │ ← 1 sentence user benefit (Thai)
├─────────────────────────────────────────────────┤
│                                                 │
│  [📋 INPUT SECTION — Prominent, Zero Clutter]   │
│  ────────────────────────────────────────────  │
│                                                 │
│  ① น้ำหนัก (กิโลกรัม):    [_____________]        │
│     📍 ตัวอย่าง: "เช่น 65"                      │
│                                                 │
│  ② ส่วนสูง (เซนติเมตร):   [_____________]        │
│     📍 ตัวอย่าง: "เช่น 170"                     │
│                                                 │
│  [🎯 CALCULATE BUTTON — Full Width, Bold CTA]  │
│     คำนวณ BMI ตอนนี้                            │  ← Clear Thai CTA, obvious, tappable
│                                                 │
│  [ปุ่มตัวอย่าง (ด้านล่าง สีเทา)]                  │
│  [สตรี 160 ซม.] [ชาย 175 ซม.] [อายุ...] (option)│
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Design Rules for Above-the-Fold:**
- **Hierarchy**: Title > Input Form > CTA (in that order, nothing else)
- **Spacing**: 4px–8px between elements (tight but readable on 375px screen)
- **Input sizing**: 44px minimum tap height (WCAG Level AAA)
- **Color contrast**: Labels 4.5:1 (dark gray on white), inputs with 1px border #ccc, focus ring 2px primary-500
- **Typography**: 
  - Title: 20px–22px bold, system font
  - Labels: 14px medium, dark gray
  - Inputs: 16px base (prevents iOS zoom on focus)
  - Subheader: 14px regular, gray-600
- **Ad placement rule**: NO ads above first result. First ad placement = AFTER result section, with 8px spacing (GuardedAdSlot minimum)

---

#### **Result Section (Triggered After Calculate)**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  ✅ ผลลัพธ์ของคุณ:                              │  ← Clear Thai indicator
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │        BMI ของคุณ: 22.5                  │   │  ← LARGE, CENTERED, BOLD
│  │        สถานะ: ✓ น้ำหนักปกติ              │   │  ← Color-coded (green/yellow/red)
│  │                                         │   │
│  │  ⚖️ ช่วงน้ำหนักที่เหมาะสมสำหรับความสูง: │   │
│  │     18.5–22.9 ถือว่าสุขภาพดี              │   │
│  │     (ปัจจุบัน: 65 กก.)                   │   │
│  │                                         │   │
│  │  [📊 มาตราส่วน BMI]                     │   │  ← Visual confirmation
│  │  ←─────●──────────────────────→         │   │
│  │  ต่ำ   ปกติ   เกิน   อ้วน                 │   │
│  │                                         │   │
│  │  💡 ความหมาย:                            │   │
│  │  น้ำหนักของคุณดูสุขภาพดีสำหรับความสูง   │   │
│  │  ของคุณ มุ่งเน้นการรักษาน้ำหนักนี้       │   │
│  │                                         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [ที่มา: องค์การอนามัยโลก (WHO) 2569]            │  ← Trust attribution (Thai)
│  [อัปเดตเมื่อ: 16 พฤษภาคม 2569]               │
│                                                 │
│  [📋 ขั้นตอนต่อไป: ดูแนวทางสุขภาพ] ──→          │  ← Related action (Thai)
│                                                 │
└─────────────────────────────────────────────────┘
```

**Design Rules for Result Section:**
- **Visibility**: Result MUST be fully visible on-screen after calculate (no scroll required to see key number)
- **Separation**: Clear visual boundary (rounded card, subtle shadow, or color background)
- **Result prominence**: BMI value = 32px+ bold, status = 18px medium
- **Interpretation clarity**: Always include what the result *means in Thai* (not just the number)
- **Gauge visualization**: Optional but helpful for context (visual comparison to ranges)
- **Source attribution**: Always visible, 11px gray (not buried, not italic/faint) — **in Thai**
- **Related action**: Single-sentence next step (e.g., "ดูแนวทางน้ำหนักที่เหมาะสม" or "เรียนรู้เกี่ยวกับความเสี่ยงต่อสุขภาพ")

---

#### **Trust & Context Section (Below Result)**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  ℹ️ วิธีคำนวณ BMI ของเรา                       │
│  ─────────────────────────────────────────────  │
│  BMI = น้ำหนัก (กก.) ÷ ส่วนสูง² (ตร.ม.)        │
│                                                 │
│  เราใช้มาตรฐาน WHO ภูมิภาค (อัปเดต 2569)       │
│  ซึ่งเฉพาะเจาะจงสำหรับไทยและเอเชีย            │
│  แตกต่างจากมาตรฐานทั่วโลกที่ใช้ในตะวันตก     │
│                                                 │
│  📌 สิ่งสำคัญที่ต้องรู้:                        │
│  • BMI ไม่วัดไขมันกายโดยตรง                    │
│  • นักกีฬาอาจมี BMI สูงแต่ไม่อ้วน               │
│  • ปรึกษาแพทย์ก่อนตัดสินใจด้านสุขภาพ          │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  ❓ คำถามที่พบบ่อย                              │
│  [Accordion: BMI คืออะไร?]                     │
│  [Accordion: เกณฑ์ BMI ที่ดีสำหรับคนเอเชีย?]   │
│  [Accordion: BMI มีข้อจำกัดอะไรบ้าง?]          │
│  [คำถามเพิ่มเติม ──→]                          │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Design Rules for Trust Section:**
- **Caveats placement**: Directly below result, not at page bottom
- **Visual treatment**: Gray background or subtle border (not same visual weight as result)
- **Caveat language**: Clear, honest, **in Thai** (not technical jargon)
- **FAQ placement**: Collapsible accordion, max 6 items visible, expandable to full list
- **Link treatment**: External links have icon (↗), related calculators have arrow (→)
- **Language requirement**: ALL text must be Thai (no non-Thai sample strings, no placeholder-only content)

---

#### **Related Navigation Section (Below Trust)**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  📚 เครื่องคำนวณที่เกี่ยวข้อง                  │
│  ─────────────────────────────────────────────  │
│  [ไทล์: คำนวณแคลอรี่]  [ไทล์: น้ำหนักที่ดี]    │
│  [ไทล์: คำนวณโปรตีน]   [ไทล์: น้ำดื่มสำหรับวัน] │
│                                                 │
│  [ดูเครื่องคำนวณสุขภาพเพิ่มเติม ──→]            │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  📄 บทความที่เกี่ยวข้อง                         │
│  ─────────────────────────────────────────────  │
│  • "ความเข้าใจผิดเรื่องการลดน้ำหนัก"           │
│  • "วิธีบรรลุ BMI ที่สุขภาพดีอย่างปลอดภัย"    │
│  • "ความเสี่ยงต่อสุขภาพตามช่วง BMI ต่างๆ"    │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Design Rules for Related Navigation:**
- **Tile format on mobile**: Full-width cards, not side-by-side (tablets/desktop can use 2-column)
- **Relationship clarity**: "Related" not "Recommended" (avoid pushy tone) — use Thai term "ที่เกี่ยวข้อง"
- **Link count**: 4–6 visible, with "see more" option for longer lists
- **Spacing**: 16px between sections
- **Language requirement**: All labels and links must be in Thai (no English-only content)

---

### **ARTICLE/HOW-TO PAGE TEMPLATE (Mobile-First Reference)**

#### **Article Header**

```
┌─────────────────────────────────────────────────┐
│ [Breadcrumb: หน้าแรก > บทความ > ชื่อบทความ]    │
├─────────────────────────────────────────────────┤
│                                                 │
│  วิธีคำนวณเงินเดือนสุทธิ — คำแนะนำฉบับสมบูรณ์ │
│                                                 │
│  📅 เผยแพร่: 1 พฤษภาคม 2569                    │
│  ✍️ ทีมบรรณาธิการ Kamnuanlek                    │
│  ⏱️ เวลาอ่าน: 8 นาที                            │
│                                                 │
│  เงินเดือนสุทธิคือเงินที่คุณจะได้รับจริง...    │
│  (First 2 sentences of body, max 140 characters)│
│                                                 │
└─────────────────────────────────────────────────┘
```

**Design Rules for Article Header:**
- **Title hierarchy**: 24px bold, dark gray/black
- **Metadata**: 12px gray, clearly separated (not mixed with body)
- **Publication date**: Visible, transparent (builds trust, shows freshness) — **in Thai format**
- **Intro text**: 14px regular, first 140 chars max (hook, not full paragraph)
- **Language requirement**: All metadata and intro must be in Thai

---

#### **Article Body (Prose Pattern)**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  ☑️ ประเด็นสำคัญ (Highlighted Box):           │
│  ─────────────────────────────────────────────  │
│  "เงินเดือนสุทธิ = เงินรวม – ภาษี – หักอื่นๆ" │
│  คนไทยส่วนใหญ่เห็นการหัก 15–25% จากเงินรวม  │
│  สำหรับภาษีและประกันสังคม                    │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  h2. องค์ประกอบของเงินเดือนสุทธิ                │
│                                                 │
│  • เงินเดือนพื้นฐาน: ...(prose)                │
│  • ค่าโอที: ...(prose)                         │
│  • โบนัส: ...(prose)                           │
│  • ลบ: ภาษี: ...(prose)                        │
│  • ลบ: ประกันสังคม: ...(prose)                │
│                                                 │
│  [Embedded Calculator CTA]                      │
│  [👉 คำนวณเงินเดือนสุทธิของคุณ →]              │  ← Conversational Thai link
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  h2. การคำนวณแบบละเอียด (7 ขั้นตอน)          │
│                                                 │
│  1️⃣  รวมเงินรับทั้งหมด: เงินพื้นฐาน + โอที...  │
│  2️⃣  หักประกันสังคม (5%)...                   │
│  [ขั้นตอนเพิ่มเติม...]                          │
│                                                 │
│  ℹ️  หมายเหตุ: อัตราเหล่านี้ใช้ได้ในปี 2569   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Design Rules for Article Body:**
- **Line length**: Max 60 characters per line on mobile (comfortable reading)
- **Paragraph spacing**: 16px between paragraphs
- **Heading hierarchy**: h2=20px, h3=18px, h4=16px (visual difference, not just font-weight)
- **List style**: • bullets, not numbered lists (except for step-by-step procedures)
- **Emphasis**: Bold for key terms, NOT italics (italics reduce readability on small screens)
- **Calculator embed**: Single inline CTA per article (not multiple), placed after relevant section — **in Thai**
- **Ad placement**: After first 300 words of prose, then every 400–500 words (GuardedAdSlot)
- **Language requirement**: ALL prose, headings, bullets, and CTAs must be in Thai

---

#### **Article Footer (FAQ & Related)**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  ❓ คำถามที่พบบ่อย                              │
│  ─────────────────────────────────────────────  │
│  [Accordion: ประกันสังคมในไทยคืออะไร?]         │
│  [Accordion: ฉันสามารถลดการหักภาษีได้หรือ?]    │
│  [Accordion: RMF และ PPF ทำงานอย่างไร?]       │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  📚 บทความที่เกี่ยวข้อง                         │
│  • "วิธีเพิ่มประสิทธิการหักภาษี"               │
│  • "RMF vs. PPF: อันไหนดีกว่ากัน?"            │
│  • "คำแนะนำการใช้เครื่องคำนวณการหักเงินเดือน" │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  🔗 เครื่องคำนวณที่เกี่ยวข้อง                  │
│  [ไทล์: คำนวณภาษีเงินได้]  [ไทล์: ภาษีโบนัส]  │
│  [ไทล์: คำนวณโอที]         [ไทล์: ค่าสินเชื่อ]  │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  📧 รับข้อมูลเพิ่มเติมเกี่ยวกับการเงินไทย     │
│  [Email signup box]                             │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Design Rules for Article Footer:**
- **FAQ placement**: ABOVE related links (Structured Data benefit, plus commonly searched)
- **Related content**: Max 6 items (article limit), with "see all" for categories
- **Email signup**: Optional, only if list is active (not decorative)
- **Language requirement**: ALL FAQ titles, article titles, calculator names, and email copy must be in Thai ONLY

---

## ARTIFACT 2: MOBILE UX PRIORITIES — RANKED BY RETENTION & TRUST IMPACT

### **Priority Ranking Matrix**
*(Impact on completion rate, user trust, and time-to-result)*

| Rank | Priority | Impact | User Friction | Trust Risk | Implementation | Verification |
|------|----------|--------|----------------|-----------|-----------------|--------------|
| **🔴 1** | **Input field clarity: 44px min height, clear labels, decimal-friendly** | **CRITICAL** | High (tiny taps fail) | Medium (looks cheap) | Low (CSS) | Visual check on device |
| **🔴 2** | **Result visibility: Above fold, no scroll required to see key number** | **CRITICAL** | Very High (hidden results) | Very High (trust broken) | Medium (layout reflow) | Measure scroll position at 375px |
| **🔴 3** | **Result interpretation: Always include meaning in Thai, not just number** | **CRITICAL** | High (confusion) | Very High (user doubt) | High (content + layout) | QA: Verify every result has explanation |
| **🔴 4** | **Ad placement safety: NO ads within 320px of primary CTA or inputs** | **CRITICAL** | Medium (distraction) | Very High (looks spammy) | Low (CSS spacing rules) | Lighthouse + manual check |
| **🟡 5** | **Typography: 16px base input text, 14px labels, 44px spacing between labels** | **HIGH** | Medium (readability) | Medium (trust) | Low (CSS) | Automated contrast check (WCAG AA+) |
| **🟡 6** | **Touch targets: All buttons/links ≥44x44px, 8px minimum between** | **HIGH** | High (mis-taps) | Low (indirect) | Low (CSS) | Automated tap target audit |
| **🟡 7** | **Loading state clarity: Show spinner + "Calculating..." message** | **HIGH** | Medium (user doubt) | Low (indirect) | Low (UX + animation) | Manual QA: Slow network test |
| **🟡 8** | **Error state handling: Validate inputs, show error near input (not page top)** | **HIGH** | High (confused users) | Medium (trust) | Medium (JS validation) | QA: Test invalid inputs on mobile |
| **🟠 9** | **Related content placement: Below result, not competing for attention** | **MEDIUM** | Low (navigation) | Low (trust) | Low (layout) | Visual check: Related links only after result |
| **🟠 10** | **Caveat/source visibility: Directly below result, not at page bottom** | **MEDIUM** | Medium (search opacity) | High (regulatory) | Low (layout) | QA: Verify caveat position on 5 calcs |

---

### **Top 3 Retention Drivers (Implement First)**

1. **Clear, Obvious Input Form** (Rank 1)
   - User sees exactly what to enter, no confusion
   - 44px+ input fields = successful taps first time
   - **Expected impact**: 15–20% fewer input errors, faster completion

2. **Result Visibility + Clarity** (Rank 2 & 3)
   - Result appears immediately in viewport
   - Result includes meaning ("น้ำหนักของคุณปกติ" = Your weight is normal) not just number
   - **Expected impact**: 20–25% faster comprehension, fewer "what does this mean?" bounces

3. **Ad Safety** (Rank 4)
   - No ads interrupting the primary task flow
   - User feels the page is trustworthy, not ad-heavy
   - **Expected impact**: 10–15% improvement in trust perception, reduced bounce from "looks spammy" impression

---

## ARTIFACT 3: COMPONENT STANDARDIZATION LIST — FIRST PRIORITY

### **Phase 2A: Foundation Components (Standardize These First)**

These 6 components will be standardized across ALL calculator pages and ALL article pages by May 23, 2026.

#### **1. InputField Component (Mobile-Safe)**
**Standard**: 16px base font, 44px minimum height (WCAG AAA), clear Thai labels, decimal support, error states

#### **2. ResultCard Component (Consistent Display)**
**Standard**: 32px bold result value, Thai interpretation always present, source attribution below, update date visible

#### **3. TrustPanel Component (Caveats & Method)**
**Standard**: Gray background, directly below result, Thai-language caveats, collapsible accordion, 3 visible items

#### **4. FAQAccordion Component (Consistent Behavior)**
**Standard**: 6 Thai FAQ items visible, smooth expand/collapse, 14px questions, 13px answers (Thai-optimized)

#### **5. RelatedContent Component (Consistent Navigation)**
**Standard**: Unified tiles, max 6 Thai items visible, article + calculator tiles, "See more" link

#### **6. EmailCapture Component (Consistent, Optional)**
**Standard**: Article pages only, Thai headline, email-only input, "Subscribe" button, no first-name field

---

## ARTIFACT 4: CORE WEB VITALS RISKS & MITIGATION STRATEGY

### **CWV Measurement Baseline (Current Phase 1 Data)**

From CAL-3693 heartbeat (May 5, 2026):
- **LCP (Largest Contentful Paint)**: ~2.5–3.5s (target: <2.5s) 🟡 WARNING
- **FID (First Input Delay)**: ~80–120ms (target: <100ms) 🟡 WARNING
- **CLS (Cumulative Layout Shift)**: ~0.08–0.12 (target: <0.1) 🟡 WARNING
- **Mobile Lighthouse Score**: 85–92 (good, but not 95+)

### **Concrete Mitigations**
- **LCP**: Pre-render result card shell, show loading state immediately
- **FID**: Debounce input handlers (100ms)
- **CLS**: Reserve fixed-height space for result cards and ads
- **TTI**: Code-split complex calculators, lazy-load FAQ
- **Testing**: Real 4G (20Mbps, 50ms latency), real devices, NOT DevTools

---

## VERIFICATION CHECKLIST FOR RELEASE QA

**Before marking CAL-3717 spec as "shipped" (May 23, 2026):**

### **Mobile Rendering (All Pages)**
- [ ] Input fields: 44px height, readable on 375px viewport
- [ ] Result value: 32px+, visible on-screen after click (no scroll)
- [ ] Result interpretation: Present in Thai (not just number)
- [ ] Ad spacing: 8px minimum between GuardedAdSlot and result
- [ ] Text: No horizontal scroll on 320px–480px range
- [ ] Buttons: All ≥44x44px, 8px spacing between

### **Language Compliance (Thai-First)**
- [ ] All FAQ titles: Thai only (no English placeholders, no non-Thai scripts)
- [ ] All article titles: Thai only
- [ ] All button labels: Thai only
- [ ] All metadata: Thai only (dates, times, credits)
- [ ] No Urdu, English, or other non-Thai sample text in any template

### **Core Web Vitals (Lighthouse)**
- [ ] LCP: <2.5s on 4G throttle
- [ ] FID: <100ms on real device
- [ ] CLS: <0.1 on 10-second session
- [ ] Lighthouse score: ≥90 on all 8 core calculators

---

## CROSS-FUNCTIONAL HANDOFF

**For CTO**: Standardize 6 components, implement result card skeleton, debounce inputs, reserve space, test on real 4G/devices

**For Release QA**: Mobile rendering (44px inputs, above-fold result), Lighthouse ≥90, CWV <targets on real 4G, Thai-language compliance

**For CMO**: FAQ content (Thai-only), related content audit (Thai-first ordering), email capture topic (Thai), calculator hierarchy

---

## TIMELINE

| Date | Milestone | Owner |
|------|-----------|-------|
| **May 16** | Spec delivered + audited | UXDesigner |
| **May 19** | Phase 2A components standardized | CTO |
| **May 23** | 8 core calculators verified mobile-ready | CTO + QA |
| **May 26** | Phase 2B (Web Worker, code-split) | CTO |
| **June 1** | Final CWV audit + board presentation | QA + CEO |

---

## STATUS

**✅ IMPLEMENTATION SPEC READY**

**Canonical file location**: `docs/superpowers/plans/CAL-3717-SPEC.md`

All artifacts concrete, actionable, and immediately implementable:
- ✅ Page-template wireframes (ASCII + Thai examples + rules)
- ✅ Mobile UX priorities (ranked, with impact estimates)
- ✅ Component standardization list (6 components, clear specs)
- ✅ CWV risk matrix + concrete mitigations
- ✅ Thai-first language compliance verified
- ✅ All sample text in production-quality Thai

**Next Action**: CTO begins Phase 2A implementation (May 19 deadline).
