export interface TobaccoInput {
  rai: number;
  seasons: number;
}

export interface TobaccoResult {
  totalCost: number;
  yield_: number;
  income: number;
  profit: number;
}

export function calculateTobacco(input: TobaccoInput): TobaccoResult {
  const seedCost = input.rai * 1500;
  const laborCost = input.rai * 8000 * input.seasons;
  const dryCost = input.rai * 2000 * input.seasons;
  const totalCost = seedCost + laborCost + dryCost;
  const yieldPerRai = 800;
  const yield_ = input.rai * yieldPerRai;
  const pricePerKg = 45;
  const income = yield_ * pricePerKg;
  const profit = income - totalCost;

  return {
    totalCost: Math.round(totalCost),
    yield_: Math.round(yield_),
    income: Math.round(income),
    profit: Math.round(profit),
  };
}

export const EXAMPLE_1 = calculateTobacco({ rai: 5, seasons: 1 });
export const EXAMPLE_2 = calculateTobacco({ rai: 10, seasons: 2 });
