#!/bin/bash

echo "========== TRUST SIGNAL VERIFICATION CAL-2487 =========="
echo ""

# 1. Schema markup count (all @type instances)
SCHEMA_COUNT=$(grep -r '"@type"' dist/ --include="*.html" 2>/dev/null | wc -l)
echo "Schema @type instances: $SCHEMA_COUNT"

# 2. Open Graph coverage
OG_TOTAL=$(grep -r 'property="og:' dist/ --include="*.html" 2>/dev/null | wc -l)
OG_TITLE=$(grep -r 'property="og:title"' dist/ --include="*.html" 2>/dev/null | wc -l)
echo "Open Graph: $OG_TOTAL instances (og:title: $OG_TITLE)"

# 3. Twitter Card coverage
TWITTER=$(grep -r 'name="twitter:' dist/ --include="*.html" 2>/dev/null | wc -l)
echo "Twitter Card: $TWITTER instances"

# 4. Mobile viewport
VIEWPORT=$(grep -r 'name="viewport"' dist/ --include="*.html" 2>/dev/null | wc -l)
echo "Mobile viewport: $VIEWPORT pages"

# 5. Phase 2 UX verification (Article, BreadcrumbList, FAQPage schemas)
ARTICLE=$(grep -r '"@type".*"Article"' dist/ --include="*.html" 2>/dev/null | wc -l)
BREADCRUMB=$(grep -r '"@type".*"BreadcrumbList"' dist/ --include="*.html" 2>/dev/null | wc -l)
FAQPAGE=$(grep -r '"@type".*"FAQPage"' dist/ --include="*.html" 2>/dev/null | wc -l)
HOWTO=$(grep -r '"@type".*"HowToStep"' dist/ --include="*.html" 2>/dev/null | wc -l)
echo ""
echo "Phase 2 UX Schema Breakdown:"
echo "  Article: $ARTICLE instances"
echo "  BreadcrumbList: $BREADCRUMB instances"
echo "  FAQPage: $FAQPAGE instances"
echo "  HowToStep: $HOWTO instances"

# 6. Core calculators check
CALCS=("bmi" "income-tax" "simple-interest" "compound-interest" "loan-calculator" "property-transfer-tax")
echo ""
echo "Core Calculators Present:"
for calc in "${CALCS[@]}"; do
  if [ -f "dist/calculator/$calc/index.html" ]; then
    echo "  ✓ $calc"
  else
    echo "  ✗ $calc MISSING"
  fi
done

# 7. Articles directory count
ARTICLES=$(find dist/บทความ -name "index.html" 2>/dev/null | wc -l)
echo ""
echo "Article pages: $ARTICLES directories"

# 8. Trust signals (GA4, Sentry, Google verify)
GA4=$(grep -r "G-EY67HJ8NDD" dist/ --include="*.html" 2>/dev/null | wc -l)
SENTRY=$(grep -r "sentry" dist/ --include="*.html" 2>/dev/null | wc -l)
GOOGLE_VERIFY=$(grep -r "google-site-verification" dist/ --include="*.html" 2>/dev/null | wc -l)
echo ""
echo "Trust Signals:"
echo "  GA4 (G-EY67HJ8NDD): $GA4 pages"
echo "  Sentry: $SENTRY pages"
echo "  Google verification: $GOOGLE_VERIFY pages"

echo ""
echo "========== END VERIFICATION =========="
