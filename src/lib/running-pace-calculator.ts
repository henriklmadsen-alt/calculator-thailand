/**
 * Running Pace Calculator (คำนวณเพซวิ่ง)
 *
 * Formula: Pace = Time ÷ Distance
 *
 * Sources:
 * - Compendium of Physical Activities (Ainsworth et al., 2011)
 * - Standard running pace measurement methodology
 *
 * Calculates:
 * - Running pace (min/km, min/mile)
 * - Speed in km/h and mph
 * - Total calories burned (with body weight factor)
 */

export interface RunningPaceInput {
  distance: number; // Distance in km
  timeMinutes: number; // Total time in minutes
  bodyWeight: number; // Body weight in kg (for calorie calculation)
  intensity: 'easy' | 'moderate' | 'hard'; // Running intensity for MET value
}

export interface RunningPaceResult {
  distance: number;
  timeMinutes: number;
  paceMinKm: number; // Pace in min/km
  paceMinMile: number; // Pace in min/mile
  speedKmh: number; // Speed in km/h
  speedMph: number; // Speed in mph
  caloriesBurned: number; // Calories burned
  metValue: number; // MET value based on intensity
  estimatedTime10k: number; // Estimated 10k time at this pace (minutes)
  estimatedTimeHalfMarathon: number; // Estimated half marathon time (minutes)
  estimatedTimeMarathon: number; // Estimated marathon time (minutes)
}

/**
 * MET values for running at different intensities
 * Source: Compendium of Physical Activities
 */
function getMETValue(paceMinKm: number, intensity: 'easy' | 'moderate' | 'hard'): number {
  // Speed-based MET estimation with intensity adjustment
  const speedKmh = 60 / paceMinKm;

  if (intensity === 'easy') {
    if (speedKmh < 6) return 6.0; // Slow jog
    if (speedKmh < 8) return 7.0;
    return 8.0;
  }

  if (intensity === 'moderate') {
    if (speedKmh < 8) return 8.0;
    if (speedKmh < 10) return 9.5;
    return 11.0;
  }

  // Hard
  if (speedKmh < 10) return 11.0;
  if (speedKmh < 12) return 13.5;
  return 15.0;
}

export function calculateRunningPace(input: RunningPaceInput): RunningPaceResult {
  // Validate inputs
  if (input.distance <= 0 || input.timeMinutes <= 0) {
    throw new Error('Distance and time must be positive values');
  }

  // Calculate pace (minutes per km)
  const paceMinKm = input.timeMinutes / input.distance;
  const paceMinMile = paceMinKm * 1.609; // 1 mile = 1.609 km

  // Calculate speed
  const speedKmh = 60 / paceMinKm;
  const speedMph = speedKmh / 1.609;

  // Get MET value and calculate calories
  const metValue = getMETValue(paceMinKm, input.intensity);
  const timeHours = input.timeMinutes / 60;
  const caloriesBurned = Math.round(metValue * input.bodyWeight * timeHours);

  // Estimate times using Riegel formula: T2 = T1 × (D2/D1)^1.06
  // Current pace/time as baseline
  const estimatedTime10k = Math.round(
    (input.timeMinutes / input.distance) * 10 * Math.pow(10 / input.distance, 0.06)
  );
  const estimatedTimeHalfMarathon = Math.round(
    (input.timeMinutes / input.distance) * 21.1 * Math.pow(21.1 / input.distance, 0.06)
  );
  const estimatedTimeMarathon = Math.round(
    (input.timeMinutes / input.distance) * 42.195 * Math.pow(42.195 / input.distance, 0.06)
  );

  return {
    distance: input.distance,
    timeMinutes: input.timeMinutes,
    paceMinKm: Math.round(paceMinKm * 100) / 100,
    paceMinMile: Math.round(paceMinMile * 100) / 100,
    speedKmh: Math.round(speedKmh * 100) / 100,
    speedMph: Math.round(speedMph * 100) / 100,
    caloriesBurned,
    metValue,
    estimatedTime10k,
    estimatedTimeHalfMarathon,
    estimatedTimeMarathon,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateRunningPace({
  distance: 5,
  timeMinutes: 25,
  bodyWeight: 70,
  intensity: 'moderate',
});

export const EXAMPLE_2 = calculateRunningPace({
  distance: 10,
  timeMinutes: 60,
  bodyWeight: 65,
  intensity: 'easy',
});

export const EXAMPLE_3 = calculateRunningPace({
  distance: 3,
  timeMinutes: 18,
  bodyWeight: 75,
  intensity: 'hard',
});
