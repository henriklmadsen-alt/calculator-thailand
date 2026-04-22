/**
 * Swimming Laps Calculator (รอบว่ายน้ำสระ)
 *
 * Formula: Laps = Distance ÷ Pool Length
 *
 * Sources:
 * - Standard swimming pool lengths (25m, 50m)
 * - Thai public pools (mostly 25m)
 *
 * Calculates:
 * - Number of laps needed
 * - Time estimates based on pace
 * - Calories burned by distance
 */

export interface SwimmingLapsInput {
  targetDistanceKm: number; // Target distance in km
  poolLengthMeters: number; // Pool length (25 or 50)
  lapsPaceSecPerLap?: number; // Optional: seconds per lap for time estimate
}

export interface SwimmingLapsResult {
  targetDistanceKm: number;
  targetDistanceMeters: number;
  poolLengthMeters: number;
  lapsNeeded: number;
  lapsPaceSecPerLap?: number;
  estimatedTimeMinutes?: number;
  caloriesBurned?: number;
}

export function calculateSwimmingLaps(input: SwimmingLapsInput): SwimmingLapsResult {
  // Validate inputs
  if (input.targetDistanceKm <= 0 || input.targetDistanceKm > 100) {
    throw new Error('Target distance must be between 0.1 and 100 km');
  }
  if (input.poolLengthMeters !== 25 && input.poolLengthMeters !== 50) {
    throw new Error('Pool length must be 25m or 50m');
  }

  const targetDistanceMeters = input.targetDistanceKm * 1000;
  const lapsNeeded = Math.ceil(targetDistanceMeters / input.poolLengthMeters);

  let estimatedTimeMinutes: number | undefined;
  let caloriesBurned: number | undefined;

  // If pace provided, calculate estimated time
  if (input.lapsPaceSecPerLap && input.lapsPaceSecPerLap > 0) {
    const totalSeconds = input.lapsPaceSecPerLap * lapsNeeded;
    estimatedTimeMinutes = Math.round(totalSeconds / 60 * 10) / 10;

    // Estimate calories: swimming MET = 6.0 (moderate pace)
    // Calories = MET × weight × time
    // Average weight = 70kg
    const timeHours = estimatedTimeMinutes / 60;
    caloriesBurned = Math.round(6.0 * 70 * timeHours);
  }

  return {
    targetDistanceKm: input.targetDistanceKm,
    targetDistanceMeters,
    poolLengthMeters: input.poolLengthMeters,
    lapsNeeded,
    lapsPaceSecPerLap: input.lapsPaceSecPerLap,
    estimatedTimeMinutes,
    caloriesBurned,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateSwimmingLaps({
  targetDistanceKm: 1,
  poolLengthMeters: 25,
  lapsPaceSecPerLap: 45,
});

export const EXAMPLE_2 = calculateSwimmingLaps({
  targetDistanceKm: 1.5,
  poolLengthMeters: 50,
  lapsPaceSecPerLap: 60,
});

export const EXAMPLE_3 = calculateSwimmingLaps({
  targetDistanceKm: 2,
  poolLengthMeters: 25,
  lapsPaceSecPerLap: 50,
});
