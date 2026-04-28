#!/bin/bash
echo "# CAL-657: Hourly Custom-Domain Trust Smoke Check — 2026-04-21"
echo "**Test Time:** $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo ""
echo "## Route Health Matrix"
echo ""
echo "| Route | HTTP Status | Result | Notes |"
echo "|-------|-------------|--------|-------|"

# Test critical routes
test_route() {
  local route="$1"
  local description="$2"
  local status=$(curl -s -m 10 -o /dev/null -w "%{http_code}" "https://www.kamnuanlek.com$route" 2>/dev/null || echo "000")
  
  if [ "$status" = "200" ]; then
    echo "| $route | $status | ✅ PASS | $description |"
    return 0
  else
    echo "| $route | $status | ❌ FAIL | $description |"
    return 1
  fi
}

# Run tests
test_route "/" "Homepage"
test_route "/คำนวณค่าโอนบ้าน/" "Property transfer tax"
test_route "/คำนวณภาษีที่ดิน/" "Land tax calculator"
test_route "/คำนวณค่าไฟฟ้า/" "Electricity calculator"
test_route "/คำนวณพื้นที่/" "Area converter"

echo ""
echo "## Apex Domain Test"
echo "Testing apex redirect: kamnuanlek.com → www"
apex_status=$(curl -s -m 10 -o /dev/null -w "%{http_code}" -L "https://kamnuanlek.com/" 2>/dev/null || echo "000")
echo "| kamnuanlek.com (apex) | $apex_status | Apex HTTPS redirect test | Known issue - no SSL cert |"
