/**
 * Thai Rice Farming Cost Calculator (คำนวณต้นทุนการปลูกข้าว)
 *
 * Sources:
 * - Thai Department of Agricultural Extension (กรมส่งเสริมการเกษตร)
 * - Rice Department of Thailand (สำนักงานเมืองข้าว)
 * - Thai Agricultural Standards 2024/2025
 *
 * Covers:
 * - Land preparation (ไถ/ดำเนินการเตรียมพื้นที่)
 * - Seeds/seedlings (เมล็ดข้าว)
 * - Fertilizer (ปุ๋ย)
 * - Pesticides and herbicides (ยาเคมี)
 * - Labor (แรงงาน)
 * - Water fees (ค่าน้ำ - if irrigated)
 * - Equipment rental (ค่าเช่าเครื่องจักร)
 * - Harvesting (เก็บเกี่ยว)
 * - Drying and storage (อบแห้งและเก็บรักษา)
 *
 * Note: All costs are estimates based on 2024-2025 Thai agricultural rates.
 * Actual costs vary by location, season, and farming practices.
 */

export type RiceVariety = 'jasmine' | 'sticky' | 'white' | 'hybrid';

export interface RiceFarmingInput {
  raiSize: number; // ไร่ (1 rai ≈ 1,600 m²)
  riceVariety: RiceVariety;
  isIrrigated: boolean; // Has irrigation system
  includeLabor: boolean; // Hire labor or use own
  includeEquipmentRental: boolean; // Rent machinery
}

export interface RiceFarmingResult {
  raiSize: number;
  riceVariety: RiceVariety;
  riceVarietyName: string;
  isIrrigated: boolean;

  // Cost breakdown
  landPreparation: number;
  seeds: number;
  fertilizer: number;
  pesticides: number;
  waterFees: number;
  labor: number;
  equipmentRental: number;
  harvesting: number;
  drying: number;

  // Summary
  totalDirectCosts: number;
  estimatedYield: number; // kg per rai
  estimatedIncome: number; // Based on current market price ~6 THB/kg
  netProfit: number;
  profitMargin: number; // percentage
}

const RICE_VARIETY_NAMES: Record<RiceVariety, string> = {
  jasmine: 'ข้าวหอมมะลิ (Jasmine)',
  sticky: 'ข้าวเหนียว (Sticky)',
  white: 'ข้าวขาว (White)',
  hybrid: 'ข้าวลูกผสม (Hybrid)',
};

/**
 * Land Preparation Cost (ไถ, ไล่, ทำแปลง)
 * Range: 800-1,200 THB/rai depending on condition
 */
function getLandPreparationCost(raiSize: number, isIrrigated: boolean): number {
  // Irrigated land typically requires more careful preparation
  const costPerRai = isIrrigated ? 1200 : 800;
  return raiSize * costPerRai;
}

/**
 * Seeds/Seedlings Cost
 * Jasmine: 1,500-2,000 THB/rai
 * Sticky: 1,200-1,600 THB/rai
 * White: 800-1,200 THB/rai
 * Hybrid: 2,500-3,500 THB/rai (More expensive but higher yield)
 */
function getSeedCost(raiSize: number, variety: RiceVariety): number {
  const costPerRai: Record<RiceVariety, number> = {
    jasmine: 1700,
    sticky: 1400,
    white: 1000,
    hybrid: 3000,
  };
  return raiSize * costPerRai[variety];
}

/**
 * Fertilizer Cost (Chemical + Organic)
 * Typically 2-3 applications per season
 * Cost range: 2,000-3,500 THB/rai
 */
function getFertilizerCost(raiSize: number): number {
  const costPerRai = 2800; // Average cost
  return raiSize * costPerRai;
}

/**
 * Pesticides and Herbicides
 * Cost range: 1,500-2,500 THB/rai depending on pest pressure
 */
function getPesticideCost(raiSize: number): number {
  const costPerRai = 2000;
  return raiSize * costPerRai;
}

/**
 * Water Fees (for irrigated farms only)
 * Typical cost: 400-800 THB/rai per season
 */
function getWaterFees(raiSize: number, isIrrigated: boolean): number {
  if (!isIrrigated) return 0;
  const costPerRai = 600;
  return raiSize * costPerRai;
}

/**
 * Labor Cost (if hired)
 * Range: 3,000-5,000 THB/rai depending on work
 */
function getLaborCost(raiSize: number, includeLabor: boolean): number {
  if (!includeLabor) return 0;
  const costPerRai = 4000;
  return raiSize * costPerRai;
}

/**
 * Equipment Rental (Tractor, Thresher, etc.)
 * Range: 2,000-3,500 THB/rai for full season rental
 */
