import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import {
  containsMojibake,
  containsThaiText,
  diffExpectedRoutes,
  evaluateSurfaceResult,
} from './release-visual-integrity-lib.mjs';

const MOBILE_VIEWPORT = { width: 390, height: 844 };
const DESKTOP_VIEWPORT = { width: 1440, height: 900 };
const MOBILE_USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const THEME_STORAGE_KEY = 'ct.theme-preference.v1';

const HOMEPAGE_PATH = '/';
const CALCULATOR_PATH = '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%9A%E0%B8%B8%E0%B8%84%E0%B8%84%E0%B8%A5%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%94%E0%B8%B2/';
const ARTICLE_PATH = '/%E0%B8%9A%E0%B8%97%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1/';

const SURFACES = [
  {
    id: 'header',
    label: 'Header',
    path: HOMEPAGE_PATH,
    selector: 'header',
    expectedThaiKeywords: ['คำนวณ', 'บทความ', 'หน้าแรก'],
  },
  {
    id: 'footer',
    label: 'Footer',
    path: HOMEPAGE_PATH,
    selector: 'footer',
    expectedThaiKeywords: ['คำนวณ', 'เครื่องคิดเลข', 'บทความ'],
  },
  {
    id: 'homepage-hero',
    label: 'Homepage Hero',
    path: HOMEPAGE_PATH,
    selector: 'main section.rounded-2xl.border.border-sky-100',
    expectedThaiKeywords: ['คำนวณ', 'เครื่องคำนวณไทย', 'เริ่มคำนวณ'],
  },
  {
    id: 'trust-section',
    label: 'Trust Section',
    path: HOMEPAGE_PATH,
    selector: 'main section.rounded-xl.border.border-slate-200',
    expectedThaiKeywords: ['ความน่าเชื่อถือ', 'แหล่งที่มา', 'สมมติฐาน'],
  },
  {
    id: 'calculator-chips',
    label: 'Calculator Listing Chips',
    path: HOMEPAGE_PATH,
    selector: 'a[data-entry-surface="homepage_quickstart_chip"]',
    expectedThaiKeywords: ['ภาษี', 'ค่าไฟ', 'ผ่อนรถ', 'ดอกเบี้ย'],
    expectedRoutes: [
      '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%A0%E0%B8%B2%E0%B8%A9%E0%B8%B5%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%9A%E0%B8%B8%E0%B8%84%E0%B8%84%E0%B8%A5%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%94%E0%B8%B2/',
      '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%84%E0%B9%88%E0%B8%B2%E0%B9%84%E0%B8%9F%E0%B8%9F%E0%B9%89%E0%B8%B2/',
      '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%9C%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B8%A3%E0%B8%96/',
      '/%E0%B8%84%E0%B8%B3%E0%B8%99%E0%B8%A7%E0%B8%93%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%80%E0%B8%9A%E0%B8%B5%E0%B9%89%E0%B8%A2%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%94%E0%B8%B4%E0%B8%95/',
    ],
  },
  {
    id: 'calculator-page',
    label: 'Calculator Page',
    path: CALCULATOR_PATH,
    selector: 'main',
    expectedThaiKeywords: ['ภาษี', 'คำนวณ', 'เงินได้'],
  },
  {
    id: 'article-page',
    label: 'Article Page',
    path: ARTICLE_PATH,
    selector: 'main',
    expectedThaiKeywords: ['บทความ', 'คำนวณ', 'เครื่องคำนวณ'],
  },
];

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      continue;
    }

    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    index += 1;
  }

  return args;
}

function normalizeRoute(pathname) {
  if (!pathname) {
    return '/';
  }

  let value = String(pathname).trim();
  if (!value.startsWith('/')) {
    value = `/${value}`;
  }
  if (value !== '/' && !value.endsWith('/')) {
    value = `${value}/`;
  }
  return value;
}

