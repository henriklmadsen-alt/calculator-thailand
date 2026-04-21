/**
 * Thai Liability Insurance Cost Calculator (คำนวณค่าประกันรับผิดชอบ)
 *
 * Estimates personal liability insurance costs
 */

export interface LiabilityInsuranceInput {
  liabilityLimit: number;       // วงเงินความรับผิด (THB)
  riskCategory: 'low' | 'medium' | 'high';
  umbrellaCoverage: boolean;    // มีประกันรองด้วม
  previousClaims: number;        // จำนวนเรียกร้องในอดีต
}

export interface LiabilityInsuranceResult {
  liabilityLimit: number;
  baseAnnualPremium: number;
  riskMultiplier: number;
  claimHistoryMultiplier: number;
  umbrellaMonthlyFee: number;
  totalAnnualPremium: number;
  monthlyPremium: number;
  estimatedCoverageGap: number;
}

const BASE_PREMIUM_PER_MILLION = 3500; // Baseline per 1M THB

const RISK_MULTIPLIERS: Record<string, number> = {
  low: 1.0,
  medium: 1.3,
  high: 1.7,
};

const UMBRELLA_MONTHLY = 150;

function getClaimHistoryMultiplier(claims: number): number {
  if (claims === 0) return 0.95;
  if (claims === 1) return 1.1;
  if (claims === 2) return 1.3;
  return 1.5;
}

export function calculateLiabilityInsurance(input: LiabilityInsuranceInput): LiabilityInsuranceResult {
  const limitInMillions = input.liabilityLimit / 1000000;
  const baseAnnual = BASE_PREMIUM_PER_MILLION * limitInMillions;

  const riskMult = RISK_MULTIPLIERS[input.riskCategory] || 1.0;
  const claimMult = getClaimHistoryMultiplier(input.previousClaims);

  const umbrellaAnnual = input.umbrellaCoverage ? UMBRELLA_MONTHLY * 12 : 0;
  const totalAnnual = Math.round(baseAnnual * riskMult * claimMult + umbrellaAnnual);
  const monthlyPremium = Math.round(totalAnnual / 12);

  // Recommended coverage is 2-3x liability limit
  const recommendedLimit = input.liabilityLimit * 2.5;
  const coverageGap = Math.max(0, recommendedLimit - input.liabilityLimit);

  return {
    liabilityLimit: input.liabilityLimit,
    baseAnnualPremium: Math.round(baseAnnual),
    riskMultiplier: riskMult,
    claimHistoryMultiplier: claimMult,
    umbrellaMonthlyFee: input.umbrellaCoverage ? UMBRELLA_MONTHLY : 0,
    totalAnnualPremium: totalAnnual,
    monthlyPremium,
    estimatedCoverageGap: Math.round(coverageGap),
  };
}
