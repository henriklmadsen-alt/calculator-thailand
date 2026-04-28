/**
 * Thai Weight Loss Program Cost Calculator (คำนวณค่าโปรแกรมลดน้ำหนัก)
 *
 * Sources:
 * - Weight loss program providers in Thailand
 * - Medical weight loss clinic rates
 * - Nutritionist consultation fees
 */

export type ProgramType = 'diy' | 'nutrition' | 'clinic' | 'surgery' | 'holistic';

export interface WeightLossProgramInput {
  programType: ProgramType;
  targetWeightLoss: number; // kg
  currentWeight: number;
  hasInsurance: boolean;
}

export interface WeightLossProgramResult {
  programCost: number;
  consultationCost: number;
  foodAndSupplements: number;
  monitoringCost: number;
  estimatedTotalCost: number;
  costPerKgLoss: number;
  timelinMonths: number;
  insuranceCoverage: number;
  outOfPocket: number;
  successRate: string;
  notes: string;
}

function getProgramCost(programType: ProgramType): number {
  const costs: Record<ProgramType, number> = {
    diy: 3000, // Self-guided with online resources
    nutrition: 10000, // Nutritionist 3-month program
    clinic: 25000, // Medical clinic program
    surgery: 200000, // Weight loss surgery
    holistic: 15000, // Holistic wellness program
  };

  return costs[programType];
}

export function calculateWeightLossProgramCost(
  input: WeightLossProgramInput,
): WeightLossProgramResult {
  const {
    programType,
    targetWeightLoss,
    currentWeight,
    hasInsurance,
  } = input;

  const programCost = getProgramCost(programType);

  // Additional costs
  const consultationCost = programType === 'diy' ? 0 : 5000;
  const foodAndSupplements = programType === 'diy' ? 2000 : 5000;
  const monitoringCost = programType === 'clinic' ? 5000 : 2000;

  const estimatedTotalCost =
    programCost + consultationCost + foodAndSupplements + monitoringCost;

  const costPerKgLoss = Math.round(estimatedTotalCost / Math.max(targetWeightLoss, 1));

  // Timeline varies by program and weight loss goal
  const timelineMonths =
    programType === 'surgery'
      ? 3
      : programType === 'clinic'
        ? 6
        : programType === 'nutrition'
          ? 4
          : 8;

  // Insurance typically covers 50% for medically necessary weight loss
  const insuranceRate = hasInsurance && currentWeight > 30
    ? 0.5
    : 0; // Only if BMI > 30
  const insuranceCoverage = Math.round(estimatedTotalCost * insuranceRate);
  const outOfPocket = estimatedTotalCost - insuranceCoverage;

  const successRate =
    programType === 'surgery'
      ? '70-80% lasting weight loss'
      : programType === 'clinic'
        ? '50-70% maintain weight loss'
        : programType === 'nutrition'
          ? '40-60% maintain weight loss'
          : '20-30% maintain weight loss';

  const notes =
    programType === 'surgery'
      ? 'Consider as last resort, requires lifestyle changes'
      : 'Combines diet, exercise, and behavioral changes for best results';

  return {
    programCost,
    consultationCost,
    foodAndSupplements,
    monitoringCost,
    estimatedTotalCost,
    costPerKgLoss,
    timelinMonths,
    insuranceCoverage,
    outOfPocket,
    successRate,
    notes,
  };
}
