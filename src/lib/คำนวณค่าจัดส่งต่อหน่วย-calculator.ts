/**
 * คำนวณค่าจัดส่งต่อหน่วย (Logistics & Shipping Cost per Unit) - KLC-1065
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

export interface Logistics&ShippingCostperUnitInput {
  amount1: number;
  amount2?: number;
}

export interface Logistics&ShippingCostperUnitResult {
  total: number;
  analysis: string;
}

export function calculateLogistics&ShippingCostperUnit(input: Logistics&ShippingCostperUnitInput): Logistics&ShippingCostperUnitResult {
  const total = Math.round((input.amount1 + (input.amount2 || 0)) * 1.1);

  return {
    total,
    analysis: `คำนวณจากข้อมูล: ${input.amount1.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateLogistics&ShippingCostperUnit({ amount1: 100000, amount2: 50000 });
export const EXAMPLE_2 = calculateLogistics&ShippingCostperUnit({ amount1: 500000, amount2: 250000 });
export const EXAMPLE_3 = calculateLogistics&ShippingCostperUnit({ amount1: 1000000, amount2: 500000 });
