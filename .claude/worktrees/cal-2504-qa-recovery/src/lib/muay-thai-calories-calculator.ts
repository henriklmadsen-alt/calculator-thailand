/**
 * Muay Thai Calorie Burn Calculator (แคลอรี่จากมวยไทย)
 *
 * Formula: Calories = MET × body weight (kg) × time (hours)
 * MET values: Sparring 10.0, Bag work 6.0
 *
 * Sources:
 * - Compendium of Physical Activities (Ainsworth et al., 2011)
 * - Thai traditional martial arts energy expenditure
 *
 * Calculates:
 * - Calories burned during Muay Thai training
 * - Based on activity type and body weight
 */

export interface MuayThaiCaloriesInput {
  timeMinutes: number; // Training duration in minutes
  bodyWeightKg: number; // Body weight in kg
  activityType: 'sparring' | 'bagwork' | 'mixed'; // Activity type
}

export interface MuayThaiCaloriesResult {
  timeMinutes: number;
  bodyWeightKg: number;
  activityType: string;
  activityTypeTh: string;
  metValue: number;
  caloriesBurned: number;
  remark: string;
}

export function calculateMuayThaiCalories(input: MuayThaiCaloriesInput): MuayThaiCaloriesResult {
  // Validate inputs
  if (input.timeMinutes <= 0 || input.timeMinutes > 480) {
    throw new Error('Time must be between 1 and 480 minutes');
  }
  if (input.bodyWeightKg <= 0 || input.bodyWeightKg > 200) {
    throw new Error('Body weight must be between 1 and 200 kg');
  }

  // MET values
  const metValues: Record<string, number> = {
    sparring: 10.0,
    bagwork: 6.0,
    mixed: 8.0,
  };

  const metValue = metValues[input.activityType] || 8.0;
  const timeHours = input.timeMinutes / 60;
  const caloriesBurned = Math.round(metValue * input.bodyWeightKg * timeHours);

  const activityNames: Record<string, { en: string; th: string }> = {
    sparring: { en: 'Sparring', th: 'ชกซ้อม' },
    bagwork: { en: 'Bag Work', th: 'ชกกระสอบ' },
    mixed: { en: 'Mixed Training', th: 'ฝึกผสม' },
  };

  const activityTypeTh = activityNames[input.activityType]?.th || 'ฝึกผสม';

  const remark = `เผาแคลอรี่ประมาณ ${caloriesBurned} แคล. ในการฝึก${activityTypeTh}`;

  return {
    timeMinutes: input.timeMinutes,
    bodyWeightKg: input.bodyWeightKg,
    activityType: input.activityType,
    activityTypeTh,
    metValue,
    caloriesBurned,
    remark,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateMuayThaiCalories({
  timeMinutes: 60,
  bodyWeightKg: 70,
  activityType: 'sparring',
});

export const EXAMPLE_2 = calculateMuayThaiCalories({
  timeMinutes: 45,
  bodyWeightKg: 65,
  activityType: 'bagwork',
});

export const EXAMPLE_3 = calculateMuayThaiCalories({
  timeMinutes: 90,
  bodyWeightKg: 75,
  activityType: 'mixed',
});
