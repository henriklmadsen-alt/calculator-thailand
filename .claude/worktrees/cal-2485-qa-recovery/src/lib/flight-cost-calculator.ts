/**
 * Thai Flight Ticket Cost Calculator (คำนวณค่าตั๋วเครื่องบิน)
 *
 * Sources:
 * - Thai Airways International (THAI)
 * - Bangkok Airways (BA)
 * - AirAsia Thailand (FD)
 * - Nok Air (DD)
 * - Thai Vietjet Air (VJ)
 * - Civil Aviation Authority of Thailand (CAAT)
 * - Ministry of Finance - Airline Tax Rates
 *
 * Covers:
 * - Base airfare calculation
 * - Fuel surcharge (typical 5-15%)
 * - Airline taxes and fees
 * - Airport service charges (domestic + international)
 * - Booking fee (online vs agent)
 * - Travel insurance (optional)
 * - Baggage fees (for budget carriers)
 *
 * Note: Prices are estimates and vary by airline, season, and booking method.
 */

export type FlightType = 'domestic' | 'international';
export type AirlineClass = 'economy' | 'business';
export type BaggageOption = 'included' | 'extra';

export interface FlightCostInput {
  flightType: FlightType;
  baseAirfare: number; // THB, base ticket price
  passengersCount: number;
  includeInsurance: boolean;
  baggageOption: BaggageOption; // for budget airlines
  bookingMethod: 'online' | 'agent'; // affects booking fee
}

export interface FlightCostResult {
  flightType: FlightType;
  baseAirfarePerPerson: number;
  passengersCount: number;

  // Per-person costs
  airfareSubtotal: number;
  fuelSurcharge: number;
  airlineTax: number;
  airportServiceCharge: number;
  bookingFee: number;
  insuranceCost: number;
  baggageFee: number;

  // Summary
  costPerPerson: number;
  totalForAllPassengers: number;
  vat: number;
  grandTotal: number;
}

/**
 * Fuel surcharge calculation (5-15% of airfare, typically 8%)
 */
function getFuelSurcharge(baseAirfare: number): number {
  return Math.round(baseAirfare * 0.08);
}

/**
 * Airline tax calculation (3-5% of airfare for Thai carriers)
 */
function getAirlineTax(baseAirfare: number, flightType: FlightType): number {
  const rate = flightType === 'domestic' ? 0.03 : 0.04;
  return Math.round(baseAirfare * rate);
}

/**
 * Airport service charge (ASC)
 * Domestic: 60-90 THB per person
 * International: 100-150 THB per person (international = departing to/from Thailand)
 */
function getAirportServiceCharge(flightType: FlightType): number {
  return flightType === 'domestic' ? 75 : 125;
}

/**
 * Booking fee
 * Online: 0-100 THB (often waived)
 * Agent/Phone: 200-500 THB
 */
function getBookingFee(bookingMethod: 'online' | 'agent'): number {
  return bookingMethod === 'online' ? 50 : 300;
}

/**
 * Travel insurance cost (optional, budget estimate)
 * Typical coverage: 5 million THB medical + trip cancellation
 */
function getInsuranceCost(flightType: FlightType): number {
  return flightType === 'domestic' ? 200 : 500;
}

/**
 * Baggage fee (for budget airlines like AirAsia)
 * First bag: 300-600 THB per person
 * Return trip typically includes 2 bags
 */
function getBaggageFee(baggageOption: BaggageOption): number {
  return baggageOption === 'included' ? 0 : 400; // One-way extra baggage
}

export function calculateFlightCost(input: FlightCostInput): FlightCostResult {
  const fuelSurcharge = getFuelSurcharge(input.baseAirfare);
  const airlineTax = getAirlineTax(input.baseAirfare, input.flightType);
  const asc = getAirportServiceCharge(input.flightType);
  const bookingFee = getBookingFee(input.bookingMethod);
  const insurance = input.includeInsurance ? getInsuranceCost(input.flightType) : 0;
  const baggageFee = getBaggageFee(input.baggageOption);

  const costPerPerson =
    input.baseAirfare +
    fuelSurcharge +
    airlineTax +
    asc +
    bookingFee +
    insurance +
    baggageFee;

  const totalForAllPassengers = costPerPerson * input.passengersCount;

  // VAT 7% applies to airline services (but typically already included in airfare quote)
  // Showing separately for transparency
  const vat = Math.round(totalForAllPassengers * 0.07);

  const grandTotal = totalForAllPassengers + vat;

  return {
    flightType: input.flightType,
    baseAirfarePerPerson: input.baseAirfare,
    passengersCount: input.passengersCount,
    airfareSubtotal: Math.round(input.baseAirfare * input.passengersCount),
    fuelSurcharge: Math.round(fuelSurcharge * input.passengersCount),
    airlineTax: Math.round(airlineTax * input.passengersCount),
    airportServiceCharge: Math.round(asc * input.passengersCount),
    bookingFee: Math.round(bookingFee * input.passengersCount),
    insuranceCost: Math.round(insurance * input.passengersCount),
    baggageFee: Math.round(baggageFee * input.passengersCount),
    costPerPerson: Math.round(costPerPerson),
    totalForAllPassengers: Math.round(totalForAllPassengers),
    vat: Math.round(vat),
    grandTotal: Math.round(grandTotal),
  };
}

/**
 * Worked Example 1: Domestic flight (Bangkok to Chiang Mai)
 * Base fare: 2,000 THB per person, 1 passenger, no insurance
 */
export const EXAMPLE_1 = calculateFlightCost({
  flightType: 'domestic',
  baseAirfare: 2000,
  passengersCount: 1,
  includeInsurance: false,
  baggageOption: 'included',
  bookingMethod: 'online',
});

/**
 * Worked Example 2: International flight (Bangkok to Singapore)
 * Base fare: 5,000 THB per person, 2 passengers, with insurance
 */
export const EXAMPLE_2 = calculateFlightCost({
  flightType: 'international',
  baseAirfare: 5000,
  passengersCount: 2,
  includeInsurance: true,
  baggageOption: 'included',
  bookingMethod: 'online',
});

/**
 * Worked Example 3: Domestic budget flight (Bangkok to Phuket)
 * Base fare: 1,500 THB, 3 passengers, extra baggage, booked through agent
 */
export const EXAMPLE_3 = calculateFlightCost({
  flightType: 'domestic',
  baseAirfare: 1500,
  passengersCount: 3,
  includeInsurance: false,
  baggageOption: 'extra',
  bookingMethod: 'agent',
});
