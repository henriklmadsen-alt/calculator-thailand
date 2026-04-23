export interface GardeningInput {
  seedsSaplingsCost: number;
  soilAndFertilizerCost: number;
  toolsCost: number;
  wateringSystemCost: number;
  pestControlCost: number;
  otherCost: number;
  plantCount: number;
  yearsToHarvest: number;
}

export interface GardeningResult {
  totalCost: number;
  costPerPlant: number;
  costPerYear: number;
  estimatedYield: string;
}

export function calculateGardeningCost(input: GardeningInput): GardeningResult {
  const totalCost = Math.round(
    input.seedsSaplingsCost + input.soilAndFertilizerCost + input.toolsCost +
    input.wateringSystemCost + input.pestControlCost + input.otherCost
  );
  const costPerPlant = input.plantCount > 0 ? Math.round(totalCost / input.plantCount) : 0;
  const costPerYear = input.yearsToHarvest > 0 ? Math.round(totalCost / input.yearsToHarvest) : totalCost;
  const estimatedYield = 'ขึ้นอยู่กับประเภทพืช อากาศ และการดูแล';

  return { totalCost, costPerPlant, costPerYear, estimatedYield };
}

export const EXAMPLE_1 = calculateGardeningCost({
  seedsSaplingsCost: 500,
  soilAndFertilizerCost: 600,
  toolsCost: 300,
  wateringSystemCost: 400,
  pestControlCost: 200,
  otherCost: 100,
  plantCount: 20,
  yearsToHarvest: 2,
});

export const EXAMPLE_2 = calculateGardeningCost({
  seedsSaplingsCost: 800,
  soilAndFertilizerCost: 1000,
  toolsCost: 400,
  wateringSystemCost: 600,
  pestControlCost: 300,
  otherCost: 200,
  plantCount: 40,
  yearsToHarvest: 1,
});

export const EXAMPLE_3 = calculateGardeningCost({
  seedsSaplingsCost: 650,
  soilAndFertilizerCost: 800,
  toolsCost: 350,
  wateringSystemCost: 500,
  pestControlCost: 250,
  otherCost: 150,
  plantCount: 30,
  yearsToHarvest: 1.5,
});
