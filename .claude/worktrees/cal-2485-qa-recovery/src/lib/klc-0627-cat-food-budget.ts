// Cat food budget calculator (KLC-0627)
// Thai market prices for cat food 2569

export type FoodQuality = 'budget' | 'standard' | 'premium';

export interface CatFoodInput {
  catCount: number;
  foodQuality: FoodQuality;
}

export interface CatFoodResult {
  monthlyPerCat: number;
  totalMonthly: number;
  totalAnnual: number;
  catCount: number;
}

// Thai market prices (THB/month per cat) — 2569
const CAT_FOOD_PRICES: Record<FoodQuality, number> = {
  budget: 400,
  standard: 800,
  premium: 1500,
};

export function calculateCatFoodBudget(input: CatFoodInput): CatFoodResult {
  const { catCount, foodQuality } = input;

  if (catCount < 1 || catCount > 20 || !Number.isInteger(catCount)) {
    throw new Error('Cat count must be integer 1–20');
  }

  const monthlyPerCat = CAT_FOOD_PRICES[foodQuality];
  const totalMonthly = monthlyPerCat * catCount;
  const totalAnnual = totalMonthly * 12;

  return {
    monthlyPerCat,
    totalMonthly,
    totalAnnual,
    catCount,
  };
}
