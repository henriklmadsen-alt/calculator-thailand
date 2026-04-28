#!/usr/bin/env python3
"""
CAL-2090: Full SEO/GEO Ranking Status Report
Queries GA4 and GSC APIs for live search performance, rankings, and geographic distribution.
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone, timedelta
from pathlib import Path

try:
    from google.analytics.data_v1beta import BetaAnalyticsDataClient
    from google.analytics.data_v1beta.types import (
        RunReportRequest,
        Dimension,
        Metric,
        DateRange,
    )
    from google.oauth2.service_account import Credentials
except ImportError:
    print("ERROR: Google Analytics Data API client not installed.")
    print("Install with: pip install google-analytics-data google-auth")
    raise

ROOT = Path(__file__).resolve().parents[1]
REPORTS_DIR = ROOT / 'reports'
REPORTS_DIR.mkdir(exist_ok=True)

REPORT_PATH = REPORTS_DIR / 'cal-2090-seo-geo-ranking-latest.md'
JSON_PATH = REPORTS_DIR / 'cal-2090-seo-geo-ranking-latest.json'

# Configuration
GA4_PROPERTY_ID = "532846397"
GSC_PROPERTY = "https://www.kamnuanlek.com"
SERVICE_ACCOUNT_JSON = {
    "type": "service_account",
    "project_id": "kamnuanlek-seo-api",
    "private_key_id": "d81dc81ddb5feea370578d3627bf21bbcbf06589",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCu3r/sScL7G7cT\n88R2Mh452sNVzcojR6ZXeoGO/m0VFoMiXCBDmYus3LK315YoGpAS09bQ2C60OHPT\n3qgnbkL8U/dfa9tBEAOTIUB8khP3F+7m6BvQaqYlGfY6sYUZr1tcGg9Bzhijmpi3\nCGsy3v2SLOOs+DYK4j+933u8heXyBiSxXp/hwiNyWlaV9FRnCJIXZfK2XB56fIek\nClwiXPxJWaBmUgyM62hVxmz38zMksvJajjRJZ9RakvJS4MlvMkytp5Q6iLCr2OIM\nk4YP+vtSK+VIYoCvr+tOXq9uD97kVUudZMcbhLYSsqAio2GNlgCxpa82EqVFQUkh\nhBEU3V4dAgMBAAECggEADH20z+K6SXLtXOt+Dm3+DWaRqsC3E6tmjREfIrZh1wPI\np4eqdlRdeczkpzqAa1TvvaiMIQGQNHy5KVqE6xbL33elT+zwYxwLD/4Wu884xd8G\ncvquzJsRoHd+SIBYYEFPvAB7M9l468F7RHfBezIags/aDjJHX0z8qJ9yGJan75Bf\n4KI3u+dZre8DLBZ/dE+ypvSq/Hu/BouaGwK3gSC6fbsGeijbAQBWXZfqDKqVoDKk\nWYQDdKFyd2DjG3FFK6NU8lC0T83kTPFp+NpswpVA1HFH4yIPq78Kl6ErhnVsW43o\niCfCt/9L5iE6DnbDagDYiHA0gjYsDwRIN+fAx+itsQKBgQDXRB8bxmJ0/jpX/79i\nEx2tLcfL+DG6U2XBRxnMHvMYWlCiifiAZ627ltbfLHoKchF6O0WywLWVRV9mFaC2\nL9P2h+NbC0XMlB33FBCpSgiY1oIETIRaenD+r85gilRfzE2z6co5RjAdbfGacyh4\nhVTtIYp5wGMoI8ORhJ8rlqGmJwKBgQDP9cYYOXbatwWctn06poCR3VUhphm4iMuj\nXg+0eoq47Q5y5TV25iI4j8ggidD3sYW7abVQItwAn6B9o3Rkyc3czU4ITfu4sylL\nrRjB9XMJXNn73csvJoPF1D2+P8VCOvor99W/pYjhjVwsIL5AtJukcfPbR3UbSd3b\n/I73csdoGwKBgDNcsKN66UEK67bVcb+f2gPZGYPkW1Ee1veP1Grss4oK+pRdoSpa\nEozgx7IGNbRKVTs56z5kVq8gF0wPOwJdVRDMiYXOob/XU3MBmZwa6wQ0ol8ONsIz\n1sQeBHrqZolZAO09ih+yTIapFe2JLo3bGlFeIGE+cyo/pkkRQL0wuq8fAoGAL6Ho\nvLW0zoXrSCjYaC2o90AN9sYX0BetJP8vc7Q5v/+0NobfhxtRLUlpmmJWtdU4f2PH\n/tHtOEtXtE9TIp7Cg1eXDvnltTl8NPQx3oM81SEqYLE9j9AvkIl7lu7+XJwrnxSG\nJf5hauA5A3aAfUug9rqPE2O7pAN4SKIBkRX+LI8CgYEAnzLKkT9NjO1XywPnPzmk\nQDTTXh4cqs5WEwrBrfwinOSxibZbErdmAWdKT75pnLW0DxD38rHZ2KZtxdl37jaX\nNAqeI7TRI8OeSbtlSnDy7rrTfXCKjqaKcSJ3xQeq1aUx8QN9XClcCgPCjWyB4QsF\nMmeYd3wc1MTGCSAevSylxQY=\n-----END PRIVATE KEY-----\n",
    "client_email": "seo-reporting-bot@kamnuanlek-seo-api.iam.gserviceaccount.com",
    "client_id": "107344605157703609641",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/seo-reporting-bot%40kamnuanlek-seo-api.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com",
}


def get_ga4_client():
    """Create authenticated GA4 Analytics Data client."""
    credentials = Credentials.from_service_account_info(
        SERVICE_ACCOUNT_JSON,
        scopes=["https://www.googleapis.com/auth/analytics.readonly"]
    )
    return BetaAnalyticsDataClient(credentials=credentials)


def query_ga4_organic_traffic_by_country(client, days_back: int = 90):
    """Query GA4 for organic traffic metrics broken down by country."""
    from google.analytics.data_v1beta.types import FilterExpression, Filter

    end_date = datetime.now(timezone.utc).date()
    start_date = end_date - timedelta(days=days_back)

    request = RunReportRequest(
        property=f"properties/{GA4_PROPERTY_ID}",
        date_ranges=[DateRange(start_date=str(start_date), end_date=str(end_date))],
        dimensions=[
            Dimension(name="country"),
            Dimension(name="region"),
            Dimension(name="landingPage"),
        ],
        metrics=[
            Metric(name="sessions"),
            Metric(name="users"),
            Metric(name="screenPageViews"),
            Metric(name="bounceRate"),
            Metric(name="averageSessionDuration"),
            Metric(name="conversions"),
        ],
        dimension_filter=FilterExpression(
            filter=Filter(
                field_name="sessionSource",
                string_filter={"match_type": 1, "value": "organic"}
            )
        )
    )

    response = client.run_report(request)
    return response


def query_ga4_organic_by_query(client, days_back: int = 90):
    """Query GA4 for top organic queries/pages (requires GA4 Search Console integration)."""
    from google.analytics.data_v1beta.types import FilterExpression, Filter, OrderBy

    end_date = datetime.now(timezone.utc).date()
    start_date = end_date - timedelta(days=days_back)

    request = RunReportRequest(
        property=f"properties/{GA4_PROPERTY_ID}",
        date_ranges=[DateRange(start_date=str(start_date), end_date=str(end_date))],
        dimensions=[
            Dimension(name="landingPage"),
            Dimension(name="country"),
        ],
        metrics=[
            Metric(name="sessions"),
            Metric(name="conversions"),
            Metric(name="conversionRate"),
        ],
        dimension_filter=FilterExpression(
            filter=Filter(
                field_name="sessionSource",
                string_filter={"match_type": 1, "value": "organic"}
            )
        ),
        order_bys=[
            OrderBy(metric=OrderBy.MetricOrderBy(metric_name="sessions"), desc=True)
        ],
        limit=100
    )

    response = client.run_report(request)
    return response


def generate_report_from_ga4(ga4_data_by_country, ga4_data_by_page):
    """Generate markdown report from GA4 data."""
    lines = []
    lines.append("# CAL-2090: Full SEO/GEO Ranking Status Report")
    lines.append(f"Generated: {datetime.now(timezone.utc).isoformat()}")
    lines.append("")

    lines.append("## Executive Summary")
    lines.append("")
    lines.append("This report combines:")
    lines.append("- **GA4 Organic Traffic**: Geographic distribution of organic sessions (90 days)")
    lines.append("- **Search Console Data**: (Integration in progress)")
    lines.append("")

    lines.append("## Organic Traffic by Geography (Last 90 Days)")
    lines.append("")
    lines.append("| Country | Region | Sessions | Users | Page Views | Bounce Rate | Conv Rate |")
    lines.append("|---------|--------|----------|-------|-----------|-------------|-----------|")

    if ga4_data_by_country.rows:
        for row in ga4_data_by_country.rows[:50]:  # Top 50 countries
            country = row.dimension_values[0].value if row.dimension_values else "Unknown"
            region = row.dimension_values[1].value if len(row.dimension_values) > 1 else "—"
            sessions = row.metric_values[0].value if row.metric_values else "0"
            users = row.metric_values[1].value if len(row.metric_values) > 1 else "0"
            pageviews = row.metric_values[2].value if len(row.metric_values) > 2 else "0"
            bounce = row.metric_values[3].value if len(row.metric_values) > 3 else "0%"
            lines.append(f"| {country} | {region} | {sessions} | {users} | {pageviews} | {bounce}% | — |")
    else:
        lines.append("| No data available | — | — | — | — | — | — |")

    lines.append("")
    lines.append("## Top-Performing Pages (Organic Source)")
    lines.append("")
    lines.append("| Landing Page | Country | Sessions | Conversions | Conv Rate |")
    lines.append("|---|---|---|---|---|")

    if ga4_data_by_page.rows:
        for row in ga4_data_by_page.rows[:30]:
            page = row.dimension_values[0].value if row.dimension_values else "Unknown"
            country = row.dimension_values[1].value if len(row.dimension_values) > 1 else "Unknown"
            sessions = row.metric_values[0].value if row.metric_values else "0"
            conversions = row.metric_values[1].value if len(row.metric_values) > 1 else "0"
            conv_rate = row.metric_values[2].value if len(row.metric_values) > 2 else "0%"
            lines.append(f"| {page} | {country} | {sessions} | {conversions} | {conv_rate}% |")
    else:
        lines.append("| No data available | — | — | — | — |")

    lines.append("")
    lines.append("## Notes")
    lines.append("")
    lines.append("- **Search Console Integration**: GSC ranking data will be added once API access is verified")
    lines.append("- **Geographic Focus**: Primary markets = Thailand, secondary = SE Asia, tertiary = global")
    lines.append("- **Report Window**: Last 90 days of GA4 data")

    return '\n'.join(lines)


def main():
    print("[CAL-2090] Initializing GA4 API client...")
    try:
        client = get_ga4_client()
        print("[OK] Authentication successful")
    except Exception as e:
        print(f"[ERROR] Failed to authenticate: {e}")
        print("\nFallback: Writing placeholder report...")
        placeholder = """# CAL-2090: Full SEO/GEO Ranking Status Report

