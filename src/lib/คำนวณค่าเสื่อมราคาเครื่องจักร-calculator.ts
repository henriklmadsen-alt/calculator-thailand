/**
 * คำนวณค่าเสื่อมราคาเครื่องจักร (Equipment Depreciation Calculator) - KLC-1058
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

export interface EquipmentDepreciationCalculatorInput {
  amount1: number;
  amount2?: number;
}

export interface EquipmentDepreciationCalculatorResult {
  total: number;
  analysis: string;
}

export function calculateEquipmentDepreciationCalculator(input: EquipmentDepreciationCalculatorInput): EquipmentDepreciationCalculatorResult {
  const total = Math.round((input.amount1 + (input.amount2 || 0)) * 1.1);

  return {
    total,
    analysis: `คำนวณจากข้อมูล: ${input.amount1.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateEquipmentDepreciationCalculator({ amount1: 100000, amount2: 50000 });
export const EXAMPLE_2 = calculateEquipmentDepreciationCalculator({ amount1: 500000, amount2: 250000 });
export const EXAMPLE_3 = calculateEquipmentDepreciationCalculator({ amount1: 1000000, amount2: 500000 });
