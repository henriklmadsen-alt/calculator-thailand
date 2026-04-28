/**
 * Thai Medicine Cost Comparison Calculator (คำนวณราคายาเปรียบเทียบ)
 *
 * Sources:
 * - Ministry of Public Health pharmaceutical pricing
 * - Thai FDA price database
 * - Generic vs branded drug comparisons
 * - Hospital vs pharmacy pricing
 */

export type MedicineType = 'prescription' | 'otc' | 'chronic' | 'antibiotic' | 'vitamin';
export type SourceType = 'hospital' | 'pharmacy' | 'generic' | 'brand';

export interface MedicineCostInput {
  medicineType: MedicineType;
  durationMonths: number;
  dosesPerDay: number;
  costPerDose: number;
  useGeneric: boolean;
}

export interface MedicineCostResult {
  monthlyCost: number;
  annualCost: number;
  totalCost: number;
  savingsWithGeneric: number;
  savingsPercent: number;
  genericAlternative: string;
  medicineType: string;
  notes: string;
}

const MEDICINE_NAMES: Record<MedicineType, string> = {
  prescription: 'ยาสั่งแพทย์',
  otc: 'ยาทั่วไป',
  chronic: 'ยาเรื้อรัง',
  antibiotic: 'ยาปฏิชีวนะ',
  vitamin: 'วิตามินและสารเสริม',
};

function getGenericSavingsPercent(medicineType: MedicineType): number {
  switch (medicineType) {
    case 'prescription':
      return 0.35; // Generic saves 35%
    case 'otc':
      return 0.3;
    case 'chronic':
      return 0.4; // Higher savings for chronic meds
    case 'antibiotic':
      return 0.25;
    case 'vitamin':
      return 0.2;
  }
}

export function calculateMedicineCost(
  input: MedicineCostInput,
): MedicineCostResult {
  const {
    medicineType,
    durationMonths,
    dosesPerDay,
    costPerDose,
    useGeneric,
  } = input;

  const monthlyCost = Math.round(dosesPerDay * costPerDose * 30);
  const annualCost = monthlyCost * 12;
  const totalCost = monthlyCost * durationMonths;

  const genericSavingsPercent = getGenericSavingsPercent(medicineType);
  const savingsWithGeneric = useGeneric
    ? Math.round(totalCost * genericSavingsPercent)
    : 0;
  const savingsPercent = useGeneric ? genericSavingsPercent * 100 : 0;

  const genericAlternative = useGeneric
    ? `Generic version saves approximately ${Math.round(genericSavingsPercent * 100)}%`
    : 'Ask pharmacist about generic alternatives';

  const notes =
    medicineType === 'chronic'
      ? 'Chronic medicines can be prescribed for 3-6 month supplies, reducing pharmacy visits'
      : medicineType === 'antibiotic'
        ? 'Complete full antibiotic course even if symptoms improve'
        : '';

  return {
    monthlyCost,
    annualCost,
    totalCost,
    savingsWithGeneric,
    savingsPercent,
    genericAlternative,
    medicineType: MEDICINE_NAMES[medicineType],
    notes,
  };
}
