export interface PropertyComparisonAnalysisInput {
  property1Price: number;
  property1RentIncome: number;
  property2Price: number;
  property2RentIncome: number;
}

export interface PropertyComparisonAnalysisResult {
  property1Price: number;
  property1RentIncome: number;
  property2Price: number;
  property2RentIncome: number;
  result: number;
}

export function calculatePropertyComparisonAnalysis(input: PropertyComparisonAnalysisInput): PropertyComparisonAnalysisResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    property1Price: input.property1Price,
    property1RentIncome: input.property1RentIncome,
    property2Price: input.property2Price,
    property2RentIncome: input.property2RentIncome,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculatePropertyComparisonAnalysis({
  property1Price: 2500000, property1RentIncome: 15000, property2Price: 2800000, property2RentIncome: 16800,
});

export const EXAMPLE_2 = calculatePropertyComparisonAnalysis({
  property1Price: 5000000, property1RentIncome: 30000, property2Price: 4500000, property2RentIncome: 29000,
});

export const EXAMPLE_3 = calculatePropertyComparisonAnalysis({
  property1Price: 3500000, property1RentIncome: 21000, property2Price: 3200000, property2RentIncome: 19500,
});

