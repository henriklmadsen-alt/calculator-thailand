export interface FoodBusinessBreakevenPricingInput {
  monthlyFixedCost: number;
  foodCostPerDish: number;
  laborCostPerDish: number;
  overheadPercentagePerDish: number;
  targetProfitMarginPercentage: number;
  estimatedDailySales: number;
  operatingDaysPerMonth: number;
}

export interface FoodBusinessBreakevenPricingResult {
  variableCostPerDish: number;
  breakevenPricePerDish: number;
  targetProfitPerDish: number;
  recommendedSellingPrice: number;
  dailyBreakevenDishes: number;
  monthlyBreakevenDishes: number;
  monthlyBreakevenRevenue: number;
  monthlySalesAtTarget: number;
  monthlyProfitAtTarget: number;
}

export function calculateFoodBusinessBreakevenPricing(input: FoodBusinessBreakevenPricingInput): FoodBusinessBreakevenPricingResult {
  const variableCostPerDish = Math.round(
    input.foodCostPerDish +
    input.laborCostPerDish +
    (input.monthlyFixedCost / (input.estimatedDailySales * input.operatingDaysPerMonth) * (input.overheadPercentagePerDish / 100))
  );

  const breakevenPricePerDish = Math.round(variableCostPerDish / (1 - (input.overheadPercentagePerDish / 100 / 2)));
  const targetProfitPerDish = Math.round(breakevenPricePerDish * (input.targetProfitMarginPercentage / 100));
  const recommendedSellingPrice = Math.round(breakevenPricePerDish + targetProfitPerDish);

  const dailyBreakevenDishes = Math.round(input.monthlyFixedCost / (recommendedSellingPrice - variableCostPerDish) / input.operatingDaysPerMonth);
  const monthlyBreakevenDishes = Math.round(dailyBreakevenDishes * input.operatingDaysPerMonth);
  const monthlyBreakevenRevenue = Math.round(monthlyBreakevenDishes * recommendedSellingPrice);

  const monthlySalesAtTarget = Math.round(input.estimatedDailySales * input.operatingDaysPerMonth);
  const monthlyProfitAtTarget = Math.round((monthlySalesAtTarget * recommendedSellingPrice) - (monthlySalesAtTarget * variableCostPerDish) - input.monthlyFixedCost);

  return {
    variableCostPerDish,
    breakevenPricePerDish,
    targetProfitPerDish,
    recommendedSellingPrice,
    dailyBreakevenDishes,
    monthlyBreakevenDishes,
    monthlyBreakevenRevenue,
    monthlySalesAtTarget,
    monthlyProfitAtTarget,
  };
}

export const EXAMPLE_1 = calculateFoodBusinessBreakevenPricing({
  monthlyFixedCost: 200000,
  foodCostPerDish: 80,
  laborCostPerDish: 30,
  overheadPercentagePerDish: 20,
  targetProfitMarginPercentage: 25,
  estimatedDailySales: 200,
  operatingDaysPerMonth: 25,
});

export const EXAMPLE_2 = calculateFoodBusinessBreakevenPricing({
  monthlyFixedCost: 300000,
  foodCostPerDish: 100,
  laborCostPerDish: 40,
  overheadPercentagePerDish: 22,
  targetProfitMarginPercentage: 30,
  estimatedDailySales: 300,
  operatingDaysPerMonth: 26,
});

export const EXAMPLE_3 = calculateFoodBusinessBreakevenPricing({
  monthlyFixedCost: 250000,
  foodCostPerDish: 90,
  laborCostPerDish: 35,
  overheadPercentagePerDish: 21,
  targetProfitMarginPercentage: 28,
  estimatedDailySales: 250,
  operatingDaysPerMonth: 25,
});
