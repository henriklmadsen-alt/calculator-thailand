import type { APIRoute } from 'astro';

const THB_PER_UNIT_FALLBACK: Record<string, number> = {
  THB: 1,
  USD: 36.5,
  EUR: 39.6,
  GBP: 46.6,
  JPY: 0.236,
  CNY: 5.05,
  HKD: 4.68,
  SGD: 27.1,
  AUD: 24.2,
  KRW: 0.0265,
};

const SUPPORTED_CODES = new Set(Object.keys(THB_PER_UNIT_FALLBACK));

function normalizeCurrencyCode(value: string | null): string {
  const code = String(value || '').trim().toUpperCase();
  return /^[A-Z]{3}$/.test(code) ? code : '';
}

function buildFallbackRates(base: string, symbols: string[]) {
  const baseThb = THB_PER_UNIT_FALLBACK[base];
  return Object.fromEntries(
    symbols
      .map((symbol) => {
        const quoteThb = THB_PER_UNIT_FALLBACK[symbol];
        if (!Number.isFinite(baseThb) || !Number.isFinite(quoteThb) || quoteThb <= 0) return null;
        return [symbol, baseThb / quoteThb];
      })
      .filter(Boolean) as Array<[string, number]>,
  );
}

async function fetchLiveRates(base: string, symbols: string[]) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`exchange provider returned ${response.status}`);

    const payload = await response.json();
    const providerRates = payload?.rates || {};
    const rates = Object.fromEntries(
      symbols
        .map((symbol) => [symbol, Number(providerRates[symbol])] as const)
        .filter(([, rate]) => Number.isFinite(rate) && rate > 0),
    );

    if (Object.keys(rates).length !== symbols.length) {
      throw new Error('exchange provider response missing requested symbols');
    }

    return {
      rates,
      source: 'open.er-api.com',
      stale: false,
      lastUpdatedAt: payload?.time_last_update_utc
        ? new Date(payload.time_last_update_utc).toISOString()
        : new Date().toISOString(),
    };
  } finally {
    clearTimeout(timeout);
  }
}

export const GET: APIRoute = async ({ url }) => {
  const base = normalizeCurrencyCode(url.searchParams.get('base')) || 'THB';
  const symbols = [...new Set(
    String(url.searchParams.get('symbols') || 'USD')
      .split(',')
      .map(normalizeCurrencyCode)
      .filter(Boolean),
  )].slice(0, 12);

  if (!SUPPORTED_CODES.has(base) || symbols.length === 0 || symbols.some((code) => !SUPPORTED_CODES.has(code))) {
    return new Response(JSON.stringify({ error: 'unsupported_currency' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  }

  try {
    const live = await fetchLiveRates(base, symbols);
    return new Response(JSON.stringify({ base, ...live }), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=900, s-maxage=1800',
      },
    });
  } catch {
    return new Response(JSON.stringify({
      base,
      rates: buildFallbackRates(base, symbols),
      source: 'static-fallback',
      stale: true,
      lastUpdatedAt: new Date().toISOString(),
      warning: 'live_exchange_rate_unavailable',
    }), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=900',
      },
    });
  }
};
