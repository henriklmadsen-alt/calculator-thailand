/**
 * Thai Daily Wage Calculator
 * คำนวณค่าจ้างรายวัน — แปลงเงินเดือนเป็นรายวันและรายวันเป็นรายเดือน
 *
 * Legal basis:
 * - พ.ร.บ. คุ้มครองแรงงาน พ.ศ. 2541 (มาตรา 61-63: OT rates)
 * - ประกันสังคม มาตรา 33: 5% of salary, floor 1,650 / cap 15,000
 * - Standard working hours: 8 hours/day per มาตรา 23
 */

export type ConversionMode = 'monthly_to_daily' | 'daily_to_monthly';

export interface DailyWageInput {
  mode: ConversionMode;
  amount: number; // monthly salary or daily wage depending on mode
  workingDaysPerMonth: number;
  includeOt: boolean;
  weekdayOtHours: number;
  holidayWorkHours: number;
  holidayOtHours: number;
  deductSocialSecurity: boolean;
}

export interface DailyWageResult {
  dailyWage: number;
  monthlyWage: number;
  hourlyRate: number;
  weekdayOtPay: number;
  holidayWorkPay: number;
  holidayOtPay: number;
  totalOtPay: number;
  socialSecurityDeduction: number;
  totalMonthlyIncome: number;
  netMonthlyIncome: number;
}

const STANDARD_HOURS_PER_DAY = 8;
const SSO_RATE = 0.05;
const SSO_MIN_BASE = 1650;
const SSO_MAX_BASE = 15000;

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateDailyWage(input: DailyWageInput): DailyWageResult {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error('amount must be a positive number.');
  }
  if (!Number.isFinite(input.workingDaysPerMonth) || input.workingDaysPerMonth <= 0) {
    throw new Error('workingDaysPerMonth must be a positive number.');
  }

  let dailyWage: number;
  let monthlyWage: number;

  if (input.mode === 'monthly_to_daily') {
    monthlyWage = input.amount;
    dailyWage = roundCurrency(monthlyWage / input.workingDaysPerMonth);
  } else {
    dailyWage = input.amount;
    monthlyWage = roundCurrency(dailyWage * input.workingDaysPerMonth);
  }

  const hourlyRate = roundCurrency(dailyWage / STANDARD_HOURS_PER_DAY);

  let weekdayOtPay = 0;
  let holidayWorkPay = 0;
  let holidayOtPay = 0;

  if (input.includeOt) {
    // มาตรา 61: OT วันทำงานปกติ = 1.5 เท่าของค่าจ้างรายชั่วโมง
    weekdayOtPay = roundCurrency(hourlyRate * 1.5 * input.weekdayOtHours);
    // มาตรา 62: ทำงานวันหยุด = 2 เท่าของค่าจ้างรายชั่วโมง (สำหรับลูกจ้างรายวัน)
    holidayWorkPay = roundCurrency(hourlyRate * 2 * input.holidayWorkHours);
    // มาตรา 63: OT วันหยุด = 3 เท่าของค่าจ้างรายชั่วโมง
    holidayOtPay = roundCurrency(hourlyRate * 3 * input.holidayOtHours);
  }

  const totalOtPay = roundCurrency(weekdayOtPay + holidayWorkPay + holidayOtPay);
  const totalMonthlyIncome = roundCurrency(monthlyWage + totalOtPay);

  let socialSecurityDeduction = 0;
  if (input.deductSocialSecurity) {
    // ประกันสังคม มาตรา 33: 5% of base salary (not OT), capped at 750 baht
    const ssoBase = Math.max(SSO_MIN_BASE, Math.min(monthlyWage, SSO_MAX_BASE));
    socialSecurityDeduction = roundCurrency(ssoBase * SSO_RATE);
  }

  const netMonthlyIncome = roundCurrency(totalMonthlyIncome - socialSecurityDeduction);

  return {
    dailyWage,
    monthlyWage,
    hourlyRate,
    weekdayOtPay,
    holidayWorkPay,
    holidayOtPay,
    totalOtPay,
    socialSecurityDeduction,
    totalMonthlyIncome,
    netMonthlyIncome,
  };
}
