/**
 * Thai Home Renovation Insurance Calculator (คำนวณเบี้ยประกันต่อเติมบ้าน)
 *
 * Estimates insurance for home renovation work
 */

export type RenovationType = 'interior' | 'structural' | 'electrical' | 'plumbing' | 'full';

export interface HomeRenovationInsuranceInput {
  renovationCost: number;       // ค่างานต่อเติม (THB)
  renovationType: RenovationType; // ประเภทงานต่อเติม
  contractorType: 'licensed' | 'unlicensed'; // ประเภทของผู้รับเหมา
  durationMonths: number;       // ระยะเวลางาน (เดือน)
}

export interface HomeRenovationInsuranceResult {
  renovationCost: number;
  renovationType: string;
  contractorType: string;
  baseInsuranceCost: number;
  licenseVerificationDiscount: number;
  finalInsuranceCost: number;
  estimatedCoverageAmount: number;
  deductible: number;
}

const INSURANCE_RATES: Record<RenovationType, number> = {
  interior: 0.015,      // 1.5% of cost
  structural: 0.025,    // 2.5% of cost
  electrical: 0.020,    // 2.0% of cost
  plumbing: 0.018,      // 1.8% of cost
  full: 0.030,          // 3.0% of cost
};

const LICENSED_CONTRACTOR_DISCOUNT = 0.10; // 10% discount for licensed contractors

export function calculateHomeRenovationInsurance(input: HomeRenovationInsuranceInput): HomeRenovationInsuranceResult {
  const rate = INSURANCE_RATES[input.renovationType];
  const baseInsuranceCost = Math.round(input.renovationCost * rate);

  const licenseDiscount = input.contractorType === 'licensed' ?
    Math.round(baseInsuranceCost * LICENSED_CONTRACTOR_DISCOUNT) : 0;

  const finalInsuranceCost = baseInsuranceCost - licenseDiscount;

  // Coverage is typically 125% of renovation cost
  const estimatedCoverageAmount = Math.round(input.renovationCost * 1.25);
  const deductible = Math.max(5000, Math.round(input.renovationCost * 0.02)); // 2% or 5k minimum

  return {
    renovationCost: input.renovationCost,
    renovationType: input.renovationType,
    contractorType: input.contractorType,
    baseInsuranceCost,
    licenseVerificationDiscount: licenseDiscount,
    finalInsuranceCost,
    estimatedCoverageAmount,
    deductible,
  };
}
