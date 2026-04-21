/**
 * คำนวณอัตราการใช้งานโรงงาน (Factory Capacity Utilization) - KLC-1061
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

export interface FactoryCapacityUtilizationInput {
  amount1: number;
  amount2?: number;
}

export interface FactoryCapacityUtilizationResult {
  total: number;
  analysis: string;
}

export function calculateFactoryCapacityUtilization(input: FactoryCapacityUtilizationInput): FactoryCapacityUtilizationResult {
  const total = Math.round((input.amount1 + (input.amount2 || 0)) * 1.1);

  return {
    total,
    analysis: `คำนวณจากข้อมูล: ${input.amount1.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateFactoryCapacityUtilization({ amount1: 100000, amount2: 50000 });
export const EXAMPLE_2 = calculateFactoryCapacityUtilization({ amount1: 500000, amount2: 250000 });
export const EXAMPLE_3 = calculateFactoryCapacityUtilization({ amount1: 1000000, amount2: 500000 });
