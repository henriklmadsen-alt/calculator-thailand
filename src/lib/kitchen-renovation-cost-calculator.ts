export interface KitchenRenovationCostInput {
  cabinetCost: number;
  counterCost: number;
  applianceCost: number;
  flooringCost: number;
  backsplashCost: number;
}

export interface KitchenRenovationCostResult {
  cabinetCost: number;
  counterCost: number;
  applianceCost: number;
  flooringCost: number;
  backsplashCost: number;
  result: number;
}

export function calculateKitchenRenovationCost(input: KitchenRenovationCostInput): KitchenRenovationCostResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    cabinetCost: input.cabinetCost,
    counterCost: input.counterCost,
    applianceCost: input.applianceCost,
    flooringCost: input.flooringCost,
    backsplashCost: input.backsplashCost,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateKitchenRenovationCost({
  cabinetCost: 80000, counterCost: 50000, applianceCost: 100000, flooringCost: 40000, backsplashCost: 15000,
});

export const EXAMPLE_2 = calculateKitchenRenovationCost({
  cabinetCost: 120000, counterCost: 80000, applianceCost: 150000, flooringCost: 60000, backsplashCost: 25000,
});

export const EXAMPLE_3 = calculateKitchenRenovationCost({
  cabinetCost: 100000, counterCost: 65000, applianceCost: 120000, flooringCost: 50000, backsplashCost: 20000,
});

