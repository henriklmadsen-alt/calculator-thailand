export interface RestaurantMenuInput {
  dishName: string;
  mainIngredientCost: number;
  vegetablesCost: number;
  seasoningsCost: number;
  oilButterCost: number;
  garnishCost: number;
  servingSize: number;
}

export interface RestaurantMenuResult {
  totalIngredientsPerDish: number;
  costPerServing: number;
  foodCostPercentage: number;
  suggestedSellingPrice: number;
  profitPerDish: number;
}

export function calculateRestaurantMenuCost(input: RestaurantMenuInput): RestaurantMenuResult {
  const totalIngredients = Math.round(
    input.mainIngredientCost +
    input.vegetablesCost +
    input.seasoningsCost +
    input.oilButterCost +
    input.garnishCost
  );

  const costPerServing = Math.round(totalIngredients / input.servingSize);
  const suggestedSellingPrice = Math.round(costPerServing * 3); // 33% food cost
  const foodCostPercentage = Math.round((costPerServing / suggestedSellingPrice) * 100);
  const profitPerDish = Math.round(suggestedSellingPrice - costPerServing);

  return {
    totalIngredientsPerDish: totalIngredients,
    costPerServing,
    foodCostPercentage,
    suggestedSellingPrice,
    profitPerDish,
  };
}

export const EXAMPLE_1 = calculateRestaurantMenuCost({
  dishName: 'ผัดไทย',
  mainIngredientCost: 40,
  vegetablesCost: 30,
  seasoningsCost: 15,
  oilButterCost: 10,
  garnishCost: 5,
  servingSize: 1,
});

export const EXAMPLE_2 = calculateRestaurantMenuCost({
  dishName: 'แกงกะหรี่',
  mainIngredientCost: 60,
  vegetablesCost: 40,
  seasoningsCost: 20,
  oilButterCost: 15,
  garnishCost: 10,
  servingSize: 1,
});

export const EXAMPLE_3 = calculateRestaurantMenuCost({
  dishName: 'ข้าวหมูแดง',
  mainIngredientCost: 35,
  vegetablesCost: 15,
  seasoningsCost: 10,
  oilButterCost: 8,
  garnishCost: 5,
  servingSize: 1,
});
