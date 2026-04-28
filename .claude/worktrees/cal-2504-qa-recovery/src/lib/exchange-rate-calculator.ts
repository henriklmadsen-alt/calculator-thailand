export interface ExchangeConversionInput {
  amount: number;
  rate: number;
  spreadPercent?: number;
}

export interface ExchangeConversionResult {
  amount: number;
  rate: number;
  spreadPercent: number;
  grossConvertedAmount: number;
  spreadAmount: number;
  netConvertedAmount: number;
  inverseRate: number;
  effectiveRate: number;
}

function toFiniteNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number, digits = 6): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function calculateExchangeConversion(input: ExchangeConversionInput): ExchangeConversionResult {
  const amount = Math.max(0, toFiniteNumber(input.amount));
  const rate = toFiniteNumber(input.rate);
  if (rate <= 0) {
    throw new Error('Rate must be greater than zero');
  }

  const spreadPercent = clamp(Math.max(0, toFiniteNumber(input.spreadPercent ?? 0)), 0, 100);
  const grossConvertedAmount = amount * rate;
  const spreadAmount = grossConvertedAmount * (spreadPercent / 100);
  const netConvertedAmount = grossConvertedAmount - spreadAmount;
  const inverseRate = 1 / rate;
  const effectiveRate = amount > 0 ? netConvertedAmount / amount : 0;

  return {
    amount: round(amount),
    rate: round(rate, 8),
    spreadPercent: round(spreadPercent),
    grossConvertedAmount: round(grossConvertedAmount),
    spreadAmount: round(spreadAmount),
    netConvertedAmount: round(netConvertedAmount),
    inverseRate: round(inverseRate, 8),
    effectiveRate: round(effectiveRate, 8),
  };
}
