export interface HarvestLaborInput {
  raiSize: number;
  laborerCount: number;
  daysToHarvest: number;
  dailyWage: number;
}

export interface HarvestLaborResult {
  raiSize: number;
  laborerCount: number;
  daysToHarvest: number;
  dailyWage: number;
  totalLaborCost: number;
  costPerRai: number;
}

export function calculateHarvestLaborCost(input: HarvestLaborInput): HarvestLaborResult {
  const totalCost = input.laborerCount * input.daysToHarvest * input.dailyWage;
  const costPerRai = totalCost / input.raiSize;

  return {
    raiSize: input.raiSize,
    laborerCount: input.laborerCount,
    daysToHarvest: input.daysToHarvest,
    dailyWage: input.dailyWage,
    totalLaborCost: Math.round(totalCost),
    costPerRai: Math.round(costPerRai),
  };
}

export const EXAMPLE_1 = calculateHarvestLaborCost({ raiSize: 10, laborerCount: 5, daysToHarvest: 3, dailyWage: 300 });
export const EXAMPLE_2 = calculateHarvestLaborCost({ raiSize: 20, laborerCount: 10, daysToHarvest: 4, dailyWage: 350 });
export const EXAMPLE_3 = calculateHarvestLaborCost({ raiSize: 30, laborerCount: 15, daysToHarvest: 3, dailyWage: 300 });
