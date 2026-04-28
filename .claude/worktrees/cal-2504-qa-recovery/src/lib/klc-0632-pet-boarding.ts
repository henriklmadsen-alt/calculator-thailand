// Pet boarding cost calculator (KLC-0632)
export type PetType = 'dog' | 'cat';
export interface PetBoardingInput {
  petType: PetType;
  nights: number;
  accommodationType: 'standard' | 'luxury';
}
export interface PetBoardingResult {
  costPerNight: number;
  totalCost: number;
}
const BOARDING_COSTS: Record<PetType, Record<string, number>> = {
  dog: { standard: 300, luxury: 700 },
  cat: { standard: 250, luxury: 600 },
};
export function calculatePetBoarding(input: PetBoardingInput): PetBoardingResult {
  const { petType, nights, accommodationType } = input;
  const costPerNight = BOARDING_COSTS[petType][accommodationType];
  return { costPerNight, totalCost: costPerNight * nights };
}
