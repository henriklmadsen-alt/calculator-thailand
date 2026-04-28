import { posix as pathPosix } from 'node:path';

const CALCULATOR_PAGE_PATTERN = /^src\/pages\/(คำนวณ[^/]+)\/index\.astro$/u;

export function isApprovedCalculatorPagePath(pagePath) {
  return CALCULATOR_PAGE_PATTERN.test(normalizePath(pagePath));
}

export function toRouteFromPagePath(pagePath) {
  const normalized = normalizePath(pagePath);
  const match = normalized.match(CALCULATOR_PAGE_PATTERN);
  if (!match) {
    throw new Error(`Unsupported calculator page path: ${pagePath}`);
  }

  const decodedRoute = `/${match[1]}/`;
  return encodeRoute(decodedRoute);
}

export function encodeRoute(routePath) {
  const decoded = decodeRoute(routePath);
  if (decoded === '/') {
    return '/';
  }

  const segments = decoded.split('/').filter(Boolean);
  return `/${segments.map((segment) => encodeURIComponent(segment)).join('/')}/`;
}

export function decodeRoute(routePath) {
  if (!routePath) {
    return '/';
  }

  const withLeadingSlash = routePath.startsWith('/') ? routePath : `/${routePath}`;
  if (withLeadingSlash === '/') {
    return '/';
  }

  const sanitized = withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
  const segments = sanitized.split('/').filter(Boolean);
  return `/${segments.map((segment) => decodeURIComponent(segment)).join('/')}/`;
}

export function sortUniqueRoutes(routes) {
  return [...new Set(routes.map((route) => encodeRoute(route)))].sort((a, b) => a.localeCompare(b));
}

export function diffApprovedVsLive(approvedRoutes, liveRoutes) {
  const approved = sortUniqueRoutes(approvedRoutes);
  const live = sortUniqueRoutes(liveRoutes);
  const liveSet = new Set(live);
  const approvedSet = new Set(approved);

  return {
    approvedRoutes: approved,
    liveRoutes: live,
    missingLiveRoutes: approved.filter((route) => !liveSet.has(route)),
    unexpectedLiveRoutes: live.filter((route) => !approvedSet.has(route)),
  };
}

export function extractRoutePathsFromSitemapXml(xmlText) {
  const locPattern = /<loc>(.*?)<\/loc>/g;
  const rawLocations = [];
  let match = locPattern.exec(xmlText);
  while (match) {
    rawLocations.push(match[1]);
    match = locPattern.exec(xmlText);
  }

  const routes = [];
  for (const location of rawLocations) {
    try {
      const url = new URL(location);
      routes.push(encodeRoute(url.pathname));
    } catch {
      continue;
    }
  }

  return sortUniqueRoutes(routes);
}

function normalizePath(inputPath) {
  const withForwardSlashes = inputPath.replaceAll('\\', '/');
  return pathPosix.normalize(withForwardSlashes);
}
