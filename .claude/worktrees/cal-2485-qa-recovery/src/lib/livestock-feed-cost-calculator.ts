/**
 * Thai Livestock Feed Cost Calculator
 * Sources: Department of Livestock Development, Thai Agricultural Standards
 */

export type AnimalType = 'cattle' | 'pig' | 'chicken';

export interface LivestockFeedInput {
  animalType: AnimalType;
  numberOfAnimals: number;
  daysInMonth: number;
}

export interface LivestockFeedResult {
  animalType: AnimalType;
  animalTypeName: string;
  numberOfAnimals: number;
  daysInMonth: number;
  dailyCostPerAnimal: number;
  monthlyCostPerAnimal: number;
  monthlyTotalCost: number;
  yearlyCostPerAnimal: number;
  yearlyTotalCost: number;
}

const ANIMAL_NAMES: Record<AnimalType, string> = {
  cattle: 'วัว',
  pig: 'หมู',
  chicken: 'ไก่',
};

function getDailyCost(animalType: AnimalType): number {
  // Estimated daily feed costs in THB
  const costs: Record<AnimalType, number> = {
    cattle: 120, // hay + grain + supplements
    pig: 25, // swill + grain + supplements
    chicken: 3, // grain + supplements
  };
  return costs[animalType];
}

export function calculateLivestockFeedCost(input: LivestockFeedInput): LivestockFeedResult {
  const dailyCost = getDailyCost(input.animalType);
  const monthlyCost = dailyCost * input.daysInMonth;
  const monthlyTotal = monthlyCost * input.numberOfAnimals;
  const yearlyCost = monthlyCost * 30; // Approximate 30 days/month
  const yearlyTotal = yearlyCost * input.numberOfAnimals;

  return {
    animalType: input.animalType,
    animalTypeName: ANIMAL_NAMES[input.animalType],
    numberOfAnimals: input.numberOfAnimals,
    daysInMonth: input.daysInMonth,
    dailyCostPerAnimal: Math.round(dailyCost),
    monthlyCostPerAnimal: Math.round(monthlyCost),
    monthlyTotalCost: Math.round(monthlyTotal),
    yearlyCostPerAnimal: Math.round(yearlyCost),
    yearlyTotalCost: Math.round(yearlyTotal),
  };
}

export const EXAMPLE_1 = calculateLivestockFeedCost({
  animalType: 'cattle',
  numberOfAnimals: 10,
  daysInMonth: 30,
});

export const EXAMPLE_2 = calculateLivestockFeedCost({
  animalType: 'pig',
  numberOfAnimals: 20,
  daysInMonth: 30,
});

export const EXAMPLE_3 = calculateLivestockFeedCost({
  animalType: 'chicken',
  numberOfAnimals: 100,
  daysInMonth: 30,
});
