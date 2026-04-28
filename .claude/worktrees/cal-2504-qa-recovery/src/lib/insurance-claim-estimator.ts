/**
 * Thai Insurance Claim Value Estimator (คำนวณมูลค่าเรียกร้องประกัน)
 *
 * Estimates claim payouts based on policy details
 */

export interface InsuranceClaimInput {
  lossAmount: number;             // จำนวนเงินสูญเสีย (THB)
  deductible: number;             // เงินตัดหนี้ (THB)
  coverageLimit: number;          // วงเงินคุ้มครอง (THB)
  coveragePercentage: number;     // ร้อยละการครอบคลุม (0-100)
}

export interface InsuranceClaimResult {
  lossAmount: number;
  deductible: number;
  coverageLimit: number;
  coveragePercentage: number;
  calculatedCoveredAmount: number;
  minusDeductible: number;
  claimPayout: number;
  gapAmount: number;
  claimPercentage: number;
}

export function calculateInsuranceClaim(input: InsuranceClaimInput): InsuranceClaimResult {
  // Calculate covered amount based on percentage
  const calculatedCoveredAmount = Math.round(input.lossAmount * (input.coveragePercentage / 100));

  // Apply coverage limit
  const claimedAmount = Math.min(calculatedCoveredAmount, input.coverageLimit);

  // Subtract deductible
  const payoutAfterDeductible = Math.max(0, claimedAmount - input.deductible);

  // Gap is uncovered portion
  const gapAmount = Math.max(0, input.lossAmount - claimedAmount);

  // Actual percentage of loss covered
  const claimPercentage = input.lossAmount > 0 ? (payoutAfterDeductible / input.lossAmount) * 100 : 0;

  return {
    lossAmount: input.lossAmount,
    deductible: input.deductible,
    coverageLimit: input.coverageLimit,
    coveragePercentage: input.coveragePercentage,
    calculatedCoveredAmount,
    minusDeductible: input.deductible,
    claimPayout: Math.round(payoutAfterDeductible),
    gapAmount: Math.round(gapAmount),
    claimPercentage: Math.round(claimPercentage * 100) / 100,
  };
}
