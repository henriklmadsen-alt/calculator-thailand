/**
 * Cycling Calorie Burn Calculator (แคลอรี่จากการปั่นจักรยาน)
 *
 * Formula: Calories = MET × weight(kg) × time(hr)
 *
 * Sources:
 * - Compendium of Physical Activities
 * - ACSM Cycling guidelines
 *
 * Cycling MET values based on speed and terrain
 */

export interface CyclingCalorieBurnInput {
  timeMinutes: number;
  bodyWeight: number;
  speedKmh: number;
  terrain: 'flat' | 'hills' | 'mountain';
}

export interface CyclingCalorieBurnResult {
  timeMinutes: number;
  bodyWeight: number;
  speedKmh: number;
  terrain: string;
  metValue: number;
  caloriesBurned: number;
  distanceCovered: number;
  caloriesBurnedPerKm: number;
}

function getMETForCycling(speedKmh: number, terrain: string): number {
  let baseMet = 0;

  // Base MET for speed
  if (speedKmh < 10) baseMet = 3.5; // Very slow
  else if (speedKmh < 16) baseMet = 5.8; // Casual
  else if (speedKmh < 20) baseMet = 7.5; // Moderate
  else if (speedKmh < 25) baseMet = 9.8; // Fast
  else baseMet = 12.0; // Very fast

  // Terrain multiplier
  if (terrain === 'hills') baseMet *= 1.3;
  if (terrain === 'mountain') baseMet *= 1.5;

  return baseMet;
}

export function calculateCyclingCalorieBurn(input: CyclingCalorieBurnInput): CyclingCalorieBurnResult {
  const metValue = getMETForCycling(input.speedKmh, input.terrain);
  const timeHours = input.timeMinutes / 60;
  const caloriesBurned = Math.round(metValue * input.bodyWeight * timeHours);
  const distanceCovered = Math.round((input.speedKmh * input.timeMinutes) / 60 * 10) / 10;
  const caloriesBurnedPerKm = distanceCovered > 0 ? Math.round(caloriesBurned / distanceCovered) : 0;

  return {
    timeMinutes: input.timeMinutes,
    bodyWeight: input.bodyWeight,
    speedKmh: input.speedKmh,
    terrain: input.terrain,
    metValue,
    caloriesBurned,
    distanceCovered,
    caloriesBurnedPerKm,
  };
}

export const EXAMPLE_1 = calculateCyclingCalorieBurn({
  timeMinutes: 45,
  bodyWeight: 70,
  speedKmh: 20,
  terrain: 'flat',
});

export const EXAMPLE_2 = calculateCyclingCalorieBurn({
  timeMinutes: 60,
  bodyWeight: 75,
  speedKmh: 15,
  terrain: 'hills',
});

export const EXAMPLE_3 = calculateCyclingCalorieBurn({
  timeMinutes: 30,
  bodyWeight: 65,
  speedKmh: 25,
  terrain: 'mountain',
});
