/**
 * Stripe checkout session endpoint (CAL-1266).
 * POST /api/stripe/checkout — body: { tier: 'basic' | 'premium' | 'master' }
 * Returns { checkoutUrl }.
 */

import Stripe from 'stripe';
import { getCurrentUser } from './auth.mjs';
import { getUserById, setUserStripeCustomerId } from './db.mjs';

const VALID_TIERS = new Set(['basic', 'premium', 'master']);

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY env var not set');
  return new Stripe(key, { apiVersion: '2024-04-10' });
}

function getPriceId(tier) {
  const map = {
    basic: process.env.STRIPE_PRICE_ID_BASIC,
    premium: process.env.STRIPE_PRICE_ID_PREMIUM,
    master: process.env.STRIPE_PRICE_ID_MASTER,
  };
  return map[tier] || null;
}

function jsonResponse(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

export async function handleStripeCheckout(req, res) {
  const session = getCurrentUser(req);
  if (!session) {
    jsonResponse(res, 401, { error: 'Unauthorized' });
    return;
  }

  let tier;
  try {
    const body = await readBody(req);
    ({ tier } = JSON.parse(body));
  } catch {
    jsonResponse(res, 400, { error: 'Invalid JSON body' });
    return;
  }

  if (!VALID_TIERS.has(tier)) {
    jsonResponse(res, 400, { error: 'tier must be basic, premium, or master' });
    return;
  }

  const priceId = getPriceId(tier);
  if (!priceId) {
    jsonResponse(res, 500, { error: `STRIPE_PRICE_ID_${tier.toUpperCase()} not configured` });
    return;
  }

  try {
    const stripe = getStripe();
    const user = await getUserById(session.userId);
    if (!user) {
      jsonResponse(res, 404, { error: 'User not found' });
      return;
    }

    // Reuse existing Stripe customer or create a new one
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id },
      });
      stripeCustomerId = customer.id;
      await setUserStripeCustomerId(user.id, stripeCustomerId);
    }

    const siteUrl = (process.env.PUBLIC_SITE_URL || 'https://www.kamnuanlek.com').replace(/\/$/, '');
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/ai-advisor?upgraded=true`,
      cancel_url: `${siteUrl}/ai-advisor`,
      metadata: { userId: user.id, tier },
    });

    jsonResponse(res, 200, { checkoutUrl: checkoutSession.url });
  } catch (err) {
    console.error('[stripe] checkout error:', err.message);
    jsonResponse(res, 500, { error: 'Failed to create checkout session' });
  }
}
