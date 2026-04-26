import fs from 'fs';
import https from 'https';
import { execSync } from 'child_process';

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
  
  // Sign using openssl command line
  fs.writeFileSync('/tmp/privkey.pem', credentials.private_key);
  const signBinary = execSync(`echo -n "${signData}" | openssl dgst -sha256 -sign /tmp/privkey.pem | xxd -p -r | base64`);
  const signature = base64Url(signBinary.toString('utf8').trim());

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
    console.log('🔐 Getting access token using OpenSSL...');
    const token = await getAccessToken();
    console.log('✓ Token obtained\n');

    console.log('📊 Querying GSC...');
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
        const data = JSON.parse(body);
        if (res.statusCode === 200) {
          console.log('✓ GSC API connected!');
          if (data.siteEntry?.length > 0) {
            console.log(`Found ${data.siteEntry.length} site(s):`);
            data.siteEntry.forEach(s => console.log(`  - ${s.siteUrl}`));
          } else {
            console.log('⚠ No sites registered yet');
          }
        } else {
          console.log(`Error: ${res.statusCode}`);
          console.log(JSON.stringify(data).substring(0, 300));
        }
      });
    }).on('error', console.error);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
})();
