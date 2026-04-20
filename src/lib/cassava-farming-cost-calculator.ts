export interface CassavaFarmingInput {
  raiSize: number;
  isIrrigated: boolean;
  includeLabor: boolean;
}

export interface CassavaFarmingResult {
  raiSize: number;
  totalCost: number;
  yield: number;
  income: number;
  profit: number;
  margin: number;
}

export function calculateCassavaFarmingCost(input: CassavaFarmingInput): CassavaFarmingResult {
  const baseCost = input.raiSize * 12000;
  const waterCost = input.isIrrigated ? input.raiSize * 500 : 0;
  const laborCost = input.includeLabor ? input.raiSize * 3000 : 0;
  const totalCost = baseCost + waterCost + laborCost;

  const yield_ = input.raiSize * 4000; // kg/rai
  const pricePerKg = 3.5; // THB/kg
  const income = yield_ * pricePerKg;
  const profit = income - totalCost;
  const margin = income > 0 ? (profit / income) * 100 : 0;

  return {
    raiSize: input.raiSize,
    totalCost: Math.round(totalCost),
    yield: Math.round(yield_),
    income: Math.round(income),
    profit: Math.round(profit),
    margin: Math.round(margin * 10) / 10,
  };
}

export const EXAMPLE_1 = calculateCassavaFarmingCost({ raiSize: 10, isIrrigated: true, includeLabor: false });
export const EXAMPLE_2 = calculateCassavaFarmingCost({ raiSize: 20, isIrrigated: true, includeLabor: true });
export const EXAMPLE_3 = calculateCassavaFarmingCost({ raiSize: 30, isIrrigated: false, includeLabor: false });
