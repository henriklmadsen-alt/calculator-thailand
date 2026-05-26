import * as Sentry from "@sentry/astro";

if (typeof window !== 'undefined' && import.meta.env.PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.PUBLIC_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  });
}

export const captureException = (error: unknown, context?: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    Sentry.captureException(error, { extra: context });
  }
};

export const captureMessage = (message: string, level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug') => {
  if (typeof window !== 'undefined') {
    Sentry.captureMessage(message, level);
  }
};
