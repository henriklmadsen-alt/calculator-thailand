# CAL-278 Homepage Calculator-Link Compliance Patch (2026-04-19)

Reporting manager: CMO  
Issue lane: [CAL-68](/CAL/issues/CAL-68)

## Why this action

Per lane guidance, continue CAL-68 user-facing work not blocked by CAL-131/CAL-260/CAL-275.
This patch targeted internal-link completeness from homepage (no orphan calculator paths within 2 clicks).

## Problem found

- After `/คำนวณวันคลอด/` route activation, homepage (`/`) did not link to this calculator.
- That created a discoverability gap against the lane rule requiring homepage coverage for calculator inventory.

## What shipped

- Added due-date calculator quick-start chip on homepage
- Added due-date calculator card in the homepage calculator grid

Changed file:
- `src/pages/index.astro`

## Evidence

Command:

```bash
rg -n "/คำนวณวันคลอด/" src/pages/index.astro -S
npm run build
```

Observed:

- Homepage now contains `/คำนวณวันคลอด/` in both quick-start and grid sections
- Build passes and route inventory includes `/คำนวณวันคลอด/index.html`
- Public content guard passes

## Non-blocked scope confirmation

This patch does not depend on:
- CAL-131 unit-converter build route
- CAL-260
- CAL-275

It is a direct CAL-68 user-facing SEO/internal-link output.
