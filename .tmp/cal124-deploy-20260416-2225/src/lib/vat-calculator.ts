/**
 * Thai VAT Calculator (ภาษีมูลค่าเพิ่ม)
 * Standard rate: 7%
 */

const VAT_RATE = 0.07;

export interface VatResult {
  priceBeforeVat: number;
  vatAmount: number;
  priceIncludingVat: number;
  vatRate: number;
}

/** Add VAT to a price (ราคาก่อน VAT → ราคารวม VAT) */
export function addVat(priceBeforeVat: number): VatResult {
  const price = Math.max(0, priceBeforeVat);
  const vatAmount = price * VAT_RATE;
  return {
    priceBeforeVat: price,
    vatAmount,
    priceIncludingVat: price + vatAmount,
    vatRate: VAT_RATE,
  };
}

/** Extract VAT from a total price (ราคารวม VAT → แยก VAT) */
export function extractVat(priceIncludingVat: number): VatResult {
  const total = Math.max(0, priceIncludingVat);
  const priceBeforeVat = total / (1 + VAT_RATE);
  const vatAmount = total - priceBeforeVat;
  return {
    priceBeforeVat,
    vatAmount,
    priceIncludingVat: total,
    vatRate: VAT_RATE,
  };
}

/** Batch calculate VAT for multiple items */
export function batchAddVat(prices: number[]): { items: VatResult[]; totals: VatResult } {
  const items = prices.map(addVat);
  const totals: VatResult = {
    priceBeforeVat: items.reduce((s, i) => s + i.priceBeforeVat, 0),
    vatAmount: items.reduce((s, i) => s + i.vatAmount, 0),
    priceIncludingVat: items.reduce((s, i) => s + i.priceIncludingVat, 0),
    vatRate: VAT_RATE,
  };
  return { items, totals };
}

export function formatThaiNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}
