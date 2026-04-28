/**
 * Thai Agricultural Loan Calculator
 * Sources: Bank of Thailand, Government Savings Bank Agricultural Loan Terms
 */

export interface AgriculturalLoanInput {
  loanAmount: number; // Principal amount (THB)
  interestRate: number; // Annual interest rate (%)
  loanTerm: number; // Years
}

export interface AgriculturalLoanResult {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export function calculateAgriculturalLoan(input: AgriculturalLoanInput): AgriculturalLoanResult {
  const principal = input.loanAmount;
  const monthlyRate = input.interestRate / 100 / 12;
  const numberOfPayments = input.loanTerm * 12;

  // Monthly payment formula: P * [r(1+r)^n] / [(1+r)^n - 1]
  const monthlyPayment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - principal;

  return {
    loanAmount: Math.round(principal),
    interestRate: input.interestRate,
    loanTerm: input.loanTerm,
    monthlyPayment: Math.round(monthlyPayment),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
  };
}

export const EXAMPLE_1 = calculateAgriculturalLoan({
  loanAmount: 200000,
  interestRate: 4.5,
  loanTerm: 5,
});

export const EXAMPLE_2 = calculateAgriculturalLoan({
  loanAmount: 500000,
  interestRate: 3.5,
  loanTerm: 10,
});

export const EXAMPLE_3 = calculateAgriculturalLoan({
  loanAmount: 1000000,
  interestRate: 4.0,
  loanTerm: 15,
});
