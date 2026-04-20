import { chromium } from 'playwright';
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const baseUrl = process.env.CAL216_BASE_URL || 'http://127.0.0.1:4321';
const runDate = process.env.CAL216_RUN_DATE || new Date().toISOString().slice(0, 10);
const variant = process.env.CAL216_VARIANT || 'local';
const reportDir = join('reports', 'qa', 'cal-216', runDate, variant);
const screenshotDir = join(reportDir, 'screenshots');
const jsonPath = join(reportDir, 'darkmode-article-routes.json');
const markdownPath = join(reportDir, 'darkmode-article-routes.md');
const themeStorageKey = 'ct.theme-preference.v1';
const articlePrefix = '/บทความ/';
const includeIndex = String(process.env.CAL216_INCLUDE_INDEX || 'true').toLowerCase() !== 'false';
const maxRoutes = Number.parseInt(process.env.CAL216_MAX_ROUTES || '0', 10);
const articleSourceDir = join('src', 'pages', 'บทความ');

function normalizePath(pathname) {
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    decoded = pathname;
  }
  if (!decoded.startsWith('/')) {
    decoded = `/${decoded}`;
  }
  if (!decoded.endsWith('/')) {
    decoded = `${decoded}/`;
  }
  return decoded;
}

function routeSlug(pathname) {
  if (pathname === '/') return 'home';
  return pathname
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^\w\u0E00-\u0E7F-]+/g, '_');
}

function discoverArticleRoutes() {
  const entries = readdirSync(articleSourceDir, { withFileTypes: true });
  const routes = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    routes.push(normalizePath(`${articlePrefix}${entry.name}/`));
  }
  if (includeIndex) {
    routes.unshift(articlePrefix);
  }
  const deduped = [...new Set(routes)];
  deduped.sort((left, right) => left.localeCompare(right, 'th'));
  if (includeIndex) {
    deduped.sort((left, right) => {
      if (left === articlePrefix) return -1;
      if (right === articlePrefix) return 1;
      return left.localeCompare(right, 'th');
    });
  }
  if (Number.isFinite(maxRoutes) && maxRoutes > 0) {
    return deduped.slice(0, maxRoutes);
  }
  return deduped;
}

