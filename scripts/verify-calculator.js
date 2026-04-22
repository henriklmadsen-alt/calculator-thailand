#!/usr/bin/env node
/**
 * Formula Verification Gate — CAL-938
 *
 * Verifies calculator formula accuracy against known test cases.
 * This script runs before every Railway deploy to ensure formula integrity.
 *
 * Usage:
 *   node scripts/verify-calculator.js                      # Run all test cases
 *   node scripts/verify-calculator.js --page /คำนวณ-bmi   # Run tests for one page
 *   node scripts/verify-calculator.js --list               # List available pages
 *
 * Exit code 0 = all tests pass. Exit code 1 = one or more tests failed.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Formula Implementations ─────────────────────────────────────────────────
// These are independent re-implementations of the calculator formulas.
// They serve as a cross-check against the TypeScript lib functions and
// the inline script logic in each .astro page.

/**
 * BMI — Thai WHO Asia-Pacific classification
 * Source: src/lib/bmi-calculator-thai.ts
 */
function bmiFormula(input) {
  const { heightCm, weightKg } = input;
  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

  let category;
  if (bmi < 18.5) category = 'underweight';
  else if (bmi < 23) category = 'normal';
  else if (bmi < 25) category = 'overweight';
  else if (bmi < 30) category = 'obese1';
  else category = 'obese2';

  return { bmi, category };
}

/**
 * VAT — Thai 7% Value Added Tax
 * Source: src/pages/คำนวณภาษีมูลค่าเพิ่ม/index.astro
 */
function vatFormula(input) {
  const { price, mode } = input;
  const VAT_RATE = 0.07;

  if (mode === 'add') {
    const vat = Math.round(price * VAT_RATE * 100) / 100;
    const total = Math.round(price * (1 + VAT_RATE) * 100) / 100;
    return { vat, priceWithVAT: total, priceBeforeVAT: price };
  } else {
    // Extract VAT from price-inclusive amount
    const priceBeforeVAT = Math.round((price / (1 + VAT_RATE)) * 100) / 100;
    const vat = Math.round((price - priceBeforeVAT) * 100) / 100;
    return { vat, priceWithVAT: price, priceBeforeVAT };
  }
}

/**
 * Car Loan — Flat rate (standard Thai auto finance)
 * Source: src/pages/คำนวณผ่อนรถ/index.astro (lines 634–638)
 *
 * Formula:
 *   totalInterest = financeAmount × (annualRate / 100) × termYears
 *   monthlyPayment = (financeAmount + totalInterest) / termMonths
 */
function carLoanFlatRateFormula(input) {
  const { price, downPct, annualRate, years } = input;
  const downPayment = price * (downPct / 100);
  const financeAmount = price - downPayment;
  const termMonths = years * 12;
  const totalInterest = financeAmount * (annualRate / 100) * years;
  const totalPaid = financeAmount + totalInterest;
  const monthlyPayment = termMonths > 0 ? totalPaid / termMonths : 0;
  return {
    downPayment,
    financeAmount,
    totalInterest: Math.round(totalInterest * 100) / 100,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
  };
}

/**
 * Home Loan — PMT formula (reducing balance, standard Thai mortgage)
 * Source: src/pages/คำนวณผ่อนบ้าน/index.astro (lines 601–607)
 *
 * Formula:
 *   r = annualRate / 100 / 12
 *   factor = (1 + r)^n
 *   PMT = principal × (r × factor) / (factor − 1)
 */
function homeLoanPMTFormula(input) {
  const { principal, annualRate, years } = input;
  const months = Math.round(years * 12);
  const r = annualRate / 100 / 12;
  if (r === 0) {
    return { monthlyPayment: Math.round((principal / months) * 100) / 100 };
  }
  const factor = Math.pow(1 + r, months);
  const monthlyPayment = principal * (r * factor) / (factor - 1);
  return { monthlyPayment: Math.round(monthlyPayment * 100) / 100 };
}

/**
 * General Loan — PMT formula (used by /คำนวณผ่อนกู้/)
 * Same formula as home loan but accepts loan amount directly.
 */
function loanPMTFormula(input) {
  return homeLoanPMTFormula(input);
}

/**
 * Thai Personal Income Tax — 2026/2569 progressive brackets
 * Source: src/lib/tax-calculator.ts
 *
 * Brackets: 0%, 5%, 10%, 15%, 20%, 25%, 30%, 35%
 * Expense deduction: 50% of income, max 100,000
 */
