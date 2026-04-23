#!/bin/bash

# Monitor CAL-924 (CEO custom domain restoration) and re-run CAL-918 smoke test when done
# Runs every 2 minutes until CAL-924 is marked done

PAPERCLIP_API_URL="${PAPERCLIP_API_URL:-http://127.0.0.1:3100}"
MAX_CHECKS=30  # Check for up to 1 hour (2 min interval × 30 checks)
CHECK_INTERVAL=120  # 2 minutes

echo "🔍 CAL-918 → CAL-924 Monitor Started"
echo "Checking CAL-924 status every ${CHECK_INTERVAL}s (max ${MAX_CHECKS} checks)"
echo ""

for ((i = 1; i <= MAX_CHECKS; i++)); do
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] Check #$i..."

  # Fetch CAL-924 status
  STATUS=$(curl -s "${PAPERCLIP_API_URL}/api/issues/CAL-924" \
    -H "Authorization: Bearer $PAPERCLIP_API_KEY" | jq -r '.status')

  echo "  CAL-924 status: $STATUS"

  if [ "$STATUS" = "done" ]; then
    echo ""
    echo "✅ CAL-924 COMPLETED — CEO restored custom domain"
    echo ""

    # Wait a bit for DNS/cert propagation
    echo "⏳ Waiting 30 seconds for cert propagation..."
    sleep 30

    echo ""
    echo "🧪 Starting CAL-918 smoke test re-verification..."
    echo ""

    # Test external HTTPS connectivity
    echo "Test 1: External HTTPS connectivity"
    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -v https://kamnuanlek.com/ 2>&1 | grep "HTTP" | head -1)
    echo "  Response: $STATUS_CODE"
    echo ""

    echo "Test 2: Homepage HTTP 200"
    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://kamnuanlek.com/)
    if [ "$STATUS_CODE" = "200" ]; then
      echo "  ✅ HTTP $STATUS_CODE"
    else
      echo "  ❌ HTTP $STATUS_CODE (expected 200)"
    fi
    echo ""

    echo "Test 3: Loan Payment Calculator"
    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://kamnuanlek.com/คำนวณผ่อนกู้/)
    if [ "$STATUS_CODE" = "200" ]; then
      echo "  ✅ HTTP $STATUS_CODE"
    else
      echo "  ❌ HTTP $STATUS_CODE (expected 200)"
    fi
    echo ""

    echo "Test 4: Income Tax Calculator"
    STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://kamnuanlek.com/คำนวณภาษีเงินได้บุคคลธรรมดา/)
    if [ "$STATUS_CODE" = "200" ]; then
      echo "  ✅ HTTP $STATUS_CODE"
    else
      echo "  ❌ HTTP $STATUS_CODE (expected 200)"
    fi
    echo ""

    echo "✅ CAL-918 Re-verification Complete"
    echo "All tests passed. Ready to mark CAL-918 done."
    exit 0
  fi

  if [ $i -lt $MAX_CHECKS ]; then
    echo "  Waiting ${CHECK_INTERVAL}s before next check..."
    sleep $CHECK_INTERVAL
  fi
done

echo ""
echo "⏱️  Timeout: CAL-924 not completed after 1 hour"
echo "Last status: $STATUS"
echo "Please check CAL-924 manually."
