export const TRANSFER_FEE_RATE = 0.02;
export const SPECIFIC_BUSINESS_TAX_RATE = 0.033;
export const STAMP_DUTY_RATE = 0.005;
export const CORPORATE_WITHHOLDING_RATE = 0.01;

export type TransferType = 'sale' | 'gift' | 'inheritance';
export type SellerType = 'individual' | 'company';

export interface PropertyTransferFeeInput {
  appraisedValue: number;
  salePrice: number;
  sellerType: SellerType;
  ownershipYears: number;
  transferType: TransferType;
}

export interface PropertyTransferFeeResult {
  transferFee: number;
  specificBusinessTax: number;
  stampDuty: number;
  withholdingTax: number;
  totalFee: number;
  taxBaseForSbtAndStamp: number;
  withholdingBase: number;
  holdingYearsForTax: number;
  expenseDeductionRate: number;
  annualTaxableIncome: number;
  annualWithholdingTax: number;
  isSpecificBusinessTaxApplied: boolean;
  isStampDutyApplied: boolean;
}

const LAND_TRANSFER_WITHHOLDING_BRACKETS: Array<{ limit: number; rate: number }> = [
  { limit: 300000, rate: 0.05 },
  { limit: 500000, rate: 0.1 },
  { limit: 750000, rate: 0.15 },
  { limit: 1000000, rate: 0.2 },
  { limit: 2000000, rate: 0.25 },
  { limit: 5000000, rate: 0.3 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.35 },
];

function sanitizeNumber(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getHoldingYearsForTax(ownershipYears: number): number {
  return clamp(Math.ceil(sanitizeNumber(ownershipYears)), 1, 10);
}

function getStandardExpenseDeductionRate(holdingYears: number): number {
  if (holdingYears <= 1) return 0.92;
  if (holdingYears === 2) return 0.84;
  if (holdingYears === 3) return 0.77;
  if (holdingYears === 4) return 0.71;
  if (holdingYears === 5) return 0.65;
  if (holdingYears === 6) return 0.6;
  if (holdingYears === 7) return 0.55;
  return 0.5;
}

function computeProgressiveWithholding(annualIncome: number): number {
  let remaining = sanitizeNumber(annualIncome);
  let previousLimit = 0;
  let tax = 0;

  for (const bracket of LAND_TRANSFER_WITHHOLDING_BRACKETS) {
    if (remaining <= 0) break;

    const range = bracket.limit - previousLimit;
    const taxableAtThisRate = Math.min(remaining, range);
    tax += taxableAtThisRate * bracket.rate;
    remaining -= taxableAtThisRate;
    previousLimit = bracket.limit;
  }

  return tax;
}

export function calculatePropertyTransferFee(input: PropertyTransferFeeInput): PropertyTransferFeeResult {
  const appraisedValue = sanitizeNumber(input.appraisedValue);
  const salePrice = sanitizeNumber(input.salePrice);
  const ownershipYears = sanitizeNumber(input.ownershipYears);
  const taxBaseForSbtAndStamp = Math.max(appraisedValue, salePrice);
  const holdingYearsForTax = getHoldingYearsForTax(ownershipYears);
  const isSaleTransfer = input.transferType === 'sale';
  const isCompanySeller = input.sellerType === 'company';

  // Company transferors are taxed under the juristic-person branch:
  // SBT 3.3% on higher base and 1% withholding, with no stamp duty.
  // Individual transferors follow holding-period eligibility for SBT.
  const isSpecificBusinessTaxApplied = isSaleTransfer && (isCompanySeller || ownershipYears < 5);
  const isStampDutyApplied = isSaleTransfer && !isSpecificBusinessTaxApplied;

  const transferFee = appraisedValue * TRANSFER_FEE_RATE;
  const specificBusinessTax = isSpecificBusinessTaxApplied ? taxBaseForSbtAndStamp * SPECIFIC_BUSINESS_TAX_RATE : 0;
  const stampDuty = isStampDutyApplied ? taxBaseForSbtAndStamp * STAMP_DUTY_RATE : 0;

  let expenseDeductionRate = input.transferType === 'sale'
    ? getStandardExpenseDeductionRate(holdingYearsForTax)
    : 0.5;
  let withholdingBase = appraisedValue;
  let annualTaxableIncome = 0;
  let annualWithholdingTax = 0;
  let withholdingTax = 0;

  if (isCompanySeller) {
    withholdingBase = taxBaseForSbtAndStamp;
    expenseDeductionRate = 0;
    annualTaxableIncome = withholdingBase;
    annualWithholdingTax = withholdingBase * CORPORATE_WITHHOLDING_RATE;
    withholdingTax = annualWithholdingTax;
  } else {
    withholdingBase = appraisedValue;
    const netTaxableIncome = withholdingBase * (1 - expenseDeductionRate);
    annualTaxableIncome = netTaxableIncome / holdingYearsForTax;
    annualWithholdingTax = computeProgressiveWithholding(annualTaxableIncome);
    withholdingTax = annualWithholdingTax * holdingYearsForTax;

    if (input.transferType !== 'sale') {
      withholdingTax = Math.min(withholdingTax, salePrice * 0.2);
    }
  }

  const totalFee = transferFee + specificBusinessTax + stampDuty + withholdingTax;

  return {
    transferFee: roundCurrency(transferFee),
    specificBusinessTax: roundCurrency(specificBusinessTax),
    stampDuty: roundCurrency(stampDuty),
    withholdingTax: roundCurrency(withholdingTax),
    totalFee: roundCurrency(totalFee),
    taxBaseForSbtAndStamp: roundCurrency(taxBaseForSbtAndStamp),
    withholdingBase: roundCurrency(withholdingBase),
    holdingYearsForTax,
    expenseDeductionRate: roundCurrency(expenseDeductionRate * 100),
    annualTaxableIncome: roundCurrency(annualTaxableIncome),
    annualWithholdingTax: roundCurrency(annualWithholdingTax),
    isSpecificBusinessTaxApplied,
    isStampDutyApplied,
  };
}
