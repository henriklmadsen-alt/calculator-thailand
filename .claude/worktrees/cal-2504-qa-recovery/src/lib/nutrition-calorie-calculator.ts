/**
 * Thai Nutrition & Calorie Calculator (คำนวณแคลอรี่และสารอาหาร)
 *
 * Sources:
 * - Thai Food Composition Database (Ministry of Public Health)
 * - WHO Daily Calorie Requirements by Age & Activity Level
 * - Thai Dietary Guidelines (สำนักอาหารและโภชนาการ)
 *
 * Estimates daily calorie needs based on:
 * - Age and gender
 * - Activity level
 * - Height and weight
 * - Common Thai foods and their nutritional content
 */

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
export type Gender = 'male' | 'female';

export interface NutritionInput {
  ageYears: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
}

export interface NutritionResult {
  dailyCalories: number;
  proteinGrams: number;
  fatsGrams: number;
  carbohydratesGrams: number;
  fiberGrams: number;
  waterLiters: number;
  bmr: number; // Basal Metabolic Rate
  activityMultiplier: number;
  ageYears: number;
  gender: string;
  weightKg: number;
  heightCm: number;
  activityLevelName: string;
}

const ACTIVITY_NAMES: Record<ActivityLevel, string> = {
  sedentary: 'ไม่ออกกำลังกาย (นั่งส่วนใหญ่)',
  light: 'ออกกำลังกายน้อย (1-3 วัน/สัปดาห์)',
  moderate: 'ออกกำลังกายปานกลาง (3-5 วัน/สัปดาห์)',
  active: 'ออกกำลังกายหนัก (6-7 วัน/สัปดาห์)',
  veryActive: 'ออกกำลังกายมากๆ (2 ครั้ง/วัน)',
};

function getActivityMultiplier(activityLevel: ActivityLevel): number {
  switch (activityLevel) {
    case 'sedentary':
      return 1.2;
    case 'light':
      return 1.375;
    case 'moderate':
      return 1.55;
    case 'active':
      return 1.725;
    case 'veryActive':
      return 1.9;
  }
}

/**
 * Mifflin-St Jeor equation for BMR
 */
function calculateBMR(
  ageYears: number,
  gender: Gender,
  heightCm: number,
  weightKg: number,
): number {
  if (gender === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
  } else {
    return 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
  }
}

export function calculateNutrition(input: NutritionInput): NutritionResult {
  const {
    ageYears,
    gender,
    heightCm,
    weightKg,
    activityLevel,
  } = input;

  const bmr = calculateBMR(ageYears, gender, heightCm, weightKg);
  const activityMultiplier = getActivityMultiplier(activityLevel);
  const dailyCalories = Math.round(bmr * activityMultiplier);

  // Macronutrient distribution: 30% protein, 30% fat, 40% carbs
  const proteinGrams = Math.round((dailyCalories * 0.3) / 4); // 4 cal/g
  const fatsGrams = Math.round((dailyCalories * 0.3) / 9); // 9 cal/g
  const carbohydratesGrams = Math.round((dailyCalories * 0.4) / 4);

  // Fiber: 25-38g per day
  const fiberGrams = weightKg > 60 ? 35 : 25;

  // Water intake: 30-35 ml per kg body weight
  const waterLiters = Math.round((weightKg * 30) / 1000 * 10) / 10;

  return {
    dailyCalories,
    proteinGrams,
    fatsGrams,
    carbohydratesGrams,
    fiberGrams,
    waterLiters,
    bmr: Math.round(bmr),
    activityMultiplier,
    ageYears,
    gender: gender === 'male' ? 'ชาย' : 'หญิง',
    weightKg,
    heightCm,
    activityLevelName: ACTIVITY_NAMES[activityLevel],
  };
}
