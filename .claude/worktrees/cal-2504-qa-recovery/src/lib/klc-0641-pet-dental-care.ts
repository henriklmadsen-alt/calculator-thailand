// Pet dental care cost calculator (KLC-0641)
export type PetType = 'dog' | 'cat';
export interface PetDentalInput {
  petType: PetType;
  includeTeethCleaning: boolean;
  includeExtraction: boolean;
}
export interface PetDentalResult {
  cleaningCost: number;
  extractionCost: number;
  totalCost: number;
}
export function calculatePetDental(input: PetDentalInput): PetDentalResult {
  const baseCost = input.petType === 'dog' ? 2000 : 1500;
  const cleaningCost = input.includeTeethCleaning ? baseCost : 0;
  const extractionCost = input.includeExtraction ? 500 : 0;
  return {
    cleaningCost,
    extractionCost,
    totalCost: cleaningCost + extractionCost,
  };
}
