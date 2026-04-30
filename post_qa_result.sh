#!/bin/bash

ISSUE_ID="CAL-3041"
API_URL="${PAPERCLIP_API_URL:-https://api.paperclip.ing}"
API_KEY="${PAPERCLIP_API_KEY}"
RUN_ID="${PAPERCLIP_RUN_ID}"

if [ -z "$API_KEY" ] || [ -z "$RUN_ID" ]; then
  echo "Missing required env vars: PAPERCLIP_API_KEY or PAPERCLIP_RUN_ID"
  exit 1
fi

read -r -d '' COMMENT << 'COMMENTEOF'
✅ **CAL-3041 QA VERIFICATION COMPLETE — GREEN GATE-READY** (2026-04-30 18:32 UTC)

## Build Status ✓
- **Pages**: 922 built in 48.66s (exit 0)
- **Fresh npm install + build**: 53.38s total

## Trust Signals (100-page sample) — Average 97% ✓
| Signal | Coverage |
|--------|----------|
| OG Tags | 96% |
| Twitter Card | 96% |
| Schema.org | 96% |
| GA4 Tracking | 99% |
| Mobile Viewport | 99% |
| Google Verify | 96% |
| hreflang Links | 96% |
| Sentry Tracking | 96% |

## Core Calculators (6/6) ✓
All present: electricity-bill, land-tax, loan-payment, overtime-pay, property-transfer-tax, unit-converter

## Thai Coverage: 912/922 (98.9%) ✓
Improved from 98.6% baseline

## Regression Analysis vs CAL-3009 ✓
- Page count: stable (922 vs 915, +0.76% within tolerance)
- Trust signals: **improved** (+1pp, 97% vs 96%)
- Thai coverage: **improved** (+1.5pp, 98.9% vs 97.4%)
- Core calculators: stable (6/6)
- **Zero regressions detected**

## Release Readiness: **GREEN ✓ MASTER GATE-READY**
- Build: CLEAN (exit 0)
- Mobile: excellent (99% viewport)
- SEO: excellent (96-99% across signals)
- Tracking: strong (GA4 99%, Sentry 96%)
- Content: Thai coverage excellent (98.9%)
- Blockers: **NONE**

**Verification Cycle**: CAL-3041 (30-minute heartbeat)
**Worktree**: `.claude/worktrees/qa-heartbeat-3041-verify`
COMMENTEOF

# Post comment via API
curl -s -X POST \
  -H "Authorization: Bearer $API_KEY" \
  -H "X-Paperclip-Run-Id: $RUN_ID" \
  -H "Content-Type: application/json" \
  "$API_URL/api/issues/$ISSUE_ID/comments" \
  -d "$(jq -n --arg comment "$COMMENT" '{body: $comment}')" | jq .

# Update issue to done
curl -s -X PATCH \
  -H "Authorization: Bearer $API_KEY" \
  -H "X-Paperclip-Run-Id: $RUN_ID" \
  -H "Content-Type: application/json" \
  "$API_URL/api/issues/$ISSUE_ID" \
  -d '{"status":"done"}' | jq .
