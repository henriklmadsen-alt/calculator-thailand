/**
 * Thai BMI Calculator (คำนวณดัชนีมวลกาย)
 *
 * Sources:
 * - Thai Health Ministry BMI Classification Standards
 * - WHO BMI Classification (adapted for Asian populations)
 * - Ministry of Public Health Standard Health Assessment
 *
 * Thai BMI Classification:
 * - น้ำหนักต่ำ (Underweight): BMI < 18.5
 * - ปกติ (Normal): BMI 18.5 - 22.9
 * - น้ำหนักเกิน (Overweight): BMI 23 - 24.9
 * - อ้วน (Obese Class I): BMI 25 - 29.9
 * - อ้วนมาก (Obese Class II): BMI ≥ 30
 */

export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese1' | 'obese2';

export interface BMIInput {
  heightCm: number; // Height in centimeters
  weightKg: number; // Weight in kilograms
}

export interface BMIResult {
  bmi: number;
  category: BMICategory;
  categoryName: string;
  categoryNameEn: string;
  riskLevel: string;
  riskLevelEn: string;
  recommendedWeightMin: number;
  recommendedWeightMax: number;
  idealWeightMin: number;
  idealWeightMax: number;
  weightDifference: number; // Positive if overweight, negative if underweight
  heightCm: number;
  weightKg: number;
}

const CATEGORY_NAMES: Record<BMICategory, string> = {
  underweight: 'น้ำหนักต่ำเกินไป',
  normal: 'น้ำหนักปกติ',
  overweight: 'น้ำหนักเกิน',
  obese1: 'อ้วนระดับ 1',
  obese2: 'อ้วนระดับ 2',
};

const CATEGORY_NAMES_EN: Record<BMICategory, string> = {
  underweight: 'Underweight',
  normal: 'Normal Weight',
  overweight: 'Overweight',
  obese1: 'Obese (Class I)',
  obese2: 'Obese (Class II)',
};

const RISK_LEVELS: Record<BMICategory, string> = {
  underweight: 'ความเสี่ยงต่อสุขภาพ (ขาดสารอาหาร ระบบภูมิคุ้มกัน)',
  normal: 'ความเสี่ยงต่อโรคต่ำ',
  overweight: 'ความเสี่ยงต่อโรคเพิ่มเติม',
  obese1: 'ความเสี่ยงต่อโรคสูง (เบาหวาน ความดันสูง)',
  obese2: 'ความเสี่ยงต่อโรคสูงมาก',
};

const RISK_LEVELS_EN: Record<BMICategory, string> = {
  underweight: 'Health risk from malnutrition',
  normal: 'Low disease risk',
  overweight: 'Increased health risk',
  obese1: 'High risk for chronic diseases',
  obese2: 'Very high disease risk',
};

function getCategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 23) return 'normal';
  if (bmi < 25) return 'overweight';
  if (bmi < 30) return 'obese1';
  return 'obese2';
}

function getRecommendedWeight(heightCm: number): { min: number; max: number } {
  const heightM = heightCm / 100;
  return {
    min: Math.round(18.5 * heightM * heightM),
    max: Math.round(22.9 * heightM * heightM),
  };
}

export function calculateBMI(input: BMIInput): BMIResult {
  const { heightCm, weightKg } = input;

  if (heightCm <= 0 || weightKg <= 0) {
    throw new Error('Height and weight must be positive values');
  }

  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

  const category = getCategory(bmi);
  const recommended = getRecommendedWeight(heightCm);
  const ideal = {
    min: Math.round(20 * heightM * heightM),
    max: Math.round(22 * heightM * heightM),
  };

  const weightDifference = weightKg - ideal.max;

  return {
    bmi,
    category,
    categoryName: CATEGORY_NAMES[category],
    categoryNameEn: CATEGORY_NAMES_EN[category],
    riskLevel: RISK_LEVELS[category],
    riskLevelEn: RISK_LEVELS_EN[category],
    recommendedWeightMin: recommended.min,
    recommendedWeightMax: recommended.max,
    idealWeightMin: ideal.min,
    idealWeightMax: ideal.max,
    weightDifference,
    heightCm,
    weightKg,
  };
}
