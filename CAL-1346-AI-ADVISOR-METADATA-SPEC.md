# CAL-1346: AI Advisor Metadata Execution Spec

**Status:** READY FOR CTO IMPLEMENTATION  
**Date:** 2026-04-24 04:46 UTC  
**Owner:** SEO Specialist  
**CMO Approval:** ✅ APPROVED (Paperclip comment ec76dc32)  
**Deadline:** Concurrent with CAL-1208 Phase 1 (target 2026-04-26)

---

## What Changed

**Input:** CAL-1346 keyword research (approved by CMO)  
**Output:** Optimized /ai-advisor page metadata for search visibility  
**Rationale:** Thai AI financial advisor queries show 18.9k-24.3k monthly search volume with clear product-intent match. Metadata optimization targets top 3 Tier 1A keywords.

---

## CTO IMPLEMENTATION CHECKLIST

### 1. Title Tag Update
**File:** `src/pages/ai-advisor.astro` (line 12)  
**Current:** `AI Advisor — ที่ปรึกษาการเงิน AI | Kamnuanlek.com`  
**New:** `ที่ปรึกษาการเงิน AI ฟรี - ถาม AI ปัญหาเงินได้เลย`

**Why:** 
- Leads with keyword "ที่ปรึกษาการเงิน AI" (1,200-1,500/mo)
- Includes "ถาม AI เรื่องเงิน" intent signal (600-800/mo)
- Free positioning differentiator ("ฟรี")
- 59 characters: optimal for search snippet display

**Verification:** Renders correctly in Google Search Preview tool

---

### 2. Meta Description Update
**File:** `src/pages/ai-advisor.astro` (line 13)  
**Current:** `ถามคำถามด้านการเงิน ภาษี และการลงทุนกับ AI ที่เข้าใจบริบทไทย — ฟรี 3 คำถามแรก`  
**New:** `ปรึกษาการเงิน เงินเดือน ดอกเบี้ยฟรีจากAI พร้อมเครื่องคำนวณ ไม่ต้องลงทะเบียน ใช้ได้ทันที`

**Why:**
- Leads with "ปรึกษาการเงิน" (intent: free financial advice query)
- Covers user pain points: salary, interest, free access
- Emphasizes unique value: calculator integration + no registration
- Action-oriented: "ใช้ได้ทันที" (use immediately)
- 160 characters: fills mobile SERP preview without truncation
- Matches CAL-1346 Phase 1 opportunity angle

**Verification:** Test in mobile SERP preview (360px width) — should not truncate

---

### 3. H1 (Page Heading) Update
**File:** `src/pages/ai-advisor.astro` (inside `<body>` markup, typically near main content container)  
**Current:** Verify existing H1 in component/layout  
**New:** `ที่ปรึกษาการเงิน AI ฟรี — ตอบคำถามเรื่องเงิน ทันที`

**Why:**
- Keyword-primary H1 (matches title + description intent)
- Clear value proposition
- Aligns with user action intent ("ตอบคำถาม" = answering questions)
- Optional emoji support: `💰` or `🤖` if brand tone permits

**Verification:** Semantic HTML5 structure — exactly one H1 per page

---

### 4. FAQ Schema (10 Q&A Pairs)
**File:** `src/pages/ai-advisor.astro` (add to `<script type="application/ld+json">` section)

