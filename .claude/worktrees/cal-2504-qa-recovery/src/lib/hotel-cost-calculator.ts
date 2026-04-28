/**
 * Thai Hotel Room Cost Calculator (คำนวณค่าห้องแรม)
 *
 * Sources:
 * - Thai Hotels Association
 * - Ministry of Tourism (TAT)
 * - Revenue Department - VAT on hotel services
 *
 * Covers:
 * - Room rate per night
 * - Length of stay calculation
 * - Hotel tax and service charge (10%)
 * - VAT 7%
 * - Early checkout fees
 * - Extra bed fees (if applicable)
 * - Deposit/credit card authorization
 */

export type RoomType = 'standard' | 'deluxe' | 'suite';

export interface HotelCostInput {
  roomRate: number; // THB per night
  numberOfNights: number;
  numberOfRooms: number;
  extraBeds: number;
  earlyCheckout: boolean;
}

export interface HotelCostResult {
  roomRate: number;
  numberOfNights: number;
  numberOfRooms: number;

  // Costs
  roomCost: number;
  extraBedFee: number;
  subtotal: number;
  serviceCharge: number; // 10%
  vat: number; // 7%
  earlyCheckoutFee: number;

  // Summary
  totalBeforeDepositFee: number;
  total: number;
}

/**
 * Extra bed fee (typically 300-1000 THB per bed per night)
 */
function getExtraBedFee(nightlyRate: number): number {
  return Math.round(nightlyRate * 0.3); // 30% of room rate
}

/**
 * Service charge (10% is standard for Thai hotels)
 */
function getServiceCharge(subtotal: number): number {
  return Math.round(subtotal * 0.1);
}

/**
 * Early checkout penalty (usually 50% of one night's rate or flat fee 500 THB)
 */
function getEarlyCheckoutFee(roomRate: number): number {
  return Math.round(Math.max(roomRate * 0.5, 500));
}

export function calculateHotelCost(input: HotelCostInput): HotelCostResult {
  const roomCost = input.roomRate * input.numberOfNights * input.numberOfRooms;
  const extraBedFee = getExtraBedFee(input.roomRate) * input.numberOfNights * input.extraBeds;
  const subtotal = roomCost + extraBedFee;

  const serviceCharge = getServiceCharge(subtotal);
  const vatableAmount = subtotal + serviceCharge;
  const vat = Math.round(vatableAmount * 0.07);

  const earlyCheckoutFee = input.earlyCheckout ? getEarlyCheckoutFee(input.roomRate) : 0;

  const totalBeforeDeposit = subtotal + serviceCharge + vat + earlyCheckoutFee;
  const total = totalBeforeDeposit;

  return {
    roomRate: input.roomRate,
    numberOfNights: input.numberOfNights,
    numberOfRooms: input.numberOfRooms,
    roomCost: Math.round(roomCost),
    extraBedFee: Math.round(extraBedFee),
    subtotal: Math.round(subtotal),
    serviceCharge: Math.round(serviceCharge),
    vat: Math.round(vat),
    earlyCheckoutFee: Math.round(earlyCheckoutFee),
    totalBeforeDepositFee: Math.round(totalBeforeDeposit),
    total: Math.round(total),
  };
}

/**
 * Worked Example 1: Single room, 3 nights
 * Rate: 2,000 THB/night, no extras
 */
export const EXAMPLE_1 = calculateHotelCost({
  roomRate: 2000,
  numberOfNights: 3,
  numberOfRooms: 1,
  extraBeds: 0,
  earlyCheckout: false,
});

/**
 * Worked Example 2: Two rooms, 5 nights
 * Rate: 3,000 THB/night, with 1 extra bed
 */
export const EXAMPLE_2 = calculateHotelCost({
  roomRate: 3000,
  numberOfNights: 5,
  numberOfRooms: 2,
  extraBeds: 1,
  earlyCheckout: false,
});

/**
 * Worked Example 3: Suite, 7 nights with early checkout
 * Rate: 5,000 THB/night
 */
export const EXAMPLE_3 = calculateHotelCost({
  roomRate: 5000,
  numberOfNights: 7,
  numberOfRooms: 1,
  extraBeds: 0,
  earlyCheckout: true,
});
