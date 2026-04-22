export interface RestaurantBreakevenInput {
  monthlyFixedCost: number;
  averageMealPrice: number;
  foodCostPerMeal: number;
  otherVariableCostPerMeal: number;
  operatingDaysPerMonth: number;
}

export interface RestaurantBreakevenResult {
  contributionMarginPerMeal: number;
  contributionMarginPercentage: number;
  mealsNeededBreakeven: number;
  mealsPerDay: number;
  monthlyBreakevenRevenue: number;
}

export function calculateRestaurantBreakeven(input: RestaurantBreakevenInput): RestaurantBreakevenResult {
  const variableCostPerMeal = input.foodCostPerMeal + input.otherVariableCostPerMeal;
  const contributionMarginPerMeal = Math.round(input.averageMealPrice - variableCostPerMeal);
  const contributionMarginPercentage = Math.round((contributionMarginPerMeal / input.averageMealPrice) * 100);

  const mealsNeededBreakeven = Math.round(input.monthlyFixedCost / contributionMarginPerMeal);
  const mealsPerDay = Math.round(mealsNeededBreakeven / input.operatingDaysPerMonth);
  const monthlyBreakevenRevenue = Math.round(mealsNeededBreakeven * input.averageMealPrice);

  return {
    contributionMarginPerMeal,
    contributionMarginPercentage,
    mealsNeededBreakeven,
    mealsPerDay,
    monthlyBreakevenRevenue,
  };
}

export const EXAMPLE_1 = calculateRestaurantBreakeven({
  monthlyFixedCost: 150000,
  averageMealPrice: 250,
  foodCostPerMeal: 80,
  otherVariableCostPerMeal: 30,
  operatingDaysPerMonth: 25,
});

export const EXAMPLE_2 = calculateRestaurantBreakeven({
  monthlyFixedCost: 250000,
  averageMealPrice: 350,
  foodCostPerMeal: 120,
  otherVariableCostPerMeal: 40,
  operatingDaysPerMonth: 26,
});

export const EXAMPLE_3 = calculateRestaurantBreakeven({
  monthlyFixedCost: 200000,
  averageMealPrice: 300,
  foodCostPerMeal: 100,
  otherVariableCostPerMeal: 35,
  operatingDaysPerMonth: 25,
});
