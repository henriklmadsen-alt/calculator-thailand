/**
 * calculator-tracking.ts
 * GA4 event tracking for calculator interactions
 */

export function trackCalculatorEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  const gtag = (window as any).gtag;
  if (!gtag) return;

  gtag('event', eventName, {
    'event_category': 'calculator',
    ...eventData,
  });
}

export function trackFormStart(calculatorName: string) {
  trackCalculatorEvent('calculator_form_start', {
    'calculator_name': calculatorName,
    'timestamp': new Date().toISOString(),
  });
}

export function trackResultView(calculatorName: string, resultValue?: string) {
  trackCalculatorEvent('calculator_result_view', {
    'calculator_name': calculatorName,
    'result_value': resultValue,
    'timestamp': new Date().toISOString(),
  });
}

export function trackCopyResult(calculatorName: string) {
  trackCalculatorEvent('calculator_copy_result', {
    'calculator_name': calculatorName,
    'timestamp': new Date().toISOString(),
  });
}

export function trackShare(calculatorName: string, platform: string) {
  trackCalculatorEvent('calculator_share', {
    'calculator_name': calculatorName,
    'platform': platform,
    'timestamp': new Date().toISOString(),
  });
}

export function trackCalculatorCompletion(calculatorName: string, completionTime: number) {
  trackCalculatorEvent('calculator_completion', {
    'calculator_name': calculatorName,
    'completion_time_ms': completionTime,
    'timestamp': new Date().toISOString(),
  });
}
