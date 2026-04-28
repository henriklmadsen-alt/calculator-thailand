# CAL-409 VAT 7% SERP/Source/Internal-link Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh VAT 7% calculator-support content to improve SERP intent match, trust signals, and internal-link flow.

**Architecture:** Update the VAT calculator page and its supporting article in-place. Keep formulas aligned with current calculator logic (`VAT_RATE = 0.07`) and add explicit Thai official references for all formula-bearing policy statements. Add contextual internal links in-body (not only footer/related cards).

**Tech Stack:** Astro content pages, existing layout components, static internal links, markdown-like article sections in `.astro`.

---

### Task 1: Refresh VAT calculator-page SERP copy + trust/source section

**Files:**
- Modify: `src/pages/คำนวณภาษีมูลค่าเพิ่ม/index.astro`

- [ ] **Step 1: Update title/description and FAQ wording for clearer VAT intent keywords**
- [ ] **Step 2: Add an explicit formula-trust section that maps to calculator logic**
- [ ] **Step 3: Add official-source links for VAT rate/registration threshold/exemption context**
- [ ] **Step 4: Add contextual in-body internal links to VAT supporting article + related calculators**

### Task 2: Refresh VAT supporting article for source-backed formulas + internal links

**Files:**
- Modify: `src/pages/บทความ/ภาษีมูลค่าเพิ่ม-7-คิดยังไง-สูตรบวกภาษี-ถอดภาษี-ตั้งราคาขายให้ไม่ขาดทุน/index.astro`

- [ ] **Step 1: Tighten SERP-facing title/description while preserving intent**
- [ ] **Step 2: Add formula/source mapping section with Thai official references**
- [ ] **Step 3: Expand contextual internal links for next-step calculators/articles**
- [ ] **Step 4: Keep examples numerically consistent with VAT 7% logic**

### Task 3: Publish evidence and verify build

**Files:**
- Create: `reports/cal-409-vat-7-serp-copy-source-internal-link-refresh-2026-04-19.md`

- [ ] **Step 1: Document metadata summary, source URLs, and internal-link additions**
- [ ] **Step 2: Run build verification (`npm run build`)**
- [ ] **Step 3: Record build result and final file-change list**
