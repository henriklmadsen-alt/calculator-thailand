export interface RenovationFinancingInput {
  totalCost: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermMonths: number;
}

export interface RenovationFinancingResult {
  totalCost: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermMonths: number;
  result: number;
}

export function calculateRenovationFinancing(input: RenovationFinancingInput): RenovationFinancingResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    totalCost: input.totalCost,
    downPaymentPercent: input.downPaymentPercent,
    interestRate: input.interestRate,
    loanTermMonths: input.loanTermMonths,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateRenovationFinancing({
  totalCost: 500000, downPaymentPercent: 20, interestRate: 5, loanTermMonths: 60,
});

export const EXAMPLE_2 = calculateRenovationFinancing({
  totalCost: 800000, downPaymentPercent: 25, interestRate: 4.5, loanTermMonths: 72,
});

export const EXAMPLE_3 = calculateRenovationFinancing({
  totalCost: 650000, downPaymentPercent: 20, interestRate: 5, loanTermMonths: 60,
});

