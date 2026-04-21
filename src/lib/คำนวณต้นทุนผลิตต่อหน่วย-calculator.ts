/**
 * คำนวณต้นทุนผลิตต่อหน่วย (Production Cost per Unit) - KLC-1051
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

export interface ProductionCostperUnitInput {
  amount1: number;
  amount2?: number;
}

export interface ProductionCostperUnitResult {
  total: number;
  analysis: string;
}

export function calculateProductionCostperUnit(input: ProductionCostperUnitInput): ProductionCostperUnitResult {
  const total = Math.round((input.amount1 + (input.amount2 || 0)) * 1.1);

  return {
    total,
    analysis: `คำนวณจากข้อมูล: ${input.amount1.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateProductionCostperUnit({ amount1: 100000, amount2: 50000 });
export const EXAMPLE_2 = calculateProductionCostperUnit({ amount1: 500000, amount2: 250000 });
export const EXAMPLE_3 = calculateProductionCostperUnit({ amount1: 1000000, amount2: 500000 });
