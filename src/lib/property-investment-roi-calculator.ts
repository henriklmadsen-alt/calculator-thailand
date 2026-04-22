export interface PropertyInvestmentRoiInput {
  initialInvestment: number;
  annualRentalIncome: number;
  annualExpenses: number;
  propertyAppreciation: number;
}

export interface PropertyInvestmentRoiResult {
  initialInvestment: number;
  annualRentalIncome: number;
  annualExpenses: number;
  propertyAppreciation: number;
  result: number;
}

export function calculatePropertyInvestmentRoi(input: PropertyInvestmentRoiInput): PropertyInvestmentRoiResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    initialInvestment: input.initialInvestment,
    annualRentalIncome: input.annualRentalIncome,
    annualExpenses: input.annualExpenses,
    propertyAppreciation: input.propertyAppreciation,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculatePropertyInvestmentRoi({
  initialInvestment: 2500000, annualRentalIncome: 300000, annualExpenses: 80000, propertyAppreciation: 2750000,
});

export const EXAMPLE_2 = calculatePropertyInvestmentRoi({
  initialInvestment: 5000000, annualRentalIncome: 600000, annualExpenses: 150000, propertyAppreciation: 5500000,
});

export const EXAMPLE_3 = calculatePropertyInvestmentRoi({
  initialInvestment: 3500000, annualRentalIncome: 420000, annualExpenses: 100000, propertyAppreciation: 3850000,
});

