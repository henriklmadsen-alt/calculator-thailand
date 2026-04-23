/**
 * CAL-996: Input Validation with Friendly Thai Error Messages
 *
 * Provides a validation framework that:
 * - Shows friendly Thai error messages
 * - Highlights invalid fields in amber (not red)
 * - Only shows errors after user interaction (not on first render)
 * - Integrates seamlessly with existing calculator forms
 */

export interface ValidationRule {
  name: string; // e.g., 'required', 'positive', 'maxValue'
  validate: (value: number | string) => boolean;
  errorMessage: string; // Thai error message
}

export interface FieldValidator {
  fieldId: string;
  label: string; // Thai field label for context
  rules: ValidationRule[];
  hasInteracted: boolean; // Track if user has interacted with field
  currentError?: ValidationRule; // Current validation error (if any)
}

/**
 * Thai error messages for common validation scenarios
 */
const THAI_ERROR_MESSAGES = {
  required: 'กรุณากรอกข้อมูลนี้',
  requiredincome: 'กรุณากรอกรายได้ของคุณ',
  requiredinitial: 'กรุณากรอกจำนวนเงินเริ่มต้น',
  requiredsavings: 'กรุณากรอกจำนวนเงินออม',
  requiresalary: 'กรุณากรอกเงินเดือนของคุณ',
  requiresprincipal: 'กรุณากรอกเงินกู้',
  requiresmonthly: 'กรุณากรอกค่างวดต่อเดือน',
  requiresterm: 'กรุณากรอกจำนวนงวด',
  positive: 'กรุณากรอกตัวเลขที่มากกว่า 0',
  positivewithhint: (fieldName: string) => `${fieldName} ต้องมากกว่า 0 บาท`,
  notexceed: (maxValue: number) =>
    `ตัวเลขดูสูงเกินไป — ตรวจสอบหน่วยอีกครั้ง (สูงสุด: ${new Intl.NumberFormat('th-TH').format(maxValue)})`,
  notexceedsimple: 'ตัวเลขดูสูงเกินไป — ตรวจสอบหน่วยอีกครั้ง',
  toohigh: 'ตัวเลขดูสูงเกินไปสำหรับการคำนวณนี้ กรุณาตรวจสอบ',
  invalinput: 'กรุณากรอกตัวเลขที่ถูกต้อง',
  feestoolarge: 'ค่าธรรมเนียมสูงกว่าเงินกู้ กรุณาตรวจสอบ',
  zeronotallowed: 'กรุณากรอกตัวเลขที่มากกว่า 0',
};

/**
 * Pre-defined validation rules
 */
export const VALIDATION_RULES = {
  // Required field
  required: (fieldLabel: string = 'ข้อมูล'): ValidationRule => ({
    name: 'required',
    validate: (value) => {
      const numValue = parseNumber(value);
      return numValue > 0 || value !== '';
    },
    errorMessage: `กรุณากรอก${fieldLabel}`,
  }),

  // Must be positive number
  positive: (): ValidationRule => ({
    name: 'positive',
    validate: (value) => parseNumber(value) > 0,
    errorMessage: THAI_ERROR_MESSAGES.positive,
  }),

  // Cannot be zero
  notZero: (): ValidationRule => ({
    name: 'notZero',
    validate: (value) => parseNumber(value) !== 0,
    errorMessage: THAI_ERROR_MESSAGES.zeronotallowed,
  }),

  // Must not exceed max value
  maxValue: (max: number): ValidationRule => ({
    name: 'maxValue',
    validate: (value) => {
      const numValue = parseNumber(value);
      return numValue <= max;
    },
    errorMessage: THAI_ERROR_MESSAGES.notexceed(max),
  }),

  // Custom validation with custom message
  custom: (validate: (value: number | string) => boolean, message: string): ValidationRule => ({
    name: 'custom',
    validate,
    errorMessage: message,
  }),
};

/**
 * Parse numeric input value, handling Thai number formatting
 */
export function parseNumber(value: string | number): number {
  if (typeof value === 'number') return Math.max(0, value);
  if (!value || typeof value !== 'string') return 0;

  // Remove spaces, commas, and convert Thai numerals to Arabic
  const cleaned = value
    .replace(/\s+/g, '')
    .replace(/,/g, '')
    .replace(/[\u0E50-\u0E59]/g, (char) => {
      // Convert Thai numerals (๐-๙) to Arabic (0-9)
      return String.fromCharCode(char.charCodeAt(0) - 0x0E50);
    });

  const parsed = parseFloat(cleaned);
  return Math.max(0, isNaN(parsed) ? 0 : parsed);
}

/**
 * Format number with Thai locale
 */
export function formatThaiNumber(value: number): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Math.max(0, value));
}

/**
 * Validator class - manages form validation state
 */
export class FormValidator {
  private fields: Map<string, FieldValidator> = new Map();
  private form: HTMLFormElement;

