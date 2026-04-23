export interface RenovationCostPerSqmInput {
  totalBudget: number;
  totalArea: number;
  qualityLevel: number;
}

export interface RenovationCostPerSqmResult {
  totalBudget: number;
  totalArea: number;
  qualityLevel: number;
  result: number;
}

export function calculateRenovationCostPerSqm(input: RenovationCostPerSqmInput): RenovationCostPerSqmResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    totalBudget: input.totalBudget,
    totalArea: input.totalArea,
    qualityLevel: input.qualityLevel,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateRenovationCostPerSqm({
  totalBudget: 400000, totalArea: 50, qualityLevel: 1,
});

export const EXAMPLE_2 = calculateRenovationCostPerSqm({
  totalBudget: 700000, totalArea: 70, qualityLevel: 2,
});

export const EXAMPLE_3 = calculateRenovationCostPerSqm({
  totalBudget: 550000, totalArea: 60, qualityLevel: 1,
});

