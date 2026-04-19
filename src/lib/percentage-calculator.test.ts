import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateIncreaseDecrease,
  calculatePercentChange,
  calculatePercentOf,
  calculateWhatPercent,
} from './percentage-calculator.ts';

test('mode 1: calculates X percent of Y correctly', () => {
  const result = calculatePercentOf(15, 35000);

  assert.equal(result.decimalPercent, 0.15);
  assert.equal(result.resultValue, 5250);
});

test('mode 2: calculates X is what percent of Y correctly', () => {
  const result = calculateWhatPercent(8400, 35000);

  assert.equal(result.ratio, 0.24);
  assert.equal(result.percentValue, 24);
});

test('mode 3: calculates increase and decrease correctly', () => {
  const increased = calculateIncreaseDecrease(1200, 7.5, 'increase');
  const decreased = calculateIncreaseDecrease(1200, 7.5, 'decrease');

  assert.equal(increased.deltaValue, 90);
  assert.equal(increased.resultValue, 1290);
  assert.equal(decreased.deltaValue, 90);
  assert.equal(decreased.resultValue, 1110);
});

test('mode 4: calculates percent change between old and new values correctly', () => {
  const result = calculatePercentChange(25000, 30000);

  assert.equal(result.deltaValue, 5000);
  assert.equal(result.percentChangeValue, 20);
});

test('mode 4: throws when old value is zero', () => {
  assert.throws(() => calculatePercentChange(0, 100), /old_value_must_not_be_zero/);
});
