/**
 * Rainwater Harvesting ROI (KLC-0583)
 */

export interface RainharvesterInput {
  systemCost: number;
  roofAreaM2: number;
  annualRainfallMM: number;
  waterRate: number;
}

export interface RainharvesterResult {
  annualCollection: number;
  annualSavings: number;
  paybackYears: number;
}

export function calculateRainWaterROI(input: RainharvesterInput): RainharvesterResult {
  const annualCollection = (input.roofAreaM2 * input.annualRainfallMM / 1000) * 0.85;
  const annualSavings = Math.round(annualCollection * input.waterRate);
  const paybackYears = Math.round((input.systemCost / annualSavings) * 10) / 10;

  return { annualCollection: Math.round(annualCollection), annualSavings, paybackYears };
}

export const EXAMPLE_1 = calculateRainWaterROI({ systemCost: 80000, roofAreaM2: 100, annualRainfallMM: 1200, waterRate: 8 });
export const EXAMPLE_2 = calculateRainWaterROI({ systemCost: 150000, roofAreaM2: 200, annualRainfallMM: 1500, waterRate: 9 });
export const EXAMPLE_3 = calculateRainWaterROI({ systemCost: 50000, roofAreaM2: 80, annualRainfallMM: 1000, waterRate: 7 });
