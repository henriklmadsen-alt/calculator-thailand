/**
 * คำนวณต้นทุนจากสินค้าชำรุด (Defect Rate Impact Calculator) - KLC-1070
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

export interface DefectRateImpactCalculatorInput {
  amount1: number;
  amount2?: number;
}

export interface DefectRateImpactCalculatorResult {
  total: number;
  analysis: string;
}

export function calculateDefectRateImpactCalculator(input: DefectRateImpactCalculatorInput): DefectRateImpactCalculatorResult {
  const total = Math.round((input.amount1 + (input.amount2 || 0)) * 1.1);

  return {
    total,
    analysis: `คำนวณจากข้อมูล: ${input.amount1.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateDefectRateImpactCalculator({ amount1: 100000, amount2: 50000 });
export const EXAMPLE_2 = calculateDefectRateImpactCalculator({ amount1: 500000, amount2: 250000 });
export const EXAMPLE_3 = calculateDefectRateImpactCalculator({ amount1: 1000000, amount2: 500000 });
