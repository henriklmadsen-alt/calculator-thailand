/**
 * Thai Insurance Deductible Comparison Calculator (คำนวณเปรียบเทียบการเลือกเงินตัดหนี้)
 *
 * Compares premium savings vs out-of-pocket costs for different deductible levels
 */

export interface InsuranceDeductibleInput {
  baseAnnualPremium: number;    // เบี้ยประกันปกติ (THB)
  deductibleOption1: number;    // ตัวเลือก 1 (THB)
  deductibleOption2: number;    // ตัวเลือก 2 (THB)
  deductibleOption3: number;    // ตัวเลือก 3 (THB)
  estimatedClaimFrequency: 'low' | 'medium' | 'high';
}

export interface DeductibleOption {
  deductibleAmount: number;
  annualPremium: number;
  annualSavings: number;
  estimatedClaimCostWithDeductible: number;
  netAnnualCost: number;
  paybackPeriodYears: number;
}

export interface InsuranceDeductibleResult {
  baselinePremium: number;
  claimFrequency: string;
  option1: DeductibleOption;
  option2: DeductibleOption;
  option3: DeductibleOption;
  recommendedDeductible: DeductibleOption;
}

const DEDUCTIBLE_DISCOUNT_RATES: Record<number, number> = {
  5000: 0.10,     // 10% discount
  10000: 0.15,    // 15% discount
  15000: 0.20,    // 20% discount
  25000: 0.25,    // 25% discount
  50000: 0.35,    // 35% discount
};

const CLAIM_FREQUENCY_RATES: Record<string, number> = {
  low: 0.1,       // 10% chance per year
  medium: 0.2,    // 20% chance per year
  high: 0.4,      // 40% chance per year
};

function getDiscountRate(deductible: number): number {
  for (const [ded, rate] of Object.entries(DEDUCTIBLE_DISCOUNT_RATES).sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))) {
    if (deductible >= parseFloat(ded)) return rate;
  }
  return 0;
}

function calculateOption(
  deductible: number,
  basePremium: number,
  claimFrequency: string
): DeductibleOption {
  const discountRate = getDiscountRate(deductible);
  const annualPremium = Math.round(basePremium * (1 - discountRate));
  const savings = basePremium - annualPremium;

  const claimFreq = CLAIM_FREQUENCY_RATES[claimFrequency];
  const estimatedClaimCostWithDeductible = Math.round(deductible * claimFreq);
  const netAnnualCost = annualPremium + estimatedClaimCostWithDeductible;

  const paybackPeriods = savings > 0 ? deductible / savings : 0;

  return {
    deductibleAmount: deductible,
    annualPremium,
    annualSavings: savings,
    estimatedClaimCostWithDeductible,
    netAnnualCost,
    paybackPeriodYears: Math.round(paybackPeriods * 10) / 10,
  };
}

export function calculateInsuranceDeductibleComparison(input: InsuranceDeductibleInput): InsuranceDeductibleResult {
  const option1 = calculateOption(input.deductibleOption1, input.baseAnnualPremium, input.estimatedClaimFrequency);
  const option2 = calculateOption(input.deductibleOption2, input.baseAnnualPremium, input.estimatedClaimFrequency);
  const option3 = calculateOption(input.deductibleOption3, input.baseAnnualPremium, input.estimatedClaimFrequency);

  // Recommend option with lowest net annual cost
  const recommended = [option1, option2, option3].reduce((a, b) =>
    a.netAnnualCost < b.netAnnualCost ? a : b
  );

  return {
    baselinePremium: input.baseAnnualPremium,
    claimFrequency: input.estimatedClaimFrequency,
    option1,
    option2,
    option3,
    recommendedDeductible: recommended,
  };
}
