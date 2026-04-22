export interface KnittingInput {
  yarnCostPerSpool: number;
  totalSpoolsNeeded: number;
  needlesCost: number;
  patternBookCost: number;
  buttonsCost: number;
  otherAccessoriesCost: number;
  garmentEstimatedSize: number; // ตร.ซม.
}

export interface KnittingResult {
  totalCost: number;
  costPerGarment: number;
  suggestedSellingPrice: number;
  profitPerGarment: number;
  yarnCost: number;
  othersCost: number;
}

export function calculateKnittingYarnCost(input: KnittingInput): KnittingResult {
  const yarnCost = Math.round(input.yarnCostPerSpool * input.totalSpoolsNeeded);
  const othersCost = Math.round(
    input.needlesCost + input.patternBookCost + input.buttonsCost + input.otherAccessoriesCost
  );
  const totalCost = Math.round(yarnCost + othersCost);
  const costPerGarment = totalCost;
  const suggestedSellingPrice = Math.round(totalCost * 2.5); // 150% markup
  const profitPerGarment = Math.round(suggestedSellingPrice - costPerGarment);

  return {
    totalCost,
    costPerGarment,
    suggestedSellingPrice,
    profitPerGarment,
    yarnCost,
    othersCost,
  };
}

export const EXAMPLE_1 = calculateKnittingYarnCost({
  yarnCostPerSpool: 250,
  totalSpoolsNeeded: 8,
  needlesCost: 150,
  patternBookCost: 100,
  buttonsCost: 50,
  otherAccessoriesCost: 100,
  garmentEstimatedSize: 5000,
});

export const EXAMPLE_2 = calculateKnittingYarnCost({
  yarnCostPerSpool: 350,
  totalSpoolsNeeded: 12,
  needlesCost: 250,
  patternBookCost: 150,
  buttonsCost: 100,
  otherAccessoriesCost: 150,
  garmentEstimatedSize: 8000,
});

export const EXAMPLE_3 = calculateKnittingYarnCost({
  yarnCostPerSpool: 300,
  totalSpoolsNeeded: 10,
  needlesCost: 200,
  patternBookCost: 120,
  buttonsCost: 80,
  otherAccessoriesCost: 120,
  garmentEstimatedSize: 6000,
});
