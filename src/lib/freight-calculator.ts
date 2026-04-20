/**
 * Freight Cost Calculator for Thai domestic logistics
 *
 * Modes: Truck (รถบรรทุก), Rail (รถไฟ), Sea (เรือ)
 *
 * Rate sources (approximate 2025–2026):
 * - Truck: DLT / industry average ≈ 1.5–3.0 THB/kg depending on distance
 * - Rail: SRT published cargo rates (State Railway of Thailand)
 * - Sea: Thai Maritime / coastal shipping estimates
 *
 * Freight uses the greater of actual weight vs volumetric weight (CBM-based).
 * Volumetric divisor for freight: 6,000 (industry standard for road/rail).
 * Sea freight uses CBM directly.
 */

export type FreightMode = 'truck' | 'rail' | 'sea';

export interface FreightInput {
  /** Actual weight in kg */
  weightKg: number;
  /** Length in cm */
  lengthCm: number;
  /** Width in cm */
  widthCm: number;
  /** Height in cm */
  heightCm: number;
  /** Distance in km */
  distanceKm: number;
  /** Transport mode */
  mode: FreightMode;
}

export interface FreightQuote {
  mode: FreightMode;
  modeNameTh: string;
  modeNameEn: string;
  baseCost: number;
  fuelSurcharge: number;
  insuranceCost: number;
  totalCost: number;
  chargedWeight: number;
  volumetricWeight: number;
  cbm: number;
  costPerKg: number;
  estimatedDays: string;
  note: string;
}

export interface FreightResult {
  quotes: FreightQuote[];
  cheapest: FreightQuote;
  fastest: FreightQuote;
  input: FreightInput;
  actualWeight: number;
  volumetricWeight: number;
  cbm: number;
  chargedWeight: number;
}

const FREIGHT_VOLUMETRIC_DIVISOR = 6000;

function calcCBM(l: number, w: number, h: number): number {
  return (l * w * h) / 1_000_000; // cm³ → m³
}

function calcVolumetricWeight(l: number, w: number, h: number): number {
  return (l * w * h) / FREIGHT_VOLUMETRIC_DIVISOR;
}

function roundTo(value: number, decimals: number = 2): number {
  const f = Math.pow(10, decimals);
  return Math.round(value * f) / f;
}

// ─── Truck rates ───────────────────────────────────────────────────
// Base rate per kg varies by distance bracket
// Fuel surcharge: 8% of base
// Insurance: 0.1% of declared value (we estimate 100 THB/kg as proxy)
function calcTruck(chargedWeight: number, distanceKm: number): { base: number; fuel: number; insurance: number } {
  let ratePerKg: number;
  if (distanceKm <= 100) {
    ratePerKg = 1.5;
  } else if (distanceKm <= 300) {
    ratePerKg = 2.0;
  } else if (distanceKm <= 500) {
    ratePerKg = 2.5;
  } else if (distanceKm <= 800) {
    ratePerKg = 3.0;
  } else {
    ratePerKg = 3.5;
  }

  // Minimum charge: 500 THB
  const base = Math.max(chargedWeight * ratePerKg, 500);
  const fuel = roundTo(base * 0.08);
  const insurance = roundTo(chargedWeight * 100 * 0.001);

  return { base: roundTo(base), fuel, insurance };
}

function getTruckDays(distanceKm: number): string {
  if (distanceKm <= 200) return '1-2 วัน';
  if (distanceKm <= 500) return '2-3 วัน';
  if (distanceKm <= 800) return '3-4 วัน';
  return '4-7 วัน';
}

// ─── Rail rates ────────────────────────────────────────────────────
// SRT cargo rate tiers: cheaper per kg, but slower
// Base rate: ~0.8–1.8 THB/kg by distance
function calcRail(chargedWeight: number, distanceKm: number): { base: number; fuel: number; insurance: number } {
  let ratePerKg: number;
  if (distanceKm <= 100) {
    ratePerKg = 0.8;
  } else if (distanceKm <= 300) {
    ratePerKg = 1.0;
  } else if (distanceKm <= 500) {
    ratePerKg = 1.3;
  } else if (distanceKm <= 800) {
    ratePerKg = 1.5;
  } else {
    ratePerKg = 1.8;
  }

  // Minimum charge: 300 THB
  const base = Math.max(chargedWeight * ratePerKg, 300);
  const fuel = roundTo(base * 0.05);
  const insurance = roundTo(chargedWeight * 100 * 0.001);

  return { base: roundTo(base), fuel, insurance };
}

function getRailDays(distanceKm: number): string {
  if (distanceKm <= 200) return '2-3 วัน';
  if (distanceKm <= 500) return '3-5 วัน';
  return '5-7 วัน';
}

