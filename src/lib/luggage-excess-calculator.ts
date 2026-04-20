/**
 * Thai Airline Luggage Excess Calculator (KLC-0563)
 * Calculate excess baggage fees based on weight and airline type
 */

export type AirlineType = 'fullservice' | 'budget';

export interface LuggageExcessResult {
  weightKg: number;
  airlineType: AirlineType;
  allowanceKg: number;
  excessWeightKg: number;
  ratePerKg: number;
  excessFee: number;
}

function getAllowanceAndRate(airlineType: AirlineType): { allowance: number; ratePerKg: number } {
  if (airlineType === 'fullservice') {
    return { allowance: 20, ratePerKg: 150 };
  } else {
    return { allowance: 7, ratePerKg: 200 };
  }
}

export function calculateLuggageExcess(weightKg: number, airlineType: AirlineType): LuggageExcessResult {
  const { allowance, ratePerKg } = getAllowanceAndRate(airlineType);
  const excessWeightKg = Math.max(0, weightKg - allowance);
  const excessFee = Math.round(excessWeightKg * ratePerKg);

  return {
    weightKg,
    airlineType,
    allowanceKg: allowance,
    excessWeightKg,
    ratePerKg,
    excessFee,
  };
}

/**
 * Example 1: Full-service airline, within allowance (15 kg)
 */
export const EXAMPLE_1 = calculateLuggageExcess(15, 'fullservice');

/**
 * Example 2: Budget airline, excess baggage (10 kg, exceeds 7 kg allowance)
 */
export const EXAMPLE_2 = calculateLuggageExcess(10, 'budget');

/**
 * Example 3: Full-service airline, significant excess (28 kg)
 */
export const EXAMPLE_3 = calculateLuggageExcess(28, 'fullservice');
