#!/usr/bin/env node
/**
 * i18n String Extraction Script
 * Extracts Thai strings from Astro components for translation into English
 */

const fs = require('fs');
const path = require('path');

// Regex patterns to match string content in Astro/HTML/JSX
const patterns = [
  /(?<![\w])'([^']+)'(?![\w])/g,  // Single quoted strings
  /(?<![\\])"([^"]+)"(?![\\])/g,   // Double quoted strings
  />([^<]{10,})</g,                 // Text content between tags
  /placeholder="([^"]+)"/g,         // Placeholder text
  /title="([^"]+)"/g,               // Title attributes
  /alt="([^"]+)"/g,                 // Alt text
];

// Filter to detect Thai characters
const isThai = (str) => /[฀-๿]/.test(str);

// Extract unique strings
const strings = new Set();

function extractFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Skip non-Thai content and minified files
    if (!isThai(content) || filePath.includes('node_modules')) {
      return;
    }

    // Extract strings using patterns
    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const str = match[1]?.trim() || match[0];
        // Filter out code, short strings, and non-Thai
        if (str && str.length > 2 && isThai(str) && !str.includes('${') && !str.startsWith('<')) {
          strings.add(str);
        }
      }
    });
  } catch (e) {
    // Ignore read errors
  }
}

// Walk directory and extract
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !file.startsWith('.')) {
      walkDir(filePath);
    } else if (filePath.endsWith('.astro') || filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
      extractFromFile(filePath);
    }
  });
}

// Start extraction from src/ directory
walkDir('src');

// Build output structure
const thLocale = {};
const enLocale = {};

let count = 0;
strings.forEach((str) => {
  const key = `string_${count}`;
  thLocale[key] = str;
  enLocale[key] = `[TRANSLATE: ${str}]`;
  count++;
});

// Write output
fs.writeFileSync('src/i18n/locales/th-extracted.json', JSON.stringify(thLocale, null, 2));
fs.writeFileSync('src/i18n/locales/en-extracted.json', JSON.stringify(enLocale, null, 2));

// Report statistics
const wordCount = Array.from(strings).reduce((sum, str) => sum + str.split(/\s+/).length, 0);
console.log(`Extraction Complete:`);
console.log(`- Unique Thai strings: ${count}`);
console.log(`- Estimated word count: ${wordCount}`);
console.log(`- Output files: th-extracted.json, en-extracted.json`);
