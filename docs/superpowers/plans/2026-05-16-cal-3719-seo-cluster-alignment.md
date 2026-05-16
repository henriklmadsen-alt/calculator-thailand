# CAL-3719 SEO + Content Cluster Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align CAL-3716 redesign with search intent, Thai copy quality, internal-link cluster structure, schema/metadata integrity, and measurable 14/30-day SEO outcomes.

**Architecture:** Standardize two template systems (calculator + article) around one shared intent model and one shared cluster-link data model. Keep rendering components lightweight, but move strategy fields (intent type, cluster key, CTA role, trust snippet role) into centralized data so pages stay consistent at scale.

**Tech Stack:** Astro, TypeScript, JSON-LD schema, GA4 (`gtag`), internal link map in `src/lib/internal-links.ts`.

---

## 1) Search-Intent Map for Redesigned Templates

### Intent classes to support (non-negotiable)

| Intent class | Primary query style (TH) | Page type | Conversion action |
|---|---|---|---|
| `calculate-now` | "คำนวณ...เท่าไร", "คิด...ออนไลน์" | Calculator page | Complete calculator run |
| `compare-options` | "แบบไหนคุ้ม", "รีไฟแนนซ์ vs ...", "เทียบ..." | Calculator + comparison article | Click to comparison calculator/article |
| `learn-before-action` | "วิธีคำนวณ...", "คืออะไร", "ต้องเตรียมอะไร" | Article page | Click into calculator CTA |
| `example-check` | "เงินเดือน...เสียภาษีเท่าไร", "ผ่อนบ้าน...เดือนละเท่าไร" | Article page with examples | Click into same-cluster calculator |

### Calculator template mapping (redesign target)

**Files:**
- Modify: `src/components/CalculatorHeader.astro`
- Modify: `src/components/MetadataHeader.astro`
- Modify: `src/components/RelatedCalculators.astro`
- Modify: `src/components/templates/RelatedArticles.astro`
- Modify: `src/layouts/BaseLayout.astro`

- [ ] H1 must declare explicit task + year context when query is year-sensitive (`2569`).
- [ ] First support block under H1 must answer "ทำอะไรได้ในหน้านี้" in 1-2 lines (pre-result confidence).
- [ ] Keep one visible intent cluster block near top (`...-intent-cluster`) with at least 2 same-cluster links.
- [ ] Keep one trust block above fold: `Updated`, `Source`, `Author` from `MetadataHeader`.
- [ ] Keep one post-result "next step" bridge: related calculator + related article.

### Article template mapping (redesign target)

**Files:**
- Modify: `src/layouts/BlogPostLayout.astro`
- Modify: `src/components/templates/ArticleCalculatorCTA.astro`
- Modify: `src/components/ArticleByline.astro`
- Modify: `src/components/templates/RelatedArticles.astro`

- [ ] Article H1 must promise one outcome only (no mixed intents in title).
- [ ] Top 25% of content must include one cluster CTA to the primary calculator.
- [ ] Mid-article must include one secondary CTA for comparison/support intent.
- [ ] Byline must use natural Thai trust wording (author + updated date + source context).
- [ ] Bottom section must include "what to do next" links: 1 calculator + 1 supporting article.

---

## 2) Thai Microcopy Recommendations (H1/H2, CTA, Trust, Snippets)

### H1 patterns

- Calculator (`calculate-now`): `คำนวณ{หัวข้อหลัก} {ปี} — รู้ผลทันที`
- Calculator (`compare-options`): `คำนวณ{หัวข้อหลัก} {ปี} — เทียบ{ทางเลือก A} vs {ทางเลือก B}`
- Article (`learn-before-action`): `{หัวข้อหลัก} {ปี}: วิธีคิดทีละขั้น + ข้อควรระวัง`
- Article (`example-check`): `{หัวข้อหลัก} {ปี}: ตัวอย่างจริง + วิธีเช็กผลด้วยตัวเอง`

### H2 patterns

- Intent clarifier: `หน้านี้ช่วยคุณตัดสินใจเรื่องอะไร`
- Action step: `กรอกข้อมูลอะไรบ้างก่อนคำนวณ`
- Risk guard: `ข้อผิดพลาดที่คนมักพลาด`
- Cluster bridge: `ไปต่อกับเครื่องมือที่เกี่ยวข้อง`

### CTA copy set (Thai-native, non-generic)

- Primary calculator CTA:
  - `เริ่มคำนวณทันที`
  - `คำนวณจากข้อมูลจริงของคุณ`
- Secondary comparison CTA:
  - `เทียบทางเลือกที่คุ้มกว่า`
  - `ดูผลต่างก่อนตัดสินใจ`
- Article-to-calculator CTA:
  - `ลองคำนวณตามตัวอย่างนี้`
  - `ไปที่เครื่องคำนวณหลัก`

### Trust text lines (replace generic filler)

- `ข้อมูลไม่ถูกเก็บถาวร ใช้เพื่อการคำนวณในหน้านี้เท่านั้น`
- `อัปเดตเกณฑ์ล่าสุด: {วันที่อัปเดต}`
- `อ้างอิงหลักเกณฑ์จาก: {หน่วยงานไทยที่เกี่ยวข้อง}`
- `ผลลัพธ์เป็นการประมาณเพื่อวางแผน ไม่ใช่คำแนะนำส่วนบุคคล`

