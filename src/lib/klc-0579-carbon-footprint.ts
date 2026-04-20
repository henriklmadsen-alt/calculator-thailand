/**
 * Carbon Footprint Calculator (KLC-0579)
 *
 * Calculates CO2 emissions from daily activities.
 * Inputs use Thai-standard units (km, m³).
 *
 * Sources:
 * - EGAT Thailand grid emission factor 2024: ~0.4182 kgCO2eq/kWh
 * - IPCC emission factors for transport and food
 */

export interface CarbonFootprintInput {
  dailyCommuteKm: number;         // km per day (car commute)
  homeElectricityKWh: number;     // kWh consumed per month
  homeGasM3PerMonth: number;      // piped/bottled gas m³ per month (0 if not used)
  flightHours: number;            // total flight hours per year
  meatServingsPerWeek: number;    // meat meals per week
}

export interface CarbonFootprintResult {
  commuteCO2: number;
  electricityCO2: number;
  gasCO2: number;
  flightCO2: number;
  foodCO2: number;
  totalAnnualCO2: number;
  monthlyAverage: number;
}

// CO2 factors (kg CO2 per unit)
const KM_TO_MILES = 0.621371;
const COMMUTE_CO2_PER_MILE = 0.21;            // Average petrol car
const COMMUTE_CO2_PER_KM = COMMUTE_CO2_PER_MILE * KM_TO_MILES; // ~0.1305 kgCO2/km
const ELECTRICITY_CO2_PER_KWH = 0.42;        // Thai grid average (EGAT 2024: 0.4182)
const GAS_CO2_PER_M3 = 2.0;                  // LPG/piped gas ~2.0 kgCO2/m³
const FLIGHT_CO2_PER_HOUR = 90;              // kg per flight hour (economy class)
const MEAT_CO2_PER_SERVING = 3;              // kg CO2 per meat serving

export function calculateCarbonFootprint(input: CarbonFootprintInput): CarbonFootprintResult {
  const dailyCommute = input.dailyCommuteKm * COMMUTE_CO2_PER_KM;
  const commuteCO2 = dailyCommute * 365;

  const electricityCO2 = input.homeElectricityKWh * ELECTRICITY_CO2_PER_KWH * 12;

  const gasCO2 = input.homeGasM3PerMonth * GAS_CO2_PER_M3 * 12;

  const flightCO2 = input.flightHours * FLIGHT_CO2_PER_HOUR;

  const foodCO2 = input.meatServingsPerWeek * MEAT_CO2_PER_SERVING * 52;

  const totalAnnualCO2 = commuteCO2 + electricityCO2 + gasCO2 + flightCO2 + foodCO2;

  return {
    commuteCO2: Math.round(commuteCO2),
    electricityCO2: Math.round(electricityCO2),
    gasCO2: Math.round(gasCO2),
    flightCO2: Math.round(flightCO2),
    foodCO2: Math.round(foodCO2),
    totalAnnualCO2: Math.round(totalAnnualCO2),
    monthlyAverage: Math.round(totalAnnualCO2 / 12),
  };
}

// Example 1: Average Bangkok commuter — 30 km/day, 100 kWh/month, no gas, domestic flight 2h
export const EXAMPLE_1 = calculateCarbonFootprint({
  dailyCommuteKm: 30,
  homeElectricityKWh: 100,
  homeGasM3PerMonth: 0,
  flightHours: 2,
  meatServingsPerWeek: 3,
});

// Example 2: Heavy commuter + frequent flyer — 50 km/day, 150 kWh/month, 10h flights/yr
export const EXAMPLE_2 = calculateCarbonFootprint({
  dailyCommuteKm: 50,
  homeElectricityKWh: 150,
  homeGasM3PerMonth: 5,
  flightHours: 10,
  meatServingsPerWeek: 7,
});

// Example 3: Eco-conscious user — 15 km/day, 80 kWh/month, no flights, vegetarian
export const EXAMPLE_3 = calculateCarbonFootprint({
  dailyCommuteKm: 15,
  homeElectricityKWh: 80,
  homeGasM3PerMonth: 0,
  flightHours: 0,
  meatServingsPerWeek: 0,
});
