export interface RealEstatePortfolioValuationInput {
  property1Value: number;
  property2Value: number;
  property3Value: number;
  totalDebt: number;
}

export interface RealEstatePortfolioValuationResult {
  property1Value: number;
  property2Value: number;
  property3Value: number;
  totalDebt: number;
  result: number;
}

export function calculateRealEstatePortfolioValuation(input: RealEstatePortfolioValuationInput): RealEstatePortfolioValuationResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    property1Value: input.property1Value,
    property2Value: input.property2Value,
    property3Value: input.property3Value,
    totalDebt: input.totalDebt,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateRealEstatePortfolioValuation({
  property1Value: 2500000, property2Value: 1800000, property3Value: 1200000, totalDebt: 2500000,
});

export const EXAMPLE_2 = calculateRealEstatePortfolioValuation({
  property1Value: 5000000, property2Value: 3500000, property3Value: 2500000, totalDebt: 5000000,
});

export const EXAMPLE_3 = calculateRealEstatePortfolioValuation({
  property1Value: 3500000, property2Value: 2800000, property3Value: 2000000, totalDebt: 4000000,
});

