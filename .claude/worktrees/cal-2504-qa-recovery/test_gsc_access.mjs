import { google } from 'googleapis';

const webmasters = google.webmasters('v3');

async function checkAccess() {
  try {
    console.log('🔐 Checking service account GSC access...\n');
    const jwtClient = new google.auth.JWT({
      keyFile: './gsc-credentials.json',
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
    });

    await jwtClient.authorize();

    // List all accessible sites
    const response = await webmasters.sites.list({ auth: jwtClient });
    
    console.log(`✓ Service account authenticated\n`);
    
    if (response.data.siteEntry && response.data.siteEntry.length > 0) {
      console.log(`Found ${response.data.siteEntry.length} accessible site(s):\n`);
      response.data.siteEntry.forEach(site => {
        console.log(`  • ${site.siteUrl}`);
        console.log(`    Permission: ${site.permissionLevel}\n`);
      });
    } else {
      console.log('⚠ No sites accessible to service account');
      console.log('  Service account may not have been added to GSC property yet');
      console.log('  Or there may be a sync delay (try again in 1-2 minutes)');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAccess();
