import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const sourceScanDirs = ['src/pages', 'src/components', 'src/layouts'];
const sourceBannedPatterns = [
  { label: 'InternalMetadataNote component reference', regex: /InternalMetadataNote/g },
  { label: 'internal notes env flag', regex: /PUBLIC_ENABLE_INTERNAL_NOTES/g },
  { label: 'internal metadata marker', regex: /data-internal-metadata-note/g },
  { label: 'English internal methodology note', regex: /Methodology note:/gi },
  { label: 'English last-updated marker', regex: /Last updated:/gi },
];
const distBannedPatterns = [
  { label: 'rendered internal methodology note', regex: /Methodology note:/gi },
  { label: 'rendered last-updated marker', regex: /Last updated:/gi },
  { label: 'rendered internal metadata marker', regex: /data-internal-metadata-note/gi },
];

function listFiles(dir, extension) {
  const entries = readdirSync(dir);
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...listFiles(fullPath, extension));
      continue;
    }
    if (fullPath.endsWith(extension)) {
      files.push(fullPath);
    }
  }
  return files;
}

function collectFindings(files, patterns) {
  const findings = [];
  for (const filePath of files) {
    const content = readFileSync(filePath, 'utf8');
    for (const pattern of patterns) {
      const matches = [...content.matchAll(pattern.regex)];
      for (const match of matches) {
        const beforeMatch = content.slice(0, match.index);
        const line = beforeMatch.split('\n').length;
        findings.push({
          file: relative(root, filePath).replaceAll('\\', '/'),
          line,
          label: pattern.label,
          excerpt: match[0],
        });
      }
    }
  }
  return findings;
}

const findings = [];
for (const relativeDir of sourceScanDirs) {
  const absDir = join(root, relativeDir);
  const files = listFiles(absDir, '.astro');
  findings.push(...collectFindings(files, sourceBannedPatterns));
}

const distDir = join(root, 'dist');
if (existsSync(distDir)) {
  const distHtmlFiles = listFiles(distDir, '.html');
  findings.push(...collectFindings(distHtmlFiles, distBannedPatterns));
}

if (findings.length > 0) {
  console.error('Public content guard failed. Internal markers were found:');
  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} [${finding.label}] -> ${finding.excerpt}`);
  }
  process.exit(1);
}

console.log('Public content guard passed: no internal-note markers detected in public Astro files.');
