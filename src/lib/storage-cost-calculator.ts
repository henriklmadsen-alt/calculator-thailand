export interface StorageInput {
  productKg: number;
  months: number;
}

export interface StorageResult {
  monthlyCost: number;
  totalCost: number;
  costPerKg: number;
}

export function calculateStorage(input: StorageInput): StorageResult {
  const costPerKgMonth = 2;
  const monthlyCost = input.productKg * costPerKgMonth;
  const totalCost = monthlyCost * input.months;
  const costPerKg = totalCost / input.productKg;

  return {
    monthlyCost: Math.round(monthlyCost),
    totalCost: Math.round(totalCost),
    costPerKg: Math.round(costPerKg * 100) / 100,
  };
}

export const EXAMPLE_1 = calculateStorage({ productKg: 5000, months: 6 });
export const EXAMPLE_2 = calculateStorage({ productKg: 10000, months: 3 });
