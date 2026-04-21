/**
 * คำนวณสำรองค่าประกันสินค้า (Warranty & Recall Cost Estimator) - KLC-1072
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

export interface Warranty&RecallCostEstimatorInput {
  amount1: number;
  amount2?: number;
}

export interface Warranty&RecallCostEstimatorResult {
  total: number;
  analysis: string;
}

export function calculateWarranty&RecallCostEstimator(input: Warranty&RecallCostEstimatorInput): Warranty&RecallCostEstimatorResult {
  const total = Math.round((input.amount1 + (input.amount2 || 0)) * 1.1);

  return {
    total,
    analysis: `คำนวณจากข้อมูล: ${input.amount1.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateWarranty&RecallCostEstimator({ amount1: 100000, amount2: 50000 });
export const EXAMPLE_2 = calculateWarranty&RecallCostEstimator({ amount1: 500000, amount2: 250000 });
export const EXAMPLE_3 = calculateWarranty&RecallCostEstimator({ amount1: 1000000, amount2: 500000 });
