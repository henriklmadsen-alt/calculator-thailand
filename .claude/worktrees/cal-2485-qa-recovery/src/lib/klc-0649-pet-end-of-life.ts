// Pet end-of-life care cost calculator (KLC-0649)
export type ServiceType = 'euthanasia' | 'cremation-individual' | 'cremation-mass' | 'burial';
export interface PetEndOfLifeInput {
  petType: 'dog' | 'cat' | 'other';
  serviceType: ServiceType;
}
export interface PetEndOfLifeResult {
  serviceCost: number;
  memorialCost: number;
  totalCost: number;
}
const END_OF_LIFE_COSTS: Record<string, any> = {
  euthanasia: 800,
  'cremation-individual': 5000,
  'cremation-mass': 2000,
  burial: 3000,
};
export function calculatePetEndOfLife(input: PetEndOfLifeInput): PetEndOfLifeResult {
  const serviceCost = END_OF_LIFE_COSTS[input.serviceType] || 2000;
  const memorialCost = 500;
  return {
    serviceCost,
    memorialCost,
    totalCost: serviceCost + memorialCost,
  };
}
