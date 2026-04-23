#!/bin/bash

# Aggressive monitoring for CAL-918 — Check every 30 seconds for cert propagation
# Runs for up to 5 minutes (300 seconds)

echo "🚀 CAL-918 Aggressive Monitoring — Cert Propagation Wait"
echo "Checking every 30 seconds (max 5 minutes)"
echo ""

ELAPSED=0
MAX_ELAPSED=300  # 5 minutes
CHECK_INTERVAL=30

while [ $ELAPSED -lt $MAX_ELAPSED ]; do
  ELAPSED=$((ELAPSED + CHECK_INTERVAL))

  echo "[$(date +'%H:%M:%S')] Attempt $((ELAPSED / CHECK_INTERVAL))/10 — Testing kamnuanlek.com..."

  # Test HTTPS connectivity and cert
  RESPONSE=$(curl -s -i -w "\n%{http_code}" "https://kamnuanlek.com/" 2>&1)
  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  CERT_INFO=$(echo "$RESPONSE" | grep -i "CN=" | head -1)

  echo "  HTTP Status: $HTTP_CODE"

  if [ "$HTTP_CODE" = "200" ]; then
    echo ""
    echo "✅ SUCCESS — kamnuanlek.com now returning HTTP 200"
    echo "  Certificate verification passed"
    echo ""
    echo "🧪 Running full smoke test..."
    echo ""

    # Full smoke test
    declare -a TESTS=(
      "https://kamnuanlek.com/|Homepage"
      "https://kamnuanlek.com/คำนวณผ่อนกู้/|Loan Calculator"
      "https://kamnuanlek.com/คำนวณภาษีเงินได้บุคคลธรรมดา/|Income Tax Calculator"
      "https://kamnuanlek.com/calculator/loan-payment/|English Loan Redirect"
    )

    ALL_PASS=true
    for test in "${TESTS[@]}"; do
      URL="${test%|*}"
      NAME="${test#*|}"
      CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
      if [ "$CODE" = "200" ]; then
        echo "  ✅ $NAME: HTTP $CODE"
      else
        echo "  ❌ $NAME: HTTP $CODE"
        ALL_PASS=false
      fi
    done

    echo ""
    if [ "$ALL_PASS" = true ]; then
      echo "✅ ALL SMOKE TESTS PASSED — CAL-918 can be marked DONE"
      exit 0
    else
      echo "⚠️  Some tests failed — check calculator pages"
      exit 1
    fi
  fi

  if [ $ELAPSED -lt $MAX_ELAPSED ]; then
    echo "  Waiting ${CHECK_INTERVAL}s... ($(( (MAX_ELAPSED - ELAPSED) / 60 ))m $(( (MAX_ELAPSED - ELAPSED) % 60 ))s remaining)"
    sleep $CHECK_INTERVAL
  fi
done

echo ""
echo "⏱️  Timeout: Certificate did not propagate within 5 minutes"
echo "Last status: HTTP $HTTP_CODE"
echo "Escalating: Board may not have completed the Railway custom domain action"
