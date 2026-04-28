// Cat litter monthly cost calculator (KLC-0644)
export type LitterType = 'budget' | 'standard' | 'premium';
export interface CatLitterInput {
  catCount: number;
  litterType: LitterType;
}
export interface CatLitterResult {
  costPerBag: number;
  bagsPerMonth: number;
  monthlyTotal: number;
  annualTotal: number;
}
const LITTER_COSTS: Record<LitterType, number> = {
  budget: 100,
  standard: 200,
  premium: 400,
};
export function calculateCatLitter(input: CatLitterInput): CatLitterResult {
  const costPerBag = LITTER_COSTS[input.litterType];
  const bagsPerMonth = input.catCount * 2;
  return {
    costPerBag,
    bagsPerMonth,
    monthlyTotal: costPerBag * bagsPerMonth,
    annualTotal: costPerBag * bagsPerMonth * 12,
  };
}
