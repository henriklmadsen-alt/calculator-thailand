import { google } from 'googleapis';
import { getAffiliateRedirectSummary } from './affiliate-redirect.mjs';
import { getClientEventSummary } from './client-events.mjs';

const DEFAULT_SITE_URL = 'https://www.kamnuanlek.com/';
const GSC_DATA_LAG_DAYS = 3;
const AFFILIATE_EVENTS = new Set([
  'affiliate_cta_view',
  'affiliate_click',
  'affiliate_redirect',
  'affiliate_click_unconfigured',
  'affiliate_redirect_unconfigured',
]);

function jsonHeaders(extra = {}) {
  return {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, max-age=0',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    ...extra,
  };
}

function sendJson(res, status, payload, extraHeaders = {}) {
  res.writeHead(status, jsonHeaders(extraHeaders));
  res.end(JSON.stringify(payload));
}

function safeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function round(value, decimals = 1) {
  const factor = 10 ** decimals;
  return Math.round(safeNumber(value) * factor) / factor;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function getDateRange(days, periodOffset = 0) {
  const safeDays = Math.min(Math.max(Number.parseInt(String(days || 28), 10) || 28, 7), 180);
  const end = new Date(Date.now() - (GSC_DATA_LAG_DAYS + periodOffset * safeDays) * 24 * 60 * 60 * 1000);
  const start = new Date(end.getTime() - (safeDays - 1) * 24 * 60 * 60 * 1000);
  return {
    days: safeDays,
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
}

function parseJsonEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) return null;
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(`${name} contains invalid JSON`);
  }
}

function assertServiceAccount(name, value) {
  if (!value?.client_email || !value?.private_key) {
    throw new Error(`${name} must include client_email and private_key`);
  }
}

function getBearerToken(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization || '';
  if (Array.isArray(authHeader)) return '';
  if (!authHeader.startsWith('Bearer ')) return '';
  return authHeader.slice(7).trim();
}

function expectedCtrForPosition(position) {
  const p = safeNumber(position, 99);
  if (p <= 1) return 28;
  if (p <= 2) return 16;
  if (p <= 3) return 10;
  if (p <= 4) return 7;
  if (p <= 5) return 5;
  if (p <= 10) return 3;
  if (p <= 20) return 1.4;
  return 0.6;
}

function normalizePath(pageUrl) {
  if (!pageUrl) return '';
  try {
    const parsed = new URL(pageUrl);
    return decodeURIComponent(parsed.pathname || '/');
  } catch {
    try {
      return decodeURIComponent(String(pageUrl));
    } catch {
      return String(pageUrl);
    }
  }
}

function pageLabel(pageUrl) {
  const path = normalizePath(pageUrl);
  if (!path || path === '/') return '/';
  return path.replace(/^\/|\/$/g, '') || '/';
}

function mapGscRow(row, dimensions) {
  const keys = row.keys || [];
  const mapped = {
    clicks: safeNumber(row.clicks),
    impressions: safeNumber(row.impressions),
    ctr: round(safeNumber(row.ctr) * 100, 2),
    position: round(row.position, 1),
  };

  dimensions.forEach((dimension, index) => {
    mapped[dimension] = keys[index] || '';
  });

  return mapped;
}

async function createGscClient(serviceAccount) {
  assertServiceAccount('GSC_SERVICE_ACCOUNT_JSON', serviceAccount);
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  return google.webmasters({ version: 'v3', auth });
}

async function queryGsc(client, siteUrl, range, dimensions = [], rowLimit = 250, orderColumn = 'clicks') {
  const requestBody = {
    startDate: range.startDate,
    endDate: range.endDate,
    rowLimit,
  };

  if (dimensions.length > 0) {
    requestBody.dimensions = dimensions;
    requestBody.orderBy = [{ columnName: orderColumn, sortOrder: 'DESCENDING' }];
  }

  const response = await client.searchanalytics.query({
    siteUrl,
    requestBody,
  });

  return (response.data.rows || []).map((row) => mapGscRow(row, dimensions));
}

async function createGa4Client(serviceAccount) {
  assertServiceAccount('GA4_SERVICE_ACCOUNT_JSON', serviceAccount);
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });
  return google.analyticsdata({ version: 'v1beta', auth });
}

