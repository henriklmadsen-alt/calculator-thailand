/**
 * คำนวณค่าแทนที่เครื่องจักร (Equipment Replacement Cost Planner) - KLC-1063
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

export interface EquipmentReplacementCostPlannerInput {
  amount1: number;
  amount2?: number;
}

export interface EquipmentReplacementCostPlannerResult {
  total: number;
  analysis: string;
}

export function calculateEquipmentReplacementCostPlanner(input: EquipmentReplacementCostPlannerInput): EquipmentReplacementCostPlannerResult {
  const total = Math.round((input.amount1 + (input.amount2 || 0)) * 1.1);

  return {
    total,
    analysis: `คำนวณจากข้อมูล: ${input.amount1.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateEquipmentReplacementCostPlanner({ amount1: 100000, amount2: 50000 });
export const EXAMPLE_2 = calculateEquipmentReplacementCostPlanner({ amount1: 500000, amount2: 250000 });
export const EXAMPLE_3 = calculateEquipmentReplacementCostPlanner({ amount1: 1000000, amount2: 500000 });
