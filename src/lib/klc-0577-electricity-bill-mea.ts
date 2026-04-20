/**
 * Electricity Bill Calculator - MEA/PEA Rates (KLC-0577)
 *
 * Sources:
 * - Provincial Electricity Authority (PEA) Tariff T22 2024
 * - Metropolitan Electricity Authority (MEA) Tariff T12 2024
 * - Thailand Revenue Code Section 107 Bis (VAT 7%)
 *
 * Calculates:
 * - Tiered electricity charges based on consumption
 * - Service charge (ft. charge)
 * - VAT and total monthly bill
 */

export type ElectricityProvider = 'mea' | 'pea';
export type CustomerType = 'residential' | 'business';

export interface ElectricityBillInput {
  units: number; // kWh consumed
  provider: ElectricityProvider;
  customerType: CustomerType;
  ftRate?: number;
}

export interface TierCharge {
  label: string;
  units: number;
  rate: number;
  amount: number;
}

export interface ElectricityBillResult {
  units: number;
  provider: ElectricityProvider;
  customerType: CustomerType;
  tariffCode: string;
  energyCharge: number;
  serviceCharge: number;
  subtotal: number;
  vat: number;
  totalBill: number;
  tiers: TierCharge[];
}

const DEFAULT_FT_RATE = 0.0972; // THB/kWh (Ft Charge 2024)
const VAT_RATE = 0.07;

// MEA Residential Tier rates 2024 (Tariff T12)
const MEA_RESIDENTIAL_TIERS = [
  { limit: 15, rate: 2.3488, label: '1-15 หน่วย' },
  { limit: 10, rate: 2.9882, label: '16-25 หน่วย' },
  { limit: 10, rate: 3.2405, label: '26-35 หน่วย' },
  { limit: 65, rate: 3.6237, label: '36-100 หน่วย' },
  { limit: 50, rate: 3.7171, label: '101-150 หน่วย' },
  { limit: Infinity, rate: 4.4217, label: '151+ หน่วย' },
];

// PEA Residential Tier rates 2024 (Tariff T22)
const PEA_RESIDENTIAL_TIERS = [
  { limit: 50, rate: 2.8073, label: '1-50 หน่วย' },
  { limit: 50, rate: 3.1491, label: '51-100 หน่วย' },
  { limit: Infinity, rate: 3.8891, label: '101+ หน่วย' },
];

// Business rates (simplified)
const BUSINESS_RATE = 3.5;

const MEA_SERVICE_CHARGE_UP_TO_150 = 8.19;
const MEA_SERVICE_CHARGE_OVER_150 = 24.62;
const PEA_SERVICE_CHARGE = 20.0;

export function calculateElectricityBill(input: ElectricityBillInput): ElectricityBillResult {
  const tiers = input.provider === 'mea' ? MEA_RESIDENTIAL_TIERS : PEA_RESIDENTIAL_TIERS;

  // Calculate tiered energy charge
  let remaining = input.units;
  let energyCharge = 0;
  const tierBreakdown: TierCharge[] = [];

  for (const tier of tiers) {
    if (remaining <= 0) break;
    const chargeUnits = Math.min(remaining, tier.limit);
    const tierAmount = chargeUnits * tier.rate;
    energyCharge += tierAmount;
    tierBreakdown.push({
      label: tier.label,
      units: chargeUnits,
      rate: tier.rate,
      amount: Math.round(tierAmount * 100) / 100,
    });
    remaining -= chargeUnits;
  }

  // Service charge
  const serviceCharge =
    input.provider === 'mea'
      ? input.units <= 150
        ? MEA_SERVICE_CHARGE_UP_TO_150
        : MEA_SERVICE_CHARGE_OVER_150
      : PEA_SERVICE_CHARGE;

  // Subtotal before VAT
  const subtotal = energyCharge + serviceCharge;

  // VAT (7%)
  const vat = subtotal * VAT_RATE;

  // Total
  const totalBill = subtotal + vat;

  return {
    units: input.units,
    provider: input.provider,
    customerType: input.customerType,
    tariffCode: input.provider === 'mea' ? 'T12' : 'T22',
    energyCharge: Math.round(energyCharge * 100) / 100,
    serviceCharge: Math.round(serviceCharge * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    vat: Math.round(vat * 100) / 100,
    totalBill: Math.round(totalBill * 100) / 100,
    tiers: tierBreakdown,
  };
}

/**
 * Example 1: MEA residential 80 kWh (typical Thai home)
 */
export const EXAMPLE_1 = calculateElectricityBill({
  units: 80,
  provider: 'mea',
  customerType: 'residential',
});

/**
 * Example 2: MEA residential 200 kWh (high usage, AC)
 */
export const EXAMPLE_2 = calculateElectricityBill({
  units: 200,
  provider: 'mea',
  customerType: 'residential',
});

/**
 * Example 3: PEA residential 100 kWh (provincial area)
 */
export const EXAMPLE_3 = calculateElectricityBill({
  units: 100,
  provider: 'pea',
  customerType: 'residential',
});
