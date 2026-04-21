/**
 * Thai Fire Safety Equipment Cost Calculator (คำนวณค่าอุปกรณ์ป้องกันไฟไหม้)
 *
 * Estimates costs for smoke detectors and fire extinguishers
 */

export interface FireSafetyEquipmentInput {
  homeSquareMeters: number;      // พื้นที่บ้าน (ตร.เมตร)
  numberOfFloors: number;        // จำนวนชั้น
  fireExtinguisherType: 'ABC' | 'AFFF' | 'K-class';
  smokeDetectorType: 'battery' | 'hardwired' | 'smart';
}

export interface FireSafetyEquipmentResult {
  smokeDetectorsNeeded: number;
  smokeDetectorCost: number;
  totalSmokeDetectorCost: number;
  fireExtinguishersNeeded: number;
  fireExtinguisherUnitCost: number;
  totalFireExtinguisherCost: number;
  maintenanceAnnualCost: number;
  totalInitialCost: number;
  estimated3YearCost: number;
}

const SMOKE_DETECTOR_COSTS: Record<string, number> = {
  battery: 300,
  hardwired: 800,
  smart: 1500,
};

const FIRE_EXTINGUISHER_COSTS: Record<string, number> = {
  ABC: 1500,
  AFFF: 2500,
  'K-class': 3500,
};

// One smoke detector per 60 sq.m
const SMOKE_DETECTOR_COVERAGE = 60;

// One fire extinguisher per 200 sq.m
const FIRE_EXTINGUISHER_COVERAGE = 200;

// Minimum equipment per floor
const MIN_SMOKE_DETECTORS_PER_FLOOR = 2;
const MIN_FIRE_EXTINGUISHERS = 1;

export function calculateFireSafetyEquipmentCost(input: FireSafetyEquipmentInput): FireSafetyEquipmentResult {
  const smokeDetectorsNeeded = Math.max(
    Math.ceil(input.homeSquareMeters / SMOKE_DETECTOR_COVERAGE),
    MIN_SMOKE_DETECTORS_PER_FLOOR * input.numberOfFloors
  );

  const fireExtinguishersNeeded = Math.max(
    Math.ceil(input.homeSquareMeters / FIRE_EXTINGUISHER_COVERAGE),
    MIN_FIRE_EXTINGUISHERS
  );

  const smokeDetectorCost = SMOKE_DETECTOR_COSTS[input.smokeDetectorType] || SMOKE_DETECTOR_COSTS.battery;
  const fireExtinguisherCost = FIRE_EXTINGUISHER_COSTS[input.fireExtinguisherType] || FIRE_EXTINGUISHER_COSTS.ABC;

  const totalSmokeDetectorCost = smokeDetectorsNeeded * smokeDetectorCost;
  const totalFireExtinguisherCost = fireExtinguishersNeeded * fireExtinguisherCost;

  const maintenanceAnnualCost = Math.round((totalSmokeDetectorCost + totalFireExtinguisherCost) * 0.10);
  const totalInitialCost = totalSmokeDetectorCost + totalFireExtinguisherCost;
  const estimated3YearCost = totalInitialCost + (maintenanceAnnualCost * 3);

  return {
    smokeDetectorsNeeded,
    smokeDetectorCost,
    totalSmokeDetectorCost,
    fireExtinguishersNeeded,
    fireExtinguisherUnitCost: fireExtinguisherCost,
    totalFireExtinguisherCost,
    maintenanceAnnualCost,
    totalInitialCost,
    estimated3YearCost,
  };
}