function decodeRoute(pathname) {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

function makeSlug(value) {
  return decodeRoute(value)
    .replaceAll('/', '-')
    .replace(/[^a-zA-Z0-9\u0E00-\u0E7F-]/g, '_')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildContrastScanScript(selector) {
  return `(() => {
    function parseColor(value) {
      if (typeof value !== 'string') return null;
      const match = value.match(/^rgba?\\(([^)]+)\\)$/i);
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

    function extractGradientColor(value) {
      if (typeof value !== 'string' || !value || value === 'none') return null;
      const matches = value.match(/rgba?\\([^\\)]+\\)/gi);
      if (!matches || matches.length === 0) return null;
      const parsed = parseColor(matches[0]);
      if (!parsed) return null;
      return [parsed[0], parsed[1], parsed[2], 1];
    }

    function resolveBackground(style, fallbackRgb) {
      const canBlend = Array.isArray(fallbackRgb) && fallbackRgb.length === 3;
      const solid = parseColor(style.backgroundColor);
      if (solid && solid[3] > 0) {
        if (canBlend) {
          return blend(solid, fallbackRgb);
        }
        return [solid[0], solid[1], solid[2]];
      }
      const gradient = extractGradientColor(style.backgroundImage);
      if (gradient) {
        if (canBlend) {
          return blend(gradient, fallbackRgb);
        }
        return [gradient[0], gradient[1], gradient[2]];
      }
      return null;
    }

    function selectorFor(node) {
      if (node.id) return '#' + node.id;
      const classes = Array.from(node.classList || []).slice(0, 2).join('.');
      if (classes) return node.tagName.toLowerCase() + '.' + classes;
      return node.tagName.toLowerCase();
    }

    function nearestBackground(node, fallback) {
      let current = node;
      while (current) {
        const style = window.getComputedStyle(current);
        const resolved = resolveBackground(style, null);
        if (resolved) return resolved;
        current = current.parentElement;
      }
      return fallback;
    }

    const root = document.querySelector(${JSON.stringify(selector)});
    if (!root) {
      return { scannedNodes: 0, failures: [], failureCount: 1, rootMissing: true };
    }

    const htmlTheme = document.documentElement.getAttribute('data-theme');
    const themeFallback = htmlTheme === 'dark' ? [11, 18, 32] : [255, 255, 255];
    const htmlStyle = window.getComputedStyle(document.documentElement);
    const bodyStyle = window.getComputedStyle(document.body);
    const htmlBackground = resolveBackground(htmlStyle, themeFallback) || themeFallback;
    const fallbackBackground = resolveBackground(bodyStyle, htmlBackground) || htmlBackground;

    const textCandidates = [];
    if (root instanceof HTMLElement) {
      textCandidates.push(root);
    }
    for (const node of root.querySelectorAll('*')) {
      if (node instanceof HTMLElement) {
        textCandidates.push(node);
      }
    }

    const failures = [];
    let scannedNodes = 0;
    for (const node of textCandidates) {
      if (!(node instanceof HTMLElement)) continue;
      if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH'].includes(node.tagName)) continue;
      if (node.children.length > 0) continue;

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
      rootMissing: false,
    };
  })();`;
}

async function collectChipRoutes(page, selector, baseUrl) {
  return page.evaluate(
    ({ chipSelector, pageBaseUrl }) => {
      const links = Array.from(document.querySelectorAll(chipSelector));
      const routes = [];
      for (const link of links) {
        const href = link.getAttribute('href') || '';
        if (!href) continue;

        try {
          const absolute = new URL(href, pageBaseUrl);
          routes.push(absolute.pathname.endsWith('/') ? absolute.pathname : `${absolute.pathname}/`);
        } catch {
          continue;
        }
      }

      return [...new Set(routes)].sort((a, b) => a.localeCompare(b));
    },
    { chipSelector: selector, pageBaseUrl: baseUrl },
  );
}

async function checkRoutesStatus(baseUrl, routes) {
  const statuses = [];
  for (const route of routes) {
    const url = `${baseUrl.replace(/\/$/, '')}${route}`;
    try {
      const response = await fetch(url, { redirect: 'follow' });
      statuses.push({ route, status: response.status, ok: response.status === 200 });
    } catch (error) {
      statuses.push({ route, status: null, ok: false, error: String(error) });
    }
  }
  return statuses;
}

async function runSurfaceCheck(browser, baseUrl, surface, mode, viewportName, screenshotDir, takeScreenshot) {
  const context = await browser.newContext({
    viewport: viewportName === 'mobile' ? MOBILE_VIEWPORT : DESKTOP_VIEWPORT,
    userAgent: viewportName === 'mobile' ? MOBILE_USER_AGENT : undefined,
  });

  context.addInitScript(
    ({ storageKey, selectedMode }) => {
      window.localStorage.setItem(storageKey, selectedMode);
      document.documentElement.setAttribute('data-theme', selectedMode);
    },
    { storageKey: THEME_STORAGE_KEY, selectedMode: mode },
  );

  const page = await context.newPage();
  const url = `${baseUrl.replace(/\/$/, '')}${surface.path}`;
  const screenshotPath = join(
    screenshotDir,
    `${makeSlug(surface.id)}-${makeSlug(surface.path)}-${mode}-${viewportName}.png`,
  ).replaceAll('\\', '/');

  const result = {
    surfaceId: surface.id,
    surfaceLabel: surface.label,
    path: normalizeRoute(surface.path),
    pathDecoded: decodeRoute(normalizeRoute(surface.path)),
    mode,
    viewport: viewportName,
    selector: surface.selector,
    url,
    httpStatus: null,
    visible: false,
    thaiTextOk: false,
    mojibakeDetected: false,
    expectedThaiKeywordFound: false,
    contrastFailureCount: 0,
    contrastFailures: [],
    scannedNodes: 0,
    hasOverflow: false,
    chipRoutes: [],
    chipRouteDiff: null,
    chipRouteStatuses: [],
    screenshot: takeScreenshot ? screenshotPath : null,
    pass: false,
    reasons: [],
    error: null,
  };

  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    result.httpStatus = response ? response.status() : null;

    await page.waitForTimeout(500);

    const surfaceData = await page.evaluate((selector) => {
      const node = document.querySelector(selector);
      if (!node) {
        return {
          visible: false,
          text: '',
        };
      }

      const style = window.getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      const visible = style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;

      return {
        visible,
        text: (node.textContent || '').trim(),
      };
    }, surface.selector);

    result.visible = surfaceData.visible;
    result.thaiTextOk = containsThaiText(surfaceData.text);
    result.mojibakeDetected = containsMojibake(surfaceData.text);

    if (Array.isArray(surface.expectedThaiKeywords) && surface.expectedThaiKeywords.length > 0) {
      result.expectedThaiKeywordFound = surface.expectedThaiKeywords.some((keyword) => surfaceData.text.includes(keyword));
      if (!result.expectedThaiKeywordFound) {
        result.reasons.push('expected Thai copy keyword missing');
      }
    }

    result.hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);

    const contrast = await page.evaluate(buildContrastScanScript(surface.selector));
    result.scannedNodes = contrast.scannedNodes || 0;
    result.contrastFailureCount = Number(contrast.failureCount || 0);
    result.contrastFailures = Array.isArray(contrast.failures) ? contrast.failures : [];
    if (contrast.rootMissing) {
      result.reasons.push('surface selector not found for contrast scan');
    }

    if (surface.id === 'calculator-chips') {
      const chipRoutes = await collectChipRoutes(page, surface.selector, baseUrl);
      result.chipRoutes = chipRoutes;
      const expectedRoutes = (surface.expectedRoutes || []).map((route) => normalizeRoute(route));
      const observedRoutes = chipRoutes.map((route) => normalizeRoute(route));
      result.chipRouteDiff = diffExpectedRoutes(expectedRoutes, observedRoutes);

      const statuses = await checkRoutesStatus(baseUrl, observedRoutes);
      result.chipRouteStatuses = statuses;

      const non200 = statuses.filter((entry) => !entry.ok);
      if (non200.length > 0) {
        result.reasons.push(`calculator chips contain non-200 routes (${non200.length})`);
      }
      if (result.chipRouteDiff.missingRoutes.length > 0) {
        result.reasons.push(`required calculator chips missing (${result.chipRouteDiff.missingRoutes.length})`);
      }
    }

    if (takeScreenshot) {
      await page.screenshot({ path: screenshotPath, fullPage: true });
    }

    const evaluation = evaluateSurfaceResult(result);
    result.pass = evaluation.pass && result.reasons.length === 0;
    result.reasons = [...evaluation.reasons, ...result.reasons];
  } catch (error) {
    result.error = String(error);
    result.reasons.push('unhandled runtime error');
    result.pass = false;
  } finally {
    await page.close();
    await context.close();
  }

  return result;
}

