import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');

const walk = (dir, prefix = '') => {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, prefix + entry + '/');
    } else if (entry === 'index.html') {
      const pagePath = (prefix + entry).replace(/index\.html/, '');
      const content = fs.readFileSync(fullPath, 'utf8');
      const hasOg = content.includes('property="og:');
      if (!hasOg && !pagePath.includes('/admin/')) {
        console.log('Missing OG (non-admin):', pagePath);
      }
    }
  }
};

walk(distDir);
