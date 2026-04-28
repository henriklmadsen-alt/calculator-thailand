/**
 * Thai Loan Payment Calculator (คำนวณผ่อนกู้)
 * Supports flat rate and reducing balance (annuity) methods
 */

export type LoanMethod = 'reducing' | 'flat';

export interface LoanInput {
  principal: number;       // เงินกู้ (บาท)
  annualRate: number;      // อัตราดอกเบี้ยต่อปี (%)
  termMonths: number;      // ระยะเวลาผ่อน (เดือน)
  method: LoanMethod;
}

export interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  principal: number;
  annualRate: number;
  termMonths: number;
  method: LoanMethod;
  schedule: AmortizationRow[];
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principalPart: number;
  interestPart: number;
  remainingBalance: number;
}

/** Reducing balance (annuity) — equal monthly payments */
export function calcReducingBalance(input: LoanInput): LoanResult {
  const { principal, annualRate, termMonths } = input;
  const monthlyRate = annualRate / 100 / 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = principal / termMonths;
  } else {
    monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
  }

  const schedule: AmortizationRow[] = [];
  let balance = principal;

  for (let m = 1; m <= termMonths; m++) {
    const interestPart = balance * monthlyRate;
    const principalPart = monthlyPayment - interestPart;
    balance = Math.max(0, balance - principalPart);
    schedule.push({
      month: m,
      payment: monthlyPayment,
      principalPart,
      interestPart,
      remainingBalance: balance,
    });
  }

  const totalPaid = monthlyPayment * termMonths;
  return {
    monthlyPayment,
    totalInterest: totalPaid - principal,
    totalPaid,
    principal,
    annualRate,
    termMonths,
    method: 'reducing',
    schedule,
  };
}

/** Flat rate — interest calculated on original principal */
export function calcFlatRate(input: LoanInput): LoanResult {
  const { principal, annualRate, termMonths } = input;
  const totalInterest = principal * (annualRate / 100) * (termMonths / 12);
  const totalPaid = principal + totalInterest;
  const monthlyPayment = totalPaid / termMonths;
  const monthlyPrincipal = principal / termMonths;
  const monthlyInterest = totalInterest / termMonths;

  const schedule: AmortizationRow[] = [];
  let balance = principal;

  for (let m = 1; m <= termMonths; m++) {
    balance = Math.max(0, balance - monthlyPrincipal);
    schedule.push({
      month: m,
      payment: monthlyPayment,
      principalPart: monthlyPrincipal,
      interestPart: monthlyInterest,
      remainingBalance: balance,
    });
  }

  return {
    monthlyPayment,
    totalInterest,
    totalPaid,
    principal,
    annualRate,
    termMonths,
    method: 'flat',
    schedule,
  };
}

export function calculateLoan(input: LoanInput): LoanResult {
  if (input.principal <= 0 || input.termMonths <= 0) {
    return {
      monthlyPayment: 0, totalInterest: 0, totalPaid: 0,
      principal: 0, annualRate: 0, termMonths: 0,
      method: input.method, schedule: [],
    };
  }
  return input.method === 'flat' ? calcFlatRate(input) : calcReducingBalance(input);
}

export function formatThaiNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}
