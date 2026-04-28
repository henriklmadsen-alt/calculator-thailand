/**
 * Solar Panel ROI Calculator (KLC-0576)
 *
 * Sources:
 * - Provincial Electricity Authority (PEA) rate schedule 2024
 * - Metropolitan Electricity Authority (MEA) rate schedule 2024
 * - Thai solar installation cost benchmarks
 *
 * Calculates:
 * - Annual electricity savings from solar installation
 * - System costs and net installation cost
 * - Return on Investment (ROI) timeline
 * - Payback period
 * - 25-year lifetime savings
 */

export interface SolarROIInput {
  systemKW: number;           // Solar system size in kW
  installationCostPerKW: number; // THB per kW (typical: 40,000-60,000)
  currentMonthlyBill: number;  // Current monthly electricity bill in THB
  electricityRate: number;     // THB/kWh (typical: 3-4.5)
  systemEfficiencyLoss: number; // % per year (typical: 0.5-0.8%)
  systemLifespan: number;      // Years (typical: 25)
  annualMaintenanceCost: number; // THB (typical: 2,000-5,000)
}

export interface SolarROIResult {
  systemKW: number;
  installationCost: number;
  systemEfficiencyLoss: number;
  systemLifespan: number;

  // Annual performance
  annualProduction: number; // kWh
  annualEnergySavings: number; // THB
  annualMaintenanceCost: number; // THB
  netAnnualBenefit: number; // THB

  // Financial metrics
  paybackPeriodYears: number;
  roiPercentage: number;

  // Long-term
  totalLifetimeSavings: number; // 25 years
  totalLifetimeProduction: number; // kWh
}

const AVERAGE_DAILY_SUNLIGHT_HOURS = 4.5; // Thailand average
const SYSTEM_DERATING_FACTOR = 0.85; // 15% system losses (inverter, wiring, etc.)

export function calculateSolarROI(input: SolarROIInput): SolarROIResult {
  // Installation cost
  const installationCost = input.systemKW * input.installationCostPerKW;

  // Annual production (accounting for system losses and derating)
  const theoreticalAnnual = input.systemKW * AVERAGE_DAILY_SUNLIGHT_HOURS * 365;
  const actualAnnualProduction = theoreticalAnnual * SYSTEM_DERATING_FACTOR;

  // Annual energy savings (at today's rate)
  const annualEnergySavings = actualAnnualProduction * input.electricityRate;

  // Net annual benefit (after maintenance)
  const netAnnualBenefit = annualEnergySavings - input.annualMaintenanceCost;

  // Payback period - simple calculation (not accounting for degradation)
  const paybackPeriodYears = installationCost / netAnnualBenefit;

  // ROI percentage (annual)
  const roiPercentage = (netAnnualBenefit / installationCost) * 100;

  // Lifetime calculations
  let totalLifetimeSavings = 0;
  let totalLifetimeProduction = 0;
  let currentProduction = actualAnnualProduction;

  for (let year = 0; year < input.systemLifespan; year++) {
    totalLifetimeProduction += currentProduction;
    const yearlySavings = currentProduction * input.electricityRate - input.annualMaintenanceCost;
    totalLifetimeSavings += yearlySavings;
    // Degrade system efficiency
    currentProduction *= (1 - input.systemEfficiencyLoss / 100);
  }

  return {
    systemKW: input.systemKW,
    installationCost: Math.round(installationCost),
    systemEfficiencyLoss: input.systemEfficiencyLoss,
    systemLifespan: input.systemLifespan,
    annualProduction: Math.round(actualAnnualProduction),
    annualEnergySavings: Math.round(annualEnergySavings),
    annualMaintenanceCost: Math.round(input.annualMaintenanceCost),
    netAnnualBenefit: Math.round(netAnnualBenefit),
    paybackPeriodYears: Math.round(paybackPeriodYears * 10) / 10,
    roiPercentage: Math.round(roiPercentage * 10) / 10,
    totalLifetimeSavings: Math.round(totalLifetimeSavings),
    totalLifetimeProduction: Math.round(totalLifetimeProduction),
  };
}

/**
 * Example 1: Small residential system (5 kW) - typical Thai home
 * Cost: 250,000 THB, current bill: 2,000 THB/month, rate: 4 THB/kWh
 */
export const EXAMPLE_1 = calculateSolarROI({
  systemKW: 5,
  installationCostPerKW: 50000,
  currentMonthlyBill: 2000,
  electricityRate: 4.0,
  systemEfficiencyLoss: 0.7,
  systemLifespan: 25,
  annualMaintenanceCost: 3000,
});

/**
 * Example 2: Medium system (10 kW) - small business
 * Cost: 500,000 THB, current bill: 5,000 THB/month, rate: 3.8 THB/kWh
 */
export const EXAMPLE_2 = calculateSolarROI({
  systemKW: 10,
  installationCostPerKW: 50000,
  currentMonthlyBill: 5000,
  electricityRate: 3.8,
  systemEfficiencyLoss: 0.7,
  systemLifespan: 25,
  annualMaintenanceCost: 5000,
});

/**
 * Example 3: Large system (20 kW) - commercial
 * Cost: 900,000 THB, current bill: 12,000 THB/month, rate: 3.5 THB/kWh
 */
export const EXAMPLE_3 = calculateSolarROI({
  systemKW: 20,
  installationCostPerKW: 45000,
  currentMonthlyBill: 12000,
  electricityRate: 3.5,
  systemEfficiencyLoss: 0.7,
  systemLifespan: 25,
  annualMaintenanceCost: 8000,
});
