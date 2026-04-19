import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateHomeTransferFees } from './home-transfer-fee.ts';

test('applies reduced 0.01% rates when all conditions pass', () => {
  const result = calculateHomeTransferFees({
    salePrice: 7000000,
    appraisedPrice: 7000000,
    mortgageAmount: 7000000,
    isReducedFeeEligible: true,
    hasSpecificBusinessTax: false,
    sellerType: 'corporate',
  });

  assert.equal(result.isReducedFeeApplied, true);
  assert.equal(result.transferFee, 700);
  assert.equal(result.mortgageFee, 700);
  assert.equal(result.buyerCosts, 1400);
  assert.equal(result.stampDuty, 35000);
  assert.equal(result.withholdingTax, 70000);
  assert.equal(result.totalCosts, 106400);
});

test('uses standard rates and mortgage cap at 200,000 THB', () => {
  const result = calculateHomeTransferFees({
    salePrice: 30000000,
    appraisedPrice: 28000000,
    mortgageAmount: 30000000,
    isReducedFeeEligible: false,
    hasSpecificBusinessTax: true,
    sellerType: 'corporate',
  });

  assert.equal(result.isReducedFeeApplied, false);
  assert.equal(result.transferFee, 560000);
  assert.equal(result.mortgageFee, 200000);
  assert.equal(result.specificBusinessTax, 990000);
  assert.equal(result.stampDuty, 0);
  assert.equal(result.withholdingTax, 300000);
  assert.equal(result.totalCosts, 2050000);
});

test('supports individual seller with custom withholding and stamp duty', () => {
  const result = calculateHomeTransferFees({
    salePrice: 8000000,
    appraisedPrice: 7600000,
    mortgageAmount: 5000000,
    isReducedFeeEligible: false,
    hasSpecificBusinessTax: false,
    sellerType: 'individual',
    customIndividualWithholdingTax: 125000,
  });

  assert.equal(result.transferFee, 152000);
  assert.equal(result.mortgageFee, 50000);
  assert.equal(result.specificBusinessTax, 0);
  assert.equal(result.stampDuty, 40000);
  assert.equal(result.withholdingTax, 125000);
  assert.equal(result.buyerCosts, 202000);
  assert.equal(result.sellerCosts, 165000);
  assert.equal(result.totalCosts, 367000);
});

test('falls back to standard rates when reduced-fee conditions are not met', () => {
  const result = calculateHomeTransferFees({
    salePrice: 8100000,
    appraisedPrice: 7900000,
    mortgageAmount: 5000000,
    isReducedFeeEligible: true,
    hasSpecificBusinessTax: false,
    sellerType: 'corporate',
  });

  assert.equal(result.isReducedFeeApplied, false);
  assert.equal(result.appliedTransferRate, 0.02);
  assert.equal(result.appliedMortgageRate, 0.01);
  assert.equal(result.transferFee, 158000);
  assert.equal(result.mortgageFee, 50000);
  assert.match(result.reducedFeeValidationMessage, /เกิน 7 ล้านบาท/);
});
