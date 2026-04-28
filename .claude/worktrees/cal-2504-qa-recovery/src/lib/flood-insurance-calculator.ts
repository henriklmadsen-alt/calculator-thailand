/**
 * Thai Flood Insurance Estimator (คำนวณค่าประกันน้ำท่วม)
 *
 * Sources:
 * - OIC Guidelines
 * - Flood Risk Zone Classifications
 */

export type FloodRiskZone = 'low' | 'medium' | 'high' | 'very_high';

export interface FloodInsuranceInput {
  propertyValue: number;        // มูลค่าประกัน (THB)
  floodRiskZone: FloodRiskZone; // เขตความเสี่ยง
  groundFloor: boolean;         // ตั้งอยู่ชั้นล่างสุด
}

export interface FloodInsuranceResult {
  propertyValue: number;
  riskZone: string;
  estimatedAnnualPremium: number;
  monthlyPremium: number;
  deductible: number;
  coverageAmount: number;
  riskMultiplier: number;
}

const RISK_ZONE_NAMES: Record<FloodRiskZone, string> = {
  low: 'ต่ำ',
  medium: 'ปานกลาง',
  high: 'สูง',
  very_high: 'สูงมาก',
};

const RISK_MULTIPLIERS: Record<FloodRiskZone, number> = {
  low: 0.8,
  medium: 1.0,
  high: 1.5,
  very_high: 2.0,
};

const BASE_RATE = 0.0020; // 0.20%
const MIN_PREMIUM = 2500;

function getGroundFloorMultiplier(isGround: boolean): number {
  return isGround ? 1.3 : 1.0;
}

export function calculateFloodInsurance(input: FloodInsuranceInput): FloodInsuranceResult {
  const riskMultiplier = RISK_MULTIPLIERS[input.floodRiskZone];
  const floorMultiplier = getGroundFloorMultiplier(input.groundFloor);

  let premium = input.propertyValue * BASE_RATE * riskMultiplier * floorMultiplier;
  premium = Math.max(premium, MIN_PREMIUM);

  return {
    propertyValue: input.propertyValue,
    riskZone: RISK_ZONE_NAMES[input.floodRiskZone],
    estimatedAnnualPremium: Math.round(premium),
    monthlyPremium: Math.round(premium / 12),
    deductible: 15000,
    coverageAmount: input.propertyValue,
    riskMultiplier,
  };
}
