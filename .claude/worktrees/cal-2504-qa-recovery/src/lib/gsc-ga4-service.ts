import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

interface GSCServiceConfig {
  keyFileJson: any;
  gscSiteUrl: string;
}

interface GA4Config {
  keyFileJson: any;
  propertyId: string;
}

interface KeywordRanking {
  query: string;
  position: number;
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
}

interface RankingSnapshot {
  date: string;
  topKeywords: KeywordRanking[];
  totalKeywords: number;
}

class GSCService {
  private auth: JWT;
  private gscSiteUrl: string;

  constructor(config: GSCServiceConfig) {
    this.gscSiteUrl = config.gscSiteUrl;
    this.auth = new JWT({
      email: config.keyFileJson.client_email,
      key: config.keyFileJson.private_key,
      scopes: ['https://www.googleapis.com/auth/webmasters'],
    });
  }

  async getTopKeywords(days: number = 30): Promise<KeywordRanking[]> {
    const searchconsole = google.searchconsole({ version: 'v1', auth: this.auth });

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    try {
      const response = await searchconsole.searchanalytics.query({
        siteUrl: this.gscSiteUrl,
        requestBody: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          dimensions: ['query'],
          rowLimit: 100,
          orderBy: [{ columnName: 'impressions', sortOrder: 'DESCENDING' }],
        },
      });

      return response.data.rows?.map((row: any) => ({
        query: row.keys[0],
        position: Math.round(row.position * 10) / 10,
        impressions: row.impressions,
        clicks: row.clicks,
        ctr: Math.round(row.ctr * 10000) / 100,
        avgPosition: row.position,
      })) || [];
    } catch (error) {
      console.error('Error fetching GSC keywords:', error);
      throw error;
    }
  }

  async getPageIndexing(): Promise<{ indexed: number; notIndexed: number }> {
    const searchconsole = google.searchconsole({ version: 'v1', auth: this.auth });

    try {
      const response = await searchconsole.sites.get({ siteUrl: this.gscSiteUrl });
      return {
        indexed: response.data.permissionLevel === 'siteFullUser' ? 0 : 0,
        notIndexed: 0,
      };
    } catch (error) {
      console.error('Error fetching page indexing:', error);
      throw error;
    }
  }
}

class GA4Service {
  private auth: JWT;
  private propertyId: string;

  constructor(config: GA4Config) {
    this.propertyId = config.propertyId;
    this.auth = new JWT({
      email: config.keyFileJson.client_email,
      key: config.keyFileJson.private_key,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });
  }

  async getOrganicMetrics(days: number = 30): Promise<{
    sessions: number;
    users: number;
    revenue: number;
  }> {
    const analyticsdata = google.analyticsdata({ version: 'v1beta', auth: this.auth });

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    try {
      const response = await analyticsdata.properties.runReport({
        property: `properties/${this.propertyId}`,
        requestBody: {
          dateRanges: [
            {
              startDate: startDate.toISOString().split('T')[0],
              endDate: endDate.toISOString().split('T')[0],
            },
          ],
          dimensions: [{ name: 'sessionDefaultChannelGroup' }],
          metrics: [
            { name: 'sessions' },
            { name: 'users' },
            { name: 'eventValue' },
          ],
          dimensionFilter: {
            filter: {
              fieldName: 'sessionDefaultChannelGroup',
              stringFilter: { matchType: 'EXACT', value: 'Organic Search' },
            },
          },
        },
      });

      if (response.data.rows && response.data.rows.length > 0) {
        const row = response.data.rows[0];
        return {
          sessions: parseInt(row.metricValues[0].value, 10),
          users: parseInt(row.metricValues[1].value, 10),
          revenue: parseFloat(row.metricValues[2].value),
        };
      }
      return { sessions: 0, users: 0, revenue: 0 };
    } catch (error) {
      console.error('Error fetching GA4 metrics:', error);
      throw error;
    }
  }

  async getCoreWebVitals(): Promise<{
    largestContentfulPaint: number;
    firstInputDelay: number;
    cumulativeLayoutShift: number;
  }> {
    // Placeholder: Core Web Vitals require a different API endpoint
    return {
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
    };
  }
}

export { GSCService, GA4Service, KeywordRanking, RankingSnapshot };
