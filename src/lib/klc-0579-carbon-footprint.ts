/**
 * Carbon Footprint Calculator (KLC-0579)
 *
 * Calculates CO2 emissions from daily activities
 */

export interface CarbonFootprintInput {
  dailyCommuteMiles: number;
  homeElectricityKWh: number;
  homeGasMTherm: number;
  flightHours: number;
  meatServingsPerWeek: number;
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
const COMMUTE_CO2_PER_MILE = 0.21; // Average car
const ELECTRICITY_CO2_PER_KWH = 0.42; // Thai grid average
const GAS_CO2_PER_THERM = 5.3;
const FLIGHT_CO2_PER_HOUR = 90; // kg per hour
const MEAT_CO2_PER_SERVING = 3; // kg CO2

export function calculateCarbonFootprint(input: CarbonFootprintInput): CarbonFootprintResult {
  const dailyCommute = input.dailyCommuteMiles * COMMUTE_CO2_PER_MILE;
  const commuteCO2 = dailyCommute * 365;

  const electricityCO2 = input.homeElectricityKWh * ELECTRICITY_CO2_PER_KWH * 12;

  const gasCO2 = input.homeGasMTherm * GAS_CO2_PER_THERM * 12;

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

export const EXAMPLE_1 = calculateCarbonFootprint({
  dailyCommuteMiles: 20,
  homeElectricityKWh: 100,
  homeGasMTherm: 0,
  flightHours: 0,
  meatServingsPerWeek: 3,
});

export const EXAMPLE_2 = calculateCarbonFootprint({
  dailyCommuteMiles: 30,
  homeElectricityKWh: 150,
  homeGasMTherm: 3,
  flightHours: 10,
  meatServingsPerWeek: 7,
});

export const EXAMPLE_3 = calculateCarbonFootprint({
  dailyCommuteMiles: 10,
  homeElectricityKWh: 80,
  homeGasMTherm: 0,
  flightHours: 0,
  meatServingsPerWeek: 0,
});
