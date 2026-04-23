# Analytics Setup — Calculator Thailand

## 1. Google Analytics 4 (GA4)

### Measurement ID

```
G-XXXXXXXXXX   ← Replace with your actual GA4 Measurement ID
```

### Installation

Add this snippet to `src/layouts/BaseLayout.astro` inside `<head>`, before the closing `</head>` tag:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### GA4 Custom Events

| Event Name | Trigger | Parameters | Notes |
|---|---|---|---|
| `page_view` | Every page load | (automatic via gtag config) | Built-in — no extra code needed |
| `calculator_start` | User begins filling in a calculator | `calculator_type` (string) | Fire on first input interaction |
| `calculator_complete` | User gets a calculation result | `calculator_type` (string), `result_value` (number) | Fire when result is displayed |
| `calculator_share` | User shares a result | `calculator_type` (string), `share_method` (string) | Fire on share button click |
| `calculator_used` | Alias for complete (for CEO dashboard) | `calculator_type` (string) | Same as calculator_complete |
| `result_viewed` | User scrolls to / views result section | `calculator_type` (string) | Fire when result element enters viewport |

### Event Implementation Code

Add this to each calculator page (or a shared analytics utility):

```javascript
// Fire when user first interacts with a calculator input
function trackCalculatorStart(calculatorType) {
  gtag('event', 'calculator_start', {
    calculator_type: calculatorType
  });
}

// Fire when calculation result is displayed
function trackCalculatorComplete(calculatorType, resultValue) {
  gtag('event', 'calculator_complete', {
    calculator_type: calculatorType,
    result_value: resultValue
  });
  // Also fire the dashboard-friendly alias
  gtag('event', 'calculator_used', {
    calculator_type: calculatorType
  });
}

// Fire when result section enters viewport
function trackResultViewed(calculatorType) {
  gtag('event', 'result_viewed', {
    calculator_type: calculatorType
  });
}

// Fire when user shares a result
function trackCalculatorShare(calculatorType, shareMethod) {
  gtag('event', 'calculator_share', {
    calculator_type: calculatorType,
    share_method: shareMethod
  });
}
```

### Calculator Type Values

| Calculator | `calculator_type` value |
|---|---|
| Personal Income Tax | `personal_income_tax` |
| VAT Calculator | `vat` |
| Loan Calculator | `loan` |
| Compound Interest | `compound_interest` |
| Retirement Savings | `retirement` |

---

## 2. Google Search Console (GSC)

### Verification Method

**Recommended: HTML meta tag** (easiest for Astro static sites)

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://calculator-thailand.up.railway.app`
3. Choose "HTML tag" verification
4. Copy the meta tag and add it to `src/layouts/BaseLayout.astro` inside `<head>`:

```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

5. Rebuild and deploy, then click Verify in GSC.

### Post-Verification Steps

1. Submit sitemap: `https://calculator-thailand.up.railway.app/sitemap.xml`
   - Note: Add `@astrojs/sitemap` to generate this automatically:
     ```bash
     npm install @astrojs/sitemap
     ```
     Then add to `astro.config.mjs`:
     ```javascript
     import sitemap from '@astrojs/sitemap';
     // ...
     integrations: [tailwind(), sitemap()]
     ```
2. Request indexing for the homepage and each calculator page
3. Monitor the "Performance" report for impressions and clicks

---

## 3. Dashboard Setup Guide

### GA4 Dashboard — Key Reports to Monitor

Create a custom GA4 dashboard with these widgets:

| Widget | Metric | Dimension | Purpose |
|---|---|---|---|
| Organic Sessions | Sessions | Source/Medium = google/organic | Track SEO growth toward 15K/month |
| Calculator Usage | Event count (calculator_complete) | calculator_type | Which calculators get used most |
| Completion Rate | calculator_complete / calculator_start | calculator_type | Are users finishing calculations? Target: 70%+ |
| Bounce Rate | Bounce rate | Page path | Target: < 60% |
| Top Pages | Sessions | Page path | Which pages drive traffic |
| Page Speed (LCP) | LCP | Page path | Target: < 2.5s |

### GSC Dashboard — Key Metrics

| Metric | What to Watch | Target (Month 6) |
|---|---|---|
| Total Impressions | Are we appearing in search results? | Growing week-over-week |
| Total Clicks | Are people clicking through? | Growing toward 15K sessions |
| Average CTR | Click-through rate | 5%+ |
| Average Position | Ranking position | < 20 (first 2 pages) |
| Top Queries | Which Thai keywords are working | Thai financial calculator terms |

### Weekly Report Template

```
## Weekly Analytics — Calculator Thailand
Week of: [DATE]

### Traffic
- Organic sessions: X (Δ +X% vs last week)
- Total pageviews: X
- Bounce rate: X%

### Search Performance (GSC)
- Impressions: X
- Clicks: X
- Average CTR: X%
- Average position: X

### Calculator Usage
- calculator_start events: X
- calculator_complete events: X
- Completion rate: X%
- Most used calculator: [TYPE]

### AdSense (when enabled)
- Revenue: $X
- RPM: $X
- Best performing page: [PAGE]

### Actions for Next Week
- [ ] ...
```

---

## 4. AdSense Setup (Future)

The AdSense placeholder is already in `BaseLayout.astro` (commented out on line 29).

When ready to enable:
1. Apply for AdSense at [google.com/adsense](https://www.google.com/adsense)
2. Replace `ca-pub-XXXXXXX` with your publisher ID
3. Uncomment the script tag
4. Add ad units to calculator pages (between content sections, not blocking results)
5. Target RPM: $2–5

### AdSense RPM Tracking

Monitor via GA4 by linking AdSense to Analytics, or track directly in the AdSense dashboard.

---

## 5. Implementation Checklist

- [ ] Create GA4 property and get Measurement ID
- [ ] Add GA4 gtag snippet to BaseLayout.astro
- [ ] Implement custom events on tax calculator page
- [ ] Verify site in Google Search Console (HTML meta tag)
- [ ] Install `@astrojs/sitemap` and submit sitemap
- [ ] Set up GA4 custom dashboard
- [ ] Deliver first weekly report after 7 days of data
- [ ] Apply for AdSense (after 10+ pages of content)