// ─── Sea rates ─────────────────────────────────────────────────────
// Coastal/domestic sea freight: charged per CBM or per ton, whichever is greater
// Rate: ~800–1,500 THB/CBM by distance
function calcSea(chargedWeight: number, cbm: number, distanceKm: number): { base: number; fuel: number; insurance: number } {
  let ratePerCBM: number;
  if (distanceKm <= 300) {
    ratePerCBM = 800;
  } else if (distanceKm <= 600) {
    ratePerCBM = 1000;
  } else if (distanceKm <= 1000) {
    ratePerCBM = 1200;
  } else {
    ratePerCBM = 1500;
  }

  // Sea freight: charge by CBM or weight-ton (1 ton = 1000 kg), whichever is greater
  const chargedCBM = Math.max(cbm, chargedWeight / 1000);
  const effectiveCBM = Math.max(chargedCBM, 1); // Minimum 1 CBM

  const base = roundTo(effectiveCBM * ratePerCBM);
  const fuel = roundTo(base * 0.10); // BAF 10%
  const insurance = roundTo(chargedWeight * 100 * 0.0015);

  return { base, fuel, insurance };
}

function getSeaDays(distanceKm: number): string {
  if (distanceKm <= 300) return '3-5 วัน';
  if (distanceKm <= 600) return '5-7 วัน';
  return '7-14 วัน';
}

// ─── Mode metadata ─────────────────────────────────────────────────
const MODE_META: Record<FreightMode, { nameTh: string; nameEn: string; note: string }> = {
  truck: {
    nameTh: 'รถบรรทุก',
    nameEn: 'Truck',
    note: 'เหมาะสำหรับสินค้าทั่วไป จัดส่งถึงหน้าร้าน/โกดัง',
  },
  rail: {
    nameTh: 'รถไฟ (การรถไฟฯ)',
    nameEn: 'Rail (SRT)',
    note: 'ประหยัดกว่ารถบรรทุก เหมาะกับสินค้าน้ำหนักมาก ไม่เร่งด่วน',
  },
  sea: {
    nameTh: 'เรือชายฝั่ง',
    nameEn: 'Coastal Shipping',
    note: 'คิดค่าส่งต่อ CBM เหมาะกับสินค้าปริมาณมาก ระหว่างท่าเรือ',
  },
};

// ─── Main calculation ──────────────────────────────────────────────
export function calculateFreight(input: FreightInput): FreightResult {
  const { weightKg, lengthCm, widthCm, heightCm, distanceKm, mode } = input;

  const volumetricWeight = roundTo(calcVolumetricWeight(lengthCm, widthCm, heightCm));
  const cbm = roundTo(calcCBM(lengthCm, widthCm, heightCm), 4);
  const chargedWeight = Math.max(weightKg, volumetricWeight);

  const modes: FreightMode[] = mode === 'truck' ? ['truck', 'rail', 'sea']
    : mode === 'rail' ? ['rail', 'truck', 'sea']
    : ['sea', 'truck', 'rail'];

  const quotes: FreightQuote[] = modes.map((m) => {
    let costs: { base: number; fuel: number; insurance: number };
    let days: string;

    switch (m) {
      case 'truck':
        costs = calcTruck(chargedWeight, distanceKm);
        days = getTruckDays(distanceKm);
        break;
      case 'rail':
        costs = calcRail(chargedWeight, distanceKm);
        days = getRailDays(distanceKm);
        break;
      case 'sea':
        costs = calcSea(chargedWeight, cbm, distanceKm);
        days = getSeaDays(distanceKm);
        break;
    }

    const total = roundTo(costs.base + costs.fuel + costs.insurance);
    const meta = MODE_META[m];

    return {
      mode: m,
      modeNameTh: meta.nameTh,
      modeNameEn: meta.nameEn,
      baseCost: costs.base,
      fuelSurcharge: costs.fuel,
      insuranceCost: costs.insurance,
      totalCost: total,
      chargedWeight,
      volumetricWeight,
      cbm,
      costPerKg: roundTo(total / chargedWeight),
      estimatedDays: days,
      note: meta.note,
    };
  });

  // Sort by total cost
  quotes.sort((a, b) => a.totalCost - b.totalCost);

  const cheapest = quotes[0];
  const fastest = [...quotes].sort((a, b) => {
    const maxA = parseInt(a.estimatedDays.split('-').pop() || '99');
    const maxB = parseInt(b.estimatedDays.split('-').pop() || '99');
    return maxA - maxB || a.totalCost - b.totalCost;
  })[0];

  return {
    quotes,
    cheapest,
    fastest,
    input,
    actualWeight: weightKg,
    volumetricWeight,
    cbm,
    chargedWeight,
  };
}

/** Calculate all three modes for comparison */
export function calculateFreightAllModes(input: Omit<FreightInput, 'mode'>): FreightResult {
  return calculateFreight({ ...input, mode: 'truck' }); // All modes are always compared
}
