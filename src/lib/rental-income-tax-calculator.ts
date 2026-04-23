export interface RentalIncomeTaxInput {
  monthlyRent: number;
  monthlyExpenses: number;
  taxRate: number;
}

export interface RentalIncomeTaxResult {
  monthlyRent: number;
  monthlyExpenses: number;
  taxRate: number;
  result: number;
}

export function calculateRentalIncomeTax(input: RentalIncomeTaxInput): RentalIncomeTaxResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    monthlyRent: input.monthlyRent,
    monthlyExpenses: input.monthlyExpenses,
    taxRate: input.taxRate,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateRentalIncomeTax({
  monthlyRent: 15000, monthlyExpenses: 4000, taxRate: 5,
});

export const EXAMPLE_2 = calculateRentalIncomeTax({
  monthlyRent: 30000, monthlyExpenses: 8000, taxRate: 10,
});

export const EXAMPLE_3 = calculateRentalIncomeTax({
  monthlyRent: 21000, monthlyExpenses: 5500, taxRate: 7,
});

