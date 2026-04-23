export interface RestaurantFoodWasteInput {
  dailyPreparedMeals: number;
  wastePercentage: number;
  averageFoodCost: number;
  operatingDaysPerMonth: number;
}

export interface RestaurantFoodWasteResult {
  dailyWasteMeals: number;
  dailyWasteCost: number;
  monthlyWasteMeals: number;
  monthlyWasteCost: number;
  yearlyWasteCost: number;
}

export function calculateRestaurantFoodWaste(input: RestaurantFoodWasteInput): RestaurantFoodWasteResult {
  const dailyWasteMeals = Math.round(input.dailyPreparedMeals * (input.wastePercentage / 100));
  const dailyWasteCost = Math.round(dailyWasteMeals * input.averageFoodCost);
  const monthlyWasteMeals = Math.round(dailyWasteMeals * input.operatingDaysPerMonth);
  const monthlyWasteCost = Math.round(dailyWasteCost * input.operatingDaysPerMonth);
  const yearlyWasteCost = Math.round(monthlyWasteCost * 12);

  return {
    dailyWasteMeals,
    dailyWasteCost,
    monthlyWasteMeals,
    monthlyWasteCost,
    yearlyWasteCost,
  };
}

export const EXAMPLE_1 = calculateRestaurantFoodWaste({
  dailyPreparedMeals: 200,
  wastePercentage: 10,
  averageFoodCost: 80,
  operatingDaysPerMonth: 25,
});

export const EXAMPLE_2 = calculateRestaurantFoodWaste({
  dailyPreparedMeals: 500,
  wastePercentage: 15,
  averageFoodCost: 100,
  operatingDaysPerMonth: 26,
});

export const EXAMPLE_3 = calculateRestaurantFoodWaste({
  dailyPreparedMeals: 300,
  wastePercentage: 8,
  averageFoodCost: 90,
  operatingDaysPerMonth: 25,
});
