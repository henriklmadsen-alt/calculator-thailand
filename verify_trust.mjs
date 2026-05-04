import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = './dist';

let stats = {
  totalHtml: 0,
  ogTitle: 0,
  viewport: 0,
  canonical: 0,
  schemaCount: 0,
  twitter: 0,
  pwaManifest: 0,
  themeColor: 0,
  guardedAdSlots: 0,
  formInputs: 0,
  thaiPages: 0
};

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanDir(filePath);
    } else if (file.endsWith('.html')) {
      stats.totalHtml++;
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for Thai characters
      if (/[ก-ฮ]/.test(content)) {
        stats.thaiPages++;
      }
      
      // Check for og:title
      if (content.includes('og:title')) {
        stats.ogTitle++;
      }
      
      // Check for viewport
      if (content.includes('viewport')) {
        stats.viewport++;
      }
      
      // Check for canonical
      if (content.includes('rel="canonical"')) {
        stats.canonical++;
      }
      
      // Count schema.org instances
      const schemaMatches = content.match(/schema\.org/g);
      if (schemaMatches) {
        stats.schemaCount += schemaMatches.length;
      }
      
      // Check for twitter card
      if (content.includes('twitter:')) {
        stats.twitter++;
      }
      
      // Check for PWA manifest
      if (content.includes('manifest.webmanifest')) {
        stats.pwaManifest++;
      }
      
      // Check for theme-color
      if (content.includes('theme-color')) {
        stats.themeColor++;
      }
      
      // Count GuardedAdSlots
      const adMatches = content.match(/GuardedAdSlots/g);
      if (adMatches) {
        stats.guardedAdSlots += adMatches.length;
      }
      
      // Count form inputs
      const inputMatches = content.match(/<input/g);
      if (inputMatches) {
        stats.formInputs += inputMatches.length;
      }
    }
  });
}

scanDir(distDir);

console.log('=== PHASE 1 VERIFICATION ===\n');
console.log(`Total HTML files: ${stats.totalHtml}`);
console.log(`Thai pages: ${stats.thaiPages} (${((stats.thaiPages / stats.totalHtml) * 100).toFixed(1)}%)`);
console.log(`\n=== TRUST SIGNALS ===`);
console.log(`og:title: ${stats.ogTitle} / ${stats.totalHtml} (${((stats.ogTitle / stats.totalHtml) * 100).toFixed(1)}%)`);
console.log(`viewport: ${stats.viewport} / ${stats.totalHtml} (${((stats.viewport / stats.totalHtml) * 100).toFixed(1)}%)`);
console.log(`canonical: ${stats.canonical} / ${stats.totalHtml} (${((stats.canonical / stats.totalHtml) * 100).toFixed(1)}%)`);
console.log(`schema.org instances: ${stats.schemaCount}`);
console.log(`twitter:card: ${stats.twitter} / ${stats.totalHtml} (${((stats.twitter / stats.totalHtml) * 100).toFixed(1)}%)`);
console.log(`PWA manifest: ${stats.pwaManifest} / ${stats.totalHtml} (${((stats.pwaManifest / stats.totalHtml) * 100).toFixed(1)}%)`);
console.log(`theme-color: ${stats.themeColor} / ${stats.totalHtml} (${((stats.themeColor / stats.totalHtml) * 100).toFixed(1)}%)`);
console.log(`\n=== MOBILE-FIRST ===`);
console.log(`GuardedAdSlots: ${stats.guardedAdSlots}`);
console.log(`Form inputs: ${stats.formInputs}`);

const avgTrust = ((stats.ogTitle + stats.viewport + stats.canonical + stats.twitter + stats.themeColor) / (5 * stats.totalHtml) * 100).toFixed(1);
console.log(`\n=== AVERAGE TRUST SIGNAL ===\n${avgTrust}%`);
