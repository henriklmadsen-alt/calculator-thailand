import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const distDir = join(__dirname, 'dist');
const port = parseInt(process.env.PORT || '3000', 10);
const defaultPrimarySiteUrl = 'https://www.kamnuanlek.com';
let primarySiteUrl;
try {
  primarySiteUrl = new URL(process.env.PUBLIC_SITE_URL || defaultPrimarySiteUrl);
} catch {
  primarySiteUrl = new URL(defaultPrimarySiteUrl);
}
const primaryHost = primarySiteUrl.hostname.toLowerCase();
const apexHost = primaryHost.startsWith('www.') ? primaryHost.slice(4) : primaryHost;
const redirectHosts = new Set(
  [
    apexHost,
    'calculator-thailand-production.up.railway.app',
    process.env.RAILWAY_PUBLIC_DOMAIN,
    process.env.RAILWAY_STATIC_URL,
  ]
    .filter(Boolean)
    .map((host) => String(host).toLowerCase())
);
const releaseMetadata = Object.freeze({
  gitCommit:
    process.env.RAILWAY_GIT_COMMIT_SHA ||
    process.env.SOURCE_COMMIT ||
    process.env.GITHUB_SHA ||
    'unknown',
  deploymentId: process.env.RAILWAY_DEPLOYMENT_ID || null,
  generatedAt: new Date().toISOString(),
});

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

const noIndexTag = 'noindex, nofollow, noarchive';
const blockedPathPatterns = [
  /^\/(?:plans|reports|memory|scripts|node_modules|\.git|\.astro)(?:\/|$)/i,
  /^\/\.tmp(?:\/|$)/i,
  /^\/.*internal-note.*$/i,
];

function isBlockedPath(pathname) {
  return blockedPathPatterns.some((pattern) => pattern.test(pathname));
}

function getRequestHost(req) {
  const hostHeader = String(req.headers.host || '').trim().toLowerCase();
  if (!hostHeader) return '';
  return hostHeader.split(':', 1)[0];
}

async function serve(req, res) {
  let incomingUrl;
  try {
    incomingUrl = new URL(req.url, `http://localhost:${port}`);
  } catch {
    incomingUrl = new URL('/', `http://localhost:${port}`);
  }

  const requestHost = getRequestHost(req);
  if (requestHost && requestHost !== primaryHost && redirectHosts.has(requestHost)) {
    res.writeHead(301, {
      Location: `${primarySiteUrl.origin}${incomingUrl.pathname}${incomingUrl.search}`,
      'Cache-Control': 'no-store, max-age=0',
    });
    res.end();
    return;
  }

  // Decode the URL to handle Thai characters and other non-ASCII paths
  let url;
  try {
    url = decodeURIComponent(incomingUrl.pathname);
  } catch {
    url = incomingUrl.pathname;
  }

  if (isBlockedPath(url)) {
    res.writeHead(410, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': noIndexTag,
    });
    res.end('Gone');
    return;
  }

  if (url === '/__release' || url === '/__release/') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': noIndexTag,
    });
    res.end(JSON.stringify(releaseMetadata));
    return;
  }

  if (url.endsWith('/')) url += 'index.html';
  if (!extname(url)) url += '/index.html';

  try {
    const filePath = join(distDir, url);
    const data = await readFile(filePath);
    const ext = extname(filePath);
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    });
    res.end(data);
  } catch {
    try {
      const notFound = await readFile(join(distDir, '404.html'));
      res.writeHead(404, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
        'X-Robots-Tag': noIndexTag,
      });
      res.end(notFound);
    } catch {
      res.writeHead(404, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
        'X-Robots-Tag': noIndexTag,
      });
      res.end('Not Found');
    }
  }
}

createServer(serve).listen(port, () => {
  // Server running
});
