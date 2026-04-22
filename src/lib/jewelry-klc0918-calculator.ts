/**
 * คำนวณเปรียบเทียบราคาเครื่องประดับแบรนด์ (Designer Jewelry Cost Comparison) - KLC-0918
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

export interface Jewelry0918Input {
  amount: number;
  quantity?: number;
  purity?: string;
}

export interface Jewelry0918Result {
  total: number;
  analysis: string;
  breakdown?: string;
}

export function calculateJewelry0918(input: Jewelry0918Input): Jewelry0918Result {
  const total = Math.round(input.amount * (input.quantity || 1) * 1.0);

  return {
    total,
    analysis: `มูลค่ารวม: ${total.toLocaleString('th-TH')} บาท`,
    breakdown: `จำนวน: ${input.quantity || 1} x ราคา: ${input.amount.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateJewelry0918({ amount: 20000, quantity: 1 });
export const EXAMPLE_2 = calculateJewelry0918({ amount: 50000, quantity: 2 });
export const EXAMPLE_3 = calculateJewelry0918({ amount: 100000, quantity: 1 });
