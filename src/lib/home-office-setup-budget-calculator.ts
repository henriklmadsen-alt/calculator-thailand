export interface HomeOfficeSetupBudgetInput {
  deskCost: number;
  chairCost: number;
  lightingCost: number;
  storageCost: number;
  technologyCost: number;
}

export interface HomeOfficeSetupBudgetResult {
  deskCost: number;
  chairCost: number;
  lightingCost: number;
  storageCost: number;
  technologyCost: number;
  result: number;
}

export function calculateHomeOfficeSetupBudget(input: HomeOfficeSetupBudgetInput): HomeOfficeSetupBudgetResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    deskCost: input.deskCost,
    chairCost: input.chairCost,
    lightingCost: input.lightingCost,
    storageCost: input.storageCost,
    technologyCost: input.technologyCost,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateHomeOfficeSetupBudget({
  deskCost: 8000, chairCost: 6000, lightingCost: 4000, storageCost: 10000, technologyCost: 15000,
});

export const EXAMPLE_2 = calculateHomeOfficeSetupBudget({
  deskCost: 12000, chairCost: 10000, lightingCost: 6000, storageCost: 15000, technologyCost: 25000,
});

export const EXAMPLE_3 = calculateHomeOfficeSetupBudget({
  deskCost: 10000, chairCost: 8000, lightingCost: 5000, storageCost: 12000, technologyCost: 20000,
});

