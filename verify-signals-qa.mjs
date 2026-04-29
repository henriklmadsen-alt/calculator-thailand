import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

function checkOG(html) { return /og:title|og:description|og:image/.test(html) ? 1 : 0; }
function checkTwitter(html) { return /twitter:card|twitter:title|twitter:description/.test(html) ? 1 : 0; }
function checkSchema(html) { return /"@context"|"@type"/.test(html) ? 1 : 0; }
function checkGA4(html) { return /G-[A-Z0-9]+/.test(html) ? 1 : 0; }
function checkMobileViewport(html) { return /viewport.*width=device-width/.test(html) ? 1 : 0; }
function checkSentry(html) { return /sentry|Sentry/.test(html) ? 1 : 0; }
function checkPWA(html) { return /manifest\.json|pwa/.test(html) ? 1 : 0; }

function getRandomPages(count) {
  const pages = [];
  const walk = (dir) => {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (file === 'index.html' && fullPath.startsWith(distDir)) {
        pages.push(fullPath);
      }
    });
  };
  walk(distDir);
  
  const shuffled = pages.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, pages.length));
}

const samples = getRandomPages(100);
let og = 0, twitter = 0, schema = 0, ga4 = 0, viewport = 0, sentry = 0, pwa = 0;

console.log(`\n🔍 QA TRUST SIGNAL VERIFICATION (${samples.length} pages)\n`);

samples.forEach((htmlPath) => {
  const html = fs.readFileSync(htmlPath, 'utf8');
  og += checkOG(html);
  twitter += checkTwitter(html);
  schema += checkSchema(html);
  ga4 += checkGA4(html);
  viewport += checkMobileViewport(html);
  sentry += checkSentry(html);
  pwa += checkPWA(html);
});

const n = samples.length;
console.log(`OG Tags:         ${og}/${n} (${(og/n*100).toFixed(0)}%) ${og === n ? '✓' : '⚠'}`);
console.log(`Twitter Card:    ${twitter}/${n} (${(twitter/n*100).toFixed(0)}%) ${twitter === n ? '✓' : '⚠'}`);
console.log(`Schema.org:      ${schema}/${n} (${(schema/n*100).toFixed(0)}%) ${schema === n ? '✓' : '⚠'}`);
console.log(`GA4 Tracking:    ${ga4}/${n} (${(ga4/n*100).toFixed(0)}%) ${ga4 === n ? '✓' : '⚠'}`);
console.log(`Mobile Viewport: ${viewport}/${n} (${(viewport/n*100).toFixed(0)}%) ${viewport === n ? '✓' : '⚠'}`);
console.log(`Sentry Monitoring: ${sentry}/${n} (${(sentry/n*100).toFixed(0)}%) ${sentry === n ? '✓' : '⚠'}`);
console.log(`PWA Manifest:    ${pwa}/${n} (${(pwa/n*100).toFixed(0)}%) ${pwa === n ? '✓' : '⚠'}`);

const allGood = og >= n * 0.95 && twitter >= n * 0.95 && schema >= n * 0.95 && ga4 >= n * 0.95 && viewport >= n * 0.95;
console.log(`\n${allGood ? '✅ TRUST SIGNALS HEALTHY' : '❌ TRUST SIGNALS BELOW THRESHOLD'}\n`);
process.exit(allGood ? 0 : 1);
