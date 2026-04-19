import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePropertyTransferFee } from './property-transfer-fee.ts';

function closeTo(actual: number, expected: number, tolerance = 0.01): void {
  assert.ok(Math.abs(actual - expected) <= tolerance, `Expected ${actual} to be within ${tolerance} of ${expected}`);
}

test('calculates sale case with specific business tax for holding period under 5 years', () => {
  const result = calculatePropertyTransferFee({
    appraisedValue: 3000000,
    salePrice: 3200000,
    sellerType: 'individual',
    ownershipYears: 3,
    transferType: 'sale',
  });

  assert.equal(result.transferFee, 60000);
  assert.equal(result.specificBusinessTax, 105600);
  assert.equal(result.stampDuty, 0);
  assert.equal(result.isSpecificBusinessTaxApplied, true);
  closeTo(result.withholdingTax, 34500);
  closeTo(result.totalFee, 200100);
});

test('calculates sale case with stamp duty when specific business tax does not apply', () => {
  const result = calculatePropertyTransferFee({
    appraisedValue: 4500000,
    salePrice: 4400000,
    sellerType: 'individual',
    ownershipYears: 8,
    transferType: 'sale',
  });

  assert.equal(result.transferFee, 90000);
  assert.equal(result.specificBusinessTax, 0);
  assert.equal(result.stampDuty, 22500);
  assert.equal(result.isStampDutyApplied, true);
  closeTo(result.withholdingTax, 112500);
  closeTo(result.totalFee, 225000);
});

test('calculates withholding at 1% branch when party type is company', () => {
  const result = calculatePropertyTransferFee({
    appraisedValue: 5000000,
    salePrice: 5500000,
    sellerType: 'company',
    ownershipYears: 2,
    transferType: 'sale',
  });

  assert.equal(result.transferFee, 100000);
  assert.equal(result.specificBusinessTax, 181500);
  assert.equal(result.stampDuty, 0);
  assert.equal(result.withholdingTax, 55000);
  assert.equal(result.withholdingBase, 5500000);
  closeTo(result.totalFee, 336500);
});

test('applies specific business tax when actual holding period is below 5 years', () => {
  const result = calculatePropertyTransferFee({
    appraisedValue: 2000000,
    salePrice: 1800000,
    sellerType: 'individual',
    ownershipYears: 4.2,
    transferType: 'sale',
  });

  assert.equal(result.isSpecificBusinessTaxApplied, true);
  assert.equal(result.isStampDutyApplied, false);
  assert.equal(result.specificBusinessTax, 66000);
  assert.equal(result.stampDuty, 0);
  closeTo(result.totalFee, 141000);
});

test('does not apply specific business tax at exactly 5 years holding period', () => {
  const result = calculatePropertyTransferFee({
    appraisedValue: 2000000,
    salePrice: 1800000,
    sellerType: 'individual',
    ownershipYears: 5,
    transferType: 'sale',
  });

  assert.equal(result.isSpecificBusinessTaxApplied, false);
  assert.equal(result.isStampDutyApplied, true);
  assert.equal(result.specificBusinessTax, 0);
  assert.equal(result.stampDuty, 10000);
});

test('keeps company seller in SBT branch even when holding period is 5+ years', () => {
  const result = calculatePropertyTransferFee({
    appraisedValue: 3000000,
    salePrice: 3500000,
    sellerType: 'company',
    ownershipYears: 8,
    transferType: 'sale',
  });

  assert.equal(result.isSpecificBusinessTaxApplied, true);
  assert.equal(result.isStampDutyApplied, false);
  assert.equal(result.specificBusinessTax, 115500);
  assert.equal(result.stampDuty, 0);
  assert.equal(result.withholdingTax, 35000);
});
