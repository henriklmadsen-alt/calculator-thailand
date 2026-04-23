/**
 * Result Card Color Coding Utility — CAL-974
 *
 * Provides color-coded visual status indicators for calculator result cards.
 * Supports health, financial, and miscellaneous calculator result categories.
 */

/**
 * Status level with color coding information
 */
export interface StatusIndicator {
  /** CSS class to apply to result card (e.g., 'result-card--status-green') */
  colorClass: string;
  /** Icon to display in badge (emoji) */
  icon: string;
  /** Thai label for badge (e.g., 'ปกติ' = Normal) */
  label: string;
  /** ARIA label for accessibility */
  ariaLabel: string;
}

/**
 * Result category with status (for BMI, cholesterol, health scores, financial ratios, etc.)
 */
export interface ResultCategoryStatus {
  category: string; // Thai category name
  status: StatusIndicator;
}

/**
 * Get status indicator for BMI value (WHO Asia-Pacific)
 * Underweight < 18.5, Normal 18.5-22.9, Overweight 23-24.9, Obese >= 25
 */
export function getBMIStatus(bmi: number): StatusIndicator {
  if (bmi < 18.5) {
    return {
      colorClass: 'result-card--status-blue',
      icon: 'ℹ️',
      label: 'ข้อมูล',
      ariaLabel: 'น้ำหนักน้อย',
    };
  }
  if (bmi < 23) {
    return {
      colorClass: 'result-card--status-green',
      icon: '✅',
      label: 'ปกติ',
      ariaLabel: 'ปกติ',
    };
  }
  if (bmi < 25) {
    return {
      colorClass: 'result-card--status-yellow',
      icon: '⚠️',
      label: 'เตือน',
      ariaLabel: 'น้ำหนักเกิน',
    };
  }
  return {
    colorClass: 'result-card--status-red',
    icon: '❌',
    label: 'เร่งด่วน',
    ariaLabel: 'อ้วน',
  };
}

/**
 * Get status indicator for cholesterol value (mg/dL)
 * Desirable < 200, Borderline 200-239, High >= 240
 */
export function getCholesterolStatus(cholesterol: number): StatusIndicator {
  if (cholesterol < 200) {
    return {
      colorClass: 'result-card--status-green',
      icon: '✅',
      label: 'ปลอดภัย',
      ariaLabel: 'ระดับเหมาะสม',
    };
  }
  if (cholesterol < 240) {
    return {
      colorClass: 'result-card--status-yellow',
      icon: '⚠️',
      label: 'เตือน',
      ariaLabel: 'ระดับเขตแดง',
    };
  }
  return {
    colorClass: 'result-card--status-red',
    icon: '❌',
    label: 'เร่งด่วน',
    ariaLabel: 'ระดับสูงเกินไป',
  };
}

/**
 * Get status indicator for blood pressure (systolic/diastolic)
 * Normal < 120/80, Elevated 120-129 / <80, High >= 130/80
 */
export function getBloodPressureStatus(
  systolic: number,
  diastolic: number
): StatusIndicator {
  if (systolic < 120 && diastolic < 80) {
    return {
      colorClass: 'result-card--status-green',
      icon: '✅',
      label: 'ปกติ',
      ariaLabel: 'ความดันปกติ',
    };
  }
  if (systolic < 130 && diastolic < 80) {
    return {
      colorClass: 'result-card--status-yellow',
      icon: '⚠️',
      label: 'สูงขึ้น',
      ariaLabel: 'ความดันสูงขึ้น',
    };
  }
  return {
    colorClass: 'result-card--status-red',
    icon: '❌',
    label: 'สูง',
    ariaLabel: 'ความดันสูง',
  };
}

/**
 * Get status indicator for financial ratio (debt-to-income, savings rate, etc.)
 * Safe < threshold, Caution threshold - threshold*1.5, Risk >= threshold*1.5
 */
