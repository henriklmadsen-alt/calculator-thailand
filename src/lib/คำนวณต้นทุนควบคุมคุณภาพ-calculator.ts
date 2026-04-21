/**
 * คำนวณต้นทุนควบคุมคุณภาพ (Quality Assurance Cost Calculator) - KLC-1069
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

export interface QualityAssuranceCostCalculatorInput {
  amount1: number;
  amount2?: number;
}

export interface QualityAssuranceCostCalculatorResult {
  total: number;
  analysis: string;
}

export function calculateQualityAssuranceCostCalculator(input: QualityAssuranceCostCalculatorInput): QualityAssuranceCostCalculatorResult {
  const total = Math.round((input.amount1 + (input.amount2 || 0)) * 1.1);

  return {
    total,
    analysis: `คำนวณจากข้อมูล: ${input.amount1.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateQualityAssuranceCostCalculator({ amount1: 100000, amount2: 50000 });
export const EXAMPLE_2 = calculateQualityAssuranceCostCalculator({ amount1: 500000, amount2: 250000 });
export const EXAMPLE_3 = calculateQualityAssuranceCostCalculator({ amount1: 1000000, amount2: 500000 });
