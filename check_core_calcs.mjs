import fs from 'fs';

const coreCalcs = [
  'electricity-bill',
  'income-tax',
  'loan-payment',
  'net-salary',
  'land-tax',
  'unit-converter'
];

console.log('\n🧮 CORE CALCULATOR VERIFICATION\n');

coreCalcs.forEach(calc => {
  const htmlPath = `dist/calculator/${calc}/index.html`;
  const exists = fs.existsSync(htmlPath);
  console.log(`  ${exists ? '✓' : '✗'} /calculator/${calc}`);
});

// Check Thai content pages
const thaiPagesDir = 'dist/บทความ';
let thaiPageCount = 0;

if (fs.existsSync(thaiPagesDir)) {
  function countDirs(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      entries.forEach(entry => {
        if (entry.isDirectory() && fs.existsSync(`${dir}/${entry.name}/index.html`)) {
          thaiPageCount++;
        }
      });
    } catch (e) {}
  }
  countDirs(thaiPagesDir);
}

console.log(`\n📄 THAI CONTENT COVERAGE\n  Articles: ${thaiPageCount}`);
