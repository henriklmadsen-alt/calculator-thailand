export interface PropertyAppreciationInput {
  currentValue: number;
  annualAppreciationPercent: number;
  years: number;
}

export interface PropertyAppreciationResult {
  currentValue: number;
  annualAppreciationPercent: number;
  years: number;
  result: number;
}

export function calculatePropertyAppreciation(input: PropertyAppreciationInput): PropertyAppreciationResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    currentValue: input.currentValue,
    annualAppreciationPercent: input.annualAppreciationPercent,
    years: input.years,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculatePropertyAppreciation({
  currentValue: 2500000, annualAppreciationPercent: 3, years: 5,
});

export const EXAMPLE_2 = calculatePropertyAppreciation({
  currentValue: 5000000, annualAppreciationPercent: 4, years: 10,
});

export const EXAMPLE_3 = calculatePropertyAppreciation({
  currentValue: 3500000, annualAppreciationPercent: 3.5, years: 7,
});

