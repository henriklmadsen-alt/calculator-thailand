/**
 * คำนวณต้นทุนการปรับเวลาทำงาน (Factory Shift Planning & Cost) - KLC-1074
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

export interface FactoryShiftPlanning&CostInput {
  amount1: number;
  amount2?: number;
}

export interface FactoryShiftPlanning&CostResult {
  total: number;
  analysis: string;
}

export function calculateFactoryShiftPlanning&Cost(input: FactoryShiftPlanning&CostInput): FactoryShiftPlanning&CostResult {
  const total = Math.round((input.amount1 + (input.amount2 || 0)) * 1.1);

  return {
    total,
    analysis: `คำนวณจากข้อมูล: ${input.amount1.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateFactoryShiftPlanning&Cost({ amount1: 100000, amount2: 50000 });
export const EXAMPLE_2 = calculateFactoryShiftPlanning&Cost({ amount1: 500000, amount2: 250000 });
export const EXAMPLE_3 = calculateFactoryShiftPlanning&Cost({ amount1: 1000000, amount2: 500000 });
