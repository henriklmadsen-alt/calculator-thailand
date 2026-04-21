/**
 * Thai Insurance Bundle Savings Calculator (คำนวณการประหยัดจากการรวมประกัน)
 *
 * Calculates savings from bundling insurance policies
 */

export interface InsuranceBundleInput {
  homeInsurancePremium: number;      // เบี้ยประกันบ้าน (THB)
  autoInsurancePremium: number;      // เบี้ยประกันรถ (THB)
  liabilityInsurancePremium: number; // เบี้ยประกันรับผิด (THB)
  lifeInsurancePremium: number;      // เบี้ยประกันชีวิต (THB)
}

export interface InsuranceBundleResult {
  totalSeparatePremiums: number;
  homeInsuranceDiscount: number;
  autoInsuranceDiscount: number;
  liabilityInsuranceDiscount: number;
  lifeInsuranceDiscount: number;
  totalDiscountsAvailable: number;
  totalBundledPremium: number;
  estimatedAnnualSavings: number;
  savingsPercentage: number;
  paybackScenario5Years: number;
}

// Typical bundle discounts (conservative estimates)
const BUNDLE_DISCOUNTS: Record<string, number> = {
  home: 0.10,       // 10% discount
  auto: 0.15,       // 15% discount
  liability: 0.20,  // 20% discount
  life: 0.08,       // 8% discount
};

export function calculateInsuranceBundleSavings(input: InsuranceBundleInput): InsuranceBundleResult {
  const homeDiscount = Math.round(input.homeInsurancePremium * BUNDLE_DISCOUNTS.home);
  const autoDiscount = Math.round(input.autoInsurancePremium * BUNDLE_DISCOUNTS.auto);
  const liabilityDiscount = Math.round(input.liabilityInsurancePremium * BUNDLE_DISCOUNTS.liability);
  const lifeDiscount = Math.round(input.lifeInsurancePremium * BUNDLE_DISCOUNTS.life);

  const totalSeparate = input.homeInsurancePremium + input.autoInsurancePremium +
                        input.liabilityInsurancePremium + input.lifeInsurancePremium;

  const totalDiscounts = homeDiscount + autoDiscount + liabilityDiscount + lifeDiscount;
  const totalBundled = Math.round(totalSeparate - totalDiscounts);

  const savingsPercentage = totalSeparate > 0 ? Math.round((totalDiscounts / totalSeparate) * 1000) / 10 : 0;
  const paybackScenario5Years = totalDiscounts * 5;

  return {
    totalSeparatePremiums: totalSeparate,
    homeInsuranceDiscount: homeDiscount,
    autoInsuranceDiscount: autoDiscount,
    liabilityInsuranceDiscount: liabilityDiscount,
    lifeInsuranceDiscount: lifeDiscount,
    totalDiscountsAvailable: totalDiscounts,
    totalBundledPremium: totalBundled,
    estimatedAnnualSavings: totalDiscounts,
    savingsPercentage,
    paybackScenario5Years,
  };
}
