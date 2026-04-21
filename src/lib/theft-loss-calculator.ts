/**
 * Thai Theft Loss Calculator (คำนวณค่าสูญเสียโดยการโจรกรรม)
 *
 * Estimates potential loss from theft and insurance claim value
 */

export interface TheftLossInput {
  estimatedItemValue: number;      // มูลค่าสินค้า (THB)
  itemCategory: 'electronics' | 'jewelry' | 'furniture' | 'artwork' | 'other';
  theftType: 'burglary' | 'robbery' | 'home_invasion';
  itemCondition: 'new' | 'good' | 'fair' | 'old';
}

export interface TheftLossResult {
  estimatedItemValue: number;
  depreciatedValue: number;
  claimableAmount: number;
  deductible: number;
  netRecoveryAmount: number;
  insuranceRecommendation: number;
  coverageGap: number;
}

const DEPRECIATION_RATES: Record<string, number> = {
  electronics: 0.15,   // 15% per year
  jewelry: 0.02,       // 2% per year
  furniture: 0.08,     // 8% per year
  artwork: 0.03,       // 3% per year
  other: 0.10,         // 10% per year
};

const CONDITION_FACTORS: Record<string, number> = {
  new: 1.0,
  good: 0.85,
  fair: 0.60,
  old: 0.40,
};

const CLAIM_COVERAGE_RATE = 0.80; // Insurance covers 80% of loss
const STANDARD_DEDUCTIBLE = 10000;

export function calculateTheftLoss(input: TheftLossInput): TheftLossResult {
  const depreciationRate = DEPRECIATION_RATES[input.itemCategory] || DEPRECIATION_RATES.other;
  const conditionFactor = CONDITION_FACTORS[input.itemCondition];

  const depreciatedValue = Math.round(input.estimatedItemValue * depreciationRate);
  const adjustedValue = Math.round((input.estimatedItemValue - depreciatedValue) * conditionFactor);

  const claimableAmount = Math.round(adjustedValue * CLAIM_COVERAGE_RATE);
  const netRecoveryAmount = Math.max(0, claimableAmount - STANDARD_DEDUCTIBLE);

  const insuranceRecommendation = Math.round(input.estimatedItemValue * 1.1); // 10% buffer
  const coverageGap = Math.max(0, insuranceRecommendation - claimableAmount);

  return {
    estimatedItemValue: input.estimatedItemValue,
    depreciatedValue,
    claimableAmount,
    deductible: STANDARD_DEDUCTIBLE,
    netRecoveryAmount,
    insuranceRecommendation,
    coverageGap,
  };
}
