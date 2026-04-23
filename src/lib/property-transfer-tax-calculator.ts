export interface PropertyTransferTaxInput {
  propertyPrice: number;
  transferTaxRatePercent: number;
  stampDutyPercent: number;
}

export interface PropertyTransferTaxResult {
  propertyPrice: number;
  transferTaxRatePercent: number;
  stampDutyPercent: number;
  result: number;
}

export function calculatePropertyTransferTax(input: PropertyTransferTaxInput): PropertyTransferTaxResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    propertyPrice: input.propertyPrice,
    transferTaxRatePercent: input.transferTaxRatePercent,
    stampDutyPercent: input.stampDutyPercent,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculatePropertyTransferTax({
  propertyPrice: 2500000, transferTaxRatePercent: 2, stampDutyPercent: 0.5,
});

export const EXAMPLE_2 = calculatePropertyTransferTax({
  propertyPrice: 5000000, transferTaxRatePercent: 2, stampDutyPercent: 0.5,
});

export const EXAMPLE_3 = calculatePropertyTransferTax({
  propertyPrice: 3500000, transferTaxRatePercent: 2, stampDutyPercent: 0.5,
});

