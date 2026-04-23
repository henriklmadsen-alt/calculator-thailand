/**
 * Training Load (TRIMP) Calculator (โหลดการฝึกซ้อม)
 *
 * Formula: TRIMP = Duration × HR_Ratio × 0.64 × e^(1.92 × HR_Ratio)
 * HR_Ratio = (Exercise HR - Resting HR) / (Max HR - Resting HR)
 *
 * Sources:
 * - Banister, E. et al. (1991) "Modeling Elite Athletic Performance"
 * - TRIMP: Training Impulse methodology for training load quantification
 *
 * Calculates:
 * - Training load (TRIMP units)
 * - Training intensity zone
 * - Weekly accumulation assessment
 */

export interface TRIMPInput {
  durationMinutes: number; // Training duration in minutes
  averageHeartRate: number; // Average HR during exercise (bpm)
  maxHeartRate: number; // Max HR (usually 220 - age)
  restingHeartRate?: number; // Resting HR (default 60)
}

export interface TRIMPResult {
  durationMinutes: number;
  averageHeartRate: number;
  maxHeartRate: number;
  restingHeartRate: number;
  heartRateRatio: number;
  trimpScore: number;
  intensityZone: string;
  intensityZoneTh: string;
  remark: string;
}

/**
 * Get intensity zone from TRIMP
 */
function getIntensityZone(trimp: number): { zone: string; zoneTh: string } {
  if (trimp < 50) return { zone: 'Recovery', zoneTh: 'หายใจเฟื่อง' };
  if (trimp < 100) return { zone: 'Aerobic', zoneTh: 'ออกกำลังปกติ' };
  if (trimp < 150) return { zone: 'Threshold', zoneTh: 'อัตราเกณฑ์' };
  return { zone: 'High Intensity', zoneTh: 'ออกกำลังเข้มข้น' };
}

export function calculateTRIMP(input: TRIMPInput): TRIMPResult {
  // Validate inputs
  if (input.durationMinutes <= 0 || input.durationMinutes > 480) {
    throw new Error('Duration must be between 1 and 480 minutes');
  }
  if (input.averageHeartRate <= 0 || input.averageHeartRate > 220) {
    throw new Error('Average HR must be between 1 and 220 bpm');
  }
  if (input.maxHeartRate <= 0 || input.maxHeartRate > 220) {
    throw new Error('Max HR must be between 1 and 220 bpm');
  }
  if (input.averageHeartRate > input.maxHeartRate) {
    throw new Error('Average HR cannot be greater than Max HR');
  }

  const restingHR = input.restingHeartRate || 60;
  if (restingHR <= 0 || restingHR >= input.maxHeartRate) {
    throw new Error('Resting HR must be between 1 and Max HR');
  }

  // Calculate HR Ratio
  const heartRateRange = input.maxHeartRate - restingHR;
  const adjustedAvgHR = input.averageHeartRate - restingHR;
  const hrRatio = adjustedAvgHR / heartRateRange;

  // Ensure HR ratio is reasonable (0 to 1)
  if (hrRatio < 0 || hrRatio > 1) {
    throw new Error('Heart rate values resulted in invalid ratio');
  }

  // TRIMP formula: Duration × HR_Ratio × 0.64 × e^(1.92 × HR_Ratio)
  const durationHours = input.durationMinutes / 60;
  const exponent = 1.92 * hrRatio;
  const exponentialFactor = Math.exp(exponent);
  const trimp = Math.round(durationHours * hrRatio * 0.64 * exponentialFactor * 10) / 10;

  const { zone, zoneTh } = getIntensityZone(trimp);

  const remark =
    trimp < 50
      ? 'ฝึกเพื่อหายใจเฟื่อง ฟื้นฟูตัว ✓'
      : trimp < 100
        ? 'ฝึกเพื่อสร้างแฟิตเนสทั่วไป ✓'
        : trimp < 150
          ? 'ฝึกเพื่อพัฒนาแรงกำลังและความทนไหว'
          : 'ฝึกเข้มข้น ควรจัดสมดุลกับการหายใจเฟื่อง';

  return {
    durationMinutes: input.durationMinutes,
    averageHeartRate: input.averageHeartRate,
    maxHeartRate: input.maxHeartRate,
    restingHeartRate: restingHR,
    heartRateRatio: Math.round(hrRatio * 100) / 100,
    trimpScore: trimp,
    intensityZone: zone,
    intensityZoneTh: zoneTh,
    remark,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateTRIMP({
  durationMinutes: 60,
  averageHeartRate: 155,
  maxHeartRate: 190,
  restingHeartRate: 60,
});

export const EXAMPLE_2 = calculateTRIMP({
  durationMinutes: 45,
  averageHeartRate: 140,
  maxHeartRate: 185,
  restingHeartRate: 65,
});

export const EXAMPLE_3 = calculateTRIMP({
  durationMinutes: 90,
  averageHeartRate: 165,
  maxHeartRate: 190,
  restingHeartRate: 55,
});
