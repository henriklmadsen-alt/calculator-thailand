/**
 * Thai Insurance Premium Discount Calculator (คำนวณส่วนลดเบี้ยประกัน)
 *
 * Calculates available discounts and final premium
 */

export interface InsurancePremiumDiscountInput {
  basePremium: number;              // เบี้ยประกันปกติ (THB)
  safetyFeatures: string[];         // ระบบรักษาความปลอดภัย
  claimsHistory: number;           // จำนวนปีที่ไม่เรียกร้อง
  bundleWithOtherPolicies: boolean; // รวมประกันอื่นด้วย
  paidInFull: boolean;              // ชำระเบี้ยทั้งปี
  loyaltyYears: number;             // ระยะเวลาเป็นลูกค้า (ปี)
}

export interface InsurancePremiumDiscountResult {
  basePremium: number;
  safetyFeaturesDiscount: number;
  claimsHistoryDiscount: number;
  bundleDiscount: number;
  paidInFullDiscount: number;
  loyaltyDiscount: number;
  totalDiscountAmount: number;
  totalDiscountPercentage: number;
  finalPremium: number;
  monthlyCost: number;
}

// Discount rates for various factors
const SAFETY_FEATURES_DISCOUNTS: Record<string, number> = {
  'alarm-system': 0.10,      // 10% discount
  'cctv': 0.08,              // 8% discount
  'smart-lock': 0.05,        // 5% discount
  'fire-extinguisher': 0.05, // 5% discount
  'gate-fence': 0.07,        // 7% discount
};

const CLAIMS_FREE_DISCOUNT_PER_YEAR = 0.05; // 5% per claims-free year (max 25%)
const BUNDLE_DISCOUNT = 0.15;               // 15% for bundling
const PAID_IN_FULL_DISCOUNT = 0.05;         // 5% for paying annually
const LOYALTY_DISCOUNT_PER_YEAR = 0.02;     // 2% per year (max 10%)

export function calculateInsurancePremiumDiscount(input: InsurancePremiumDiscountInput): InsurancePremiumDiscountResult {
  // Safety features discount (cumulative, max 25%)
  let safetyDiscount = 0;
  for (const feature of input.safetyFeatures) {
    safetyDiscount += SAFETY_FEATURES_DISCOUNTS[feature] || 0;
  }
  safetyDiscount = Math.min(safetyDiscount, 0.25);
  const safetyDiscountAmount = Math.round(input.basePremium * safetyDiscount);

  // Claims history discount (max 25%)
  const claimsDiscount = Math.min(input.claimsHistory * CLAIMS_FREE_DISCOUNT_PER_YEAR, 0.25);
  const claimsDiscountAmount = Math.round(input.basePremium * claimsDiscount);

  // Bundle discount
  const bundleDiscountAmount = input.bundleWithOtherPolicies ? Math.round(input.basePremium * BUNDLE_DISCOUNT) : 0;

  // Paid in full discount
  const paidInFullDiscountAmount = input.paidInFull ? Math.round(input.basePremium * PAID_IN_FULL_DISCOUNT) : 0;

  // Loyalty discount (max 10%)
  const loyaltyDiscount = Math.min(input.loyaltyYears * LOYALTY_DISCOUNT_PER_YEAR, 0.10);
  const loyaltyDiscountAmount = Math.round(input.basePremium * loyaltyDiscount);

  const totalDiscountAmount = safetyDiscountAmount + claimsDiscountAmount + bundleDiscountAmount +
                             paidInFullDiscountAmount + loyaltyDiscountAmount;

  const totalDiscountPercentage = Math.round((totalDiscountAmount / input.basePremium) * 1000) / 10;
  const finalPremium = Math.round(input.basePremium - totalDiscountAmount);
  const monthlyCost = Math.round(finalPremium / 12);

  return {
    basePremium: input.basePremium,
    safetyFeaturesDiscount: safetyDiscountAmount,
    claimsHistoryDiscount: claimsDiscountAmount,
    bundleDiscount: bundleDiscountAmount,
    paidInFullDiscount: paidInFullDiscountAmount,
    loyaltyDiscount: loyaltyDiscountAmount,
    totalDiscountAmount,
    totalDiscountPercentage,
    finalPremium,
    monthlyCost,
  };
}
