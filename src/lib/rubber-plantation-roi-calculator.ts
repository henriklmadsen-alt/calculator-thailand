/**
 * Thai Rubber Plantation ROI Calculator (คำนวณผลตอบแทนจากสวนยางพารา)
 *
 * Sources:
 * - Thai Rubber Association (สมาคมยางไทย)
 * - Rubber Research Institute (สถาบันวิจัยยาง)
 * - Thai Agricultural Standards 2024/2025
 *
 * Covers:
 * - Initial investment (land, seedlings, clearing)
 * - Annual maintenance costs (fertilizer, pesticide, labor)
 * - Tapping period (typically starts year 5-7)
 * - Yield per tree
 * - Market prices
 * - ROI calculation
 */

export interface RubberPlantationInput {
  raiSize: number;
  investmentYear: number; // Years until tapping
  numberOfTrees: number; // Typically 80-100 trees per rai
  annualYieldPerTree: number; // kg of dry rubber
}

export interface RubberPlantationResult {
  raiSize: number;
  numberOfTrees: number;
  annualYieldPerTree: number;

  // Costs
  initialInvestment: number;
  annualMaintenanceCost: number;
  totalInvestmentToTapping: number;

  // Revenue (year 1 of tapping)
  annualYield: number;
  annualRevenue: number;

  // ROI
  netProfitFirstYear: number;
  roiPercentage: number;
  paybackPeriod: number; // years
}

function getInitialInvestment(raiSize: number): number {
  // Land prep + seedlings + tools: ~15,000-20,000 THB/rai
  const costPerRai = 17500;
  return raiSize * costPerRai;
}

function getAnnualMaintenanceCost(raiSize: number, numberOfTrees: number): number {
  // Weeding, fertilizer, pesticide, labor: ~3,000-5,000 THB/rai/year
  const costPerRai = 4000;
  return raiSize * costPerRai;
}

export function calculateRubberPlantationROI(input: RubberPlantationInput): RubberPlantationResult {
  const initialInvest = getInitialInvestment(input.raiSize);
  const annualMaint = getAnnualMaintenanceCost(input.raiSize, input.numberOfTrees);
  const totalToTapping = initialInvest + (annualMaint * input.investmentYear);

  // Annual yield at maturity
  const annualYield = input.numberOfTrees * input.annualYieldPerTree;
  // Market price ~40-60 THB/kg for dry rubber (average 50 THB/kg)
  const pricePerKg = 50;
  const annualRevenue = annualYield * pricePerKg;

  const netProfit = annualRevenue - annualMaint;
  const roiPercentage = (netProfit / initialInvest) * 100;
  const paybackPeriod = totalToTapping / netProfit;

  return {
    raiSize: input.raiSize,
    numberOfTrees: input.numberOfTrees,
    annualYieldPerTree: input.annualYieldPerTree,
    initialInvestment: Math.round(initialInvest),
    annualMaintenanceCost: Math.round(annualMaint),
    totalInvestmentToTapping: Math.round(totalToTapping),
    annualYield: Math.round(annualYield),
    annualRevenue: Math.round(annualRevenue),
    netProfitFirstYear: Math.round(netProfit),
    roiPercentage: Math.round(roiPercentage * 10) / 10,
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
  };
}

export const EXAMPLE_1 = calculateRubberPlantationROI({
  raiSize: 10,
  investmentYear: 6,
  numberOfTrees: 850,
  annualYieldPerTree: 3,
});

export const EXAMPLE_2 = calculateRubberPlantationROI({
  raiSize: 20,
  investmentYear: 5,
  numberOfTrees: 1700,
  annualYieldPerTree: 4,
});

export const EXAMPLE_3 = calculateRubberPlantationROI({
  raiSize: 30,
  investmentYear: 6,
  numberOfTrees: 2550,
  annualYieldPerTree: 3.5,
});
