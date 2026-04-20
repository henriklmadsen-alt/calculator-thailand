/**
 * Thai Motorcycle Rental Cost Calculator (KLC-0558)
 * Rental cost with optional insurance and VAT
 */

export interface MotorcycleRentalResult {
  dailyRate: number;
  days: number;
  rentalCost: number;
  insuranceCost: number;
  subtotal: number;
  vat: number;
  totalCost: number;
}

export function calculateMotorcycleRental(
  dailyRate: number,
  days: number,
  includingInsurance: boolean
): MotorcycleRentalResult {
  const rentalCost = dailyRate * days;
  const insuranceCost = includingInsurance ? Math.round(rentalCost * 0.1) : 0;
  const subtotal = rentalCost + insuranceCost;
  const vat = Math.round(subtotal * 0.07);
  const totalCost = subtotal + vat;

  return {
    dailyRate,
    days,
    rentalCost: Math.round(rentalCost),
    insuranceCost,
    subtotal,
    vat,
    totalCost,
  };
}

/**
 * Example 1: 3-day rental without insurance
 * Daily rate: 300 THB, 3 days
 */
export const EXAMPLE_1 = calculateMotorcycleRental(300, 3, false);

/**
 * Example 2: 5-day rental with insurance
 * Daily rate: 250 THB, 5 days, with 10% insurance
 */
export const EXAMPLE_2 = calculateMotorcycleRental(250, 5, true);

/**
 * Example 3: 7-day long-term rental with insurance
 * Daily rate: 200 THB, 7 days, with insurance
 */
export const EXAMPLE_3 = calculateMotorcycleRental(200, 7, true);