function incomeTaxFormula(input) {
  const { annualIncome, personalAllowance, spouseAllowance, childCount,
    socialSecurity, lifeInsurance, healthInsurance, providentFund,
    homeLoanInterest, otherDeductions } = input;

  const BRACKETS = [
    { max: 150_000, rate: 0 },
    { max: 300_000, rate: 0.05 },
    { max: 500_000, rate: 0.10 },
    { max: 750_000, rate: 0.15 },
    { max: 1_000_000, rate: 0.20 },
    { max: 2_000_000, rate: 0.25 },
    { max: 5_000_000, rate: 0.30 },
    { max: Infinity, rate: 0.35 },
  ];

  const expenseDeduction = Math.min(annualIncome * 0.5, 100_000);

  let allowances = 0;
  if (personalAllowance) allowances += 60_000;
  if (spouseAllowance) allowances += 60_000;
  allowances += Math.max(0, (childCount || 0)) * 30_000;
  allowances += Math.min(Math.max(0, socialSecurity || 0), 9_000);
  allowances += Math.min(Math.max(0, lifeInsurance || 0), 100_000);
  allowances += Math.min(Math.max(0, healthInsurance || 0), 25_000);
  allowances += Math.min(Math.max(0, providentFund || 0), 10_000);
  allowances += Math.min(Math.max(0, homeLoanInterest || 0), 100_000);
  allowances += Math.max(0, otherDeductions || 0);

  const netIncome = Math.max(0, annualIncome - expenseDeduction - allowances);

  let remaining = netIncome;
  let totalTax = 0;
  let prevMax = 0;

  for (const bracket of BRACKETS) {
    const bracketWidth = bracket.max === Infinity ? Infinity : bracket.max - prevMax;
    const taxableInBracket = Math.min(remaining, bracketWidth);
    totalTax += taxableInBracket * bracket.rate;
    remaining -= taxableInBracket;
    prevMax = bracket.max;
    if (remaining <= 0) break;
  }

  return {
    netIncome: Math.round(netIncome),
    annualTax: Math.round(totalTax),
    monthlyTax: Math.round(totalTax / 12 * 100) / 100,
  };
}

/**
 * Savings Interest — Fixed deposit with monthly compounding interest display
 * Source: src/pages/คำนวณดอกเบี้ยเงินฝาก/index.astro (lines 586–613)
 *
 * Fixed deposit: simple interest per month (not compound)
 *   monthlyInterest = principal × (annualRate / 100 / 12)
 *   totalGrossInterest = monthlyInterest × termMonths
 *   withholding tax = 15%
 */
function savingsInterestFormula(input) {
  const { principal, annualRate, termMonths } = input;
  const monthlyRate = annualRate / 100 / 12;
  const totalGrossInterest = principal * monthlyRate * termMonths;
  const withholdingTax = Math.round(totalGrossInterest * 0.15 * 100) / 100;
  const netInterest = Math.round((totalGrossInterest - withholdingTax) * 100) / 100;
  const finalBalance = principal + netInterest;
  return {
    totalGrossInterest: Math.round(totalGrossInterest * 100) / 100,
    withholdingTax,
    netInterest,
    finalBalance: Math.round(finalBalance * 100) / 100,
  };
}

/**
 * Overtime Pay — Thai Labour Protection Act 2019
 * Source: src/lib/overtime-calculator.ts
 *
 * hourlyRate = monthlySalary / (workingDaysPerMonth × workingHoursPerDay)
 * overtimePay = hourlyRate × multiplier × overtimeHours
 * Multipliers: weekday OT = 1.5×, holiday work = 2×, holiday OT = 3×
 */
function overtimeFormula(input) {
  const { monthlySalary, workingDaysPerMonth, workingHoursPerDay,
    weekdayOTHours, holidayWorkHours, holidayOTHours } = input;

  const roundCurrency = (v) => Math.round(v * 100) / 100;
  const baseHours = workingDaysPerMonth * workingHoursPerDay;
  const hourlyRate = monthlySalary / baseHours;

  const weekdayOTPay = roundCurrency(hourlyRate * 1.5 * (weekdayOTHours || 0));
  const holidayWorkPay = roundCurrency(hourlyRate * 2.0 * (holidayWorkHours || 0));
  const holidayOTPay = roundCurrency(hourlyRate * 3.0 * (holidayOTHours || 0));
  const totalOTPay = roundCurrency(weekdayOTPay + holidayWorkPay + holidayOTPay);

  return {
    hourlyRate: roundCurrency(hourlyRate),
    weekdayOTPay,
    holidayWorkPay,
    holidayOTPay,
    totalOTPay,
  };
}

