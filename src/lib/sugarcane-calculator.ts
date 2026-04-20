export interface SugarcaneInput {
  rai: number;
  irrigated: boolean;
}

export interface SugarcaneResult {
  totalCost: number;
  yield_: number;
  income: number;
  profit: number;
}

export function calculateSugarcane(input: SugarcaneInput): SugarcaneResult {
  const baseCost = input.rai * 10000;
  const waterCost = input.irrigated ? input.rai * 800 : 0;
  const totalCost = baseCost + waterCost;
  const yieldPerRai = 5000;
  const yield_ = input.rai * yieldPerRai;
  const pricePerTon = 850;
  const income = (yield_ / 1000) * pricePerTon;
  const profit = income - totalCost;

  return {
    totalCost: Math.round(totalCost),
    yield_: Math.round(yield_),
    income: Math.round(income),
    profit: Math.round(profit),
  };
}

export const EXAMPLE_1 = calculateSugarcane({ rai: 10, irrigated: true });
export const EXAMPLE_2 = calculateSugarcane({ rai: 20, irrigated: false });
