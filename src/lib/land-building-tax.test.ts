import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateLandBuildingTax } from './land-building-tax.ts';

function closeTo(actual: number, expected: number, tolerance = 0.01): void {
  assert.ok(Math.abs(actual - expected) <= tolerance, `Expected ${actual} to be within ${tolerance} of ${expected}`);
}

test('returns zero tax for owner-occupied home within 50 million THB exemption', () => {
  const result = calculateLandBuildingTax({
    appraisedValue: 8_000_000,
    usage: 'residential_primary',
  });

  assert.equal(result.exemptionValue, 8_000_000);
  assert.equal(result.taxableBase, 0);
  assert.equal(result.grossTax, 0);
  assert.equal(result.netTax, 0);
});

test('matches 8,000,000 THB secondary-home estimate at 0.02%', () => {
  const result = calculateLandBuildingTax({
    appraisedValue: 8_000_000,
    usage: 'residential_secondary',
  });

  assert.equal(result.taxableBase, 8_000_000);
  closeTo(result.grossTax, 1_600);
  closeTo(result.netTax, 1_600);
  closeTo(result.effectiveRatePercent, 0.02);
});

test('uses 50M/75M residential-secondary brackets from decree rates', () => {
  const result = calculateLandBuildingTax({
    appraisedValue: 60_000_000,
    usage: 'residential_secondary',
  });

  // 50M x 0.02% + 10M x 0.03% = 13,000
  closeTo(result.grossTax, 13_000);
});

test('applies 0.03% first-tier rate on taxable base for owner-occupied home after exemption', () => {
  const result = calculateLandBuildingTax({
    appraisedValue: 60_000_000,
    usage: 'residential_primary',
  });

  // taxable base = 10M after 50M exemption, first bracket rate = 0.03%
  closeTo(result.taxableBase, 10_000_000);
  closeTo(result.grossTax, 3_000);
});

test('matches 12,000,000 THB commercial estimate at 0.3%', () => {
  const result = calculateLandBuildingTax({
    appraisedValue: 12_000_000,
    usage: 'commercial',
  });

  closeTo(result.grossTax, 36_000);
  closeTo(result.netTax, 36_000);
});

test('matches vacant-land progressive example: 80 million THB => 270,000 THB', () => {
  const result = calculateLandBuildingTax({
    appraisedValue: 80_000_000,
    usage: 'vacant',
  });

  closeTo(result.grossTax, 270_000);
  closeTo(result.netTax, 270_000);
  assert.equal(result.breakdown.length, 2);
});

test('applies relief percent to gross tax', () => {
  const result = calculateLandBuildingTax({
    appraisedValue: 12_000_000,
    usage: 'commercial',
    reliefPercent: 50,
  });

  closeTo(result.grossTax, 36_000);
  closeTo(result.reliefAmount, 18_000);
  closeTo(result.netTax, 18_000);
});
