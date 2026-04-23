import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCreditCardInterest } from './credit-card-interest.ts';

function closeTo(actual: number, expected: number, tolerance = 0.01): void {
  assert.ok(Math.abs(actual - expected) <= tolerance, `Expected ${actual} to be within ${tolerance} of ${expected}`);
}

test('calculates revolving purchase interest in two periods', () => {
  const result = calculateCreditCardInterest({
    statementBalance: 30000,
    paymentAmount: 8000,
    annualInterestRate: 16,
    minPaymentRate: 8,
    daysBeforeDue: 20,
    daysAfterPayment: 25,
  });

  assert.equal(result.minimumPayment, 2400);
  assert.equal(result.remainingPrincipal, 22000);
  closeTo(result.purchaseInterestBeforeDue, 263.01);
  closeTo(result.purchaseInterestAfterPayment, 241.1);
  closeTo(result.totalInterest, 504.11);
  closeTo(result.nextStatementBalance, 22504.11);
});

test('charges no purchase interest when full statement is paid', () => {
  const result = calculateCreditCardInterest({
    statementBalance: 18000,
    paymentAmount: 18000,
    annualInterestRate: 16,
    minPaymentRate: 8,
    daysBeforeDue: 20,
    daysAfterPayment: 25,
  });

  assert.equal(result.minimumPayment, 1440);
  assert.equal(result.remainingPrincipal, 0);
  assert.equal(result.purchaseInterestBeforeDue, 0);
  assert.equal(result.purchaseInterestAfterPayment, 0);
  assert.equal(result.totalInterest, 0);
  assert.equal(result.nextStatementBalance, 0);
});

test('adds cash-advance fee, VAT, and cash-advance interest correctly', () => {
  const result = calculateCreditCardInterest({
    statementBalance: 25000,
    paymentAmount: 5000,
    annualInterestRate: 16,
    minPaymentRate: 8,
    daysBeforeDue: 18,
    daysAfterPayment: 20,
    cashAdvanceAmount: 4000,
    cashAdvanceDays: 30,
  });

  assert.equal(result.minimumPayment, 2000);
  assert.equal(result.remainingPrincipal, 20000);
  closeTo(result.purchaseInterestBeforeDue, 197.26);
  closeTo(result.purchaseInterestAfterPayment, 175.34);
  closeTo(result.cashAdvanceInterest, 52.6);
  assert.equal(result.cashAdvanceFee, 120);
  assert.equal(result.cashAdvanceVat, 8.4);
  closeTo(result.totalInterest, 425.2);
  assert.equal(result.totalFees, 128.4);
  closeTo(result.nextStatementBalance, 20553.61);
});
