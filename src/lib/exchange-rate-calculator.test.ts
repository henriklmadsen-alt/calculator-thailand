import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateExchangeConversion } from './exchange-rate-calculator.ts';

test('calculates gross/net conversion without spread fee', () => {
  const result = calculateExchangeConversion({
    amount: 100,
    rate: 31.985,
  });

  assert.equal(result.grossConvertedAmount, 3198.5);
  assert.equal(result.spreadAmount, 0);
  assert.equal(result.netConvertedAmount, 3198.5);
  assert.equal(result.inverseRate, 0.03126466);
  assert.equal(result.effectiveRate, 31.985);
});

test('applies spread fee and returns effective rate after fee', () => {
  const result = calculateExchangeConversion({
    amount: 1000,
    rate: 1.2,
    spreadPercent: 1,
  });

  assert.equal(result.grossConvertedAmount, 1200);
  assert.equal(result.spreadAmount, 12);
  assert.equal(result.netConvertedAmount, 1188);
  assert.equal(result.inverseRate, 0.83333333);
  assert.equal(result.effectiveRate, 1.188);
});

test('supports zero amount while preserving rate information', () => {
  const result = calculateExchangeConversion({
    amount: 0,
    rate: 0.92,
    spreadPercent: 2,
  });

  assert.equal(result.grossConvertedAmount, 0);
  assert.equal(result.spreadAmount, 0);
  assert.equal(result.netConvertedAmount, 0);
  assert.equal(result.inverseRate, 1.08695652);
  assert.equal(result.effectiveRate, 0);
});

test('throws when rate is zero or negative', () => {
  assert.throws(
    () => calculateExchangeConversion({ amount: 100, rate: 0 }),
    /Rate must be greater than zero/,
  );
});