async function queryOrganicGa4(client, propertyId, range) {
  const response = await client.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }],
      metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'sessionDefaultChannelGroup',
          stringFilter: { matchType: 'EXACT', value: 'Organic Search' },
        },
      },
    },
  });

  const row = response.data.rows?.[0];
  if (!row) return { sessions: 0, users: 0, events: 0 };

  return {
    sessions: safeNumber(row.metricValues?.[0]?.value),
    users: safeNumber(row.metricValues?.[1]?.value),
    events: safeNumber(row.metricValues?.[2]?.value),
  };
}

async function queryAffiliateGa4(client, propertyId, range) {
  const response = await client.properties.runReport({
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate: range.startDate, endDate: range.endDate }],
      dimensions: [{ name: 'eventName' }, { name: 'pagePath' }],
      metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
      limit: 500,
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          inListFilter: { values: [...AFFILIATE_EVENTS] },
        },
      },
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    },
  });

  const pages = new Map();
  const totals = {
    ctaViews: 0,
    clicks: 0,
    redirects: 0,
    unconfiguredClicks: 0,
    unconfiguredRedirects: 0,
  };

  for (const row of response.data.rows || []) {
    const eventName = row.dimensionValues?.[0]?.value || '';
    const pagePath = row.dimensionValues?.[1]?.value || '/';
    const count = safeNumber(row.metricValues?.[0]?.value);
    const users = safeNumber(row.metricValues?.[1]?.value);
    const key = pagePath || '/';

    if (!pages.has(key)) {
      pages.set(key, {
        page: key,
        label: pageLabel(key),
        ctaViews: 0,
        clicks: 0,
        redirects: 0,
        unconfigured: 0,
        users: 0,
        clickRate: 0,
      });
    }

    const page = pages.get(key);
    page.users += users;

    if (eventName === 'affiliate_cta_view') {
      page.ctaViews += count;
      totals.ctaViews += count;
    } else if (eventName === 'affiliate_click') {
      page.clicks += count;
      totals.clicks += count;
    } else if (eventName === 'affiliate_redirect') {
      page.redirects += count;
      totals.redirects += count;
    } else if (eventName === 'affiliate_click_unconfigured') {
      page.unconfigured += count;
      totals.unconfiguredClicks += count;
    } else if (eventName === 'affiliate_redirect_unconfigured') {
      page.unconfigured += count;
      totals.unconfiguredRedirects += count;
    }
  }

  const rows = [...pages.values()].map((page) => ({
    ...page,
    clickRate: page.ctaViews > 0 ? round((page.clicks / page.ctaViews) * 100, 2) : 0,
  })).sort((a, b) => (b.clicks + b.redirects) - (a.clicks + a.redirects));

  return {
    totals: {
      ...totals,
      clickRate: totals.ctaViews > 0 ? round((totals.clicks / totals.ctaViews) * 100, 2) : 0,
    },
    pages: rows,
  };
}

function computeSearchSummary(queryRows, totalsRows) {
  const totalRow = totalsRows?.[0] || {};
  const totalImpressions = safeNumber(totalRow.impressions) || queryRows.reduce((sum, row) => sum + row.impressions, 0);
  const totalClicks = safeNumber(totalRow.clicks) || queryRows.reduce((sum, row) => sum + row.clicks, 0);
  const weightedPosition = queryRows.reduce((sum, row) => sum + row.position * Math.max(row.impressions, 1), 0);
  const weightedBase = queryRows.reduce((sum, row) => sum + Math.max(row.impressions, 1), 0);
  const avgPosition = weightedBase > 0 ? round(weightedPosition / weightedBase, 1) : round(totalRow.position, 1);

  return {
    clicks: totalClicks,
    impressions: totalImpressions,
    ctr: totalImpressions > 0 ? round((totalClicks / totalImpressions) * 100, 2) : 0,
    avgPosition,
    keywordCount: queryRows.length,
    queriesAt1: queryRows.filter((row) => row.position <= 1.4).length,
    queriesAt1To5: queryRows.filter((row) => row.position <= 5).length,
    queriesAt1To10: queryRows.filter((row) => row.position <= 10).length,
  };
}

function buildBestPageByQuery(queryPageRows) {
  const map = new Map();
  for (const row of queryPageRows) {
    const query = String(row.query || '').toLowerCase();
    if (!query) continue;
    const current = map.get(query);
    if (!current || row.impressions > current.impressions || row.clicks > current.clicks) {
      map.set(query, row);
    }
  }
  return map;
}

