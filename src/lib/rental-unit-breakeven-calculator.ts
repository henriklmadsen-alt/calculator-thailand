export interface RentalUnitBreakevenInput {
  initialInvestment: number;
  monthlyRent: number;
  monthlyExpenses: number;
}

export interface RentalUnitBreakevenResult {
  initialInvestment: number;
  monthlyRent: number;
  monthlyExpenses: number;
  result: number;
}

export function calculateRentalUnitBreakeven(input: RentalUnitBreakevenInput): RentalUnitBreakevenResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    initialInvestment: input.initialInvestment,
    monthlyRent: input.monthlyRent,
    monthlyExpenses: input.monthlyExpenses,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateRentalUnitBreakeven({
  initialInvestment: 500000, monthlyRent: 15000, monthlyExpenses: 4000,
});

export const EXAMPLE_2 = calculateRentalUnitBreakeven({
  initialInvestment: 1000000, monthlyRent: 30000, monthlyExpenses: 8000,
});

export const EXAMPLE_3 = calculateRentalUnitBreakeven({
  initialInvestment: 750000, monthlyRent: 21000, monthlyExpenses: 5500,
});

