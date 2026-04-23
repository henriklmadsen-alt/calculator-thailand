/**
 * OAuth 2.0 handlers for Google, Facebook, and Apple Sign-In.
 * Sessions are issued as JWT cookies (HttpOnly, Secure, SameSite=Lax).
 *
 * Required env vars:
 *   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
 *   FACEBOOK_APP_ID, FACEBOOK_APP_SECRET
 *   APPLE_CLIENT_ID, APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY
 *   JWT_SECRET   (min 32 chars)
 *   PUBLIC_SITE_URL
 */

import { createHmac, randomBytes, createSign } from 'node:crypto';
import { getOrCreateUser } from './db.mjs';

const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://www.kamnuanlek.com').replace(/\/$/, '');
const JWT_SECRET = process.env.JWT_SECRET || '';
const SESSION_COOKIE = '__session';
const STATE_COOKIE = '__oauth_state';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// ── JWT (HS256 using Node crypto) ─────────────────────────────────────────────

function b64url(str) {
  return Buffer.from(str).toString('base64url');
}

function signJwt(payload) {
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) }));
  const sig = createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

function verifyJwt(token) {
  try {
    const [header, body, sig] = token.split('.');
    const expected = createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (sig !== expected) return null;
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'));
  } catch {
    return null;
  }
}

// ── Cookie helpers ────────────────────────────────────────────────────────────

export function parseCookies(req) {
  const header = req.headers.cookie || '';
  return Object.fromEntries(
    header.split(';').map(s => s.trim().split('=').map(decodeURIComponent))
  );
}

function setSessionCookie(res, token, options = {}) {
  const secure = SITE_URL.startsWith('https');
  const flags = [
    `HttpOnly`,
    `SameSite=Lax`,
    `Path=/`,
    `Max-Age=${COOKIE_MAX_AGE}`,
    secure ? 'Secure' : '',
  ].filter(Boolean).join('; ');
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${encodeURIComponent(token)}; ${flags}`);
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
}

function setStateCookie(res, state) {
  res.setHeader('Set-Cookie', `${STATE_COOKIE}=${state}; Path=/; Max-Age=600; HttpOnly; SameSite=Lax`);
}

// ── Current user from request ─────────────────────────────────────────────────

export function getCurrentUser(req) {
  if (!JWT_SECRET) return null;
  const cookies = parseCookies(req);
  const token = cookies[SESSION_COOKIE] ? decodeURIComponent(cookies[SESSION_COOKIE]) : null;
  if (!token) return null;
  return verifyJwt(token);
}

// ── OAuth state (CSRF) ────────────────────────────────────────────────────────

function generateState() {
  return randomBytes(16).toString('hex');
}

// ── Google OAuth 2.0 ──────────────────────────────────────────────────────────

export function handleGoogleLogin(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Google OAuth not configured' }));
    return;
  }
  const state = generateState();
  setStateCookie(res, state);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${SITE_URL}/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account',
  });
  res.writeHead(302, { Location: `https://accounts.google.com/o/oauth2/v2/auth?${params}` });
  res.end();
}

export async function handleGoogleCallback(req, res, query) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const cookies = parseCookies(req);
  const expectedState = cookies[STATE_COOKIE];

  if (!clientId || !clientSecret) return redirectWithError(res, 'google_not_configured');
  if (!query.code) return redirectWithError(res, 'google_no_code');
  if (query.state !== expectedState) return redirectWithError(res, 'google_state_mismatch');

  try {
    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: query.code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${SITE_URL}/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokenRes.ok) return redirectWithError(res, 'google_token_error');

    // Decode ID token (verify in prod with Google's JWKS)
    const idPayload = JSON.parse(Buffer.from(tokens.id_token.split('.')[1], 'base64url').toString());
    const user = await getOrCreateUser({
      provider: 'google',
      providerId: idPayload.sub,
      email: idPayload.email,
      name: idPayload.name,
      avatarUrl: idPayload.picture,
    });

    const jwt = signJwt({ userId: user.id, email: user.email, tier: user.tier });
    setSessionCookie(res, jwt);
    res.writeHead(302, { Location: '/ai-advisor' });
    res.end();
  } catch (err) {
    console.error('[auth/google] callback error:', err);
    redirectWithError(res, 'google_server_error');
  }
}

// ── Facebook OAuth 2.0 ────────────────────────────────────────────────────────

export function handleFacebookLogin(req, res) {
  const appId = process.env.FACEBOOK_APP_ID;
  if (!appId) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Facebook OAuth not configured' }));
    return;
  }
  const state = generateState();
  setStateCookie(res, state);
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: `${SITE_URL}/auth/facebook/callback`,
    scope: 'email,public_profile',
    state,
    response_type: 'code',
  });
  res.writeHead(302, { Location: `https://www.facebook.com/v18.0/dialog/oauth?${params}` });
  res.end();
}

