export type PercentageDirection = 'increase' | 'decrease';

export interface PercentOfResult {
  percent: number;
  baseValue: number;
  decimalPercent: number;
  resultValue: number;
}

export interface WhatPercentResult {
  partValue: number;
  totalValue: number;
  ratio: number;
  percentValue: number;
}

export interface IncreaseDecreaseResult {
  direction: PercentageDirection;
  baseValue: number;
  percent: number;
  deltaValue: number;
  resultValue: number;
}

export interface PercentChangeResult {
  oldValue: number;
  newValue: number;
  deltaValue: number;
  percentChangeValue: number;
}

function normalizePositiveNumber(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('value_must_be_positive');
  }
  return value;
}

function normalizeFiniteNumber(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error('value_must_be_finite');
  }
  return value;
}

function round(value: number, digits = 6): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function calculatePercentOf(percent: number, baseValue: number): PercentOfResult {
  const normalizedPercent = normalizeFiniteNumber(percent);
  const normalizedBaseValue = normalizeFiniteNumber(baseValue);
  const decimalPercent = normalizedPercent / 100;
  const resultValue = normalizedBaseValue * decimalPercent;

  return {
    percent: normalizedPercent,
    baseValue: normalizedBaseValue,
    decimalPercent: round(decimalPercent),
    resultValue: round(resultValue),
  };
}

export function calculateWhatPercent(partValue: number, totalValue: number): WhatPercentResult {
  const normalizedPartValue = normalizeFiniteNumber(partValue);
  const normalizedTotalValue = normalizePositiveNumber(totalValue);
  const ratio = normalizedPartValue / normalizedTotalValue;
  const percentValue = ratio * 100;

  return {
    partValue: normalizedPartValue,
    totalValue: normalizedTotalValue,
    ratio: round(ratio),
    percentValue: round(percentValue),
  };
}

export function calculateIncreaseDecrease(
  baseValue: number,
  percent: number,
  direction: PercentageDirection,
): IncreaseDecreaseResult {
  const normalizedBaseValue = normalizeFiniteNumber(baseValue);
  const normalizedPercent = normalizeFiniteNumber(percent);
  const deltaValue = normalizedBaseValue * (normalizedPercent / 100);
  const resultValue = direction === 'increase'
    ? normalizedBaseValue + deltaValue
    : normalizedBaseValue - deltaValue;

  return {
    direction,
    baseValue: normalizedBaseValue,
    percent: normalizedPercent,
    deltaValue: round(deltaValue),
    resultValue: round(resultValue),
  };
}

export function calculatePercentChange(oldValue: number, newValue: number): PercentChangeResult {
  const normalizedOldValue = normalizeFiniteNumber(oldValue);
  const normalizedNewValue = normalizeFiniteNumber(newValue);

  if (normalizedOldValue === 0) {
    throw new Error('old_value_must_not_be_zero');
  }

  const deltaValue = normalizedNewValue - normalizedOldValue;
  const percentChangeValue = (deltaValue / normalizedOldValue) * 100;

  return {
    oldValue: normalizedOldValue,
    newValue: normalizedNewValue,
    deltaValue: round(deltaValue),
    percentChangeValue: round(percentChangeValue),
  };
}
