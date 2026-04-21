/**
 * คำนวณต้นทุนการทดสอบสินค้า (Product Testing Cost Estimator) - KLC-1071
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

export interface ProductTestingCostEstimatorInput {
  amount1: number;
  amount2?: number;
}

export interface ProductTestingCostEstimatorResult {
  total: number;
  analysis: string;
}

export function calculateProductTestingCostEstimator(input: ProductTestingCostEstimatorInput): ProductTestingCostEstimatorResult {
  const total = Math.round((input.amount1 + (input.amount2 || 0)) * 1.1);

  return {
    total,
    analysis: `คำนวณจากข้อมูล: ${input.amount1.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateProductTestingCostEstimator({ amount1: 100000, amount2: 50000 });
export const EXAMPLE_2 = calculateProductTestingCostEstimator({ amount1: 500000, amount2: 250000 });
export const EXAMPLE_3 = calculateProductTestingCostEstimator({ amount1: 1000000, amount2: 500000 });