function groupBySurfaceAndMode(results) {
  const map = new Map();
  for (const result of results) {
    const key = `${result.surfaceId}::${result.mode}`;
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(result);
  }

  const groups = [];
  for (const [key, checks] of map.entries()) {
    const [surfaceId, mode] = key.split('::');
    const sample = checks[0];
    const pass = checks.every((entry) => entry.pass);
    const reasons = [...new Set(checks.flatMap((entry) => entry.reasons))];

    groups.push({
      key,
      surfaceId,
      mode,
      surfaceLabel: sample.surfaceLabel,
      path: sample.path,
      pathDecoded: sample.pathDecoded,
      pass,
      reasons,
      checks,
    });
  }

  return groups.sort((a, b) => a.key.localeCompare(b.key));
}

function buildRegressionDelta(currentGroups, previousGroups) {
  const previousByKey = new Map(previousGroups.map((group) => [group.key, group]));
  const regressed = [];
  const recovered = [];

  for (const current of currentGroups) {
    const previous = previousByKey.get(current.key);
    if (!previous) {
      continue;
    }

    if (previous.pass && !current.pass) {
      regressed.push(current.key);
    }
    if (!previous.pass && current.pass) {
      recovered.push(current.key);
    }
  }

  return {
    regressed: regressed.sort((a, b) => a.localeCompare(b)),
    recovered: recovered.sort((a, b) => a.localeCompare(b)),
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push(`# CAL-246 Release Visual Integrity (${report.meta.phase})`);
  lines.push('');
  lines.push(`- Generated at: ${report.meta.generatedAt}`);
  lines.push(`- Base URL: ${report.meta.baseUrl}`);
  lines.push(`- Release SHA: ${report.meta.releaseSha || 'n/a'}`);
  lines.push(`- Deployment ID: ${report.meta.deploymentId || 'n/a'}`);
  lines.push(`- Verdict: ${report.meta.verdict}`);
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push(`- Surfaces: ${report.summary.surfaceCount}`);
  lines.push(`- Modes: ${report.summary.modeCount}`);
  lines.push(`- Viewport checks: ${report.summary.totalChecks}`);
  lines.push(`- Passed checks: ${report.summary.passedChecks}`);
  lines.push(`- Failed checks: ${report.summary.failedChecks}`);
  lines.push(`- Failed surface-mode groups: ${report.summary.failedGroups}`);
  lines.push('');

  lines.push('## Surface Matrix');
  lines.push('');
  lines.push('| Surface | Path | Mode | Desktop | Mobile | Verdict |');
  lines.push('| --- | --- | --- | --- | --- | --- |');
  for (const group of report.groups) {
    const desktop = group.checks.find((check) => check.viewport === 'desktop');
    const mobile = group.checks.find((check) => check.viewport === 'mobile');
    lines.push(
      `| ${group.surfaceLabel} | ${group.pathDecoded} | ${group.mode} | ${desktop?.pass ? 'PASS' : 'FAIL'} | ${mobile?.pass ? 'PASS' : 'FAIL'} | ${group.pass ? 'PASS' : 'FAIL'} |`,
    );
  }
  lines.push('');

  if (report.compareTo) {
    lines.push('## Before/After Delta');
    lines.push('');
    lines.push(`- Baseline report: ${report.compareTo.baselineReport}`);
    lines.push(`- Regressed groups: ${report.compareTo.regressed.length}`);
    lines.push(`- Recovered groups: ${report.compareTo.recovered.length}`);
    for (const key of report.compareTo.regressed) {
      lines.push(`- Regressed: ${key}`);
    }
    for (const key of report.compareTo.recovered) {
      lines.push(`- Recovered: ${key}`);
    }
    lines.push('');
  }

  lines.push('## Detailed Checks');
  lines.push('');
  lines.push('| Surface | Mode | Viewport | HTTP | Thai | Mojibake | Contrast Fails | Overflow | Verdict | Screenshot |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const check of report.checks) {
    const screenshot = check.screenshot ? `\`${check.screenshot}\`` : '-';
    lines.push(
      `| ${check.surfaceLabel} | ${check.mode} | ${check.viewport} | ${check.httpStatus ?? 'ERR'} | ${check.thaiTextOk ? 'pass' : 'fail'} | ${check.mojibakeDetected ? 'fail' : 'pass'} | ${check.contrastFailureCount} | ${check.hasOverflow ? 'fail' : 'pass'} | ${check.pass ? 'PASS' : 'FAIL'} | ${screenshot} |`,
    );
  }
  lines.push('');

  const failedChecks = report.checks.filter((check) => !check.pass);
  if (failedChecks.length > 0) {
    lines.push('## Failures');
    lines.push('');
    for (const check of failedChecks) {
      lines.push(`- ${check.surfaceLabel} (${check.mode}/${check.viewport}): ${check.reasons.join('; ')}`);
      if (check.chipRouteDiff && (check.chipRouteDiff.missingRoutes.length > 0 || check.chipRouteDiff.unexpectedRoutes.length > 0)) {
        for (const route of check.chipRouteDiff.missingRoutes) {
          lines.push(`  - Missing chip route: ${decodeRoute(route)}`);
        }
        for (const route of check.chipRouteDiff.unexpectedRoutes) {
          lines.push(`  - Unexpected chip route: ${decodeRoute(route)}`);
        }
      }
      for (const routeStatus of check.chipRouteStatuses || []) {
        if (!routeStatus.ok) {
          lines.push(`  - Broken chip route: ${decodeRoute(routeStatus.route)} -> ${routeStatus.status ?? 'ERR'}`);
        }
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const phase = String(args.phase || '').trim();
  const baseUrl = String(args['base-url'] || '').trim();
  const reportDir = String(args['report-dir'] || '').trim();
  const releaseSha = args['release-sha'] ? String(args['release-sha']) : null;
  const deploymentId = args['deployment-id'] ? String(args['deployment-id']) : null;
  const compareReportPath = args['compare-report'] ? String(args['compare-report']) : null;
  const skipScreenshots = Boolean(args['skip-screenshots']);

  if (phase !== 'before' && phase !== 'after') {
    throw new Error('Missing required argument --phase before|after');
  }
  if (!baseUrl) {
    throw new Error('Missing required argument --base-url');
  }
  if (!reportDir) {
    throw new Error('Missing required argument --report-dir');
  }

  mkdirSync(reportDir, { recursive: true });
  const screenshotDir = join(reportDir, 'screenshots');
  const takeScreenshots = !skipScreenshots;
  if (takeScreenshots) {
    mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const checks = [];
  for (const surface of SURFACES) {
    for (const mode of ['light', 'dark']) {
      for (const viewportName of ['desktop', 'mobile']) {
        const result = await runSurfaceCheck(
          browser,
          baseUrl,
          surface,
          mode,
          viewportName,
          screenshotDir,
          takeScreenshots,
        );
        checks.push(result);
        console.log(`${result.pass ? 'PASS' : 'FAIL'} ${result.surfaceId} ${mode}/${viewportName} (HTTP ${result.httpStatus ?? 'ERR'})`);
      }
    }
  }
  await browser.close();

  const groups = groupBySurfaceAndMode(checks);
  const passedChecks = checks.filter((check) => check.pass).length;
  const failedChecks = checks.length - passedChecks;
  const failedGroups = groups.filter((group) => !group.pass).length;

  const failures = [];
  if (phase === 'after') {
    for (const group of groups) {
      if (!group.pass) {
        failures.push(`${group.surfaceLabel} (${group.mode}) failed: ${group.reasons.join('; ')}`);
      }
    }
  }

  let compareTo = null;
  if (compareReportPath) {
    const previous = JSON.parse(readFileSync(compareReportPath, 'utf8'));
    const previousGroups = Array.isArray(previous.groups) ? previous.groups : [];
    const delta = buildRegressionDelta(groups, previousGroups);
    compareTo = {
      baselineReport: compareReportPath.replaceAll('\\', '/'),
      regressed: delta.regressed,
      recovered: delta.recovered,
    };

    if (phase === 'after' && delta.regressed.length > 0) {
      failures.push(`Regressed surface-mode groups: ${delta.regressed.join(', ')}`);
    }
  }

  const verdict = failures.length === 0 ? 'PASS' : 'FAIL';
  const report = {
    meta: {
      generatedAt: new Date().toISOString(),
      phase,
      baseUrl,
      releaseSha,
      deploymentId,
      verdict,
    },
    summary: {
      surfaceCount: SURFACES.length,
      modeCount: 2,
      totalChecks: checks.length,
      passedChecks,
      failedChecks,
      failedGroups,
    },
    checks,
    groups,
    compareTo,
    failures,
  };

  const jsonPath = join(reportDir, `release-visual-integrity-${phase}.json`);
  const mdPath = join(reportDir, `release-visual-integrity-${phase}.md`);
  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  writeFileSync(mdPath, `${toMarkdown(report)}\n`, 'utf8');

  console.log(`Release visual integrity report (json): ${jsonPath.replaceAll('\\', '/')}`);
  console.log(`Release visual integrity report (md): ${mdPath.replaceAll('\\', '/')}`);
  console.log(`Visual summary: checks=${checks.length}, failed=${failedChecks}, failed-groups=${failedGroups}`);
  console.log(`Visual integrity verdict: ${verdict}`);

  if (phase === 'after' && verdict === 'FAIL') {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
