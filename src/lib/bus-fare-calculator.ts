/**
 * Thai Bus Fare Calculator (KLC-0561)
 * Distance-based fares for regular and express buses
 */

export type BusType = 'regular' | 'express';

export interface BusFareResult {
  distance: number;
  busType: BusType;
  baseFare: number;
  distanceFare: number;
  subtotal: number;
  vat: number;
  totalFare: number;
}

function getBaseFare(busType: BusType): number {
  return busType === 'express' ? 30 : 15;
}

function getRatePerKm(busType: BusType): number {
  return busType === 'express' ? 2.5 : 1.5;
}

export function calculateBusFare(distance: number, expressOrRegular: BusType): BusFareResult {
  const baseFare = getBaseFare(expressOrRegular);
  const ratePerKm = getRatePerKm(expressOrRegular);
  const distanceFare = Math.round(distance * ratePerKm);
  const subtotal = baseFare + distanceFare;
  const vat = Math.round(subtotal * 0.07);
  const totalFare = subtotal + vat;

  return {
    distance,
    busType: expressOrRegular,
    baseFare,
    distanceFare,
    subtotal,
    vat,
    totalFare,
  };
}

/**
 * Example 1: Regular bus short trip 20 km
 */
export const EXAMPLE_1 = calculateBusFare(20, 'regular');

/**
 * Example 2: Express bus medium trip 100 km
 */
export const EXAMPLE_2 = calculateBusFare(100, 'express');

/**
 * Example 3: Regular bus long trip 200 km
 */
export const EXAMPLE_3 = calculateBusFare(200, 'regular');
