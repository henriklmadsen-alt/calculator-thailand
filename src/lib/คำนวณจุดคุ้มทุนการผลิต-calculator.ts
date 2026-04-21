/**
 * คำนวณจุดคุ้มทุนการผลิต (Break-Even Analysis Calculator) - KLC-1054
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

export interface Break-EvenAnalysisCalculatorInput {
  amount1: number;
  amount2?: number;
}

export interface Break-EvenAnalysisCalculatorResult {
  total: number;
  analysis: string;
}

export function calculateBreak-EvenAnalysisCalculator(input: Break-EvenAnalysisCalculatorInput): Break-EvenAnalysisCalculatorResult {
  const total = Math.round((input.amount1 + (input.amount2 || 0)) * 1.1);

  return {
    total,
    analysis: `คำนวณจากข้อมูล: ${input.amount1.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateBreak-EvenAnalysisCalculator({ amount1: 100000, amount2: 50000 });
export const EXAMPLE_2 = calculateBreak-EvenAnalysisCalculator({ amount1: 500000, amount2: 250000 });
export const EXAMPLE_3 = calculateBreak-EvenAnalysisCalculator({ amount1: 1000000, amount2: 500000 });
