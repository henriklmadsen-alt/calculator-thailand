export interface SewingInput {
  fabricCostPerMeter: number;
  metersNeeded: number;
  threadCost: number;
  buttonsCost: number;
  zippersCost: number;
  patternCost: number;
  elasticAndRibbonCost: number;
  otherNotionsCost: number;
  garmentLength: number; // cm
}

export interface SewingResult {
  totalCost: number;
  costPerGarment: number;
  suggestedSellingPrice: number;
  profitPerGarment: number;
  fabricCost: number;
  notionsCost: number;
}

export function calculateSewingFabricCost(input: SewingInput): SewingResult {
  const fabricCost = Math.round(input.fabricCostPerMeter * input.metersNeeded);
  const notionsCost = Math.round(
    input.threadCost + input.buttonsCost + input.zippersCost + input.patternCost + input.elasticAndRibbonCost + input.otherNotionsCost
  );
  const totalCost = Math.round(fabricCost + notionsCost);
  const costPerGarment = totalCost;
  const suggestedSellingPrice = Math.round(totalCost * 2.5);
  const profitPerGarment = Math.round(suggestedSellingPrice - costPerGarment);

  return {
    totalCost,
    costPerGarment,
    suggestedSellingPrice,
    profitPerGarment,
    fabricCost,
    notionsCost,
  };
}

export const EXAMPLE_1 = calculateSewingFabricCost({
  fabricCostPerMeter: 200,
  metersNeeded: 2.5,
  threadCost: 100,
  buttonsCost: 80,
  zippersCost: 60,
  patternCost: 100,
  elasticAndRibbonCost: 50,
  otherNotionsCost: 60,
  garmentLength: 60,
});

export const EXAMPLE_2 = calculateSewingFabricCost({
  fabricCostPerMeter: 350,
  metersNeeded: 3.5,
  threadCost: 150,
  buttonsCost: 120,
  zippersCost: 100,
  patternCost: 150,
  elasticAndRibbonCost: 80,
  otherNotionsCost: 100,
  garmentLength: 75,
});

export const EXAMPLE_3 = calculateSewingFabricCost({
  fabricCostPerMeter: 250,
  metersNeeded: 3,
  threadCost: 120,
  buttonsCost: 100,
  zippersCost: 80,
  patternCost: 120,
  elasticAndRibbonCost: 60,
  otherNotionsCost: 80,
  garmentLength: 65,
});
