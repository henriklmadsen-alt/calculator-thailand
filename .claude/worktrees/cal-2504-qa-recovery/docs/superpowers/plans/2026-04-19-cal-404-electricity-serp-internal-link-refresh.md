# CAL-404 Electricity SERP Copy + Internal-Link Refresh Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve electricity cluster CTR/readability by refreshing SERP-facing copy and strengthening calculator-intent internal links.

**Architecture:** Update metadata and lead copy on the electricity article and calculator pages, then refresh article-hub snippet text to keep internal-link anchors and intent messaging consistent.

**Tech Stack:** Astro content pages, existing `BlogPostLayout` and `BaseLayout`

---

### Task 1: Electricity article SERP refresh

**Files:**
- Modify: `src/pages/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/index.astro`

- [ ] **Step 1: Update title/description/H1 for high-intent SERP phrasing**
- [ ] **Step 2: Refresh supporting intro copy without changing formula logic**
- [ ] **Step 3: Refresh internal-link block wording and anchors**

### Task 2: Electricity calculator copy + links refresh

**Files:**
- Modify: `src/pages/คำนวณค่าไฟฟ้า/index.astro`

- [ ] **Step 1: Update calculator title/description and lead copy for CTR**
- [ ] **Step 2: Refresh article CTA and related-link card labels for cluster flow**

### Task 3: Article hub alignment + evidence

**Files:**
- Modify: `src/pages/บทความ/index.astro`
- Create: `reports/cal-404-electricity-serp-copy-and-internal-link-refresh-2026-04-19.md`

- [ ] **Step 1: Update electricity article card description in article hub**
- [ ] **Step 2: Run `npm run build` and capture outcome**
- [ ] **Step 3: Write evidence report (copy updates, links updated, formula-source integrity)**
