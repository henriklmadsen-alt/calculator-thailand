#!/bin/bash

# CAL-750 Hourly Trust QA Smoke Test (Corrected Routes)
# Release QA Engineer Alpha

SITE="https://www.kamnuanlek.com"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
REPORT_FILE="reports/cal-750-smoke-verified-${TIMESTAMP}.md"

echo "# CAL-750 Hourly Trust QA Smoke Test — Production Verification" > "$REPORT_FILE"
echo "**Timestamp**: $TIMESTAMP (UTC)" >> "$REPORT_FILE"
echo "**Environment**: Production (www.kamnuanlek.com)" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Test Thai calculator routes (from homepage)
declare -a PAGES=(
  "/"
  "/คำนวณภาษีเงินได้บุคคลธรรมดา/"
  "/คำนวณผ่อนกู้/"
  "/คำนวณค่าไฟฟ้า/"
  "/คำนวณเงินเดือนสุทธิ/"
  "/คำนวณค่าธรรมเนียมโอนบ้าน/"
  "/คำนวณลดหย่อนบิดามารดา/"
  "/บทความ/"
  "/หมวดหมู่/ภาษี/"
)

echo "## HTTP Status Check" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

PASSED=0
FAILED=0
FAILED_PAGES=""

for page in "${PAGES[@]}"; do
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE$page")
  if [ "$RESPONSE" = "200" ]; then
    echo "✓ $SITE$page — HTTP $RESPONSE" >> "$REPORT_FILE"
    ((PASSED++))
  else
    echo "✗ $SITE$page — HTTP $RESPONSE" >> "$REPORT_FILE"
    FAILED_PAGES="$FAILED_PAGES\n- $page (HTTP $RESPONSE)"
    ((FAILED++))
  fi
done

echo "" >> "$REPORT_FILE"
if [ $FAILED -gt 0 ]; then
  echo "**Result: ❌ FAILED** — $PASSED passed, **$FAILED failed**" >> "$REPORT_FILE"
  echo -e "Failed pages:$FAILED_PAGES" >> "$REPORT_FILE"
else
  echo "**Result: ✅ PASSED** — All $PASSED pages returning HTTP 200" >> "$REPORT_FILE"
fi
echo "" >> "$REPORT_FILE"

# Calculator Smoke Test
echo "## Calculator Functionality Smoke Test" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Test income tax calculator (คำนวณภาษีเงินได้บุคคลธรรมดา)
CALC_PAGE=$(curl -s "$SITE/คำนวณภาษีเงินได้บุคคลธรรมดา/")
if echo "$CALC_PAGE" | grep -q "input" && echo "$CALC_PAGE" | grep -q "คำนวณ"; then
  echo "✓ Income tax calculator: Contains input fields and Thai text" >> "$REPORT_FILE"
else
  echo "⚠ Income tax calculator: May be missing interactive elements" >> "$REPORT_FILE"
fi

# Trust Signals
echo "" >> "$REPORT_FILE"
echo "## Trust & Content Verification" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

HOMEPAGE=$(curl -s "$SITE/")

# Thai content check
if echo "$HOMEPAGE" | grep -q "คำนวณ"; then
  echo "✓ Thai content rendering: Present" >> "$REPORT_FILE"
else
  echo "✗ Thai content rendering: MISSING" >> "$REPORT_FILE"
fi

# Page size check
HOMEPAGE_SIZE=$(echo -n "$HOMEPAGE" | wc -c)
if [ $HOMEPAGE_SIZE -gt 500000 ]; then
  echo "✓ Homepage size: ~$HOMEPAGE_SIZE bytes (healthy)" >> "$REPORT_FILE"
else
  echo "⚠ Homepage size: ~$HOMEPAGE_SIZE bytes (may indicate rendering issue)" >> "$REPORT_FILE"
fi

# Meta tag check
if echo "$HOMEPAGE" | grep -q "charset=utf-8"; then
  echo "✓ UTF-8 charset: Present" >> "$REPORT_FILE"
else
  echo "⚠ UTF-8 charset: Check needed" >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"
echo "## Summary" >> "$REPORT_FILE"
echo "- **Status**: $([ $FAILED -eq 0 ] && echo 'HEALTHY' || echo 'ISSUES DETECTED')" >> "$REPORT_FILE"
echo "- **Pages checked**: $((PASSED + FAILED))" >> "$REPORT_FILE"
echo "- **HTTP 200 rate**: $PASSED/$((PASSED + FAILED))" >> "$REPORT_FILE"
echo "- **Timestamp**: $TIMESTAMP (UTC)" >> "$REPORT_FILE"

cat "$REPORT_FILE"
echo ""
echo "Report saved to: $REPORT_FILE"
