export interface ColorPaintingCostInput {
  wallArea: number;
  colorCount: number;
  costPerLiter: number;
  laborCostPerSqm: number;
}

export interface ColorPaintingCostResult {
  wallArea: number;
  colorCount: number;
  costPerLiter: number;
  laborCostPerSqm: number;
  result: number;
}

export function calculateColorPaintingCost(input: ColorPaintingCostInput): ColorPaintingCostResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    wallArea: input.wallArea,
    colorCount: input.colorCount,
    costPerLiter: input.costPerLiter,
    laborCostPerSqm: input.laborCostPerSqm,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateColorPaintingCost({
  wallArea: 100, colorCount: 3, costPerLiter: 150, laborCostPerSqm: 50,
});

export const EXAMPLE_2 = calculateColorPaintingCost({
  wallArea: 150, colorCount: 4, costPerLiter: 150, laborCostPerSqm: 60,
});

export const EXAMPLE_3 = calculateColorPaintingCost({
  wallArea: 120, colorCount: 3, costPerLiter: 150, laborCostPerSqm: 55,
});

