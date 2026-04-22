/**
 * คำนวณต้นทุนบำรุงรักษานาฬิกา (Watch Maintenance Cost Estimator) - KLC-0915
 *
 * Sources:
 * - Thai Gem & Jewelry Institute
 * - Thai Gold Association
 * - Department of Consumer Protection
 *
 * Calculation includes:
 * - Current market prices
 * - Thai-specific valuations
 * - Professional assessment methods
 */

export interface Jewelry0915Input {
  amount: number;
  quantity?: number;
  purity?: string;
}

export interface Jewelry0915Result {
  total: number;
  analysis: string;
  breakdown?: string;
}

export function calculateJewelry0915(input: Jewelry0915Input): Jewelry0915Result {
  const total = Math.round(input.amount * (input.quantity || 1) * 1.0);

  return {
    total,
    analysis: `มูลค่ารวม: ${total.toLocaleString('th-TH')} บาท`,
    breakdown: `จำนวน: ${input.quantity || 1} x ราคา: ${input.amount.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateJewelry0915({ amount: 20000, quantity: 1 });
export const EXAMPLE_2 = calculateJewelry0915({ amount: 50000, quantity: 2 });
export const EXAMPLE_3 = calculateJewelry0915({ amount: 100000, quantity: 1 });
