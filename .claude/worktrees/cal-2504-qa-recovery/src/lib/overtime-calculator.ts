export type OvertimeType = 'weekday_ot' | 'holiday_work_daily' | 'holiday_ot';

export interface OvertimeCalculatorInput {
  monthlySalary: number;
  workingDaysPerMonth: number;
  workingHoursPerDay: number;
  overtimeHours: number;
  overtimeType: OvertimeType;
}

export interface OvertimeCalculatorResult {
  hourlyRate: number;
  overtimeMultiplier: number;
  overtimePay: number;
  formulaBaseHours: number;
}

export const OVERTIME_MULTIPLIERS: Record<OvertimeType, number> = {
  weekday_ot: 1.5,
  holiday_work_daily: 2,
  holiday_ot: 3,
};

function assertPositiveNumber(value: number, fieldName: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive number.`);
  }
}

function assertNonNegativeNumber(value: number, fieldName: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${fieldName} must be a non-negative number.`);
  }
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateOvertimePay(input: OvertimeCalculatorInput): OvertimeCalculatorResult {
  assertPositiveNumber(input.monthlySalary, 'monthlySalary');
  assertPositiveNumber(input.workingDaysPerMonth, 'workingDaysPerMonth');
  assertPositiveNumber(input.workingHoursPerDay, 'workingHoursPerDay');
  assertNonNegativeNumber(input.overtimeHours, 'overtimeHours');

  const overtimeMultiplier = OVERTIME_MULTIPLIERS[input.overtimeType];
  if (!overtimeMultiplier) {
    throw new Error('overtimeType is invalid.');
  }

  const formulaBaseHours = input.workingDaysPerMonth * input.workingHoursPerDay;
  const hourlyRate = input.monthlySalary / formulaBaseHours;
  const overtimePay = hourlyRate * overtimeMultiplier * input.overtimeHours;

  return {
    hourlyRate: roundCurrency(hourlyRate),
    overtimeMultiplier,
    overtimePay: roundCurrency(overtimePay),
    formulaBaseHours: roundCurrency(formulaBaseHours),
  };
}
