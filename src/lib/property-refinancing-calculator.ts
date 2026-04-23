export interface PropertyRefinancingInput {
  currentLoanBalance: number;
  currentInterestRate: number;
  newInterestRate: number;
  remainingYears: number;
}

export interface PropertyRefinancingResult {
  currentLoanBalance: number;
  currentInterestRate: number;
  newInterestRate: number;
  remainingYears: number;
  result: number;
}

export function calculatePropertyRefinancing(input: PropertyRefinancingInput): PropertyRefinancingResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    currentLoanBalance: input.currentLoanBalance,
    currentInterestRate: input.currentInterestRate,
    newInterestRate: input.newInterestRate,
    remainingYears: input.remainingYears,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculatePropertyRefinancing({
  currentLoanBalance: 2000000, currentInterestRate: 4.5, newInterestRate: 3.5, remainingYears: 15,
});

export const EXAMPLE_2 = calculatePropertyRefinancing({
  currentLoanBalance: 4000000, currentInterestRate: 5, newInterestRate: 4, remainingYears: 20,
});

export const EXAMPLE_3 = calculatePropertyRefinancing({
  currentLoanBalance: 3000000, currentInterestRate: 4.75, newInterestRate: 3.75, remainingYears: 18,
});

