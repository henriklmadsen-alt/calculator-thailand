export const DEFAULT_ELECTRICITY_FT_RATE = 0.0972;
export const ELECTRICITY_VAT_RATE = 0.07;

export const RESIDENTIAL_SERVICE_CHARGE_UP_TO_150 = 8.19;
export const RESIDENTIAL_SERVICE_CHARGE_OVER_150 = 24.62;
export const SMALL_BUSINESS_SERVICE_CHARGE = 33.29;

export type ElectricityProvider = 'mea' | 'pea';
export type ElectricityCustomerType = 'residential' | 'small_business';

export interface ElectricityBillInput {
  units: number;
  provider: ElectricityProvider;
  customerType: ElectricityCustomerType;
  ftRate?: number;
}

export interface ElectricityTierCharge {
  label: string;
  units: number;
  rate: number;
  amount: number;
}

export interface ElectricityBillResult {
  units: number;
  provider: ElectricityProvider;
  customerType: ElectricityCustomerType;
  tariffCode: string;
  energyCharge: number;
  ftCharge: number;
  serviceCharge: number;
  subtotalBeforeVat: number;
  vatAmount: number;
  totalBill: number;
  appliedFtRate: number;
  tierBreakdown: ElectricityTierCharge[];
}

const RESIDENTIAL_TIER_TABLE: Array<{ limit: number; rate: number; label: string }> = [
  { limit: 15, rate: 2.3488, label: '15 หน่วยแรก (1-15)' },
  { limit: 10, rate: 2.9882, label: '10 หน่วยต่อไป (16-25)' },
  { limit: 10, rate: 3.2405, label: '10 หน่วยต่อไป (26-35)' },
  { limit: 65, rate: 3.6237, label: '65 หน่วยต่อไป (36-100)' },
  { limit: 50, rate: 3.7171, label: '50 หน่วยต่อไป (101-150)' },
  { limit: Number.POSITIVE_INFINITY, rate: 4.4217, label: 'เกิน 150 หน่วย (151 ขึ้นไป)' },
];

const OVER_150_TIER_TABLE: Array<{ limit: number; rate: number; label: string }> = [
  { limit: 150, rate: 3.2484, label: '150 หน่วยแรก (1-150)' },
  { limit: 250, rate: 4.2218, label: '250 หน่วยต่อไป (151-400)' },
  { limit: Number.POSITIVE_INFINITY, rate: 4.4217, label: 'เกิน 400 หน่วย (401 ขึ้นไป)' },
];

function sanitizeNumber(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function normalizeFtRate(value: number | undefined): number {
  const fallback = DEFAULT_ELECTRICITY_FT_RATE;
  if (value === undefined || value === null) return fallback;
  const normalized = sanitizeNumber(value);
  return normalized >= 0 ? normalized : fallback;
}

function calculateTierEnergy(
  units: number,
  tiers: Array<{ limit: number; rate: number; label: string }>,
): { total: number; breakdown: ElectricityTierCharge[] } {
  let remainingUnits = sanitizeNumber(units);
  let total = 0;
  const breakdown: ElectricityTierCharge[] = [];

  for (const tier of tiers) {
    if (remainingUnits <= 0) break;

    const usedUnits = Math.min(remainingUnits, tier.limit);
    const amount = usedUnits * tier.rate;
    breakdown.push({
      label: tier.label,
      units: roundCurrency(usedUnits),
      rate: tier.rate,
      amount: roundCurrency(amount),
    });

    total += amount;
    remainingUnits -= usedUnits;
  }

  return {
    total: roundCurrency(total),
    breakdown,
  };
}

export function calculateElectricityBill(input: ElectricityBillInput): ElectricityBillResult {
  const units = sanitizeNumber(input.units);
  const ftRate = normalizeFtRate(input.ftRate);

  let tariffCode = '';
  let serviceCharge = 0;
  let energyCalc;

  if (input.customerType === 'residential') {
    if (units <= 150) {
      tariffCode = '1.1';
      serviceCharge = RESIDENTIAL_SERVICE_CHARGE_UP_TO_150;
      energyCalc = calculateTierEnergy(units, RESIDENTIAL_TIER_TABLE);
    } else {
      tariffCode = '1.2';
      serviceCharge = RESIDENTIAL_SERVICE_CHARGE_OVER_150;
      energyCalc = calculateTierEnergy(units, OVER_150_TIER_TABLE);
    }
  } else {
    tariffCode = '2.1.2';
    serviceCharge = SMALL_BUSINESS_SERVICE_CHARGE;
    energyCalc = calculateTierEnergy(units, OVER_150_TIER_TABLE);
  }

  const energyCharge = energyCalc.total;
  const ftCharge = roundCurrency(units * ftRate);
  const subtotalBeforeVat = roundCurrency(energyCharge + ftCharge + serviceCharge);
  const vatAmount = roundCurrency(subtotalBeforeVat * ELECTRICITY_VAT_RATE);
  const totalBill = roundCurrency(subtotalBeforeVat + vatAmount);

  return {
    units: roundCurrency(units),
    provider: input.provider,
    customerType: input.customerType,
    tariffCode,
    energyCharge,
    ftCharge,
    serviceCharge: roundCurrency(serviceCharge),
    subtotalBeforeVat,
    vatAmount,
    totalBill,
    appliedFtRate: ftRate,
    tierBreakdown: energyCalc.breakdown,
  };
}
