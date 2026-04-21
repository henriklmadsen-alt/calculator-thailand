// Dog grooming cost calculator (KLC-0631)
export type DogSize = 'small' | 'medium' | 'large';
export interface DogGroomingInput {
  dogSize: DogSize;
  frequency: number; // times per year
}
export interface DogGroomingResult {
  costPerSession: number;
  totalAnnual: number;
  monthlyAverage: number;
}
const GROOMING_COSTS: Record<DogSize, number> = {
  small: 400,
  medium: 700,
  large: 1200,
};
export function calculateDogGrooming(input: DogGroomingInput): DogGroomingResult {
  const { dogSize, frequency } = input;
  const costPerSession = GROOMING_COSTS[dogSize];
  const totalAnnual = costPerSession * frequency;
  return { costPerSession, totalAnnual, monthlyAverage: totalAnnual / 12 };
}
