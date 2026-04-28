/**
 * Swimming Calorie Burn Calculator (แคลอรี่จากการว่ายน้ำ)
 *
 * Formula: Calories = MET × weight(kg) × time(hr)
 *
 * Sources:
 * - Compendium of Physical Activities
 * - ACSM Swimming guidelines
 *
 * Swimming MET values vary by stroke and speed
 */

export interface SwimmingCalorieBurnInput {
  timeMinutes: number;
  bodyWeight: number;
  stroke: 'freestyle' | 'backstroke' | 'breaststroke' | 'butterfly' | 'mixed';
  intensity: 'slow' | 'moderate' | 'vigorous';
}

export interface SwimmingCalorieBurnResult {
  timeMinutes: number;
  bodyWeight: number;
  stroke: string;
  intensity: string;
  metValue: number;
  caloriesBurned: number;
  caloriesBurnedPerMinute: number;
}

function getMETForSwimming(stroke: string, intensity: string): number {
  if (intensity === 'slow') {
    if (stroke === 'freestyle') return 3.5;
    if (stroke === 'backstroke') return 3.5;
    if (stroke === 'breaststroke') return 2.8;
    if (stroke === 'butterfly') return 4.0;
    return 3.5;
  }
  if (intensity === 'moderate') {
    if (stroke === 'freestyle') return 5.8;
    if (stroke === 'backstroke') return 5.8;
    if (stroke === 'breaststroke') return 5.3;
    if (stroke === 'butterfly') return 9.8;
    return 6.0;
  }
  // vigorous
  if (stroke === 'freestyle') return 8.3;
  if (stroke === 'backstroke') return 8.3;
  if (stroke === 'breaststroke') return 8.0;
  if (stroke === 'butterfly') return 13.6;
  return 8.0;
}

export function calculateSwimmingCalorieBurn(input: SwimmingCalorieBurnInput): SwimmingCalorieBurnResult {
  const metValue = getMETForSwimming(input.stroke, input.intensity);
  const timeHours = input.timeMinutes / 60;
  const caloriesBurned = Math.round(metValue * input.bodyWeight * timeHours);
  const caloriesBurnedPerMinute = Math.round(caloriesBurned / input.timeMinutes);

  return {
    timeMinutes: input.timeMinutes,
    bodyWeight: input.bodyWeight,
    stroke: input.stroke,
    intensity: input.intensity,
    metValue,
    caloriesBurned,
    caloriesBurnedPerMinute,
  };
}

export const EXAMPLE_1 = calculateSwimmingCalorieBurn({
  timeMinutes: 30,
  bodyWeight: 70,
  stroke: 'freestyle',
  intensity: 'moderate',
});

export const EXAMPLE_2 = calculateSwimmingCalorieBurn({
  timeMinutes: 45,
  bodyWeight: 65,
  stroke: 'breaststroke',
  intensity: 'slow',
});

export const EXAMPLE_3 = calculateSwimmingCalorieBurn({
  timeMinutes: 20,
  bodyWeight: 75,
  stroke: 'butterfly',
  intensity: 'vigorous',
});
