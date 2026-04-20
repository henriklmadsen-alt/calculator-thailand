# CAL-68 Priority 8-10 Calculator Route Activation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close live route gaps for CAL-68 priority clusters by shipping `/คำนวณภาษีที่ดิน/`, `/แปลงหน่วย/`, and `/คำนวณค่างวดบัตรเครดิต/` with source-backed logic and internal-link-safe page metadata.

**Architecture:** Add dedicated calculator logic in `src/lib` for land/building tax and unit conversion, covered by node test files. Expose each missing route with Astro pages using existing layout/components, and wire the installment route as a compatibility calculator entrypoint for credit-card debt intent.

**Tech Stack:** Astro, TypeScript, Node test runner (`node --test`), existing Calculator Thailand UI components.

---

### Task 1: Add Land Tax Calculation Core (TDD)

**Files:**
- Create: `src/lib/land-building-tax.ts`
- Test: `src/lib/land-building-tax.test.ts`

- [ ] **Step 1: Write failing tests for progressive tiers, exemption, and sample Thai-baht cases**
- [ ] **Step 2: Run `npm test -- src/lib/land-building-tax.test.ts` and confirm RED**
- [ ] **Step 3: Implement minimal progressive-tax engine + category presets**
- [ ] **Step 4: Re-run `npm test -- src/lib/land-building-tax.test.ts` and confirm GREEN**

### Task 2: Add Unit Conversion Core (TDD)

**Files:**
- Create: `src/lib/unit-conversion.ts`
- Test: `src/lib/unit-conversion.test.ts`

- [ ] **Step 1: Write failing tests for length, mass, and temperature conversions**
- [ ] **Step 2: Run `npm test -- src/lib/unit-conversion.test.ts` and confirm RED**
- [ ] **Step 3: Implement conversion maps + temperature formulas**
- [ ] **Step 4: Re-run `npm test -- src/lib/unit-conversion.test.ts` and confirm GREEN**

### Task 3: Ship Missing Calculator Routes

**Files:**
- Create: `src/pages/คำนวณภาษีที่ดิน/index.astro`
- Create: `src/pages/แปลงหน่วย/index.astro`
- Create: `src/pages/คำนวณค่างวดบัตรเครดิต/index.astro`

- [ ] **Step 1: Implement land-tax calculator page with Thai metadata, FAQ, source links, and article/related calculator links**
- [ ] **Step 2: Implement unit-conversion calculator page with Thai metadata, FAQ, source links, and article/related calculator links**
- [ ] **Step 3: Implement installment-route page as a credit-card-intent entrypoint mapped to existing debt calculation flow**

### Task 4: Verify Route/Build Integrity and Publish Artifact

**Files:**
- Create: `reports/seo/cal68-priority8-10-route-activation-2026-04-19.md`

- [ ] **Step 1: Run `npm test` and confirm all library tests pass**
- [ ] **Step 2: Run `npm run build` and confirm Astro build + public-content guard pass**
- [ ] **Step 3: Record shipped routes, source references, and verification outputs in a CAL-68 SEO report**
