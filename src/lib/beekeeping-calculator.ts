export interface BeekeepingInput {
  hives: number;
  months: number;
}

export interface BeekeepingResult {
  totalCost: number;
  honeyYield: number;
  income: number;
  profit: number;
}

export function calculateBeekeeping(input: BeekeepingInput): BeekeepingResult {
  const feedCost = input.hives * 500 * input.months;
  const maintenanceCost = input.hives * 300 * input.months;
  const healthCost = input.hives * 200 * input.months;
  const totalCost = feedCost + maintenanceCost + healthCost;
  const honeyPerHive = 15;
  const honeyYield = input.hives * honeyPerHive;
  const pricePerKg = 200;
  const income = honeyYield * pricePerKg;
  const profit = income - totalCost;

  return {
    totalCost: Math.round(totalCost),
    honeyYield: Math.round(honeyYield),
    income: Math.round(income),
    profit: Math.round(profit),
  };
}

export const EXAMPLE_1 = calculateBeekeeping({ hives: 10, months: 12 });
export const EXAMPLE_2 = calculateBeekeeping({ hives: 20, months: 12 });
