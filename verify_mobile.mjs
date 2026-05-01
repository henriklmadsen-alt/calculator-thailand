import fs from 'fs';
import path from 'path';

// Sample pages and check mobile viewport
const getRandomPages = () => {
  const pagesDir = './dist/server/pages';
  const allFiles = [];
  
  const walk = (dir) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        walk(fullPath);
      } else if (item.name.endsWith('.astro.mjs')) {
        allFiles.push(fullPath);
      }
    }
  };
  
  walk(pagesDir);
  
  const sample = [];
  const indices = new Set();
  while (indices.size < Math.min(50, allFiles.length)) {
    indices.add(Math.floor(Math.random() * allFiles.length));
  }
  return Array.from(indices).map(i => allFiles[i]);
};

// Check for responsive design indicators in the code
const checkMobileSupport = (content) => {
  const hasViewport = content.includes('viewport');
  const hasMobileCSS = content.includes('@media') || content.includes('mobile') || content.includes('responsive');
  const hasTailwind = content.includes('md:') || content.includes('lg:') || content.includes('sm:');
  
  return { hasViewport, hasMobileCSS, hasTailwind };
};

const pages = getRandomPages();
const results = { viewport: 0, mobile: 0, responsive: 0, total: 0 };

pages.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const checks = checkMobileSupport(content);
  
  if (checks.hasViewport) results.viewport++;
  if (checks.hasMobileCSS) results.mobile++;
  if (checks.hasTailwind) results.responsive++;
  results.total++;
});

console.log('\n=== MOBILE RESPONSIVENESS CHECK (50-page sample) ===');
console.log(`Viewport Meta: ${((results.viewport/results.total)*100).toFixed(0)}%`);
console.log(`Mobile CSS: ${((results.mobile/results.total)*100).toFixed(0)}%`);
console.log(`Tailwind Responsive: ${((results.responsive/results.total)*100).toFixed(0)}%`);

const mobileScore = ((results.viewport + results.mobile + results.responsive) / (results.total * 3) * 100).toFixed(1);
console.log(`\nMobile Support Score: ${mobileScore}%`);
