export interface MushroomInput {
  spawnKgNeeded: number;
  seasonDays: number;
  harvestKgPerSeason: number;
  pricePerKg: number;
}

export interface MushroomResult {
  totalCost: number;
  harvestIncome: number;
  profit: number;
  roiPercentage: number;
}

export function calculateMushroom(input: MushroomInput): MushroomResult {
  const spawnCost = input.spawnKgNeeded * 150;
  const mediumCost = input.spawnKgNeeded * 200;
  const laborCost = (input.seasonDays / 30) * 5000;
  const totalCost = spawnCost + mediumCost + laborCost;
  const income = input.harvestKgPerSeason * input.pricePerKg;
  const profit = income - totalCost;
  const roi = (profit / totalCost) * 100;

  return {
    totalCost: Math.round(totalCost),
    harvestIncome: Math.round(income),
    profit: Math.round(profit),
    roiPercentage: Math.round(roi * 10) / 10,
  };
}

export const EXAMPLE_1 = calculateMushroom({ spawnKgNeeded: 50, seasonDays: 60, harvestKgPerSeason: 250, pricePerKg: 40 });
export const EXAMPLE_2 = calculateMushroom({ spawnKgNeeded: 100, seasonDays: 90, harvestKgPerSeason: 500, pricePerKg: 45 });
export const EXAMPLE_3 = calculateMushroom({ spawnKgNeeded: 150, seasonDays: 120, harvestKgPerSeason: 750, pricePerKg: 50 });
