/**
 * Business VAT Calculator (คำนวณ VAT ธุรกิจ)
 *
 * Sources:
 * - Excise Department (Ministry of Finance) — VAT Regulations B.E. 2560
 * - Value Added Tax Act B.E. 2545 (2002)
 * - Excise Department VAT guidelines 2024/2025
 *
 * Calculates:
 * - Output VAT (7% on sales revenue)
 * - Input VAT (VAT paid on business expenses)
 * - VAT liability = Output VAT - Input VAT
 * - Monthly VAT to remit to Revenue Department
 */

export interface BusinessVATInput {
  salaryRevenue: number; // Sales with VAT
  inputVATTotal: number; // VAT already paid on purchases
  deductibleRate: number; // Typically 100% for businesses with full documentation
}

export interface BusinessVATResult {
  salaryRevenue: number;
  vatRate: number;
  outputVAT: number;
  inputVAT: number;
  deductible: number;
  vatLiability: number; // Amount to remit to revenue department
  refundable: number; // If negative (credit to next month)
}

const VAT_RATE = 0.07;

/**
 * Calculate Output VAT from sales revenue
 * VAT = Revenue ÷ 1.07 × 0.07 (if revenue includes VAT)
 * VAT = Revenue × 0.07 (if revenue excludes VAT)
 */
function calculateOutputVAT(revenue: number, isVATIncluded: boolean): number {
  if (isVATIncluded) {
    // Revenue already includes VAT
    return (revenue / 1.07) * VAT_RATE;
  }
  // Revenue is before VAT
  return revenue * VAT_RATE;
}

export function calculateBusinessVAT(input: BusinessVATInput): BusinessVATResult {
  const outputVAT = calculateOutputVAT(input.salaryRevenue, true);
  const deductibleVAT = input.inputVATTotal * (input.deductibleRate / 100);
  const vatLiability = outputVAT - deductibleVAT;

  return {
    salaryRevenue: input.salaryRevenue,
    vatRate: VAT_RATE * 100,
    outputVAT: Math.round(outputVAT),
    inputVAT: Math.round(input.inputVATTotal),
    deductible: Math.round(deductibleVAT),
    vatLiability: vatLiability > 0 ? Math.round(vatLiability) : 0,
    refundable: vatLiability < 0 ? Math.round(Math.abs(vatLiability)) : 0,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateBusinessVAT({
  salaryRevenue: 100000,
  inputVATTotal: 5000,
  deductibleRate: 100,
});

export const EXAMPLE_2 = calculateBusinessVAT({
  salaryRevenue: 500000,
  inputVATTotal: 25000,
  deductibleRate: 100,
});

export const EXAMPLE_3 = calculateBusinessVAT({
  salaryRevenue: 1000000,
  inputVATTotal: 55000,
  deductibleRate: 100,
});
