export interface KitchenCabinetCostInput {
  customCost: number;
  standardCost: number;
  numberOfCabinets: number;
  materialQuality: number;
}

export interface KitchenCabinetCostResult {
  customCost: number;
  standardCost: number;
  numberOfCabinets: number;
  materialQuality: number;
  result: number;
}

export function calculateKitchenCabinetCost(input: KitchenCabinetCostInput): KitchenCabinetCostResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    customCost: input.customCost,
    standardCost: input.standardCost,
    numberOfCabinets: input.numberOfCabinets,
    materialQuality: input.materialQuality,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateKitchenCabinetCost({
  customCost: 1500, standardCost: 800, numberOfCabinets: 10, materialQuality: 1,
});

export const EXAMPLE_2 = calculateKitchenCabinetCost({
  customCost: 2000, standardCost: 1000, numberOfCabinets: 15, materialQuality: 2,
});

export const EXAMPLE_3 = calculateKitchenCabinetCost({
  customCost: 1800, standardCost: 900, numberOfCabinets: 12, materialQuality: 1,
});