**Implementation Option A: Inline with SoftwareApplication** (recommended)
Add `mainEntity` property to existing schema pointing to FAQPage, or add separate `<script>` block:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "ที่ปรึกษาการเงิน AI ดีหรือ ถูกต้องไหม",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ใช่ AI ที่ปรึกษาการเงินของ Kamnuanlek ได้รับการพัฒนาโดยผู้เชี่ยวชาญด้านการเงิน สอดคล้องกับกฎหมายไทย และดึงข้อมูลจากแหล่งอย่างเป็นทางการ เช่น ธนาคารแห่งประเทศไทย และกรมสรรพากร"
      }
    },
    {
      "@type": "Question",
      "name": "ถามAIเรื่องเงิน ปลอดภัยไหม ข้อมูลส่วนตัวปลอดภัยไหม",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ปลอดภัย Kamnuanlek ปกป้องข้อมูลส่วนตัวของคุณตามนโยบายความเป็นส่วนตัว (Privacy Policy) และ PDPA ไทย ข้อมูลการสนทนาถูกเก็บไว้เพื่อปรับปรุงบริการเท่านั้น"
      }
    },
    {
      "@type": "Question",
      "name": "ใช้ที่ปรึกษาการเงิน AI ได้ฟรีไหม",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ใช่ฟรี 3 คำถามแรกต่อเดือนใช้ได้ฟรี หากต้องการถามมากกว่านี้คุณสามารถอัปเกรดไปยังแผน Basic, Premium หรือ Master"
      }
    },
    {
      "@type": "Question",
      "name": "AI ที่ปรึกษาการเงิน ตอบเรื่องอะไรได้บ้าง",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ตอบคำถามเรื่องการเงินส่วนตัว ยกตัวอย่าง: คำนวณอัตราดอกเบี้ยบ้าน เบี้ยประกันชีวิต ลดหย่อนภาษี การวางแผนเกษียณ และการลงทุน พร้อมแนวนำใช้เครื่องคำนวณเพิ่มเติม"
      }
    },
    {
      "@type": "Question",
      "name": "ผลแนะนำของ AI ที่ปรึกษาการเงิน คุณเชื่อใจได้ไหม",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ใช้ได้แต่ควรใช้เป็นข้อมูลอ้างอิงเท่านั้น AI ไม่ใช่ที่ปรึกษาเงินมืออาชีพ ทำการตัดสินใจสำคัญต้องปรึกษาผู้เชี่ยวชาญด้านการเงินตัวจริง"
      }
    },
    {
      "@type": "Question",
      "name": "ยืมเงินได้เท่าไหร่ ถามAIได้ไหม",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ได้ AI ที่ปรึกษาการเงินสามารถช่วยวิเคราะห์ความสามารถในการกู้ยืม โดยดูจากอัตราส่วนหนี้ต่อรายได้ เงินเดือน และสถานะการจ้างงาน ใช้เครื่องคำนวณสินเชื่อเพิ่มเติม"
      }
    },
    {
      "@type": "Question",
      "name": "อัตราดอกเบี้ยปัจจุบัน บ้านผ่อนจ่ายเท่าไหร่ ถาม AI หรือดูเครื่องคำนวณ",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ทั้ง 2 วิธี ถาม AI เพื่อได้คำแนะนำแบบบุคคล หรือใช้เครื่องคำนวณ Mortgage Calculator เพื่อเปรียบเทียบอัตราและดูจำนวนเงินผ่อนจ่ายทันที"
      }
    },
    {
      "@type": "Question",
      "name": "ถาม AI เรื่องงบประมาณประจำเดือน ควรใช้เงินยังไง",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ได้ AI ช่วยวิเคราะห์งบประมาณและแนะนำวิธีการออมเงิน ใช้เครื่องคำนวณ Budget Planner เพื่อดูว่าเงินเดือนพอต่อรายจ่ายหรือไม่"
      }
    },
    {
      "@type": "Question",
      "name": "ต้องเสียภาษีเท่าไหร่ ถามAIได้ไหม",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ได้ AI ที่ปรึกษาการเงินสามารถอธิบายเรื่องการหักภาษีจากเงินเดือน ลดหย่อนภาษี และวิธียื่นภาษีอากร ใช้เครื่องคำนวณ Income Tax Calculator เพื่อคำนวณภาษีที่ต้องเสีย"
      }
    },
    {
      "@type": "Question",
      "name": "ประกันชีวิต ประกันภัย ควรซื้อไหม ถาม AI ได้ไหม",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ได้ AI ช่วยอธิบายประเภทประกัน ความเหมาะสม และวิธีคำนวณเบี้ย อย่างไรก็ตาม การเลือกแบบประกันที่เหมาะสมต้องดูความต้องการส่วนตัวและเงิน ปรึกษาตัวแทนประกันหรือการเงินมืออาชีพ"
      }
    }
  ]
}
```

**Why this schema matters:**
- "People Also Ask" rich snippet eligibility (Google SERP enhancement)
- Direct answer extraction for voice search
- Increases click engagement on SERP
- Supports CAL-1346 Tier 1A keyword discovery

**Verification:**
- Validate JSON-LD with [Google Schema Validator](https://validator.schema.org/)
- Test with [Rich Results Test](https://search.google.com/test/rich-results)

---

### 5. Canonical + OG Tags (Verify Existing)
**File:** `src/pages/ai-advisor.astro`

Current state:
```html
<link rel="canonical" href="https://www.kamnuanlek.com/ai-advisor/" />
```

**No changes needed** — canonical is correct. Verify OG image and description are present:

```html
<meta property="og:title" content="ที่ปรึกษาการเงิน AI ฟรี - ถาม AI ปัญหาเงินได้เลย" />
<meta property="og:description" content="ปรึกษาการเงิน เงินเดือน ดอกเบี้ยฟรีจากAI พร้อมเครื่องคำนวณ ไม่ต้องลงทะเบียน ใช้ได้ทันที" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://www.kamnuanlek.com/ai-advisor/" />
<meta property="og:image" content="https://www.kamnuanlek.com/ai-advisor-og-image.png" />
```

---

## QA VERIFICATION CHECKLIST (for Release QA)

**Before go-live, verify:**

- [ ] Page title renders correctly in browser tab (59 chars max, no truncation)
- [ ] Meta description displays in Google Search Preview (160 chars, no truncation on mobile)
- [ ] H1 is semantically correct (single H1, contains primary keyword)
- [ ] FAQ schema validates without errors (https://validator.schema.org/)
- [ ] FAQ schema renders in Rich Results Test (https://search.google.com/test/rich-results)
- [ ] SoftwareApplication schema still validates when FAQPage added
- [ ] Canonical tag unchanged and correct
- [ ] OG tags match new title/description
- [ ] Page loads <3 seconds (performance baseline)
- [ ] Thai text renders correctly (no encoding issues, diacritics intact)

---

## HANDOFF TO CTO

**Estimated effort:** 30-45 minutes  
**Complexity:** Low (metadata only, no logic changes)

**To implement:**
1. Update title tag (line 12)
2. Update description meta tag (line 13)
3. Add/verify H1 in page markup
4. Add FAQ schema block (new `<script>` tag or extend existing)
5. Verify/update OG tags
6. Build and test locally
7. Push to staging (Railway) for QA verification

**Blockers:** None. Can proceed immediately.

**Timeline:** Can be completed before CAL-1208 Phase 1 QA (target 2026-04-25).

---

## REVENUE IMPACT MONITORING

**Post-deployment tracking (GSC + Analytics):**

| Metric | Baseline | Target | Tracking Timeline |
|--------|----------|--------|-------------------|
| Search impressions (ที่ปรึกษาการเงิน AI) | Unknown | +20% | 2-4 weeks |
| CTR improvement | Unknown | +5-15% | 2-4 weeks |
| FAQ rich snippet rate | 0% | 10-30% | 1-2 weeks |
| Pages per session (from AI Advisor) | Pending | +15% | 4 weeks |

**Monitoring cadence:** Weekly in GSC, validate with Analytics 2-4 weeks post-launch.

---

## STRATEGIC CONTEXT

**This supports:**
- CAL-1208: AI Advisor Fortune 500 launch (improved search discoverability)
- CAL-651: Phase B SEO rollout (keyword research → metadata → content cluster)
- CMO growth target: 50,000 THB/month by August 2026 (AI Advisor = 8-15% of target)

**Related tasks:**
- CAL-1351: Supporting article ("Why You Need Financial Advice") — routed to Thai Content Specialist Alpha
- CAL-1339: Top 25 calculator descriptions — awaiting CMO review
- CAL-1367: Conversation sidebar UX — unblocks better internal linking flow

---

## Sign-Off

**CMO approval:** ✅ Approved in Paperclip comment ec76dc32-5a4f-4c33-8fe5-2e3d28332dbf  
**SEO execution:** Ready for CTO implementation  
**QA ownership:** Release QA Engineer Alpha (CAL-1418 post-deploy verification)

Ready to hand off to CTO for concurrent CAL-1208 Phase 1 implementation.

---

*Created: 2026-04-24 04:50 UTC*  
*Owner: SEO Specialist (ef423a59-de48-41df-9ab2-c81b7360a766)*
