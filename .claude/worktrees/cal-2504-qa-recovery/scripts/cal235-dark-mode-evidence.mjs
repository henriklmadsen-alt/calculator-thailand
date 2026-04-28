#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

import { chromium } from 'playwright';

const DEFAULT_PORT = 4377;
const WAIT_TIMEOUT_MS = 20_000;
const CONTRAST_TARGET = 4.5;

const TARGETS = [
  {
    name: 'calculator-property-transfer',
    route: '/คำนวณค่าโอนบ้าน/',
    checks: [
      { key: 'header_lang_toggle_active', selector: "header [data-lang-mode-btn='th']" },
      { key: 'calculator_submit_button', selector: "main button[type='submit']" },
      { key: 'related_link_title', selector: 'main section a span.font-medium' },
      { key: 'related_link_muted', selector: 'main section a span.block.text-sm' },
    ],
  },
  {
    name: 'article-electricity',
    route: '/บทความ/คำนวณค่าไฟฟ้า-2569-สูตร-pea-mea/',
    checks: [
      { key: 'header_lang_toggle_active', selector: "header [data-lang-mode-btn='th']" },
      { key: 'article_heading', selector: 'main h1, main h2' },
      { key: 'article_body_text', selector: 'main .prose p' },
      { key: 'article_related_card_text', selector: 'main a.p-3.text-sm.font-medium.text-gray-700.text-center' },
    ],
  },
];

function nowStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(baseUrl) {
  const startedAt = Date.now();
  let lastError = '';
  while (Date.now() - startedAt < WAIT_TIMEOUT_MS) {
    try {
      const response = await fetch(`${baseUrl}/__release`, { redirect: 'manual' });
      if (response.status === 200) return;
      lastError = `unexpected status ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await sleep(200);
  }
  throw new Error(`Server readiness check timed out (${WAIT_TIMEOUT_MS}ms): ${lastError}`);
}

function spawnServer(port) {
  const serverPath = path.resolve(process.cwd(), 'server.mjs');
  return spawn(process.execPath, [serverPath], {
    env: {
      ...process.env,
      PORT: String(port),
      PUBLIC_SITE_URL: 'https://www.kamnuanlek.com',
    },
    stdio: 'ignore',
  });
}

async function runEvidence({ outputDir }) {
  await fs.mkdir(outputDir, { recursive: true });

  const port = DEFAULT_PORT;
  const baseUrl = `http://127.0.0.1:${port}`;

  const server = spawnServer(port);
  try {
    await waitForServer(baseUrl);

    const browser = await chromium.launch({ headless: true });
    try {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        locale: 'th-TH',
        timezoneId: 'Asia/Bangkok',
        colorScheme: 'dark',
      });

      const page = await context.newPage();
      const runs = [];

      for (const target of TARGETS) {
        const url = new URL(target.route, `${baseUrl}/`).href;
        await page.goto(url, { waitUntil: 'networkidle', timeout: WAIT_TIMEOUT_MS });
        await page.waitForTimeout(1200);

        const screenshotFile = `${target.name}-dark-mobile.png`;
        const screenshotPath = path.join(outputDir, screenshotFile);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        const checks = await page.evaluate(({ checkList }) => {
          const parseColor = (value) => {
            if (!value) return null;
            const match = value.trim().match(/^rgba?\(([\d.\s]+),([\d.\s]+),([\d.\s]+)(?:,([\d.\s]+))?\)$/i);
            if (!match) return null;
            const r = Number.parseFloat(match[1]);
            const g = Number.parseFloat(match[2]);
            const b = Number.parseFloat(match[3]);
            const a = match[4] === undefined ? 1 : Number.parseFloat(match[4]);
            if ([r, g, b, a].some((n) => Number.isNaN(n))) return null;
            return [r, g, b, a];
          };

          const blend = (fg, bg) => {
            const alpha = fg[3] + bg[3] * (1 - fg[3]);
            if (alpha <= 0) return [0, 0, 0, 0];
            const r = (fg[0] * fg[3] + bg[0] * bg[3] * (1 - fg[3])) / alpha;
            const g = (fg[1] * fg[3] + bg[1] * bg[3] * (1 - fg[3])) / alpha;
            const b = (fg[2] * fg[3] + bg[2] * bg[3] * (1 - fg[3])) / alpha;
            return [r, g, b, alpha];
          };

          const luminance = ([rRaw, gRaw, bRaw]) => {
            const normalize = (channel) => {
              const s = channel / 255;
              return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
            };
            const r = normalize(rRaw);
            const g = normalize(gRaw);
            const b = normalize(bRaw);
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
          };

          const contrast = (fg, bg) => {
            const l1 = luminance(fg);
            const l2 = luminance(bg);
            const hi = Math.max(l1, l2);
            const lo = Math.min(l1, l2);
            return (hi + 0.05) / (lo + 0.05);
          };

          const effectiveBackground = (element) => {
            let composite = [0, 0, 0, 0];
            let node = element;
            while (node) {
              const color = parseColor(window.getComputedStyle(node).backgroundColor);
              if (color && color[3] > 0) {
                composite = blend(color, composite);
                if (composite[3] >= 0.99) break;
              }
              node = node.parentElement;
            }
            if (composite[3] < 1) {
              const bodyColor = parseColor(window.getComputedStyle(document.body).backgroundColor) || [15, 23, 42, 1];
              composite = blend(bodyColor, composite);
            }
            return [composite[0], composite[1], composite[2]];
          };

          return checkList.map((item) => {
            const node = document.querySelector(item.selector);
            if (!node) {
              return {
                key: item.key,
                selector: item.selector,
                status: 'missing',
              };
            }

            const styles = window.getComputedStyle(node);
            const fgColorRaw = parseColor(styles.color);
            if (!fgColorRaw) {
              return {
                key: item.key,
                selector: item.selector,
                status: 'invalid_color',
              };
            }

            const bgColor = effectiveBackground(node);
            const fgColor = fgColorRaw[3] < 1
              ? blend(fgColorRaw, [...bgColor, 1]).slice(0, 3)
              : fgColorRaw.slice(0, 3);
            const ratio = contrast(fgColor, bgColor);

            return {
              key: item.key,
              selector: item.selector,
              status: 'ok',
              ratio: Number(ratio.toFixed(2)),
              foreground: fgColor.map((v) => Math.round(v)),
              background: bgColor.map((v) => Math.round(v)),
            };
          });
        }, { checkList: target.checks });

        runs.push({
          name: target.name,
          route: target.route,
          url,
          screenshotPath,
          checks,
        });
      }

      await context.close();

      const flattened = runs.flatMap((run) => run.checks.map((check) => ({ target: run.name, ...check })));
      const failedChecks = flattened.filter((item) => item.status !== 'ok' || (item.ratio || 0) < CONTRAST_TARGET);
      const summary = {
        generatedAt: new Date().toISOString(),
        baseUrl,
        mode: 'dark-mobile',
        contrastTarget: CONTRAST_TARGET,
        totalChecks: flattened.length,
        failedChecks: failedChecks.length,
      };

      const report = {
        summary,
        runs,
      };

      const reportPath = path.join(outputDir, 'contrast-report.json');
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');

      console.log(
        JSON.stringify(
          {
            ...summary,
            reportPath,
            screenshots: runs.map((run) => run.screenshotPath),
          },
          null,
          2
        )
      );

      if (failedChecks.length > 0) {
        throw new Error(`Contrast verification failed: ${failedChecks.length}/${flattened.length} checks below ${CONTRAST_TARGET} or missing.`);
      }
    } finally {
      await browser.close();
    }
  } finally {
    if (!server.killed) {
      server.kill();
    }
  }
}

async function main() {
  const outputDir = path.resolve(process.cwd(), 'reports', `cal-235-dark-mode-evidence-${nowStamp()}`);
  await runEvidence({ outputDir });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

