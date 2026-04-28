/**
 * Thai Condo Insurance Premium Calculator (คำนวณเบี้ยประกันคอนโด)
 *
 * Sources:
 * - OIC Condo Insurance Rates
 * - Thai Condominium Standards
 */

export type CondoType = 'low-rise' | 'mid-rise' | 'high-rise';
export type SecurityLevel = 'basic' | 'enhanced' | 'premium';

export interface CondoInsuranceInput {
  unitValue: number;            // มูลค่าหน่วยชุด (THB)
  condoType: CondoType;         // ประเภทโครงสร้าง
  securityLevel: SecurityLevel; // ระดับความปลอดภัย
  floorNumber: number;          // ชั้นที่ (1-based)
}

export interface CondoInsuranceResult {
  unitValue: number;
  condoType: string;
  securityLevel: string;
  estimatedAnnualPremium: number;
  monthlyPremium: number;
  deductible: number;
  coverageAmount: number;
}

const CONDO_TYPE_NAMES: Record<CondoType, string> = {
  'low-rise': 'ต่ำ (1-5 ชั้น)',
  'mid-rise': 'กลาง (6-15 ชั้น)',
  'high-rise': 'สูง (16+ ชั้น)',
};

const BASE_RATES: Record<CondoType, number> = {
  'low-rise': 0.0032,
  'mid-rise': 0.0028,
  'high-rise': 0.0025,
};

const SECURITY_MULTIPLIERS: Record<SecurityLevel, number> = {
  basic: 1.0,
  enhanced: 0.92,
  premium: 0.85,
};

const MIN_PREMIUMS: Record<SecurityLevel, number> = {
  basic: 3500,
  enhanced: 4000,
  premium: 5000,
};

function getFloorAdjustment(floor: number): number {
  if (floor <= 3) return 1.05;  // Ground floor higher risk
  if (floor <= 10) return 1.0;
  return 0.95; // Higher floors slightly lower risk
}

export function calculateCondoInsurance(input: CondoInsuranceInput): CondoInsuranceResult {
  const baseRate = BASE_RATES[input.condoType];
  const securityMultiplier = SECURITY_MULTIPLIERS[input.securityLevel];
  const floorAdjustment = getFloorAdjustment(input.floorNumber);

  let premium = input.unitValue * baseRate * securityMultiplier * floorAdjustment;
  premium = Math.max(premium, MIN_PREMIUMS[input.securityLevel]);

  return {
    unitValue: input.unitValue,
    condoType: CONDO_TYPE_NAMES[input.condoType],
    securityLevel: input.securityLevel,
    estimatedAnnualPremium: Math.round(premium),
    monthlyPremium: Math.round(premium / 12),
    deductible: 10000,
    coverageAmount: input.unitValue,
  };
}
