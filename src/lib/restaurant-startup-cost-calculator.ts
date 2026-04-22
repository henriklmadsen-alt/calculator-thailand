export interface RestaurantStartupInput {
  kitchenEquipmentCost: number;
  diningFurnitureCost: number;
  decorationCost: number;
  posSystemCost: number;
  licensesPermitsCost: number;
  renovationCost: number;
  initialFoodInventory: number;
  signageCost: number;
}

export interface RestaurantStartupResult {
  kitchenEquipmentCost: number;
  diningFurnitureCost: number;
  decorationCost: number;
  posSystemCost: number;
  licensesPermitsCost: number;
  renovationCost: number;
  initialFoodInventory: number;
  signageCost: number;
  totalStartupCost: number;
}

export function calculateRestaurantStartup(input: RestaurantStartupInput): RestaurantStartupResult {
  const total = Math.round(
    input.kitchenEquipmentCost +
    input.diningFurnitureCost +
    input.decorationCost +
    input.posSystemCost +
    input.licensesPermitsCost +
    input.renovationCost +
    input.initialFoodInventory +
    input.signageCost
  );

  return {
    kitchenEquipmentCost: input.kitchenEquipmentCost,
    diningFurnitureCost: input.diningFurnitureCost,
    decorationCost: input.decorationCost,
    posSystemCost: input.posSystemCost,
    licensesPermitsCost: input.licensesPermitsCost,
    renovationCost: input.renovationCost,
    initialFoodInventory: input.initialFoodInventory,
    signageCost: input.signageCost,
    totalStartupCost: total,
  };
}

export const EXAMPLE_1 = calculateRestaurantStartup({
  kitchenEquipmentCost: 500000,
  diningFurnitureCost: 200000,
  decorationCost: 150000,
  posSystemCost: 80000,
  licensesPermitsCost: 50000,
  renovationCost: 300000,
  initialFoodInventory: 100000,
  signageCost: 30000,
});

export const EXAMPLE_2 = calculateRestaurantStartup({
  kitchenEquipmentCost: 1000000,
  diningFurnitureCost: 400000,
  decorationCost: 300000,
  posSystemCost: 150000,
  licensesPermitsCost: 75000,
  renovationCost: 600000,
  initialFoodInventory: 200000,
  signageCost: 60000,
});

export const EXAMPLE_3 = calculateRestaurantStartup({
  kitchenEquipmentCost: 750000,
  diningFurnitureCost: 300000,
  decorationCost: 200000,
  posSystemCost: 100000,
  licensesPermitsCost: 60000,
  renovationCost: 400000,
  initialFoodInventory: 150000,
  signageCost: 40000,
});
