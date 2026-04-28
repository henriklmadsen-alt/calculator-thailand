/**
 * Swimming Training Time Calculator (เวลาฝึกว่ายน้ำ)
 *
 * Formula: Time = (Laps × Pool_length) ÷ Pace
 *
 * Sources:
 * - Standard swimming training methodology
 * - Thai public pool sizes (25m, 50m)
 *
 * Calculates:
 * - Training time based on distance and pace
 * - Training zones and pace targets
 */

export interface SwimmingTrainingInput {
  lapsNeeded: number; // Number of laps
  poolLengthMeters: number; // Pool length (25 or 50)
  paceSecPerLap: number; // Seconds per lap
}

export interface SwimmingTrainingResult {
  lapsNeeded: number;
  poolLengthMeters: number;
  totalDistanceMeters: number;
  totalDistanceKm: number;
  paceSecPerLap: number;
  paceMinPerLap: string;
  totalTimeSeconds: number;
  totalTimeMinutes: number;
  totalTimeFormatted: string;
  estimatedCalories: number;
}

export function calculateSwimmingTrainingTime(
  input: SwimmingTrainingInput
): SwimmingTrainingResult {
  // Validate inputs
  if (input.lapsNeeded <= 0 || input.lapsNeeded > 1000) {
    throw new Error('Laps must be between 1 and 1000');
  }
  if (input.poolLengthMeters !== 25 && input.poolLengthMeters !== 50) {
    throw new Error('Pool length must be 25m or 50m');
  }
  if (input.paceSecPerLap <= 0 || input.paceSecPerLap > 300) {
    throw new Error('Pace must be between 1 and 300 seconds per lap');
  }

  const totalDistanceMeters = input.lapsNeeded * input.poolLengthMeters;
  const totalDistanceKm = totalDistanceMeters / 1000;

  const totalTimeSeconds = input.lapsNeeded * input.paceSecPerLap;
  const totalTimeMinutes = Math.round((totalTimeSeconds / 60) * 10) / 10;
  const minutes = Math.floor(totalTimeMinutes);
  const seconds = Math.round((totalTimeMinutes - minutes) * 60);
  const totalTimeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const paceMinutes = Math.floor(input.paceSecPerLap / 60);
  const paceSeconds = input.paceSecPerLap % 60;
  const paceMinPerLap = `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`;

  // Estimate calories: 6 MET for moderate swimming
  const timeHours = totalTimeMinutes / 60;
  const estimatedCalories = Math.round(6 * 70 * timeHours); // Assuming 70kg

  return {
    lapsNeeded: input.lapsNeeded,
    poolLengthMeters: input.poolLengthMeters,
    totalDistanceMeters,
    totalDistanceKm,
    paceSecPerLap: input.paceSecPerLap,
    paceMinPerLap,
    totalTimeSeconds,
    totalTimeMinutes,
    totalTimeFormatted,
    estimatedCalories,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateSwimmingTrainingTime({
  lapsNeeded: 20,
  poolLengthMeters: 25,
  paceSecPerLap: 45,
});

export const EXAMPLE_2 = calculateSwimmingTrainingTime({
  lapsNeeded: 40,
  poolLengthMeters: 25,
  paceSecPerLap: 50,
});

export const EXAMPLE_3 = calculateSwimmingTrainingTime({
  lapsNeeded: 10,
  poolLengthMeters: 50,
  paceSecPerLap: 60,
});
