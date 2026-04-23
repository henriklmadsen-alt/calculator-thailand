/**
 * Hydration for Athletes Calculator (ปริมาณน้ำสำหรับนักกีฬา)
 *
 * Formula: Daily water intake = 35 ml/kg/day + 500-1000 ml/hr during exercise
 * Adjusted for Thailand heat and humidity
 *
 * Sources:
 * - ACSM Guidelines for Exercise Testing & Prescription
 * - ISSN Sports Nutrition Position Stand
 *
 * Calculates:
 * - Daily hydration requirements
 * - During-exercise hydration needs
 * - Heat-adjusted recommendations (Thailand climate)
 */

export interface HydrationInput {
  bodyWeightKg: number; // Body weight in kg
  exerciseHoursPerDay?: number; // Hours of daily exercise
  climate: 'cool' | 'warm' | 'hot'; // Climate condition
}

export interface HydrationResult {
  bodyWeightKg: number;
  baselineDailyMl: number;
  exerciseDailyMl: number;
  totalDailyMl: number;
  totalDailyLiters: number;
  perHourExerciseMl: number;
  cupsPerDay: number;
  remark: string;
}

export function calculateHydration(input: HydrationInput): HydrationResult {
  // Validate inputs
  if (input.bodyWeightKg <= 0 || input.bodyWeightKg > 250) {
    throw new Error('Body weight must be between 1 and 250 kg');
  }

  const exerciseHours = input.exerciseHoursPerDay || 0;
  if (exerciseHours < 0 || exerciseHours > 8) {
    throw new Error('Exercise hours must be between 0 and 8');
  }

  // Base hydration: 35 ml/kg/day
  const baselineDailyMl = Math.round(input.bodyWeightKg * 35);

  // Exercise hydration: 500-1000 ml/hour
  let perHourExerciseMl = 750; // Default moderate
  if (input.climate === 'cool') perHourExerciseMl = 600;
  if (input.climate === 'hot') perHourExerciseMl = 1000;

  const exerciseDailyMl = Math.round(perHourExerciseMl * exerciseHours);
  const totalDailyMl = baselineDailyMl + exerciseDailyMl;
  const totalDailyLiters = Math.round(totalDailyMl / 100) / 10;
  const cupsPerDay = Math.round((totalDailyMl / 240) * 10) / 10; // ~240ml per cup

  const climateRemarks: Record<string, string> = {
    cool: 'สภาพอากาศเย็น - ความต้องการน้ำน้อยลง',
    warm: 'สภาพอากาศอบอวล - สภาพอากาศเมืองไทย ปกติ',
    hot: 'สภาพอากาศร้อนจัด (เทศกาล/ฝึกหนัก) - เพิ่มน้ำ 200 มล./ชม.',
  };

  const remark = `${climateRemarks[input.climate]} ดื่มน้ำแบบค่อยๆ ไม่ใช่ครั้งเดียว`;

  return {
    bodyWeightKg: input.bodyWeightKg,
    baselineDailyMl,
    exerciseDailyMl,
    totalDailyMl,
    totalDailyLiters,
    perHourExerciseMl,
    cupsPerDay,
    remark,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateHydration({
  bodyWeightKg: 70,
  exerciseHoursPerDay: 1,
  climate: 'hot',
});

export const EXAMPLE_2 = calculateHydration({
  bodyWeightKg: 65,
  exerciseHoursPerDay: 1.5,
  climate: 'warm',
});

export const EXAMPLE_3 = calculateHydration({
  bodyWeightKg: 75,
  exerciseHoursPerDay: 0,
  climate: 'warm',
});
