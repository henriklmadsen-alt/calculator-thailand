export interface FoodCogsInput {
  openingInventory: number;
  purchasedInventory: number;
  closingInventory: number;
  monthlyRevenue: number;
}

export interface FoodCogsResult {
  inventoryAvailable: number;
  costOfGoodsSold: number;
  foodCostPercentage: number;
  grossProfit: number;
  grossProfitPercentage: number;
  optimalFoodCostPercentage: number;
}

export function calculateFoodCogs(input: FoodCogsInput): FoodCogsResult {
  const inventoryAvailable = Math.round(input.openingInventory + input.purchasedInventory);
  const costOfGoodsSold = Math.round(inventoryAvailable - input.closingInventory);
  const foodCostPercentage = Math.round((costOfGoodsSold / input.monthlyRevenue) * 100);

  const grossProfit = Math.round(input.monthlyRevenue - costOfGoodsSold);
  const grossProfitPercentage = Math.round((grossProfit / input.monthlyRevenue) * 100);

  // Optimal food cost percentage for restaurants is typically 28-35%
  const optimalFoodCostPercentage = 30;

  return {
    inventoryAvailable,
    costOfGoodsSold,
    foodCostPercentage,
    grossProfit,
    grossProfitPercentage,
    optimalFoodCostPercentage,
  };
}

export const EXAMPLE_1 = calculateFoodCogs({
  openingInventory: 100000,
  purchasedInventory: 200000,
  closingInventory: 120000,
  monthlyRevenue: 1000000,
});

export const EXAMPLE_2 = calculateFoodCogs({
  openingInventory: 150000,
  purchasedInventory: 350000,
  closingInventory: 180000,
  monthlyRevenue: 1500000,
});

export const EXAMPLE_3 = calculateFoodCogs({
  openingInventory: 120000,
  purchasedInventory: 280000,
  closingInventory: 150000,
  monthlyRevenue: 1200000,
});
