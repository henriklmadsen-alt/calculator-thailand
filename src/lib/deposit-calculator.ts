/**
 * Thai Deposit Interest Calculator (คำนวณดอกเบี้ยเงินฝาก)
 * Fixed deposit and savings interest with Thai withholding tax (15%)
 */

export type DepositType = 'fixed' | 'savings';

export interface DepositInput {
  principal: number;          // เงินฝาก (บาท)
  annualRate: number;         // อัตราดอกเบี้ย (% ต่อปี)
  termMonths: number;         // ระยะเวลา (เดือน)
  depositType: DepositType;
  monthlyDeposit?: number;    // เงินฝากเพิ่มรายเดือน (สำหรับ savings)
}

export interface DepositResult {
  principal: number;
  annualRate: number;
  termMonths: number;
  depositType: DepositType;
  monthlyDeposit: number;
  totalDeposited: number;      // เงินฝากรวม
  grossInterest: number;       // ดอกเบี้ยก่อนหักภาษี
  withholdingTax: number;      // ภาษีหัก ณ ที่จ่าย 15%
  netInterest: number;         // ดอกเบี้ยสุทธิ
  totalAmount: number;         // เงินฝากรวม + ดอกเบี้ยสุทธิ
  effectiveRate: number;       // อัตราผลตอบแทนสุทธิ (%)
  schedule: DepositScheduleRow[];
}

export interface DepositScheduleRow {
  month: number;
  deposit: number;
  cumulativeDeposit: number;
  interestEarned: number;
  cumulativeInterest: number;
  balance: number;
}

const WITHHOLDING_TAX_RATE = 0.15; // 15% withholding tax on interest

/**
 * Calculate fixed deposit interest
 * Interest = Principal × Rate × (Months/12)
 * Thai banks typically pay interest at maturity for fixed deposits
 */
export function calculateFixedDeposit(input: DepositInput): DepositResult {
  const { principal, annualRate, termMonths } = input;
  const monthlyRate = annualRate / 100 / 12;

  const schedule: DepositScheduleRow[] = [];
  let cumulativeInterest = 0;

  for (let m = 1; m <= termMonths; m++) {
    const interestEarned = principal * monthlyRate;
    cumulativeInterest += interestEarned;
    schedule.push({
      month: m,
      deposit: m === 1 ? principal : 0,
      cumulativeDeposit: principal,
      interestEarned,
      cumulativeInterest,
      balance: principal + cumulativeInterest,
    });
  }

  const grossInterest = cumulativeInterest;
  const withholdingTax = grossInterest * WITHHOLDING_TAX_RATE;
  const netInterest = grossInterest - withholdingTax;

  return {
    principal,
    annualRate,
    termMonths,
    depositType: 'fixed',
    monthlyDeposit: 0,
    totalDeposited: principal,
    grossInterest,
    withholdingTax,
    netInterest,
    totalAmount: principal + netInterest,
    effectiveRate: principal > 0 ? (netInterest / principal) / (termMonths / 12) * 100 : 0,
    schedule,
  };
}

/**
 * Calculate savings with monthly deposits (compound monthly)
 * Each month: balance accrues interest, then new deposit added
 */
export function calculateSavingsDeposit(input: DepositInput): DepositResult {
  const { principal, annualRate, termMonths, monthlyDeposit = 0 } = input;
  const monthlyRate = annualRate / 100 / 12;

  const schedule: DepositScheduleRow[] = [];
  let balance = principal;
  let cumulativeDeposit = principal;
  let cumulativeInterest = 0;

  for (let m = 1; m <= termMonths; m++) {
    const interestEarned = balance * monthlyRate;
    cumulativeInterest += interestEarned;
    balance += interestEarned;

    if (m > 1 && monthlyDeposit > 0) {
      balance += monthlyDeposit;
      cumulativeDeposit += monthlyDeposit;
    }

    schedule.push({
      month: m,
      deposit: m === 1 ? principal : monthlyDeposit,
      cumulativeDeposit,
      interestEarned,
      cumulativeInterest,
      balance,
    });
  }

  const grossInterest = cumulativeInterest;
  const withholdingTax = grossInterest * WITHHOLDING_TAX_RATE;
  const netInterest = grossInterest - withholdingTax;

  return {
    principal,
    annualRate,
    termMonths,
    depositType: 'savings',
    monthlyDeposit,
    totalDeposited: cumulativeDeposit,
    grossInterest,
    withholdingTax,
    netInterest,
    totalAmount: cumulativeDeposit + netInterest,
    effectiveRate: cumulativeDeposit > 0 ? (netInterest / cumulativeDeposit) / (termMonths / 12) * 100 : 0,
    schedule,
  };
}

export function calculateDeposit(input: DepositInput): DepositResult {
  if (input.principal <= 0 || input.termMonths <= 0) {
    return {
      principal: 0, annualRate: 0, termMonths: 0,
      depositType: input.depositType, monthlyDeposit: 0,
      totalDeposited: 0, grossInterest: 0, withholdingTax: 0,
      netInterest: 0, totalAmount: 0, effectiveRate: 0, schedule: [],
    };
  }
  return input.depositType === 'fixed'
    ? calculateFixedDeposit(input)
    : calculateSavingsDeposit(input);
}

export function formatThaiNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}