function computeKeywordMovers(currentRows, previousRows, bestPageByQuery) {
  const previousByQuery = new Map(previousRows.map((row) => [String(row.query || '').toLowerCase(), row]));

  return currentRows.map((row) => {
    const previous = previousByQuery.get(String(row.query || '').toLowerCase()) || {};
    const impressionsDelta = row.impressions - safeNumber(previous.impressions);
    const clicksDelta = row.clicks - safeNumber(previous.clicks);
    const positionDelta = safeNumber(previous.position, row.position) - row.position;
    const bestPage = bestPageByQuery.get(String(row.query || '').toLowerCase());

    return {
      query: row.query,
      page: bestPage?.page || '',
      pageLabel: bestPage ? pageLabel(bestPage.page) : '',
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
      impressionsDelta,
      clicksDelta,
      positionDelta: round(positionDelta, 1),
      growthScore: round((clicksDelta * 12) + impressionsDelta + Math.max(positionDelta, 0) * 20, 1),
    };
  });
}

function computeRankOpportunities(currentRows, bestPageByQuery) {
  return currentRows
    .filter((row) => row.impressions >= 3 && row.position > 3 && row.position <= 20)
    .map((row) => {
      const expectedCtr = expectedCtrForPosition(row.position);
      const ctrGap = Math.max(0, expectedCtr - row.ctr);
      const topThreeLift = Math.max(0, 10 - row.ctr);
      const bestPage = bestPageByQuery.get(String(row.query || '').toLowerCase());
      return {
        query: row.query,
        page: bestPage?.page || '',
        pageLabel: bestPage ? pageLabel(bestPage.page) : '',
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
        targetPosition: 3,
        expectedCtr,
        opportunityScore: round(row.impressions * (21 - row.position) * (1 + ctrGap / 10), 1),
        potentialExtraClicks: round((row.impressions * topThreeLift) / 100, 1),
        recommendedAction: 'Improve title, intro answer, FAQ schema, internal links, and calculator result clarity for this exact query.',
      };
    })
    .sort((a, b) => b.opportunityScore - a.opportunityScore);
}

function computeCtrRepairs(pageRows) {
  return pageRows
    .filter((row) => row.impressions >= 5)
    .map((row) => {
      const expectedCtr = expectedCtrForPosition(row.position);
      const ctrGap = round(Math.max(0, expectedCtr - row.ctr), 2);
      return {
        page: row.page,
        label: pageLabel(row.page),
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
        expectedCtr,
        ctrGap,
        opportunityScore: round(row.impressions * ctrGap, 1),
        recommendedAction: 'Rewrite title/meta around the winning query, add a direct answer block, and make the primary calculator CTA visible above the fold.',
      };
    })
    .filter((row) => row.ctrGap > 0)
    .sort((a, b) => b.opportunityScore - a.opportunityScore);
}

