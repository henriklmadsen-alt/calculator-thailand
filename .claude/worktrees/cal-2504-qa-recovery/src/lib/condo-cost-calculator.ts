/**
 * Condo Monthly Cost Calculator (คำนวณค่าคอนโด)
 * Calculates total monthly ownership costs including:
 * - Mortgage payment (ค่าผ่อนสินเชื่อ) — reducing balance (annuity)
 * - Common area fee (ค่าส่วนกลาง) — area × rate/sqm/month
 * - Sinking fund (เงินกองทุน) — one-time cost amortized monthly
 * - Insurance (ประกันภัย) — annual premium / 12
 * - Utilities estimate (ค่าสาธารณูปโภค) — electricity + water + internet
 */

export interface CondoCostInput {
  /** ราคาห้อง (บาท) */
  unitPrice: number;
  /** เงินดาวน์ (%) */
  downPaymentPercent: number;
  /** อัตราดอกเบี้ยต่อปี (%) */
  annualInterestRate: number;
  /** ระยะเวลาผ่อน (ปี) */
  loanTermYears: number;
  /** ขนาดห้อง (ตร.ม.) */
  areaSqm: number;
  /** ค่าส่วนกลาง (บาท/ตร.ม./เดือน) */
  commonFeePerSqm: number;
  /** เงินกองทุน (บาท/ตร.ม.) — จ่ายครั้งเดียวแรกเข้า */
  sinkingFundPerSqm: number;
  /** ประกันภัยรายปี (บาท/ปี) */
  insuranceAnnual: number;
  /** ค่าไฟฟ้าต่อเดือน (บาท) */
  electricityMonthly: number;
  /** ค่าน้ำต่อเดือน (บาท) */
  waterMonthly: number;
  /** ค่าอินเทอร์เน็ตต่อเดือน (บาท) */
  internetMonthly: number;
}

export interface CondoCostResult {
  /** เงินดาวน์ (บาท) */
  downPaymentAmount: number;
  /** ยอดกู้ (บาท) */
  loanAmount: number;
  /** ค่าผ่อนต่อเดือน (บาท) */
  mortgageMonthly: number;
  /** ค่าส่วนกลางต่อเดือน (บาท) */
  commonFeeMonthly: number;
  /** เงินกองทุนแรกเข้า (บาท) */
  sinkingFundTotal: number;
  /** เงินกองทุนเฉลี่ยต่อเดือน (บาท) — amortized over loan term */
  sinkingFundMonthly: number;
  /** ประกันภัยต่อเดือน (บาท) */
  insuranceMonthly: number;
  /** ค่าไฟฟ้าต่อเดือน (บาท) */
  electricityMonthly: number;
  /** ค่าน้ำต่อเดือน (บาท) */
  waterMonthly: number;
  /** ค่าอินเทอร์เน็ตต่อเดือน (บาท) */
  internetMonthly: number;
  /** ค่าสาธารณูปโภครวมต่อเดือน (บาท) */
  utilitiesMonthly: number;
  /** รวมค่าใช้จ่ายต่อเดือน (บาท) */
  totalMonthly: number;
  /** รวมค่าใช้จ่ายต่อปี (บาท) */
  totalAnnual: number;
  /** ดอกเบี้ยรวมตลอดสัญญา (บาท) */
  totalInterest: number;
  /** ยอดผ่อนรวมตลอดสัญญา (บาท) */
  totalMortgagePaid: number;
  /** ค่าใช้จ่ายรวมตลอดสัญญา (ผ่อน + ส่วนกลาง + ประกัน + สาธารณูปโภค) */
  totalCostOverLoan: number;
}

/**
 * Mortgage monthly payment — reducing balance (annuity) formula:
 * M = P × [r(1+r)^n] / [(1+r)^n - 1]
 * where P = principal, r = monthly rate, n = total months
 */
function calcMortgageMonthly(principal: number, annualRate: number, termMonths: number): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / termMonths;
  return principal * (r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
}

export function calculateCondoCost(input: CondoCostInput): CondoCostResult {
  const downPaymentAmount = input.unitPrice * (input.downPaymentPercent / 100);
  const loanAmount = input.unitPrice - downPaymentAmount;
  const termMonths = input.loanTermYears * 12;

  const mortgageMonthly = calcMortgageMonthly(loanAmount, input.annualInterestRate, termMonths);
  const commonFeeMonthly = input.areaSqm * input.commonFeePerSqm;
  const sinkingFundTotal = input.areaSqm * input.sinkingFundPerSqm;
  const sinkingFundMonthly = termMonths > 0 ? sinkingFundTotal / termMonths : 0;
  const insuranceMonthly = input.insuranceAnnual / 12;

  const utilitiesMonthly = input.electricityMonthly + input.waterMonthly + input.internetMonthly;

  const totalMonthly = mortgageMonthly + commonFeeMonthly + sinkingFundMonthly + insuranceMonthly + utilitiesMonthly;
  const totalAnnual = totalMonthly * 12;

  const totalMortgagePaid = mortgageMonthly * termMonths;
  const totalInterest = totalMortgagePaid - loanAmount;

  const totalCostOverLoan = totalMortgagePaid
    + (commonFeeMonthly * termMonths)
    + sinkingFundTotal
    + (insuranceMonthly * termMonths)
    + (utilitiesMonthly * termMonths);

  return {
    downPaymentAmount,
    loanAmount,
    mortgageMonthly,
    commonFeeMonthly,
    sinkingFundTotal,
    sinkingFundMonthly,
    insuranceMonthly,
    electricityMonthly: input.electricityMonthly,
    waterMonthly: input.waterMonthly,
    internetMonthly: input.internetMonthly,
    utilitiesMonthly,
    totalMonthly,
    totalAnnual,
    totalInterest,
    totalMortgagePaid,
    totalCostOverLoan,
  };
}
