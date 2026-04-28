export interface PlantCareInput {
  potsCost: number;
  soilCost: number;
  fertilizerCost: number;
  pestControlCost: number;
  plantFoodCost: number;
  toolsCost: number;
  decorativeCost: number;
  otherCost: number;
  monthlyExpense: number;
}

export interface PlantCareResult {
  totalInitialCost: number;
  monthlyRecurringCost: number;
  yearlyTotalCost: number;
  costPerPlant: number;
}

export function calculatePlantCareSupplies(input: PlantCareInput): PlantCareResult {
  const totalInitialCost = Math.round(
    input.potsCost + input.soilCost + input.fertilizerCost + input.pestControlCost +
    input.plantFoodCost + input.toolsCost + input.decorativeCost + input.otherCost
  );
  const monthlyRecurringCost = Math.round(input.monthlyExpense);
  const yearlyTotalCost = Math.round(totalInitialCost + (monthlyRecurringCost * 12));
  const costPerPlant = Math.round(totalInitialCost / 10); // assume 10 plants

  return { totalInitialCost, monthlyRecurringCost, yearlyTotalCost, costPerPlant };
}

export const EXAMPLE_1 = calculatePlantCareSupplies({
  potsCost: 500,
  soilCost: 300,
  fertilizerCost: 200,
  pestControlCost: 150,
  plantFoodCost: 200,
  toolsCost: 200,
  decorativeCost: 100,
  otherCost: 100,
  monthlyExpense: 200,
});

export const EXAMPLE_2 = calculatePlantCareSupplies({
  potsCost: 800,
  soilCost: 500,
  fertilizerCost: 300,
  pestControlCost: 250,
  plantFoodCost: 300,
  toolsCost: 300,
  decorativeCost: 200,
  otherCost: 200,
  monthlyExpense: 300,
});

export const EXAMPLE_3 = calculatePlantCareSupplies({
  potsCost: 600,
  soilCost: 400,
  fertilizerCost: 250,
  pestControlCost: 200,
  plantFoodCost: 250,
  toolsCost: 250,
  decorativeCost: 150,
  otherCost: 150,
  monthlyExpense: 250,
});
