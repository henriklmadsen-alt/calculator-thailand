export interface RentalIncomeProjectionInput {
  monthlyRent: number;
  annualIncreasePercent: number;
  years: number;
}

export interface RentalIncomeProjectionResult {
  monthlyRent: number;
  annualIncreasePercent: number;
  years: number;
  result: number;
}

export function calculateRentalIncomeProjection(input: RentalIncomeProjectionInput): RentalIncomeProjectionResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    monthlyRent: input.monthlyRent,
    annualIncreasePercent: input.annualIncreasePercent,
    years: input.years,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateRentalIncomeProjection({
  monthlyRent: 15000, annualIncreasePercent: 2.5, years: 5,
});

export const EXAMPLE_2 = calculateRentalIncomeProjection({
  monthlyRent: 30000, annualIncreasePercent: 3, years: 10,
});

export const EXAMPLE_3 = calculateRentalIncomeProjection({
  monthlyRent: 21000, annualIncreasePercent: 2, years: 7,
});

