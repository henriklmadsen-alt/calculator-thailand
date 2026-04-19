import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateOvertimePay } from './overtime-calculator.ts';

test('calculates weekday overtime at 1.5x from monthly salary base', () => {
  const result = calculateOvertimePay({
    monthlySalary: 26000,
    workingDaysPerMonth: 26,
    workingHoursPerDay: 8,
    overtimeHours: 2,
    overtimeType: 'weekday_ot',
  });

  assert.equal(result.formulaBaseHours, 208);
  assert.equal(result.hourlyRate, 125);
  assert.equal(result.overtimeMultiplier, 1.5);
  assert.equal(result.overtimePay, 375);
});

test('calculates holiday regular work at 2x for daily-paid-equivalent case', () => {
  const result = calculateOvertimePay({
    monthlySalary: 18000,
    workingDaysPerMonth: 26,
    workingHoursPerDay: 8,
    overtimeHours: 6,
    overtimeType: 'holiday_work_daily',
  });

  assert.equal(result.hourlyRate, 86.54);
  assert.equal(result.overtimeMultiplier, 2);
  assert.equal(result.overtimePay, 1038.46);
});

test('calculates holiday overtime at 3x', () => {
  const result = calculateOvertimePay({
    monthlySalary: 31200,
    workingDaysPerMonth: 26,
    workingHoursPerDay: 8,
    overtimeHours: 3,
    overtimeType: 'holiday_ot',
  });

  assert.equal(result.hourlyRate, 150);
  assert.equal(result.overtimeMultiplier, 3);
  assert.equal(result.overtimePay, 1350);
});

test('returns zero overtime pay when overtimeHours is zero', () => {
  const result = calculateOvertimePay({
    monthlySalary: 26000,
    workingDaysPerMonth: 26,
    workingHoursPerDay: 8,
    overtimeHours: 0,
    overtimeType: 'weekday_ot',
  });

  assert.equal(result.hourlyRate, 125);
  assert.equal(result.overtimePay, 0);
});
