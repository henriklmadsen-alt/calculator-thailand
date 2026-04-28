// Pet emergency fund calculator (KLC-0638)
export type PetType = 'dog' | 'cat' | 'other';
export interface PetEmergencyFundInput {
  petType: PetType;
  petCount: number;
}
export interface PetEmergencyFundResult {
  recommendedEmergencyFund: number;
  monthlyTarget: number;
  monthsToSave: number;
}
const EMERGENCY_FUND_PER_PET: Record<PetType, number> = {
  dog: 50000,
  cat: 40000,
  other: 30000,
};
export function calculatePetEmergencyFund(input: PetEmergencyFundInput): PetEmergencyFundResult {
  const total = EMERGENCY_FUND_PER_PET[input.petType] * input.petCount;
  return {
    recommendedEmergencyFund: total,
    monthlyTarget: Math.round(total / 12),
    monthsToSave: 12,
  };
}
