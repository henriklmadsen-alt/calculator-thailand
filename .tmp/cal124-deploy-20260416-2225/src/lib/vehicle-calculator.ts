/**
 * Thai Vehicle Payment Calculator (คำนวณผ่อนรถ)
 * Car loan with down payment, flat rate interest (standard in Thai auto financing)
 */

export interface VehicleInput {
  carPrice: number;          // ราคารถ (บาท)
  downPaymentPercent: number; // เงินดาวน์ (%)
  annualRate: number;         // อัตราดอกเบี้ย (% ต่อปี, flat rate)
  termMonths: number;         // ระยะเวลาผ่อน (เดือน)
}

export interface VehicleResult {
  carPrice: number;
  downPayment: number;
  downPaymentPercent: number;
  financeAmount: number;
  annualRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  totalCost: number;         // เงินดาวน์ + ยอดผ่อนรวม
  schedule: VehicleScheduleRow[];
}

export interface VehicleScheduleRow {
  month: number;
  payment: number;
  principalPart: number;
  interestPart: number;
  remainingBalance: number;
}

/**
 * Calculate vehicle loan (flat rate — standard for Thai auto loans)
 * Thai car loans use flat rate: interest = principal × rate × years
 */
export function calculateVehicle(input: VehicleInput): VehicleResult {
  const { carPrice, downPaymentPercent, annualRate, termMonths } = input;

  if (carPrice <= 0 || termMonths <= 0) {
    return {
      carPrice: 0, downPayment: 0, downPaymentPercent: 0,
      financeAmount: 0, annualRate: 0, termMonths: 0,
      monthlyPayment: 0, totalInterest: 0, totalPaid: 0, totalCost: 0,
      schedule: [],
    };
  }

  const downPayment = carPrice * (downPaymentPercent / 100);
  const financeAmount = carPrice - downPayment;
  const termYears = termMonths / 12;

  // Flat rate interest calculation (Thai auto standard)
  const totalInterest = financeAmount * (annualRate / 100) * termYears;
  const totalPaid = financeAmount + totalInterest;
  const monthlyPayment = totalPaid / termMonths;
  const monthlyPrincipal = financeAmount / termMonths;
  const monthlyInterest = totalInterest / termMonths;

  const schedule: VehicleScheduleRow[] = [];
  let balance = financeAmount;

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
    carPrice,
    downPayment,
    downPaymentPercent,
    financeAmount,
    annualRate,
    termMonths,
    monthlyPayment,
    totalInterest,
    totalPaid,
    totalCost: downPayment + totalPaid,
    schedule,
  };
}

export function formatThaiNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}
