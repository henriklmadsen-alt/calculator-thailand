import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';
import {
  decodeRoute,
  diffApprovedVsLive,
  extractRoutePathsFromSitemapXml,
  isApprovedCalculatorPagePath,
  sortUniqueRoutes,
  toRouteFromPagePath,
} from './release-route-integrity-lib.mjs';

const MOBILE_VIEWPORT = { width: 390, height: 844 };
const MOBILE_USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

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

function listFilesRecursive(dirPath, extension) {
  const files = [];
  for (const entry of readdirSync(dirPath)) {
    const fullPath = join(dirPath, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...listFilesRecursive(fullPath, extension));
      continue;
    }

    if (fullPath.endsWith(extension)) {
      files.push(fullPath);
    }
  }
  return files;
}

function collectApprovedCalculatorRoutes(repoRoot, inventoryFilePath) {
  if (inventoryFilePath) {
    const absoluteInventoryPath = join(repoRoot, inventoryFilePath);
    if (!existsSync(absoluteInventoryPath)) {
      throw new Error(`Inventory file not found: ${absoluteInventoryPath}`);
    }

    const inventory = JSON.parse(readFileSync(absoluteInventoryPath, 'utf8'));
    if (!Array.isArray(inventory.approvedCalculatorRoutes) || inventory.approvedCalculatorRoutes.length === 0) {
      throw new Error(`Inventory file has no approvedCalculatorRoutes: ${absoluteInventoryPath}`);
    }

    return {
      approvedPagePaths: [],
      approvedRoutes: sortUniqueRoutes(inventory.approvedCalculatorRoutes),
      inventorySourceRef: inventory.sourceRef || null,
      inventoryFilePath: inventoryFilePath.replaceAll('\\', '/'),
      slugPolicy: inventory.slugPolicy || {},
    };
  }

  const trackedPagePaths = getTrackedPagePaths(repoRoot);
  const approvedPagePaths = trackedPagePaths.filter((path) => isApprovedCalculatorPagePath(path));
  const approvedRoutes = approvedPagePaths.map((path) => toRouteFromPagePath(path));

  return {
    approvedPagePaths: approvedPagePaths.sort((a, b) => a.localeCompare(b)),
    approvedRoutes: sortUniqueRoutes(approvedRoutes),
    inventorySourceRef: null,
    inventoryFilePath: null,
    slugPolicy: {},
  };
}

function getTrackedPagePaths(repoRoot) {
  try {
    const stdout = execFileSync(
      'git',
      ['-C', repoRoot, '-c', 'core.quotepath=false', 'ls-files', 'src/pages'],
      { encoding: 'utf8' }
    );

    return stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.endsWith('/index.astro'));
  } catch {
    const pagesDir = join(repoRoot, 'src', 'pages');
    const astroFiles = listFilesRecursive(pagesDir, '.astro');
    return astroFiles
      .map((fullPath) => relative(repoRoot, fullPath).replaceAll('\\', '/'))
      .filter((line) => line.endsWith('/index.astro'));
  }
}

async function fetchLiveCalculatorRoutesFromSitemap(baseUrl) {
  const sitemapCandidates = ['/sitemap.xml', '/sitemap-0.xml'];
  const warnings = [];
  for (const sitemapPath of sitemapCandidates) {
    const targetUrl = `${baseUrl.replace(/\/$/, '')}${sitemapPath}`;
    try {
      const response = await fetch(targetUrl, { redirect: 'follow' });
      if (!response.ok) {
        warnings.push(`sitemap fetch failed: ${targetUrl} -> HTTP ${response.status}`);
        continue;
      }

      const xml = await response.text();
      const allRoutes = extractRoutePathsFromSitemapXml(xml);
      const calculatorRoutes = allRoutes.filter((route) => decodeRoute(route).startsWith('/คำนวณ'));
      return {
        liveCalculatorRoutes: calculatorRoutes,
        sitemapUrl: targetUrl,
        warnings,
      };
    } catch (error) {
      warnings.push(`sitemap fetch error: ${targetUrl} -> ${String(error)}`);
    }
  }

  return {
    liveCalculatorRoutes: [],
    sitemapUrl: null,
    warnings,
  };
}

