/**
 * Thai Renter's Insurance Cost Calculator (คำนวณค่าประกันผู้เช่า)
 *
 * Calculates renter's insurance costs for personal belongings
 */

export interface RentersInsuranceInput {
  belongingsValue: number;  // มูลค่าทรัพย์สิน (THB)
  coverageType: 'basic' | 'standard' | 'comprehensive';
  liabilityLimit: 'low' | 'medium' | 'high';
}

export interface RentersInsuranceResult {
  belongingsValue: number;
  coverageType: string;
  liabilityLimit: string;
  estimatedAnnualPremium: number;
  monthlyPremium: number;
  deductible: number;
  liabilityCoverageAmount: number;
}

const COVERAGE_RATES: Record<string, number> = {
  basic: 0.0060,       // 0.60%
  standard: 0.0080,    // 0.80%
  comprehensive: 0.0110, // 1.10%
};

const LIABILITY_LIMITS: Record<string, number> = {
  low: 500000,         // 500K THB
  medium: 1000000,     // 1M THB
  high: 2000000,       // 2M THB
};

const MIN_PREMIUMS: Record<string, number> = {
  basic: 2000,
  standard: 2500,
  comprehensive: 3500,
};

function getLiabilityMultiplier(limit: string): number {
  const multipliers: Record<string, number> = {
    low: 1.0,
    medium: 1.15,
    high: 1.35,
  };
  return multipliers[limit] || 1.0;
}

export function calculateRentersInsurance(input: RentersInsuranceInput): RentersInsuranceResult {
  const baseRate = COVERAGE_RATES[input.coverageType] || COVERAGE_RATES.standard;
  const liabilityMult = getLiabilityMultiplier(input.liabilityLimit);

  let premium = input.belongingsValue * baseRate * liabilityMult;
  premium = Math.max(premium, MIN_PREMIUMS[input.coverageType] || MIN_PREMIUMS.standard);

  return {
    belongingsValue: input.belongingsValue,
    coverageType: input.coverageType,
    liabilityLimit: input.liabilityLimit,
    estimatedAnnualPremium: Math.round(premium),
    monthlyPremium: Math.round(premium / 12),
    deductible: 5000,
    liabilityCoverageAmount: LIABILITY_LIMITS[input.liabilityLimit] || LIABILITY_LIMITS.medium,
  };
}
