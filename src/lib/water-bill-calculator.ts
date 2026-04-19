export type WaterUtilityProvider = 'mwa_residential' | 'pwa_table_1' | 'pwa_table_2' | 'pwa_table_3';
export type MwaMeterSize = '1/2' | '3/4' | '1' | '1 1/2' | '2' | '3' | '4' | '6' | '8' | '12' | '16';

interface TierRate {
  upTo: number;
  rate: number;
}

export interface TierChargeBreakdown {
  label: string;
  units: number;
  rate: number;
  amount: number;
}

export interface WaterBillInput {
  provider: WaterUtilityProvider;
  unitsUsed: number;
  meterSize?: MwaMeterSize;
  includeVat?: boolean;
  vatRatePercent?: number;
}

export interface WaterBillResult {
  provider: WaterUtilityProvider;
  providerLabel: string;
  unitsUsed: number;
  baseCharge: number;
  minimumChargeFloor: number;
  minimumChargeAdjustment: number;
  serviceFee: number;
  rawWaterSurcharge: number;
  totalBeforeVat: number;
  vatAmount: number;
  totalAmount: number;
  tierBreakdown: TierChargeBreakdown[];
}

const MAX_VAT_PERCENT = 100;
const MWA_RAW_WATER_SURCHARGE_PER_UNIT = 0.15;

export const MWA_METER_SERVICE_FEES: Record<MwaMeterSize, number> = {
  '1/2': 25,
  '3/4': 40,
  '1': 50,
  '1 1/2': 80,
  '2': 300,
  '3': 400,
  '4': 500,
  '6': 900,
  '8': 1100,
  '12': 3500,
  '16': 5000,
};

export const WATER_PROVIDER_LABELS: Record<WaterUtilityProvider, string> = {
  mwa_residential: 'กปน. (บ้านอยู่อาศัย)',
  pwa_table_1: 'กปภ. ตาราง 1 (พื้นที่ร่วมลงทุนเอกชน)',
  pwa_table_2: 'กปภ. ตาราง 2 (ภูเก็ต/สมุย/พงัน)',
  pwa_table_3: 'กปภ. ตาราง 3 (พื้นที่อื่นทั่วประเทศ)',
};

const MWA_RESIDENTIAL_TIERS: TierRate[] = [
  { upTo: 30, rate: 8.5 },
  { upTo: 40, rate: 10.03 },
  { upTo: 50, rate: 10.35 },
  { upTo: 60, rate: 10.68 },
  { upTo: 70, rate: 11.0 },
  { upTo: 80, rate: 11.33 },
  { upTo: 90, rate: 12.5 },
  { upTo: 100, rate: 12.82 },
  { upTo: 120, rate: 13.15 },
  { upTo: 160, rate: 13.47 },
  { upTo: 200, rate: 13.8 },
  { upTo: Number.POSITIVE_INFINITY, rate: 14.45 },
];

const PWA_TYPE1_FIRST_50_UNITS_TIERS: TierRate[] = [
  { upTo: 10, rate: 10.2 },
  { upTo: 20, rate: 16.0 },
  { upTo: 30, rate: 19.0 },
  { upTo: 50, rate: 21.2 },
];

const PWA_TYPE2_AFTER_50_BY_TABLE: Record<'pwa_table_1' | 'pwa_table_2' | 'pwa_table_3', TierRate[]> = {
  pwa_table_1: [
    { upTo: 80, rate: 23.0 },
    { upTo: 100, rate: 24.0 },
    { upTo: 300, rate: 27.4 },
    { upTo: 1000, rate: 27.5 },
    { upTo: 2000, rate: 27.6 },
    { upTo: 3000, rate: 27.8 },
    { upTo: Number.POSITIVE_INFINITY, rate: 28.0 },
  ],
  pwa_table_2: [
    { upTo: 80, rate: 24.0 },
    { upTo: 100, rate: 26.0 },
    { upTo: 300, rate: 30.25 },
    { upTo: 1000, rate: 30.25 },
    { upTo: 2000, rate: 30.25 },
    { upTo: 3000, rate: 30.25 },
    { upTo: Number.POSITIVE_INFINITY, rate: 30.25 },
  ],
  pwa_table_3: [
    { upTo: 80, rate: 21.6 },
    { upTo: 100, rate: 21.65 },
    { upTo: 300, rate: 21.7 },
    { upTo: 1000, rate: 21.75 },
    { upTo: 2000, rate: 21.8 },
    { upTo: 3000, rate: 21.85 },
    { upTo: Number.POSITIVE_INFINITY, rate: 21.9 },
  ],
};

const PWA_MINIMUM_CHARGE_BY_TABLE: Record<'pwa_table_1' | 'pwa_table_2' | 'pwa_table_3', number> = {
  pwa_table_1: 150,
  pwa_table_2: 150,
  pwa_table_3: 150,
};

