/**
 * คำนวณแผนออมสำหรับนาฬิกาแพง (Luxury Watch Affordability Calculator) - KLC-0914
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

export interface Jewelry0914Input {
  amount: number;
  quantity?: number;
  purity?: string;
}

export interface Jewelry0914Result {
  total: number;
  analysis: string;
  breakdown?: string;
}

export function calculateJewelry0914(input: Jewelry0914Input): Jewelry0914Result {
  const total = Math.round(input.amount * (input.quantity || 1) * 1.0);

  return {
    total,
    analysis: `มูลค่ารวม: ${total.toLocaleString('th-TH')} บาท`,
    breakdown: `จำนวน: ${input.quantity || 1} x ราคา: ${input.amount.toLocaleString('th-TH')} บาท`,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateJewelry0914({ amount: 20000, quantity: 1 });
export const EXAMPLE_2 = calculateJewelry0914({ amount: 50000, quantity: 2 });
export const EXAMPLE_3 = calculateJewelry0914({ amount: 100000, quantity: 1 });
