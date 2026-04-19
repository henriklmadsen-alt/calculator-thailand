import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateWaterBill } from './water-bill-calculator.ts';

function closeTo(actual: number, expected: number, tolerance = 0.01): void {
  assert.ok(Math.abs(actual - expected) <= tolerance, `Expected ${actual} to be within ${tolerance} of ${expected}`);
}

test('calculates MWA residential bill with monthly meter fee and raw-water surcharge', () => {
  const result = calculateWaterBill({
    provider: 'mwa_residential',
    unitsUsed: 35,
    meterSize: '1/2',
    vatRatePercent: 7,
    includeVat: true,
  });

  assert.equal(result.baseCharge, 305.15);
  assert.equal(result.serviceFee, 25);
  assert.equal(result.rawWaterSurcharge, 5.25);
  assert.equal(result.minimumChargeFloor, 0);
  assert.equal(result.minimumChargeAdjustment, 0);
  assert.equal(result.totalBeforeVat, 335.4);
  assert.equal(result.vatAmount, 23.48);
  assert.equal(result.totalAmount, 358.88);
});

test('applies PWA table 3 minimum charge for low usage', () => {
  const result = calculateWaterBill({
    provider: 'pwa_table_3',
    unitsUsed: 5,
    includeVat: true,
    vatRatePercent: 7,
  });

  assert.equal(result.baseCharge, 51);
  assert.equal(result.minimumChargeFloor, 150);
  assert.equal(result.minimumChargeAdjustment, 99);
  assert.equal(result.totalBeforeVat, 150);
  assert.equal(result.vatAmount, 10.5);
  assert.equal(result.totalAmount, 160.5);
});

test('uses PWA table 1 type-2 rates from unit 51 onward for residential users', () => {
  const result = calculateWaterBill({
    provider: 'pwa_table_1',
    unitsUsed: 120,
    includeVat: true,
    vatRatePercent: 7,
  });

  assert.equal(result.baseCharge, 2594);
  assert.equal(result.minimumChargeAdjustment, 0);
  assert.equal(result.totalBeforeVat, 2594);
  assert.equal(result.vatAmount, 181.58);
  assert.equal(result.totalAmount, 2775.58);
});

test('calculates PWA table 2 tiers through the 301-1,000 bracket', () => {
  const result = calculateWaterBill({
    provider: 'pwa_table_2',
    unitsUsed: 350,
    includeVat: true,
    vatRatePercent: 7,
  });

  closeTo(result.baseCharge, 9678.5);
  closeTo(result.vatAmount, 677.5);
  closeTo(result.totalAmount, 10356);
});

test('clamps invalid input and can skip VAT', () => {
  const result = calculateWaterBill({
    provider: 'mwa_residential',
    unitsUsed: -50,
    meterSize: '1/2',
    includeVat: false,
    vatRatePercent: -3,
  });

  assert.equal(result.baseCharge, 0);
  assert.equal(result.serviceFee, 25);
  assert.equal(result.rawWaterSurcharge, 0);
  assert.equal(result.totalBeforeVat, 25);
  assert.equal(result.vatAmount, 0);
  assert.equal(result.totalAmount, 25);
});
