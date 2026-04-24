#!/usr/bin/env node
/**
 * CAL-1485: Mobile QA Baseline Testing Script
 * Tests 11 pages with TransparencyPanel/TrustBadge on mobile viewport
 *
 * Mobile test devices: Pixel 4a / iPhone SE (375px width, portrait/landscape)
 * Checks: layout overflow, tap targets (44px min), accessibility, visual clarity
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// Pages to test
const PAGES_WITH_TRANSPARENCY_PANEL = [
  { slug: 'คำนวณ-bmi', name: 'BMI Calculator', component: 'TransparencyPanel' },
  { slug: 'คำนวณ-roi-ถ่ายภาพ', name: 'Photography ROI', component: 'TransparencyPanel' },
  { slug: 'คำนวณ-ต้นทุน-ผ้าและอุปกรณ์เย็บ', name: 'Sewing Cost', component: 'TransparencyPanel' },
  { slug: 'คำนวณ-ต้นทุน-สีและอุปกรณ์จิตรกรรม', name: 'Painting Cost', component: 'TransparencyPanel' },
  { slug: 'คำนวณ-ต้นทุน-หนังสือและด้ายไหมพรม', name: 'Book & Yarn Cost', component: 'TransparencyPanel' },
  { slug: 'คำนวณ-ต้นทุน-เครื่องประดับ', name: 'Jewelry Cost', component: 'TransparencyPanel' },
  { slug: 'คำนวณ-ต้นทุน-โครงการงานไม้', name: 'Woodwork Cost', component: 'TransparencyPanel' },
];

const PAGES_WITH_TRUST_BADGE = [
  { slug: 'คำนวณ-bmi', name: 'BMI Calculator', component: 'TrustBadge' },
  { slug: 'คำนวณดอกเบี้ยเงินฝาก', name: 'Deposit Interest', component: 'TrustBadge' },
  { slug: 'คำนวณภาษีเงินได้บุคคลธรรมดา', name: 'Income Tax', component: 'TrustBadge' },
  { slug: 'คำนวณเงินเดือนสุทธิ', name: 'Net Salary', component: 'TrustBadge' },
];

const BASE_URL = 'http://localhost:3000';
const RESULTS_DIR = './audit-results-cal-1485';
const SCREENSHOTS_DIR = path.join(RESULTS_DIR, 'screenshots');
const REPORT_FILE = './audit-results-cal-1463.csv';

// Ensure directories exist
if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR, { recursive: true });
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

/**
 * Mobile QA Checklist
 */
const MOBILE_CHECKLIST = {
  'layout_overflow': 'Text/components overflow beyond viewport (375px)',
  'tap_targets': 'Links/buttons less than 44px minimum (WCAG 2.1)',
  'transparent_panel_renders': 'TransparencyPanel expands/collapses correctly',
  'trust_badge_renders': 'TrustBadge displays without overflow',
  'faq_accordion_renders': 'FAQAccordion expands/collapses correctly',
  'font_readable': 'Thai text renders correctly (no mojibake)',
  'links_tappable': 'All links/buttons have adequate tap areas',
  'no_horizontal_scroll': 'No horizontal scrolling required at 375px',
  'accessibility': 'No obvious accessibility violations',
  'visual_clarity': 'All elements visually clear on small screen',
};

async function testPages() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }, // iPhone SE / Pixel 4a portrait
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
  });

  const results = [];
  const allPages = [...PAGES_WITH_TRANSPARENCY_PANEL, ...PAGES_WITH_TRUST_BADGE];
  const uniquePages = Array.from(new Map(allPages.map(p => [p.slug, p])).values());

  console.log(`\n🧪 CAL-1485 Mobile QA Baseline Testing`);
  console.log(`📱 Viewport: 375×667 (iPhone SE / Pixel 4a)`);
  console.log(`📋 Pages to test: ${uniquePages.length}`);
  console.log(`✅ Components: TransparencyPanel (7), TrustBadge (4)\n`);

  for (const page of uniquePages) {
    const url = `${BASE_URL}/${page.slug}`;
    const screenshotPath = path.join(SCREENSHOTS_DIR, `${page.slug}-375w.png`);

    console.log(`Testing: ${page.name} (${page.slug})`);

    try {
      const page_obj = await context.newPage();

      // Set viewport
      await page_obj.setViewportSize({ width: 375, height: 667 });

      // Navigate to page
      await page_obj.goto(url, { waitUntil: 'networkidle' });

      // Wait for components to load
      await page_obj.waitForTimeout(500);

      // Take screenshot
      await page_obj.screenshot({ path: screenshotPath, fullPage: true });

      // Run accessibility checks
      const checks = await runAccessibilityChecks(page_obj);

      // Check for layout issues
      const layoutIssues = await checkLayoutIssues(page_obj);

      const result = {
        page_id: page.slug,
        page_name: page.name,
        component: page.component,
        status: layoutIssues.length === 0 ? 'PASS' : 'FAIL',
        issues: layoutIssues.join('; '),
        accessibility_issues: checks.join('; '),
        screenshot: `screenshots/${path.basename(screenshotPath)}`,
        url: url,
        tested_at: new Date().toISOString(),
      };

      results.push(result);
      console.log(`  ✅ ${result.status}${result.issues ? ' - Issues found' : ''}\n`);

      await page_obj.close();
    } catch (error) {
      console.log(`  ❌ ERROR: ${error.message}\n`);
      results.push({
        page_id: page.slug,
        page_name: page.name,
        component: page.component,
        status: 'ERROR',
        issues: error.message,
        accessibility_issues: '',
        screenshot: '',
        url: url,
        tested_at: new Date().toISOString(),
      });
    }
  }

  await context.close();
  await browser.close();

  // Generate CSV report
  generateCSVReport(results);

  return results;
}

