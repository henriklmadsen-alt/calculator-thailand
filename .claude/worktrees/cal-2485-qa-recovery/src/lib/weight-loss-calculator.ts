/**
 * Weight Loss Timeline Calculator (เป้าหมายลดน้ำหนัก)
 *
 * Formula: Weeks = (kg_to_lose × 7700) ÷ daily_deficit_kcal
 * 7700 kcal = ~1 kg of body fat
 *
 * Sources:
 * - Safe weight loss rate: 0.5-1 kg per week
 * - NIH / WHO guidelines
 *
 * Calculates:
 * - Time needed to reach target weight
 * - Recommended daily calorie deficit
 * - Safe weight loss timeline
 */

export interface WeightLossInput {
  currentWeightKg: number; // Current body weight in kg
  targetWeightKg: number; // Target body weight in kg
  dailyCalorieDeficitKcal?: number; // Daily calorie deficit in kcal (default 500)
}

export interface WeightLossResult {
  currentWeightKg: number;
  targetWeightKg: number;
  weightToLoseKg: number;
  dailyCalorieDeficitKcal: number;
  weeklyWeightLossKg: number;
  estimatedWeeks: number;
  estimatedMonths: number;
  estimatedYears: number;
  remark: string;
}

export function calculateWeightLoss(input: WeightLossInput): WeightLossResult {
  // Validate inputs
  if (input.currentWeightKg <= 0 || input.currentWeightKg > 250) {
    throw new Error('Current weight must be between 1 and 250 kg');
  }
  if (input.targetWeightKg <= 0 || input.targetWeightKg > 250) {
    throw new Error('Target weight must be between 1 and 250 kg');
  }

  const weightToLoseKg = input.currentWeightKg - input.targetWeightKg;
  if (weightToLoseKg <= 0) {
    throw new Error('Target weight must be less than current weight');
  }

  const dailyDeficit = input.dailyCalorieDeficitKcal || 500;
  if (dailyDeficit < 300 || dailyDeficit > 1000) {
    throw new Error('Daily calorie deficit should be between 300-1000 kcal');
  }

  // Formula: 7700 kcal = ~1 kg body fat
  const caloriesPerKg = 7700;
  const totalCaloriesNeeded = weightToLoseKg * caloriesPerKg;

  // Days needed
  const daysNeeded = Math.round(totalCaloriesNeeded / dailyDeficit);
  const weeks = Math.round(daysNeeded / 7);
  const months = Math.round(weeks / 4.33); // Average weeks per month
  const years = Math.round(months / 12);

  // Weekly weight loss
  const weeklyWeightLoss = Math.round((dailyDeficit * 7) / caloriesPerKg * 100) / 100;

  const remark =
    weeklyWeightLoss <= 0.5
      ? 'อัตราการลดน้ำหนักช้า อาจติดน้ำ ควรเพิ่มกิจกรรม'
      : weeklyWeightLoss <= 1.0
        ? 'อัตราการลดน้ำหนักสวย อย่างปลอดภัย ✓'
        : 'อัตราการลดน้ำหนักเร็วเกินไป อาจสูญเสียกล้ามเนื้อ';

  return {
    currentWeightKg: input.currentWeightKg,
    targetWeightKg: input.targetWeightKg,
    weightToLoseKg: Math.round(weightToLoseKg * 100) / 100,
    dailyCalorieDeficitKcal: dailyDeficit,
    weeklyWeightLossKg: weeklyWeightLoss,
    estimatedWeeks: weeks,
    estimatedMonths: months,
    estimatedYears: years,
    remark,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateWeightLoss({
  currentWeightKg: 85,
  targetWeightKg: 75,
  dailyCalorieDeficitKcal: 500,
});

export const EXAMPLE_2 = calculateWeightLoss({
  currentWeightKg: 90,
  targetWeightKg: 75,
  dailyCalorieDeficitKcal: 700,
});

export const EXAMPLE_3 = calculateWeightLoss({
  currentWeightKg: 100,
  targetWeightKg: 75,
  dailyCalorieDeficitKcal: 500,
});
