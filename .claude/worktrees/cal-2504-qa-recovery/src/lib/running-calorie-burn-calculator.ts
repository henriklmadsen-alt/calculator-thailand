/**
 * Running Calorie Burn Calculator (แคลอรี่จากการวิ่ง)
 *
 * Formula: Calories = MET × weight(kg) × time(hr)
 *
 * Sources:
 * - Compendium of Physical Activities (Ainsworth et al., 2011)
 * - ACSM (American College of Sports Medicine) guidelines
 *
 * Calculates:
 * - Calories burned during running
 * - Breakdown by running intensity
 * - Daily/weekly calorie burn projections
 */

export interface RunningCalorieBurnInput {
  distance: number; // Distance in km
  timeMinutes: number; // Duration in minutes
  bodyWeight: number; // Body weight in kg
  pace: 'slow' | 'moderate' | 'fast' | 'very_fast'; // Running speed category
}

export interface RunningCalorieBurnResult {
  distance: number;
  timeMinutes: number;
  bodyWeight: number;
  timeHours: number;
  speedKmh: number;
  metValue: number;
  caloriesBurned: number;
  caloriesBurnedPerKm: number;
  caloriesBurnedPerMinute: number;
  dailyCalorieIfRepeated: number; // If done daily
  weeklyCalorieIfRepeated: number; // If done 5x weekly
  fuelEquivalent: string; // Approximate food equivalent
}

/**
 * MET values for running at different speeds
 * Source: Compendium of Physical Activities
 */
function getMETValueForRunning(speedKmh: number): number {
  // Based on running speed (km/h)
  if (speedKmh < 6) return 6.0; // Slow jog (< 6 km/h)
  if (speedKmh < 8) return 7.0; // Easy (6-8 km/h)
  if (speedKmh < 10) return 9.5; // Moderate (8-10 km/h)
  if (speedKmh < 12) return 11.0; // Fast (10-12 km/h)
  if (speedKmh < 14) return 13.5; // Very fast (12-14 km/h)
  return 15.0; // Sprint (> 14 km/h)
}

export function calculateRunningCalorieBurn(input: RunningCalorieBurnInput): RunningCalorieBurnResult {
  // Validate inputs
  if (input.distance <= 0 || input.timeMinutes <= 0 || input.bodyWeight <= 0) {
    throw new Error('All inputs must be positive values');
  }

  // Calculate basic metrics
  const timeHours = input.timeMinutes / 60;
  const speedKmh = (input.distance / input.timeMinutes) * 60;

  // Get MET value based on running speed
  const metValue = getMETValueForRunning(speedKmh);

  // Calculate calories burned (MET × weight(kg) × time(hr))
  const caloriesBurned = Math.round(metValue * input.bodyWeight * timeHours);
  const caloriesBurnedPerKm = Math.round(caloriesBurned / input.distance);
  const caloriesBurnedPerMinute = Math.round(caloriesBurned / input.timeMinutes);

  // Projection calculations
  const dailyCalorieIfRepeated = caloriesBurned; // If done once daily
  const weeklyCalorieIfRepeated = caloriesBurned * 5; // If done 5x weekly (typical fitness routine)

  // Approximate food equivalent
  let fuelEquivalent = '';
  if (caloriesBurned < 300) {
    fuelEquivalent = 'ไข่ไก่ 3-4 ฟอง หรือ ข้าวจ่าวกะปิ 1 จาน';
  } else if (caloriesBurned < 500) {
    fuelEquivalent = 'สตูหมูสไตล์ 1 ชาม หรือ ลึก ไก่ต้มน้ำลิ้น 1 ที่';
  } else if (caloriesBurned < 700) {
    fuelEquivalent = 'ข้าวซอย 1 ชาม หรือ เบอร์เกอร์ 1 ชิ้น';
  } else {
    fuelEquivalent = 'พิซซ่า 2 ชิ้น หรือ ข้าวแกง 2 ที่';
  }

  return {
    distance: input.distance,
    timeMinutes: input.timeMinutes,
    bodyWeight: input.bodyWeight,
    timeHours: Math.round(timeHours * 100) / 100,
    speedKmh: Math.round(speedKmh * 100) / 100,
    metValue,
    caloriesBurned,
    caloriesBurnedPerKm,
    caloriesBurnedPerMinute,
    dailyCalorieIfRepeated,
    weeklyCalorieIfRepeated,
    fuelEquivalent,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateRunningCalorieBurn({
  distance: 5,
  timeMinutes: 30,
  bodyWeight: 70,
  pace: 'moderate',
});

export const EXAMPLE_2 = calculateRunningCalorieBurn({
  distance: 10,
  timeMinutes: 60,
  bodyWeight: 65,
  pace: 'slow',
});

export const EXAMPLE_3 = calculateRunningCalorieBurn({
  distance: 3,
  timeMinutes: 18,
  bodyWeight: 75,
  pace: 'fast',
});
