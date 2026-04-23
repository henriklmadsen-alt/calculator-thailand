/**
 * Thai Personal Income Tax Calculator (ภาษีเงินได้บุคคลธรรมดา)
 * Tax year 2026/2569 progressive brackets
 */

export interface TaxInput {
  annualIncome: number;
  personalAllowance: boolean;      // ค่าลดหย่อนส่วนตัว 60,000
  spouseAllowance: boolean;        // ค่าลดหย่อนคู่สมรส 60,000
  childCount: number;              // บุตร 30,000 ต่อคน
  socialSecurity: number;          // ประกันสังคม (max 9,000)
  lifeInsurance: number;           // ประกันชีวิต (max 100,000)
  healthInsurance: number;         // ประกันสุขภาพ (max 25,000)
  providentFund: number;           // กองทุนสำรองเลี้ยงชีพ (max 10,000)
  homeLoanInterest: number;        // ดอกเบี้ยบ้าน (max 100,000)
  socialEnterprise: number;        // เงินบริจาค (max 10% of income after expenses)
  otherDeductions: number;         // ค่าลดหย่อนอื่นๆ
}

export interface TaxResult {
  annualIncome: number;
  totalExpenseDeduction: number;
  totalAllowances: number;
  netIncome: number;
  annualTax: number;
  monthlyTax: number;
  effectiveRate: number;
  takeHomePay: number;
  monthlyTakeHome: number;
  bracketBreakdown: BracketBreakdown[];
}

export interface BracketBreakdown {
  min: number;
  max: number;
  rate: number;
  taxableInBracket: number;
  taxInBracket: number;
}

// 2026/2569 Thai personal income tax brackets
const TAX_BRACKETS: { min: number; max: number; rate: number }[] = [
  { min: 0, max: 150_000, rate: 0 },
  { min: 150_000, max: 300_000, rate: 0.05 },
  { min: 300_000, max: 500_000, rate: 0.10 },
  { min: 500_000, max: 750_000, rate: 0.15 },
  { min: 750_000, max: 1_000_000, rate: 0.20 },
  { min: 1_000_000, max: 2_000_000, rate: 0.25 },
  { min: 2_000_000, max: 5_000_000, rate: 0.30 },
  { min: 5_000_000, max: Infinity, rate: 0.35 },
];

// Expense deduction: 50% of income, max 100,000
const EXPENSE_DEDUCTION_RATE = 0.5;
const EXPENSE_DEDUCTION_MAX = 100_000;

// Allowance caps
const PERSONAL_ALLOWANCE = 60_000;
const SPOUSE_ALLOWANCE = 60_000;
const CHILD_ALLOWANCE = 30_000;
const SOCIAL_SECURITY_MAX = 9_000;
const LIFE_INSURANCE_MAX = 100_000;
const HEALTH_INSURANCE_MAX = 25_000;
const PROVIDENT_FUND_MAX = 10_000;
const HOME_LOAN_INTEREST_MAX = 100_000;

export function calculateExpenseDeduction(annualIncome: number): number {
  return Math.min(annualIncome * EXPENSE_DEDUCTION_RATE, EXPENSE_DEDUCTION_MAX);
}

export function calculateAllowances(input: TaxInput): number {
  let total = 0;
  if (input.personalAllowance) total += PERSONAL_ALLOWANCE;
  if (input.spouseAllowance) total += SPOUSE_ALLOWANCE;
  total += Math.max(0, input.childCount) * CHILD_ALLOWANCE;
  total += Math.min(Math.max(0, input.socialSecurity), SOCIAL_SECURITY_MAX);
  total += Math.min(Math.max(0, input.lifeInsurance), LIFE_INSURANCE_MAX);
  total += Math.min(Math.max(0, input.healthInsurance), HEALTH_INSURANCE_MAX);
  total += Math.min(Math.max(0, input.providentFund), PROVIDENT_FUND_MAX);
  total += Math.min(Math.max(0, input.homeLoanInterest), HOME_LOAN_INTEREST_MAX);
  total += Math.max(0, input.socialEnterprise);
  total += Math.max(0, input.otherDeductions);
  return total;
}

export function calculateProgressiveTax(netIncome: number): { tax: number; breakdown: BracketBreakdown[] } {
  let remaining = Math.max(0, netIncome);
  let totalTax = 0;
  const breakdown: BracketBreakdown[] = [];

  for (const bracket of TAX_BRACKETS) {
    const bracketWidth = bracket.max === Infinity ? Infinity : bracket.max - bracket.min;
    const taxableInBracket = Math.min(remaining, bracketWidth);
    const taxInBracket = taxableInBracket * bracket.rate;

    breakdown.push({
      min: bracket.min,
      max: bracket.max,
      rate: bracket.rate,
      taxableInBracket,
      taxInBracket,
    });

    totalTax += taxInBracket;
    remaining -= taxableInBracket;
    if (remaining <= 0) break;
  }

  return { tax: totalTax, breakdown };
}

export function calculateTax(input: TaxInput): TaxResult {
  const annualIncome = Math.max(0, input.annualIncome);
  const totalExpenseDeduction = calculateExpenseDeduction(annualIncome);
  const totalAllowances = calculateAllowances(input);
  const netIncome = Math.max(0, annualIncome - totalExpenseDeduction - totalAllowances);
  const { tax: annualTax, breakdown } = calculateProgressiveTax(netIncome);

  return {
    annualIncome,
    totalExpenseDeduction,
    totalAllowances,
    netIncome,
    annualTax,
    monthlyTax: annualTax / 12,
    effectiveRate: annualIncome > 0 ? (annualTax / annualIncome) * 100 : 0,
    takeHomePay: annualIncome - annualTax,
    monthlyTakeHome: (annualIncome - annualTax) / 12,
    bracketBreakdown: breakdown,
  };
}

export function formatThaiNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}