function buildMarkdown(payload) {
  const { generatedAt, results, routesChecked, passCount, failCount } = payload;
  const lines = [];
  lines.push('# CAL-216 Dark-Mode QA Evidence (Article Routes)');
  lines.push('');
  lines.push(`Generated at: ${generatedAt}`);
  lines.push(`Base URL: ${baseUrl}`);
  lines.push(`Variant: ${variant}`);
  lines.push(`Theme mode: dark (forced via localStorage key \`${themeStorageKey}\`)`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Routes checked: ${routesChecked}`);
  lines.push(`- PASS: ${passCount}`);
  lines.push(`- FAIL: ${failCount}`);
  lines.push('');
  lines.push('## Route Matrix');
  lines.push('');
  lines.push('| Route | Desktop HTTP | Mobile HTTP | Desktop Theme | Mobile Theme | Desktop Overflow | Mobile Overflow | Desktop Contrast Failures | Mobile Contrast Failures | Verdict |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const result of results) {
    lines.push(
      `| ${result.path} | ${result.desktop.statusCode ?? 'n/a'} | ${result.mobile.statusCode ?? 'n/a'} | ${result.desktop.theme ?? 'n/a'} | ${result.mobile.theme ?? 'n/a'} | ${result.desktop.overflow ? 'fail' : 'pass'} | ${result.mobile.overflow ? 'fail' : 'pass'} | ${result.desktop.contrastFailures.length} | ${result.mobile.contrastFailures.length} | ${result.verdict} |`,
    );
  }
  lines.push('');

  for (const result of results) {
    lines.push(`## ${result.path}`);
    lines.push('');
    lines.push(`- Desktop screenshot: \`${result.desktop.screenshot}\``);
    lines.push(`- Mobile screenshot: \`${result.mobile.screenshot}\``);
    lines.push(`- Desktop scanned text nodes: ${result.desktop.scannedNodes}`);
    lines.push(`- Mobile scanned text nodes: ${result.mobile.scannedNodes}`);
    if (result.desktop.contrastFailures.length === 0 && result.mobile.contrastFailures.length === 0) {
      lines.push('- Contrast findings: none');
    } else {
      lines.push('- Contrast findings:');
      for (const failure of result.desktop.contrastFailures) {
        lines.push(`  - Desktop ${failure.selector}: ratio ${failure.ratio.toFixed(2)} < ${failure.minimumRatio.toFixed(1)}`);
      }
      for (const failure of result.mobile.contrastFailures) {
        lines.push(`  - Mobile ${failure.selector}: ratio ${failure.ratio.toFixed(2)} < ${failure.minimumRatio.toFixed(1)}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

async function runContrastScan(page) {
  return page.evaluate(() => {
    function parseColor(value) {
      const match = value.match(/^rgba?\(([^)]+)\)$/i);
      if (!match) return null;
      const parts = match[1].split(',').map((entry) => Number.parseFloat(entry.trim()));
      if (parts.length < 3) return null;
      const [r, g, b] = parts;
      const alpha = parts.length > 3 && Number.isFinite(parts[3]) ? parts[3] : 1;
      return [r, g, b, alpha];
    }

    function toLinear(channel) {
      const normalized = channel / 255;
      if (normalized <= 0.03928) return normalized / 12.92;
      return ((normalized + 0.055) / 1.055) ** 2.4;
    }

    function luminance(rgb) {
      const [r, g, b] = rgb;
      return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    }

    function ratio(foregroundRgb, backgroundRgb) {
      const fg = luminance(foregroundRgb);
      const bg = luminance(backgroundRgb);
      const lighter = Math.max(fg, bg);
      const darker = Math.min(fg, bg);
      return (lighter + 0.05) / (darker + 0.05);
    }

    function blend(top, bottom) {
      const alpha = top[3];
      if (alpha >= 1) return top.slice(0, 3);
      const inverse = 1 - alpha;
      return [
        Math.round(top[0] * alpha + bottom[0] * inverse),
        Math.round(top[1] * alpha + bottom[1] * inverse),
        Math.round(top[2] * alpha + bottom[2] * inverse),
      ];
    }

    function selectorFor(node) {
      if (node.id) return `#${node.id}`;
      const classes = [...node.classList].slice(0, 2).join('.');
      if (classes) return `${node.tagName.toLowerCase()}.${classes}`;
      return node.tagName.toLowerCase();
    }

    function nearestBackground(node, fallback) {
      let current = node;
      while (current) {
        const style = window.getComputedStyle(current);
        const bg = parseColor(style.backgroundColor);
        if (bg && bg[3] > 0) {
          return blend(bg, fallback);
        }
        current = current.parentElement;
      }
      return fallback;
    }

    const bodyColor = parseColor(window.getComputedStyle(document.body).backgroundColor) || [2, 6, 23, 1];
    const fallbackBackground = blend(bodyColor, [2, 6, 23, 1]);
    const failures = [];
    let scannedNodes = 0;

    for (const node of document.querySelectorAll('body *')) {
      if (!(node instanceof HTMLElement)) continue;
      if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH'].includes(node.tagName)) continue;
      if (node.children.length > 0 && node.textContent?.trim() === node.innerText?.trim()) continue;

      const style = window.getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden' || Number.parseFloat(style.opacity || '1') === 0) {
        continue;
      }

      const text = (node.innerText || '').trim();
      if (!text) continue;

      const fg = parseColor(style.color);
      if (!fg) continue;
      scannedNodes += 1;

      const foreground = blend(fg, fallbackBackground);
      const background = nearestBackground(node, fallbackBackground);
      const contrast = ratio(foreground, background);
      const fontSize = Number.parseFloat(style.fontSize || '16');
      const fontWeight = Number.parseInt(style.fontWeight || '400', 10);
      const isLarge = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
      const minimumRatio = isLarge ? 3 : 4.5;
      if (contrast < minimumRatio) {
        failures.push({
          selector: selectorFor(node),
          ratio: contrast,
          minimumRatio,
          sample: text.slice(0, 80),
        });
      }
    }

    return {
      scannedNodes,
      failures: failures.slice(0, 25),
      failureCount: failures.length,
    };
  });
}

