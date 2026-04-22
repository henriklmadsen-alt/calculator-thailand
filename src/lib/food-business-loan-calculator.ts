export interface FoodBusinessLoanInput {
  loanAmount: number;
  annualInterestRate: number;
  loanTermMonths: number;
}

export interface FoodBusinessLoanResult {
  loanAmount: number;
  monthlyInterestRate: number;
  monthlyPayment: number;
  totalPaymentAmount: number;
  totalInterestPaid: number;
  interestCostPercentage: number;
}

export function calculateFoodBusinessLoan(input: FoodBusinessLoanInput): FoodBusinessLoanResult {
  const monthlyInterestRate = input.annualInterestRate / 100 / 12;

  // Using amortization formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, input.loanTermMonths);
  const denominator = Math.pow(1 + monthlyInterestRate, input.loanTermMonths) - 1;
  const monthlyPayment = Math.round(input.loanAmount * (numerator / denominator));

  const totalPaymentAmount = Math.round(monthlyPayment * input.loanTermMonths);
  const totalInterestPaid = Math.round(totalPaymentAmount - input.loanAmount);
  const interestCostPercentage = Math.round((totalInterestPaid / input.loanAmount) * 100);

  return {
    loanAmount: input.loanAmount,
    monthlyInterestRate: Math.round(monthlyInterestRate * 100 * 100) / 100, // percentage
    monthlyPayment,
    totalPaymentAmount,
    totalInterestPaid,
    interestCostPercentage,
  };
}

export const EXAMPLE_1 = calculateFoodBusinessLoan({
  loanAmount: 1000000,
  annualInterestRate: 6,
  loanTermMonths: 60,
});

export const EXAMPLE_2 = calculateFoodBusinessLoan({
  loanAmount: 2000000,
  annualInterestRate: 5.5,
  loanTermMonths: 84,
});

export const EXAMPLE_3 = calculateFoodBusinessLoan({
  loanAmount: 1500000,
  annualInterestRate: 6,
  loanTermMonths: 72,
});