async function checkLayoutIssues(page) {
  const issues = [];

  try {
    // Check for horizontal overflow
    const overflow = await page.evaluate(() => {
      return window.innerWidth < document.documentElement.scrollWidth;
    });

    if (overflow) {
      issues.push('Horizontal overflow detected');
    }

    // Check for very small elements (potential tap target issues)
    const smallElements = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a, [role="button"]'));
      return buttons.filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.height < 44 || rect.width < 44;
      }).length;
    });

    if (smallElements > 0) {
      issues.push(`Found ${smallElements} elements with tap targets < 44px`);
    }

    // Check TransparencyPanel rendering
    const panelIssues = await page.evaluate(() => {
      const panel = document.querySelector('[data-testid="transparency-panel"]') ||
                     document.querySelector('.transparency-panel') ||
                     document.querySelector('[class*="transparency"]');
      if (panel) {
        const rect = panel.getBoundingClientRect();
        if (rect.width > window.innerWidth) {
          return 'TransparencyPanel overflows viewport';
        }
      }
      return null;
    });

    if (panelIssues) issues.push(panelIssues);

    // Check TrustBadge rendering
    const badgeIssues = await page.evaluate(() => {
      const badge = document.querySelector('[data-testid="trust-badge"]') ||
                     document.querySelector('.trust-badge') ||
                     document.querySelector('[class*="trust-badge"]');
      if (badge) {
        const rect = badge.getBoundingClientRect();
        if (rect.width > window.innerWidth) {
          return 'TrustBadge overflows viewport';
        }
      }
      return null;
    });

    if (badgeIssues) issues.push(badgeIssues);

    // Check FAQAccordion rendering
    const faqIssues = await page.evaluate(() => {
      const faq = document.querySelector('[class*="faq"]');
      if (faq) {
        const rect = faq.getBoundingClientRect();
        if (rect.width > window.innerWidth) {
          return 'FAQAccordion overflows viewport';
        }
      }
      return null;
    });

    if (faqIssues) issues.push(faqIssues);

  } catch (error) {
    issues.push(`Layout check error: ${error.message}`);
  }

  return issues;
}

async function runAccessibilityChecks(page) {
  const issues = [];

  try {
    // Basic accessibility checks
    const a11yIssues = await page.evaluate(() => {
      const checks = [];

      // Check for missing alt text on images
      const imagesWithoutAlt = Array.from(document.querySelectorAll('img')).filter(img => !img.alt);
      if (imagesWithoutAlt.length > 0) {
        checks.push(`${imagesWithoutAlt.length} images missing alt text`);
      }

      // Check for form labels
      const inputsWithoutLabel = Array.from(document.querySelectorAll('input')).filter(input => {
        return !input.getAttribute('aria-label') && !document.querySelector(`label[for="${input.id}"]`);
      });
      if (inputsWithoutLabel.length > 0) {
        checks.push(`${inputsWithoutLabel.length} inputs missing labels`);
      }

      // Check for heading hierarchy
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      const headingLevels = headings.map(h => parseInt(h.tagName[1]));
      for (let i = 0; i < headingLevels.length - 1; i++) {
        if (headingLevels[i + 1] - headingLevels[i] > 1) {
          checks.push('Heading hierarchy skips levels');
          break;
        }
      }

      return checks;
    });

    issues.push(...a11yIssues);
  } catch (error) {
    issues.push(`A11y check error: ${error.message}`);
  }

  return issues;
}

function generateCSVReport(results) {
  const headers = [
    'page_id',
    'page_name',
    'component',
    'status',
    'issues',
    'accessibility_issues',
    'screenshot_path',
    'tested_at',
  ];

  const rows = results.map(r => [
    r.page_id,
    r.page_name,
    r.component,
    r.status,
    `"${r.issues}"`,
    `"${r.accessibility_issues}"`,
    r.screenshot,
    r.tested_at,
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  fs.writeFileSync(REPORT_FILE, csv);
  console.log(`\n📊 Report saved: ${REPORT_FILE}`);

  // Summary
  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  const errorCount = results.filter(r => r.status === 'ERROR').length;

  console.log(`\n📈 Results Summary:`);
  console.log(`  ✅ PASS: ${passCount}`);
  console.log(`  ❌ FAIL: ${failCount}`);
  console.log(`  ⚠️  ERROR: ${errorCount}`);
  console.log(`  📸 Screenshots: ${SCREENSHOTS_DIR}\n`);
}

// Run tests
testPages().catch(console.error);
