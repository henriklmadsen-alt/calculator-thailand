/**
 * Thai Health Savings Calculator (คำนวณการออมค่าสุขภาพ)
 *
 * Sources:
 * - Thai Health Savings Account Guidelines
 * - Ministry of Finance tax incentives
 * - Savings rate projections
 */

export interface HealthSavingsInput {
  monthlyContribution: number;
  annualHealthExpense: number;
  savingsGoalYears: number;
  expectedAnnualInterest: number;
}

export interface HealthSavingsResult {
  monthlyContribution: number;
  annualContribution: number;
  totalContributions: number;
  interestEarned: number;
  savingsBalance: number;
  adequacyPercent: number;
  recommendedMonthly: number;
  taxBenefit: number;
  years: number;
}

export function calculateHealthSavings(
  input: HealthSavingsInput,
): HealthSavingsResult {
  const {
    monthlyContribution,
    annualHealthExpense,
    savingsGoalYears,
    expectedAnnualInterest,
  } = input;

  const annualContribution = monthlyContribution * 12;
  const totalContributions = annualContribution * savingsGoalYears;

  // Simple interest calculation
  const interestRate = expectedAnnualInterest / 100;
  let balance = 0;
  for (let i = 0; i < savingsGoalYears * 12; i++) {
    balance += monthlyContribution;
    balance += (balance * interestRate) / 12;
  }

  const interestEarned = balance - totalContributions;
  const savingsBalance = balance;

  const totalHealthExpense = annualHealthExpense * savingsGoalYears;
  const adequacyPercent = Math.round((savingsBalance / totalHealthExpense) * 100);

  // Thai tax benefit for health savings
  const taxBenefit = Math.round(annualContribution * 0.15); // Assume 15% tax rate

  // Recommended savings: 10% of annual health expense
  const recommendedMonthly = Math.round((annualHealthExpense * 0.1) / 12);

  return {
    monthlyContribution,
    annualContribution,
    totalContributions,
    interestEarned,
    savingsBalance,
    adequacyPercent,
    recommendedMonthly,
    taxBenefit,
    years: savingsGoalYears,
  };
}
