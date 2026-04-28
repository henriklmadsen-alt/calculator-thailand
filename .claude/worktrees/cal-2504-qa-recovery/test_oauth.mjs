import fs from 'fs';
import https from 'https';
import crypto from 'crypto';

const credentials = JSON.parse(fs.readFileSync('./gsc-credentials.json', 'utf8'));

function base64Url(str) {
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

async function getAccessToken() {
  const header = base64Url(Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64'));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64Url(Buffer.from(JSON.stringify({
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  })).toString('base64'));

  const signData = `${header}.${payload}`;
  const signature = base64Url(
    crypto.createSign('RSA-SHA256')
      .update(signData)
      .sign(credentials.private_key, 'base64')
  );

  const jwt = `${signData}.${signature}`;

  return new Promise((resolve, reject) => {
    const data = `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`;
    const options = {
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          if (result.access_token) {
            console.log('✓ Got access token');
            resolve(result.access_token);
          } else {
            reject(new Error(`Token error: ${JSON.stringify(result)}`));
          }
        } catch (e) {
          reject(new Error(`Parse error: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  try {
    console.log('🔐 Testing manual OAuth2 flow...');
    const token = await getAccessToken();
    console.log('✓ Token obtained, testing GSC API...\n');

    const options = {
      hostname: 'www.googleapis.com',
      path: '/webmasters/v3/sites',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    https.get(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        const data = JSON.parse(body);
        if (res.statusCode === 200 && data.siteEntry) {
          console.log(`✓ GSC API working! Found ${data.siteEntry.length} sites`);
          data.siteEntry.forEach(s => console.log(`  - ${s.siteUrl}`));
        } else {
          console.log('Response:', JSON.stringify(data, null, 2).substring(0, 500));
        }
      });
    }).on('error', console.error);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
})();
