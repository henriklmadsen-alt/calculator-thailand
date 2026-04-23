export interface PropertyPurchaseCostInput {
  propertyPrice: number;
  downPaymentPercent: number;
  transferTaxPercent: number;
  deedRewriteCost: number;
  surveyFee: number;
  registrationFee: number;
}

export interface PropertyPurchaseCostResult {
  propertyPrice: number;
  downPaymentPercent: number;
  transferTaxPercent: number;
  deedRewriteCost: number;
  surveyFee: number;
  registrationFee: number;
  result: number;
}

export function calculatePropertyPurchaseCost(input: PropertyPurchaseCostInput): PropertyPurchaseCostResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    propertyPrice: input.propertyPrice,
    downPaymentPercent: input.downPaymentPercent,
    transferTaxPercent: input.transferTaxPercent,
    deedRewriteCost: input.deedRewriteCost,
    surveyFee: input.surveyFee,
    registrationFee: input.registrationFee,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculatePropertyPurchaseCost({
  propertyPrice: 2500000, downPaymentPercent: 20, transferTaxPercent: 2, deedRewriteCost: 5000, surveyFee: 3000, registrationFee: 2000,
});

export const EXAMPLE_2 = calculatePropertyPurchaseCost({
  propertyPrice: 5000000, downPaymentPercent: 25, transferTaxPercent: 2, deedRewriteCost: 5000, surveyFee: 3000, registrationFee: 2000,
});

export const EXAMPLE_3 = calculatePropertyPurchaseCost({
  propertyPrice: 3500000, downPaymentPercent: 30, transferTaxPercent: 2, deedRewriteCost: 5000, surveyFee: 3000, registrationFee: 2000,
});

