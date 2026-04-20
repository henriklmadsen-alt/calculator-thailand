import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const baseUrl = process.env.CAL214_BASE_URL || 'http://127.0.0.1:4321';
const runDate = process.env.CAL214_RUN_DATE || new Date().toISOString().slice(0, 10);
const reportDir = join('reports', 'qa', 'cal-214', runDate);
const screenshotDir = join(reportDir, 'screenshots');
const jsonPath = join(reportDir, 'darkmode-contrast-check.json');
const markdownPath = join(reportDir, 'darkmode-contrast-check.md');
const themeStorageKey = 'ct.theme-preference.v1';

const routes = [
  { path: '/', label: 'home' },
  { path: '/คำนวณภาษีเงินได้บุคคลธรรมดา/', label: 'calculator-pit' },
  { path: '/บทความ/', label: 'article-index' },
];

function routeSlug(pathname) {
  if (pathname === '/') return 'home';
  return pathname
    .replaceAll('/', '')
    .replace(/[^\w\u0E00-\u0E7F-]/g, '_');
}

function buildMarkdown(results) {
  const generatedAt = new Date().toISOString();
  const passCount = results.filter((result) => result.verdict === 'PASS').length;
  const failCount = results.length - passCount;

  const lines = [];
  lines.push('# CAL-214 Dark Mode Contrast QA');
  lines.push('');
  lines.push(`Generated at: ${generatedAt}`);
  lines.push(`Base URL: ${baseUrl}`);
  lines.push(`Theme mode: dark (forced by localStorage key \`${themeStorageKey}\`)`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Routes checked: ${results.length}`);
  lines.push(`- PASS: ${passCount}`);
  lines.push(`- FAIL: ${failCount}`);
  lines.push('');
  lines.push('## Route Matrix');
  lines.push('');
  lines.push('| Route | Desktop Overflow | Mobile Overflow | Desktop Contrast Failures | Mobile Contrast Failures | Verdict |');
  lines.push('| --- | --- | --- | --- | --- | --- |');
  for (const result of results) {
    lines.push(
      `| ${result.path} | ${result.desktop.overflow ? 'fail' : 'pass'} | ${result.mobile.overflow ? 'fail' : 'pass'} | ${result.desktop.contrastFailures.length} | ${result.mobile.contrastFailures.length} | ${result.verdict} |`,
    );
  }
  lines.push('');

  for (const result of results) {
    lines.push(`## ${result.path}`);
    lines.push('');
    lines.push(`- Desktop screenshot: \`${result.desktop.screenshot}\``);
    lines.push(`- Mobile screenshot: \`${result.mobile.screenshot}\``);
    lines.push(`- Desktop text nodes scanned: ${result.desktop.scannedNodes}`);
    lines.push(`- Mobile text nodes scanned: ${result.mobile.scannedNodes}`);
    if (result.desktop.contrastFailures.length === 0 && result.mobile.contrastFailures.length === 0) {
      lines.push('- Contrast findings: none');
    } else {
      lines.push('- Contrast findings:');
      for (const failure of result.desktop.contrastFailures) {
        lines.push(
          `  - Desktop ratio ${failure.ratio.toFixed(2)} < ${failure.minimumRatio.toFixed(1)} at \`${failure.selector}\``,
        );
      }
      for (const failure of result.mobile.contrastFailures) {
        lines.push(
          `  - Mobile ratio ${failure.ratio.toFixed(2)} < ${failure.minimumRatio.toFixed(1)} at \`${failure.selector}\``,
        );
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

async function runContrastScan(page) {
  return page.evaluate(() => {
    function parseColor(color) {
      const match = color.match(/^rgba?\(([^)]+)\)$/i);
      if (!match) return null;
      const parts = match[1].split(',').map((part) => Number.parseFloat(part.trim()));
      if (parts.length < 3) return null;
      const [r, g, b] = parts;
      const a = parts.length > 3 ? parts[3] : 1;
      return [r, g, b, Number.isFinite(a) ? a : 1];
    }

    function channelToLinear(channel) {
      const normalized = channel / 255;
      if (normalized <= 0.03928) {
        return normalized / 12.92;
      }
      return ((normalized + 0.055) / 1.055) ** 2.4;
    }

    function relativeLuminance(rgb) {
      const [r, g, b] = rgb;
      const red = channelToLinear(r);
      const green = channelToLinear(g);
      const blue = channelToLinear(b);
      return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    }

    function contrastRatio(foregroundRgb, backgroundRgb) {
      const fgLum = relativeLuminance(foregroundRgb);
      const bgLum = relativeLuminance(backgroundRgb);
      const lighter = Math.max(fgLum, bgLum);
      const darker = Math.min(fgLum, bgLum);
      return (lighter + 0.05) / (darker + 0.05);
    }

    function blend(foreground, background) {
      const alpha = foreground[3];
      if (alpha >= 1) return foreground.slice(0, 3);
      const invAlpha = 1 - alpha;
      return [
        Math.round(foreground[0] * alpha + background[0] * invAlpha),
        Math.round(foreground[1] * alpha + background[1] * invAlpha),
        Math.round(foreground[2] * alpha + background[2] * invAlpha),
      ];
    }

    function pickBackgroundColor(node, fallbackRgb) {
      let current = node;
      while (current) {
        const style = window.getComputedStyle(current);
        const color = parseColor(style.backgroundColor);
        if (color && color[3] > 0) {
          return blend(color, fallbackRgb);
        }
        current = current.parentElement;
      }
      return fallbackRgb;
    }

    function getSelector(node) {
      if (node.id) return `#${node.id}`;
      const classes = [...node.classList].slice(0, 2).join('.');
      if (classes) return `${node.tagName.toLowerCase()}.${classes}`;
      return node.tagName.toLowerCase();
    }

    const bodyStyle = window.getComputedStyle(document.body);
    const baseBackground = parseColor(bodyStyle.backgroundColor) || [2, 6, 23, 1];
    const fallbackBackground = blend(baseBackground, [2, 6, 23, 1]);

    const candidates = [...document.querySelectorAll('body *')];
    const failures = [];
    let scannedNodes = 0;

    for (const node of candidates) {
      if (!(node instanceof HTMLElement)) continue;
      if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH'].includes(node.tagName)) continue;
      if (node.children.length > 0 && node.textContent?.trim() === node.innerText?.trim()) continue;

      const style = window.getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden' || Number.parseFloat(style.opacity || '1') === 0) {
        continue;
      }

      const text = (node.innerText || '').trim();
      if (!text) continue;

      const color = parseColor(style.color);
      if (!color) continue;

      scannedNodes += 1;

      const foreground = blend(color, fallbackBackground);
      const background = pickBackgroundColor(node, fallbackBackground);
      const ratio = contrastRatio(foreground, background);
      const fontSize = Number.parseFloat(style.fontSize || '16');
      const fontWeight = Number.parseInt(style.fontWeight || '400', 10);
      const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
      const minimumRatio = isLargeText ? 3 : 4.5;

      if (ratio < minimumRatio) {
        failures.push({
          selector: getSelector(node),
          ratio,
          minimumRatio,
          sample: text.slice(0, 80),
        });
      }
    }

    return {
      scannedNodes,
      failures: failures.slice(0, 20),
      failureCount: failures.length,
    };
  });
}

async function runRoute(browser, route) {
  const slug = routeSlug(route.path);
  const url = new URL(route.path, baseUrl).toString();
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
    path: route.path,
    label: route.label,
    url,
    desktop: {
      screenshot: join(screenshotDir, `${slug}-desktop-dark.png`).replaceAll('\\', '/'),
      overflow: false,
      scannedNodes: 0,
      contrastFailures: [],
    },
    mobile: {
      screenshot: join(screenshotDir, `${slug}-mobile-dark.png`).replaceAll('\\', '/'),
      overflow: false,
      scannedNodes: 0,
      contrastFailures: [],
    },
    verdict: 'PASS',
  };

  try {
    await desktopPage.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await desktopPage.waitForTimeout(600);
    result.desktop.overflow = await desktopPage.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    const desktopContrast = await runContrastScan(desktopPage);
    result.desktop.scannedNodes = desktopContrast.scannedNodes;
    result.desktop.contrastFailures = desktopContrast.failures;
    await desktopPage.screenshot({ path: result.desktop.screenshot, fullPage: true });

    await mobilePage.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await mobilePage.waitForTimeout(600);
    result.mobile.overflow = await mobilePage.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    const mobileContrast = await runContrastScan(mobilePage);
    result.mobile.scannedNodes = mobileContrast.scannedNodes;
    result.mobile.contrastFailures = mobileContrast.failures;
    await mobilePage.screenshot({ path: result.mobile.screenshot, fullPage: true });
  } finally {
    await desktopPage.close();
    await mobilePage.close();
    await desktopContext.close();
    await mobileContext.close();
  }

  const hasFailures =
    result.desktop.overflow ||
    result.mobile.overflow ||
    result.desktop.contrastFailures.length > 0 ||
    result.mobile.contrastFailures.length > 0;
  result.verdict = hasFailures ? 'FAIL' : 'PASS';
  return result;
}

async function main() {
  mkdirSync(screenshotDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results = [];

  try {
    for (const route of routes) {
      const outcome = await runRoute(browser, route);
      results.push(outcome);
      console.log(
        `${outcome.verdict} ${route.path} | desktop fails=${outcome.desktop.contrastFailures.length} | mobile fails=${outcome.mobile.contrastFailures.length}`,
      );
    }
  } finally {
    await browser.close();
  }

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      baseUrl,
      runDate,
      theme: 'dark',
      routesChecked: routes.length,
    },
    results,
  };

  writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  writeFileSync(markdownPath, `${buildMarkdown(results)}\n`, 'utf8');
  console.log(`Saved JSON: ${jsonPath}`);
  console.log(`Saved Markdown: ${markdownPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