function toNonNegativeNumber(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, value);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function calculateTierCharge(unitsUsed: number, tiers: TierRate[], startFromUnit = 1): {
  amount: number;
  breakdown: TierChargeBreakdown[];
} {
  if (unitsUsed <= 0) {
    return { amount: 0, breakdown: [] };
  }

  let remaining = unitsUsed;
  let amount = 0;
  let previousBoundary = startFromUnit - 1;
  const breakdown: TierChargeBreakdown[] = [];

  for (const tier of tiers) {
    if (remaining <= 0) {
      break;
    }

    const nextBoundary = Number.isFinite(tier.upTo) ? tier.upTo : Number.POSITIVE_INFINITY;
    const availableInTier = Number.isFinite(nextBoundary)
      ? Math.max(0, nextBoundary - previousBoundary)
      : remaining;
    const unitsInTier = Math.min(remaining, availableInTier);

    if (unitsInTier <= 0) {
      previousBoundary = nextBoundary;
      continue;
    }

    const tierAmount = unitsInTier * tier.rate;
    amount += tierAmount;

    const label = Number.isFinite(nextBoundary)
      ? `หน่วยที่ ${previousBoundary + 1}-${nextBoundary}`
      : `หน่วยที่ ${previousBoundary + 1} ขึ้นไป`;

    breakdown.push({
      label,
      units: roundCurrency(unitsInTier),
      rate: roundCurrency(tier.rate),
      amount: roundCurrency(tierAmount),
    });

    remaining -= unitsInTier;
    previousBoundary = nextBoundary;
  }

  return {
    amount: roundCurrency(amount),
    breakdown,
  };
}

function calculatePwaResidentialBaseCharge(provider: 'pwa_table_1' | 'pwa_table_2' | 'pwa_table_3', unitsUsed: number): {
  amount: number;
  breakdown: TierChargeBreakdown[];
} {
  const firstFiftyUnits = Math.min(unitsUsed, 50);
  const firstPart = calculateTierCharge(firstFiftyUnits, PWA_TYPE1_FIRST_50_UNITS_TIERS, 1);

  if (unitsUsed <= 50) {
    return firstPart;
  }

  const unitsAboveFifty = unitsUsed - 50;
  const afterFiftyTiers = PWA_TYPE2_AFTER_50_BY_TABLE[provider];
  const afterPart = calculateTierCharge(unitsAboveFifty, afterFiftyTiers, 51);

  return {
    amount: roundCurrency(firstPart.amount + afterPart.amount),
    breakdown: [...firstPart.breakdown, ...afterPart.breakdown],
  };
}

export function calculateWaterBill(input: WaterBillInput): WaterBillResult {
  const provider = input.provider;
  const unitsUsed = toNonNegativeNumber(input.unitsUsed);
  const meterSize = input.meterSize || '1/2';
  const includeVat = input.includeVat !== false;
  const vatRatePercent = clamp(toNonNegativeNumber(input.vatRatePercent ?? 7), 0, MAX_VAT_PERCENT);

  let baseCharge = 0;
  let minimumChargeFloor = 0;
  let serviceFee = 0;
  let rawWaterSurcharge = 0;
  let tierBreakdown: TierChargeBreakdown[] = [];

  if (provider === 'mwa_residential') {
    const tierCharge = calculateTierCharge(unitsUsed, MWA_RESIDENTIAL_TIERS, 1);
    baseCharge = tierCharge.amount;
    tierBreakdown = tierCharge.breakdown;
    serviceFee = MWA_METER_SERVICE_FEES[meterSize];
    rawWaterSurcharge = roundCurrency(unitsUsed * MWA_RAW_WATER_SURCHARGE_PER_UNIT);
  } else {
    const tierCharge = calculatePwaResidentialBaseCharge(provider, unitsUsed);
    baseCharge = tierCharge.amount;
    tierBreakdown = tierCharge.breakdown;
    minimumChargeFloor = PWA_MINIMUM_CHARGE_BY_TABLE[provider];
  }

  const minimumChargeAdjustment = minimumChargeFloor > 0
    ? Math.max(0, minimumChargeFloor - baseCharge)
    : 0;

  const totalBeforeVat = roundCurrency(baseCharge + minimumChargeAdjustment + serviceFee + rawWaterSurcharge);
  const vatAmount = includeVat ? roundCurrency(totalBeforeVat * (vatRatePercent / 100)) : 0;
  const totalAmount = roundCurrency(totalBeforeVat + vatAmount);

  return {
    provider,
    providerLabel: WATER_PROVIDER_LABELS[provider],
    unitsUsed: roundCurrency(unitsUsed),
    baseCharge: roundCurrency(baseCharge),
    minimumChargeFloor: roundCurrency(minimumChargeFloor),
    minimumChargeAdjustment: roundCurrency(minimumChargeAdjustment),
    serviceFee: roundCurrency(serviceFee),
    rawWaterSurcharge: roundCurrency(rawWaterSurcharge),
    totalBeforeVat,
    vatAmount,
    totalAmount,
    tierBreakdown,
  };
}
