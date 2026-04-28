/**
 * Thai Fire Insurance Cost Calculator (คำนวณค่าประกันไฟไหม้)
 *
 * Sources:
 * - OIC (สำนักงานคณะกรรมการกำกับและส่งเสริมการประกันภัย)
 * - Thai Standard Fire Insurance Rates
 */

export interface FireInsuranceInput {
  propertyValue: number;    // มูลค่าอสังหาริมทรัพย์ (THB)
  constructionType: 'concrete' | 'wood' | 'brick'; // ประเภทการก่อสร้าง
  propertyAge: number;      // อายุอาคาร (ปี)
}

export interface FireInsuranceResult {
  propertyValue: number;
  constructionType: string;
  estimatedAnnualPremium: number;
  monthlyPremium: number;
  coverageAmount: number;
  deductible: number;
}

const CONSTRUCTION_NAMES: Record<string, string> = {
  concrete: 'คอนกรีต',
  wood: 'ไม้',
  brick: 'อิฐ',
};

// Base rates as % of property value, by construction type
const BASE_RATES: Record<string, number> = {
  concrete: 0.0012,  // 0.12%
  wood: 0.0025,      // 0.25%
  brick: 0.0018,     // 0.18%
};

const MIN_PREMIUM = 1500;

function getConstructionAdjustment(type: string): number {
  const rates: Record<string, number> = {
    concrete: 1.0,
    wood: 1.5,
    brick: 1.2,
  };
  return rates[type] || 1.0;
}

function getAgeAdjustment(age: number): number {
  if (age <= 5) return 1.0;
  if (age <= 10) return 1.08;
  if (age <= 20) return 1.15;
  return 1.25;
}

export function calculateFireInsurance(input: FireInsuranceInput): FireInsuranceResult {
  const baseRate = BASE_RATES[input.constructionType] || BASE_RATES.concrete;
  const constructionAdj = getConstructionAdjustment(input.constructionType);
  const ageAdj = getAgeAdjustment(input.propertyAge);

  let premium = input.propertyValue * baseRate * constructionAdj * ageAdj;
  premium = Math.max(premium, MIN_PREMIUM);

  return {
    propertyValue: input.propertyValue,
    constructionType: CONSTRUCTION_NAMES[input.constructionType] || input.constructionType,
    estimatedAnnualPremium: Math.round(premium),
    monthlyPremium: Math.round(premium / 12),
    coverageAmount: input.propertyValue,
    deductible: 10000,
  };
}
