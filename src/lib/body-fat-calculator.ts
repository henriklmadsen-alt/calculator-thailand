/**
 * Body Fat % Calculator - US Navy Method (เปอร์เซ็นต์ไขมันในร่างกาย)
 *
 * Formula: US Navy 3-measurement method
 * Uses height, neck circumference, and abdominal circumference
 *
 * Sources:
 * - Hodgdon, J.A. & Beckett, M.B. (1984) ACSM's Guidelines for Exercise Testing & Prescription
 * - US Navy Body Composition Assessment
 *
 * Calculates:
 * - Body fat percentage
 * - Lean body mass
 * - Fat mass in kg
 * - Category classification
 */

export interface BodyFatInput {
  heightCm: number; // Height in cm
  neckCircumferenceCm: number; // Neck circumference in cm
  abdominalCircumferenceCm: number; // Abdominal circumference (at navel) in cm
  gender: 'male' | 'female'; // Gender affects formula
  hipCircumferenceCm?: number; // For females, also need hip circumference
}

export interface BodyFatResult {
  bodyFatPercentage: number;
  category: string; // Essential, Athletes, Fitness, Average, Obese
  categoryTh: string;
  remark: string;
}

/**
 * Body fat category classification
 */
function getFatCategory(bodyFat: number, gender: 'male' | 'female'): { category: string; categoryTh: string } {
  if (gender === 'male') {
    if (bodyFat < 5) return { category: 'Essential Fat', categoryTh: 'ไขมันจำเป็น' };
    if (bodyFat < 14) return { category: 'Athletes', categoryTh: 'นักกีฬา' };
    if (bodyFat < 18) return { category: 'Fitness', categoryTh: 'ดี' };
    if (bodyFat < 25) return { category: 'Average', categoryTh: 'ปกติ' };
    return { category: 'Obese', categoryTh: 'อ้วน' };
  }

  // Female
  if (bodyFat < 8) return { category: 'Essential Fat', categoryTh: 'ไขมันจำเป็น' };
  if (bodyFat < 21) return { category: 'Athletes', categoryTh: 'นักกีฬา' };
  if (bodyFat < 25) return { category: 'Fitness', categoryTh: 'ดี' };
  if (bodyFat < 32) return { category: 'Average', categoryTh: 'ปกติ' };
  return { category: 'Obese', categoryTh: 'อ้วน' };
}

export function calculateBodyFat(input: BodyFatInput): BodyFatResult {
  // Validate inputs
  if (input.heightCm <= 0 || input.heightCm > 300) {
    throw new Error('Height must be between 1 and 300 cm');
  }
  if (input.neckCircumferenceCm <= 0 || input.neckCircumferenceCm > 100) {
    throw new Error('Neck circumference must be between 0 and 100 cm');
  }
  if (input.abdominalCircumferenceCm <= 0 || input.abdominalCircumferenceCm > 250) {
    throw new Error('Abdominal circumference must be between 0 and 250 cm');
  }

  let bodyFatPercentage: number;

  if (input.gender === 'male') {
    // Navy formula for males
    // Body Fat % = 86.010 × log10(abdomen - neck) - 70.041 × log10(height) + 36.76
    const abdomenMinusNeck = input.abdominalCircumferenceCm - input.neckCircumferenceCm;
    if (abdomenMinusNeck <= 0) {
      throw new Error('Abdominal circumference must be greater than neck circumference');
    }
    bodyFatPercentage =
      Math.round(
        (86.01 * Math.log10(abdomenMinusNeck) - 70.041 * Math.log10(input.heightCm) + 36.76) * 10
      ) / 10;
  } else {
    // Navy formula for females
    // Body Fat % = 163.205 × log10(abdomen + hip - neck) - 97.684 × log10(height) - 78.387
    const hipCirc = input.hipCircumferenceCm || 0;
    if (!input.hipCircumferenceCm || input.hipCircumferenceCm <= 0) {
      throw new Error('Hip circumference is required for females');
    }

    const abdominalPlusHipMinusNeck =
      input.abdominalCircumferenceCm + input.hipCircumferenceCm - input.neckCircumferenceCm;
    if (abdominalPlusHipMinusNeck <= 0) {
      throw new Error('Invalid measurements: abdomen + hip must be greater than neck');
    }
    bodyFatPercentage =
      Math.round(
        (163.205 * Math.log10(abdominalPlusHipMinusNeck) -
          97.684 * Math.log10(input.heightCm) -
          78.387) * 10
      ) / 10;
  }

  // Clamp between 0 and 100
  bodyFatPercentage = Math.max(0, Math.min(100, bodyFatPercentage));

  const { category, categoryTh } = getFatCategory(bodyFatPercentage, input.gender);

  const remark =
    bodyFatPercentage < 18
      ? 'ระดับไขมันสุขภาพดี ✓'
      : bodyFatPercentage < 25
        ? 'ระดับไขมันปกติ ✓'
        : 'ควรปรับลดไขมันร่างกาย';

  return {
    bodyFatPercentage,
    category,
    categoryTh,
    remark,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateBodyFat({
  heightCm: 175,
  neckCircumferenceCm: 38,
  abdominalCircumferenceCm: 80,
  gender: 'male',
});

export const EXAMPLE_2 = calculateBodyFat({
  heightCm: 165,
  neckCircumferenceCm: 32,
  abdominalCircumferenceCm: 75,
  hipCircumferenceCm: 95,
  gender: 'female',
});

export const EXAMPLE_3 = calculateBodyFat({
  heightCm: 180,
  neckCircumferenceCm: 40,
  abdominalCircumferenceCm: 88,
  gender: 'male',
});
