// Pet toys and supplies budget calculator (KLC-0645)
export interface PetToysSuppliesInput {
  petCount: number;
  budget: 'budget' | 'standard' | 'premium';
}
export interface PetToysSuppliesResult {
  monthlyPerPet: number;
  totalMonthly: number;
  totalAnnual: number;
}
const MONTHLY_COSTS: Record<string, number> = {
  budget: 200,
  standard: 400,
  premium: 700,
};
export function calculatePetToysSupplies(input: PetToysSuppliesInput): PetToysSuppliesResult {
  const monthlyPerPet = MONTHLY_COSTS[input.budget];
  const totalMonthly = monthlyPerPet * input.petCount;
  return {
    monthlyPerPet,
    totalMonthly,
    totalAnnual: totalMonthly * 12,
  };
}
