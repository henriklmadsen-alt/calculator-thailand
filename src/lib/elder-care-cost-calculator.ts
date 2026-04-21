/**
 * Thai Elder Care Cost Calculator (คำนวณค่าดูแลผู้สูงอายุ)
 *
 * Sources:
 * - Thai Nursing Home Association
 * - Ministry of Social Development elderly care standards
 * - Home care service providers
 */

export type CareType =
  | 'homecare'
  | 'daycare'
  | 'nursingHome'
  | 'hospital'
  | 'hospice';

export interface ElderCareInput {
  careType: CareType;
  ageYears: number;
  hoursPerDay: number;
  daysPerWeek: number;
  hasHealthInsurance: boolean;
}

export interface ElderCareResult {
  hourlyCost: number;
  monthlyCost: number;
  annualCost: number;
  medicalCost: number;
  totalAnnualCost: number;
  insuranceCoverage: number;
  outOfPocket: number;
  careType: string;
  recommendedLevel: string;
}

function getHourlyCost(careType: CareType): number {
  const costs: Record<CareType, number> = {
    homecare: 200,
    daycare: 300,
    nursingHome: 400,
    hospital: 600,
    hospice: 500,
  };

  return costs[careType];
}

function getMedicalCost(careType: CareType, ageYears: number): number {
  const baseCost = ageYears > 80 ? 5000 : 3000;
  const multiplier: Record<CareType, number> = {
    homecare: 1,
    daycare: 1.2,
    nursingHome: 1.5,
    hospital: 3,
    hospice: 2,
  };

  return baseCost * multiplier[careType];
}

export function calculateElderCareCost(
  input: ElderCareInput,
): ElderCareResult {
  const {
    careType,
    ageYears,
    hoursPerDay,
    daysPerWeek,
    hasHealthInsurance,
  } = input;

  const hourlyCost = getHourlyCost(careType);
  const monthlyHours = hoursPerDay * daysPerWeek * 4.33; // Average weeks per month
  const monthlyCost = Math.round(hourlyCost * monthlyHours);
  const annualCost = monthlyCost * 12;

  const medicalCost = getMedicalCost(careType, ageYears);
  const totalAnnualCost = annualCost + medicalCost;

  // Insurance coverage for elder care
  const insuranceRate = hasHealthInsurance ? 0.5 : 0;
  const insuranceCoverage = Math.round(totalAnnualCost * insuranceRate);
  const outOfPocket = totalAnnualCost - insuranceCoverage;

  const recommendedLevel =
    ageYears > 85
      ? 'Full-time nursing home or hospital care'
      : ageYears > 75
        ? 'Day care or part-time home care'
        : 'Home care support 2-3 days per week';

  return {
    hourlyCost,
    monthlyCost,
    annualCost,
    medicalCost,
    totalAnnualCost,
    insuranceCoverage,
    outOfPocket,
    careType: `บริการดูแล: ${careType}`,
    recommendedLevel,
  };
}
