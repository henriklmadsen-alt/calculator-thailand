export interface AquacultureInput {
  pondSize: number;
  months: number;
  stockingDensity: number;
}

export interface AquacultureResult {
  totalCost: number;
  harvestYield: number;
  income: number;
  profit: number;
}

export function calculateAquaculture(input: AquacultureInput): AquacultureResult {
  const feedCost = input.pondSize * 800 * input.months;
  const medicineCost = input.pondSize * 100 * input.months;
  const laborCost = input.pondSize * 200 * input.months;
  const totalCost = feedCost + medicineCost + laborCost;
  const harvestYield = input.pondSize * 1500;
  const pricePerKg = 60;
  const income = harvestYield * pricePerKg;
  const profit = income - totalCost;

  return {
    totalCost: Math.round(totalCost),
    harvestYield: Math.round(harvestYield),
    income: Math.round(income),
    profit: Math.round(profit),
  };
}

export const EXAMPLE_1 = calculateAquaculture({ pondSize: 1, months: 6, stockingDensity: 50 });
export const EXAMPLE_2 = calculateAquaculture({ pondSize: 2, months: 8, stockingDensity: 50 });
