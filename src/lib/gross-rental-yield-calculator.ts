export interface GrossRentalYieldInput {
  propertyValue: number;
  monthlyRent: number;
}

export interface GrossRentalYieldResult {
  propertyValue: number;
  monthlyRent: number;
  result: number;
}

export function calculateGrossRentalYield(input: GrossRentalYieldInput): GrossRentalYieldResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    propertyValue: input.propertyValue,
    monthlyRent: input.monthlyRent,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateGrossRentalYield({
  propertyValue: 2500000, monthlyRent: 15000,
});

export const EXAMPLE_2 = calculateGrossRentalYield({
  propertyValue: 5000000, monthlyRent: 30000,
});

export const EXAMPLE_3 = calculateGrossRentalYield({
  propertyValue: 3500000, monthlyRent: 21000,
});