export async function handleFacebookCallback(req, res, query) {
  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  const cookies = parseCookies(req);
  const expectedState = cookies[STATE_COOKIE];

  if (!appId || !appSecret) return redirectWithError(res, 'facebook_not_configured');
  if (!query.code) return redirectWithError(res, 'facebook_no_code');
  if (query.state !== expectedState) return redirectWithError(res, 'facebook_state_mismatch');

  try {
    const tokenRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?${new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        redirect_uri: `${SITE_URL}/auth/facebook/callback`,
        code: query.code,
      })}`
    );
    const tokens = await tokenRes.json();
    if (!tokenRes.ok || tokens.error) return redirectWithError(res, 'facebook_token_error');

    const profileRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokens.access_token}`
    );
    const profile = await profileRes.json();
    if (!profileRes.ok || profile.error) return redirectWithError(res, 'facebook_profile_error');

    const user = await getOrCreateUser({
      provider: 'facebook',
      providerId: profile.id,
      email: profile.email || `fb_${profile.id}@noemail.local`,
      name: profile.name,
      avatarUrl: profile.picture?.data?.url,
    });

    const jwt = signJwt({ userId: user.id, email: user.email, tier: user.tier });
    setSessionCookie(res, jwt);
    res.writeHead(302, { Location: '/ai-advisor' });
    res.end();
  } catch (err) {
    console.error('[auth/facebook] callback error:', err);
    redirectWithError(res, 'facebook_server_error');
  }
}

// ── Apple Sign In ─────────────────────────────────────────────────────────────
// Apple requires a client_secret that is a JWT signed with an ES256 private key.

function buildAppleClientSecret() {
  const teamId = process.env.APPLE_TEAM_ID;
  const clientId = process.env.APPLE_CLIENT_ID;
  const keyId = process.env.APPLE_KEY_ID;
  const privateKey = (process.env.APPLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  const header = b64url(JSON.stringify({ alg: 'ES256', kid: keyId }));
  const now = Math.floor(Date.now() / 1000);
  const payload = b64url(JSON.stringify({
    iss: teamId,
    iat: now,
    exp: now + 86400,
    aud: 'https://appleid.apple.com',
    sub: clientId,
  }));
  const sign = createSign('SHA256');
  sign.update(`${header}.${payload}`);
  const sig = sign.sign({ key: privateKey, format: 'pem', dsaEncoding: 'ieee-p1363' }, 'base64url');
  return `${header}.${payload}.${sig}`;
}

export function handleAppleLogin(req, res) {
  const clientId = process.env.APPLE_CLIENT_ID;
  if (!clientId || !process.env.APPLE_TEAM_ID) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Apple Sign In not configured' }));
    return;
  }
  const state = generateState();
  setStateCookie(res, state);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${SITE_URL}/auth/apple/callback`,
    response_type: 'code id_token',
    response_mode: 'form_post',
    scope: 'name email',
    state,
  });
  res.writeHead(302, { Location: `https://appleid.apple.com/auth/authorize?${params}` });
  res.end();
}

export async function handleAppleCallback(req, res, body) {
  const clientId = process.env.APPLE_CLIENT_ID;
  const cookies = parseCookies(req);
  const params = new URLSearchParams(body);
  const code = params.get('code');
  const state = params.get('state');
  const idToken = params.get('id_token');

  if (!clientId) return redirectWithError(res, 'apple_not_configured');
  if (!code) return redirectWithError(res, 'apple_no_code');
  if (state !== cookies[STATE_COOKIE]) return redirectWithError(res, 'apple_state_mismatch');

  try {
    let clientSecret;
    try {
      clientSecret = buildAppleClientSecret();
    } catch {
      return redirectWithError(res, 'apple_secret_build_error');
    }

    const tokenRes = await fetch('https://appleid.apple.com/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${SITE_URL}/auth/apple/callback`,
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokenRes.ok || tokens.error) return redirectWithError(res, 'apple_token_error');

    const idPayload = JSON.parse(Buffer.from(tokens.id_token.split('.')[1], 'base64url').toString());

    // Apple only sends name on first login; parse from form_post body
    let name = '';
    try {
      const userField = params.get('user');
      if (userField) {
        const appleUser = JSON.parse(userField);
        name = [appleUser.name?.firstName, appleUser.name?.lastName].filter(Boolean).join(' ');
      }
    } catch { /* name optional */ }

    const user = await getOrCreateUser({
      provider: 'apple',
      providerId: idPayload.sub,
      email: idPayload.email || `apple_${idPayload.sub}@privaterelay.appleid.com`,
      name: name || idPayload.email || 'Apple User',
      avatarUrl: null,
    });

    const jwt = signJwt({ userId: user.id, email: user.email, tier: user.tier });
    setSessionCookie(res, jwt);
    res.writeHead(302, { Location: '/ai-advisor' });
    res.end();
  } catch (err) {
    console.error('[auth/apple] callback error:', err);
    redirectWithError(res, 'apple_server_error');
  }
}

// ── Logout ────────────────────────────────────────────────────────────────────

export function handleLogout(req, res) {
  clearSessionCookie(res);
  res.writeHead(302, { Location: '/' });
  res.end();
}

// ── /api/me ───────────────────────────────────────────────────────────────────

export function handleApiMe(req, res) {
  const user = getCurrentUser(req);
  res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  if (!user) {
    res.end(JSON.stringify({ authenticated: false }));
    return;
  }
  res.end(JSON.stringify({
    authenticated: true,
    userId: user.userId,
    email: user.email,
    tier: user.tier || 'free',
    questionsUsed: user.questionsUsed || 0,
  }));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function redirectWithError(res, code) {
  res.writeHead(302, { Location: `/ai-advisor?error=${code}` });
  res.end();
}
