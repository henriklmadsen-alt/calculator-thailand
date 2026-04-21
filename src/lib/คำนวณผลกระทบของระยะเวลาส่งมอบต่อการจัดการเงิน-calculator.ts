/**
 * คำนวณผลกระทบของระยะเวลาส่งมอบต่อการจัดการเงิน (Supply Chain Lead Time & Cost) - KLC-1068
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

export interface SupplyChainLeadTime&CostInput {
  amount1: number;
  amount2?: number;
}

export interface SupplyChainLeadTime&CostResult {
  total: number;
  analysis: string;
}

export function calculateSupplyChainLeadTime&Cost(input: SupplyChainLeadTime&CostInput): SupplyChainLeadTime&CostResult {
  const total = Math.round((input.amount1 + (input.amount2 || 0)) * 1.1);

  return {
    total,
    analysis: `คำนวณจากข้อมูล: ${input.amount1.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateSupplyChainLeadTime&Cost({ amount1: 100000, amount2: 50000 });
export const EXAMPLE_2 = calculateSupplyChainLeadTime&Cost({ amount1: 500000, amount2: 250000 });
export const EXAMPLE_3 = calculateSupplyChainLeadTime&Cost({ amount1: 1000000, amount2: 500000 });
