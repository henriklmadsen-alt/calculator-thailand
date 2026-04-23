#!/bin/bash

# CAL-750 Hourly Trust QA Smoke Test — 2026-04-21 11:00+07
# Release QA Engineer Alpha

SITE="https://www.kamnuanlek.com"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
REPORT_FILE="reports/cal-750-smoke-${TIMESTAMP}.md"

echo "# CAL-750 Hourly Trust QA Smoke Test" > "$REPORT_FILE"
echo "**Timestamp**: $TIMESTAMP (UTC)" >> "$REPORT_FILE"
echo "**Environment**: Production (www.kamnuanlek.com)" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Test pages
declare -a PAGES=(
  "/"
  "/calculators/age/"
  "/calculators/bmi/"
  "/calculators/electricity/"
  "/calculators/loan/"
  "/calculators/savings/"
  "/calculators/unit/"
  "/calculators/overtime/"
  "/calculators/land-tax/"
)

echo "## HTTP Status Check" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

PASSED=0
FAILED=0

for page in "${PAGES[@]}"; do
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE$page")
  if [ "$RESPONSE" = "200" ]; then
    echo "✓ $SITE$page — HTTP $RESPONSE" >> "$REPORT_FILE"
    ((PASSED++))
  else
    echo "✗ $SITE$page — HTTP $RESPONSE" >> "$REPORT_FILE"
    ((FAILED++))
  fi
done

echo "" >> "$REPORT_FILE"
echo "**Summary**: $PASSED passed, $FAILED failed" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Mobile Check (sample)
echo "## Mobile Responsiveness Check (sample)" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

MOBILE_UA="Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15"
for page in "/" "/calculators/bmi/"; do
  CONTENT_TYPE=$(curl -s -A "$MOBILE_UA" -I "$SITE$page" | grep -i "content-type" | cut -d: -f2 | xargs)
  echo "- $SITE$page (Mobile): Content-Type = $CONTENT_TYPE" >> "$REPORT_FILE"
done

echo "" >> "$REPORT_FILE"

# Trust Signals Check
echo "## Trust Signal Verification" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Check for common trust issues (200KB response, no 5xx errors)
HOMEPAGE=$(curl -s "$SITE/")
if [ ${#HOMEPAGE} -gt 10000 ]; then
  echo "✓ Homepage loads with full content (~$(echo -n "$HOMEPAGE" | wc -c) bytes)" >> "$REPORT_FILE"
else
  echo "⚠ Homepage undersized (~$(echo -n "$HOMEPAGE" | wc -c) bytes) — may indicate rendering issue" >> "$REPORT_FILE"
fi

# Check for Thai content rendering
if echo "$HOMEPAGE" | grep -q "คำนวณ"; then
  echo "✓ Thai content rendering (found Thai characters)" >> "$REPORT_FILE"
else
  echo "✗ Thai content missing or not rendering correctly" >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"
echo "## Report Generated" >> "$REPORT_FILE"
echo "Smoke test completed at $TIMESTAMP" >> "$REPORT_FILE"

cat "$REPORT_FILE"
