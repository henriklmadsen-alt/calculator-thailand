import { google } from 'googleapis';
import fs from 'fs';

const keyPath = './gsc-credentials.json';
const webmasters = google.webmasters('v3');

try {
  console.log('🔐 Authenticating with GSC using keyfile...');
  const jwtClient = new google.auth.JWT({
    keyFile: keyPath,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
  });

  await jwtClient.authorize();
  console.log('✓ Authentication successful!\n');

  console.log('📊 Fetching registered sites...');
  const response = await webmasters.sites.list({ auth: jwtClient });
  
  if (response.data.siteEntry?.length > 0) {
    console.log(`Found ${response.data.siteEntry.length} site(s):\n`);
    response.data.siteEntry.forEach(site => {
      console.log(`  - ${site.siteUrl}`);
    });
  } else {
    console.log('✓ No sites registered yet (property exists)');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
