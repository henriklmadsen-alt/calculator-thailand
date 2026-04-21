/**
 * Thai Earthquake Insurance Calculator (คำนวณค่าประกันแผ่นดินไหว)
 *
 * Sources:
 * - OIC Earthquake Insurance Guidelines
 * - Thai Seismic Risk Assessment
 */

export type BuildingRiskLevel = 'low' | 'medium' | 'high';
export type StructureType = 'steel' | 'concrete' | 'mixed';

export interface EarthquakeInsuranceInput {
  propertyValue: number;           // มูลค่าอสังหาริมทรัพย์ (THB)
  buildingRiskLevel: BuildingRiskLevel; // ระดับความเสี่ยง
  structureType: StructureType;    // ประเภทโครงสร้าง
}

export interface EarthquakeInsuranceResult {
  propertyValue: number;
  buildingRiskLevel: string;
  structureType: string;
  estimatedAnnualPremium: number;
  monthlyPremium: number;
  coverageAmount: number;
  deductible: number;
  riskMultiplier: number;
}

const RISK_LEVEL_NAMES: Record<BuildingRiskLevel, string> = {
  low: 'ต่ำ',
  medium: 'ปานกลาง',
  high: 'สูง',
};

const RISK_MULTIPLIERS: Record<BuildingRiskLevel, number> = {
  low: 0.7,
  medium: 1.0,
  high: 1.5,
};

const STRUCTURE_MULTIPLIERS: Record<StructureType, number> = {
  steel: 0.85,      // Most resilient
  concrete: 1.0,
  mixed: 1.2,       // Least resilient
};

const BASE_RATE = 0.0015; // 0.15%
const MIN_PREMIUM = 3500;

export function calculateEarthquakeInsurance(input: EarthquakeInsuranceInput): EarthquakeInsuranceResult {
  const riskMultiplier = RISK_MULTIPLIERS[input.buildingRiskLevel];
  const structureMultiplier = STRUCTURE_MULTIPLIERS[input.structureType];

  let premium = input.propertyValue * BASE_RATE * riskMultiplier * structureMultiplier;
  premium = Math.max(premium, MIN_PREMIUM);

  return {
    propertyValue: input.propertyValue,
    buildingRiskLevel: RISK_LEVEL_NAMES[input.buildingRiskLevel],
    structureType: input.structureType,
    estimatedAnnualPremium: Math.round(premium),
    monthlyPremium: Math.round(premium / 12),
    coverageAmount: input.propertyValue,
    deductible: 25000,
    riskMultiplier,
  };
}
