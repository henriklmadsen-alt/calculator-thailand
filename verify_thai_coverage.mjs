import fs from 'fs';
import path from 'path';

const distDir = 'dist';
let totalPages = 0;
let thaiPages = 0;
let thaiWithOG = 0;

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      traverseDir(fullPath);
    } else if (file === 'index.html') {
      totalPages++;
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const isThai = content.includes('lang="th"') || fullPath.includes('คำนวณ');
        
        if (isThai) {
          thaiPages++;
          if (content.includes('og:')) {
            thaiWithOG++;
          }
        }
      } catch (e) {
        // ignore
      }
    }
  });
}

traverseDir(distDir);

console.log(`\n=== Thai Pages Coverage ===`);
console.log(`Total pages: ${totalPages}`);
console.log(`Thai pages: ${thaiPages} (${(thaiPages/totalPages*100).toFixed(1)}%)`);
console.log(`Thai with OG meta: ${thaiWithOG}/${thaiPages} (${(thaiWithOG/thaiPages*100).toFixed(1)}%)`);
