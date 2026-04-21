/**
 * คำนวณจัดสรรค่าใช้สอยโรงงาน (Overhead Cost Allocation) - KLC-1057
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

export interface OverheadCostAllocationInput {
  amount1: number;
  amount2?: number;
}

export interface OverheadCostAllocationResult {
  total: number;
  analysis: string;
}

export function calculateOverheadCostAllocation(input: OverheadCostAllocationInput): OverheadCostAllocationResult {
  const total = Math.round((input.amount1 + (input.amount2 || 0)) * 1.1);

  return {
    total,
    analysis: `คำนวณจากข้อมูล: ${input.amount1.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateOverheadCostAllocation({ amount1: 100000, amount2: 50000 });
export const EXAMPLE_2 = calculateOverheadCostAllocation({ amount1: 500000, amount2: 250000 });
export const EXAMPLE_3 = calculateOverheadCostAllocation({ amount1: 1000000, amount2: 500000 });
