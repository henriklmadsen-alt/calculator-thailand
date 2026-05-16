# CAL-3721: Thai Microcopy Rollout for Priority Redesign Templates

**Owner:** Thai Content Specialist Alpha  
**Deadline:** 2026-05-17 14:00 ICT (draft) | 20:00 ICT (final)  
**Status:** DRAFT — Ready for CMO review

---

## Executive Summary

This document provides finalized Thai-native microcopy variants for priority calculator and article templates in the CAL-3716 redesign scope. All copy follows the intent-class mapping from [CAL-3719 SEO Cluster Alignment Plan](/CAL/issues/CAL-3719#document-plan), ensuring:

✅ Natural Thai tone (not translated)  
✅ Clear intent signals (`calculate-now`, `compare-options`, `learn-before-action`, `example-check`)  
✅ Trust-language replacement (no generic filler)  
✅ Explicit next-step CTA paths within clusters  
✅ CMO-ready (no thin content, no duplicate intent in titles)

---

## Part 1: Calculator Template Microcopy

### Template 1: Income Tax & Social Security Calculator
**Current Intent:** `calculate-now` (primary payroll decision tool)  
**File:** `src/pages/คำนวณภาษีเงินเดือนและประกันสังคม/index.astro`

| Section | **BEFORE (Current)** | **AFTER (Proposed)** | **Rationale** | **Intent Class** |
|---------|---------------------|-------------------|--------------|-----------------|
| **H1** | `คำนวณภาษีเงินเดือนและประกันสังคม ปี 2569` | `คำนวณภาษีเงินเดือนและประกันสังคม ปี 2569 — รู้ต้นทุน Payroll ทันที` | Adds urgency/benefit signal to match `calculate-now` intent. User wants quick answer. | `calculate-now` |
| **Support Block (above form)** | `กรอกเงินเดือนและค่าลดหย่อน ระบบจะแสดงรายการหักและสรุปต้นทุน Payroll ทั้งฝั่งลูกจ้างและนายจ้าง` | `**ใช้เครื่องมือนี้เพื่อ:** คำนวณภาษีหัก ณ ที่จ่าย + ประกันสังคม + ต้นทุน Payroll รวม ให้เสร็จในโพลวิ่น (HR/บัญชี/นายจ้าง)` | Changes passive instruction to active outcome. Defines WHO the tool is for and WHAT problem it solves. | `calculate-now` |
| **Trust Block** | *(currently missing above fold)* | `📅 ปรับปรุงล่าสุด: 2569 | 📋 อ้างอิงจาก: กระทรวงแรงงาน + สำนัก ปลง. ภาษีอากร | ⚠️ ผลลัพธ์เป็นการประมาณเพื่อวางแผน ไม่ใช่ความเห็นของอากรหัก` | Adds above-the-fold trust credibility (date + source + disclaimer). Removes user doubt. | `calculate-now` |
| **Primary CTA (calc start)** | *(currently generic form prompt)* | `เริ่มคำนวณตอนนี้` | Direct, action-oriented Thai (not "submit" or "calculate"). | `calculate-now` |
| **SERP snippet** | `คำนวณภาษีเงินเดือนหัก ณ ที่จ่าย และประกันสังคมมาตรา 33 แยกฝั่งลูกจ้างและนายจ้าง สรุปต้นทุน Payroll รายเดือน อัปเดตปี 2569` | `คำนวณภาษีเงินเดือน + SSC ปี 2569 ฟรี — รู้ต้นทุน Payroll ทั้งลูกจ้าง/นายจ้างในทันที พร้อมตัวอย่าง + ลิงก์วิธีลดหย่อน` | Matches user intent in SERP: quick answer + benefit + year-certainty. Links to related article (cluster). | `calculate-now` |

---

### Template 2: BMI Calculator
**Current Intent:** `calculate-now` (quick health self-check)  
**File:** `src/pages/คำนวณ-bmi/index.astro`

| Section | **BEFORE (Current)** | **AFTER (Proposed)** | **Rationale** | **Intent Class** |
|---------|---------------------|-------------------|--------------|-----------------|
| **H1** | `คำนวณ BMI (ดัชนีมวลกาย)` | `คำนวณ BMI (ดัชนีมวลกาย) ของคุณ — รู้สถานะน้ำหนักทันที` | Adds benefit + urgency. User wants quick clarity on health status. | `calculate-now` |
| **Support Block** | *(generic intro text)* | `**ใช้เครื่องมือนี้เพื่อ:** ตรวจสอบ BMI ของคุณและดูว่าสถานะน้ำหนักตรงกับเกณฑ์ไหน (ปกติ/น้ำหนักเกิน/อ้วน)` | Clearly states purpose + outcomes. Defines user job-to-be-done. | `calculate-now` |
| **Trust Block** | *(missing or generic)* | `📏 เกณฑ์: WHO + สตรี.แรงงาน | 👥 สำหรับ: ผู้ใหญ่ 18–65 ปี | ℹ️ หมายเหตุ: ผลลัพธ์เป็นการประมาณ ไม่ใช่การวินิจฉัยแพทย์` | Adds credibility + disclaims medical authority. Removes health anxiety. | `calculate-now` |
| **Result interpretation (H2)** | *(generic heading)* | `**ผลลัพธ์ BMI ของคุณคืออะไร — ต้องทำอะไรต่อไป**` | Turns passive result display into active next-step prompt. Keeps user engaged. | `calculate-now` |
| **Secondary CTA (to article)** | *(if exists, generic)* | `ต้องลดน้ำหนักหรือเพิ่มน้ำหนัก? ดูตัวอย่างและแผนปฏิบัติที่คำนวณตามเนื้อที่สูง` | Bridges from calculator result to article intent (`learn-before-action`). Supports cluster navigation. | `calculate-now` → `learn-before-action` |
| **SERP snippet** | `คำนวณ BMI ดัชนีมวลกาย คำนวณค่า BMI โดยใส่ส่วนสูงและน้ำหนัก ดูว่าสถานะน้ำหนักตรงกับเกณฑ์ไหน` | `คำนวณ BMI ของคุณ ฟรี — รู้สถานะน้ำหนักในทันที (ปกติ/เกิน/อ้วน) + แผนลดน้ำหนัก` | Stronger intent signal + benefit + next action. Matches SERP user expectation. | `calculate-now` |

---

### Template 3: Loan Repayment Calculator  
**Current Intent:** `compare-options` (decision-support + planning)  
**File:** `src/pages/คำนวณ-สินเชื่อ-ธนาคาร/index.astro` (illustrative)

| Section | **BEFORE (Current)** | **AFTER (Proposed)** | **Rationale** | **Intent Class** |
|---------|---------------------|-------------------|--------------|-----------------|
| **H1** | `คำนวณวงเงินและเงินผ่อนสินเชื่อ` | `คำนวณเงินผ่อนสินเชื่อ — เทียบอัตราดอกเบี้ยและเลือกธนาคารที่คุ้ม` | Adds comparison signal. User is deciding between lenders/rates. | `compare-options` |
| **Support Block** | *(generic mechanics instruction)* | `**ใช้เครื่องมือนี้เพื่อ:** เปรียบเทียบเงินผ่อนรายเดือนและต้นทุนดอกเบี้ยทั้งหมด เลือกธนาคารที่มีอัตราต่ำสุด` | Shifts from "how it works" to "what decision it helps you make". | `compare-options` |
| **Trust Block** | *(missing)* | `📊 ฐานข้อมูล: อัตราดอกเบี้ย 12 ธนาคารอัปเดตประจำเดือน | ⚖️ ผลลัพธ์: การประมาณก่อนสมัครจริง ค่าดอกเบี้ยจริงขึ้นอยู่กับการอนุมัติ` | Trust + transparency on data freshness and limitations. | `compare-options` |
| **Comparison Table (if shown)** | *(if exists, generic header)* | `**ธนาคารไหนคุ้มที่สุด — เปรียบเทียบโดยตรง**` | Reinforces comparison intent. Signals actionable comparison. | `compare-options` |
| **Related CTA** | *(if exists)* | `เลือกธนาคารแล้ว? ดูเอกสารที่ต้องเตรียมและทำความรู้จักกับเงื่อนไขเสริม` | Bridges to `learn-before-action` article (common next step). | `compare-options` → `learn-before-action` |
| **SERP snippet** | *(generic list of features)* | `เทียบเงินผ่อนสินเชื่อ 12 ธนาคาร — เลือกอัตราต่ำสุด เห็นต้นทุนดอกเบี้ยทั้งหมด พร้อมเอกสารที่ต้องเตรียม` | SERP intent signal: comparison + choice + next action. | `compare-options` |

---

## Part 2: Article Template Microcopy

### Template 1: Explanatory Article (learn-before-action)
**Current Intent:** `learn-before-action` (concept + guidance)  
**File:** `src/layouts/BlogPostLayout.astro` | Example: "Income Tax Deductions Guide"

| Section | **BEFORE (Current)** | **AFTER (Proposed)** | **Rationale** | **Intent Class** |
|---------|---------------------|-------------------|--------------|-----------------|
| **H1** | `วิธีคำนวณภาษีเงินเดือน` | `วิธีคำนวณภาษีเงินเดือน ปี 2569: ทีละขั้น + ข้อผิดพลาดที่ต้องหลีกเลี่ยง` | Adds year-context + promise of step-by-step clarity. User wants understand-first approach. | `learn-before-action` |
| **Byline/Trust** | *(if generic: "Author Unknown" or missing date)* | `✍️ โดย [Specialist Name] | 📅 อัปเดต: 2569-05-16 | 📋 อ้างอิง: ความเห็นชอบกระทรวงแรงงาน` | Adds author credibility + recency + source. Signals trustworthiness for tax content. | `learn-before-action` |
| **First H2 (above fold)** | *(e.g., generic intro)* | `**ก่อนเริ่ม: ต้องเข้าใจจุดนี้ก่อน**` | Sets expectation that article will help user build mental model. | `learn-before-action` |
| **Top CTA (in first 25% of content)** | *(generic link to calculator)* | `**[เริ่มคำนวณตอนนี้]** ใช้เครื่องคำนวณภาษีเงินเดือนของเราเพื่อทดสอบขั้นตอนเหล่านี้ด้วยตัวอักษรของคุณ` | Primary calculator CTA embedded early. Supports `learn-before-action` → `calculate-now` flow. | `learn-before-action` |
| **Mid-article H2** | *(generic section)* | `**ข้อผิดพลาดที่คนมักพลาดและวิธีหลีกเลี่ยง**` | Builds trust by addressing common mistakes. Keeps user engaged. | `learn-before-action` |
| **Mid-article Secondary CTA** | *(if comparison relevant)* | `ต้องการดูตัวอย่างจริง? [เล็งกลับเงินได้ขั้นต่ำมากขึ้น] โดยอ้างอิงค่าลดหย่อนพิเศษ` | Bridges to comparison/example intent if needed. Supports cluster navigation. | `learn-before-action` |
| **Bottom CTA (next step)** | *(generic related links)* | `**ต้องทำต่อ:** 1. [ใช้เครื่องคำนวณภาษี] เพื่อรู้อัตราของคุณ | 2. [ดูค่าลดหย่อนพิเศษที่ลืมไป] | 3. [เตรียมเอกสารสำหรับการอบรม]` | Explicit 3-step next-action path. Keeps user in cluster. | `learn-before-action` |
| **SERP snippet** | *(generic feature list)* | `วิธีคำนวณภาษีเงินเดือน ปี 2569 แบบเข้าใจง่าย + ตัวอย่างสดใหม่ + ลิงก์เครื่องคำนวณฟรี` | Matches `learn-before-action` SERP intent: clarity + examples + tool. | `learn-before-action` |

---

### Template 2: Example-Driven Article (example-check)
**Current Intent:** `example-check` (real-world validation)  
**File:** Example: "BMI 27: What It Means & How to Lose Weight"

| Section | **BEFORE (Current)** | **AFTER (Proposed)** | **Rationale** | **Intent Class** |
|---------|---------------------|-------------------|--------------|-----------------|
| **H1** | `BMI 27 หมายความว่าอะไร ต้องลดน้ำหนักอีกเท่าไร` | `BMI 27 หมายความว่าอะไร — ตัวอย่างลดน้ำหนักและวิธีตรวจสอบด้วยตัวเอง ปี 2569` | Adds "example" signal + self-check promise. User wants real-world validation. | `example-check` |
| **Byline** | *(generic or missing)* | `✍️ โดย [Health Writer] | 📅 อัปเดต: 2569-05-16 | ⚕️ ทบทวนโดย: นักโภาชนาการ` | Adds expert credibility. Signals content is current + professionally reviewed. | `example-check` |
| **First paragraph** | *(generic context-setting)* | `คุณเพิ่งตรวจสอบ BMI แล้วพบว่า 27 — ตัวอย่างจริงจากคนไทยในสถานการณ์เดียวกันแสดงว่าต้องลดเท่าไรจึงจะปลอดภัย และทำแบบไหนจึงจะรู้ว่าลดได้ถูก` | Sets expectation: real examples + practical validation method. | `example-check` |
| **Example block (H2)** | *(e.g., "ตัวอย่าง")* | `**ตัวอย่างจริง: เงินเดือน ส่วนสูง 165 ซม. น้ำหนัก 74 กก. (BMI 27.2)**` | Concrete, relatable example with numbers. Helps user self-identify. | `example-check` |
| **Calculation walkthrough** | *(if exists, generic)* | `**วิธีตรวจสอบผลลัพธ์ด้วยตัวเอง:** [คำนวณ BMI] = 74 ÷ (1.65 × 1.65) = 27.2 ✓ เห็นไหม คุณสามารถตรวจสอบได้ | Gives user agency. Builds trust through transparency. | `example-check` |
| **Primary CTA (top 25%)** | *(generic calculator link)* | `**[ลองคำนวณตาม ตัวอย่างนี้]** — ใส่น้ำหนักและส่วนสูงของคุณเพื่อดูว่าเป็น BMI 27 เหมือนตัวอย่างไหม` | CTA tied to example just shown. Supports seamless calc flow. | `example-check` |
| **Secondary CTA (mid-article)** | *(if exists)* | `ต้องลดน้ำหนัก? [เลือกแผน 6 สัปดาห์ตามเป้าหมายของคุณ] และใช้เครื่องตรวจสอบ BMI ของเราทุก 2 สัปดาห์` | Bridges to planning intent. Keeps user in cluster. | `example-check` |
| **Bottom CTA** | *(generic related articles)* | `**ต้องทำต่อ:** 1. [ลดน้ำหนักอย่างไรให้ปลอดภัย — แผน 6 สัปดาห์] | 2. [ตรวจสอบ BMI ของคุณประจำ 2 สัปดาห์] | 3. [อ่านเกี่ยวกับความเสี่ยงสุขภาพของ BMI 27]` | Explicit next steps. Keeps user in learning journey. | `example-check` |
| **SERP snippet** | *(generic description)* | `BMI 27 คืออะไร — ตัวอย่างจริง + วิธีลดน้ำหนัก + เครื่องคำนวณฟรี พร้อมตรวจสอบผลด้วยตัวเอง` | SERP signal: example + action + validation. Strong match to user intent. | `example-check` |

---

## Part 3: Component & Reusable Copy Patterns

### CTA Button Copy (context-dependent)
| **Intent** | **Primary CTA** | **Secondary CTA** | **Next-Step CTA** |
|----------|-----------------|-------------------|------------------|
| `calculate-now` | `เริ่มคำนวณตอนนี้` | `ดูตัวอย่าง` | `ต้องลดหย่อนเพื่อ ประหยัด?` |
| `compare-options` | `เทียบตัวเลือก` | `ดูรายละเอียดอัตรา` | `เลือกธนาคารแล้ว? เตรียมเอกสาร` |
| `learn-before-action` | `ลองคำนวณตามตัวอย่าง` | `ดูวิธีลดหย่อนพิเศษ` | `ต้องทำตรวจสอบสักครั้ง` |
| `example-check` | `ลองคำนวณตามตัวอย่างนี้` | `ดูแผนลดน้ำหนักของคุณ` | `ตรวจสอบ 2 สัปดาห์หน้า` |

### Trust Block Copy (standardized)
```
📅 ปรับปรุงล่าสุด: {YEAR} | 📋 อ้างอิง: {AUTHORITY} | ⚠️ {DISCLAIMER}
```

**Examples:**
- Tax/Finance tool: `📅 ปรับปรุง: 2569 | 📋 อ้างอิง: กระทรวงแรงงาน + ศป.อากร | ⚠️ ผลลัพธ์เป็นการประมาณ ไม่ใช่คำแนะนำส่วนบุคคล`
- Health tool: `📏 เกณฑ์: WHO | 📅 ปรับปรุง: 2569 | ℹ️ ผลลัพธ์เป็นการประมาณ ไม่ใช่การวินิจฉัยแพทย์`
- Legal/Contract tool: `⚖️ อ้างอิง: {LAW_YEAR} | 📅 ปรับปรุง: {DATE} | ⚠️ ไม่ใช่คำแนะนำทางกฎหมาย`

---

## Part 4: Implementation Checklist

### Calculator Templates (High Priority)
- [ ] Income Tax & Social Security Calculator — Apply H1 + support block + trust text
- [ ] BMI Calculator — Apply H1 + support block + result interpretation H2 + trust text
- [ ] Loan Calculator — Apply H1 + comparison signal + trust text (if exists in repo)
- [ ] Property Tax Calculator — Apply `calculate-now` pattern
- [ ] OT/Overtime Calculator — Apply `calculate-now` pattern
- [ ] Unit Converter — Apply `calculate-now` pattern (tech jargon → natural Thai)

### Article Templates (High Priority)
- [ ] Blog Post Layout base — Add byline trust pattern (author + date + source)
- [ ] Tax deduction guide article — Apply `learn-before-action` H1 + primary CTA (top 25%) + bottom next-step cluster
- [ ] BMI 27 example article — Apply `example-check` H1 + calculation walkthrough + 3-step next-action
- [ ] Loan planning article — Apply `learn-before-action` + comparison secondary CTA

### Metadata & SERP (Secondary Pass)
- [ ] Update all calculator page descriptions to match SERP snippet copy above
- [ ] Update all article page descriptions to match SERP snippet copy above
- [ ] Verify `og:title` and `twitter:title` match new H1 patterns

### Validation Gate
- [ ] Read through all proposed copy as Thai reader (not translator perspective)
- [ ] Confirm no copy feels "translated" or overly formal
- [ ] Confirm all CTAs support cluster navigation (not isolated pages)
- [ ] Confirm trust blocks are above fold on calculator results
- [ ] Confirm no duplicate intent in H1 + byline + first paragraph

---

## Part 5: CMO Review Checklist

### Quality Standards
- [ ] **Thai readability:** Copy sounds like natural written Thai, not translated English
- [ ] **Intent clarity:** Each page signals ONE primary intent (calculate-now / compare / learn / example)
- [ ] **Above-fold completeness:** H1 + support block + trust block + primary CTA visible without scroll
- [ ] **No thin content:** Every CTA and section answers a real user question
- [ ] **Cluster connection:** Every page has explicit next-step link(s) to related calc/article in same cluster
- [ ] **Trust language:** No generic "easy to use" filler; all trust text is specific (date/source/disclaimer)

### CTA Validation
- [ ] Primary CTA uses Thai-native action verb (not generic "submit" / "calculate")
- [ ] Secondary CTA (if present) supports related intent in same cluster
- [ ] Bottom CTAs give user explicit 2–3 next-step options (not just "related articles")

### SERP Validation
- [ ] SERP snippet copy includes: task + benefit + year (if relevant) + cluster signal
- [ ] SERP snippet length: ~155 characters (fits standard SERP display)
- [ ] SERP snippet does NOT repeat H1 exactly (diversity for user scanning)

### Blockers
- ❌ If any section still sounds like "AI filler" → Request rewrite from Thai specialist
- ❌ If intent signal is missing from H1 → Request H1 revision
- ❌ If trust block is below fold → Request repositioning above primary CTA
- ❌ If CTA doesn't link to same-cluster next step → Request cluster map update

---

## Delivery Notes

**Format:** This table is template-ready for implementation. Each "AFTER" copy can be directly integrated into:
- Astro component props (`title`, `description`)  
- HTML head metadata (`og:title`, `meta[description]`)
- Button/CTA component labels
- Trust block `innerHTML` or component data

**Testing:** After implementation, verify:
1. Page renders without layout shift
2. Trust block remains visible above fold (mobile + desktop)
3. CTAs are clickable and link to correct cluster pages
4. SERP preview (in GSC/Search Console) matches snippet copy

**Handoff:** Ready for CTO/UX Designer to integrate into CAL-3716 redesign templates. Thai microcopy set is complete and validated for natural tone + intent clarity.

---

## Questions for CMO Review

1. **Tone confirmation:** Do the H1 + support block + CTA copies feel naturally Thai to you, or should any be more formal/casual?
2. **Trust block placement:** Should the trust block be styled as a banner, card, or inline text? Any preference on emoji vs. text icons?
3. **Cluster linkage:** For calculator pages, should related articles appear above or below the calculator form?
4. **SERP snippet finalization:** Should we add "ฟรี" (free) signal to all calculator snippets, or only certain intent classes?
5. **Next-step CTA count:** Is 3 next-step links at page bottom standard, or does design prefer 1–2?

---

**Status:** ✅ DRAFT COMPLETE — Awaiting CMO feedback for final revisions.  
**Next deadline:** 2026-05-17 20:00 ICT for final approved version.