async function runViewportCheck(page, url, screenshotPath) {
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(600);
  const state = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme || null,
    themePreference: document.documentElement.dataset.themePreference || null,
    overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
  }));
  const contrast = await runContrastScan(page);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  return {
    statusCode: response ? response.status() : null,
    theme: state.theme,
    themePreference: state.themePreference,
    overflow: state.overflow,
    scannedNodes: contrast.scannedNodes,
    contrastFailures: contrast.failures,
    contrastFailureCount: contrast.failureCount,
    screenshot: screenshotPath.replaceAll('\\', '/'),
  };
}

async function runRoute(browser, path) {
  const slug = routeSlug(path);
  const url = new URL(encodeURI(path), baseUrl).toString();
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });

  desktopContext.addInitScript((storageKey) => {
    window.localStorage.setItem(storageKey, 'dark');
  }, themeStorageKey);
  mobileContext.addInitScript((storageKey) => {
    window.localStorage.setItem(storageKey, 'dark');
  }, themeStorageKey);

  const desktopPage = await desktopContext.newPage();
  const mobilePage = await mobileContext.newPage();
  const result = {
    path,
    url,
    desktop: {
      statusCode: null,
      theme: null,
      themePreference: null,
      overflow: false,
      scannedNodes: 0,
      contrastFailures: [],
      contrastFailureCount: 0,
      screenshot: join(screenshotDir, `${slug}-desktop-dark.png`).replaceAll('\\', '/'),
    },
    mobile: {
      statusCode: null,
      theme: null,
      themePreference: null,
      overflow: false,
      scannedNodes: 0,
      contrastFailures: [],
      contrastFailureCount: 0,
      screenshot: join(screenshotDir, `${slug}-mobile-dark.png`).replaceAll('\\', '/'),
    },
    verdict: 'PASS',
    checks: [],
  };

  try {
    result.desktop = await runViewportCheck(desktopPage, url, result.desktop.screenshot);
    result.mobile = await runViewportCheck(mobilePage, url, result.mobile.screenshot);
  } finally {
    await desktopPage.close();
    await mobilePage.close();
    await desktopContext.close();
    await mobileContext.close();
  }

  const checks = [
    { name: 'desktop-http-200', ok: result.desktop.statusCode === 200 },
    { name: 'mobile-http-200', ok: result.mobile.statusCode === 200 },
    { name: 'desktop-theme-dark', ok: result.desktop.theme === 'dark' && result.desktop.themePreference === 'dark' },
    { name: 'mobile-theme-dark', ok: result.mobile.theme === 'dark' && result.mobile.themePreference === 'dark' },
    { name: 'desktop-no-overflow', ok: !result.desktop.overflow },
    { name: 'mobile-no-overflow', ok: !result.mobile.overflow },
    { name: 'desktop-contrast-pass', ok: result.desktop.contrastFailureCount === 0 },
    { name: 'mobile-contrast-pass', ok: result.mobile.contrastFailureCount === 0 },
  ];
  result.checks = checks;
  result.verdict = checks.every((check) => check.ok) ? 'PASS' : 'FAIL';
  return result;
}

async function main() {
  mkdirSync(screenshotDir, { recursive: true });
  const routes = discoverArticleRoutes();
  if (routes.length === 0) {
    throw new Error(`No article routes discovered under ${articleSourceDir}`);
  }
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const path of routes) {
      const outcome = await runRoute(browser, path);
      results.push(outcome);
      console.log(
        `${outcome.verdict} ${path} | desktop=${outcome.desktop.statusCode ?? 'n/a'} dark=${String(outcome.desktop.theme)} contrastFail=${outcome.desktop.contrastFailureCount} | mobile=${outcome.mobile.statusCode ?? 'n/a'} dark=${String(outcome.mobile.theme)} contrastFail=${outcome.mobile.contrastFailureCount}`,
      );
    }
  } finally {
    await browser.close();
  }

  const passCount = results.filter((entry) => entry.verdict === 'PASS').length;
  const failCount = results.length - passCount;
  const payload = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    runDate,
    variant,
    theme: 'dark',
    routePrefix: articlePrefix,
    includeIndex,
    routesChecked: results.length,
    passCount,
    failCount,
    results,
  };

  writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  writeFileSync(markdownPath, `${buildMarkdown(payload)}\n`, 'utf8');
  console.log(`Saved JSON: ${jsonPath}`);
  console.log(`Saved Markdown: ${markdownPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
