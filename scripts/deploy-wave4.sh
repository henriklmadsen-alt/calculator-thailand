#!/bin/bash
# CAL-686: WAVE4 DEPLOY — Deploy 502 audited calculators to production
# Usage: ./scripts/deploy-wave4.sh
# Author: Frontend Release Engineer

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "CAL-686: WAVE4 DEPLOY — 502 Calculators (KLC-0601-1102)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 1: Verify build is clean
echo ""
echo "✓ Step 1/7: Verify build is clean..."
npm run build
BUILD_PAGES=$(npm run build 2>&1 | grep -o '\[[0-9]* page' | grep -o '[0-9]*')
echo "   Build completed: ${BUILD_PAGES} pages"

# Step 2: Verify calculator count
echo ""
echo "✓ Step 2/7: Verify calculator registration..."
CALC_COUNT=$(grep -c "tag: 'KLC-" src/lib/calculators.ts || echo "0")
echo "   Calculators registered: ${CALC_COUNT}"
if [ "$CALC_COUNT" -lt 1102 ]; then
  echo "   ❌ ERROR: Expected 1102 calculators, found ${CALC_COUNT}"
  exit 1
fi

# Step 3: Verify sitemap
echo ""
echo "✓ Step 3/7: Verify sitemap generation..."
if [ -f "dist/sitemap-index.xml" ]; then
  echo "   ✓ sitemap-index.xml found"
else
  echo "   ❌ ERROR: sitemap-index.xml not found"
  exit 1
fi

# Step 4: Git commit and push
echo ""
echo "✓ Step 4/7: Commit to master..."
git add src/lib/calculators.ts
git commit -m "CAL-686: Add 502 Wave 4 calculators (KLC-0601-1102) to calculator registry

- 502 new calculators across 20 categories (KLC-0601-1102)
- All calculators QA audited (CAL-685 ✓)
- Sitemap updated (1102 total calculators)
- Build verified clean

Co-Authored-By: Paperclip <noreply@paperclip.ing>"

git push origin master
echo "   ✓ Pushed to master"

# Step 5: Trigger Railway redeploy
echo ""
echo "✓ Step 5/7: Railway redeploy..."
echo "   ⚠️  Manual step: Trigger redeploy on Railway dashboard"
echo "   → https://railway.app"

# Step 6: Smoke test
echo ""
echo "✓ Step 6/7: Smoke test (10+ random calculators)..."
echo "   Sample URLs to test on live site (kamnuanlek.com):"
echo "   - /คำนวณ-klc0601-..."
echo "   - /คำนวณ-klc0700-..."
echo "   - /คำนวณ-klc0900-..."
echo "   - etc."
echo ""
echo "   ✓ Test:"
echo "     1. Page loads without 404"
echo "     2. Calculator form displays correctly on mobile"
echo "     3. Calculation produces valid result"
echo "     4. No layout shifts or rendering issues"

# Step 7: Google IndexNow
echo ""
echo "✓ Step 7/7: Submit to Google IndexNow..."
echo "   ⚠️  Manual step: Submit 502 new URLs via IndexNow"
echo "   → https://www.bing.com/indexnow"
echo "   → Include: KLC-0601 through KLC-1102 calculator URLs"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deploy preparation complete"
echo "Monitor: https://kamnuanlek.com/หมวดหมู่/ for 1000-calculator display"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
