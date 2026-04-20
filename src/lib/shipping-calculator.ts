/**
 * Shipping Cost Calculator for Thai domestic couriers
 *
 * Carriers: Thailand Post (EMS), Kerry Express, Flash Express, J&T Express
 *
 * Rate sources (approximate 2025–2026):
 * - Thailand Post EMS: thailandpost.co.th
 * - Kerry Express: kerryexpress.com/th
 * - Flash Express: flashexpress.co.th
 * - J&T Express: jtexpress.co.th
 *
 * Rates are estimates — actual pricing may vary by promotion,
 * pickup method, and seller agreements.
 */

export type CarrierId = 'thailand_post' | 'kerry' | 'flash' | 'jt';

export interface ShippingInput {
  /** Actual weight in kg */
  weightKg: number;
  /** Length in cm */
  lengthCm: number;
  /** Width in cm */
  widthCm: number;
  /** Height in cm */
  heightCm: number;
  /** Origin zone */
  originZone: 'bangkok' | 'province';
  /** Destination zone */
  destZone: 'bangkok' | 'province';
}

export interface CarrierQuote {
  carrierId: CarrierId;
  carrierName: string;
  carrierNameTh: string;
  cost: number;
  deliveryDays: string;
  chargedWeight: number;
  volumetricWeight: number;
  note: string;
}

export interface ShippingResult {
  quotes: CarrierQuote[];
  cheapest: CarrierQuote;
  fastest: CarrierQuote;
  actualWeight: number;
  volumetricWeight: number;
  chargedWeight: number;
  dimensions: { l: number; w: number; h: number };
  route: string;
}

/** Volumetric divisor for domestic Thai shipping (standard) */
const VOLUMETRIC_DIVISOR = 5000;

function calcVolumetricWeight(l: number, w: number, h: number): number {
  return (l * w * h) / VOLUMETRIC_DIVISOR;
}

function roundUp(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.ceil(value * factor) / factor;
}

// ─── Thailand Post EMS Domestic ────────────────────────────────────
// Weight tiers (kg) → cost (THB). Same-zone vs cross-zone.
type RateTable = { maxKg: number; same: number; cross: number }[];

const THAI_POST_RATES: RateTable = [
  { maxKg: 0.5, same: 37, cross: 40 },
  { maxKg: 1, same: 52, cross: 55 },
  { maxKg: 2, same: 67, cross: 72 },
  { maxKg: 3, same: 82, cross: 90 },
  { maxKg: 5, same: 112, cross: 125 },
  { maxKg: 7, same: 142, cross: 160 },
  { maxKg: 10, same: 172, cross: 200 },
  { maxKg: 15, same: 222, cross: 265 },
  { maxKg: 20, same: 272, cross: 330 },
];
const THAI_POST_EXTRA_PER_KG = { same: 10, cross: 13 };
const THAI_POST_MAX_KG = 30;

function calcThaiPost(chargedWeight: number, sameZone: boolean): number | null {
  if (chargedWeight > THAI_POST_MAX_KG) return null;
  const key = sameZone ? 'same' : 'cross';
  for (const tier of THAI_POST_RATES) {
    if (chargedWeight <= tier.maxKg) return tier[key];
  }
  // Above 20 kg: base 20 kg rate + extra per kg
  const lastTier = THAI_POST_RATES[THAI_POST_RATES.length - 1];
  const extraKg = Math.ceil(chargedWeight - lastTier.maxKg);
  return lastTier[key] + extraKg * THAI_POST_EXTRA_PER_KG[key];
}

// ─── Kerry Express ─────────────────────────────────────────────────
const KERRY_RATES: RateTable = [
  { maxKg: 0.5, same: 50, cross: 60 },
  { maxKg: 1, same: 55, cross: 70 },
  { maxKg: 2, same: 65, cross: 85 },
  { maxKg: 3, same: 80, cross: 100 },
  { maxKg: 5, same: 100, cross: 130 },
  { maxKg: 7, same: 130, cross: 165 },
  { maxKg: 10, same: 160, cross: 210 },
  { maxKg: 15, same: 210, cross: 280 },
  { maxKg: 20, same: 260, cross: 350 },
];
const KERRY_EXTRA_PER_KG = { same: 12, cross: 15 };
const KERRY_MAX_KG = 50;

function calcKerry(chargedWeight: number, sameZone: boolean): number | null {
  if (chargedWeight > KERRY_MAX_KG) return null;
  const key = sameZone ? 'same' : 'cross';
  for (const tier of KERRY_RATES) {
    if (chargedWeight <= tier.maxKg) return tier[key];
  }
  const lastTier = KERRY_RATES[KERRY_RATES.length - 1];
  const extraKg = Math.ceil(chargedWeight - lastTier.maxKg);
  return lastTier[key] + extraKg * KERRY_EXTRA_PER_KG[key];
}

// ─── Flash Express ─────────────────────────────────────────────────
const FLASH_RATES: RateTable = [
  { maxKg: 0.5, same: 30, cross: 35 },
  { maxKg: 1, same: 35, cross: 45 },
  { maxKg: 2, same: 45, cross: 60 },
  { maxKg: 3, same: 55, cross: 75 },
  { maxKg: 5, same: 75, cross: 100 },
  { maxKg: 7, same: 95, cross: 130 },
  { maxKg: 10, same: 120, cross: 170 },
  { maxKg: 15, same: 160, cross: 230 },
  { maxKg: 20, same: 200, cross: 290 },
];
const FLASH_EXTRA_PER_KG = { same: 10, cross: 12 };
const FLASH_MAX_KG = 50;

