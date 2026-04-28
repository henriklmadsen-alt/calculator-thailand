/**
 * Saved Calculations Manager
 *
 * Manages localStorage persistence of calculator results with FIFO eviction.
 * Key: ct.saved.calcs.v1
 * Max entries: 5 per user
 */

export interface SavedCalculation {
  id: string;
  calculatorName: string;
  calculatorPath: string;
  inputs: Record<string, any>;
  result: string | number;
  timestamp: number;
}

const STORAGE_KEY = 'ct.saved.calcs.v1';
const MAX_SAVED = 5;

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
 * Get all saved calculations
 */
export function getSavedCalculations(): SavedCalculation[] {
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
 * Get saved calculations for a specific calculator
 */
export function getSavedCalculationsForCalculator(calculatorPath: string): SavedCalculation[] {
  const all = getSavedCalculations();
  return all.filter(calc => calc.calculatorPath === calculatorPath);
}

/**
 * Save a calculation to localStorage
 */
export function saveCalculation(
  calculatorName: string,
  calculatorPath: string,
  inputs: Record<string, any>,
  result: string | number
): SavedCalculation | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const saved = getSavedCalculations();
    const id = `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newCalc: SavedCalculation = {
      id,
      calculatorName,
      calculatorPath,
      inputs,
      result,
      timestamp: Date.now(),
    };

    // Add to front
    saved.unshift(newCalc);

    // FIFO eviction: keep only MAX_SAVED entries
    if (saved.length > MAX_SAVED) {
      saved.length = MAX_SAVED;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    return newCalc;
  } catch {
    return null;
  }
}

/**
 * Remove a saved calculation
 */
export function removeSavedCalculation(id: string): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    const saved = getSavedCalculations();
    const filtered = saved.filter(calc => calc.id !== id);

    if (filtered.length === saved.length) return false; // Not found

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear all saved calculations
 */
export function clearAllSavedCalculations(): boolean {
  if (!isLocalStorageAvailable()) return false;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format time difference for display (e.g., "1h ago")
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

/**
 * Check if a matching calculation exists (same calculator, same inputs)
 */
export function findMatchingCalculation(
  calculatorPath: string,
  inputs: Record<string, any>
): SavedCalculation | null {
  const saved = getSavedCalculationsForCalculator(calculatorPath);

  return saved.find(calc => {
    return JSON.stringify(calc.inputs) === JSON.stringify(inputs);
  }) || null;
}
