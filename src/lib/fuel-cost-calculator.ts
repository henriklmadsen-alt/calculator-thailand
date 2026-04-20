/**
 * Fuel Consumption Cost Calculator
 * Calculate fuel costs based on distance and consumption rate
 */

export interface FuelCostInput {
  distance: number; // km
  fuelPrice: number; // THB per liter
  fuelConsumption: number; // km per liter
}

export interface FuelCostResult {
  distance: number;
  fuelPrice: number;
  fuelConsumption: number;
  litersNeeded: number;
  totalCost: number;
}

export function calculateFuelCost(input: FuelCostInput): FuelCostResult {
  const litersNeeded = input.distance / input.fuelConsumption;
  const totalCost = litersNeeded * input.fuelPrice;

  return {
    distance: input.distance,
    fuelPrice: input.fuelPrice,
    fuelConsumption: input.fuelConsumption,
    litersNeeded: Math.round(litersNeeded * 100) / 100,
    totalCost: Math.round(totalCost),
  };
}

export const EXAMPLE_1 = calculateFuelCost({
  distance: 100,
  fuelPrice: 36,
  fuelConsumption: 7,
});

export const EXAMPLE_2 = calculateFuelCost({
  distance: 500,
  fuelPrice: 36,
  fuelConsumption: 5,
});

export const EXAMPLE_3 = calculateFuelCost({
  distance: 1000,
  fuelPrice: 34,
  fuelConsumption: 6,
});