function calcFlash(chargedWeight: number, sameZone: boolean): number | null {
  if (chargedWeight > FLASH_MAX_KG) return null;
  const key = sameZone ? 'same' : 'cross';
  for (const tier of FLASH_RATES) {
    if (chargedWeight <= tier.maxKg) return tier[key];
  }
  const lastTier = FLASH_RATES[FLASH_RATES.length - 1];
  const extraKg = Math.ceil(chargedWeight - lastTier.maxKg);
  return lastTier[key] + extraKg * FLASH_EXTRA_PER_KG[key];
}

// ─── J&T Express ───────────────────────────────────────────────────
const JT_RATES: RateTable = [
  { maxKg: 0.5, same: 35, cross: 40 },
  { maxKg: 1, same: 40, cross: 50 },
  { maxKg: 2, same: 50, cross: 68 },
  { maxKg: 3, same: 63, cross: 85 },
  { maxKg: 5, same: 85, cross: 115 },
  { maxKg: 7, same: 110, cross: 150 },
  { maxKg: 10, same: 140, cross: 195 },
  { maxKg: 15, same: 185, cross: 260 },
  { maxKg: 20, same: 230, cross: 325 },
];
const JT_EXTRA_PER_KG = { same: 11, cross: 14 };
const JT_MAX_KG = 50;

function calcJT(chargedWeight: number, sameZone: boolean): number | null {
  if (chargedWeight > JT_MAX_KG) return null;
  const key = sameZone ? 'same' : 'cross';
  for (const tier of JT_RATES) {
    if (chargedWeight <= tier.maxKg) return tier[key];
  }
  const lastTier = JT_RATES[JT_RATES.length - 1];
  const extraKg = Math.ceil(chargedWeight - lastTier.maxKg);
  return lastTier[key] + extraKg * JT_EXTRA_PER_KG[key];
}

// ─── Delivery time estimates ───────────────────────────────────────
function getDeliveryDays(carrierId: CarrierId, sameZone: boolean): string {
  const map: Record<CarrierId, { same: string; cross: string }> = {
    thailand_post: { same: '1-2 วัน', cross: '2-4 วัน' },
    kerry: { same: '1-2 วัน', cross: '2-3 วัน' },
    flash: { same: '1-2 วัน', cross: '2-3 วัน' },
    jt: { same: '1-2 วัน', cross: '2-4 วัน' },
  };
  return sameZone ? map[carrierId].same : map[carrierId].cross;
}

// ─── Main calculation ──────────────────────────────────────────────
export function calculateShipping(input: ShippingInput): ShippingResult {
  const { weightKg, lengthCm, widthCm, heightCm, originZone, destZone } = input;
  const volumetricWeight = roundUp(calcVolumetricWeight(lengthCm, widthCm, heightCm));
  const chargedWeight = Math.max(weightKg, volumetricWeight);
  const sameZone = originZone === destZone;

  const carriers: {
    id: CarrierId;
    name: string;
    nameTh: string;
    calcFn: (w: number, s: boolean) => number | null;
    maxKg: number;
    note: string;
  }[] = [
    {
      id: 'thailand_post',
      name: 'Thailand Post (EMS)',
      nameTh: 'ไปรษณีย์ไทย (EMS)',
      calcFn: calcThaiPost,
      maxKg: THAI_POST_MAX_KG,
      note: 'จัดส่งผ่านที่ทำการไปรษณีย์ ครอบคลุมทุกพื้นที่ทั่วไทย',
    },
    {
      id: 'kerry',
      name: 'Kerry Express',
      nameTh: 'Kerry Express',
      calcFn: calcKerry,
      maxKg: KERRY_MAX_KG,
      note: 'มีจุดรับส่งมากกว่า 15,000 แห่ง',
    },
    {
      id: 'flash',
      name: 'Flash Express',
      nameTh: 'Flash Express',
      calcFn: calcFlash,
      maxKg: FLASH_MAX_KG,
      note: 'ราคาประหยัด รับพัสดุถึงหน้าบ้าน',
    },
    {
      id: 'jt',
      name: 'J&T Express',
      nameTh: 'J&T Express',
      calcFn: calcJT,
      maxKg: JT_MAX_KG,
      note: 'บริการรับพัสดุถึงที่ ไม่มีค่าใช้จ่ายเพิ่ม',
    },
  ];

  const quotes: CarrierQuote[] = [];

  for (const c of carriers) {
    const cost = c.calcFn(chargedWeight, sameZone);
    if (cost === null) continue;
    quotes.push({
      carrierId: c.id,
      carrierName: c.name,
      carrierNameTh: c.nameTh,
      cost,
      deliveryDays: getDeliveryDays(c.id, sameZone),
      chargedWeight,
      volumetricWeight,
      note: chargedWeight > THAI_POST_MAX_KG && c.id === 'thailand_post'
        ? 'เกินน้ำหนักสูงสุดที่รับ'
        : c.note,
    });
  }

  // Sort by cost ascending
  quotes.sort((a, b) => a.cost - b.cost);

  const cheapest = quotes[0];
  // Fastest = shortest max delivery day
  const fastest = [...quotes].sort((a, b) => {
    const maxA = parseInt(a.deliveryDays.split('-').pop() || '99');
    const maxB = parseInt(b.deliveryDays.split('-').pop() || '99');
    return maxA - maxB || a.cost - b.cost;
  })[0];

  const zoneLabel = (z: 'bangkok' | 'province') =>
    z === 'bangkok' ? 'กรุงเทพฯ/ปริมณฑล' : 'ต่างจังหวัด';

  return {
    quotes,
    cheapest,
    fastest,
    actualWeight: weightKg,
    volumetricWeight,
    chargedWeight,
    dimensions: { l: lengthCm, w: widthCm, h: heightCm },
    route: `${zoneLabel(originZone)} → ${zoneLabel(destZone)}`,
  };
}
