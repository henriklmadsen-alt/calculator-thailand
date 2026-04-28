export interface LightingRentalInput {
  spotLightQuantity: number;
  spotLightUnitCost: number;
  ambientLightQuantity: number;
  ambientLightUnitCost: number;
  backdropCost: number;
  rentalHours: number;
  laborRatePerHour: number;
}

export interface LightingRentalResult {
  spotLightCost: number;
  ambientLightCost: number;
  backdropCost: number;
  laborCost: number;
  totalLightingCost: number;
}

export function calculateLightingRental(input: LightingRentalInput): LightingRentalResult {
  const spotLightCost = Math.round(input.spotLightQuantity * input.spotLightUnitCost);
  const ambientLightCost = Math.round(input.ambientLightQuantity * input.ambientLightUnitCost);
  const laborCost = Math.round(input.rentalHours * input.laborRatePerHour);
  const totalLightingCost = Math.round(spotLightCost + ambientLightCost + input.backdropCost + laborCost);

  return {
    spotLightCost,
    ambientLightCost,
    backdropCost: input.backdropCost,
    laborCost,
    totalLightingCost,
  };
}

export const EXAMPLE_1 = calculateLightingRental({
  spotLightQuantity: 4,
  spotLightUnitCost: 800,
  ambientLightQuantity: 6,
  ambientLightUnitCost: 500,
  backdropCost: 2000,
  rentalHours: 4,
  laborRatePerHour: 600,
});

export const EXAMPLE_2 = calculateLightingRental({
  spotLightQuantity: 8,
  spotLightUnitCost: 1000,
  ambientLightQuantity: 10,
  ambientLightUnitCost: 700,
  backdropCost: 4000,
  rentalHours: 6,
  laborRatePerHour: 800,
});

export const EXAMPLE_3 = calculateLightingRental({
  spotLightQuantity: 12,
  spotLightUnitCost: 1200,
  ambientLightQuantity: 15,
  ambientLightUnitCost: 900,
  backdropCost: 6000,
  rentalHours: 8,
  laborRatePerHour: 1000,
});
