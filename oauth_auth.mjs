import crypto from 'crypto';
import { URLSearchParams } from 'url';

const config = {
  client_id: '875518086731-lbe38ct2fveq7t9e4h2ehvn2mme3mrj2.apps.googleusercontent.com',
  client_secret: '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',
  redirect_uri: 'http://localhost:3000/oauth-callback',
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
