/**
 * Thai Medical Expense Tax Deduction Calculator (ลดหย่อนค่าใช้จ่ายทางการแพทย์)
 *
 * Sources:
 * - Revenue Code B.E. 2481 (revised 2564) — Section 17
 * - Revenue Department (กรมสรรพากร)
 * - Deductible medical expenses for personal income tax
 *
 * Deductible expenses:
 *   - Hospital fees and medical treatment
 *   - Medicine prescribed by licensed doctor
 *   - Medical examination and diagnosis
 *   - Dental treatment
 *   - Eye care (glasses, contact lenses, surgery)
 *   - Hearing aids
 *   - Prosthetics and medical devices
 *   - NOT deductible: cosmetic, optional, not prescribed
 *
 * Limit: No fixed cap on medical deductions (can deduct all eligible expenses)
 * Filing: Form PND 91 or PND 92 with receipts
 *
 * Note: This is an estimation tool. Actual deductions depend on documentation
 * and Revenue Department approval.
 */

export interface MedicalExpenseInput {
  hospitalFees: number;
  medicationCosts: number;
  dentalCosts: number;
  eyeCareCosts: number;
  otherMedicalCosts: number;
  annualIncome: number;
  taxRate?: number; // Default 5-35% based on income bracket
}

export interface MedicalExpenseResult {
  totalMedicalExpenses: number;
  totalDeductibleExpenses: number;
  estimatedTaxSavings: number;
  taxRate: number;
  breakdown: {
    hospitalFees: number;
    medicationCosts: number;
    dentalCosts: number;
    eyeCareCosts: number;
    otherMedicalCosts: number;
  };
  annualIncome: number;
  taxableIncomeReduction: number;
}

/**
 * Determine tax rate based on annual income
 * Thai personal income tax brackets (2566)
 */
function getTaxRate(annualIncome: number): number {
  // Basic rates (may vary; these are typical)
  if (annualIncome <= 150000) return 0.05; // 5%
  if (annualIncome <= 300000) return 0.1; // 10%
  if (annualIncome <= 500000) return 0.15; // 15%
  if (annualIncome <= 750000) return 0.2; // 20%
  if (annualIncome <= 1000000) return 0.25; // 25%
  if (annualIncome <= 2000000) return 0.3; // 30%
  if (annualIncome <= 5000000) return 0.35; // 35%
  return 0.37; // Top rate for income > 5M
}

/**
 * Medical expenses that are tax deductible
 * Most medical expenses are deductible if prescribed by licensed doctor
 * and documented with receipts
 */
function getDeductibleAmount(expense: number): number {
  // In Thailand, medical expenses are generally fully deductible if documented
  // No percent limit, but must have proof
  return Math.max(0, expense);
}

export function calculateMedicalDeduction(
  input: MedicalExpenseInput,
): MedicalExpenseResult {
  const {
    hospitalFees,
    medicationCosts,
    dentalCosts,
    eyeCareCosts,
    otherMedicalCosts,
    annualIncome,
    taxRate: customTaxRate,
  } = input;

  // Calculate total medical expenses
  const totalMedicalExpenses =
    hospitalFees +
    medicationCosts +
    dentalCosts +
    eyeCareCosts +
    otherMedicalCosts;

  // All documented medical expenses are deductible
  const totalDeductibleExpenses = getDeductibleAmount(totalMedicalExpenses);

  // Determine tax rate
  const taxRate = customTaxRate || getTaxRate(annualIncome);

  // Tax savings = deductible amount × tax rate
  const estimatedTaxSavings = Math.round(totalDeductibleExpenses * taxRate);

  const taxableIncomeReduction = totalDeductibleExpenses;

  return {
    totalMedicalExpenses,
    totalDeductibleExpenses,
    estimatedTaxSavings,
    taxRate: Math.round(taxRate * 100),
    breakdown: {
      hospitalFees: getDeductibleAmount(hospitalFees),
      medicationCosts: getDeductibleAmount(medicationCosts),
      dentalCosts: getDeductibleAmount(dentalCosts),
      eyeCareCosts: getDeductibleAmount(eyeCareCosts),
      otherMedicalCosts: getDeductibleAmount(otherMedicalCosts),
    },
    annualIncome,
    taxableIncomeReduction,
  };
}

/**
 * Show the breakdown and tax impact for various income levels
 */
export function calculateTaxSavingsAtDifferentIncomes(
  totalMedicalExpenses: number,
): {
  income: number;
  taxRate: number;
  taxSavings: number;
}[] {
  const incomes = [
    100000, 200000, 400000, 600000, 1000000, 2000000, 5000000,
  ];

  return incomes.map((income) => {
    const rate = getTaxRate(income);
    const savings = Math.round(totalMedicalExpenses * rate);
    return {
      income,
      taxRate: Math.round(rate * 100),
      taxSavings: savings,
    };
  });
}