export function getFinancialStatus(
  ratio: number,
  safeThreshold: number,
  cautionThreshold?: number
): StatusIndicator {
  const caution = cautionThreshold || safeThreshold * 1.5;

  if (ratio <= safeThreshold) {
    return {
      colorClass: 'result-card--status-green',
      icon: '✅',
      label: 'ปลอดภัย',
      ariaLabel: 'สถานะการเงินดี',
    };
  }
  if (ratio <= caution) {
    return {
      colorClass: 'result-card--status-yellow',
      icon: '⚠️',
      label: 'เตือน',
      ariaLabel: 'ต้องระวัง',
    };
  }
  return {
    colorClass: 'result-card--status-red',
    icon: '❌',
    label: 'เสี่ยง',
    ariaLabel: 'เสี่ยงสูง',
  };
}

/**
 * Get status indicator for age-related ranges
 * Helpful for retirement, insurance, health screening calculators
 */
export function getAgeStatus(age: number): StatusIndicator {
  // Age is typically informational, not pass/fail
  return {
    colorClass: 'result-card--status-blue',
    icon: 'ℹ️',
    label: 'ข้อมูล',
    ariaLabel: `อายุ ${age} ปี`,
  };
}

/**
 * Get status indicator for savings adequacy (as percentage of target)
 * Adequate >= 100%, On track 75-99%, Behind < 75%
 */
export function getSavingsStatus(savingsPercentage: number): StatusIndicator {
  if (savingsPercentage >= 100) {
    return {
      colorClass: 'result-card--status-green',
      icon: '✅',
      label: 'เพียงพอ',
      ariaLabel: 'เงินสะสมเพียงพอ',
    };
  }
  if (savingsPercentage >= 75) {
    return {
      colorClass: 'result-card--status-yellow',
      icon: '⚠️',
      label: 'ติดตาม',
      ariaLabel: 'ติดตามแผนการออม',
    };
  }
  return {
    colorClass: 'result-card--status-red',
    icon: '❌',
    label: 'ล้าหลัง',
    ariaLabel: 'เงินสะสมน้อยเกินไป',
  };
}

/**
 * Create and inject status badge into result card
 * Call after result is displayed
 */
export function applyResultCardColoring(
  resultElementId: string,
  status: StatusIndicator
): boolean {
  const resultEl = document.getElementById(resultElementId);
  if (!resultEl) {
    console.warn(`[CAL-974] Result element not found: ${resultElementId}`);
    return false;
  }

  // Remove any existing status classes
  resultEl.className = (resultEl.className || '')
    .replace(/result-card--status-\w+/g, '')
    .trim();

  // Add color class
  resultEl.classList.add('result-card', status.colorClass);

  // Remove existing badge if any
  const existingBadge = resultEl.querySelector('.result-status-badge');
  if (existingBadge) {
    existingBadge.remove();
  }

  // Create and inject status badge
  const badge = document.createElement('div');
  badge.className = 'result-status-badge';
  badge.innerHTML = `
    <span class="result-status-icon" aria-label="${status.ariaLabel}">${status.icon}</span>
    <span class="result-status-label">${status.label}</span>
  `;

  resultEl.insertBefore(badge, resultEl.firstChild);
  return true;
}

/**
 * Convenience function: Get status and apply color coding in one call
 * Useful for simple calculators (BMI, age, basic health scores)
 */
export function applyBMIColoring(bmi: number, resultElementId = 'result'): boolean {
  const status = getBMIStatus(bmi);
  return applyResultCardColoring(resultElementId, status);
}

export function applyFinancialColoring(
  ratio: number,
  safeThreshold: number,
  resultElementId = 'result'
): boolean {
  const status = getFinancialStatus(ratio, safeThreshold);
  return applyResultCardColoring(resultElementId, status);
}

export function applyCholesterolColoring(
  cholesterol: number,
  resultElementId = 'result'
): boolean {
  const status = getCholesterolStatus(cholesterol);
  return applyResultCardColoring(resultElementId, status);
}

export function applyBloodPressureColoring(
  systolic: number,
  diastolic: number,
  resultElementId = 'result'
): boolean {
  const status = getBloodPressureStatus(systolic, diastolic);
  return applyResultCardColoring(resultElementId, status);
}

export function applySavingsColoring(
  savingsPercentage: number,
  resultElementId = 'result'
): boolean {
  const status = getSavingsStatus(savingsPercentage);
  return applyResultCardColoring(resultElementId, status);
}
