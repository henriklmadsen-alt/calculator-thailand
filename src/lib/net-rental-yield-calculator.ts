export interface NetRentalYieldInput {
  propertyValue: number;
  monthlyRent: number;
  monthlyExpenses: number;
}

export interface NetRentalYieldResult {
  propertyValue: number;
  monthlyRent: number;
  monthlyExpenses: number;
  result: number;
}

export function calculateNetRentalYield(input: NetRentalYieldInput): NetRentalYieldResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    propertyValue: input.propertyValue,
    monthlyRent: input.monthlyRent,
    monthlyExpenses: input.monthlyExpenses,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateNetRentalYield({
  propertyValue: 2500000, monthlyRent: 15000, monthlyExpenses: 4000,
});

export const EXAMPLE_2 = calculateNetRentalYield({
  propertyValue: 5000000, monthlyRent: 30000, monthlyExpenses: 8000,
});

export const EXAMPLE_3 = calculateNetRentalYield({
  propertyValue: 3500000, monthlyRent: 21000, monthlyExpenses: 5500,
});

