// Pet vaccination cost calculator (KLC-0629)
// Vaccination schedule and costs for dogs and cats in Thailand

export type PetType = 'dog' | 'cat';

export interface PetVaccinationInput {
  petType: PetType;
  age: 'puppy' | 'adult' | 'senior';
}

export interface PetVaccinationResult {
  rabiesVaccine: number;
  dhppDhleVaccine: number;
  additionalVaccines: number;
  totalAnnual: number;
}

const VACCINATION_COSTS: Record<PetType, Record<string, number>> = {
  dog: {
    rabies: 400,
    dhpp: 600,
    additional: 500,
  },
  cat: {
    rabies: 350,
    dhle: 550,
    additional: 400,
  },
};

export function calculatePetVaccination(input: PetVaccinationInput): PetVaccinationResult {
  const { petType, age } = input;

  const costs = VACCINATION_COSTS[petType];
  const baseVaccine = petType === 'dog' ? costs.dhpp : costs.dhle;
  const rabies = costs.rabies;
  const additional = costs.additional;

  // Puppies and kittens need more frequent vaccination
  const frequencyMultiplier = age === 'puppy' ? 3 : age === 'senior' ? 0.5 : 1;

  const totalAnnual = (rabies + baseVaccine + additional) * frequencyMultiplier;

  return {
    rabiesVaccine: rabies,
    dhppDhleVaccine: baseVaccine,
    additionalVaccines: additional,
    totalAnnual,
  };
}
