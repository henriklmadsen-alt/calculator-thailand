export interface BakeryProductionInput {
  flourCost: number;
  sugarCost: number;
  butterEggsCost: number;
  flavoringsCost: number;
  packagingCost: number;
  loavesProducedPerBatch: number;
  batchesPerWeek: number;
}

export interface BakeryProductionResult {
  costPerBatch: number;
  costPerLoaf: number;
  costPerWeek: number;
  costPerMonth: number;
  costPerYear: number;
  profitPerLoaf: number;
  suggestedSellingPrice: number;
}

export function calculateBakeryProduction(input: BakeryProductionInput): BakeryProductionResult {
  const costPerBatch = Math.round(
    input.flourCost + input.sugarCost + input.butterEggsCost + input.flavoringsCost + input.packagingCost
  );
  const costPerLoaf = Math.round(costPerBatch / input.loavesProducedPerBatch);
  const costPerWeek = Math.round(costPerBatch * input.batchesPerWeek);
  const costPerMonth = Math.round(costPerWeek * 4.33);
  const costPerYear = Math.round(costPerMonth * 12);

  const suggestedSellingPrice = Math.round(costPerLoaf * 2.5); // 40% food cost
  const profitPerLoaf = Math.round(suggestedSellingPrice - costPerLoaf);

  return {
    costPerBatch,
    costPerLoaf,
    costPerWeek,
    costPerMonth,
    costPerYear,
    profitPerLoaf,
    suggestedSellingPrice,
  };
}

export const EXAMPLE_1 = calculateBakeryProduction({
  flourCost: 200,
  sugarCost: 100,
  butterEggsCost: 150,
  flavoringsCost: 50,
  packagingCost: 100,
  loavesProducedPerBatch: 20,
  batchesPerWeek: 5,
});

export const EXAMPLE_2 = calculateBakeryProduction({
  flourCost: 300,
  sugarCost: 150,
  butterEggsCost: 200,
  flavoringsCost: 80,
  packagingCost: 150,
  loavesProducedPerBatch: 30,
  batchesPerWeek: 7,
});

export const EXAMPLE_3 = calculateBakeryProduction({
  flourCost: 250,
  sugarCost: 120,
  butterEggsCost: 170,
  flavoringsCost: 60,
  packagingCost: 120,
  loavesProducedPerBatch: 25,
  batchesPerWeek: 6,
});
