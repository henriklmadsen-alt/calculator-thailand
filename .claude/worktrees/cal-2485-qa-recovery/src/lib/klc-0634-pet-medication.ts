// Pet medication cost calculator (KLC-0634)
export type MedicationType = 'antibiotic' | 'antiparasitic' | 'pain-relief' | 'chronic';
export interface PetMedicationInput {
  medicationType: MedicationType;
  durationDays: number;
}
export interface PetMedicationResult {
  costPerDose: number;
  totalCost: number;
}
const MEDICATION_COSTS: Record<MedicationType, number> = {
  antibiotic: 150,
  antiparasitic: 300,
  'pain-relief': 200,
  chronic: 400,
};
export function calculatePetMedication(input: PetMedicationInput): PetMedicationResult {
  const { medicationType, durationDays } = input;
  const costPerDose = MEDICATION_COSTS[medicationType];
  return { costPerDose, totalCost: costPerDose * (durationDays / 10) };
}
