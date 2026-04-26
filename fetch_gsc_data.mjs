import { google } from 'googleapis';
import fs from 'fs';

const webmasters = google.webmasters('v3');
const keyPath = './gsc-credentials.json';

async function fetchSearchData() {
  try {
    console.log('🔐 Authenticating with GSC...');
    const jwtClient = new google.auth.JWT({
      keyFile: keyPath,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
    });

    await jwtClient.authorize();
    console.log('✓ Authenticated\n');

    const siteUrl = 'https://www.kamnuanlek.com/';
    
    console.log(`📊 Fetching search analytics for: ${siteUrl}`);
    
    // Get last 90 days of data
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
    
    const response = await webmasters.searchanalytics.query({
      siteUrl: siteUrl,
      auth: jwtClient,
      requestBody: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        dimensions: ['page'],
        rowLimit: 100
      }
    });

    if (response.data.rows && response.data.rows.length > 0) {
      console.log(`\n✓ Found ${response.data.rows.length} pages with search data:\n`);
      
      // Sort by clicks descending
      response.data.rows.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
      
      console.log('Top 20 pages by search clicks:');
      console.log('─'.repeat(100));
      console.log('Page URL | Clicks | Impressions | CTR | Avg Position');
      console.log('─'.repeat(100));
      
      response.data.rows.slice(0, 20).forEach(row => {
        const url = row.keys[0];
        const clicks = row.clicks || 0;
        const impressions = row.impressions || 0;
        const ctr = ((clicks / impressions) * 100).toFixed(2);
        const pos = (row.position || 0).toFixed(1);
        
        console.log(`${url} | ${clicks} | ${impressions} | ${ctr}% | ${pos}`);
      });
      
      // Save to file for analysis
      fs.writeFileSync('gsc-data.json', JSON.stringify(response.data, null, 2));
      console.log('\n✓ Full data saved to gsc-data.json');
    } else {
      console.log('⚠ No search data found in the past 90 days');
      console.log('This may mean:');
      console.log('  - Site was just added to GSC');
      console.log('  - No search impressions yet');
      console.log('  - Check GSC property registration');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('notFound')) {
      console.log('\n⚠ Site not found in GSC. Possible issues:');
      console.log('  - Site URL format incorrect');
      console.log('  - Site not yet added to GSC property');
      console.log('  - Service account needs added to GSC property');
    }
    process.exit(1);
  }
}

fetchSearchData();