### SERP snippet lines (description support)

- Calculator snippet:
  - `คำนวณ{หัวข้อ} {ปี} ฟรี รู้ผลทันที พร้อมคำอธิบายวิธีคิดและลิงก์เครื่องมือที่เกี่ยวข้อง`
- Article snippet:
  - `สรุป{หัวข้อ} {ปี} แบบเข้าใจง่าย พร้อมตัวอย่างและลิงก์ไปเครื่องคำนวณที่ใช้ได้ทันที`

---

## 3) Internal-Link Blueprint (Related Calculators + Article Cluster Links)

### Data model delta (required)

**Files:**
- Modify: `src/lib/internal-links.ts`
- Modify: `src/components/RelatedCalculators.astro`
- Modify: `src/components/templates/RelatedArticles.astro`

- [ ] Add `clusterKey` and `intentRole` to each calculator/article link node.
- [ ] Enforce `1 primary + 2 secondary` related calculator links per calculator template.
- [ ] Enforce `1 primary + up to 2 supporting` article links per calculator template.
- [ ] Add lightweight validator script to reject orphan pages without cluster mapping.

### Target link structure per page

- Calculator page:
  - `Primary calculator link` = same intent family
  - `Secondary calculator link #1` = upstream planning intent
  - `Secondary calculator link #2` = downstream decision intent
  - `Primary article link` = explanatory support for current tool
- Article page:
  - `Primary calculator CTA` = same topic exact-match calculator
  - `Secondary article link` = follow-up intent in same cluster
  - `Optional comparison link` = when intent contains "เทียบ/คุ้ม/เลือก"

### Cluster minimum rule

- No published page without:
  - 1 inbound internal link from same cluster
  - 2 outbound cluster links (calculator/article combined)
  - 1 explicit CTA path to next action

---

## 4) Metadata + Schema Deltas Required After Redesign

### Metadata normalization

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/layouts/BlogPostLayout.astro`
- Modify: key pages under `src/pages/คำนวณ*/index.astro` and `src/pages/บทความ/*/index.astro`

- [ ] Standardize title pattern by intent class (calculator vs article).
- [ ] Standardize descriptions to include task + benefit + year only where relevant.
- [ ] Ensure canonical URLs remain stable during redesign.
- [ ] Ensure `og:title` and `twitter:title` mirror user intent, not template names.

### Schema deltas

**Files:**
- Modify: `src/components/schema/CalculatorSchema.astro`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/layouts/BlogPostLayout.astro`

- [ ] Prevent duplicate/competing `HowTo` schema for calculators with custom `HowTo`.
- [ ] Add explicit `dateModified` support for calculator schema payload.
- [ ] Add `isPartOf` references between article and calculator where cluster-linked.
- [ ] Keep FAQ schema only when visible FAQ exists on page.
- [ ] Keep breadcrumb schema aligned to real URL path after redesign.

### Structured QA gates

- [ ] No schema parse errors in rich-result test sample set (top 20 cluster pages).
- [ ] No title/description mismatch between HTML head and on-page intent.
- [ ] No page with missing author/date/source metadata in trust block.

---

## 5) KPI Measurement Plan (14-day + 30-day)

### Measurement baseline window

- Baseline snapshot date: **May 16, 2026**
- Checkpoint 1: **May 30, 2026** (14-day)
- Checkpoint 2: **June 15, 2026** (30-day)

### KPI pack (must track all 5)

1. **Intent CTR uplift (GSC)**
   - Metric: CTR on redesigned calculator/article cluster pages
   - Target: +8% by day 14, +15% by day 30

2. **Calculator completion efficiency (GA4)**
   - Events: `calculator_start` -> `calculator_complete`
   - Target: completion rate +10% by day 30

3. **Cluster navigation depth (GA4)**
   - Events: `related_calc_click`, article CTA clicks (`data-entry-event`)
   - Target: average cluster clicks/session >= 1.4 by day 30

4. **Article-to-calculator assist rate (GA4)**
   - Definition: article sessions with at least one calculator CTA click
   - Target: +20% by day 30

5. **Trust interaction proxy (GA4 + page events)**
   - Proxy: clicks on source/trust links + result-view persistence events
   - Target: +12% by day 30

### Execution checklist

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/layouts/BlogPostLayout.astro`
- Modify: `src/pages/index.astro` (search interaction event)
- Optional: `src/pages/api/events.ts` (if server-side shadow logging is needed)

- [ ] Add explicit event for homepage search usage (`home_search_used`).
- [ ] Ensure all primary CTA buttons include `data-entry-event`, `data-entry-surface`, `data-placement`.
- [ ] Tag trust/source links with trackable event names (`trust_source_click`).
- [ ] Export day-14 and day-30 scorecards using same KPI definitions (no metric drift).

---

## Immediate Routing (CMO ownership)

- SEO Specialist:
  - Implement data-model + metadata/schema checklist (sections 3-4).
- Thai Content Specialist Alpha:
  - Apply microcopy set to top-priority redesign templates (section 2).
- CMO:
  - Approve intent mapping and final cluster routing before release.

---

## Delivery Marker

**SEO CLUSTER PLAN READY**

