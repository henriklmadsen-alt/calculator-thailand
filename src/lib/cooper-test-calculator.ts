/**
 * Cooper Fitness Test Distance Calculator (คูเปอร์เทสต์ฟิตเนส)
 *
 * Formula: Distance = (VO2max × 44.73) + 504.9
 * Inverse of Cooper Test: estimate distance needed for target VO2max
 *
 * Sources:
 * - Cooper, K.H. (1968) "A means of assessing maximal oxygen intake" JAMA
 * - American College of Sports Medicine (ACSM)
 *
 * Calculates:
 * - Estimated distance for 12-minute run to achieve target VO2max
 * - Fitness category assessment
 * - Training zone recommendations
 */

export interface CooperTestInput {
  targetVO2Max: number; // Target VO2 Max in ml/kg/min
  age: number; // Age in years
  gender: 'male' | 'female'; // Gender
}

export interface CooperTestResult {
  targetVO2Max: number;
  estimatedDistanceMeters: number;
  estimatedDistanceKm: number;
  requiredPaceKmh: number;
  requiredPaceMinKm: string;
  fitnessLevel: string;
  fitnessLevelTh: string;
  remark: string;
}

/**
 * Get fitness level classification
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

export function calculateCooperTest(input: CooperTestInput): CooperTestResult {
  // Validate inputs
  if (input.targetVO2Max <= 0 || input.targetVO2Max > 100) {
    throw new Error('Target VO2 Max must be between 0.1 and 100 ml/kg/min');
  }
  if (input.age <= 0 || input.age > 120) {
    throw new Error('Age must be between 1 and 120 years');
  }

  // Inverse Cooper formula: Distance = (VO2max × 44.73) + 504.9
  const estimatedDistanceMeters = Math.round((input.targetVO2Max * 44.73 + 504.9) * 10) / 10;
  const estimatedDistanceKm = Math.round((estimatedDistanceMeters / 1000) * 10) / 10;

  // Required pace to cover this distance in 12 minutes (720 seconds)
  const requiredPaceKmh = Math.round((estimatedDistanceKm / 0.2) * 10) / 10; // 0.2 hours = 12 minutes
  const requiredPaceMinKm = (estimatedDistanceMeters / 1000 / 0.2).toFixed(1);

  const { level, levelTh } = getFitnessLevel(input.targetVO2Max, input.age, input.gender);

  const remark = `ต้องวิ่ง ${estimatedDistanceMeters.toLocaleString('th-TH')} เมตร ด้วยความเร็ว ${requiredPaceKmh} กม./ชม. เพื่อให้ได้ VO2max ${input.targetVO2Max} ml/kg/min`;

  return {
    targetVO2Max: input.targetVO2Max,
    estimatedDistanceMeters: Math.round(estimatedDistanceMeters),
    estimatedDistanceKm,
    requiredPaceKmh,
    requiredPaceMinKm: `${Math.floor(parseFloat(requiredPaceMinKm))}:${Math.round((parseFloat(requiredPaceMinKm) % 1) * 60)}/km`,
    fitnessLevel: level,
    fitnessLevelTh: levelTh,
    remark,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateCooperTest({
  targetVO2Max: 45,
  age: 30,
  gender: 'male',
});

export const EXAMPLE_2 = calculateCooperTest({
  targetVO2Max: 35,
  age: 25,
  gender: 'female',
});

export const EXAMPLE_3 = calculateCooperTest({
  targetVO2Max: 40,
  age: 40,
  gender: 'male',
});
