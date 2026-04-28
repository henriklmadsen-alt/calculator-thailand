// Dog walking service cost calculator (KLC-0643)
export interface DogWalkingInput {
  walksPerWeek: number;
  serviceType: 'standard' | 'premium';
}
export interface DogWalkingResult {
  costPerWalk: number;
  costPerWeek: number;
  costPerMonth: number;
  costPerYear: number;
}
const WALK_COSTS: Record<string, number> = {
  standard: 150,
  premium: 250,
};
export function calculateDogWalking(input: DogWalkingInput): DogWalkingResult {
  const costPerWalk = WALK_COSTS[input.serviceType];
  return {
    costPerWalk,
    costPerWeek: costPerWalk * input.walksPerWeek,
    costPerMonth: costPerWalk * input.walksPerWeek * 4,
    costPerYear: costPerWalk * input.walksPerWeek * 52,
  };
}
