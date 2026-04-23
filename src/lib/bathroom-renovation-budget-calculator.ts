export interface BathroomRenovationBudgetInput {
  fixtureCost: number;
  tileCost: number;
  lightingCost: number;
  plumbingCost: number;
  ventilationCost: number;
}

export interface BathroomRenovationBudgetResult {
  fixtureCost: number;
  tileCost: number;
  lightingCost: number;
  plumbingCost: number;
  ventilationCost: number;
  result: number;
}

export function calculateBathroomRenovationBudget(input: BathroomRenovationBudgetInput): BathroomRenovationBudgetResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    fixtureCost: input.fixtureCost,
    tileCost: input.tileCost,
    lightingCost: input.lightingCost,
    plumbingCost: input.plumbingCost,
    ventilationCost: input.ventilationCost,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateBathroomRenovationBudget({
  fixtureCost: 50000, tileCost: 30000, lightingCost: 15000, plumbingCost: 20000, ventilationCost: 10000,
});

export const EXAMPLE_2 = calculateBathroomRenovationBudget({
  fixtureCost: 80000, tileCost: 50000, lightingCost: 25000, plumbingCost: 35000, ventilationCost: 15000,
});

export const EXAMPLE_3 = calculateBathroomRenovationBudget({
  fixtureCost: 65000, tileCost: 40000, lightingCost: 20000, plumbingCost: 28000, ventilationCost: 12000,
});

