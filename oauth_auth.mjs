import crypto from 'crypto';
import { URLSearchParams } from 'url';

const config = {
  client_id: process.env.GOOGLE_OAUTH_CLIENT_ID || (() => { throw new Error('GOOGLE_OAUTH_CLIENT_ID environment variable is required'); })(),
  client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || (() => { throw new Error('GOOGLE_OAUTH_CLIENT_SECRET environment variable is required'); })(),
  redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI || 'http://localhost:3000/oauth-callback',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token'
};

// Generate random state for security
const state = crypto.randomBytes(32).toString('hex');

// Build authorization URL
const params = new URLSearchParams({
  client_id: config.client_id,
  redirect_uri: config.redirect_uri,
  response_type: 'code',
  scope: 'https://www.googleapis.com/auth/webmasters.readonly',
  state: state,
  access_type: 'offline',
  prompt: 'consent'
});

const authUrl = `${config.auth_uri}?${params.toString()}`;

console.log('🔐 Authorization URL:\n');
console.log(authUrl);
console.log('\n📋 Steps:');
console.log('1. Click the link above (or copy-paste to browser)');
console.log('2. Sign in with henriklm25@gmail.com');
console.log('3. Click "Allow" to grant access');
console.log('4. You\'ll be redirected to localhost:3000');
console.log('5. Copy the "code=..." value from the URL');
console.log('6. Provide that code here\n');

// Save config for next step
const oauth_data = { ...config, state, authUrl };
console.log('Waiting for authorization code...');
