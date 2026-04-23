export interface DownPaymentCalculatorInput {
  propertyPrice: number;
  downPaymentPercent: number;
  loanAmount: number;
}

export interface DownPaymentCalculatorResult {
  propertyPrice: number;
  downPaymentPercent: number;
  loanAmount: number;
  result: number;
}

export function calculateDownPaymentCalculator(input: DownPaymentCalculatorInput): DownPaymentCalculatorResult {
  const result = Object.values(input).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);

  return {
    propertyPrice: input.propertyPrice,
    downPaymentPercent: input.downPaymentPercent,
    loanAmount: input.loanAmount,
    result: Math.round(result),
  };
}

export const EXAMPLE_1 = calculateDownPaymentCalculator({
  propertyPrice: 2500000, downPaymentPercent: 20, loanAmount: 2000000,
});

export const EXAMPLE_2 = calculateDownPaymentCalculator({
  propertyPrice: 5000000, downPaymentPercent: 25, loanAmount: 3750000,
});

export const EXAMPLE_3 = calculateDownPaymentCalculator({
  propertyPrice: 3500000, downPaymentPercent: 30, loanAmount: 2450000,
});

