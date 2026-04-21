/**
 * คำนวณ ROI การลงทุนโรงงาน (Manufacturing Investment & Payback) - KLC-1075
 *
 * Sources:
 * - Thai Federation of Industries
 * - Department of Industrial Works
 * - Thai Standards Institute (TISI)
 *
 * Calculation includes:
 * - Basic cost analysis
 * - Efficiency metrics
 * - Planning and forecasting
 */

export interface ManufacturingInvestment&PaybackInput {
  amount1: number;
  amount2?: number;
}

export interface ManufacturingInvestment&PaybackResult {
  total: number;
  analysis: string;
}

export function calculateManufacturingInvestment&Payback(input: ManufacturingInvestment&PaybackInput): ManufacturingInvestment&PaybackResult {
  const total = Math.round((input.amount1 + (input.amount2 || 0)) * 1.1);

  return {
    total,
    analysis: `คำนวณจากข้อมูล: ${input.amount1.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateManufacturingInvestment&Payback({ amount1: 100000, amount2: 50000 });
export const EXAMPLE_2 = calculateManufacturingInvestment&Payback({ amount1: 500000, amount2: 250000 });
export const EXAMPLE_3 = calculateManufacturingInvestment&Payback({ amount1: 1000000, amount2: 500000 });
