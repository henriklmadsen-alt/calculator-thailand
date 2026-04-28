/**
 * Thai Property Damage Repair Cost Calculator (คำนวณต้นทุนซ่อมแซมความเสียหายทรัพย์สิน)
 *
 * Estimates repair costs for various property damage types
 */

export type DamageType = 'water' | 'fire' | 'structural' | 'electric' | 'plumbing' | 'general';

export interface PropertyDamageInput {
  damageType: DamageType;
  damageArea: number;          // พื้นที่ (ตร.เมตร)
  severityLevel: 'minor' | 'moderate' | 'severe';
  propertyValue: number;       // มูลค่าทรัพย์สิน (THB)
}

export interface PropertyDamageResult {
  damageType: string;
  damageArea: number;
  severityLevel: string;
  estimatedRepairCost: number;
  costPerSquareMeter: number;
  deductibleAmount: number;
  netClaimAmount: number;
}

const BASE_COSTS_PER_SQM: Record<DamageType, Record<string, number>> = {
  water: {
    minor: 500,
    moderate: 1200,
    severe: 2500,
  },
  fire: {
    minor: 2000,
    moderate: 5000,
    severe: 10000,
  },
  structural: {
    minor: 1500,
    moderate: 4000,
    severe: 8000,
  },
  electric: {
    minor: 800,
    moderate: 2000,
    severe: 5000,
  },
  plumbing: {
    minor: 600,
    moderate: 1500,
    severe: 3500,
  },
  general: {
    minor: 1000,
    moderate: 2500,
    severe: 5000,
  },
};

const DEDUCTIBLE_PERCENTAGE = 0.10; // 10% of estimate

export function calculatePropertyDamageRepair(input: PropertyDamageInput): PropertyDamageResult {
  const costPerSqM = BASE_COSTS_PER_SQM[input.damageType][input.severityLevel] || BASE_COSTS_PER_SQM.general.moderate;
  const estimatedRepairCost = Math.round(costPerSqM * input.damageArea);
  const deductibleAmount = Math.round(estimatedRepairCost * DEDUCTIBLE_PERCENTAGE);
  const netClaimAmount = Math.max(0, estimatedRepairCost - deductibleAmount);

  return {
    damageType: input.damageType,
    damageArea: input.damageArea,
    severityLevel: input.severityLevel,
    estimatedRepairCost,
    costPerSquareMeter: costPerSqM,
    deductibleAmount,
    netClaimAmount,
  };
}
