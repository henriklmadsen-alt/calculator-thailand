export interface MonthlyRentCalculatorInput {
  propertyValue: number;
  targetYieldPercent: number;
}

export interface MonthlyRentCalculatorResult {
  propertyValue: number;
  targetYieldPercent: number;
  result: number;
}

export function calculateMonthlyRentCalculator(input: MonthlyRentCalculatorInput): MonthlyRentCalculatorResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    propertyValue: input.propertyValue,
    targetYieldPercent: input.targetYieldPercent,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateMonthlyRentCalculator({
  propertyValue: 2500000, targetYieldPercent: 6,
});

export const EXAMPLE_2 = calculateMonthlyRentCalculator({
  propertyValue: 5000000, targetYieldPercent: 7,
});

export const EXAMPLE_3 = calculateMonthlyRentCalculator({
  propertyValue: 3500000, targetYieldPercent: 6.5,
});

