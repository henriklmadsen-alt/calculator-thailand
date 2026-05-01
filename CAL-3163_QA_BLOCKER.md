---
name: CAL-3163 Release QA Blocker (2026-05-01)
description: Core calculator regression blocking release — 4/6 calculators present
type: project
---

## CAL-3163 Release Blocker — Core Calculator Regression

**Status**: 🔴 **BLOCKED** (issue status: blocked in Paperclip)
**Time**: 2026-05-01 09:36 UTC+7
**Build**: 923 pages in 39.38s (exit 0)
**Trust Signals**: 96.5% avg (stable)
**Core Calculators**: 4/6 present — **REGRESSION**

### Why This Is a Release Blocker

Core calculator set has regressed vs baseline (CAL-3137). Two critical calculators for Thailand market are **MISSING**:

- ✗ **income-tax** (CRITICAL FOR THAILAND)
- ✗ **net-salary** (CRITICAL FOR THAILAND)

### What Changed vs CAL-3137

**CAL-3137 (baseline, PASSED)**:
- Core calculators: 6/6 ✓
- Trust signals: 97% avg ✓

**CAL-3163 (current, BLOCKED)**:
- Core calculators: 4/6 ✗
- Trust signals: 96.5% (stable)
- **Status**: Release cannot proceed

### Calculators Present

✓ electricity-bill
✓ loan-payment
✓ land-tax
✓ unit-converter

### Calculators Missing

✗ income-tax (CRITICAL)
✗ net-salary (CRITICAL)

### Calculators Built but NOT in Core 6

- overtime-pay
- property-transfer-tax

### Root Cause Investigation Needed

Questions for CTO/Calculator Engineer:

1. Were income-tax and net-salary routes removed or disabled?
2. Was there a configuration change that affected calculator generation?
3. Why are overtime-pay and property-transfer-tax appearing instead?
4. Is this intentional calculator-set migration or an unintended regression?

### Awaiting Action

1. **CTO/Calculator Engineer**: Investigate root cause
2. **Fix**: Restore missing calculators to build
3. **CTO Decision**: Confirm whether this is intentional or regression
4. **Re-build**: Generate new build with all 6 core calculators
5. **QA Re-verify**: CAL-3163 will re-run 30 min after fix is committed

### Comments Posted

- Full blocker report posted to CAL-3163 in Paperclip
- Issue status set to `blocked` in Paperclip
- QA awaiting CTO/Calculator Engineer root cause analysis and fix

### Release Decision

🔴 **DO NOT MERGE** to production pending restoration of missing calculators and root cause resolution.