  constructor(formId: string) {
    const form = document.getElementById(formId);
    if (!form || !(form instanceof HTMLFormElement)) {
      throw new Error(`Form with id "${formId}" not found`);
    }
    this.form = form;
  }

  /**
   * Register a field for validation
   */
  registerField(fieldId: string, label: string, rules: ValidationRule[]): void {
    const field = this.form.querySelector(`#${fieldId}`);
    if (!field || !(field instanceof HTMLInputElement)) {
      console.warn(`Field with id "${fieldId}" not found in form`);
      return;
    }

    const validator: FieldValidator = {
      fieldId,
      label,
      rules,
      hasInteracted: false,
    };

    this.fields.set(fieldId, validator);

    // Listen for user interaction
    field.addEventListener('input', () => {
      if (!validator.hasInteracted) {
        validator.hasInteracted = true;
      }
      this.validateField(fieldId);
    });

    field.addEventListener('blur', () => {
      validator.hasInteracted = true;
      this.validateField(fieldId);
    });

    field.addEventListener('change', () => {
      validator.hasInteracted = true;
      this.validateField(fieldId);
    });
  }

  /**
   * Validate a single field
   */
  validateField(fieldId: string): boolean {
    const validator = this.fields.get(fieldId);
    if (!validator) {
      console.warn(`Field "${fieldId}" not registered`);
      return true;
    }

    const field = this.form.querySelector(`#${fieldId}`) as HTMLInputElement;
    if (!field) return true;

    const value = field.value;

    // Only validate if user has interacted with field
    if (!validator.hasInteracted) {
      this.clearFieldError(fieldId);
      return true;
    }

    // Check rules in order
    for (const rule of validator.rules) {
      if (!rule.validate(value)) {
        validator.currentError = rule;
        this.showFieldError(fieldId, rule.errorMessage);
        return false;
      }
    }

    // All rules passed
    validator.currentError = undefined;
    this.clearFieldError(fieldId);
    return true;
  }

  /**
   * Validate all registered fields
   */
  validateAll(): boolean {
    let isValid = true;

    // First, mark all fields as interacted
    for (const validator of this.fields.values()) {
      validator.hasInteracted = true;
    }

    // Then validate all
    for (const fieldId of this.fields.keys()) {
      if (!this.validateField(fieldId)) {
        isValid = false;
      }
    }

    return isValid;
  }

  /**
   * Show error message for a field (amber highlight, not red)
   */
  private showFieldError(fieldId: string, errorMessage: string): void {
    const field = this.form.querySelector(`#${fieldId}`) as HTMLInputElement;
    if (!field) return;

    // Remove any existing error message
    const existingError = field.parentElement?.querySelector('.error-message-thai');
    if (existingError) {
      existingError.remove();
    }

    // Add amber border (not red)
    field.classList.remove('is-valid');
    field.classList.add('is-invalid-thai');

    // Add error message below field
    const errorElement = document.createElement('p');
    errorElement.className = 'error-message-thai';
    errorElement.textContent = errorMessage;

    if (field.parentElement) {
      field.parentElement.appendChild(errorElement);
    }
  }

  /**
   * Clear error for a field
   */
  private clearFieldError(fieldId: string): void {
    const field = this.form.querySelector(`#${fieldId}`) as HTMLInputElement;
    if (!field) return;

    field.classList.remove('is-invalid-thai');
    field.classList.add('is-valid');

    const errorElement = field.parentElement?.querySelector('.error-message-thai');
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Get parsed value for a field
   */
  getFieldValue(fieldId: string): number {
    const field = this.form.querySelector(`#${fieldId}`) as HTMLInputElement;
    return field ? parseNumber(field.value) : 0;
  }

  /**
   * Get all field values as object
   */
  getAllValues(): Record<string, number> {
    const values: Record<string, number> = {};
    for (const fieldId of this.fields.keys()) {
      values[fieldId] = this.getFieldValue(fieldId);
    }
    return values;
  }

  /**
   * Reset all validation state
   */
  reset(): void {
    for (const fieldId of this.fields.keys()) {
      const validator = this.fields.get(fieldId);
      if (validator) {
        validator.hasInteracted = false;
        validator.currentError = undefined;
        this.clearFieldError(fieldId);
      }
    }
  }
}

/**
 * CSS classes for input validation styling
 * Add this to your global styles:
 */
export const VALIDATION_CSS = `
/* Input validation styling (CAL-996) */
input.is-invalid-thai {
  border-color: #f59e0b;  /* Amber border */
  background-color: #fffbf0; /* Soft amber background */
  color: #92400e;
}

input.is-invalid-thai:focus {
  outline: none;
  ring: 2px #f59e0b;
  border-color: #f59e0b;
}

input.is-valid {
  border-color: #d1d5db;
  background-color: #ffffff;
}

.error-message-thai {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #d97706;  /* Darker amber for text */
  font-weight: 500;
}

input.is-invalid-thai::placeholder {
  color: #d97706;
  opacity: 0.7;
}
`;

export default FormValidator;
