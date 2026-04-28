import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ARTICLE_PATH =
  'src/pages/บทความ/เงินเดือนสุทธิ-2569-คำนวณหัก-ประกันสังคม-ภาษี/index.astro';

const TARGET_GROSS = new Set([15000, 20000, 25000, 30000, 40000, 50000, 80000, 100000]);

const TAX_BRACKETS = [
  { min: 0, max: 150000, rate: 0 },
  { min: 150000, max: 300000, rate: 0.05 },
  { min: 300000, max: 500000, rate: 0.1 },
  { min: 500000, max: 750000, rate: 0.15 },
  { min: 750000, max: 1000000, rate: 0.2 },
  { min: 1000000, max: 2000000, rate: 0.25 },
  { min: 2000000, max: 5000000, rate: 0.3 },
  { min: 5000000, max: Infinity, rate: 0.35 },
];

const SS_RATE = 0.05;
const SS_MIN_WAGE_BASE = 1650;
const SS_MAX_MONTHLY = 875;
const SS_ANNUAL_DEDUCTION_CAP = 10500;
const EXPENSE_CAP = 100000;
const PERSONAL_ALLOWANCE = 60000;

const parseAmount = (text) => Number.parseInt(text.replaceAll(',', ''), 10);

const progressiveTax = (netTaxable) => {
  let tax = 0;
  for (const bracket of TAX_BRACKETS) {
    if (netTaxable > bracket.min) {
      const taxable = Math.min(netTaxable, bracket.max) - bracket.min;
      tax += taxable * bracket.rate;
    }
  }
  return tax;
};

const calculate = (grossMonthly) => {
  const ssBaseMonthly = Math.max(grossMonthly, SS_MIN_WAGE_BASE);
  const ssMonthly = Math.min(ssBaseMonthly * SS_RATE, SS_MAX_MONTHLY);
  const annualGross = grossMonthly * 12;
  const annualExpense = Math.min(annualGross * 0.5, EXPENSE_CAP);
  const annualAllowances = PERSONAL_ALLOWANCE + Math.min(ssMonthly * 12, SS_ANNUAL_DEDUCTION_CAP);
  const annualTaxable = Math.max(0, annualGross - annualExpense - annualAllowances);
  const annualTax = progressiveTax(annualTaxable);
  const monthlyTax = annualTax / 12;
  const netMonthly = grossMonthly - ssMonthly - monthlyTax;

  return {
    gross: grossMonthly,
    ss: Math.round(ssMonthly),
    tax: Math.round(monthlyTax),
    net: Math.round(netMonthly),
  };
};

test('CAL-372 article salary table matches calculator assumptions for each gross income row', () => {
  const source = readFileSync(ARTICLE_PATH, 'utf8');
  const rowPattern =
    /<tr[^>]*>\s*<td[^>]*>([\d,]+)<\/td>\s*<td[^>]*>([\d,]+)<\/td>\s*<td[^>]*>([\d,]+)<\/td>\s*<td[^>]*>([\d,]+)<\/td>\s*<\/tr>/g;

  const mismatches = [];
  const seenGross = new Set();
  let match;

  while ((match = rowPattern.exec(source)) !== null) {
    const gross = parseAmount(match[1]);
    if (!TARGET_GROSS.has(gross)) continue;

    seenGross.add(gross);
    const row = {
      gross,
      ss: parseAmount(match[2]),
      tax: parseAmount(match[3]),
      net: parseAmount(match[4]),
    };
    const expected = calculate(gross);

    if (row.ss !== expected.ss || row.tax !== expected.tax || row.net !== expected.net) {
      mismatches.push({ row, expected });
    }
  }

  assert.deepEqual(
    [...seenGross].sort((a, b) => a - b),
    [...TARGET_GROSS].sort((a, b) => a - b),
    'Expected all target salary rows to exist in the article table',
  );

  assert.deepEqual(mismatches, [], 'Article table contains values inconsistent with calculator formula');
});
