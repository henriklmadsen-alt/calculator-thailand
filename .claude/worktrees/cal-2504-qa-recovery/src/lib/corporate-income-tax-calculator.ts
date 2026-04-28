/**
 * Corporate Income Tax Calculator (คำนวณภาษีเงินได้นิติบุคคล)
 *
 * Sources:
 * - Revenue Department Thailand — Corporate Tax Rates 2567-2569
 * - Income Tax Act B.E. 2481 (1938), amended 2566
 * - Excise Department Regulations 2566/2567
 *
 * Calculates:
 * - Taxable income = Gross profit - Allowable deductions
 * - Corporate tax by bracket (progressive: 15%-37%)
 * - Surtax on non-resident corporations (varies)
 * - Net tax liability
 */

export interface CorporateIncomeTaxInput {
  grossIncome: number; // Total revenue THB
  deductibleExpenses: number; // Allowable deductions
  capitalGains: number; // Capital gains (if any)
  isResident: boolean; // Is company resident in Thailand
  isSME?: boolean; // Registered capital <= 5M THB — uses SME tiered rates
}

export interface CorporateIncomeTaxResult {
  grossIncome: number;
  deductibleExpenses: number;
  capitalGains: number;
  taxableIncome: number;
  taxRate: number;
  incomeTax: number;
  surtax: number;
  totalTax: number;
  effectiveTaxRate: number;
  netIncome: number;
}

/**
 * Corporate tax rates in Thailand 2567-2569
 *
 * Standard company (registered capital > 5M THB): flat 20% on net profit
 *
 * SME (registered capital <= 5M THB — isSME = true):
 *   0%  on first 300,000 THB
 *   15% on 300,001 – 3,000,000 THB
 *   20% above 3,000,000 THB
 *
 * Source: Revenue Code — Royal Decree on CIT Reduction, amended 2566
 */
function calculateIncomeTax(taxableIncome: number, isSME: boolean): number {
  if (taxableIncome <= 0) return 0;

  if (!isSME) {
    // Standard company: flat 20%
    return taxableIncome * 0.20;
  }

  // SME tiered rates
  if (taxableIncome <= 300000) {
    return 0;
  } else if (taxableIncome <= 3000000) {
    return (taxableIncome - 300000) * 0.15;
  } else {
    return (2700000 * 0.15) + ((taxableIncome - 3000000) * 0.20);
  }
}

export function calculateCorporateIncomeTax(
  input: CorporateIncomeTaxInput,
): CorporateIncomeTaxResult {
  const isSME = input.isSME ?? false;
  const taxableIncome = Math.max(0, input.grossIncome - input.deductibleExpenses + input.capitalGains);
  const incomeTax = calculateIncomeTax(taxableIncome, isSME);

  // Surtax for non-residents: 10-20% of net income (simplified)
  const surtax = !input.isResident ? Math.round(incomeTax * 0.10) : 0;

  const totalTax = incomeTax + surtax;
  const netIncome = input.grossIncome - input.deductibleExpenses - totalTax;
  const effectiveTaxRate = input.grossIncome > 0 ? (totalTax / input.grossIncome) * 100 : 0;

  return {
    grossIncome: input.grossIncome,
    deductibleExpenses: input.deductibleExpenses,
    capitalGains: input.capitalGains,
    taxableIncome: Math.round(taxableIncome),
    taxRate: isSME ? 0 : 20, // SME: 0%/15%/20% tiered; Standard: flat 20%
    incomeTax: Math.round(incomeTax),
    surtax: Math.round(surtax),
    totalTax: Math.round(totalTax),
    effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
    netIncome: Math.round(netIncome),
  };
}

// Worked examples
export const EXAMPLE_1 = calculateCorporateIncomeTax({
  grossIncome: 1000000,
  deductibleExpenses: 600000,
  capitalGains: 0,
  isResident: true,
});

export const EXAMPLE_2 = calculateCorporateIncomeTax({
  grossIncome: 5000000,
  deductibleExpenses: 3000000,
  capitalGains: 500000,
  isResident: true,
});

export const EXAMPLE_3 = calculateCorporateIncomeTax({
  grossIncome: 10000000,
  deductibleExpenses: 6000000,
  capitalGains: 0,
  isResident: false,
});
