export interface PropertyDepreciationDeductionInput {
  buildingValue: number;
  depreciationYears: number;
  depreciationRatePercent: number;
}

export interface PropertyDepreciationDeductionResult {
  buildingValue: number;
  depreciationYears: number;
  depreciationRatePercent: number;
  result: number;
}

export function calculatePropertyDepreciationDeduction(input: PropertyDepreciationDeductionInput): PropertyDepreciationDeductionResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    buildingValue: input.buildingValue,
    depreciationYears: input.depreciationYears,
    depreciationRatePercent: input.depreciationRatePercent,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculatePropertyDepreciationDeduction({
  buildingValue: 2000000, depreciationYears: 5, depreciationRatePercent: 5,
});

export const EXAMPLE_2 = calculatePropertyDepreciationDeduction({
  buildingValue: 4000000, depreciationYears: 10, depreciationRatePercent: 4,
});

export const EXAMPLE_3 = calculatePropertyDepreciationDeduction({
  buildingValue: 3000000, depreciationYears: 8, depreciationRatePercent: 4.5,
});

