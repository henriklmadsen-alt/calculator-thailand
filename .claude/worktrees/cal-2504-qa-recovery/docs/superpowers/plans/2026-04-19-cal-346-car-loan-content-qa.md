# CAL-346 Car Loan Content QA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete source-side Thai QA refresh for the car-loan article cluster, ensuring intent fit, internal-link quality, and formula-source compliance.

**Architecture:** Work directly in the Thai car-loan article source and supporting evidence report. Keep changes minimal and targeted to ranking/trust signals: precise copy refinements, explicit official source attribution, and clear cluster links.

**Tech Stack:** Astro content pages (`.astro`), markdown QA evidence report, npm verification script.

---

### Task 1: Baseline QA Scan

**Files:**
- Modify: `src/pages/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/index.astro`
- Test: `npm run verify:public-content`

- [ ] **Step 1: Validate intent + link baseline**

Run:

```bash
rg -n "คำนวณผ่อนรถ|ค่างวดรถยนต์|บทความที่เกี่ยวข้อง|เครื่องมือที่เกี่ยวข้อง|href=\"/คำนวณผ่อนรถ/\"" src/pages/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/index.astro -S
```

Expected: article has clear calculator intent and internal links.

- [ ] **Step 2: Validate formula-source compliance baseline**

Run:

```bash
rg -n "แหล่งข้อมูลทางการ|ธนาคารแห่งประเทศไทย|bot.or.th|สูตรคำนวณ" src/pages/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/index.astro -S
```

Expected: identify whether formula claims currently have explicit source citation.

### Task 2: Source-Side Content Refresh

**Files:**
- Modify: `src/pages/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/index.astro`

- [ ] **Step 1: Refine primary metadata wording for Thai intent clarity**

Update title/description copy only if needed for clearer `คำนวณผ่อนรถ` + `ค่างวดรถ` matching and readability.

- [ ] **Step 2: Add explicit official-source section for formula context**

Add `แหล่งข้อมูลทางการ` section with BOT links relevant to flat/effective rate interpretation in Thai auto-loan context.

- [ ] **Step 3: Preserve and tighten internal-link cluster**

Keep or improve links to:
- `/คำนวณผ่อนรถ/`
- `/คำนวณผ่อนบ้าน/`
- `/คำนวณผ่อนกู้/`
- related supporting articles.

### Task 3: Verification + Evidence Pack

**Files:**
- Create: `reports/seo/cal-346-car-loan-cluster-qa-2026-04-19.md`
- Test: `npm run verify:public-content`

- [ ] **Step 1: Run verification command**

Run:

```bash
npm run verify:public-content
```

Expected: script passes and confirms route/content integrity.

- [ ] **Step 2: Capture concrete evidence**

Record:
- changed file list (or explicit no-change conclusion),
- formula source links used,
- internal-link targets confirmed,
- verification command result.

- [ ] **Step 3: Commit**

```bash
git add src/pages/บทความ/คำนวณ-ค่างวดรถยนต์-2569-ผ่อนเท่าไร/index.astro reports/seo/cal-346-car-loan-cluster-qa-2026-04-19.md docs/superpowers/plans/2026-04-19-cal-346-car-loan-content-qa.md
git commit -m "docs(seo): complete CAL-346 car-loan content and internal-link QA"
```
