import { google } from 'googleapis';
import fs from 'fs';

const credentials = JSON.parse(fs.readFileSync('./gsc-credentials.json', 'utf8'));

const webmasters = google.webmasters('v3');

async function querySites() {
  try {
    // Create JWT client
    const jwtClient = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
    });

    // Authorize
    console.log('🔐 Authenticating with GSC...');
    await jwtClient.authorize();
    console.log('✓ Authentication successful\n');

    // Fetch sites
    console.log('📊 Fetching registered sites...');
    const response = await webmasters.sites.list({ auth: jwtClient });
    
    if (response.data.siteEntry && response.data.siteEntry.length > 0) {
      console.log(`✓ Found ${response.data.siteEntry.length} site(s):\n`);
      response.data.siteEntry.forEach(site => {
        console.log(`  - ${site.siteUrl}`);
        console.log(`    Permission: ${site.permissionLevel}\n`);
      });
      return response.data.siteEntry;
    } else {
      console.log('⚠ No sites found in GSC property');
      return [];
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

querySites();
