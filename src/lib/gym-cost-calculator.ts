/**
 * Gym Membership Cost Calculator (ค่าสมาชิกฟิตเนส)
 *
 * Calculates:
 * - Monthly membership cost
 * - Annual membership cost with potential discounts
 * - Cost per visit breakdown
 * - Payback analysis
 */

export interface GymCostInput {
  monthlyFeeThb: number; // Monthly membership fee in THB
  annualDiscountPercent?: number; // Annual discount percentage (if applicable)
  estimatedVisitsPerMonth?: number; // Estimated gym visits per month
  signupFeeTHB?: number; // One-time signup fee
}

export interface GymCostResult {
  monthlyFeeThb: number;
  annualCostMonthly: number;
  annualCostWithDiscount: number;
  totalAnnualWithSignup: number;
  costPerVisitMonthly: number;
  costPerVisitAnnual: number;
  signupFeeTHB?: number;
  breakdown: {
    monthlySubtotal: number;
    discountAmount: number;
    signupFee: number;
    annualTotal: number;
  };
}

export function calculateGymCost(input: GymCostInput): GymCostResult {
  // Validate inputs
  if (input.monthlyFeeThb <= 0 || input.monthlyFeeThb > 50000) {
    throw new Error('Monthly fee must be between 1 and 50,000 THB');
  }

  const annualDiscountPercent = input.annualDiscountPercent || 0;
  const estimatedVisitsPerMonth = input.estimatedVisitsPerMonth || 12;
  const signupFee = input.signupFeeTHB || 0;

  // Calculate annual costs
  const annualCostMonthly = input.monthlyFeeThb * 12;
  const discountAmount = Math.round(annualCostMonthly * (annualDiscountPercent / 100));
  const annualCostWithDiscount = annualCostMonthly - discountAmount;
  const totalAnnualWithSignup = annualCostWithDiscount + signupFee;

  // Cost per visit
  const costPerVisitMonthly = Math.round(input.monthlyFeeThb / estimatedVisitsPerMonth);
  const costPerVisitAnnual = Math.round(totalAnnualWithSignup / (estimatedVisitsPerMonth * 12));

  return {
    monthlyFeeThb: input.monthlyFeeThb,
    annualCostMonthly,
    annualCostWithDiscount,
    totalAnnualWithSignup,
    costPerVisitMonthly,
    costPerVisitAnnual,
    signupFeeTHB: signupFee || undefined,
    breakdown: {
      monthlySubtotal: annualCostMonthly,
      discountAmount,
      signupFee,
      annualTotal: totalAnnualWithSignup,
    },
  };
}

// Worked examples
export const EXAMPLE_1 = calculateGymCost({
  monthlyFeeThb: 2500,
  annualDiscountPercent: 10,
  estimatedVisitsPerMonth: 12,
  signupFeeTHB: 500,
});

export const EXAMPLE_2 = calculateGymCost({
  monthlyFeeThb: 1500,
  annualDiscountPercent: 0,
  estimatedVisitsPerMonth: 8,
  signupFeeTHB: 0,
});

export const EXAMPLE_3 = calculateGymCost({
  monthlyFeeThb: 3500,
  annualDiscountPercent: 15,
  estimatedVisitsPerMonth: 15,
  signupFeeTHB: 1000,
});
