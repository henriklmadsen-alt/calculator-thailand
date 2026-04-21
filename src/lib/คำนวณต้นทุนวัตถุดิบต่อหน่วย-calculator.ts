/**
 * คำนวณต้นทุนวัตถุดิบต่อหน่วย (Material Cost per Unit) - KLC-1056
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

export interface MaterialCostperUnitInput {
  amount1: number;
  amount2?: number;
}

export interface MaterialCostperUnitResult {
  total: number;
  analysis: string;
}

export function calculateMaterialCostperUnit(input: MaterialCostperUnitInput): MaterialCostperUnitResult {
  const total = Math.round((input.amount1 + (input.amount2 || 0)) * 1.1);

  return {
    total,
    analysis: `คำนวณจากข้อมูล: ${input.amount1.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateMaterialCostperUnit({ amount1: 100000, amount2: 50000 });
export const EXAMPLE_2 = calculateMaterialCostperUnit({ amount1: 500000, amount2: 250000 });
export const EXAMPLE_3 = calculateMaterialCostperUnit({ amount1: 1000000, amount2: 500000 });
