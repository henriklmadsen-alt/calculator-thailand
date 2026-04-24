import { captureException, captureMessage } from '../sentry-client';

export interface StorageError extends Error {
  operation: 'read' | 'write' | 'remove' | 'clear';
  key?: string;
}

export function safeLocalStorageGet(key: string, fallback?: string): string | undefined {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch (error) {
    const err = new Error(`localStorage.getItem failed for key "${key}"`) as StorageError;
    err.operation = 'read';
    err.key = key;
    captureException(err, { fallback, context: 'localStorage_read' });
    return fallback;
  }
}

export function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    const err = new Error(`localStorage.setItem failed for key "${key}"`) as StorageError;
    err.operation = 'write';
    err.key = key;
    captureException(err, { value_length: value.length, context: 'localStorage_write' });
    return false;
  }
}

export function safeLocalStorageRemove(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    const err = new Error(`localStorage.removeItem failed for key "${key}"`) as StorageError;
    err.operation = 'remove';
    err.key = key;
    captureException(err, { context: 'localStorage_remove' });
    return false;
  }
}

export function safeSessionStorageGet(key: string, fallback?: string): string | undefined {
  try {
    return sessionStorage.getItem(key) ?? fallback;
  } catch (error) {
    const err = new Error(`sessionStorage.getItem failed for key "${key}"`) as StorageError;
    err.operation = 'read';
    err.key = key;
    captureException(err, { fallback, context: 'sessionStorage_read' });
    return fallback;
  }
}

export function safeSessionStorageSet(key: string, value: string): boolean {
  try {
    sessionStorage.setItem(key, value);
    return true;
  } catch (error) {
    const err = new Error(`sessionStorage.setItem failed for key "${key}"`) as StorageError;
    err.operation = 'write';
    err.key = key;
    captureException(err, { value_length: value.length, context: 'sessionStorage_write' });
    return false;
  }
}

export function trackCalculatorError(calculatorName: string, errorMessage: string, errorContext?: Record<string, unknown>) {
  captureMessage(`Calculator error in ${calculatorName}: ${errorMessage}`, 'error');
  captureException(new Error(`Calculator ${calculatorName} error: ${errorMessage}`), {
    calculator: calculatorName,
    ...errorContext,
  });
}

export function trackSaveShareError(operation: 'save' | 'share' | 'export', error: Error, context?: Record<string, unknown>) {
  captureException(error, {
    operation,
    context: `save_share_${operation}`,
    ...context,
  });
}

export function trackAPIError(endpoint: string, statusCode: number, error: Error, context?: Record<string, unknown>) {
  captureException(error, {
    endpoint,
    status_code: statusCode,
    context: `api_error_${statusCode}`,
    ...context,
  });
}
