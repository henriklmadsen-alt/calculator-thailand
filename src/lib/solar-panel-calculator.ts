// Solar Panel Savings Calculator for Thailand
// Based on Thailand Solar Irradiance data and typical residential rooftop systems

/** Average peak sun hours per day by Thai region */
export const PEAK_SUN_HOURS: Record<string, number> = {
  central: 4.5,   // กรุงเทพฯ และภาคกลาง
  northeast: 4.8, // ภาคตะวันออกเฉียงเหนือ (อีสาน)
  north: 4.3,     // ภาคเหนือ
  south: 4.0,     // ภาคใต้
  east: 4.5,      // ภาคตะวันออก
};

/** Default values */
export const DEFAULT_ELECTRICITY_RATE = 4.2;       // บาท/kWh (avg residential >150 units)
export const DEFAULT_PERFORMANCE_RATIO = 0.80;     // accounts for heat, dust, inverter loss
export const DEFAULT_SYSTEM_COST_PER_KW = 25000;   // บาท/kW installed (2569 market price)
export const DEFAULT_PANEL_LIFESPAN_YEARS = 25;
export const DEFAULT_ANNUAL_DEGRADATION = 0.005;   // 0.5% per year
export const DEFAULT_MAINTENANCE_ANNUAL = 2000;    // บาท/year basic cleaning & check

export type ThaiRegion = 'central' | 'northeast' | 'north' | 'south' | 'east';

export interface SolarPanelInput {
  systemSizeKw: number;          // ขนาดระบบ (kW)
  monthlyBillThb: number;        // ค่าไฟรายเดือนปัจจุบัน (บาท)
  electricityRate: number;       // อัตราค่าไฟเฉลี่ย (บาท/kWh)
  systemCostPerKw: number;       // ราคาติดตั้งต่อ kW (บาท)
  region: ThaiRegion;            // ภูมิภาค
  roofDirection: 'south' | 'east_west' | 'north'; // ทิศหลังคา
}

export interface SolarYearRow {
  year: number;
  productionKwh: number;
  savingsThb: number;
  cumulativeSavingsThb: number;
  maintenanceCostThb: number;
  netCumulativeSavingsThb: number;
}

export interface SolarPanelResult {
  systemSizeKw: number;
  totalSystemCost: number;
  region: ThaiRegion;
  peakSunHours: number;
  roofDirectionFactor: number;
  performanceRatio: number;

  // Annual figures (year 1)
  dailyProductionKwh: number;
  monthlyProductionKwh: number;
  annualProductionKwh: number;
  monthlySavingsThb: number;
  annualSavingsThb: number;

  // Long-term
  paybackYears: number;
  totalSavings25yr: number;
  totalMaintenance25yr: number;
  netSavings25yr: number;
  roiPercent: number;
  co2ReductionTonsPerYear: number;

  yearlyBreakdown: SolarYearRow[];
}

function sanitizeNumber(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function getRoofDirectionFactor(direction: string): number {
  switch (direction) {
    case 'south': return 1.0;        // optimal for Thailand (northern hemisphere)
    case 'east_west': return 0.85;   // ~15% less
    case 'north': return 0.70;       // ~30% less
    default: return 1.0;
  }
}

/** Thailand grid emission factor: ~0.499 tCO2/MWh (EGAT 2024) */
const CO2_FACTOR_TONS_PER_KWH = 0.000499;

export function calculateSolarSavings(input: SolarPanelInput): SolarPanelResult {
  const systemSizeKw = sanitizeNumber(input.systemSizeKw);
  const monthlyBillThb = sanitizeNumber(input.monthlyBillThb);
  const electricityRate = sanitizeNumber(input.electricityRate) || DEFAULT_ELECTRICITY_RATE;
  const systemCostPerKw = sanitizeNumber(input.systemCostPerKw) || DEFAULT_SYSTEM_COST_PER_KW;
  const region = input.region || 'central';
  const roofDirection = input.roofDirection || 'south';

  const peakSunHours = PEAK_SUN_HOURS[region] || 4.5;
  const roofFactor = getRoofDirectionFactor(roofDirection);
  const performanceRatio = DEFAULT_PERFORMANCE_RATIO;

  const totalSystemCost = roundCurrency(systemSizeKw * systemCostPerKw);

  // Year 1 production
  const dailyProductionKwh = roundCurrency(
    systemSizeKw * peakSunHours * performanceRatio * roofFactor
  );
  const monthlyProductionKwh = roundCurrency(dailyProductionKwh * 30);
  const annualProductionKwh = roundCurrency(dailyProductionKwh * 365);

  // Monthly savings capped at current bill
  const rawMonthlySavings = roundCurrency(monthlyProductionKwh * electricityRate);
  const monthlySavingsThb = roundCurrency(Math.min(rawMonthlySavings, monthlyBillThb));
  const annualSavingsThb = roundCurrency(monthlySavingsThb * 12);

  // 25-year breakdown with degradation
  const yearlyBreakdown: SolarYearRow[] = [];
  let cumulativeSavings = 0;
  let totalMaintenance = 0;
  let totalSavings = 0;
  let paybackYears = DEFAULT_PANEL_LIFESPAN_YEARS + 1; // default if never pays back
  let paybackFound = false;

  for (let year = 1; year <= DEFAULT_PANEL_LIFESPAN_YEARS; year++) {
    const degradationFactor = 1 - DEFAULT_ANNUAL_DEGRADATION * (year - 1);
    const yearProductionKwh = roundCurrency(annualProductionKwh * degradationFactor);
    const rawYearSavings = roundCurrency(yearProductionKwh * electricityRate);
    const yearSavings = roundCurrency(Math.min(rawYearSavings, monthlyBillThb * 12));
    const yearMaintenance = DEFAULT_MAINTENANCE_ANNUAL;

    totalSavings += yearSavings;
    totalMaintenance += yearMaintenance;
    cumulativeSavings += yearSavings;
    const netCumulative = roundCurrency(cumulativeSavings - totalMaintenance - totalSystemCost);

    yearlyBreakdown.push({
      year,
      productionKwh: yearProductionKwh,
      savingsThb: yearSavings,
      cumulativeSavingsThb: roundCurrency(cumulativeSavings),
      maintenanceCostThb: yearMaintenance,
      netCumulativeSavingsThb: netCumulative,
    });

    if (!paybackFound && netCumulative >= 0) {
      paybackYears = year;
      paybackFound = true;
    }
  }

  const netSavings25yr = roundCurrency(totalSavings - totalMaintenance - totalSystemCost);
  const roiPercent = totalSystemCost > 0
    ? roundCurrency((netSavings25yr / totalSystemCost) * 100)
    : 0;

  const co2ReductionTonsPerYear = roundCurrency(annualProductionKwh * CO2_FACTOR_TONS_PER_KWH);

  return {
    systemSizeKw,
    totalSystemCost,
    region,
    peakSunHours,
    roofDirectionFactor: roofFactor,
    performanceRatio,
    dailyProductionKwh,
    monthlyProductionKwh,
    annualProductionKwh,
    monthlySavingsThb,
    annualSavingsThb,
    paybackYears: paybackFound ? paybackYears : -1,
    totalSavings25yr: roundCurrency(totalSavings),
    totalMaintenance25yr: roundCurrency(totalMaintenance),
    netSavings25yr,
    roiPercent,
    co2ReductionTonsPerYear,
    yearlyBreakdown,
  };
}
