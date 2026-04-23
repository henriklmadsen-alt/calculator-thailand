export interface FurnitureBudgetAllocatorInput {
  totalBudget: number;
  sofaPercent: number;
  diningPercent: number;
  bedroomPercent: number;
  accessoriesPercent: number;
}

export interface FurnitureBudgetAllocatorResult {
  totalBudget: number;
  sofaPercent: number;
  diningPercent: number;
  bedroomPercent: number;
  accessoriesPercent: number;
  result: number;
}

export function calculateFurnitureBudgetAllocator(input: FurnitureBudgetAllocatorInput): FurnitureBudgetAllocatorResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    totalBudget: input.totalBudget,
    sofaPercent: input.sofaPercent,
    diningPercent: input.diningPercent,
    bedroomPercent: input.bedroomPercent,
    accessoriesPercent: input.accessoriesPercent,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateFurnitureBudgetAllocator({
  totalBudget: 200000, sofaPercent: 35, diningPercent: 25, bedroomPercent: 30, accessoriesPercent: 10,
});

export const EXAMPLE_2 = calculateFurnitureBudgetAllocator({
  totalBudget: 350000, sofaPercent: 35, diningPercent: 25, bedroomPercent: 30, accessoriesPercent: 10,
});

export const EXAMPLE_3 = calculateFurnitureBudgetAllocator({
  totalBudget: 275000, sofaPercent: 35, diningPercent: 25, bedroomPercent: 30, accessoriesPercent: 10,
});

