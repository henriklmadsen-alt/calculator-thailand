export interface RestaurantDailyOperatingInput {
  mealsServed: number;
  foodCostPerMeal: number;
  laborCostPerDay: number;
  utilitiesCostPerDay: number;
  rentPerDay: number;
  suppliesCostPerDay: number;
}

export interface RestaurantDailyOperatingResult {
  foodCost: number;
  laborCost: number;
  utilitiesCost: number;
  rentCost: number;
  suppliesCost: number;
  totalDailyOperatingCost: number;
  costPerMeal: number;
  operatingMargin: number;
}

export function calculateRestaurantDailyOperating(input: RestaurantDailyOperatingInput): RestaurantDailyOperatingResult {
  const foodCost = Math.round(input.mealsServed * input.foodCostPerMeal);

  const totalDailyOperatingCost = Math.round(
    foodCost +
    input.laborCostPerDay +
    input.utilitiesCostPerDay +
    input.rentPerDay +
    input.suppliesCostPerDay
  );

  const costPerMeal = Math.round(totalDailyOperatingCost / input.mealsServed);
  const operatingMargin = input.mealsServed > 0 ? Math.round((foodCost / totalDailyOperatingCost) * 100) : 0;

  return {
    foodCost,
    laborCost: input.laborCostPerDay,
    utilitiesCost: input.utilitiesCostPerDay,
    rentCost: input.rentPerDay,
    suppliesCost: input.suppliesCostPerDay,
    totalDailyOperatingCost,
    costPerMeal,
    operatingMargin,
  };
}

export const EXAMPLE_1 = calculateRestaurantDailyOperating({
  mealsServed: 150,
  foodCostPerMeal: 80,
  laborCostPerDay: 8000,
  utilitiesCostPerDay: 800,
  rentPerDay: 2000,
  suppliesCostPerDay: 500,
});

export const EXAMPLE_2 = calculateRestaurantDailyOperating({
  mealsServed: 250,
  foodCostPerMeal: 100,
  laborCostPerDay: 12000,
  utilitiesCostPerDay: 1200,
  rentPerDay: 3000,
  suppliesCostPerDay: 800,
});

export const EXAMPLE_3 = calculateRestaurantDailyOperating({
  mealsServed: 200,
  foodCostPerMeal: 90,
  laborCostPerDay: 10000,
  utilitiesCostPerDay: 1000,
  rentPerDay: 2500,
  suppliesCostPerDay: 600,
});
