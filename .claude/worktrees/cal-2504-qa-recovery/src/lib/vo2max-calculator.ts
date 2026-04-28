/**
 * VO2 Max Estimator (VO2 Max ประมาณการ)
 *
 * Formula: VO2max = (distance_m - 504.9) / 44.73 ml/kg/min
 * Based on 12-minute running test (Cooper Test)
 *
 * Sources:
 * - Cooper, K.H. (1968) "A means of assessing maximal oxygen intake" JAMA
 *
 * Calculates:
 * - VO2 Max from distance covered in 12 minutes
 * - Fitness level classification (Poor to Excellent)
 * - Comparison with age-gender benchmarks (Thai population)
 */

export interface VO2MaxInput {
  distanceMeters: number; // Distance covered in 12 minutes (meters)
  age: number; // Age in years
  gender: 'male' | 'female'; // Gender for classification
}

export interface VO2MaxResult {
  vo2Max: number; // VO2 Max in ml/kg/min
  fitnessLevel: string; // Poor, Fair, Good, Excellent
  fitnessLevelTh: string; // Thai classification
  remark: string; // Remarks in Thai
}

/**
 * Fitness level classification based on age and gender
 * Thai population norms
 */
function getFitnessLevel(
  vo2Max: number,
  age: number,
  gender: 'male' | 'female'
): { level: string; levelTh: string } {
  if (gender === 'male') {
    if (age < 25) {
      if (vo2Max >= 50) return { level: 'Excellent', levelTh: 'ยอดเยี่ยม' };
      if (vo2Max >= 42) return { level: 'Good', levelTh: 'ดี' };
      if (vo2Max >= 35) return { level: 'Fair', levelTh: 'ปานกลาง' };
      return { level: 'Poor', levelTh: 'อ่อน' };
    } else if (age < 35) {
      if (vo2Max >= 48) return { level: 'Excellent', levelTh: 'ยอดเยี่ยม' };
      if (vo2Max >= 40) return { level: 'Good', levelTh: 'ดี' };
      if (vo2Max >= 33) return { level: 'Fair', levelTh: 'ปานกลาง' };
      return { level: 'Poor', levelTh: 'อ่อน' };
    } else if (age < 45) {
      if (vo2Max >= 46) return { level: 'Excellent', levelTh: 'ยอดเยี่ยม' };
      if (vo2Max >= 38) return { level: 'Good', levelTh: 'ดี' };
      if (vo2Max >= 31) return { level: 'Fair', levelTh: 'ปานกลาง' };
      return { level: 'Poor', levelTh: 'อ่อน' };
    } else {
      if (vo2Max >= 42) return { level: 'Excellent', levelTh: 'ยอดเยี่ยม' };
      if (vo2Max >= 34) return { level: 'Good', levelTh: 'ดี' };
      if (vo2Max >= 27) return { level: 'Fair', levelTh: 'ปานกลาง' };
      return { level: 'Poor', levelTh: 'อ่อน' };
    }
  }

  // Female
  if (age < 25) {
    if (vo2Max >= 41) return { level: 'Excellent', levelTh: 'ยอดเยี่ยม' };
    if (vo2Max >= 34) return { level: 'Good', levelTh: 'ดี' };
    if (vo2Max >= 27) return { level: 'Fair', levelTh: 'ปานกลาง' };
    return { level: 'Poor', levelTh: 'อ่อน' };
  } else if (age < 35) {
    if (vo2Max >= 40) return { level: 'Excellent', levelTh: 'ยอดเยี่ยม' };
    if (vo2Max >= 33) return { level: 'Good', levelTh: 'ดี' };
    if (vo2Max >= 26) return { level: 'Fair', levelTh: 'ปานกลาง' };
    return { level: 'Poor', levelTh: 'อ่อน' };
  } else if (age < 45) {
    if (vo2Max >= 37) return { level: 'Excellent', levelTh: 'ยอดเยี่ยม' };
    if (vo2Max >= 30) return { level: 'Good', levelTh: 'ดี' };
    if (vo2Max >= 23) return { level: 'Fair', levelTh: 'ปานกลาง' };
    return { level: 'Poor', levelTh: 'อ่อน' };
  } else {
    if (vo2Max >= 33) return { level: 'Excellent', levelTh: 'ยอดเยี่ยม' };
    if (vo2Max >= 26) return { level: 'Good', levelTh: 'ดี' };
    if (vo2Max >= 19) return { level: 'Fair', levelTh: 'ปานกลาง' };
    return { level: 'Poor', levelTh: 'อ่อน' };
  }
}

export function calculateVO2Max(input: VO2MaxInput): VO2MaxResult {
  // Validate inputs
  if (input.distanceMeters <= 0 || input.distanceMeters > 5000) {
    throw new Error('Distance must be between 1 and 5000 meters (for 12-minute test)');
  }
  if (input.age <= 0 || input.age > 120) {
    throw new Error('Age must be between 1 and 120 years');
  }

  // Cooper formula: VO2max = (distance_m - 504.9) / 44.73
  const vo2Max = Math.round(((input.distanceMeters - 504.9) / 44.73) * 10) / 10;

  // Ensure result is reasonable (positive)
  if (vo2Max < 0) {
    throw new Error(
      'Distance too short to calculate VO2 Max. Minimum ~800m needed for 12-minute test.'
    );
  }

  const { level, levelTh } = getFitnessLevel(vo2Max, input.age, input.gender);

  const remark =
    level === 'Excellent'
      ? 'ระดับฟิตเนสของคุณเยี่ยมมาก ✓'
      : level === 'Good'
        ? 'ระดับฟิตเนสของคุณดี ✓'
        : level === 'Fair'
          ? 'ระดับฟิตเนสของคุณปานกลาง สามารถปรับปรุงได้'
          : 'ระดับฟิตเนสของคุณต้องการการพัฒนา ควรออกกำลังกายเพิ่มเติม';

  return {
    vo2Max,
    fitnessLevel: level,
    fitnessLevelTh: levelTh,
    remark,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateVO2Max({
  distanceMeters: 2400,
  age: 25,
  gender: 'male',
});

export const EXAMPLE_2 = calculateVO2Max({
  distanceMeters: 2000,
  age: 30,
  gender: 'female',
});

export const EXAMPLE_3 = calculateVO2Max({
  distanceMeters: 2700,
  age: 40,
  gender: 'male',
});
