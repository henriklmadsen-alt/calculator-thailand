import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const missing = [];

const walk = (dir) => {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (entry.endsWith('index.html')) {
      const relPath = path.relative(distDir, fullPath);
      if (!relPath.includes('/calculator/') && !relPath.includes('/go/') && !relPath.includes('/admin/')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (!content.includes('property="og:')) {
          missing.push(relPath);
        }
      }
    }
  }
};

walk(distDir);
console.log(`Pages missing OG tags (sample of 10):\n`);
missing.slice(0, 10).forEach(p => console.log('  - ' + p));
console.log(`\nTotal missing OG: ${missing.length} of ~915 (${((missing.length/915)*100).toFixed(1)}%)`);
