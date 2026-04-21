/**
 * Max Heart Rate Calculator (อัตราการเต้นหัวใจสูงสุด)
 *
 * Formula: Max HR = 220 − age (Haskell-Fox)
 *
 * Sources:
 * - Haskell & Fox (1970) AHA standard formula
 * - American Heart Association
 *
 * Widely used formula for estimating maximum heart rate
 */

export interface MaxHeartRateInput {
  age: number;
}

export interface MaxHeartRateResult {
  age: number;
  maxHeartRate: number;
  zone50To60: { min: number; max: number }; // 50-60% - Very light
  zone60To70: { min: number; max: number }; // 60-70% - Light
  zone70To80: { min: number; max: number }; // 70-80% - Moderate
  zone80To90: { min: number; max: number }; // 80-90% - Hard
  zone90To100: { min: number; max: number }; // 90-100% - Maximum
}

export function calculateMaxHeartRate(input: MaxHeartRateInput): MaxHeartRateResult {
  const maxHeartRate = 220 - input.age;

  return {
    age: input.age,
    maxHeartRate,
    zone50To60: {
      min: Math.round(maxHeartRate * 0.5),
      max: Math.round(maxHeartRate * 0.6),
    },
    zone60To70: {
      min: Math.round(maxHeartRate * 0.6),
      max: Math.round(maxHeartRate * 0.7),
    },
    zone70To80: {
      min: Math.round(maxHeartRate * 0.7),
      max: Math.round(maxHeartRate * 0.8),
    },
    zone80To90: {
      min: Math.round(maxHeartRate * 0.8),
      max: Math.round(maxHeartRate * 0.9),
    },
    zone90To100: {
      min: Math.round(maxHeartRate * 0.9),
      max: maxHeartRate,
    },
  };
}

export const EXAMPLE_1 = calculateMaxHeartRate({ age: 30 });
export const EXAMPLE_2 = calculateMaxHeartRate({ age: 50 });
export const EXAMPLE_3 = calculateMaxHeartRate({ age: 25 });
