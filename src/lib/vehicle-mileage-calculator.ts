/**
 * Thai Vehicle Mileage Allowance Calculator (KLC-0562)
 * Calculate mileage reimbursement based on distance and rate
 */

export interface MileageAllowanceResult {
  distance: number;
  thbPerKm: number;
  totalAllowance: number;
  vat: number;
  totalWithVat: number;
}

export function calculateMileageAllowance(distance: number, thbPerKm: number): MileageAllowanceResult {
  const totalAllowance = Math.round(distance * thbPerKm);
  const vat = Math.round(totalAllowance * 0.07);
  const totalWithVat = totalAllowance + vat;

  return {
    distance,
    thbPerKm,
    totalAllowance,
    vat,
    totalWithVat,
  };
}

/**
 * Example 1: Personal car mileage at standard government rate (7 THB/km)
 * Distance: 100 km
 */
export const EXAMPLE_1 = calculateMileageAllowance(100, 7);

/**
 * Example 2: Company car mileage at higher reimbursement rate (8.5 THB/km)
 * Distance: 250 km
 */
export const EXAMPLE_2 = calculateMileageAllowance(250, 8.5);

/**
 * Example 3: Long-distance business travel (10 THB/km)
 * Distance: 500 km
 */
export const EXAMPLE_3 = calculateMileageAllowance(500, 10);
