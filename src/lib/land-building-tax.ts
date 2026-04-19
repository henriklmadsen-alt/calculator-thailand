export type LandBuildingTaxUsage =
  | 'agriculture'
  | 'residential_primary'
  | 'residential_secondary'
  | 'commercial'
  | 'vacant';

export interface LandBuildingTaxInput {
  appraisedValue: number;
  usage: LandBuildingTaxUsage;
  exemptionValue?: number;
  reliefPercent?: number;
}

interface TaxTier {
  upTo: number;
  ratePercent: number;
}

export interface LandBuildingTaxBreakdownItem {
  fromValue: number;
  toValue: number | null;
  taxableAmount: number;
  ratePercent: number;
  taxAmount: number;
}

export interface LandBuildingTaxResult {
  usage: LandBuildingTaxUsage;
  appraisedValue: number;
  exemptionValue: number;
  taxableBase: number;
  grossTax: number;
  reliefPercent: number;
  reliefAmount: number;
  netTax: number;
  effectiveRatePercent: number;
  breakdown: LandBuildingTaxBreakdownItem[];
}

const INFINITY = Number.POSITIVE_INFINITY;

const TAX_TIERS: Record<LandBuildingTaxUsage, TaxTier[]> = {
  agriculture: [
    { upTo: 75_000_000, ratePercent: 0.01 },
    { upTo: 100_000_000, ratePercent: 0.03 },
    { upTo: 500_000_000, ratePercent: 0.05 },
    { upTo: 1_000_000_000, ratePercent: 0.07 },
    { upTo: INFINITY, ratePercent: 0.1 },
  ],
  residential_primary: [
    { upTo: 25_000_000, ratePercent: 0.03 },
    { upTo: 50_000_000, ratePercent: 0.05 },
    { upTo: INFINITY, ratePercent: 0.1 },
  ],
  residential_secondary: [
    { upTo: 50_000_000, ratePercent: 0.02 },
    { upTo: 75_000_000, ratePercent: 0.03 },
    { upTo: 100_000_000, ratePercent: 0.05 },
    { upTo: INFINITY, ratePercent: 0.1 },
  ],
  commercial: [
    { upTo: 50_000_000, ratePercent: 0.3 },
    { upTo: 200_000_000, ratePercent: 0.4 },
    { upTo: 1_000_000_000, ratePercent: 0.5 },
    { upTo: 5_000_000_000, ratePercent: 0.6 },
    { upTo: INFINITY, ratePercent: 0.7 },
  ],
  vacant: [
    { upTo: 50_000_000, ratePercent: 0.3 },
    { upTo: 200_000_000, ratePercent: 0.4 },
    { upTo: 1_000_000_000, ratePercent: 0.5 },
    { upTo: 5_000_000_000, ratePercent: 0.6 },
    { upTo: INFINITY, ratePercent: 0.7 },
  ],
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toNonNegativeNumber(value: number | undefined): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, value as number);
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function resolveDefaultExemption(usage: LandBuildingTaxUsage): number {
  if (usage === 'residential_primary') {
    return 50_000_000;
  }
  return 0;
}

function calculateProgressiveTax(taxableBase: number, tiers: TaxTier[]): LandBuildingTaxBreakdownItem[] {
  const breakdown: LandBuildingTaxBreakdownItem[] = [];
  let remaining = taxableBase;
  let previousCap = 0;

  for (const tier of tiers) {
    if (remaining <= 0) {
      break;
    }

    const cap = Number.isFinite(tier.upTo) ? tier.upTo : INFINITY;
    const tierSpan = cap - previousCap;
    const taxableAmount = Math.min(remaining, tierSpan);

    if (taxableAmount <= 0) {
      previousCap = cap;
      continue;
    }

    const taxAmount = taxableAmount * (tier.ratePercent / 100);

    breakdown.push({
      fromValue: previousCap,
      toValue: Number.isFinite(cap) ? cap : null,
      taxableAmount: roundCurrency(taxableAmount),
      ratePercent: tier.ratePercent,
      taxAmount: roundCurrency(taxAmount),
    });

    remaining -= taxableAmount;
    previousCap = cap;
  }

  return breakdown;
}

export function calculateLandBuildingTax(input: LandBuildingTaxInput): LandBuildingTaxResult {
  const usage = input.usage;
  const appraisedValue = toNonNegativeNumber(input.appraisedValue);
  const configuredExemption = toNonNegativeNumber(input.exemptionValue);
  const exemptionValue = Math.min(appraisedValue, configuredExemption || resolveDefaultExemption(usage));
  const taxableBase = Math.max(0, appraisedValue - exemptionValue);

  const reliefPercent = clamp(toNonNegativeNumber(input.reliefPercent), 0, 100);
  const breakdown = calculateProgressiveTax(taxableBase, TAX_TIERS[usage]);
  const grossTax = breakdown.reduce((sum, item) => sum + item.taxAmount, 0);
  const reliefAmount = grossTax * (reliefPercent / 100);
  const netTax = Math.max(0, grossTax - reliefAmount);
  const effectiveRatePercent = appraisedValue > 0 ? (netTax / appraisedValue) * 100 : 0;

  return {
    usage,
    appraisedValue: roundCurrency(appraisedValue),
    exemptionValue: roundCurrency(exemptionValue),
    taxableBase: roundCurrency(taxableBase),
    grossTax: roundCurrency(grossTax),
    reliefPercent: roundCurrency(reliefPercent),
    reliefAmount: roundCurrency(reliefAmount),
    netTax: roundCurrency(netTax),
    effectiveRatePercent: roundCurrency(effectiveRatePercent),
    breakdown,
  };
}
