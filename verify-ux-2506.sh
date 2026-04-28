#!/bin/bash

# UX Heartbeat CAL-2506 Trust Signal Verification

dist_dir="dist"
pages=$(find "$dist_dir" -name "index.html" | wc -l)

echo "=== CAL-2506 UX HEARTBEAT TRUST SIGNAL VERIFICATION ==="
echo "Total pages: $pages"
echo ""

# Schema markup check
schema_count=$(grep -r "@type" "$dist_dir" 2>/dev/null | wc -l)
echo "✓ Schema @type instances: $schema_count"

# OG meta tags check
og_pages=$(find "$dist_dir" -name "index.html" -exec grep -l "property=\"og:" {} \; | wc -l)
echo "✓ OG meta tags: $og_pages pages"

# Twitter Card check
twitter_pages=$(find "$dist_dir" -name "index.html" -exec grep -l "name=\"twitter:" {} \; | wc -l)
echo "✓ Twitter Card: $twitter_pages pages"

# Mobile viewport check
viewport_pages=$(find "$dist_dir" -name "index.html" -exec grep -l "viewport" {} \; | wc -l)
echo "✓ Mobile viewport: $viewport_pages pages"

# Sample page verification (BMI calculator)
echo ""
echo "=== SAMPLE PAGE VERIFICATION (BMI CALCULATOR) ==="
sample="$dist_dir/calculator/bmi/index.html"
if [ -f "$sample" ]; then
  echo "✓ BMI calculator found"
  schema_sample=$(grep -c "@type" "$sample" || echo "0")
  og_sample=$(grep -c 'property="og:' "$sample" || echo "0")
  twitter_sample=$(grep -c 'name="twitter:' "$sample" || echo "0")
  echo "  - Schema types: $schema_sample"
  echo "  - OG fields: $og_sample"
  echo "  - Twitter fields: $twitter_sample"
fi

# Core calculators check
echo ""
echo "=== CORE CALCULATORS VERIFICATION ==="
calculators=("bmi" "electricity-bill" "loan-payment" "overtime-pay" "land-tax" "property-transfer-tax")
for calc in "${calculators[@]}"; do
  if [ -f "$dist_dir/calculator/$calc/index.html" ]; then
    echo "✓ $calc"
  else
    echo "✗ $calc MISSING"
  fi
done

# Articles check
echo ""
echo "=== ARTICLES CHECK ==="
article_dirs=$(find "$dist_dir/บทความ" -type d -mindepth 1 | wc -l)
echo "✓ Article directories: $article_dirs"

# Categories check
echo ""
echo "=== CATEGORIES CHECK ==="
category_dirs=$(find "$dist_dir/หมวดหมู่" -type d -mindepth 1 | wc -l)
echo "✓ Category directories: $category_dirs"

# Sitemaps check
echo ""
echo "=== SITEMAPS CHECK ==="
[ -f "$dist_dir/sitemap-0.xml" ] && echo "✓ sitemap-0.xml ($(wc -c < $dist_dir/sitemap-0.xml | numfmt --to=iec 2>/dev/null || wc -c < $dist_dir/sitemap-0.xml) bytes)"
[ -f "$dist_dir/sitemap-index.xml" ] && echo "✓ sitemap-index.xml"
[ -f "$dist_dir/sitemap.xml" ] && echo "✓ sitemap.xml alias"

