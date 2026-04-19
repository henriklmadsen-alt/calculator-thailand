export const STANDARD_TRANSFER_RATE = 0.02;
export const STANDARD_MORTGAGE_RATE = 0.01;
export const REDUCED_TRANSFER_AND_MORTGAGE_RATE = 0.0001; // 0.01%
export const MAX_MORTGAGE_FEE = 200000;
export const SPECIFIC_BUSINESS_TAX_RATE = 0.033; // includes local tax
export const CORPORATE_WITHHOLDING_TAX_RATE = 0.01;
export const REDUCED_FEE_MAX_VALUE = 7000000;

export type SellerType = 'individual' | 'corporate';

export interface HomeTransferFeeInput {
  salePrice: number;
  appraisedPrice: number;
  mortgageAmount: number;
  isReducedFeeEligible: boolean;
  hasSpecificBusinessTax: boolean;
  sellerType: SellerType;
  customIndividualWithholdingTax?: number;
}

export interface HomeTransferFeeResult {
  taxableBase: number;
  isReducedFeeApplied: boolean;
  reducedFeeValidationMessage: string;
  appliedTransferRate: number;
  appliedMortgageRate: number;
  transferFee: number;
  mortgageFee: number;
  specificBusinessTax: number;
  stampDuty: number;
  withholdingTax: number;
  buyerCosts: number;
  sellerCosts: number;
  totalCosts: number;
}

function toNonNegativeNumber(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, value);
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function calculateStampDuty(base: number): number {
  if (base <= 0) {
    return 0;
  }
  // Land Department guidance: 1 THB per each 200 THB (or fraction of 200 THB).
  return Math.ceil(base / 200);
}

function resolveReducedFeeValidationMessage(input: {
  isReducedFeeEligible: boolean;
  salePrice: number;
  appraisedPrice: number;
  mortgageAmount: number;
}): string {
  if (!input.isReducedFeeEligible) {
    return '';
  }
  if (input.salePrice > REDUCED_FEE_MAX_VALUE || input.appraisedPrice > REDUCED_FEE_MAX_VALUE) {
    return 'ราคาซื้อขายหรือราคาประเมินเกิน 7 ล้านบาท จึงไม่เข้าเงื่อนไข 0.01%';
  }
  if (input.mortgageAmount <= 0) {
    return 'มาตรการ 0.01% ในเครื่องมือนี้ใช้กรณีจดโอนและจดจำนองในคราวเดียวกัน';
  }
  if (input.mortgageAmount > REDUCED_FEE_MAX_VALUE) {
    return 'วงเงินจำนองเกิน 7 ล้านบาท จึงไม่เข้าเงื่อนไข 0.01%';
  }
  return '';
}

export function calculateHomeTransferFees(input: HomeTransferFeeInput): HomeTransferFeeResult {
  const salePrice = toNonNegativeNumber(input.salePrice);
  const appraisedPrice = toNonNegativeNumber(input.appraisedPrice);
  const mortgageAmount = toNonNegativeNumber(input.mortgageAmount);
  const customIndividualWithholdingTax = toNonNegativeNumber(input.customIndividualWithholdingTax ?? 0);

  const reducedFeeValidationMessage = resolveReducedFeeValidationMessage({
    isReducedFeeEligible: input.isReducedFeeEligible,
    salePrice,
    appraisedPrice,
    mortgageAmount,
  });
  const isReducedFeeApplied = input.isReducedFeeEligible && reducedFeeValidationMessage === '';
  const taxableBase = Math.max(salePrice, appraisedPrice);

  const appliedTransferRate = isReducedFeeApplied ? REDUCED_TRANSFER_AND_MORTGAGE_RATE : STANDARD_TRANSFER_RATE;
  const appliedMortgageRate = isReducedFeeApplied ? REDUCED_TRANSFER_AND_MORTGAGE_RATE : STANDARD_MORTGAGE_RATE;

  const transferFee = appraisedPrice * appliedTransferRate;
  const mortgageFee = Math.min(mortgageAmount * appliedMortgageRate, MAX_MORTGAGE_FEE);
  const specificBusinessTax = input.hasSpecificBusinessTax ? taxableBase * SPECIFIC_BUSINESS_TAX_RATE : 0;
  const stampDuty = input.hasSpecificBusinessTax ? 0 : calculateStampDuty(taxableBase);
  const withholdingTax = input.sellerType === 'corporate'
    ? taxableBase * CORPORATE_WITHHOLDING_TAX_RATE
    : customIndividualWithholdingTax;

  const buyerCosts = transferFee + mortgageFee;
  const sellerCosts = specificBusinessTax + stampDuty + withholdingTax;
  const totalCosts = buyerCosts + sellerCosts;

  return {
    taxableBase: roundCurrency(taxableBase),
    isReducedFeeApplied,
    reducedFeeValidationMessage,
    appliedTransferRate,
    appliedMortgageRate,
    transferFee: roundCurrency(transferFee),
    mortgageFee: roundCurrency(mortgageFee),
    specificBusinessTax: roundCurrency(specificBusinessTax),
    stampDuty: roundCurrency(stampDuty),
    withholdingTax: roundCurrency(withholdingTax),
    buyerCosts: roundCurrency(buyerCosts),
    sellerCosts: roundCurrency(sellerCosts),
    totalCosts: roundCurrency(totalCosts),
  };
}