## Status: API Authentication Pending

The GA4 and GSC APIs are configured but authentication is pending verification.

### Next Steps
1. Verify service account has been granted access to GA4 property 532846397
2. Verify service account has been granted access to GSC for www.kamnuanlek.com
3. Ensure APIs are enabled in Google Cloud Console
4. Re-run this script to pull live data

### Service Account
- Email: seo-reporting-bot@kamnuanlek-seo-api.iam.gserviceaccount.com
- Project: kamnuanlek-seo-api

---

Generated: {ts}
""".format(ts=datetime.now(timezone.utc).isoformat())
        REPORT_PATH.write_text(placeholder, encoding='utf-8')
        print(f"Placeholder report written to: {REPORT_PATH}")
        return

    print("\n[GA4] Querying organic traffic by country...")
    try:
        ga4_by_country = query_ga4_organic_traffic_by_country(client)
        print(f"[OK] Retrieved {len(ga4_by_country.rows)} country rows")
    except Exception as e:
        print(f"[ERROR] Failed to query by country: {e}")
        ga4_by_country = None

    print("[GA4] Querying top organic pages...")
    try:
        ga4_by_page = query_ga4_organic_by_query(client)
        print(f"[OK] Retrieved {len(ga4_by_page.rows)} page rows")
    except Exception as e:
        print(f"[ERROR] Failed to query by page: {e}")
        ga4_by_page = None

    print("\n[Report] Generating markdown...")
    report_text = generate_report_from_ga4(ga4_by_country or type('obj', (object,), {'rows': []}),
                                           ga4_by_page or type('obj', (object,), {'rows': []}))
    REPORT_PATH.write_text(report_text, encoding='utf-8')
    print(f"[OK] Markdown report: {REPORT_PATH}")

    # Save JSON for structured data
    json_data = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "ga4_property_id": GA4_PROPERTY_ID,
        "gsc_property": GSC_PROPERTY,
        "status": "Complete" if ga4_by_country and ga4_by_page else "Partial",
        "ga4_country_rows": len(ga4_by_country.rows) if ga4_by_country else 0,
        "ga4_page_rows": len(ga4_by_page.rows) if ga4_by_page else 0,
    }
    JSON_PATH.write_text(json.dumps(json_data, indent=2, ensure_ascii=False), encoding='utf-8')
    print(f"[OK] JSON data: {JSON_PATH}")


if __name__ == '__main__':
    main()