function computeReadinessScore({ hasGsc, hasGa4, search, opportunities, ctrRepairs, affiliate }) {
  let score = 0;
  if (hasGsc) score += 30;
  if (hasGa4) score += 15;
  if (search.impressions > 0) score += 10;
  if (search.ctr >= 4) score += 12;
  else if (search.ctr >= 2) score += 7;
  else if (search.ctr > 0) score += 4;
  if (search.avgPosition > 0 && search.avgPosition <= 10) score += 13;
  else if (search.avgPosition <= 20) score += 8;
  else if (search.avgPosition <= 40) score += 4;
  if (opportunities.length > 0) score += 8;
  if (ctrRepairs.length > 0) score += 5;
  if (affiliate.totals?.clicks > 0 || affiliate.totals?.redirects > 0) score += 7;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function buildActionQueue({ opportunities, ctrRepairs, growing, affiliate }) {
  const actions = [];

  for (const item of opportunities.slice(0, 5)) {
    actions.push({
      priority: 'High',
      lane: 'SEO rank push',
      target: item.query,
      page: item.page,
      metric: `Position ${item.position}, ${item.impressions} impressions`,
      action: item.recommendedAction,
    });
  }

  for (const item of ctrRepairs.slice(0, 4)) {
    actions.push({
      priority: 'High',
      lane: 'CTR repair',
      target: item.label,
      page: item.page,
      metric: `${item.ctr}% CTR vs ${item.expectedCtr}% expected`,
      action: item.recommendedAction,
    });
  }

  for (const item of affiliate.pages.filter((page) => page.ctaViews >= 5 && page.clickRate < 2).slice(0, 3)) {
    actions.push({
      priority: 'Medium',
      lane: 'Affiliate revenue',
      target: item.label,
      page: item.page,
      metric: `${item.ctaViews} CTA views, ${item.clickRate}% click rate`,
      action: 'Test a stronger benefit-led affiliate card and move the CTA closer to the first useful result.',
    });
  }

  for (const item of growing.filter((row) => row.growthScore > 0).slice(0, 3)) {
    actions.push({
      priority: 'Medium',
      lane: 'Growth capture',
      target: item.query,
      page: item.page,
      metric: `+${item.impressionsDelta} impressions, +${item.clicksDelta} clicks`,
      action: 'Add supporting FAQ and internal links while the query is gaining momentum.',
    });
  }

  return actions.slice(0, 12);
}

export async function buildKpiDashboardPayload(days = 28) {
  const warnings = [];
  const range = getDateRange(days, 0);
  const previousRange = getDateRange(range.days, 1);
  const gscSiteUrl = process.env.GSC_SITE_URL || DEFAULT_SITE_URL;
  const gscKeyJson = parseJsonEnv('GSC_SERVICE_ACCOUNT_JSON');

  if (!gscKeyJson) {
    throw Object.assign(new Error('Set GSC_SERVICE_ACCOUNT_JSON to enable ranking and CTR reporting'), { statusCode: 503 });
  }

  const gscClient = await createGscClient(gscKeyJson);
  const [
    totalsRows,
    queryRows,
    previousQueryRows,
    pageRows,
    queryPageRows,
  ] = await Promise.all([
    queryGsc(gscClient, gscSiteUrl, range, [], 1, 'clicks'),
    queryGsc(gscClient, gscSiteUrl, range, ['query'], 250, 'impressions'),
    queryGsc(gscClient, gscSiteUrl, previousRange, ['query'], 250, 'impressions'),
    queryGsc(gscClient, gscSiteUrl, range, ['page'], 150, 'impressions'),
    queryGsc(gscClient, gscSiteUrl, range, ['query', 'page'], 500, 'impressions'),
  ]);

  const bestPageByQuery = buildBestPageByQuery(queryPageRows);
  const search = computeSearchSummary(queryRows, totalsRows);
  const movers = computeKeywordMovers(queryRows, previousQueryRows, bestPageByQuery);
  const growing = movers
    .filter((row) => row.impressionsDelta > 0 || row.clicksDelta > 0 || row.positionDelta > 0)
    .sort((a, b) => b.growthScore - a.growthScore)
    .slice(0, 40);
  const opportunities = computeRankOpportunities(queryRows, bestPageByQuery).slice(0, 50);
  const ctrRepairs = computeCtrRepairs(pageRows).slice(0, 40);

  const ga4KeyJson = parseJsonEnv('GA4_SERVICE_ACCOUNT_JSON');
  const ga4PropertyId = process.env.GA4_PROPERTY_ID?.trim() || '';
  let hasGa4 = false;
  let organic = { sessions: 0, users: 0, events: 0 };
  let affiliate = {
    totals: {
      ctaViews: 0,
      clicks: 0,
      redirects: 0,
      unconfiguredClicks: 0,
      unconfiguredRedirects: 0,
      clickRate: 0,
    },
    pages: [],
  };
  const serverAffiliate = await getAffiliateRedirectSummary(range.days);
  const clientEvents = await getClientEventSummary(range.days);

  if (ga4KeyJson && ga4PropertyId) {
    try {
      const ga4Client = await createGa4Client(ga4KeyJson);
      hasGa4 = true;
      [organic, affiliate] = await Promise.all([
        queryOrganicGa4(ga4Client, ga4PropertyId, range),
        queryAffiliateGa4(ga4Client, ga4PropertyId, range),
      ]);
    } catch (error) {
      hasGa4 = false;
      warnings.push(`GA4 request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } else {
    warnings.push('GA4_SERVICE_ACCOUNT_JSON and GA4_PROPERTY_ID are not configured; CTA views and click-rate metrics are hidden, but first-party affiliate redirects are tracked.');
  }

  const affiliatePages = new Map();
  for (const page of affiliate.pages) {
    affiliatePages.set(page.page, { ...page, serverRedirects: 0 });
  }
  for (const page of serverAffiliate.pages) {
    const key = page.page;
    const existing = affiliatePages.get(key) || {
      page: key,
      label: page.label,
      ctaViews: 0,
      clicks: 0,
      redirects: 0,
      unconfigured: 0,
      users: 0,
      clickRate: 0,
      serverRedirects: 0,
    };
    existing.serverRedirects += page.redirects;
    existing.redirects += page.redirects;
    affiliatePages.set(key, existing);
  }

  const useClientAffiliateFallback = !hasGa4 || affiliate.pages.length === 0;
  if (useClientAffiliateFallback) {
    for (const page of clientEvents.affiliateByCalculator) {
      const key = page.calculatorPath;
      const existing = affiliatePages.get(key) || {
        page: key,
        label: pageLabel(key),
        ctaViews: 0,
        clicks: 0,
        redirects: 0,
        unconfigured: 0,
        users: 0,
        clickRate: 0,
        serverRedirects: 0,
      };
      existing.ctaViews += page.ctaViews;
      existing.clicks += page.clicks;
      existing.clickRate = existing.ctaViews > 0 ? round((existing.clicks / existing.ctaViews) * 100, 2) : 0;
      affiliatePages.set(key, existing);
    }
  }

  const mergedCtaViews = affiliate.totals.ctaViews + (useClientAffiliateFallback ? clientEvents.totals.affiliateCtaViews : 0);
  const mergedClicks = affiliate.totals.clicks + (useClientAffiliateFallback ? clientEvents.totals.affiliateClicks : 0);

  affiliate = {
    totals: {
      ...affiliate.totals,
      ctaViews: mergedCtaViews,
      clicks: mergedClicks,
      redirects: affiliate.totals.redirects + serverAffiliate.totals.redirects,
      serverRedirects: serverAffiliate.totals.redirects,
      clientTrackedClicks: clientEvents.totals.affiliateClicks,
      clientTrackedViews: clientEvents.totals.affiliateCtaViews,
      clickRate: mergedCtaViews > 0
        ? round((mergedClicks / mergedCtaViews) * 100, 2)
        : affiliate.totals.clickRate,
    },
    pages: [...affiliatePages.values()].sort((a, b) => (b.clicks + b.redirects) - (a.clicks + a.redirects)),
    partners: serverAffiliate.partners,
    variants: serverAffiliate.variants || [],
  };

  const score = computeReadinessScore({
    hasGsc: true,
    hasGa4,
    search,
    opportunities,
    ctrRepairs,
    affiliate,
  });

  return {
    timestamp: new Date().toISOString(),
    period: `${range.days} days`,
    range,
    previousRange,
    siteUrl: gscSiteUrl,
    dataSources: {
      gsc: true,
      ga4: hasGa4,
    },
    warnings,
    score,
    search,
    organic,
    keywords: {
      top: queryRows.slice(0, 50).map((row) => ({
        ...row,
        page: bestPageByQuery.get(String(row.query || '').toLowerCase())?.page || '',
        pageLabel: bestPageByQuery.get(String(row.query || '').toLowerCase())?.page
          ? pageLabel(bestPageByQuery.get(String(row.query || '').toLowerCase())?.page)
          : '',
      })),
      growing,
      opportunities,
    },
    pages: {
      top: pageRows.slice(0, 50).map((row) => ({ ...row, label: pageLabel(row.page) })),
      ctrRepairs,
    },
    affiliate,
    discovery: {
      clientEvents: {
        totals: clientEvents.totals,
        zeroSearchTerms: clientEvents.zeroSearchTerms.slice(0, 25),
        affiliateByCalculator: clientEvents.affiliateByCalculator.slice(0, 25),
      },
    },
    actions: buildActionQueue({ opportunities, ctrRepairs, growing, affiliate }),
  };
}

export async function handleKpiDashboardRequest(req, res, incomingUrl) {
  const configuredToken = process.env.KPI_API_TOKEN?.trim();
  if (!configuredToken) {
    sendJson(res, 503, {
      error: 'KPI API token not configured',
      message: 'Set KPI_API_TOKEN before using the admin dashboard',
    });
    return;
  }

  const token = getBearerToken(req);
  if (!token) {
    sendJson(res, 401, { error: 'Unauthorized', message: 'Missing Bearer token' });
    return;
  }

  if (token !== configuredToken) {
    sendJson(res, 403, { error: 'Forbidden', message: 'Invalid KPI token' });
    return;
  }

  try {
    const days = Number.parseInt(incomingUrl?.searchParams?.get('days') || '28', 10);
    const payload = await buildKpiDashboardPayload(days);
    sendJson(res, 200, payload);
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    console.error('[kpi-dashboard] request failed:', error);
    sendJson(res, statusCode, {
      error: statusCode === 503 ? 'KPI data source not configured' : 'Failed to fetch KPI data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
