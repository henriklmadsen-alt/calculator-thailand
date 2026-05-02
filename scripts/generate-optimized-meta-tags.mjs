#!/usr/bin/env node

/**
 * Generate Optimized Meta Tags for All Calculators
 * Usage: node scripts/generate-optimized-meta-tags.mjs
 * Output: Generates meta tag report with titles and descriptions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcPath = path.join(__dirname, '../src');
const pagesPath = path.join(srcPath, 'pages');

// Auto-generate description based on calculator type
function generateAutoDescription(calculatorHref) {
  const href = calculatorHref.toLowerCase();

  // Tax calculators
  if (href.includes('ภาษี') || href.includes('tax') || href.includes('vat')) {
    return `คำนวณภาษีออนไลน์ฟรี - ผลลัพธ์ทันที ไม่ต้องสมัครสมาชิก อัปเดตเกณฑ์ปี 2569`;
  }
  // Loan/finance calculators
  if (href.includes('ผ่อน') || href.includes('สินเชื่อ') || href.includes('กู้')) {
    return `คำนวณค่างวดและสินเชื่อ พร้อมตารางผ่อนชำระ ใช้งานฟรี ผลลัพธ์ทันที`;
  }
  // Investment/savings
  if (href.includes('ลงทุน') || href.includes('ออม') || href.includes('ดอกเบี้ย')) {
    return `คำนวณผลตอบแทนการลงทุน เงินออมและดอกเบี้ยทบต้น ใช้ฟรี`;
  }
  // Health calculators
  if (href.includes('bmi') || href.includes('สุขภาพ')) {
    return `เครื่องคำนวณสุขภาพออนไลน์ฟรี พร้อมค่าปกติและคำแนะนำ ผลลัพธ์ทันที`;
  }
  // Real estate
  if (href.includes('บ้าน') || href.includes('อสังหา')) {
    return `คำนวณค่าโอนบ้านและสินทรัพย์ อัตราภาษีตัวเรียลถูก ใช้ฟรี`;
  }
  // Salary/HR
  if (href.includes('เงินเดือน') || href.includes('ค่าแรง') || href.includes('โบนัส')) {
    return `คำนวณเงินเดือนสุทธิ หลังหักภาษีและประกันสังคม ใช้งานฟรี`;
  }
  // Vehicle
  if (href.includes('รถ') || href.includes('vehicle') || href.includes('car')) {
    return `คำนวณค่าภาษีรถยนต์ ค่าประกัน และค่าใช้จ่ายรถ ใช้งานฟรี`;
  }
  // Math/utility
  if (href.includes('คณิต') || href.includes('math') || href.includes('เปอร์เซ็นต์')) {
    return `เครื่องคำนวณคณิตศาสตร์ออนไลน์ฟรี รองรับเปอร์เซ็นต์ ดอกเบี้ย และการแปลง`;
  }
  // Business
  if (href.includes('ธุรกิจ') || href.includes('กำไร') || href.includes('ต้นทุน')) {
    return `เครื่องคำนวณธุรกิจ กำไร ขาดทุน และราคาขาย ใช้งานฟรี`;
  }

  // Default fallback
  return `เครื่องคำนวณออนไลน์ฟรี - ผลลัพธ์ทันที ไม่ต้องสมัครสมาชิก`;
}

// Generate title from calculator path
function generateTitle(calculatorHref) {
  const slug = calculatorHref
    .replace(/\//g, '')
    .replace(/\-/g, ' ')
    .replace(/[^a-zก-๙\s]/gi, '');

  // Capitalize each word
  return slug
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Scan pages directory for calculator pages
function findCalculatorPages() {
  const calculators = [];

  function scanDir(dir, relativePath = '') {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        const indexPath = path.join(dir, entry.name, 'index.astro');
        const newRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

        if (fs.existsSync(indexPath)) {
          const href = `/${newRelativePath}/`.replace(/\\/g, '/');

          // Only include Thai calculator paths or english equivalents
          if (href.includes('คำนวณ') || href.includes('calculator')) {
            calculators.push(href);
          }
        }

        // Recurse into subdirectories
        scanDir(path.join(dir, entry.name), newRelativePath);
      }
    }
  }

  scanDir(pagesPath);
  return calculators;
}

// Main execution
console.log('🔍 Scanning calculator pages...\n');

const calculators = findCalculatorPages();
console.log(`Found ${calculators.length} calculator pages\n`);

// Generate meta tags
const metaTags = {};
let optimizedCount = 0;

for (const href of calculators) {
  const title = generateTitle(href);
  const description = generateAutoDescription(href);

  metaTags[href] = {
    title,
    description,
    length: {
      title: title.length,
      description: description.length,
    },
    status: description !== generateAutoDescription('/default/') ? 'optimized' : 'default',
  };

  if (metaTags[href].status === 'optimized') {
    optimizedCount++;
  }
}

// Generate report
console.log(`📊 Meta Tag Generation Report`);
console.log(`${'─'.repeat(70)}`);
console.log(`Total Calculators: ${calculators.length}`);
console.log(`Optimized: ${optimizedCount}`);
console.log(`Avg Title Length: ${Math.round(
  Object.values(metaTags).reduce((sum, m) => sum + m.length.title, 0) / Object.keys(metaTags).length
)} chars (target: 50-60)`);
console.log(`Avg Description Length: ${Math.round(
  Object.values(metaTags).reduce((sum, m) => sum + m.length.description, 0) / Object.keys(metaTags).length
)} chars (target: 150-160)\n`);

// Sample output
console.log(`📋 Sample Meta Tags (First 6):`);
console.log(`${'─'.repeat(70)}`);

Object.entries(metaTags)
  .slice(0, 6)
  .forEach(([href, meta]) => {
    console.log(`\n🔗 ${href}`);
    console.log(`   Title (${meta.length.title} chars): ${meta.title}`);
    console.log(`   Desc (${meta.length.description} chars): ${meta.description}`);
  });

// Save report to file
const reportPath = path.join(srcPath, '../meta-tags-report.json');
fs.writeFileSync(reportPath, JSON.stringify(metaTags, null, 2));

console.log(`\n✅ Report saved to: meta-tags-report.json`);
console.log(`📁 Total pages with optimized meta tags: ${Object.keys(metaTags).length}`);
