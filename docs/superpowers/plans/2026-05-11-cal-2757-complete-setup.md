# CAL-2757 Complete Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Convert CAL-2757 from partial assets into active production wiring for schema, internal linking, tracking, and accessibility.

**Architecture:** Reuse existing stable components and globally shared layout hooks so rollout is broad and low-risk. Keep behavior backward-compatible by preserving existing template import paths while routing them through the new CAL-2757 component.

**Tech Stack:** Astro, TypeScript, Node.js verification script

---

### Task 1: Add failing integration guard

**Files:**
- Create: `scripts/test-cal-2757-setup.mjs`

- [x] Step 1: Write structural assertions for required wiring points.
- [x] Step 2: Run guard and confirm it fails before implementation.

### Task 2: Wire related calculators component into live path

**Files:**
- Modify: `src/components/RelatedCalculators.astro`
- Modify: `src/components/templates/RelatedCalculators.astro`

- [x] Step 1: Move production logic into `src/components/RelatedCalculators.astro`.
- [x] Step 2: Turn template path into a compatibility wrapper.
- [x] Step 3: Re-run guard.

### Task 3: Wire schema + tracking + accessibility in BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [x] Step 1: Add calculator schema emission for calculator pages.
- [x] Step 2: Initialize accessibility keyboard helpers globally.
- [x] Step 3: Bridge existing GA events to `src/lib/calculator-tracking.ts`.
- [x] Step 4: Re-run guard.

### Task 4: Full verification

**Files:**
- N/A

- [x] Step 1: Run `node scripts/test-cal-2757-setup.mjs` and confirm PASS.
- [x] Step 2: Run `npm run build` and confirm full build PASS.
