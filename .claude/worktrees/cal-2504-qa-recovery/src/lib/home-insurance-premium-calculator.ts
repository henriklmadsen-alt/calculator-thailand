/**
 * Thai Home Insurance Premium Calculator (คำนวณเบี้ยประกันบ้าน)
 *
 * Sources:
 * - สำนักงานคณะกรรมการกำกับและส่งเสริมการประกันภัย (OIC)
 * - Thai Insurance Industry Premium Guidelines
 *
 * Factors: property value, coverage type, age of property, location risk
 */

export type CoverageType = 'basic' | 'standard' | 'comprehensive';

export interface HomeInsuranceInput {
  propertyValue: number;    // มูลค่าบ้าน (THB)
  coverageType: CoverageType;  // ประเภทการคุ้มครอง
  propertyAge: number;      // อายุบ้าน (ปี)
  isRuralorUrban: 'urban' | 'rural'; // ตำแหน่งบ้าน
}

export interface HomeInsuranceResult {
  propertyValue: number;
  coverageType: CoverageType;
  coverageTypeName: string;
  estimatedAnnualPremium: number;  // เบี้ยประกันรายปี
  monthlyPremium: number;          // เบี้ยประกันรายเดือน
  deductible: number;              // เงินตัดหนี้
  coverageAmount: number;          // ทุนประกัน
  ageAdjustment: number;
  locationAdjustment: number;
}

const COVERAGE_TYPE_NAMES: Record<CoverageType, string> = {
  basic: 'ประกันพื้นฐาน',
  standard: 'ประกันมาตรฐาน',
  comprehensive: 'ประกันครอบคลุม',
};

// Base premium rates as % of property value
const BASE_RATES: Record<CoverageType, number> = {
  basic: 0.0035,        // 0.35%
  standard: 0.0050,     // 0.50%
  comprehensive: 0.0070, // 0.70%
};

// Minimum annual premiums (THB)
const MIN_PREMIUMS: Record<CoverageType, number> = {
  basic: 2500,
  standard: 3500,
  comprehensive: 5500,
};

// Deductibles (THB)
const DEDUCTIBLES: Record<CoverageType, number> = {
  basic: 25000,
  standard: 15000,
  comprehensive: 10000,
};

function getPropertyAgeAdjustment(age: number): number {
  if (age <= 5) return 1.0;
  if (age <= 10) return 1.05;
  if (age <= 20) return 1.15;
  return 1.25;
}

function getLocationAdjustment(isRural: boolean): number {
  return isRural ? 0.90 : 1.0; // Rural areas slightly cheaper
}

export function calculateHomeInsurance(input: HomeInsuranceInput): HomeInsuranceResult {
  const baseRate = BASE_RATES[input.coverageType];
  const ageAdjustment = getPropertyAgeAdjustment(input.propertyAge);
  const locationAdjustment = getLocationAdjustment(input.isRuralorUrban === 'rural');

  let annualPremium = input.propertyValue * baseRate * ageAdjustment * locationAdjustment;
  annualPremium = Math.max(annualPremium, MIN_PREMIUMS[input.coverageType]);

  return {
    propertyValue: input.propertyValue,
    coverageType: input.coverageType,
    coverageTypeName: COVERAGE_TYPE_NAMES[input.coverageType],
    estimatedAnnualPremium: Math.round(annualPremium),
    monthlyPremium: Math.round(annualPremium / 12),
    deductible: DEDUCTIBLES[input.coverageType],
    coverageAmount: input.propertyValue,
    ageAdjustment,
    locationAdjustment,
  };
}
