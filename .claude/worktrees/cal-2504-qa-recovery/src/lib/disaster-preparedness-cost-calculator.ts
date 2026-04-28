/**
 * Thai Natural Disaster Preparedness Cost Calculator (คำนวณต้นทุนเตรียมความพร้อมฉุกเฉิน)
 *
 * Estimates costs for disaster preparedness measures
 */

export interface DisasterPreparednessInput {
  homeType: 'detached' | 'apartment' | 'condo';
  riskLevel: 'low' | 'medium' | 'high';
  preparednessLevel: 'basic' | 'standard' | 'comprehensive';
}

export interface DisasterPreparednessResult {
  homeType: string;
  riskLevel: string;
  preparednessLevel: string;
  initialSetupCost: number;
  annualMaintenanceCost: number;
  estimatedTotalCost3Years: number;
}

const BASE_COSTS: Record<string, Record<string, number>> = {
  basic: {
    detached: 15000,
    apartment: 8000,
    condo: 5000,
  },
  standard: {
    detached: 35000,
    apartment: 20000,
    condo: 15000,
  },
  comprehensive: {
    detached: 65000,
    apartment: 45000,
    condo: 35000,
  },
};

const RISK_MULTIPLIERS: Record<string, number> = {
  low: 1.0,
  medium: 1.2,
  high: 1.5,
};

const MAINTENANCE_RATES: Record<string, number> = {
  basic: 0.10,
  standard: 0.15,
  comprehensive: 0.20,
};

export function calculateDisasterPreparedness(input: DisasterPreparednessInput): DisasterPreparednessResult {
  const baseCost = BASE_COSTS[input.preparednessLevel][input.homeType] || BASE_COSTS.standard.apartment;
  const riskMultiplier = RISK_MULTIPLIERS[input.riskLevel];
  const maintenanceRate = MAINTENANCE_RATES[input.preparednessLevel];

  const initialSetupCost = Math.round(baseCost * riskMultiplier);
  const annualMaintenanceCost = Math.round(initialSetupCost * maintenanceRate);
  const estimatedTotalCost3Years = initialSetupCost + (annualMaintenanceCost * 3);

  return {
    homeType: input.homeType,
    riskLevel: input.riskLevel,
    preparednessLevel: input.preparednessLevel,
    initialSetupCost,
    annualMaintenanceCost,
    estimatedTotalCost3Years,
  };
}
