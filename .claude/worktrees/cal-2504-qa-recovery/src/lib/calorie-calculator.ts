/**
 * Thai Calorie Calculator (คำนวณแคลอรี่)
 * Calculate BMR, TDEE, and calorie needs for weight goals
 * Uses Mifflin-St Jeor formula for BMR (most accurate)
 * Sources: Mifflin & St Jeor 1990, FAO/WHO
 */

export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'lose' | 'maintain' | 'gain';

export interface CalorieInput {
  age: number;                    // years
  gender: Gender;                 // ชาย/หญิง
  weight: number;                 // kg
  height: number;                 // cm
  activityLevel: ActivityLevel;   // กิจกรรม
  goal: Goal;                      // เป้าหมาย
  targetWeightLoss?: number;      // kg per week (0.5-1.0 recommended)
}

export interface CalorieResult {
  bmr: number;                      // Basal Metabolic Rate (kcal/day)
  tdee: number;                     // Total Daily Energy Expenditure (kcal/day)
  activityMultiplier: number;       // ตัวคูณ
  dailyCalorieGoal: number;         // เป้าหมายแคลอรี่รายวัน
  weeklyCalorieGoal: number;        // สัปดาห์
  monthlyWeightChangeKg: number;    // การเปลี่ยนแปลงน้ำหนักต่อเดือน
  projectedWeightIn30Days: number;  // น้ำหนักที่คาดการณ์
  projectedWeightIn90Days: number;
  calorieDeficitSurplus: number;    // kcal/day difference from TDEE
}

/**
 * Calculate BMR using Mifflin-St Jeor formula (most accurate)
 * Formula differs by gender
 */
export function calculateBMR(age: number, gender: Gender, weight: number, height: number): number {
  if (gender === 'male') {
    // Male: (10 × weight) + (6.25 × height) - (5 × age) + 5
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    // Female: (10 × weight) + (6.25 × height) - (5 × age) - 161
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

/**
 * Get activity multiplier based on activity level
 * Harris-Benedict revised coefficients
 */
export function getActivityMultiplier(activityLevel: ActivityLevel): number {
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,           // นั่ง/นอนส่วนใหญ่
    light: 1.375,             // ออกกำลังเบา 1-3 วันต่อสัปดาห์
    moderate: 1.55,           // ออกกำลังปานกลาง 3-5 วันต่อสัปดาห์
    active: 1.725,            // ออกกำลังหนัก 6-7 วันต่อสัปดาห์
    very_active: 1.9,         // ออกกำลังหนักมากหรืองานหนัก
  };
  return multipliers[activityLevel];
}

/**
 * Calculate daily calorie needs based on goal
 */
export function getDailyCalorieGoal(tdee: number, goal: Goal, targetWeightLoss?: number): number {
  switch (goal) {
    case 'lose':
      // Typical deficit: 500 kcal/day = 0.5 kg/week (safe rate)
      // Or use specified target: 1 kg/week = 1000 kcal deficit
      const deficit = targetWeightLoss ? targetWeightLoss * 1000 : 500;
      return Math.max(tdee - deficit, 1200); // Never below 1200 kcal/day
    case 'maintain':
      return tdee;
    case 'gain':
      // Typical surplus: 500 kcal/day = 0.5 kg/week gain
      return tdee + 500;
  }
}

/**
 * Main calculation function
 */
export function calculateCalories(input: CalorieInput): CalorieResult {
  const bmr = calculateBMR(input.age, input.gender, input.weight, input.height);
  const activityMultiplier = getActivityMultiplier(input.activityLevel);
  const tdee = Math.round(bmr * activityMultiplier);
  const dailyCalorieGoal = getDailyCalorieGoal(tdee, input.goal, input.targetWeightLoss);
  const calorieDeficitSurplus = dailyCalorieGoal - tdee;

  // Calculate weight change projections
  // 1 kg = 7700 kcal deficit
  const weeklyWeightChange = (calorieDeficitSurplus * 7) / 7700;
  const monthlyWeightChangeKg = weeklyWeightChange * 4;
  const threeMonthWeightChangeKg = weeklyWeightChange * 12;

  return {
    bmr: Math.round(bmr),
    tdee,
    activityMultiplier: Math.round(activityMultiplier * 100) / 100,
    dailyCalorieGoal: Math.round(dailyCalorieGoal),
    weeklyCalorieGoal: Math.round(dailyCalorieGoal * 7),
    calorieDeficitSurplus: Math.round(calorieDeficitSurplus),
    monthlyWeightChangeKg: Math.round(monthlyWeightChangeKg * 100) / 100,
    projectedWeightIn30Days: Math.round((input.weight + monthlyWeightChangeKg) * 100) / 100,
    projectedWeightIn90Days: Math.round((input.weight + threeMonthWeightChangeKg) * 100) / 100,
  };
}

/**
 * Get activity level description
 */
export function getActivityDescription(level: ActivityLevel): string {
  const descriptions: Record<ActivityLevel, string> = {
    sedentary: 'นั่งส่วนใหญ่, ออกแบบไม่ออกกำลัง',
    light: 'ออกกำลังแสง 1-3 วันต่อสัปดาห์',
    moderate: 'ออกกำลังปานกลาง 3-5 วันต่อสัปดาห์',
    active: 'ออกกำลังหนัก 6-7 วันต่อสัปดาห์',
    very_active: 'ออกกำลังหนักมาก หรืองานหนัก',
  };
  return descriptions[level];
}

/**
 * Get calorie deficit/surplus description for weight loss
 */
export function getCalorieDeficitDescription(deficit: number): string {
  if (deficit < -300) {
    return 'เกินเป้าหมายมาก - อาจไม่ยั่งยืน';
  } else if (deficit < 0) {
    return 'เกินเป้าหมาย - พิจารณาลดแคลอรี่ลง';
  } else if (deficit === 0) {
    return 'รักษาน้ำหนัก';
  } else if (deficit <= 500) {
    return 'ขาดแคลอรี่ปานกลาง - อาจสูญเสีย 0.25-0.5 กก./สัปดาห์';
  } else if (deficit <= 1000) {
    return 'ขาดแคลอรี่ที่ดี - อาจสูญเสีย 0.5-1 กก./สัปดาห์';
  } else {
    return 'ขาดแคลอรี่มาก - อาจไม่ยั่งยืนหรือสูญเสียกล้ามเนื้อ';
  }
}
