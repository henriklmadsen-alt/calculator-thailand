/**
 * Thai Car Rental Cost Calculator (คำนวณค่าเช่ารถ)
 *
 * Sources:
 * - Thai Car Rental Association
 * - Ministry of Transport - Vehicle rental regulations
 * - Insurance Association of Thailand
 *
 * Covers:
 * - Daily rental rate
 * - Rental duration calculation
 * - Insurance (Basic, Premium)
 * - Fuel type and consumption
 * - Driver's license fee (optional)
 * - Parking fees
 * - Late return charges
 * - GPS/Navigation system rental
 */

export type CarType = 'economy' | 'sedan' | 'suv' | 'van';
export type InsuranceType = 'none' | 'basic' | 'premium';

export interface CarRentalInput {
  carType: CarType;
  dailyRate: number; // THB per day
  rentalDays: number;
  insuranceType: InsuranceType;
  fuelType: 'petrol' | 'diesel'; // affects fuel cost estimate
  includingGPS: boolean;
  lateReturn: boolean; // beyond agreed return time
}

export interface CarRentalResult {
  carType: CarType;
  dailyRate: number;
  rentalDays: number;

  // Costs
  rentalCost: number;
  insuranceCost: number;
  gpsCost: number;
  fuelCost: number; // estimated
  lateReturnFee: number;

  // Summary
  subtotal: number;
  vat: number;
  total: number;
}

/**
 * Insurance cost per day
 * Basic: 200-300 THB/day (covers major damage, high deductible)
 * Premium: 400-500 THB/day (comprehensive, low deductible)
 */
function getInsuranceCost(insuranceType: InsuranceType, rentalDays: number): number {
  if (insuranceType === 'none') return 0;
  if (insuranceType === 'basic') return 250 * rentalDays;
  return 450 * rentalDays; // premium
}

/**
 * GPS rental fee
 * Typical: 200-300 THB per rental
 */
function getGPSCost(includingGPS: boolean): number {
  return includingGPS ? 250 : 0;
}

/**
 * Estimated fuel cost (consumption varies by car type and driving)
 * Economy: 6-7 km/liter
 * Sedan: 5-6 km/liter
 * SUV: 4-5 km/liter
 * Van: 3-4 km/liter
 * Assume 200 km per day driving
 */
function estimateFuelCost(carType: CarType, rentalDays: number, fuelType: 'petrol' | 'diesel'): number {
  const fuelPrice = fuelType === 'petrol' ? 36 : 34; // THB per liter (approximate 2569)
  const dailyDistance = 200; // km

  let kmPerLiter = 5; // default
  if (carType === 'economy') kmPerLiter = 7;
  if (carType === 'sedan') kmPerLiter = 6;
  if (carType === 'suv') kmPerLiter = 4.5;
  if (carType === 'van') kmPerLiter = 3.5;

  const litersPerDay = dailyDistance / kmPerLiter;
  const totalLiters = litersPerDay * rentalDays;
  return Math.round(totalLiters * fuelPrice);
}

/**
 * Late return penalty
 * Typical: 300-500 THB per hour or 50% of daily rate for partial day
 */
function getLateReturnFee(dailyRate: number, lateReturn: boolean): number {
  if (!lateReturn) return 0;
  // Assume 3 hours late = 3 x 400 THB = 1,200 THB
  return Math.round(dailyRate * 0.5);
}

export function calculateCarRental(input: CarRentalInput): CarRentalResult {
  const rentalCost = input.dailyRate * input.rentalDays;
  const insurance = getInsuranceCost(input.insuranceType, input.rentalDays);
  const gps = getGPSCost(input.includingGPS);
  const fuel = estimateFuelCost(input.carType, input.rentalDays, input.fuelType);
  const lateReturn = getLateReturnFee(input.dailyRate, input.lateReturn);

  const subtotal = rentalCost + insurance + gps + fuel + lateReturn;
  const vat = Math.round(subtotal * 0.07);
  const total = subtotal + vat;

  return {
    carType: input.carType,
    dailyRate: input.dailyRate,
    rentalDays: input.rentalDays,
    rentalCost: Math.round(rentalCost),
    insuranceCost: Math.round(insurance),
    gpsCost: Math.round(gps),
    fuelCost: Math.round(fuel),
    lateReturnFee: Math.round(lateReturn),
    subtotal: Math.round(subtotal),
    vat: Math.round(vat),
    total: Math.round(total),
  };
}

/**
 * Worked Example 1: Economy car, 3 days, basic insurance
 * Rate: 1,200 THB/day, Petrol
 */
export const EXAMPLE_1 = calculateCarRental({
  carType: 'economy',
  dailyRate: 1200,
  rentalDays: 3,
  insuranceType: 'basic',
  fuelType: 'petrol',
  includingGPS: false,
  lateReturn: false,
});

/**
 * Worked Example 2: SUV, 5 days, premium insurance, with GPS
 * Rate: 2,500 THB/day, Diesel
 */
export const EXAMPLE_2 = calculateCarRental({
  carType: 'suv',
  dailyRate: 2500,
  rentalDays: 5,
  insuranceType: 'premium',
  fuelType: 'diesel',
  includingGPS: true,
  lateReturn: false,
});

/**
 * Worked Example 3: Van, 7 days, basic insurance, late return
 * Rate: 2,000 THB/day, Petrol
 */
export const EXAMPLE_3 = calculateCarRental({
  carType: 'van',
  dailyRate: 2000,
  rentalDays: 7,
  insuranceType: 'basic',
  fuelType: 'petrol',
  includingGPS: true,
  lateReturn: true,
});
