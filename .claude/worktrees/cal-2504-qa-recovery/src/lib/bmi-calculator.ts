/**
 * BMI Calculator (ดัชนีมวลกาย)
 *
 * Formula: BMI = weight (kg) / height (m)²
 *
 * Sources:
 * - WHO standard BMI classifications
 * - Thai Ministry of Public Health (MoPH) adaptation for Thai population
 *
 * Calculates:
 * - Body Mass Index
 * - Thai health classification (MoPH thresholds)
 * - Health recommendations
 */

export interface BMIInput {
  heightCm: number; // Height in cm
  weightKg: number; // Weight in kg
}

export interface BMIResult {
  bmi: number;
  heightCm: number;
  weightKg: number;
  classification: string;
  classificationTh: string;
  healthStatus: string;
  recommendation: string;
}

/**
 * Thai MoPH BMI classification
 * Different from WHO for Asian populations
 */
function getThaiClassification(bmi: number): {
  classification: string;
  classificationTh: string;
  healthStatus: string;
  recommendation: string;
} {
  if (bmi < 18.5) {
    return {
      classification: 'Underweight',
      classificationTh: 'น้ำหนักต่ำกว่าเกณฑ์',
      healthStatus: 'อาจประสบปัญหาสุขภาพ',
      recommendation: 'เพิ่มน้ำหนัก เคี้ยวดั้งเดิมและปรึกษาแพทย์',
    };
  }

  if (bmi < 23) {
    return {
      classification: 'Normal',
      classificationTh: 'น้ำหนักปกติ',
      healthStatus: 'สุขภาพดี ✓',
      recommendation: 'รักษาน้ำหนัก ออกกำลังกายสม่ำเสมอ',
    };
  }

  if (bmi < 25) {
    return {
      classification: 'Overweight',
      classificationTh: 'น้ำหนักเกิน',
      healthStatus: 'ควรระวัง',
      recommendation: 'ลดน้ำหนัก ออกกำลังกาย ลดอาหารมันและหวาน',
    };
  }

  if (bmi < 30) {
    return {
      classification: 'Obese',
      classificationTh: 'อ้วน',
      healthStatus: 'เสี่ยงต่อโรคประจำตัว',
      recommendation: 'ลดน้ำหนัก ปรึกษาแพทย์ ควรออกกำลังกาย',
    };
  }

  return {
    classification: 'Severely Obese',
    classificationTh: 'อ้วนมาก',
    healthStatus: 'เสี่ยงต่อโรคร้ายแรง',
    recommendation: 'ลดน้ำหนักโดยด่วน ปรึกษาแพทย์และโภคนพยาบาล',
  };
}

export function calculateBMI(input: BMIInput): BMIResult {
  // Validate inputs
  if (input.heightCm <= 0 || input.heightCm > 300) {
    throw new Error('Height must be between 1 and 300 cm');
  }
  if (input.weightKg <= 0 || input.weightKg > 250) {
    throw new Error('Weight must be between 1 and 250 kg');
  }

  // Calculate BMI
  const heightM = input.heightCm / 100;
  const bmi = Math.round((input.weightKg / (heightM * heightM)) * 10) / 10;

  const { classification, classificationTh, healthStatus, recommendation } =
    getThaiClassification(bmi);

  return {
    bmi,
    heightCm: input.heightCm,
    weightKg: input.weightKg,
    classification,
    classificationTh,
    healthStatus,
    recommendation,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateBMI({
  heightCm: 170,
  weightKg: 65,
});

export const EXAMPLE_2 = calculateBMI({
  heightCm: 175,
  weightKg: 80,
});

export const EXAMPLE_3 = calculateBMI({
  heightCm: 160,
  weightKg: 60,
});
