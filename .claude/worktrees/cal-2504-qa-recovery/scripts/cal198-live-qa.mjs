import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const baseUrl = process.env.CAL198_BASE_URL || 'https://www.kamnuanlek.com';
const runDate = process.env.CAL198_RUN_DATE || '2026-04-16';
const reportDir = join('reports', 'qa', 'cal-198', runDate);
const screenshotDir = join(reportDir, 'screenshots');
const regressionOwner = 'CTO';

function isRoutePass(routeResult) {
  return routeResult.availability && routeResult.functional && !routeResult.desktopOverflow && !routeResult.mobileOverflow && routeResult.thaiCopy;
}

const routeSpecs = [
  {
    path: '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93-bmi/',
    promise: 'BMI category calculator shows BMI score and category.',
    fill: { weight: 70, height: 170 },
    submit: '#btn-calculate',
    resultSelectors: [
      { selector: '#bmi-value', kind: 'numeric' },
      { selector: '#bmi-category', kind: 'text' },
    ],
  },
  {
    path: '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%A3%E0%B8%96/',
    promise: 'Vehicle installment calculator returns monthly payment and debt ratio.',
    fill: {
      'car-price': 850000,
      'down-payment': 20,
      'interest-rate': 2.89,
      'term-years': 6,
    },
    submit: '#vehicle-submit-btn',
    resultSelectors: ['#res-monthly', '#res-income-ratio'],
  },
  {
    path: '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%81%E0%B8%B9%E0%B9%89/',
    promise: 'Loan calculator returns monthly installment and total interest.',
    fill: {
      principal: 1200000,
      'interest-rate': 6.5,
      'term-years': 20,
    },
    submit: '#loan-form button[type="submit"]',
    resultSelectors: ['#res-monthly', '#res-interest'],
  },
  {
    path: '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/',
    promise: 'Mortgage refinance calculator returns delta, savings, and break-even.',
    fill: {
      'outstanding-balance': 2800000,
      'remaining-years': 22,
      'current-rate': 6.25,
      'refinance-rate': 3.35,
      'refinance-term-years': 25,
      'refinance-fees': 55000,
      'extra-payment': 2000,
    },
    submit: '#mortgage-submit-btn',
    resultSelectors: ['#res-new-monthly', '#res-total-saving', '#res-break-even'],
  },
  {
    path: '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95/',
    promise: 'Credit-card calculator returns payable interest and next balance.',
    fill: {
      'statement-balance': 50000,
      'payment-amount': 8000,
      'annual-interest-rate': 16,
      'min-payment-rate': 8,
      'days-before-due': 20,
      'days-after-payment': 10,
    },
    submit: '#cc-submit-btn',
    resultSelectors: ['#res-total-interest', '#res-next-balance'],
  },
  {
    path: '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%9D%E0%B8%B2%E0%B8%81/',
    promise: 'Deposit calculator returns net interest and total maturity amount.',
    fill: {
      principal: 250000,
      'interest-rate': 2.1,
      'term-months': 24,
    },
    submit: '#deposit-submit-btn',
    resultSelectors: ['#res-net-interest', '#res-total'],
  },
  {
    path: '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B8%A1%E0%B8%B9%E0%B8%A5%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%80%E0%B8%9E%E0%B8%B4%E0%B9%88%E0%B8%A1/',
    promise: 'VAT calculator returns before-vat amount and VAT amount.',
    fill: {
      'single-price': 1070,
    },
    submit: '#btn-calculate',
    resultSelectors: ['#res-before', '#res-vat', '#res-total'],
  },
  {
    path: '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%9A%E0%B8%B8%E0%B8%84%E0%B8%84%E0%B8%A5%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%94%E0%B8%B2/',
    promise: 'PIT calculator returns annual tax and monthly take-home pay.',
    fill: {
      'monthly-salary': 60000,
      'other-income': 150000,
      'personal-allowance': 60000,
      'spouse-allowance': 0,
      'child-count': 1,
      'social-security': 9000,
      'life-insurance': 20000,
      'health-insurance': 10000,
      'provident-fund': 50000,
      'home-loan': 60000,
      donation: 0,
    },
    submit: '#tax-submit-btn',
    resultSelectors: ['#result-annual-tax', '#result-monthly-take-home'],
  },
  {
    path: '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%AD%E0%B8%B2%E0%B8%A2%E0%B8%B8/',
    promise: 'Age calculator returns age in years/months/days and next birthday.',
    fill: {
      'birth-day': 15,
      'birth-month': 4,
      'birth-year': 2533,
    },
    submit: '#age-form button[type="submit"]',
    resultSelectors: ['#res-years', '#res-next-birthday'],
  },
  {
    path: '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%94%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B8%97%E0%B8%98%E0%B8%B4/',
    promise: 'Net salary calculator returns monthly net salary and deductions.',
    fill: {
      'gross-salary': 50000,
      'child-count': 1,
      'extra-deductions': 0,
    },
    submit: '#btn-calculate',
    resultSelectors: ['#res-net', '#res-total-deductions'],
  },
  {
    path: '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B9%80%E0%B8%99%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/',
    promise: 'Home-transfer-fee calculator returns buyer/seller transfer costs.',
    fill: {
      'sale-price': 6000000,
      'appraised-price': 5800000,
      'mortgage-amount': 4500000,
      'seller-type': 'individual',
      'individual-wht': 95000,
      'has-specific-business-tax': true,
      'reduced-fee-eligible': false,
    },
    submit: '#home-transfer-form button[type="submit"]',
    resultSelectors: ['#res-transfer-fee', '#res-total-costs'],
  },
  {
    path: '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%AD%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%81%E0%B9%80%E0%B8%9B%E0%B8%A5%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%99/',
    promise: 'FX calculator returns net amount, spread amount, and effective rate.',
    fill: {
      'fx-amount': 1200,
      'fx-spread': 0.65,
      'fx-from': 'USD',
      'fx-to': 'THB',
    },
    submit: '#fx-submit-btn',
    resultSelectors: ['#res-net-amount', '#res-effective-rate'],
  },
];

