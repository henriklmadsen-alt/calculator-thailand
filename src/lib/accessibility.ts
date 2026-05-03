/**
 * accessibility.ts
 * WCAG 2.1 compliance utilities
 */

export const ARIA_LABELS = {
  // Calculator form
  CALCULATOR_FORM: 'Calculator form',
  INPUT_FIELD: 'Input field',
  CALCULATE_BUTTON: 'Calculate',
  RESET_BUTTON: 'Reset calculator',
  COPY_RESULT: 'Copy result to clipboard',
  SHARE_RESULT: 'Share result',

  // Navigation
  SKIP_TO_CONTENT: 'Skip to main content',
  MAIN_NAV: 'Main navigation',
  FOOTER_NAV: 'Footer navigation',
  LANGUAGE_TOGGLE: 'Change language',

  // Common
  CLOSE_MODAL: 'Close modal',
  OPEN_MENU: 'Open menu',
  LOADING: 'Loading',
  ERROR: 'Error message',
  SUCCESS: 'Success message',
};

export function getAriaLabel(key: keyof typeof ARIA_LABELS, suffix?: string): string {
  const baseLabel = ARIA_LABELS[key];
  return suffix ? `${baseLabel} - ${suffix}` : baseLabel;
}

export function setupKeyboardNavigation() {
  if (typeof document === 'undefined') return;

  document.addEventListener('keydown', (e) => {
    // Skip-to-content: Alt + S
    if (e.altKey && e.key === 's') {
      const skipLink = document.querySelector('[data-skip-content]') as HTMLAnchorElement;
      if (skipLink) {
        skipLink.focus();
        skipLink.click();
        e.preventDefault();
      }
    }

    // Close modal: Escape
    if (e.key === 'Escape') {
      const modal = document.querySelector('[role="dialog"]') as HTMLElement;
      if (modal && modal.getAttribute('open') !== null) {
        const closeBtn = modal.querySelector('[data-close-modal]') as HTMLButtonElement;
        if (closeBtn) closeBtn.click();
      }
    }
  });
}

export const FOCUS_VISIBLE_STYLES = `
  *:focus-visible {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
  }
`;

export function enhanceFormAccessibility(formElement: HTMLFormElement) {
  const inputs = formElement.querySelectorAll('input, textarea, select');

  inputs.forEach((input, index) => {
    // Ensure proper labeling
    if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
      const label = formElement.querySelector(`label[for="${input.id}"]`);
      if (label) {
        input.setAttribute('aria-labelledby', label.id || `label-${index}`);
      }
    }

    // Add required indicator for ARIA
    if (input.hasAttribute('required')) {
      input.setAttribute('aria-required', 'true');
    }
  });
}
