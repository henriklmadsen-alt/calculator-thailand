export interface LightingDesignCostInput {
  fixtureCount: number;
  fixtureCost: number;
  installationCost: number;
  smartControlCost: number;
}

export interface LightingDesignCostResult {
  fixtureCount: number;
  fixtureCost: number;
  installationCost: number;
  smartControlCost: number;
  result: number;
}

export function calculateLightingDesignCost(input: LightingDesignCostInput): LightingDesignCostResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    fixtureCount: input.fixtureCount,
    fixtureCost: input.fixtureCost,
    installationCost: input.installationCost,
    smartControlCost: input.smartControlCost,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateLightingDesignCost({
  fixtureCount: 10, fixtureCost: 2500, installationCost: 5000, smartControlCost: 8000,
});

export const EXAMPLE_2 = calculateLightingDesignCost({
  fixtureCount: 15, fixtureCost: 3000, installationCost: 7500, smartControlCost: 12000,
});

export const EXAMPLE_3 = calculateLightingDesignCost({
  fixtureCount: 12, fixtureCost: 2800, installationCost: 6000, smartControlCost: 10000,
});

