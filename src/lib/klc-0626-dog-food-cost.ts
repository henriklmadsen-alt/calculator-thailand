// Dog food cost calculator (KLC-0626)
// Thai market prices for dog food 2569 — estimated monthly and annual cost

export type DogSize = 'small' | 'medium' | 'large';
export type FoodQuality = 'budget' | 'standard' | 'premium';

export interface DogFoodInput {
  dogCount: number;
  dogSize: DogSize;
  foodQuality: FoodQuality;
}

export interface DogFoodResult {
  monthlyPerDog: number;
  totalMonthly: number;
  totalAnnual: number;
  dogCount: number;
}

// Thai market prices (THB/month per dog) — 2569
const DOG_FOOD_PRICES: Record<DogSize, Record<FoodQuality, number>> = {
  small: {
    budget: 600,
    standard: 1200,
    premium: 2200,
  },
  medium: {
    budget: 1000,
    standard: 1800,
    premium: 3000,
  },
  large: {
    budget: 1500,
    standard: 2500,
    premium: 4200,
  },
};

export function calculateDogFoodCost(input: DogFoodInput): DogFoodResult {
  const { dogCount, dogSize, foodQuality } = input;

  if (dogCount < 1 || dogCount > 20 || !Number.isInteger(dogCount)) {
    throw new Error('Dog count must be integer 1–20');
  }

  const monthlyPerDog = DOG_FOOD_PRICES[dogSize][foodQuality];
  const totalMonthly = monthlyPerDog * dogCount;
  const totalAnnual = totalMonthly * 12;

  return {
    monthlyPerDog,
    totalMonthly,
    totalAnnual,
    dogCount,
  };
}