function getEquipmentRentalCost(raiSize: number, includeEquipmentRental: boolean): number {
  if (!includeEquipmentRental) return 0;
  const costPerRai = 2500;
  return raiSize * costPerRai;
}

/**
 * Harvesting Cost (Labor + Equipment)
 * Included in equipment rental if that's selected, otherwise 1,500-2,500 THB/rai
 */
function getHarvestingCost(raiSize: number, includeEquipmentRental: boolean): number {
  if (includeEquipmentRental) return 0; // Already included in equipment rental
  const costPerRai = 2000;
  return raiSize * costPerRai;
}

/**
 * Drying and Storage Cost
 * Typical cost: 800-1,200 THB/rai (includes drying, cleaning, storage)
 */
function getDryingCost(raiSize: number): number {
  const costPerRai = 1000;
  return raiSize * costPerRai;
}

/**
 * Estimate rice yield
 * White/Sticky rice: 350-500 kg/rai
 * Jasmine: 300-400 kg/rai (lower yield, higher price)
 * Hybrid: 500-700 kg/rai (high yield)
 */
function getEstimatedYield(raiSize: number, variety: RiceVariety): number {
  const yieldPerRai: Record<RiceVariety, number> = {
    jasmine: 350,
    sticky: 400,
    white: 450,
    hybrid: 600,
  };
  return Math.round(raiSize * yieldPerRai[variety]);
}

export function calculateRiceFarmingCost(input: RiceFarmingInput): RiceFarmingResult {
  const landPrep = getLandPreparationCost(input.raiSize, input.isIrrigated);
  const seeds = getSeedCost(input.raiSize, input.riceVariety);
  const fert = getFertilizerCost(input.raiSize);
  const pest = getPesticideCost(input.raiSize);
  const water = getWaterFees(input.raiSize, input.isIrrigated);
  const labor = getLaborCost(input.raiSize, input.includeLabor);
  const equipment = getEquipmentRentalCost(input.raiSize, input.includeEquipmentRental);
  const harvest = getHarvestingCost(input.raiSize, input.includeEquipmentRental);
  const drying = getDryingCost(input.raiSize);

  const totalDirectCosts = landPrep + seeds + fert + pest + water + labor + equipment + harvest + drying;

  const yield_ = getEstimatedYield(input.raiSize, input.riceVariety);
  // Market price varies: Jasmine 8-10 THB/kg, White 5-7 THB/kg, Sticky 6-8 THB/kg
  const pricePerKg: Record<RiceVariety, number> = {
    jasmine: 9,
    sticky: 7,
    white: 6,
    hybrid: 6.5,
  };
  const estimatedIncome = yield_ * pricePerKg[input.riceVariety];
  const netProfit = estimatedIncome - totalDirectCosts;
  const profitMargin = estimatedIncome > 0 ? (netProfit / estimatedIncome) * 100 : 0;

  return {
    raiSize: input.raiSize,
    riceVariety: input.riceVariety,
    riceVarietyName: RICE_VARIETY_NAMES[input.riceVariety],
    isIrrigated: input.isIrrigated,
    landPreparation: Math.round(landPrep),
    seeds: Math.round(seeds),
    fertilizer: Math.round(fert),
    pesticides: Math.round(pest),
    waterFees: Math.round(water),
    labor: Math.round(labor),
    equipmentRental: Math.round(equipment),
    harvesting: Math.round(harvest),
    drying: Math.round(drying),
    totalDirectCosts: Math.round(totalDirectCosts),
    estimatedYield: yield_,
    estimatedIncome: Math.round(estimatedIncome),
    netProfit: Math.round(netProfit),
    profitMargin: Math.round(profitMargin * 10) / 10,
  };
}

/**
 * Worked Example 1: Small Irrigated White Rice Farm (5 rai)
 * Basic setup with own labor
 */
export const EXAMPLE_1 = calculateRiceFarmingCost({
  raiSize: 5,
  riceVariety: 'white',
  isIrrigated: true,
  includeLabor: false,
  includeEquipmentRental: true,
});

/**
 * Worked Example 2: Medium Jasmine Rice Farm (10 rai)
 * Premium variety with hired labor and equipment
 */
export const EXAMPLE_2 = calculateRiceFarmingCost({
  raiSize: 10,
  riceVariety: 'jasmine',
  isIrrigated: true,
  includeLabor: true,
  includeEquipmentRental: true,
});

/**
 * Worked Example 3: Large Hybrid Rice Farm (20 rai)
 * Modern farming with all services
 */
export const EXAMPLE_3 = calculateRiceFarmingCost({
  raiSize: 20,
  riceVariety: 'hybrid',
  isIrrigated: true,
  includeLabor: true,
  includeEquipmentRental: true,
});
