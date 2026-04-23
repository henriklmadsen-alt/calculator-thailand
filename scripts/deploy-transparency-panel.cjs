#!/usr/bin/env node

/**
 * CAL-990: Deploy TransparencyPanel to calculator pages
 * Automated deployment script to add TransparencyPanel component to calculators
 *
 * Usage: node scripts/deploy-transparency-panel.js [--dry-run] [--sample=10]
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PAGES_DIR = path.join(__dirname, '../src/pages');
const LIB_DIR = path.join(__dirname, '../src/lib');
const DRY_RUN = process.argv.includes('--dry-run');
const SAMPLE_SIZE = parseInt(process.argv.find(arg => arg.startsWith('--sample='))?.split('=')[1] || '776');

// Helper: Recursively find all index.astro files
function findCalculatorPages(dir) {
  const pages = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      // Recurse into subdirectory
      const subPages = findCalculatorPages(fullPath);
      pages.push(...subPages);
    } else if (file.name === 'index.astro') {
      pages.push(fullPath);
    }
  }

  return pages;
}

// Helper: Extract formula from .ts calculator file
function extractFormulaFromCalculatorFile(calcFile) {
  try {
    const content = fs.readFileSync(calcFile, 'utf8');

    // Look for formula in comment block
    const formulaMatch = content.match(/Formula:\s*(.+?)(?:\n|\*)/);
    if (formulaMatch) {
      return formulaMatch[1].trim();
    }

    // Fallback: Look for "formula" variable or comment
    const varMatch = content.match(/(?:const|let|export)\s+formula\s*=\s*['"](.*?)['"]/);
    if (varMatch) {
      return varMatch[1];
    }

    return null;
  } catch (e) {
    return null;
  }
}

// Helper: Get default Thai formula for calculator type
function getDefaultFormula(pageName) {
  const normalizedName = pageName.toLowerCase();

  // Keyword-based heuristics
  if (normalizedName.includes('bmi')) return 'BMI = น้ำหนัก (กก.) ÷ [ส่วนสูง (ม.)]²';
  if (normalizedName.includes('ต้นทุน')) return 'ต้นทุนทั้งหมด = ผลรวมของค่าใช้จ่ายทั้งหมด';
  if (normalizedName.includes('ภาษี')) return 'ภาษีที่ต้องจ่าย = รายได้สุทธิ × อัตราภาษี';
  if (normalizedName.includes('ผ่อน') || normalizedName.includes('สินเชื่อ')) return 'ค่างวด = ยอดเงินกู้ × อัตราดอกเบี้ย ÷ (1 - (1 + อัตรา)^-จำนวนเดือน)';
  if (normalizedName.includes('เงินเดือน')) return 'เงินเดือนสุทธิ = เงินเดือนรวม - การหักลด';

  // Generic default
  return 'ผลลัพธ์ = ผลรวมของปัจจัยที่พิจารณา';
}

// Helper: Find matching calculator file
function findCalculatorFile(pagePath) {
  const pageName = path.basename(path.dirname(pagePath));
  const camelCaseName = pageName
    .split('-')
    .map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1))
    .join('');

  const possibleNames = [
    `${camelCaseName}-calculator.ts`,
    `${camelCaseName}.ts`,
    pageName.replace(/[\u0E00-\u0E7F]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '') + '-calculator.ts',
  ];

  for (const name of possibleNames) {
    const filePath = path.join(LIB_DIR, name);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return null;
}

// Helper: Check if page already has TransparencyPanel
function hasTransparencyPanel(pageContent) {
  return pageContent.includes('TransparencyPanel');
}

// Helper: Calculate correct import path based on file depth
function getCorrectImportPath(pageFile) {
  // Count directory depth: pages at depth N need N "../" sequences
  // e.g., src/pages/index.astro (depth 1) needs ../components
  //       src/pages/category/index.astro (depth 2) needs ../../components
  const pathParts = pageFile.replace(/\\/g, '/').split('/');
  const pagesIndex = pathParts.lastIndexOf('pages');
  const depth = pathParts.length - pagesIndex - 1; // -1 for index.astro itself

  const ups = Array(depth).fill('..').join('/');
  return `${ups}/components/templates/TransparencyPanel.astro`;
}

// Helper: Add TransparencyPanel import if missing
function ensureTransparencyImport(content, pageFile) {
  if (content.includes("import TransparencyPanel")) {
    return content;
  }

  const importPath = getCorrectImportPath(pageFile);

  // Add after other imports
  const lastImportMatch = content.lastIndexOf('import ');
  if (lastImportMatch !== -1) {
    const endOfLine = content.indexOf('\n', lastImportMatch);
    if (endOfLine !== -1) {
      const before = content.substring(0, endOfLine + 1);
      const after = content.substring(endOfLine + 1);
      return before + `import TransparencyPanel from '${importPath}';\n` + after;
    }
  }

  return content;
}

// Helper: Find good insertion point for TransparencyPanel in results section
function findTransparencyPanelInsertionPoint(content) {
  // Look for result div or results section
  const resultDivMatch = content.match(/<div[^>]*id=["'](result|results)["']/);
  if (resultDivMatch) {
    const startIndex = resultDivMatch.index;
    // Find the closing tag or a good place after h2
    const h2Match = content.match(/<h2[^>]*>[\s\S]*?<\/h2>/);
    if (h2Match) {
      const h2EndIndex = startIndex + h2Match[0].length;
      return h2EndIndex;
    }
  }
  return null;
}

// Helper: Generate TransparencyPanel component usage
function generateTransparencyPanel(formula, pageTitle) {
  const panelId = pageTitle
    .toLowerCase()
    .replace(/[\u0E00-\u0E7F]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');

  return `\n    <TransparencyPanel
      formula="${formula}"
      panelId="${panelId}"
    />\n`;
}

// Main execution
async function deployTransparencyPanel() {
  console.log('🚀 CAL-990: TransparencyPanel Deployment Script');
  console.log(`📋 Mode: ${DRY_RUN ? 'DRY RUN' : 'EXECUTE'}`);
  console.log(`📊 Sample size: ${SAMPLE_SIZE} calculators\n`);

  // Find all calculator pages
  const pageFiles = findCalculatorPages(PAGES_DIR);

  console.log(`📁 Found ${pageFiles.length} calculator pages`);

  // Filter pages without TransparencyPanel
  const pagesToUpdate = pageFiles.filter(pageFile => {
    const content = fs.readFileSync(pageFile, 'utf8');
    return !hasTransparencyPanel(content);
  });

  console.log(`📍 Pages needing TransparencyPanel: ${pagesToUpdate.length}`);
  console.log(`✅ Pages already with TransparencyPanel: ${pageFiles.length - pagesToUpdate.length}\n`);

  // Limit to sample for testing
  const targetPages = pagesToUpdate.slice(0, Math.min(SAMPLE_SIZE, pagesToUpdate.length));
  console.log(`🎯 Target pages for this run: ${targetPages.length}\n`);

  let successCount = 0;
  let skipCount = 0;
  const summary = [];

  for (const pageFile of targetPages) {
    const pageDir = path.dirname(pageFile);
    const pageName = path.basename(pageDir);
    const pageTitle = pageName.replace(/[\u0E00-\u0E7F]/g, '').replace(/[^a-z0-9]/g, ' ').trim();

    let pageContent = fs.readFileSync(pageFile, 'utf8');

    // Skip if already has TransparencyPanel
    if (hasTransparencyPanel(pageContent)) {
      skipCount++;
      continue;
    }

    // Try to extract formula
    let formula = null;
    const calcFile = findCalculatorFile(pageFile);
    if (calcFile) {
      formula = extractFormulaFromCalculatorFile(calcFile);
    }

    // Use default if not found
    if (!formula) {
      formula = getDefaultFormula(pageName);
    }

    // Add import
    const hasImport = pageContent.includes('import TransparencyPanel');
    if (!hasImport) {
      pageContent = ensureTransparencyImport(pageContent, pageFile);
    }

    // Find insertion point (simplified: add before closing main div)
    const insertionPoint = findTransparencyPanelInsertionPoint(pageContent);
    if (insertionPoint === null) {
      // Fallback: add before </div> in result section (use simpler pattern)
      const resultEndMatch = pageContent.match(/<\/div>\s*\n/m);
      if (resultEndMatch) {
        const panel = generateTransparencyPanel(formula, pageName);
        const updatedContent =
          pageContent.substring(0, resultEndMatch.index) +
          panel +
          pageContent.substring(resultEndMatch.index);

        if (!DRY_RUN) {
          fs.writeFileSync(pageFile, updatedContent, 'utf8');
        }

        successCount++;
        summary.push({ page: pageName, formula, status: 'added' });
      }
    } else {
      const panel = generateTransparencyPanel(formula, pageName);
      const updatedContent =
        pageContent.substring(0, insertionPoint) +
        panel +
        pageContent.substring(insertionPoint);

      if (!DRY_RUN) {
        fs.writeFileSync(pageFile, updatedContent, 'utf8');
      }

      successCount++;
      summary.push({ page: pageName, formula, status: 'added' });
    }
  }

  // Summary
  console.log('\n📊 Deployment Summary');
  console.log('═'.repeat(50));
  console.log(`✅ Successfully deployed: ${successCount}`);
  console.log(`⏭️  Skipped (already had component): ${skipCount}`);
  console.log(`🎯 Total pages in sample: ${targetPages.length}`);
  console.log(`📍 Total calculator pages: ${pageFiles.length}`);
  console.log(`🔄 Total remaining for full deploy: ${pagesToUpdate.length - successCount}\n`);

  if (DRY_RUN) {
    console.log('🔍 DRY RUN: No files were actually modified');
    console.log('Sample of pages that would be updated:');
    summary.slice(0, 5).forEach(item => {
      console.log(`  • ${item.page}: ${item.formula.substring(0, 50)}...`);
    });
  } else {
    console.log('✨ Changes committed to disk');
    summary.slice(0, 5).forEach(item => {
      console.log(`  ✓ ${item.page}`);
    });
  }

  console.log('\n💡 Next steps:');
  console.log('  1. Run: npm run build (test builds)');
  console.log('  2. QA sample of deployed pages');
  console.log('  3. Run again without --dry-run to deploy to full set');
  console.log('  4. Commit with: git add -A && git commit -m "CAL-990: Deploy TransparencyPanel to all 776 calculators"');
}

// Execute
deployTransparencyPanel().catch(console.error);