const regressionCriticalPaths = new Set([
  '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%A3%E0%B8%96/',
  '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95/',
  '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%9A%E0%B8%B8%E0%B8%84%E0%B8%84%E0%B8%A5%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%94%E0%B8%B2/',
  '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%80%E0%B8%94%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B8%97%E0%B8%98%E0%B8%B4/',
  '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B9%80%E0%B8%99%E0%B8%B5%E0%B8%A2%E0%B8%A1%E0%B9%82%E0%B8%AD%E0%B8%99%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99/',
  '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%AD%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%81%E0%B9%80%E0%B8%9B%E0%B8%A5%E0%B8%B5%E0%B9%88%E0%B8%A2%E0%B8%99/',
]);

function makeSlug(pathname) {
  return decodeURIComponent(pathname)
    .replaceAll('/', '')
    .replaceAll(' ', '-')
    .replace(/[^\w\u0E00-\u0E7F-]/g, '_');
}

async function fetchSitemapCalculatorPaths(url) {
  const res = await fetch(url);
  const xml = await res.text();
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  const paths = matches
    .map((loc) => {
      try {
        const parsed = new URL(loc);
        return parsed.pathname;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  return paths.filter((pathname) => pathname.startsWith('/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93') || pathname.startsWith('/คำนวณ'));
}

function normalizeResultSpec(entry) {
  if (typeof entry === 'string') {
    return { selector: entry, kind: 'numeric' };
  }
  return {
    selector: entry.selector,
    kind: entry.kind || 'numeric',
  };
}

function isResolvedResultText(text, kind) {
  if (!text) {
    return false;
  }
  if (text === '-' || /NaN|undefined/i.test(text)) {
    return false;
  }
  if (kind === 'text') {
    return true;
  }
  return /[0-9]/.test(text);
}

async function fillField(page, id, value) {
  const locator = page.locator(`#${id}`);
  if ((await locator.count()) === 0) {
    return { ok: false, reason: `missing input #${id}` };
  }
  const visible = await locator.first().isVisible().catch(() => false);
  if (!visible) {
    return { ok: true, skipped: true };
  }

  const tagName = await locator.evaluate((el) => el.tagName.toLowerCase());
  if (tagName === 'select') {
    await locator.selectOption(String(value));
    return { ok: true };
  }

  const type = (await locator.getAttribute('type')) || 'text';
  if (type === 'checkbox') {
    if (value) {
      await locator.check();
    } else {
      await locator.uncheck();
    }
    return { ok: true };
  }

  await locator.click({ clickCount: 3 });
  await locator.fill(String(value));
  return { ok: true };
}

async function runRouteCheck(browser, spec) {
  const decodedPath = decodeURIComponent(spec.path);
  const url = `${baseUrl}${spec.path}`;
  const slug = makeSlug(spec.path);
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
  const desktopPage = await desktopContext.newPage();
  const mobilePage = await mobileContext.newPage();

  const record = {
    path: decodedPath,
    promise: spec.promise,
    url,
    regressionTier: regressionCriticalPaths.has(spec.path) ? 'top' : 'standard',
    availability: false,
    statusCode: null,
    thaiCopy: false,
    desktopOverflow: null,
    mobileOverflow: null,
    functional: false,
    details: [],
    screenshots: {
      desktop: join(screenshotDir, `${slug}-desktop.png`).replaceAll('\\', '/'),
      mobile: join(screenshotDir, `${slug}-mobile.png`).replaceAll('\\', '/'),
    },
  };

  try {
    const response = await desktopPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    record.statusCode = response ? response.status() : null;
    record.availability = record.statusCode === 200;

    await desktopPage.waitForTimeout(500);
    const h1Node = desktopPage.locator('h1').first();
    const h1Exists = (await h1Node.count()) > 0;
    const h1Text = h1Exists ? (((await h1Node.textContent()) || '').trim()) : '';
    record.thaiCopy = h1Exists && /[\u0E00-\u0E7F]/.test(h1Text);
    if (!record.thaiCopy) {
      record.details.push('H1 Thai copy missing on desktop view.');
    }

    record.desktopOverflow = await desktopPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (record.desktopOverflow) {
      record.details.push('Desktop horizontal overflow detected.');
    }

    await desktopPage.screenshot({ path: record.screenshots.desktop, fullPage: true });

    await mobilePage.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await mobilePage.waitForTimeout(500);
    record.mobileOverflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (record.mobileOverflow) {
      record.details.push('Mobile horizontal overflow detected.');
    }
    await mobilePage.screenshot({ path: record.screenshots.mobile, fullPage: true });

    if (!record.availability) {
      record.details.push(`Route unavailable (HTTP ${record.statusCode}).`);
      return record;
    }

    const fillErrors = [];
    for (const [id, value] of Object.entries(spec.fill)) {
      const result = await fillField(desktopPage, id, value);
      if (!result.ok) {
        fillErrors.push(result.reason);
      }
    }
    if (fillErrors.length > 0) {
      record.details.push(...fillErrors);
    }

    if (spec.submit) {
      const submitButton = desktopPage.locator(spec.submit).first();
      if ((await submitButton.count()) === 0) {
        record.details.push(`Submit control missing: ${spec.submit}`);
      } else {
        await submitButton.click();
      }
    }

    await desktopPage.waitForTimeout(1200);

    const resultSpecs = spec.resultSelectors.map((entry) => normalizeResultSpec(entry));
    let validResultCount = 0;
    for (const resultSpec of resultSpecs) {
      const { selector, kind } = resultSpec;
      const resultNode = desktopPage.locator(selector).first();
      if ((await resultNode.count()) === 0) {
        record.details.push(`Missing result selector: ${selector}`);
        continue;
      }
      const text = ((await resultNode.textContent()) || '').trim();
      const visible = await resultNode.isVisible();
      if (visible && isResolvedResultText(text, kind)) {
        validResultCount += 1;
      } else {
        record.details.push(`Result not resolved for ${selector} (${kind}): "${text}"`);
      }
    }

    record.functional = fillErrors.length === 0 && validResultCount === resultSpecs.length;
  } catch (error) {
    record.details.push(`Unhandled error: ${String(error)}`);
  } finally {
    await desktopPage.close();
    await mobilePage.close();
    await desktopContext.close();
    await mobileContext.close();
  }

  return record;
}

function buildMarkdown(results, sitemapPaths) {
  const now = new Date().toISOString();
  const passCount = results.filter((r) => isRoutePass(r)).length;
  const failCount = results.length - passCount;
  const topRegressionResults = results.filter((r) => r.regressionTier === 'top');
  const topRegressionPassCount = topRegressionResults.filter((r) => isRoutePass(r)).length;
  const releaseGateVerdict = topRegressionPassCount === topRegressionResults.length ? 'PASS' : 'FAIL';
  const missingFromSitemap = results
    .filter((r) => !sitemapPaths.includes(encodeURI(r.path)))
    .map((r) => r.path);

  const lines = [];
  lines.push('# CAL-198 Live Calculator QA Gate');
  lines.push('');
  lines.push(`Generated at: ${now}`);
  lines.push(`Base URL: ${baseUrl}`);
  lines.push('');
  lines.push('## Inventory');
  lines.push('');
  lines.push(`- Calculator routes validated: ${results.length}`);
  lines.push(`- Routes in sitemap: ${sitemapPaths.length}`);
  lines.push(`- Full-pass routes: ${passCount}`);
  lines.push(`- Failing routes: ${failCount}`);
  lines.push(`- Top-calculator regression checks: ${topRegressionResults.length}`);
  lines.push(`- Top-calculator regressions passed: ${topRegressionPassCount}`);
  lines.push(`- Release gate verdict: ${releaseGateVerdict}`);
  lines.push(`- Regression gate owner: ${regressionOwner}`);
  lines.push('');
  lines.push('## Post-Deploy Regression Gate');
  lines.push('');
  lines.push('| Route | Tier | Verdict |');
  lines.push('| --- | --- | --- |');
  for (const r of topRegressionResults) {
    lines.push(`| ${r.path} | top | ${isRoutePass(r) ? 'PASS' : 'FAIL'} |`);
  }
  lines.push('');
  if (releaseGateVerdict === 'FAIL') {
    lines.push('Regression gate failed: release must be treated as failed and escalated immediately.');
    lines.push('');
  }
  if (missingFromSitemap.length > 0) {
    lines.push('### Routes missing from sitemap');
    lines.push('');
    for (const route of missingFromSitemap) {
      lines.push(`- ${route}`);
    }
    lines.push('');
  }
  lines.push('## Pass/Fail Matrix');
  lines.push('');
  lines.push('| Route | HTTP | Thai Copy | Desktop Overflow | Mobile Overflow | Functional | Verdict |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- |');
  for (const r of results) {
    const verdict = isRoutePass(r) ? 'PASS' : 'FAIL';
    lines.push(`| ${r.path} | ${r.statusCode ?? 'n/a'} | ${r.thaiCopy ? 'pass' : 'fail'} | ${r.desktopOverflow ? 'fail' : 'pass'} | ${r.mobileOverflow ? 'fail' : 'pass'} | ${r.functional ? 'pass' : 'fail'} | ${verdict} |`);
  }
  lines.push('');
  lines.push('## Evidence');
  lines.push('');
  for (const r of results) {
    lines.push(`### ${r.path}`);
    lines.push('');
    lines.push(`- Promise: ${r.promise}`);
    lines.push(`- Desktop screenshot: \`${r.screenshots.desktop}\``);
    lines.push(`- Mobile screenshot: \`${r.screenshots.mobile}\``);
    if (r.details.length > 0) {
      lines.push('- Findings:');
      for (const item of r.details) {
        lines.push(`  - ${item}`);
      }
    } else {
      lines.push('- Findings: none');
    }
    lines.push('');
  }
  return lines.join('\n');
}

async function main() {
  mkdirSync(screenshotDir, { recursive: true });

  const sitemapPaths = await fetchSitemapCalculatorPaths(`${baseUrl}/sitemap-0.xml`);
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const spec of routeSpecs) {
    const result = await runRouteCheck(browser, spec);
    results.push(result);
    const verdict = isRoutePass(result) ? 'PASS' : 'FAIL';
    console.log(`${verdict} ${result.path} (HTTP ${result.statusCode ?? 'n/a'})`);
  }
  await browser.close();

  const topRegressionResults = results.filter((r) => r.regressionTier === 'top');
  const topRegressionPassCount = topRegressionResults.filter((r) => isRoutePass(r)).length;
  const releaseGateVerdict = topRegressionPassCount === topRegressionResults.length ? 'PASS' : 'FAIL';
  const markdown = buildMarkdown(results, sitemapPaths);
  const json = {
    meta: {
      generatedAt: new Date().toISOString(),
      baseUrl,
      runDate,
      checkedRoutes: routeSpecs.length,
      sitemapCalculatorRoutes: sitemapPaths.length,
      topRegressionRoutes: topRegressionResults.length,
      topRegressionPassed: topRegressionPassCount,
      releaseGateVerdict,
      regressionOwner,
    },
    inventory: {
      checked: routeSpecs.map((r) => decodeURIComponent(r.path)),
      sitemap: sitemapPaths.map((p) => decodeURIComponent(p)),
    },
    results,
  };

  const mdPath = join(reportDir, 'live-calculator-qa-gate.md');
  const jsonPath = join(reportDir, 'live-calculator-qa-gate.json');
  writeFileSync(mdPath, markdown, 'utf8');
  writeFileSync(jsonPath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
  console.log(`Saved markdown report: ${mdPath}`);
  console.log(`Saved json report: ${jsonPath}`);
  console.log(`Release gate verdict: ${releaseGateVerdict}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
