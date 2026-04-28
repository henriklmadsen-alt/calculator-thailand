#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Extract Thai strings and create i18n structure
const thaiStrings = new Map();

function extractFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Simple extraction: look for Thai text in quotes and tags
    const matches = content.matchAll(/[ก-๛\s\d\.,\-—–()\"\'!?:์์ํ]+/g);
    for (const match of matches) {
      const str = match[0].trim();
      if (str && str.length > 3 && /[ก-๛]/.test(str)) {
        if (!thaiStrings.has(str)) {
          thaiStrings.set(str, str);
        }
      }
    }
  } catch (e) {
    // ignore
  }
}

function walkDir(dir) {
  try {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        walkDir(filePath);
      } else if (file.endsWith('.astro') || file.endsWith('.tsx') || file.endsWith('.ts')) {
        extractFromFile(filePath);
      }
    });
  } catch (e) {
    // ignore
  }
}

// Extract strings
walkDir(path.join(__dirname, 'src'));

// Build locale files
const thLocale = { _metadata: { language: 'th', extracted: new Date().toISOString() } };
const enLocale = { _metadata: { language: 'en', extracted: new Date().toISOString() } };

let idx = 0;
thaiStrings.forEach((thaiStr) => {
  const key = `s${idx++}`;
  thLocale[key] = thaiStr;
  enLocale[key] = `[TRANSLATE: ${thaiStr}]`;
});

fs.writeFileSync(path.join(__dirname, 'src/i18n/locales/th.json'), JSON.stringify(thLocale, null, 2));
fs.writeFileSync(path.join(__dirname, 'src/i18n/locales/en.json'), JSON.stringify(enLocale, null, 2));

const wordCount = Array.from(thaiStrings.keys()).reduce((sum, str) => sum + str.split(/\s+/).length, 0);
console.log(`✓ Extraction complete`);
console.log(`  - Thai strings: ${thaiStrings.size}`);
console.log(`  - Word count: ~${wordCount} words`);
console.log(`  - Files: src/i18n/locales/{th,en}.json`);
