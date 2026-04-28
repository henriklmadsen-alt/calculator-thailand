# CAL-398 Loan Payment Supporting Article Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship one high-quality Thai supporting article for the `/คำนวณผ่อนกู้/` cluster and wire intent-matching internal links.

**Architecture:** Add one new Astro article page using `BlogPostLayout` + `ArticleCalculatorCTA`, then add reciprocal links from calculator pages and article hub. Keep formulas numerically aligned with `src/lib/loan-calculator.ts` and include explicit source references.

**Tech Stack:** Astro, TypeScript, existing content components (`BlogPostLayout`, `ArticleCalculatorCTA`)

---

### Task 1: Create supporting article page

**Files:**
- Create: `src/pages/บทความ/คำนวณผ่อนกู้-2569-วิธีคิดค่างวดลดต้นลดดอก-vs-คงที่/index.astro`

- [ ] **Step 1: Add page scaffold with metadata, canonical, FAQ, and CTA**
- [ ] **Step 2: Add calculator-intent sections (decision workflow, worked examples, risk checks)**
- [ ] **Step 3: Add formula/source section with BOT references and link to calculator logic parity**

### Task 2: Internal-link package

**Files:**
- Modify: `src/pages/คำนวณผ่อนกู้/index.astro`
- Modify: `src/pages/คำนวณผ่อนรถ/index.astro`
- Modify: `src/pages/คำนวณผ่อนบ้าน/index.astro`
- Modify: `src/pages/บทความ/index.astro`

- [ ] **Step 1: Add prominent “อ่านต่อ” link from `/คำนวณผ่อนกู้/` to new article**
- [ ] **Step 2: Add cluster-support links from `/คำนวณผ่อนรถ/` and `/คำนวณผ่อนบ้าน/` to new article**
- [ ] **Step 3: Add article card entry in article hub list**

### Task 3: Verify and evidence

**Files:**
- Create: `reports/cal-398-loan-payment-supporting-article-package-2026-04-19.md`

- [ ] **Step 1: Run `npm run build` and capture outcome**
- [ ] **Step 2: Write evidence report with file list, internal links, formula-source mapping, and build result**
