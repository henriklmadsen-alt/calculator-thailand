export interface FlooringMaterialCalculatorInput {
  floorArea: number;
  materialCostPerSqm: number;
  installationCostPercent: number;
}

export interface FlooringMaterialCalculatorResult {
  floorArea: number;
  materialCostPerSqm: number;
  installationCostPercent: number;
  result: number;
}

export function calculateFlooringMaterialCalculator(input: FlooringMaterialCalculatorInput): FlooringMaterialCalculatorResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    floorArea: input.floorArea,
    materialCostPerSqm: input.materialCostPerSqm,
    installationCostPercent: input.installationCostPercent,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateFlooringMaterialCalculator({
  floorArea: 50, materialCostPerSqm: 800, installationCostPercent: 20,
});

export const EXAMPLE_2 = calculateFlooringMaterialCalculator({
  floorArea: 80, materialCostPerSqm: 1200, installationCostPercent: 25,
});

export const EXAMPLE_3 = calculateFlooringMaterialCalculator({
  floorArea: 65, materialCostPerSqm: 1000, installationCostPercent: 20,
});

