#!/bin/bash

# Quick UX verification - trust signals, mobile, Thai coverage

echo "=== CAL-3394 UX VERIFICATION (2026-05-03) ==="
echo ""

# 1. Trust Signals Sample (30 random pages)
echo "## Trust Signals (30-page sample)"
echo ""

find dist -name "index.html" -type f | shuf | head -30 | while read file; do
  og=$(grep -c 'property="og:' "$file" 2>/dev/null || echo 0)
  viewport=$(grep -c 'viewport' "$file" 2>/dev/null || echo 0)
  canonical=$(grep -c 'rel="canonical"' "$file" 2>/dev/null || echo 0)
  schema=$(grep -c '"@context"' "$file" 2>/dev/null || echo 0)
  
  has_og=$([[ $og -gt 0 ]] && echo 1 || echo 0)
  has_viewport=$([[ $viewport -gt 0 ]] && echo 1 || echo 0)
  has_canonical=$([[ $canonical -gt 0 ]] && echo 1 || echo 0)
  has_schema=$([[ $schema -gt 0 ]] && echo 1 || echo 0)
  
  echo "$has_og $has_viewport $has_canonical $has_schema"
done | awk '{
  og_count += $1
  viewport_count += $2
  canonical_count += $3
  schema_count += $4
  count++
}
END {
  print "✓ OG tags: " int(og_count/count*100) "%"
  print "✓ Viewport: " int(viewport_count/count*100) "%"
  print "✓ Canonical: " int(canonical_count/count*100) "%"
  print "✓ Schema: " int(schema_count/count*100) "%"
}'

echo ""
echo "## Thai Coverage"
find dist -name "index.html" -type f | wc -l | awk '{print "✓ Total HTML files: " $1}'

find dist -path "*/ค*" -o -path "*/ต*" -o -path "*/ส*" | wc -l | awk '{print "✓ Thai-named directories: " $1}'

echo ""
echo "## Mobile-First Validation (10-page sample)"
find dist -name "index.html" -type f | shuf | head -10 | while read file; do
  viewport=$(grep 'name="viewport"' "$file" 2>/dev/null | grep -c 'width=device-width' || echo 0)
  echo "$viewport"
done | awk '{
  count++
  sum += $1
}
END {
  print "✓ Mobile viewport: " int(sum/count*100) "% (of 10 sample)"
}'

echo ""
echo "## Sitemap Health"
ls -lh dist/sitemap*.xml 2>/dev/null | awk '{print "✓ " $9 ": " $5}'

echo ""
echo "=== VERIFICATION COMPLETE ==="
