import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const distDir = 'dist';

function getAllPages(dir, pages = []) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllPages(path, pages);
    } else if (entry.name === 'index.html') {
      pages.push(path);
    }
  }
  return pages;
}

function checkSignals(html, pagePath) {
  const signals = {
    hasOG: !!html.match(/property="og:[^"]+"/),
    hasTwitter: !!html.match(/name="twitter:[^"]+"/),
    hasSchema: html.includes('application/ld+json'),
    hasGA4: html.includes('gtag') || html.includes('google-analytics'),
    hasMobileViewport: html.includes('name="viewport"') || html.includes('content="width=device-width'),
    hasGoogleVerify: html.includes('google-site-verification'),
    hasHreflang: html.includes('hreflang'),
    hasTitle: !!html.match(/<title>([^<]+)<\/title>/),
    hasMetaDesc: html.includes('name="description"'),
    hasH1: !!html.match(/<h1[^>]*>([^<]+)<\/h1>/),
    isNoindex: html.includes('noindex'),
  };
  
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : '';
  
  return { ...signals, title, pagePath };
}

const allPages = getAllPages(distDir);
console.log(`\n📊 COMPREHENSIVE SEO/GEO AUDIT - ${allPages.length} pages\n`);

// Group pages by type
const contentPages = [];
const redirectPages = [];
const otherPages = [];

const results = {
  og: 0, twitter: 0, schema: 0, ga4: 0, mobile: 0, google: 0, hreflang: 0,
  title: 0, desc: 0, h1: 0,
  noindex: 0, total: 0
};

const problemPages = [];

for (const pagePath of allPages) {
  const html = readFileSync(pagePath, 'utf8');
  const page = checkSignals(html, pagePath);
  
  results.total++;
  if (page.hasOG) results.og++;
  if (page.hasTwitter) results.twitter++;
  if (page.hasSchema) results.schema++;
  if (page.hasGA4) results.ga4++;
  if (page.hasMobileViewport) results.mobile++;
  if (page.hasGoogleVerify) results.google++;
  if (page.hasHreflang) results.hreflang++;
  if (page.hasTitle) results.title++;
  if (page.hasMetaDesc) results.desc++;
  if (page.hasH1) results.h1++;
  if (page.isNoindex) results.noindex++;
  
  // Track pages with issues
  if (page.isNoindex) {
    redirectPages.push(page);
  } else if (!page.hasOG || !page.hasTwitter || !page.hasSchema || !page.hasGA4 || !page.hasMobileViewport) {
    problemPages.push(page);
    contentPages.push(page);
  } else {
    contentPages.push(page);
  }
}

// Calculate percentages
const getPercent = (count) => Math.round((count / results.total) * 100);

console.log('✅ TRUST SIGNAL COVERAGE:\n');
console.log(`OG Tags:          ${results.og}/${results.total} (${getPercent(results.og)}%)`);
console.log(`Twitter Cards:    ${results.twitter}/${results.total} (${getPercent(results.twitter)}%)`);
console.log(`Schema.org:       ${results.schema}/${results.total} (${getPercent(results.schema)}%)`);
console.log(`GA4 Tracking:     ${results.ga4}/${results.total} (${getPercent(results.ga4)}%)`);
console.log(`Mobile Viewport:  ${results.mobile}/${results.total} (${getPercent(results.mobile)}%)`);
console.log(`Google Verify:    ${results.google}/${results.total} (${getPercent(results.google)}%)`);
console.log(`Hreflang:         ${results.hreflang}/${results.total} (${getPercent(results.hreflang)}%)`);

console.log('\n📝 CONTENT STRUCTURE:\n');
console.log(`Title Tags:       ${results.title}/${results.total} (${getPercent(results.title)}%)`);
console.log(`Meta Desc:        ${results.desc}/${results.total} (${getPercent(results.desc)}%)`);
console.log(`H1 Tags:          ${results.h1}/${results.total} (${getPercent(results.h1)}%)`);

console.log('\n🔍 PAGE CLASSIFICATION:\n');
console.log(`Content Pages:    ${contentPages.length}`);
console.log(`Redirect Pages:   ${redirectPages.length} (noindex - expected)`);
console.log(`Total:            ${results.total}`);

const avgScore = (results.og + results.twitter + results.schema + results.ga4 + results.mobile + results.google + results.hreflang + results.title + results.desc + results.h1) / (results.total * 10) * 100;
console.log(`\n📈 AVERAGE SEO SCORE: ${Math.round(avgScore)}%`);

if (problemPages.length > 0) {
  console.log(`\n⚠️  PAGES WITH ISSUES (${problemPages.length}):\n`);
  const sampled = problemPages.slice(0, 10);
  sampled.forEach(p => {
    const missing = [];
    if (!p.hasOG) missing.push('OG');
    if (!p.hasTwitter) missing.push('Twitter');
    if (!p.hasSchema) missing.push('Schema');
    if (!p.hasGA4) missing.push('GA4');
    if (!p.hasMobileViewport) missing.push('Mobile');
    console.log(`  ${p.pagePath.replace('dist', '')} - Missing: ${missing.join(', ')}`);
  });
  console.log(`  ... and ${problemPages.length - 10} more` + (problemPages.length > 10 ? '' : ''));
}

console.log('\n📊 CONSISTENCY ANALYSIS:\n');
const consistency = Math.round((((results.og + results.twitter + results.schema + results.ga4 + results.mobile + results.google + results.hreflang) / 7) / results.total) * 100);
console.log(`SEO Signal Consistency: ${consistency}%`);
console.log(`All pages have SAME ranking potential? ${consistency >= 98 ? '✅ YES (98%+ consistent)' : `⚠️  NO (${consistency}% - some variance)`}`);

console.log('\n🎯 GOOGLE FIRST PAGE RANKING PROBABILITY:\n');
console.log(`Pages with full SEO suite (all 7 signals): ${Math.min(results.og, results.twitter, results.schema, results.ga4, results.mobile, results.google, results.hreflang)} pages`);
console.log(`Ranking probability: ${consistency >= 98 ? 'Equal for all' : 'Varies by page completeness'}`);