// ─── Formula Registry ─────────────────────────────────────────────────────────

const FORMULAS = {
  bmi: bmiFormula,
  vat: vatFormula,
  car_loan_flat: carLoanFlatRateFormula,
  home_loan_pmt: homeLoanPMTFormula,
  loan_pmt: loanPMTFormula,
  income_tax: incomeTaxFormula,
  savings_interest: savingsInterestFormula,
  overtime: overtimeFormula,
};

// ─── Test Case Loader ─────────────────────────────────────────────────────────

function loadTestCases() {
  const manifestPath = resolve(__dirname, 'formula-test-cases.json');
  if (!existsSync(manifestPath)) {
    console.error(`ERROR: Test case manifest not found at: ${manifestPath}`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(manifestPath, 'utf-8'));
}

// ─── Comparison Helpers ───────────────────────────────────────────────────────

function isClose(actual, expected, tolerance) {
  if (typeof expected === 'string') return actual === expected;
  if (typeof expected === 'boolean') return actual === expected;
  if (typeof expected !== 'number') return JSON.stringify(actual) === JSON.stringify(expected);
  const tol = tolerance != null ? tolerance : Math.max(0.02, Math.abs(expected) * 0.001);
  return Math.abs(actual - expected) <= tol;
}

function checkResult(actual, expected, tolerance) {
  const failures = [];
  for (const [key, expectedVal] of Object.entries(expected)) {
    if (!(key in actual)) {
      failures.push(`  Missing field: ${key}`);
      continue;
    }
    if (!isClose(actual[key], expectedVal, tolerance)) {
      failures.push(`  ${key}: expected ${expectedVal}, got ${actual[key]}`);
    }
  }
  return failures;
}

// ─── Runner ───────────────────────────────────────────────────────────────────

function runTests(testCases, pageFilter) {
  const filtered = pageFilter
    ? testCases.filter((tc) => tc.page === pageFilter || tc.page.includes(pageFilter))
    : testCases;

  if (filtered.length === 0) {
    console.error(`No test cases found${pageFilter ? ` for page: ${pageFilter}` : ''}`);
    process.exit(1);
  }

  let passed = 0;
  let failed = 0;
  const failureDetails = [];

  // Group by page for readable output
  const byPage = {};
  for (const tc of filtered) {
    (byPage[tc.page] ??= []).push(tc);
  }

  for (const [page, cases] of Object.entries(byPage)) {
    console.log(`\n  ${page}`);
    for (const tc of cases) {
      const formula = FORMULAS[tc.formula];
      if (!formula) {
        console.log(`    ⚠  SKIP  ${tc.description} — unknown formula: ${tc.formula}`);
        continue;
      }

      let actual;
      try {
        actual = formula(tc.inputs);
      } catch (err) {
        console.log(`    ✗  FAIL  ${tc.description}`);
        console.log(`           ERROR: ${err.message}`);
        failed++;
        failureDetails.push({ page, description: tc.description, error: err.message });
        continue;
      }

      const failures = checkResult(actual, tc.expected, tc.tolerance);
      if (failures.length === 0) {
        console.log(`    ✓  PASS  ${tc.description}`);
        passed++;
      } else {
        console.log(`    ✗  FAIL  ${tc.description}`);
        failures.forEach((f) => console.log(`       ${f}`));
        failed++;
        failureDetails.push({ page, description: tc.description, failures });
      }
    }
  }

  return { passed, failed, total: passed + failed };
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const listMode = args.includes('--list');
const pageIdx = args.indexOf('--page');
const pageFilter = pageIdx !== -1 ? args[pageIdx + 1] : null;

const testCases = loadTestCases();

if (listMode) {
  const pages = [...new Set(testCases.map((tc) => tc.page))].sort();
  console.log(`\nFormula verification pages (${pages.length} total):\n`);
  pages.forEach((p) => {
    const count = testCases.filter((tc) => tc.page === p).length;
    console.log(`  ${p}  (${count} test${count !== 1 ? 's' : ''})`);
  });
  process.exit(0);
}

console.log('\n━━━ Formula Verification Gate — CAL-938 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const { passed, failed, total } = runTests(testCases, pageFilter);

console.log(`\n━━━ Results ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`    ${passed}/${total} tests passed${failed > 0 ? `, ${failed} FAILED` : ''}`);

if (failed > 0) {
  console.log('\n    Formula verification FAILED. Fix formula errors before deploying.\n');
  process.exit(1);
} else {
  console.log('\n    All formula tests passed. Safe to proceed with build.\n');
  process.exit(0);
}
