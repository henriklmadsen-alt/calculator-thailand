/**
 * Water Bill Calculator (KLC-0578)
 *
 * Sources:
 * - Bangkok Metropolitan Administration (BMA) Water Works Authority Tariff 2024
 * - Provincial Waterworks Authority (PWA) Tariff 2024
 *
 * Calculates:
 * - Tiered water charges based on consumption
 * - Wastewater charge
 * - Separate utility tax
 * - Total monthly water bill
 */

export type WaterProvider = 'bma' | 'pwa';

export interface WaterBillInput {
  cubicMeters: number; // m³ (1 cubic meter = 1,000 liters)
  provider: WaterProvider;
}

export interface WaterTierCharge {
  label: string;
  units: number;
  rate: number;
  amount: number;
}

export interface WaterBillResult {
  cubicMeters: number;
  provider: WaterProvider;
  waterCharge: number;
  wastewaterCharge: number;
  utilityTax: number;
  totalBill: number;
  tiers: WaterTierCharge[];
}

// BMA Bangkok Water Tariff 2024 (stepped rate)
const BMA_WATER_TIERS = [
  { limit: 20, rate: 8.5, label: '0-20 ม³' },
  { limit: 30, rate: 10.5, label: '21-50 ม³' },
  { limit: Infinity, rate: 12.5, label: '51+ ม³' },
];

// PWA Provincial Water Tariff 2024 (stepped rate)
const PWA_WATER_TIERS = [
  { limit: 10, rate: 7.0, label: '0-10 ม³' },
  { limit: 20, rate: 9.0, label: '11-30 ม³' },
  { limit: Infinity, rate: 11.5, label: '31+ ม³' },
];

// Wastewater charge (approximately 90% of water charge)
const WASTEWATER_RATE = 0.9;

// Utility tax (1% of total water + wastewater)
const UTILITY_TAX_RATE = 0.01;

export function calculateWaterBill(input: WaterBillInput): WaterBillResult {
  const tiers = input.provider === 'bma' ? BMA_WATER_TIERS : PWA_WATER_TIERS;

  // Calculate tiered water charge
  let remaining = input.cubicMeters;
  let waterCharge = 0;
  const tierBreakdown: WaterTierCharge[] = [];

  for (const tier of tiers) {
    if (remaining <= 0) break;
    const chargeUnits = Math.min(remaining, tier.limit);
    const tierAmount = chargeUnits * tier.rate;
    waterCharge += tierAmount;
    tierBreakdown.push({
      label: tier.label,
      units: chargeUnits,
      rate: tier.rate,
      amount: Math.round(tierAmount * 100) / 100,
    });
    remaining -= chargeUnits;
  }

  // Wastewater charge
  const wastewaterCharge = waterCharge * WASTEWATER_RATE;

  // Subtotal before tax
  const subtotal = waterCharge + wastewaterCharge;

  // Utility tax
  const utilityTax = subtotal * UTILITY_TAX_RATE;

  // Total
  const totalBill = subtotal + utilityTax;

  return {
    cubicMeters: input.cubicMeters,
    provider: input.provider,
    waterCharge: Math.round(waterCharge * 100) / 100,
    wastewaterCharge: Math.round(wastewaterCharge * 100) / 100,
    utilityTax: Math.round(utilityTax * 100) / 100,
    totalBill: Math.round(totalBill * 100) / 100,
    tiers: tierBreakdown,
  };
}

/**
 * Example 1: BMA Bangkok, typical household 25 m³/month
 */
export const EXAMPLE_1 = calculateWaterBill({
  cubicMeters: 25,
  provider: 'bma',
});

/**
 * Example 2: BMA Bangkok, high usage 80 m³/month
 */
export const EXAMPLE_2 = calculateWaterBill({
  cubicMeters: 80,
  provider: 'bma',
});

/**
 * Example 3: PWA Provincial, typical 20 m³/month
 */
export const EXAMPLE_3 = calculateWaterBill({
  cubicMeters: 20,
  provider: 'pwa',
});
