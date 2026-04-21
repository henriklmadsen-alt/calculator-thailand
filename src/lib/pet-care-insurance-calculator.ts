/**
 * Thai Pet Care Insurance Calculator (คำนวณเบี้ยประกันสัตว์เลี้ยง)
 *
 * Estimates pet health insurance costs
 */

export type PetType = 'dog' | 'cat' | 'bird' | 'reptile';
export type CoverageLevel = 'basic' | 'standard' | 'comprehensive';

export interface PetCareInsuranceInput {
  petType: PetType;              // ชนิดสัตว์เลี้ยง
  petAge: number;                // อายุสัตว์เลี้ยง (ปี)
  coverageLevel: CoverageLevel;  // ระดับการคุ้มครอง
}

export interface PetCareInsuranceResult {
  petType: string;
  petAge: number;
  coverageLevel: string;
  monthlyPremium: number;
  annualPremium: number;
  deductiblePerClaim: number;
  annualBenefitLimit: number;
  coveragePercentage: number;
}

const MONTHLY_BASE_RATES: Record<PetType, Record<CoverageLevel, number>> = {
  dog: {
    basic: 400,
    standard: 700,
    comprehensive: 1200,
  },
  cat: {
    basic: 250,
    standard: 450,
    comprehensive: 800,
  },
  bird: {
    basic: 150,
    standard: 250,
    comprehensive: 400,
  },
  reptile: {
    basic: 200,
    standard: 350,
    comprehensive: 600,
  },
};

const AGE_MULTIPLIERS: Record<CoverageLevel, (age: number) => number> = {
  basic: (age) => {
    if (age < 2) return 1.0;
    if (age < 5) return 1.1;
    if (age < 8) return 1.25;
    return 1.5;
  },
  standard: (age) => {
    if (age < 2) return 1.0;
    if (age < 5) return 1.15;
    if (age < 8) return 1.35;
    return 1.65;
  },
  comprehensive: (age) => {
    if (age < 2) return 1.0;
    if (age < 5) return 1.2;
    if (age < 8) return 1.45;
    return 1.8;
  },
};

const DEDUCTIBLES: Record<CoverageLevel, number> = {
  basic: 2500,
  standard: 1500,
  comprehensive: 500,
};

const ANNUAL_LIMITS: Record<CoverageLevel, number> = {
  basic: 100000,
  standard: 250000,
  comprehensive: 500000,
};

const COVERAGE_PERCENTAGES: Record<CoverageLevel, number> = {
  basic: 70,
  standard: 85,
  comprehensive: 95,
};

export function calculatePetCareInsurance(input: PetCareInsuranceInput): PetCareInsuranceResult {
  const baseRate = MONTHLY_BASE_RATES[input.petType][input.coverageLevel];
  const ageMultiplier = AGE_MULTIPLIERS[input.coverageLevel](input.petAge);

  const monthlyPremium = Math.round(baseRate * ageMultiplier);
  const annualPremium = monthlyPremium * 12;

  return {
    petType: input.petType,
    petAge: input.petAge,
    coverageLevel: input.coverageLevel,
    monthlyPremium,
    annualPremium,
    deductiblePerClaim: DEDUCTIBLES[input.coverageLevel],
    annualBenefitLimit: ANNUAL_LIMITS[input.coverageLevel],
    coveragePercentage: COVERAGE_PERCENTAGES[input.coverageLevel],
  };
}
