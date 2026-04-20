/**
 * Condo Rental Yield Calculator (คำนวณค่าเช่าคอนโด)
 * Calculates rental yield and ROI for condo investment.
 *
 * Formulas:
 * - Gross Rental Yield = (Annual Rental Income / Purchase Price) × 100
 * - Net Rental Yield = ((Annual Rental Income − Annual Expenses) / Purchase Price) × 100
 * - Monthly Cash Flow = Monthly Rent − Monthly Expenses − Monthly Mortgage
 * - ROI = ((Annual Rental Income − Annual Expenses) / Total Cash Invested) × 100
 * - Payback Period = Total Cash Invested / Annual Net Income
 *
 * Source: Standard real-estate investment formulas used by
 * Bank of Thailand property market reports and Thai Appraisal Foundation.
 */

export interface RentalYieldInput {
  /** ราคาซื้อคอนโด (บาท) */
  purchasePrice: number;
  /** ค่าเช่ารายเดือน (บาท) */
  monthlyRent: number;
  /** ค่าส่วนกลางรายเดือน (บาท) */
  commonFeeMonthly: number;
  /** ค่าซ่อมบำรุง/ประกันรายปี (บาท) */
  maintenanceAnnual: number;
  /** ค่าธรรมเนียมโอนและภาษี (บาท) — จ่ายครั้งเดียวตอนซื้อ */
  transferFeeTax: number;
  /** เงินดาวน์ (%) */
  downPaymentPercent: number;
  /** อัตราดอกเบี้ยสินเชื่อต่อปี (%) — 0 = ซื้อเงินสด */
  annualInterestRate: number;
  /** ระยะเวลาผ่อน (ปี) — 0 = ซื้อเงินสด */
  loanTermYears: number;
  /** อัตราห้องว่าง (%) — เช่น 8 = ว่าง ~1 เดือน/ปี */
  vacancyRatePercent: number;
}

export interface RentalYieldResult {
  /** ค่าเช่ารวมต่อปี (ก่อนหักห้องว่าง) */
  grossAnnualRent: number;
  /** ค่าเช่าสุทธิต่อปี (หลังหักห้องว่าง) */
  effectiveAnnualRent: number;
  /** รวมค่าใช้จ่ายต่อปี (ส่วนกลาง + ซ่อมบำรุง) */
  annualExpenses: number;
  /** รายได้สุทธิต่อปี (ค่าเช่าสุทธิ − ค่าใช้จ่าย) */
  netOperatingIncome: number;

  /** Gross Rental Yield (%) */
  grossYield: number;
  /** Net Rental Yield (%) */
  netYield: number;

  /** เงินดาวน์ (บาท) */
  downPaymentAmount: number;
  /** ยอดกู้ (บาท) */
  loanAmount: number;
  /** ค่าผ่อนต่อเดือน (บาท) */
  mortgageMonthly: number;
  /** เงินลงทุนทั้งหมด (เงินดาวน์ + ค่าธรรมเนียมโอน) */
  totalCashInvested: number;

  /** Cash-on-Cash ROI (%) — ผลตอบแทนต่อเงินที่ลงทุนจริง */
  cashOnCashROI: number;
  /** กระแสเงินสดรายเดือน (ค่าเช่าสุทธิ/12 − ค่าใช้จ่าย/12 − ค่าผ่อน) */
  monthlyCashFlow: number;
  /** ระยะเวลาคืนทุน (ปี) */
  paybackYears: number;
}

function calcMortgageMonthly(principal: number, annualRate: number, termMonths: number): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / termMonths;
  return principal * (r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
}

export function calculateRentalYield(input: RentalYieldInput): RentalYieldResult {
  const grossAnnualRent = input.monthlyRent * 12;
  const vacancyFraction = input.vacancyRatePercent / 100;
  const effectiveAnnualRent = grossAnnualRent * (1 - vacancyFraction);

  const annualExpenses = (input.commonFeeMonthly * 12) + input.maintenanceAnnual;
  const netOperatingIncome = effectiveAnnualRent - annualExpenses;

  const grossYield = input.purchasePrice > 0
    ? (grossAnnualRent / input.purchasePrice) * 100
    : 0;
  const netYield = input.purchasePrice > 0
    ? (netOperatingIncome / input.purchasePrice) * 100
    : 0;

  const downPaymentAmount = input.purchasePrice * (input.downPaymentPercent / 100);
  const loanAmount = input.purchasePrice - downPaymentAmount;
  const termMonths = input.loanTermYears * 12;
  const mortgageMonthly = calcMortgageMonthly(loanAmount, input.annualInterestRate, termMonths);

  const totalCashInvested = downPaymentAmount + input.transferFeeTax;

  const annualMortgage = mortgageMonthly * 12;
  const annualCashFlow = netOperatingIncome - annualMortgage;
  const monthlyCashFlow = annualCashFlow / 12;

  const cashOnCashROI = totalCashInvested > 0
    ? (annualCashFlow / totalCashInvested) * 100
    : 0;

  const paybackYears = annualCashFlow > 0
    ? totalCashInvested / annualCashFlow
    : annualCashFlow <= 0 ? Infinity : 0;

  return {
    grossAnnualRent,
    effectiveAnnualRent,
    annualExpenses,
    netOperatingIncome,
    grossYield,
    netYield,
    downPaymentAmount,
    loanAmount,
    mortgageMonthly,
    totalCashInvested,
    cashOnCashROI,
    monthlyCashFlow,
    paybackYears,
  };
}
