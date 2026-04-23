export interface CeilingMaterialCostInput {
  ceilingArea: number;
  materialType: number;
  costPerSqm: number;
}

export interface CeilingMaterialCostResult {
  ceilingArea: number;
  materialType: number;
  costPerSqm: number;
  result: number;
}

export function calculateCeilingMaterialCost(input: CeilingMaterialCostInput): CeilingMaterialCostResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    ceilingArea: input.ceilingArea,
    materialType: input.materialType,
    costPerSqm: input.costPerSqm,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateCeilingMaterialCost({
  ceilingArea: 40, materialType: 1, costPerSqm: 300,
});

export const EXAMPLE_2 = calculateCeilingMaterialCost({
  ceilingArea: 60, materialType: 2, costPerSqm: 500,
});

export const EXAMPLE_3 = calculateCeilingMaterialCost({
  ceilingArea: 50, materialType: 1, costPerSqm: 400,
});

