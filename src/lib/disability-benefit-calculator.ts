/**
 * Thai Disability Benefit Calculator (คำนวณสิทธิ์ความพิการและเงินสวัสดิการ)
 *
 * Sources:
 * - Social Security Office Thailand
 * - Disability Assistance Programs
 * - Ministry of Social Development
 */

export type DisabilityLevel = 'mild' | 'moderate' | 'severe' | 'complete';

export interface DisabilityBenefitInput {
  disabilityLevel: DisabilityLevel;
  monthlyIncome: number;
  hasInsurance: boolean;
}

export interface DisabilityBenefitResult {
  monthlyBenefit: number;
  annualBenefit: number;
  medicalAllowance: number;
  rehabilitationCost: number;
  governmentAssistance: number;
  totalMonthlySupport: number;
  eligibilityStatus: string;
  notes: string;
}

function getBenefitAmount(
  disabilityLevel: DisabilityLevel,
  monthlyIncome: number,
): number {
  const benefitRates: Record<DisabilityLevel, number> = {
    mild: 0.3,
    moderate: 0.5,
    severe: 0.75,
    complete: 1.0,
  };

  return Math.round(monthlyIncome * benefitRates[disabilityLevel]);
}

export function calculateDisabilityBenefit(
  input: DisabilityBenefitInput,
): DisabilityBenefitResult {
  const {
    disabilityLevel,
    monthlyIncome,
    hasInsurance,
  } = input;

  const monthlyBenefit = getBenefitAmount(disabilityLevel, monthlyIncome);
  const annualBenefit = monthlyBenefit * 12;

  // Medical and rehabilitation allowance
  const medicalAllowance = disabilityLevel === 'complete'
    ? 2000
    : disabilityLevel === 'severe'
      ? 1500
      : disabilityLevel === 'moderate'
        ? 1000
        : 500;

  const rehabilitationCost =
    disabilityLevel === 'severe' || disabilityLevel === 'complete'
      ? 3000
      : 1500;

  const governmentAssistance =
    monthlyBenefit + medicalAllowance + (hasInsurance ? 0 : rehabilitationCost);

  const totalMonthlySupport = governmentAssistance;

  const eligibilityStatus =
    disabilityLevel === 'complete'
      ? 'ได้รับความช่วยเหลือสูงสุด'
      : 'ได้รับความช่วยเหลือตามระดับ';

  const notes =
    disabilityLevel === 'complete'
      ? 'Full disability support, monthly pension, medical coverage, and job training assistance'
      : 'Partial disability support, may be able to work part-time';

  return {
    monthlyBenefit,
    annualBenefit,
    medicalAllowance,
    rehabilitationCost,
    governmentAssistance,
    totalMonthlySupport,
    eligibilityStatus,
    notes,
  };
}
