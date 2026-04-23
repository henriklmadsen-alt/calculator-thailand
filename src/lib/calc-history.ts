/**
 * Calculation History Manager
 *
 * Auto-saves every calculator result to localStorage with FIFO eviction.
 * Privacy-friendly: stores only result & metadata, NOT inputs.
 *
 * Key: ct.history.v1
 * Max entries: 20
 */

export interface HistoryEntry {
  id: string;
  calculatorName: string;
  calculatorPath: string;
  result: string | number;
  timestamp: number;
}

const STORAGE_KEY = 'ct.history.v1';
const MAX_HISTORY = 20;

/**
 * Check if localStorage is available (handles private browsing mode)
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__ct_storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get all history entries
 */
export function getHistory(): HistoryEntry[] {
  if (!isLocalStorageAvailable()) return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const data = stored ? JSON.parse(stored) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * Add a calculation to history (auto-called after each result)
 * Stores: id, calculatorName, calculatorPath, result, timestamp
 * Does NOT store inputs (privacy-friendly)
 */
export function addToHistory(
  calculatorName: string,
  calculatorPath: string,
  result: string | number
): HistoryEntry | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const history = getHistory();
    const id = `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const entry: HistoryEntry = {
      id,
      calculatorName,
      calculatorPath,
      result,
      timestamp: Date.now(),
    };

    // Add to front (newest first)
    history.unshift(entry);

    // FIFO eviction: keep only MAX_HISTORY entries
    if (history.length > MAX_HISTORY) {
      history.length = MAX_HISTORY;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return entry;
  } catch {
    return null;
  }
}

/**
 * Clear all history
 */
export function clearHistory(): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format time difference for display (e.g., "1h ago" in Thai)
 */
export function formatTimeDiff(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'เพิ่งเดี๋ยว';
  if (diffMins < 60) return `${diffMins}นาทีที่แล้ว`;
  if (diffHours < 24) return `${diffHours}ชั่วโมงที่แล้ว`;
  return `${diffDays}วันที่แล้ว`;
}
