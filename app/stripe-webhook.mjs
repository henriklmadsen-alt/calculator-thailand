/**
 * Stripe webhook handler (CAL-1267).
 * POST /api/stripe/webhook
 *
 * Verifies Stripe-Signature header against STRIPE_WEBHOOK_SECRET.
 * Handles:
 *   checkout.session.completed       — one-time payment flow: update tier from session metadata
 *   customer.subscription.created    — subscription flow: update tier from price ID
 *   customer.subscription.updated    — subscription flow: update tier from price ID
 *   customer.subscription.deleted    — reset user to free tier
 *   invoice.payment_failed           — log for ops visibility
 *
 * Idempotent: updating a user's tier to the same value is a safe no-op.
 * Returns 200 to Stripe for all successfully verified events to prevent retries.
 */

import Stripe from 'stripe';
import { getUserByStripeCustomerId, updateUserTier } from './db.mjs';

const VALID_PAID_TIERS = new Set(['basic', 'premium', 'master']);

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY env var not set');
  return new Stripe(key, { apiVersion: '2024-04-10' });
}

function getPriceToTierMap() {
  const map = {};
  if (process.env.STRIPE_PRICE_ID_BASIC) map[process.env.STRIPE_PRICE_ID_BASIC] = 'basic';
  if (process.env.STRIPE_PRICE_ID_PREMIUM) map[process.env.STRIPE_PRICE_ID_PREMIUM] = 'premium';
  if (process.env.STRIPE_PRICE_ID_MASTER) map[process.env.STRIPE_PRICE_ID_MASTER] = 'master';
  return map;
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function jsonResponse(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

async function handleCheckoutSessionCompleted(session) {
  const { userId, tier } = session.metadata || {};
  if (!userId || !VALID_PAID_TIERS.has(tier)) {
    console.warn('[stripe-webhook] checkout.session.completed: missing or invalid userId/tier in metadata');
    return;
  }
  await updateUserTier(userId, tier);
  console.log(`[stripe-webhook] checkout completed — user ${userId} tier → ${tier}`);
}

async function handleSubscriptionCreatedOrUpdated(subscription) {
  if (subscription.status !== 'active') {
    console.log(`[stripe-webhook] subscription ${subscription.id} status=${subscription.status} — skipping tier update`);
    return;
  }
  const customerId = subscription.customer;
  const priceId = subscription.items?.data?.[0]?.price?.id;
  const tier = getPriceToTierMap()[priceId];

  if (!tier) {
    console.warn(`[stripe-webhook] unrecognized price ID ${priceId} for customer ${customerId}`);
    return;
  }

  const user = await getUserByStripeCustomerId(customerId);
  if (!user) {
    console.warn(`[stripe-webhook] subscription event: no user found for Stripe customer ${customerId}`);
    return;
  }

  await updateUserTier(user.id, tier);
  console.log(`[stripe-webhook] subscription active — user ${user.id} tier → ${tier}`);
}

async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer;
  const user = await getUserByStripeCustomerId(customerId);
  if (!user) {
    console.warn(`[stripe-webhook] subscription.deleted: no user found for Stripe customer ${customerId}`);
    return;
  }
  await updateUserTier(user.id, 'free');
  console.log(`[stripe-webhook] subscription cancelled — user ${user.id} tier → free`);
}

function logPaymentFailed(invoice) {
  console.warn(
    `[stripe-webhook] invoice.payment_failed: customer=${invoice.customer}` +
    ` invoice=${invoice.id} amount_due=${invoice.amount_due}` +
    ` attempt=${invoice.attempt_count} next_attempt=${invoice.next_payment_attempt || 'none'}`
  );
}

export async function handleStripeWebhook(req, res) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET env var not set');
    jsonResponse(res, 500, { error: 'Webhook not configured' });
    return;
  }

  const sig = req.headers['stripe-signature'];
  if (!sig) {
    jsonResponse(res, 400, { error: 'Missing Stripe-Signature header' });
    return;
  }

  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch (err) {
    console.error('[stripe-webhook] failed to read body:', err.message);
    jsonResponse(res, 400, { error: 'Failed to read request body' });
    return;
  }

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('[stripe-webhook] signature verification failed:', err.message);
    jsonResponse(res, 400, { error: 'Webhook signature verification failed' });
    return;
  }

  console.log(`[stripe-webhook] event: ${event.type} id=${event.id}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionCreatedOrUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_failed':
        logPaymentFailed(event.data.object);
        break;
      default:
        console.log(`[stripe-webhook] unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error(`[stripe-webhook] error handling ${event.type}:`, err.message);
    // Return 500 so Stripe retries — only for unexpected internal errors
    jsonResponse(res, 500, { error: 'Internal error processing webhook' });
    return;
  }

  jsonResponse(res, 200, { received: true });
}
