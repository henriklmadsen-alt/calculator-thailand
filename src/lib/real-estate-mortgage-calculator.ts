export interface RealEstateMortgageInput {
  loanAmount: number;
  annualInterestRate: number;
  loanTermYears: number;
}

export interface RealEstateMortgageResult {
  loanAmount: number;
  annualInterestRate: number;
  loanTermYears: number;
  result: number;
}

export function calculateRealEstateMortgage(input: RealEstateMortgageInput): RealEstateMortgageResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    loanAmount: input.loanAmount,
    annualInterestRate: input.annualInterestRate,
    loanTermYears: input.loanTermYears,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateRealEstateMortgage({
  loanAmount: 2000000, annualInterestRate: 4.5, loanTermYears: 20,
});

export const EXAMPLE_2 = calculateRealEstateMortgage({
  loanAmount: 4000000, annualInterestRate: 5, loanTermYears: 25,
});

export const EXAMPLE_3 = calculateRealEstateMortgage({
  loanAmount: 3000000, annualInterestRate: 4.75, loanTermYears: 20,
});

