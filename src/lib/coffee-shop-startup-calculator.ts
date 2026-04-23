export interface CoffeeShopStartupInput {
  espressoMachinesCost: number;
  grindersCost: number;
  furniturefixuresCost: number;
  posCashRegisterCost: number;
  initialCoffeeInventory: number;
  licensesPermitsCost: number;
  signageDecorationCost: number;
}

export interface CoffeeShopStartupResult {
  equipmentCost: number;
  furnitureFixtureCost: number;
  pointOfSaleCost: number;
  inventoryCost: number;
  permitsLicensesCost: number;
  signageDecorationCost: number;
  totalStartupCost: number;
}

export function calculateCoffeeShopStartup(input: CoffeeShopStartupInput): CoffeeShopStartupResult {
  const equipmentCost = Math.round(input.espressoMachinesCost + input.grindersCost);
  const furnitureFixtureCost = Math.round(input.furniturefixuresCost);
  const pointOfSaleCost = Math.round(input.posCashRegisterCost);
  const inventoryCost = Math.round(input.initialCoffeeInventory);
  const permitsLicensesCost = Math.round(input.licensesPermitsCost);
  const signageDecorationCost = Math.round(input.signageDecorationCost);

  const totalStartupCost = Math.round(
    equipmentCost + furnitureFixtureCost + pointOfSaleCost + inventoryCost + permitsLicensesCost + signageDecorationCost
  );

  return {
    equipmentCost,
    furnitureFixtureCost,
    pointOfSaleCost,
    inventoryCost,
    permitsLicensesCost,
    signageDecorationCost,
    totalStartupCost,
  };
}

export const EXAMPLE_1 = calculateCoffeeShopStartup({
  espressoMachinesCost: 300000,
  grindersCost: 100000,
  furniturefixuresCost: 150000,
  posCashRegisterCost: 50000,
  initialCoffeeInventory: 80000,
  licensesPermitsCost: 30000,
  signageDecorationCost: 40000,
});

export const EXAMPLE_2 = calculateCoffeeShopStartup({
  espressoMachinesCost: 500000,
  grindersCost: 150000,
  furniturefixuresCost: 250000,
  posCashRegisterCost: 80000,
  initialCoffeeInventory: 120000,
  licensesPermitsCost: 40000,
  signageDecorationCost: 60000,
});

export const EXAMPLE_3 = calculateCoffeeShopStartup({
  espressoMachinesCost: 400000,
  grindersCost: 120000,
  furniturefixuresCost: 200000,
  posCashRegisterCost: 60000,
  initialCoffeeInventory: 100000,
  licensesPermitsCost: 35000,
  signageDecorationCost: 50000,
});
