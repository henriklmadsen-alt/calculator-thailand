import fs from 'fs';
import path from 'path';

// Check critical files exist
const criticalFiles = [
  'dist/index.html',
  'dist/__release.json',
  'dist/sitemap.xml',
  'dist/sitemap-0.xml',
  'dist/sitemap-index.xml',
  'dist/manifest.json'
];

console.log('=== CRITICAL FILES CHECK ===\n');
let allPresent = 0;
criticalFiles.forEach(file => {
  const exists = fs.existsSync(file);
  const status = exists ? '✓' : '✗';
  console.log(`${status} ${file}`);
  if (exists) allPresent++;
});

console.log(`\n✓ ${allPresent}/${criticalFiles.length} critical files present\n`);

// Check release metadata
const releaseMetaPath = 'dist/__release.json';
if (fs.existsSync(releaseMetaPath)) {
  try {
    const meta = JSON.parse(fs.readFileSync(releaseMetaPath, 'utf8'));
    console.log('=== RELEASE METADATA ===');
    console.log(`SHA: ${meta.sha}`);
    console.log(`Timestamp: ${meta.timestamp}`);
    console.log(`Version: ${meta.version}`);
  } catch (e) {
    console.log('⚠ Failed to parse release metadata');
  }
}

// Check dist size
const getSize = (p) => {
  let size = 0;
  const walk = (dir) => {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        size += stat.size;
      }
    });
  };
  walk(p);
  return (size / 1024 / 1024).toFixed(1);
};

const distSize = getSize('dist');
console.log(`\n=== BUILD ARTIFACTS ===`);
console.log(`dist/ size: ${distSize}MB`);
console.log(`Expected: 100-120MB`);
const sizeOk = parseFloat(distSize) > 90 && parseFloat(distSize) < 150 ? '✓' : '⚠';
console.log(`${sizeOk} Build size: ${sizeOk === '✓' ? 'HEALTHY' : 'POSSIBLE ISSUE'}`);

