// Puppy first year cost calculator (KLC-0635)
export type DogSize = 'small' | 'medium' | 'large';
export interface PuppyFirstYearInput {
  dogSize: DogSize;
}
export interface PuppyFirstYearResult {
  foodCost: number;
  vaccinationCost: number;
  trainingSupplies: number;
  veterinaryCare: number;
  totalFirstYear: number;
}
const PUPPY_COSTS: Record<DogSize, any> = {
  small: { food: 8000, vaccination: 3000, training: 2000, vet: 4000 },
  medium: { food: 12000, vaccination: 3500, training: 2500, vet: 5000 },
  large: { food: 18000, vaccination: 4000, training: 3000, vet: 6000 },
};
export function calculatePuppyFirstYear(input: PuppyFirstYearInput): PuppyFirstYearResult {
  const costs = PUPPY_COSTS[input.dogSize];
  return {
    foodCost: costs.food,
    vaccinationCost: costs.vaccination,
    trainingSupplies: costs.training,
    veterinaryCare: costs.vet,
    totalFirstYear: costs.food + costs.vaccination + costs.training + costs.vet,
  };
}
