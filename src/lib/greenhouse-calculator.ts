export interface GreenhouseInput {
  squareMeters: number;
  years: number;
}

export interface GreenhouseResult {
  totalCost: number;
  yearlyIncome: number;
  totalIncome: number;
  profit: number;
}

export function calculateGreenhouse(input: GreenhouseInput): GreenhouseResult {
  const structureCost = input.squareMeters * 2000;
  const equipmentCost = input.squareMeters * 500;
  const yearlyMaintenance = input.squareMeters * 300;
  const totalCost = structureCost + equipmentCost + (yearlyMaintenance * input.years);
  const yearlyIncome = input.squareMeters * 800;
  const totalIncome = yearlyIncome * input.years;
  const profit = totalIncome - totalCost;

  return {
    totalCost: Math.round(totalCost),
    yearlyIncome: Math.round(yearlyIncome),
    totalIncome: Math.round(totalIncome),
    profit: Math.round(profit),
  };
}

export const EXAMPLE_1 = calculateGreenhouse({ squareMeters: 100, years: 5 });
export const EXAMPLE_2 = calculateGreenhouse({ squareMeters: 200, years: 10 });
