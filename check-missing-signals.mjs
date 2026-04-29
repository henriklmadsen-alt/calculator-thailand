import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');

// Find one file missing OG tags
const walk = (dir) => {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const result = walk(fullPath);
      if (result) return result;
    } else if (entry.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('property="og:')) {
        return fullPath;
      }
    }
  }
};

const missingFile = walk(distDir);
if (missingFile) {
  console.log('File missing OG tags:', missingFile.replace(distDir, 'dist'));
  const content = fs.readFileSync(missingFile, 'utf8');
  const headStart = content.indexOf('<head>');
  const headEnd = content.indexOf('</head>');
  console.log('\n--- HEAD SECTION ---');
  console.log(content.substring(headStart, headEnd + 7).substring(0, 1000));
}
