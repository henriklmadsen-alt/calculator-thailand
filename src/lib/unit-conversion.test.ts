import { test, expect } from 'vitest';
import { convertUnit } from './unit-conversion.ts';

function closeTo(actual: number, expected: number, tolerance = 1e-9): void {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
}

test('converts meters to centimeters', () => {
  const result = convertUnit({
    category: 'length',
    value: 1.75,
    fromUnit: 'm',
    toUnit: 'cm',
  });

  closeTo(result, 175);
});

test('converts kilograms to grams', () => {
  const result = convertUnit({
    category: 'mass',
    value: 2.5,
    fromUnit: 'kg',
    toUnit: 'g',
  });

  closeTo(result, 2500);
});

test('converts celsius to fahrenheit', () => {
  const result = convertUnit({
    category: 'temperature',
    value: 37,
    fromUnit: 'c',
    toUnit: 'f',
  });

  closeTo(result, 98.6);
});

test('converts fahrenheit to celsius', () => {
  const result = convertUnit({
    category: 'temperature',
    value: 68,
    fromUnit: 'f',
    toUnit: 'c',
  });

  closeTo(result, 20);
});

test('returns input value when source and target units are the same', () => {
  const result = convertUnit({
    category: 'length',
    value: 12.34,
    fromUnit: 'km',
    toUnit: 'km',
  });

  closeTo(result, 12.34);
});

// New units: length (ft, in, mi, yd)
test('converts feet to meters', () => {
  closeTo(convertUnit({ category: 'length', value: 1, fromUnit: 'ft', toUnit: 'm' }), 0.3048);
});

test('converts inches to centimeters', () => {
  closeTo(convertUnit({ category: 'length', value: 1, fromUnit: 'in', toUnit: 'cm' }), 2.54);
});

test('converts miles to kilometers', () => {
  closeTo(convertUnit({ category: 'length', value: 1, fromUnit: 'mi', toUnit: 'km' }), 1.609344);
});

test('converts yards to meters', () => {
  closeTo(convertUnit({ category: 'length', value: 1, fromUnit: 'yd', toUnit: 'm' }), 0.9144);
});

// New units: mass (lb, oz)
test('converts pounds to kilograms', () => {
  closeTo(convertUnit({ category: 'mass', value: 1, fromUnit: 'lb', toUnit: 'kg' }), 0.45359237);
});

test('converts ounces to grams', () => {
  closeTo(convertUnit({ category: 'mass', value: 1, fromUnit: 'oz', toUnit: 'g' }), 28.349523125);
});

// Area category with Thai units
test('converts rai to square meters', () => {
  closeTo(convertUnit({ category: 'area', value: 1, fromUnit: 'rai', toUnit: 'sqm' }), 1600);
});

test('converts ngan to square wa', () => {
  closeTo(convertUnit({ category: 'area', value: 1, fromUnit: 'ngan', toUnit: 'sqwa' }), 100);
});

test('converts rai to ngan', () => {
  closeTo(convertUnit({ category: 'area', value: 1, fromUnit: 'rai', toUnit: 'ngan' }), 4);
});

test('converts rai to square wa', () => {
  closeTo(convertUnit({ category: 'area', value: 1, fromUnit: 'rai', toUnit: 'sqwa' }), 400);
});

test('converts acre to square meters', () => {
  closeTo(convertUnit({ category: 'area', value: 1, fromUnit: 'acre', toUnit: 'sqm' }), 4046.8564224);
});

test('converts square wa to square meters', () => {
  closeTo(convertUnit({ category: 'area', value: 1, fromUnit: 'sqwa', toUnit: 'sqm' }), 4);
});
