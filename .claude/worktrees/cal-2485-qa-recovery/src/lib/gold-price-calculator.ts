/**
 * Thai Gold Price Calculator (คำนวณค่าทองคำ)
 *
 * Thai gold standard: 96.5% purity (23.16 karat)
 * Weight units:
 *   1 บาททอง (baht weight) = 15.244 grams
 *   1 สลึง (salung)         = 1/4 baht weight = 3.811 grams
 *
 * Gold Association of Thailand publishes daily prices per 1 baht weight:
 *   - ทองคำแท่ง (gold bar): buy/sell
 *   - ทองรูปพรรณ (gold ornament): buy/sell (includes craftsmanship fee)
 */

/** 1 baht weight = 15.244 grams */
export const GRAMS_PER_BAHT_WEIGHT = 15.244;

/** 1 salung = 1/4 baht weight */
export const SALUNG_PER_BAHT_WEIGHT = 4;

/** 1 salung in grams */
export const GRAMS_PER_SALUNG = GRAMS_PER_BAHT_WEIGHT / SALUNG_PER_BAHT_WEIGHT; // 3.811

export type WeightUnit = 'baht' | 'salung' | 'gram';

export type GoldType = 'bar' | 'ornament';

export interface GoldPriceInput {
  /** Weight amount */
  weight: number;
  /** Unit of the weight */
  weightUnit: WeightUnit;
  /** Gold bar or ornament */
  goldType: GoldType;
  /** Price per 1 baht weight (buy price) */
  buyPricePerBaht: number;
  /** Price per 1 baht weight (sell price) */
  sellPricePerBaht: number;
}

export interface GoldPriceResult {
  /** Weight converted to baht weight */
  weightInBaht: number;
  /** Weight converted to salung */
  weightInSalung: number;
  /** Weight converted to grams */
  weightInGrams: number;
  /** Total buy price (THB) */
  totalBuyPrice: number;
  /** Total sell price (THB) */
  totalSellPrice: number;
  /** Spread (buy - sell) */
  spread: number;
  /** Gold type used */
  goldType: GoldType;
  /** Per-baht buy price used */
  buyPricePerBaht: number;
  /** Per-baht sell price used */
  sellPricePerBaht: number;
}

/** Convert any weight unit to baht weight */
export function toBahtWeight(weight: number, unit: WeightUnit): number {
  switch (unit) {
    case 'baht':
      return weight;
    case 'salung':
      return weight / SALUNG_PER_BAHT_WEIGHT;
    case 'gram':
      return weight / GRAMS_PER_BAHT_WEIGHT;
  }
}

/** Calculate gold price */
export function calculateGoldPrice(input: GoldPriceInput): GoldPriceResult {
  const w = Math.max(0, input.weight);
  const weightInBaht = toBahtWeight(w, input.weightUnit);
  const weightInSalung = weightInBaht * SALUNG_PER_BAHT_WEIGHT;
  const weightInGrams = weightInBaht * GRAMS_PER_BAHT_WEIGHT;

  const totalBuyPrice = weightInBaht * input.buyPricePerBaht;
  const totalSellPrice = weightInBaht * input.sellPricePerBaht;
  const spread = totalBuyPrice - totalSellPrice;

  return {
    weightInBaht,
    weightInSalung,
    weightInGrams,
    totalBuyPrice,
    totalSellPrice,
    spread,
    goldType: input.goldType,
    buyPricePerBaht: input.buyPricePerBaht,
    sellPricePerBaht: input.sellPricePerBaht,
  };
}
