/**
 * LED Lighting Savings Calculator (KLC-0582)
 */

export interface LEDSavingsInput {
  currentBulbs: number;
  hoursPerDay: number;
  electricityRate: number;
}

export interface LEDSavingsResult {
  yearlySavings: number;
  paybackMonths: number;
  co2Reduced: number;
}

export function calculateLEDSavings(input: LEDSavingsInput): LEDSavingsResult {
  const oldWattage = input.currentBulbs * 60; // Incandescent
  const newWattage = input.currentBulbs * 9; // LED
  const dailySavings = (oldWattage - newWattage) * input.hoursPerDay / 1000; // kWh
  const yearlySavings = Math.round(dailySavings * 365 * input.electricityRate);
  const paybackMonths = Math.round((input.currentBulbs * 100) / (yearlySavings / 12));
  const co2Reduced = Math.round(dailySavings * 365 * 0.42); // 0.42 kg CO2 per kWh

  return { yearlySavings, paybackMonths, co2Reduced };
}

export const EXAMPLE_1 = calculateLEDSavings({ currentBulbs: 10, hoursPerDay: 6, electricityRate: 4 });
export const EXAMPLE_2 = calculateLEDSavings({ currentBulbs: 20, hoursPerDay: 8, electricityRate: 3.8 });
export const EXAMPLE_3 = calculateLEDSavings({ currentBulbs: 15, hoursPerDay: 5, electricityRate: 4.2 });
