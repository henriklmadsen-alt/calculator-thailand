export const DAYS_IN_YEAR = 365;
export const MAX_CREDIT_CARD_ANNUAL_RATE = 16;
export const CASH_ADVANCE_FEE_RATE = 0.03;
export const VAT_RATE = 0.07;

export interface CreditCardInterestInput {
  statementBalance: number;
  paymentAmount: number;
  annualInterestRate: number;
  minPaymentRate: number;
  daysBeforeDue: number;
  daysAfterPayment: number;
  cashAdvanceAmount?: number;
  cashAdvanceDays?: number;
}

export interface CreditCardInterestResult {
  minimumPayment: number;
  remainingPrincipal: number;
  purchaseInterestBeforeDue: number;
  purchaseInterestAfterPayment: number;
  cashAdvanceInterest: number;
  cashAdvanceFee: number;
  cashAdvanceVat: number;
  totalInterest: number;
  totalFees: number;
  nextStatementBalance: number;
  usedAnnualRate: number;
  usedMinPaymentRate: number;
}

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

export function calculateCreditCardInterest(input: CreditCardInterestInput): CreditCardInterestResult {
  const statementBalance = toNonNegativeNumber(input.statementBalance);
  const paymentAmount = toNonNegativeNumber(input.paymentAmount);
  const daysBeforeDue = toNonNegativeNumber(input.daysBeforeDue);
  const daysAfterPayment = toNonNegativeNumber(input.daysAfterPayment);
  const cashAdvanceAmount = toNonNegativeNumber(input.cashAdvanceAmount ?? 0);
  const cashAdvanceDays = toNonNegativeNumber(input.cashAdvanceDays ?? 0);

  const annualInterestRate = clamp(toNonNegativeNumber(input.annualInterestRate), 0, MAX_CREDIT_CARD_ANNUAL_RATE);
  const minPaymentRate = clamp(toNonNegativeNumber(input.minPaymentRate), 0, 100);

  const isRevolving = paymentAmount < statementBalance;
  const remainingPrincipal = Math.max(0, statementBalance - paymentAmount);
  const dailyRate = annualInterestRate / 100 / DAYS_IN_YEAR;

  const purchaseInterestBeforeDue = isRevolving ? statementBalance * dailyRate * daysBeforeDue : 0;
  const purchaseInterestAfterPayment = isRevolving ? remainingPrincipal * dailyRate * daysAfterPayment : 0;
  const cashAdvanceInterest = cashAdvanceAmount * dailyRate * cashAdvanceDays;

  const cashAdvanceFee = cashAdvanceAmount * CASH_ADVANCE_FEE_RATE;
  const cashAdvanceVat = cashAdvanceFee * VAT_RATE;

  const minimumPayment = statementBalance * (minPaymentRate / 100);
  const totalInterest = purchaseInterestBeforeDue + purchaseInterestAfterPayment + cashAdvanceInterest;
  const totalFees = cashAdvanceFee + cashAdvanceVat;
  const nextStatementBalance = remainingPrincipal + totalInterest + totalFees;

  return {
    minimumPayment: roundCurrency(minimumPayment),
    remainingPrincipal: roundCurrency(remainingPrincipal),
    purchaseInterestBeforeDue: roundCurrency(purchaseInterestBeforeDue),
    purchaseInterestAfterPayment: roundCurrency(purchaseInterestAfterPayment),
    cashAdvanceInterest: roundCurrency(cashAdvanceInterest),
    cashAdvanceFee: roundCurrency(cashAdvanceFee),
    cashAdvanceVat: roundCurrency(cashAdvanceVat),
    totalInterest: roundCurrency(totalInterest),
    totalFees: roundCurrency(totalFees),
    nextStatementBalance: roundCurrency(nextStatementBalance),
    usedAnnualRate: annualInterestRate,
    usedMinPaymentRate: minPaymentRate,
  };
}