async function fetchLiveHomepageCalculatorRoutes(baseUrl) {
  const homepageUrl = `${baseUrl.replace(/\/$/, '')}/`;
  const warnings = [];

  try {
    const response = await fetch(homepageUrl, { redirect: 'follow' });
    if (!response.ok) {
      warnings.push(`homepage fetch failed: ${homepageUrl} -> HTTP ${response.status}`);
      return {
        homepageCalculatorRoutes: [],
        homepageUrl,
        warnings,
      };
    }

    const html = await response.text();
    const hrefPattern = /href="([^"]+)"/g;
    const routes = [];
    let match = hrefPattern.exec(html);
    while (match) {
      const href = match[1];
      if (href.startsWith('/') && decodeRoute(href).startsWith('/คำนวณ')) {
        routes.push(href);
      }
      match = hrefPattern.exec(html);
    }

    return {
      homepageCalculatorRoutes: sortUniqueRoutes(routes),
      homepageUrl,
      warnings,
    };
  } catch (error) {
    warnings.push(`homepage fetch error: ${homepageUrl} -> ${String(error)}`);
    return {
      homepageCalculatorRoutes: [],
      homepageUrl,
      warnings,
    };
  }
}

function makeScreenshotSlug(route) {
  return decodeRoute(route)
    .replaceAll('/', '-')
    .replace(/[^a-zA-Z0-9\u0E00-\u0E7F-]/g, '_')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function runRouteCheck(browser, baseUrl, route, screenshotDir, takeScreenshot) {
  const url = `${baseUrl.replace(/\/$/, '')}${route}`;
  const context = await browser.newContext({
    viewport: MOBILE_VIEWPORT,
    userAgent: MOBILE_USER_AGENT,
  });
  const page = await context.newPage();

  const result = {
    routeEncoded: route,
    routeDecoded: decodeRoute(route),
    url,
    httpStatus: null,
    httpOk: false,
    h1Visible: false,
    formVisible: false,
    controlsVisible: false,
    buttonVisible: false,
    submitVisible: false,
    uiVisible: false,
    screenshot: null,
    error: null,
  };

  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    result.httpStatus = response ? response.status() : null;
    result.httpOk = result.httpStatus === 200;

    if (result.httpOk) {
      await page.waitForTimeout(400);
      const ui = await page.evaluate(() => {
        const isVisible = (element) => {
          if (!element) {
            return false;
          }

          const style = window.getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
        };

        const h1Visible = Array.from(document.querySelectorAll('h1')).some((element) => isVisible(element));
        const formVisible = Array.from(document.querySelectorAll('form')).some((element) => isVisible(element));
        const controlsVisible = Array.from(document.querySelectorAll('input,select,textarea')).some((element) => isVisible(element));
        const buttonVisible = Array.from(document.querySelectorAll('button,input[type="button"],input[type="submit"]')).some((element) => isVisible(element));
        const submitVisible = Array.from(document.querySelectorAll('button[type="submit"],input[type="submit"]')).some((element) => isVisible(element));
        return { h1Visible, formVisible, controlsVisible, buttonVisible, submitVisible };
      });

      result.h1Visible = ui.h1Visible;
      result.formVisible = ui.formVisible;
      result.controlsVisible = ui.controlsVisible;
      result.buttonVisible = ui.buttonVisible;
      result.submitVisible = ui.submitVisible;
      result.uiVisible = ui.h1Visible && (ui.formVisible || ui.controlsVisible || ui.buttonVisible);
    }

    if (takeScreenshot) {
      const screenshotPath = join(screenshotDir, `${makeScreenshotSlug(route)}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      result.screenshot = screenshotPath.replaceAll('\\', '/');
    }
  } catch (error) {
    result.error = String(error);
  } finally {
    await page.close();
    await context.close();
  }

  return result;
}

function summarizeChecklist(routeChecks) {
  const total = routeChecks.length;
  const httpOk = routeChecks.filter((item) => item.httpOk).length;
  const uiVisible = routeChecks.filter((item) => item.uiVisible).length;
  return { total, httpOk, uiVisible };
}

function buildRegressionDelta(currentChecks, previousChecks) {
  const previousByRoute = new Map(previousChecks.map((item) => [item.routeEncoded, item]));
  const regressedRoutes = [];
  const recoveredRoutes = [];

  for (const current of currentChecks) {
    const before = previousByRoute.get(current.routeEncoded);
    if (!before) {
      continue;
    }

    const beforePass = before.httpOk && before.uiVisible;
    const currentPass = current.httpOk && current.uiVisible;

    if (beforePass && !currentPass) {
      regressedRoutes.push(current.routeEncoded);
    }
    if (!beforePass && currentPass) {
      recoveredRoutes.push(current.routeEncoded);
    }
  }

  return {
    regressedRoutes: regressedRoutes.sort((a, b) => a.localeCompare(b)),
    recoveredRoutes: recoveredRoutes.sort((a, b) => a.localeCompare(b)),
  };
}

function toMarkdown(report) {
  const lines = [];
  lines.push(`# CAL-197 Release Route Integrity (${report.meta.phase})`);
  lines.push('');
  lines.push(`- Generated at: ${report.meta.generatedAt}`);
  lines.push(`- Base URL: ${report.meta.baseUrl}`);
  lines.push(`- Release SHA: ${report.meta.releaseSha || 'n/a'}`);
  lines.push(`- Deployment ID: ${report.meta.deploymentId || 'n/a'}`);
  lines.push(`- Sitemap source: ${report.meta.sitemapUrl || 'unavailable'}`);
  lines.push(`- Verdict: ${report.meta.verdict}`);
  lines.push('');
  lines.push('## Inventory');
  lines.push('');
  lines.push(`- Approved routes: ${report.inventory.approvedRoutes.length}`);
  lines.push(`- Live routes from sitemap: ${report.inventory.liveRoutes.length}`);
  lines.push(`- Live calculator links on homepage: ${report.inventory.homepageRoutes.length}`);
  lines.push(`- Missing live routes: ${report.diff.missingLiveRoutes.length}`);
  lines.push(`- Unexpected live routes: ${report.diff.unexpectedLiveRoutes.length}`);
  lines.push(`- Homepage missing routes: ${report.diff.homepageMissingRoutes.length}`);
  lines.push(`- Homepage unexpected routes: ${report.diff.homepageUnexpectedRoutes.length}`);
  lines.push(`- Route checks (HTTP): ${report.summary.httpOk}/${report.summary.total}`);
  lines.push(`- Route checks (UI): ${report.summary.uiVisible}/${report.summary.total}`);
  lines.push('');
  lines.push('## Approved vs Live Diff');
  lines.push('');
  if (report.diff.missingLiveRoutes.length === 0 && report.diff.unexpectedLiveRoutes.length === 0) {
    lines.push('- No inventory diff detected.');
  } else {
    for (const route of report.diff.missingLiveRoutes) {
      lines.push(`- Missing live route: ${decodeRoute(route)}`);
    }
    for (const route of report.diff.unexpectedLiveRoutes) {
      lines.push(`- Unexpected live route: ${decodeRoute(route)}`);
    }
  }
  lines.push('');

  lines.push('## Approved vs Homepage Diff');
  lines.push('');
  if (report.diff.homepageMissingRoutes.length === 0 && report.diff.homepageUnexpectedRoutes.length === 0) {
    lines.push('- Homepage links match approved inventory.');
  } else {
    for (const route of report.diff.homepageMissingRoutes) {
      lines.push(`- Missing homepage link: ${decodeRoute(route)}`);
    }
    for (const route of report.diff.homepageUnexpectedRoutes) {
      lines.push(`- Unexpected homepage link: ${decodeRoute(route)}`);
    }
  }
  lines.push('');

  if (report.compareTo) {
    lines.push('## Before/After Delta');
    lines.push('');
    lines.push(`- Baseline report: ${report.compareTo.baselineReport}`);
    lines.push(`- Regressed routes: ${report.compareTo.regressedRoutes.length}`);
    lines.push(`- Recovered routes: ${report.compareTo.recoveredRoutes.length}`);
    for (const route of report.compareTo.regressedRoutes) {
      lines.push(`- Regressed: ${decodeRoute(route)}`);
    }
    for (const route of report.compareTo.recoveredRoutes) {
      lines.push(`- Recovered: ${decodeRoute(route)}`);
    }
    lines.push('');
  }

  lines.push('## Route Checklist');
  lines.push('');
  lines.push('| Route | HTTP | UI Visible | Screenshot |');
  lines.push('| --- | --- | --- | --- |');
  for (const item of report.routeChecks) {
    const screenshot = item.screenshot ? `\`${item.screenshot}\`` : '-';
    lines.push(
      `| ${item.routeDecoded} | ${item.httpStatus ?? 'ERR'} | ${item.uiVisible ? 'pass' : 'fail'} | ${screenshot} |`
    );
  }
  lines.push('');

  if (report.warnings.length > 0) {
    lines.push('## Warnings');
    lines.push('');
    for (const warning of report.warnings) {
      lines.push(`- ${warning}`);
    }
    lines.push('');
  }

  if (report.failures.length > 0) {
    lines.push('## Failures');
    lines.push('');
    for (const failure of report.failures) {
      lines.push(`- ${failure}`);
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
  const inventoryFile = args['inventory-file']
    ? String(args['inventory-file']).trim()
    : 'config/approved-calculator-inventory.json';
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

  const repoRoot = process.cwd();
  const inventory = collectApprovedCalculatorRoutes(repoRoot, inventoryFile);
  if (inventory.approvedRoutes.length === 0) {
    throw new Error('No approved calculator routes were discovered in the canonical inventory file.');
  }

  const sitemap = await fetchLiveCalculatorRoutesFromSitemap(baseUrl);
  const homepage = await fetchLiveHomepageCalculatorRoutes(baseUrl);
  const sitemapDiff = diffApprovedVsLive(inventory.approvedRoutes, sitemap.liveCalculatorRoutes);
  const homepageDiff = diffApprovedVsLive(inventory.approvedRoutes, homepage.homepageCalculatorRoutes);

  const takeScreenshots = phase === 'after' && !skipScreenshots;
  const screenshotDir = join(reportDir, 'screenshots');
  mkdirSync(reportDir, { recursive: true });
  if (takeScreenshots) {
    mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const routeChecks = [];
  for (const route of inventory.approvedRoutes) {
    const check = await runRouteCheck(browser, baseUrl, route, screenshotDir, takeScreenshots);
    routeChecks.push(check);
    console.log(`${check.httpOk && check.uiVisible ? 'PASS' : 'FAIL'} ${check.routeDecoded} (HTTP ${check.httpStatus ?? 'ERR'})`);
  }
  await browser.close();

  const summary = summarizeChecklist(routeChecks);
  const failures = [];
  const warnings = [...sitemap.warnings, ...homepage.warnings];

  if (phase === 'after') {
    if (sitemapDiff.missingLiveRoutes.length > 0) {
      failures.push(`Missing approved routes in live sitemap: ${sitemapDiff.missingLiveRoutes.map((route) => decodeRoute(route)).join(', ')}`);
    }
    if (sitemapDiff.unexpectedLiveRoutes.length > 0) {
      failures.push(`Unexpected calculator routes in live sitemap: ${sitemapDiff.unexpectedLiveRoutes.map((route) => decodeRoute(route)).join(', ')}`);
    }
    if (homepageDiff.missingLiveRoutes.length > 0) {
      failures.push(`Missing approved calculator links on homepage: ${homepageDiff.missingLiveRoutes.map((route) => decodeRoute(route)).join(', ')}`);
    }
    if (homepageDiff.unexpectedLiveRoutes.length > 0) {
      failures.push(`Unexpected calculator links on homepage: ${homepageDiff.unexpectedLiveRoutes.map((route) => decodeRoute(route)).join(', ')}`);
    }

    const non200Routes = routeChecks.filter((item) => !item.httpOk).map((item) => item.routeDecoded);
    if (non200Routes.length > 0) {
      failures.push(`Approved routes with non-200 response: ${non200Routes.join(', ')}`);
    }

    const uiFailRoutes = routeChecks.filter((item) => !item.uiVisible).map((item) => item.routeDecoded);
    if (uiFailRoutes.length > 0) {
      failures.push(`Approved routes failing visible UI check: ${uiFailRoutes.join(', ')}`);
    }
  }

  let compareTo = null;
  if (compareReportPath) {
    const previous = JSON.parse(readFileSync(compareReportPath, 'utf8'));
    const delta = buildRegressionDelta(routeChecks, previous.routeChecks ?? []);
    compareTo = {
      baselineReport: compareReportPath.replaceAll('\\', '/'),
      regressedRoutes: delta.regressedRoutes,
      recoveredRoutes: delta.recoveredRoutes,
    };
    if (phase === 'after' && delta.regressedRoutes.length > 0) {
      failures.push(`Routes regressed from baseline: ${delta.regressedRoutes.map((route) => decodeRoute(route)).join(', ')}`);
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
      sitemapUrl: sitemap.sitemapUrl,
      verdict,
    },
    inventory: {
      inventorySourceRef: inventory.inventorySourceRef,
      inventoryFilePath: inventory.inventoryFilePath,
      slugPolicy: inventory.slugPolicy,
      approvedPagePaths: inventory.approvedPagePaths,
      approvedRoutes: inventory.approvedRoutes,
      liveRoutes: sitemapDiff.liveRoutes,
      homepageRoutes: homepageDiff.liveRoutes,
    },
    diff: {
      missingLiveRoutes: sitemapDiff.missingLiveRoutes,
      unexpectedLiveRoutes: sitemapDiff.unexpectedLiveRoutes,
      homepageMissingRoutes: homepageDiff.missingLiveRoutes,
      homepageUnexpectedRoutes: homepageDiff.unexpectedLiveRoutes,
    },
    summary,
    routeChecks,
    compareTo,
    warnings,
    failures,
  };

  const jsonPath = join(reportDir, `release-route-integrity-${phase}.json`);
  const mdPath = join(reportDir, `release-route-integrity-${phase}.md`);
  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  writeFileSync(mdPath, `${toMarkdown(report)}\n`, 'utf8');

  console.log(`Release route integrity report (json): ${jsonPath.replaceAll('\\', '/')}`);
  console.log(`Release route integrity report (md): ${mdPath.replaceAll('\\', '/')}`);
  console.log(
    `Route checklist summary: approved=${report.inventory.approvedRoutes.length}, sitemap=${report.inventory.liveRoutes.length}, homepage=${report.inventory.homepageRoutes.length}, http=${summary.httpOk}/${summary.total}, ui=${summary.uiVisible}/${summary.total}`
  );
  console.log(`Approved vs sitemap diff: missing=${report.diff.missingLiveRoutes.length}, unexpected=${report.diff.unexpectedLiveRoutes.length}`);
  console.log(`Approved vs homepage diff: missing=${report.diff.homepageMissingRoutes.length}, unexpected=${report.diff.homepageUnexpectedRoutes.length}`);
  if (compareTo) {
    console.log(`Before/after delta: regressed=${compareTo.regressedRoutes.length}, recovered=${compareTo.recoveredRoutes.length}`);
  }
  console.log(`Route integrity verdict: ${verdict}`);

  if (verdict === 'FAIL') {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
