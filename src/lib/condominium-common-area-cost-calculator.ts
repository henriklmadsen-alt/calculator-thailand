export interface CondominiumCommonAreaCostInput {
  totalCommonAreaCost: number;
  totalUnitArea: number;
  unitArea: number;
}

export interface CondominiumCommonAreaCostResult {
  totalCommonAreaCost: number;
  totalUnitArea: number;
  unitArea: number;
  result: number;
}

export function calculateCondominiumCommonAreaCost(input: CondominiumCommonAreaCostInput): CondominiumCommonAreaCostResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    totalCommonAreaCost: input.totalCommonAreaCost,
    totalUnitArea: input.totalUnitArea,
    unitArea: input.unitArea,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateCondominiumCommonAreaCost({
  totalCommonAreaCost: 500000, totalUnitArea: 5000, unitArea: 80,
});

export const EXAMPLE_2 = calculateCondominiumCommonAreaCost({
  totalCommonAreaCost: 800000, totalUnitArea: 10000, unitArea: 120,
});

export const EXAMPLE_3 = calculateCondominiumCommonAreaCost({
  totalCommonAreaCost: 600000, totalUnitArea: 7500, unitArea: 100,
});

