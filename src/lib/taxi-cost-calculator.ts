/**
 * Thai Taxi Cost Calculator (KLC-0559)
 * Distance-based fare calculation: 35 THB base + 6 THB/km
 */

export interface TaxiCostResult {
  distanceKm: number;
  baseFare: number;
  distanceFare: number;
  subtotal: number;
  vat: number;
  totalCost: number;
}

export function calculateTaxiCost(distanceKm: number): TaxiCostResult {
  const baseFare = 35;
  const distanceFare = Math.round(distanceKm * 6);
  const subtotal = baseFare + distanceFare;
  const vat = Math.round(subtotal * 0.07);
  const totalCost = subtotal + vat;

  return {
    distanceKm,
    baseFare,
    distanceFare,
    subtotal,
    vat,
    totalCost,
  };
}

/**
 * Example 1: Short trip 2 km (e.g., within the same neighborhood)
 */
export const EXAMPLE_1 = calculateTaxiCost(2);

/**
 * Example 2: Medium trip 10 km (e.g., inner Bangkok)
 */
export const EXAMPLE_2 = calculateTaxiCost(10);

/**
 * Example 3: Longer trip 25 km (e.g., suburbs)
 */
export const EXAMPLE_3 = calculateTaxiCost(25);
