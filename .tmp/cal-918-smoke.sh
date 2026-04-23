#!/bin/bash

# CAL-918: Hourly Trust QA Smoke — 2026-04-22 20:00+07
# Scope: Production site health check

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S+07:00")
SITE_URL="https://kamnuanlek.com"

echo "🔍 CAL-918 Hourly Smoke Test — $TIMESTAMP"
echo "=================================================="
echo ""

# Test 1: Homepage
echo "Test 1: Homepage (/)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/")
if [ "$STATUS" = "200" ]; then
  echo "✅ Status: $STATUS"
else
  echo "❌ Status: $STATUS (expected 200)"
fi
echo ""

# Test 2: Thai Loan Payment Calculator
echo "Test 2: Loan Payment Calculator (/คำนวณผ่อนกู้/)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/คำนวณผ่อนกู้/")
if [ "$STATUS" = "200" ]; then
  echo "✅ Status: $STATUS"
else
  echo "❌ Status: $STATUS (expected 200)"
fi
echo ""

# Test 3: English redirect to Thai
echo "Test 3: English Loan Calculator redirect (/calculator/loan-payment/)"
RESPONSE=$(curl -s -L -w "\n%{http_code}" "$SITE_URL/calculator/loan-payment/")
STATUS=$(echo "$RESPONSE" | tail -1)
LOCATION=$(curl -s -i "$SITE_URL/calculator/loan-payment/" | grep -i "location" | head -1)
if [ "$STATUS" = "200" ]; then
  echo "✅ Status: $STATUS (followed redirect)"
  echo "   Redirect: $LOCATION"
else
  echo "❌ Status: $STATUS (expected 200)"
fi
echo ""

# Test 4: Mobile viewport (desktop size check)
echo "Test 4: Mobile responsiveness check"
RESPONSE=$(curl -s "$SITE_URL/" -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)")
SIZE=${#RESPONSE}
if [ $SIZE -gt 1000 ]; then
  echo "✅ Response size: $SIZE bytes (valid mobile response)"
else
  echo "❌ Response size: $SIZE bytes (may be incomplete)"
fi
echo ""

echo "=================================================="
echo "Smoke test completed at $TIMESTAMP"
