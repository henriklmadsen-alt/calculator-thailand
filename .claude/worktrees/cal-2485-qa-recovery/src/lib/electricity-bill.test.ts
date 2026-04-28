import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateElectricityBill, DEFAULT_ELECTRICITY_FT_RATE } from './electricity-bill.ts';

function closeTo(actual: number, expected: number, tolerance = 0.01): void {
  assert.ok(Math.abs(actual - expected) <= tolerance, `Expected ${actual} to be within ${tolerance} of ${expected}`);
}

test('calculates residential tariff 1.1 for usage up to 150 units', () => {
  const result = calculateElectricityBill({
    units: 100,
    provider: 'mea',
    customerType: 'residential',
  });

  assert.equal(result.tariffCode, '1.1');
  assert.equal(result.appliedFtRate, DEFAULT_ELECTRICITY_FT_RATE);
  closeTo(result.energyCharge, 333.06);
  closeTo(result.serviceCharge, 8.19);
  closeTo(result.ftCharge, 9.72);
  closeTo(result.subtotalBeforeVat, 350.97);
  closeTo(result.vatAmount, 24.57);
  closeTo(result.totalBill, 375.54);
});

test('calculates residential tariff 1.2 for usage over 150 units', () => {
  const result = calculateElectricityBill({
    units: 200,
    provider: 'pea',
    customerType: 'residential',
  });

  assert.equal(result.tariffCode, '1.2');
  closeTo(result.energyCharge, 698.35);
  closeTo(result.serviceCharge, 24.62);
  closeTo(result.ftCharge, 19.44);
  closeTo(result.subtotalBeforeVat, 742.41);
  closeTo(result.vatAmount, 51.97);
  closeTo(result.totalBill, 794.38);
});

test('calculates small-business tariff 2.1.2 with the same tiered energy rates and business service fee', () => {
  const result = calculateElectricityBill({
    units: 450,
    provider: 'mea',
    customerType: 'small_business',
  });

  assert.equal(result.tariffCode, '2.1.2');
  closeTo(result.energyCharge, 1763.8);
  closeTo(result.serviceCharge, 33.29);
  closeTo(result.ftCharge, 43.74);
  closeTo(result.subtotalBeforeVat, 1840.83);
  closeTo(result.vatAmount, 128.86);
  closeTo(result.totalBill, 1969.69);
});

test('uses custom Ft input when provided', () => {
  const result = calculateElectricityBill({
    units: 200,
    provider: 'mea',
    customerType: 'residential',
    ftRate: 0.1623,
  });

  closeTo(result.ftCharge, 32.46);
  closeTo(result.totalBill, 808.31);
});

test('honors Ft rate of 0 when explicitly provided', () => {
  const result = calculateElectricityBill({
    units: 120,
    provider: 'pea',
    customerType: 'residential',
    ftRate: 0,
  });

  closeTo(result.ftCharge, 0);
  closeTo(result.subtotalBeforeVat, 415.59);
  closeTo(result.vatAmount, 29.09);
  closeTo(result.totalBill, 444.68);
});
