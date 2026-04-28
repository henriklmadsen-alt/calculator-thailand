/**
 * Thai Traditional Medicine Cost Calculator (คำนวณค่ากำปั่นยาแผนไทย)
 *
 * Sources:
 * - Thai traditional medicine practitioners
 * - Ministry of Health traditional medicine standards
 * - Traditional Thai medicine clinic fees
 */

export type ThaiMedicineType =
  | 'massage'
  | 'herbal'
  | 'acupuncture'
  | 'sauna'
  | 'comprehensive';

export interface ThaiTraditionalMedicineInput {
  medicineType: ThaiMedicineType;
  sessionsPerMonth: number;
  durationMonths: number;
  practitionerType: 'government' | 'private';
}

export interface ThaiTraditionalMedicineResult {
  costPerSession: number;
  monthlyCost: number;
  totalCost: number;
  estimatedCureDuration: number;
  governmentSubsidy: number;
  outOfPocket: number;
  medicineType: string;
  healthBenefit: string;
  notes: string;
}

function getCostPerSession(
  medicineType: ThaiMedicineType,
  practitionerType: 'government' | 'private',
): number {
  const costs = practitionerType === 'government'
    ? {
        massage: 300,
        herbal: 400,
        acupuncture: 350,
        sauna: 200,
        comprehensive: 600,
      }
    : {
        massage: 800,
        herbal: 1000,
        acupuncture: 900,
        sauna: 600,
        comprehensive: 1500,
      };

  return costs[medicineType];
}

export function calculateThaiTraditionalMedicineCost(
  input: ThaiTraditionalMedicineInput,
): ThaiTraditionalMedicineResult {
  const {
    medicineType,
    sessionsPerMonth,
    durationMonths,
    practitionerType,
  } = input;

  const costPerSession = getCostPerSession(medicineType, practitionerType);
  const monthlyCost = costPerSession * sessionsPerMonth;
  const totalCost = monthlyCost * durationMonths;

  // Typical cure duration varies by condition
  const estimatedCureDuration =
    medicineType === 'massage'
      ? 4
      : medicineType === 'herbal'
        ? 8
        : medicineType === 'acupuncture'
          ? 6
          : medicineType === 'sauna'
            ? 2
            : 6;

  // Thai government supports traditional medicine
  const governmentSubsidy = practitionerType === 'government'
    ? Math.round(totalCost * 0.3)
    : 0;
  const outOfPocket = totalCost - governmentSubsidy;

  const healthBenefit =
    medicineType === 'massage'
      ? 'Improves circulation, reduces muscle pain'
      : medicineType === 'herbal'
        ? 'Balances body constitution, boosts immunity'
        : medicineType === 'acupuncture'
          ? 'Relieves chronic pain, improves energy'
          : 'Detoxification, muscle relaxation';

  const notes =
    medicineType === 'herbal'
      ? 'May need 2-3 months for full effects, continue for 3-6 months'
      : 'Traditional medicine complements modern medicine';

  return {
    costPerSession,
    monthlyCost,
    totalCost,
    estimatedCureDuration,
    governmentSubsidy,
    outOfPocket,
    medicineType: `ยาแผนไทย: ${medicineType}`,
    healthBenefit,
    notes,
  };
}
