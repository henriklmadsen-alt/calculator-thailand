/**
 * Thai Gate & Fence Security Cost Calculator (คำนวณต้นทุนประตูและรั้วรักษาความปลอดภัย)
 *
 * Estimates costs for gates and fences
 */

export type GateType = 'manual' | 'electric' | 'automatic';
export type FenceType = 'concrete' | 'metal' | 'electric' | 'combination';

export interface GateFenceSecurityInput {
  perimeterLength: number;      // ความยาวรอบปลายา (เมตร)
  gateType: GateType;           // ประเภทประตู
  fenceType: FenceType;         // ประเภทรั้ว
  fenceHeight: 'standard' | 'tall'; // ความสูงรั้ว
}

export interface GateFenceSecurityResult {
  perimeterLength: number;
  gateType: string;
  fenceType: string;
  gateInstallationCost: number;
  fenceCostPerMeter: number;
  totalFenceCost: number;
  totalMaterialCost: number;
  laborCostEstimate: number;
  totalInstallationCost: number;
  maintenanceAnnualCost: number;
}

const GATE_COSTS: Record<GateType, number> = {
  manual: 8000,
  electric: 18000,
  automatic: 35000,
};

const FENCE_COSTS_PER_METER: Record<FenceType, Record<string, number>> = {
  concrete: {
    standard: 1500,
    tall: 2000,
  },
  metal: {
    standard: 800,
    tall: 1200,
  },
  electric: {
    standard: 2500,
    tall: 3500,
  },
  combination: {
    standard: 2000,
    tall: 2800,
  },
};

const LABOR_RATE_PER_METER = 300; // Labor cost per meter
const LABOR_GATE_COST = 5000;

const MAINTENANCE_RATE = 0.08; // 8% of total cost

export function calculateGateFenceSecurity(input: GateFenceSecurityInput): GateFenceSecurityResult {
  const gateInstallationCost = GATE_COSTS[input.gateType];
  const fenceCostPerMeter = FENCE_COSTS_PER_METER[input.fenceType][input.fenceHeight];
  const totalFenceCost = fenceCostPerMeter * input.perimeterLength;

  const totalMaterialCost = gateInstallationCost + totalFenceCost;

  const laborCostEstimate = (LABOR_RATE_PER_METER * input.perimeterLength) + LABOR_GATE_COST;

  const totalInstallationCost = totalMaterialCost + laborCostEstimate;
  const maintenanceAnnualCost = Math.round(totalInstallationCost * MAINTENANCE_RATE);

  return {
    perimeterLength: input.perimeterLength,
    gateType: input.gateType,
    fenceType: input.fenceType,
    gateInstallationCost,
    fenceCostPerMeter,
    totalFenceCost,
    totalMaterialCost,
    laborCostEstimate,
    totalInstallationCost,
    maintenanceAnnualCost,
  };
}
