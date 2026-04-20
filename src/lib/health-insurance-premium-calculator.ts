/**
 * Thai Health Insurance Premium Calculator (คำนวณเบี้ยประกันสุขภาพ)
 *
 * Sources:
 * - Office of Insurance Commission (สำนักการประกันสังคม)
 * - Thai Insurance Association (สมาคมประกันชีวิตไทย)
 * - Ministry of Public Health data
 *
 * Plan types:
 *   Basic/Economy   — low cost, limited coverage
 *   Standard        — balanced coverage
 *   Premium/Deluxe  — comprehensive coverage with high limits
 *
 * Factors: age group, plan type, coverage amount, family size
 *
 * Note: This is an estimation tool. Actual premiums vary by insurer,
 * underwriting, occupation, and health status.
 */

export type PlanType = 'basic' | 'standard' | 'premium';
export type AgeGroup = 'young' | 'adult' | 'middle' | 'senior';
export type CoverageType = 'individual' | 'couple' | 'family';

export interface HealthInsuranceInput {
  planType: PlanType;
  ageGroup: AgeGroup;
  coverageType: CoverageType;
  familyMembers?: number;
}

export interface HealthInsuranceResult {
  planType: PlanType;
  planTypeName: string;
  monthlyPremium: number;
  annualPremium: number;
  ageGroup: AgeGroup;
  ageGroupName: string;
  coverageType: CoverageType;
  coverageTypeName: string;
  hospitalizationLimit: number;
  outpatientLimit: number;
  deductible: number;
  coinsurance: number;
  familyMembers: number;
  totalAnnualPremium: number;
}

const PLAN_TYPE_NAMES: Record<PlanType, string> = {
  basic: 'แบบพื้นฐาน',
  standard: 'แบบมาตรฐาน',
  premium: 'แบบพรีเมียม',
};

const AGE_GROUP_NAMES: Record<AgeGroup, string> = {
  young: 'วัยรุ่น (18-25)',
  adult: 'วัยทำงาน (26-40)',
  middle: 'วัยกลางคน (41-60)',
  senior: 'ผู้สูงอายุ (60+)',
};

const COVERAGE_TYPE_NAMES: Record<CoverageType, string> = {
  individual: 'บุคคลเดียว',
  couple: 'คู่สามี-ภรรยา',
  family: 'ครอบครัว',
};

/**
 * Base annual premium by plan type and age group
 * Rates approximate typical Thai insurance products
 */
function getBasePremium(planType: PlanType, ageGroup: AgeGroup): number {
  const rates: Record<PlanType, Record<AgeGroup, number>> = {
    basic: {
      young: 6000,
      adult: 8000,
      middle: 12000,
      senior: 20000,
    },
    standard: {
      young: 12000,
      adult: 15000,
      middle: 22000,
      senior: 38000,
    },
    premium: {
      young: 24000,
      adult: 30000,
      middle: 45000,
      senior: 75000,
    },
  };
  return rates[planType][ageGroup];
}

/**
 * Family coverage multiplier
 * Couple: add 50-70% for spouse
 * Family: add 80-120% for children
 */
function getFamilyCoverageMultiplier(
  coverageType: CoverageType,
  familyMembers: number = 1,
): number {
  switch (coverageType) {
    case 'individual':
      return 1.0;
    case 'couple':
      return 1.6; // ~60% extra for spouse
    case 'family':
      // Adjust by number of members: 2-4 members typical
      const children = Math.max(1, familyMembers - 2);
      return 1.8 + children * 0.35; // Base 80% + 35% per child
  }
}

/**
 * Hospitalization limit (max coverage per year)
 */
function getHospitalizationLimit(planType: PlanType): number {
  switch (planType) {
    case 'basic':
      return 500000; // 500k limit
    case 'standard':
      return 1000000; // 1M limit
    case 'premium':
      return 2000000; // 2M limit
  }
}

/**
 * Outpatient (clinic visit) limit
 */
function getOutpatientLimit(planType: PlanType): number {
  switch (planType) {
    case 'basic':
      return 50000; // 50k limit
    case 'standard':
      return 100000; // 100k limit
    case 'premium':
      return 200000; // 200k limit
  }
}

/**
 * Deductible (amount you pay before insurance covers)
 */
function getDeductible(planType: PlanType): number {
  switch (planType) {
    case 'basic':
      return 5000; // 5k deductible
    case 'standard':
      return 2500; // 2.5k deductible
    case 'premium':
      return 0; // No deductible
  }
}

/**
 * Coinsurance (percentage you pay after deductible)
 */
function getCoinsurance(planType: PlanType): number {
  switch (planType) {
    case 'basic':
      return 0.20; // You pay 20%
    case 'standard':
      return 0.15; // You pay 15%
    case 'premium':
      return 0.1; // You pay 10%
  }
}

export function calculateHealthInsurance(
  input: HealthInsuranceInput,
): HealthInsuranceResult {
  const {
    planType,
    ageGroup,
    coverageType,
    familyMembers = 1,
  } = input;

  const basePremium = getBasePremium(planType, ageGroup);
  const familyMultiplier = getFamilyCoverageMultiplier(coverageType, familyMembers);
  const annualPremium = Math.round(basePremium * familyMultiplier);
  const monthlyPremium = Math.round(annualPremium / 12);

  const hospitalizationLimit = getHospitalizationLimit(planType);
  const outpatientLimit = getOutpatientLimit(planType);
  const deductible = getDeductible(planType);
  const coinsurance = getCoinsurance(planType);

  return {
    planType,
    planTypeName: PLAN_TYPE_NAMES[planType],
    monthlyPremium,
    annualPremium,
    ageGroup,
    ageGroupName: AGE_GROUP_NAMES[ageGroup],
    coverageType,
    coverageTypeName: COVERAGE_TYPE_NAMES[coverageType],
    hospitalizationLimit,
    outpatientLimit,
    deductible,
    coinsurance: Math.round(coinsurance * 100),
    familyMembers,
    totalAnnualPremium: annualPremium,
  };
}

/**
 * Compare all plan types for a given person
 */
export function compareAllPlans(
  input: Omit<HealthInsuranceInput, 'planType'>,
): {
  basic: HealthInsuranceResult;
  standard: HealthInsuranceResult;
  premium: HealthInsuranceResult;
  monthlyDifference: { standardVsBasic: number; premiumVsStandard: number };
} {
  const basic = calculateHealthInsurance({ ...input, planType: 'basic' });
  const standard = calculateHealthInsurance({ ...input, planType: 'standard' });
  const premium = calculateHealthInsurance({ ...input, planType: 'premium' });

  return {
    basic,
    standard,
    premium,
    monthlyDifference: {
      standardVsBasic: standard.monthlyPremium - basic.monthlyPremium,
      premiumVsStandard: premium.monthlyPremium - standard.monthlyPremium,
    },
  };
}
