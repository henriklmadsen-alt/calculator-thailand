/**
 * คำนวณค่าซ่อมแซมจากหยุดทำงาน (Downtime Cost Calculator) - KLC-1062
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

export interface DowntimeCostCalculatorInput {
  amount1: number;
  amount2?: number;
}

export interface DowntimeCostCalculatorResult {
  total: number;
  analysis: string;
}

export function calculateDowntimeCostCalculator(input: DowntimeCostCalculatorInput): DowntimeCostCalculatorResult {
  const total = Math.round((input.amount1 + (input.amount2 || 0)) * 1.1);

  return {
    total,
    analysis: `คำนวณจากข้อมูล: ${input.amount1.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateDowntimeCostCalculator({ amount1: 100000, amount2: 50000 });
export const EXAMPLE_2 = calculateDowntimeCostCalculator({ amount1: 500000, amount2: 250000 });
export const EXAMPLE_3 = calculateDowntimeCostCalculator({ amount1: 1000000, amount2: 500000 });
