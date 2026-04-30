import fs from 'fs';
import path from 'path';

const distDir = 'dist';
const getAllHtmlFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  return fileList;
};

const allFiles = getAllHtmlFiles(distDir);
const sampleSize = 100;
const sampled = allFiles.sort(() => Math.random() - 0.5).slice(0, sampleSize);

const signals = {
  og_title: /<meta property="og:title"/,
  og_description: /<meta property="og:description"/,
  og_image: /<meta property="og:image"/,
};

const missing = [];
sampled.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let missing_signals = [];
  for (const signal in signals) {
    if (!signals[signal].test(content)) {
      missing_signals.push(signal);
    }
  }
  if (missing_signals.length > 0) {
    const filePath = file.replace(distDir, '').replace(/\+/g, '/');
    missing.push({ path: filePath, missing: missing_signals.join(', ') });
  }
});

console.log(`Pages missing signals in sample (${missing.length} found):`);
missing.forEach(m => {
  console.log(`  ${m.path} - missing: ${m.missing}`);
});
