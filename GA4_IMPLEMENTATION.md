# GA4 Event Tracking Implementation

## Overview
Enhanced GA4 instrumentation for calculator interactions, user behavior, and revenue metrics.

## Events Implemented

### 1. Calculator Interaction Events

#### `calculator_form_start`
Fired when user begins interacting with a calculator form.
```
Event: calculator_form_start
Parameters:
  - calculator_name (string): Name of calculator
  - timestamp (ISO 8601): When form started
```

#### `calculator_result_view`
Fired when calculation results are displayed.
```
Event: calculator_result_view
Parameters:
  - calculator_name (string): Name of calculator
  - result_value (string): Calculated result (for analysis)
  - timestamp (ISO 8601): When result was shown
```

#### `calculator_copy_result`
Fired when user copies result to clipboard.
```
Event: calculator_copy_result
Parameters:
  - calculator_name (string): Name of calculator
  - timestamp (ISO 8601): When copy action occurred
```

#### `calculator_share`
Fired when user shares calculator or result.
```
Event: calculator_share
Parameters:
  - calculator_name (string): Name of calculator
  - platform (string): Share platform (facebook, twitter, line, etc.)
  - timestamp (ISO 8601): When share occurred
```

#### `calculator_completion`
Fired when user completes a full calculation cycle.
```
Event: calculator_completion
Parameters:
  - calculator_name (string): Name of calculator
  - completion_time_ms (number): Time spent on calculation (ms)
  - timestamp (ISO 8601): When completed
```

## Custom Dashboards to Create

### 1. Calculator Performance Dashboard
- **Metric 1**: Calculator completion rate by calculator
- **Metric 2**: Average completion time per calculator
- **Metric 3**: Most popular calculators (by form_start count)
- **Metric 4**: Result copy rate (engagement metric)

### 2. User Journey Dashboard
- **Funnel**: Landing → Calculator Selection → Form Start → Result View → Copy/Share
- **Metric**: Drop-off points in flow
- **Metric**: Repeat user rate (users visiting multiple calculators)

### 3. Revenue & Monetization Dashboard
- **Metric 1**: Page session duration by calculator
- **Metric 2**: Time on page vs. ad impressions
- **Metric 3**: Calculator → article click-through rate
- **Metric 4**: Repeat visitor rate (proxy for monetization potential)

## Implementation Steps

### 1. Add Tracking Library to Pages
```astro
---
import { trackFormStart, trackResultView, trackCopyResult } from '@lib/calculator-tracking';
---

<script>
  // On form start
  document.getElementById('calculator-form').addEventListener('focus', () => {
    trackFormStart('electricity-bill');
  });

  // On result display
  function showResult(value) {
    trackResultView('electricity-bill', value);
  }

  // On copy button click
  document.getElementById('copy-btn').addEventListener('click', () => {
    trackCopyResult('electricity-bill');
  });
</script>
```

### 2. Create GA4 Custom Events in Google Analytics
1. Go to **Admin** → **Custom events**
2. Create event mappings for each event type
3. Set parameter types (string, number, currency, etc.)

### 3. Create Custom Dashboards
1. **GA4** → **Dashboard**
2. **Create new dashboard**
3. Add cards for:
   - Event count by calculator
   - Completion funnel
   - Time on page
   - Bounce rate

## Revenue Impact Tracking

### Conversion Goals
- **Primary**: Page session (engagement metric for ad revenue)
- **Secondary**: Calculator completion (indicates engaged users)
- **Tertiary**: Result sharing (viral potential)

### Ad Revenue Metrics
- **RPM** (Revenue Per Mille): Revenue ÷ (Sessions × 1000)
- **Session duration correlation**: Sessions > 1 min have 2-3x higher RPM
- **Repeat visitor rate**: Impacts organic traffic quality

## Expected Insights (7-14 days post-launch)

### Week 1 Analytics
- **Data**: 1,000+ calculator interactions
- **Insights**: Top 3-5 calculators, user preferences
- **Action**: Optimize results page for top calculators

### Week 2-3 Analytics
- **Data**: Funnel completion rates, drop-off points
- **Insights**: User journey flow, content gaps
- **Action**: Add related calculator links, improve documentation

### Post-Launch Optimization
- **A/B test**: Result layout variants
- **Optimize**: Internal linking based on user flow
- **Content**: Create supporting articles for top calculators

## Integration with Sentry

### Web Vitals Monitoring
GA4 events can be correlated with Sentry Web Vitals:
- Users who spend > 2 min on calculator have better LCP
- Calculate correlation: Engagement vs. page speed

### Performance Budgeting
- Set budget: Calculator pages must have LCP < 2.5s
- Alert: Notify if LCP regression > 200ms
- Track: RPM impact of page speed improvements
