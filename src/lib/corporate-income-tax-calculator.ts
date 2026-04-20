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
 * Progressive brackets: 15% → 20% → 30% → 37%
 */
function calculateIncomeTax(taxableIncome: number): number {
  // 2567-2569 rates (current)
  if (taxableIncome <= 0) return 0;

  if (taxableIncome <= 500000) {
    return taxableIncome * 0.15;
  } else if (taxableIncome <= 1000000) {
    return (500000 * 0.15) + ((taxableIncome - 500000) * 0.20);
  } else if (taxableIncome <= 4000000) {
    return (500000 * 0.15) + (500000 * 0.20) + ((taxableIncome - 1000000) * 0.30);
  } else {
    return (500000 * 0.15) + (500000 * 0.20) + (3000000 * 0.30) + ((taxableIncome - 4000000) * 0.37);
  }
}

export function calculateCorporateIncomeTax(
  input: CorporateIncomeTaxInput,
): CorporateIncomeTaxResult {
  const taxableIncome = Math.max(0, input.grossIncome - input.deductibleExpenses + input.capitalGains);
  const incomeTax = calculateIncomeTax(taxableIncome);

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
    taxRate: 15, // Base rate
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
