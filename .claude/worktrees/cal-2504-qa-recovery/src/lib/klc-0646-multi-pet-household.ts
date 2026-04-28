// Multi-pet household cost calculator (KLC-0646)
export interface MultiPetInput {
  dogCount: number;
  catCount: number;
  otherPetCount: number;
}
export interface MultiPetResult {
  dogCostMonthly: number;
  catCostMonthly: number;
  otherCostMonthly: number;
  totalMonthly: number;
  totalAnnual: number;
}
export function calculateMultiPetHousehold(input: MultiPetInput): MultiPetResult {
  const dogCostMonthly = input.dogCount * 3000;
  const catCostMonthly = input.catCount * 2000;
  const otherCostMonthly = input.otherPetCount * 1500;
  const totalMonthly = dogCostMonthly + catCostMonthly + otherCostMonthly;
  return {
    dogCostMonthly,
    catCostMonthly,
    otherCostMonthly,
    totalMonthly,
    totalAnnual: totalMonthly * 12,
  };
}
