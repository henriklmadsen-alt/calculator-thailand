export interface RestaurantProfitMarginInput {
  totalRevenue: number;
  foodCost: number;
  laborCost: number;
  rentCost: number;
  utilitiesCost: number;
  otherOperatingCost: number;
}

export interface RestaurantProfitMarginResult {
  grossProfit: number;
  grossProfitMargin: number;
  operatingExpenses: number;
  operatingProfit: number;
  operatingProfitMargin: number;
  foodCostPercentage: number;
  laborCostPercentage: number;
}

export function calculateRestaurantProfitMargin(input: RestaurantProfitMarginInput): RestaurantProfitMarginResult {
  const grossProfit = Math.round(input.totalRevenue - input.foodCost);
  const grossProfitMargin = Math.round((grossProfit / input.totalRevenue) * 100);

  const operatingExpenses = Math.round(
    input.laborCost + input.rentCost + input.utilitiesCost + input.otherOperatingCost
  );
  const operatingProfit = Math.round(grossProfit - operatingExpenses);
  const operatingProfitMargin = Math.round((operatingProfit / input.totalRevenue) * 100);

  const foodCostPercentage = Math.round((input.foodCost / input.totalRevenue) * 100);
  const laborCostPercentage = Math.round((input.laborCost / input.totalRevenue) * 100);

  return {
    grossProfit,
    grossProfitMargin,
    operatingExpenses,
    operatingProfit,
    operatingProfitMargin,
    foodCostPercentage,
    laborCostPercentage,
  };
}

export const EXAMPLE_1 = calculateRestaurantProfitMargin({
  totalRevenue: 500000,
  foodCost: 150000,
  laborCost: 150000,
  rentCost: 50000,
  utilitiesCost: 30000,
  otherOperatingCost: 20000,
});

export const EXAMPLE_2 = calculateRestaurantProfitMargin({
  totalRevenue: 1000000,
  foodCost: 300000,
  laborCost: 300000,
  rentCost: 100000,
  utilitiesCost: 50000,
  otherOperatingCost: 50000,
});

export const EXAMPLE_3 = calculateRestaurantProfitMargin({
  totalRevenue: 750000,
  foodCost: 225000,
  laborCost: 200000,
  rentCost: 75000,
  utilitiesCost: 40000,
  otherOperatingCost: 30000,
});
