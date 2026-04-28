/**
 * Marathon Finish Time Predictor (เวลาจบมาราธอน)
 *
 * Formula: T2 = T1 × (D2 / D1)^1.06
 * Riegel formula for race time prediction
 *
 * Sources:
 * - Riegel, P. (1981) "Athletic Records and Human Endurance" American Scientist
 *
 * Calculates:
 * - Marathon time prediction from current performance
 * - Other race distance predictions (5K, 10K, Half Marathon)
 */

export interface MarathonPredictorInput {
  knownDistanceKm: number; // Distance of known race (e.g., 10 km)
  knownTimeMinutes: number; // Time completed at known distance
  targetDistanceKm?: number; // Target distance (default 42.195 for marathon)
}

export interface RaceTimePrediction {
  distanceKm: number;
  distanceName: string;
  predictedTimeMinutes: number;
  predictedTimeFormatted: string;
  pace: string;
}

export interface MarathonPredictorResult {
  knownDistanceKm: number;
  knownTimeMinutes: number;
  knownPace: string;
  predictions: RaceTimePrediction[];
}

/**
 * Format time from minutes to HH:MM:SS
 */
function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  const secs = Math.round((minutes % 1) * 60);
  return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate pace (min/km) from time and distance
 */
function calculatePace(timeMinutes: number, distanceKm: number): string {
  const paceMinKm = timeMinutes / distanceKm;
  const mins = Math.floor(paceMinKm);
  const secs = Math.round((paceMinKm % 1) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')}/km`;
}

export function calculateMarathonPredictor(input: MarathonPredictorInput): MarathonPredictorResult {
  // Validate inputs
  if (input.knownDistanceKm <= 0 || input.knownDistanceKm > 100) {
    throw new Error('Known distance must be between 0.1 and 100 km');
  }
  if (input.knownTimeMinutes <= 0 || input.knownTimeMinutes > 1000) {
    throw new Error('Time must be positive and reasonable');
  }

  // Riegel formula: T2 = T1 × (D2 / D1)^1.06
  const riegelExponent = 1.06;

  // Calculate pace from known performance
  const knownPaceMinKm = input.knownTimeMinutes / input.knownDistanceKm;
  const knownPaceFormatted = calculatePace(input.knownTimeMinutes, input.knownDistanceKm);

  // Standard race distances to predict
  const standardDistances = [
    { km: 5, name: '5K' },
    { km: 10, name: '10K' },
    { km: 21.1, name: 'Half Marathon' },
    { km: 42.195, name: 'Full Marathon' },
  ];

  // Add custom target distance if provided
  const distances = input.targetDistanceKm
    ? [{ km: input.targetDistanceKm, name: `${input.targetDistanceKm} km` }]
    : standardDistances;

  const predictions: RaceTimePrediction[] = distances.map((dist) => {
    // Use Riegel formula
    const ratio = dist.km / input.knownDistanceKm;
    const predictedTimeMinutes = Math.round(
      input.knownTimeMinutes * Math.pow(ratio, riegelExponent) * 10
    ) / 10;

    return {
      distanceKm: dist.km,
      distanceName: dist.name,
      predictedTimeMinutes,
      predictedTimeFormatted: formatTime(predictedTimeMinutes),
      pace: calculatePace(predictedTimeMinutes, dist.km),
    };
  });

  return {
    knownDistanceKm: input.knownDistanceKm,
    knownTimeMinutes: input.knownTimeMinutes,
    knownPace: knownPaceFormatted,
    predictions,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateMarathonPredictor({
  knownDistanceKm: 10,
  knownTimeMinutes: 60,
});

export const EXAMPLE_2 = calculateMarathonPredictor({
  knownDistanceKm: 5,
  knownTimeMinutes: 25,
});

export const EXAMPLE_3 = calculateMarathonPredictor({
  knownDistanceKm: 21.1,
  knownTimeMinutes: 120,
});
