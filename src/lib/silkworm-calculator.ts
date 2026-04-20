export interface SilkwormInput {
  batches: number;
  months: number;
}

export interface SilkwormResult {
  totalCost: number;
  silkYield: number;
  income: number;
  profit: number;
}

export function calculateSilkworm(input: SilkwormInput): SilkwormResult {
  const leafCost = input.batches * 2000 * input.months;
  const maintenanceCost = input.batches * 1000 * input.months;
  const equipmentCost = input.batches * 500 * input.months;
  const totalCost = leafCost + maintenanceCost + equipmentCost;
  const silkPerBatch = 2;
  const silkYield = input.batches * silkPerBatch;
  const pricePerKg = 500;
  const income = silkYield * pricePerKg;
  const profit = income - totalCost;

  return {
    totalCost: Math.round(totalCost),
    silkYield: Math.round(silkYield),
    income: Math.round(income),
    profit: Math.round(profit),
  };
}

export const EXAMPLE_1 = calculateSilkworm({ batches: 10, months: 6 });
export const EXAMPLE_2 = calculateSilkworm({ batches: 20, months: 6 });
