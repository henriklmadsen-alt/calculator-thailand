/**
 * Heart Rate Zones Calculator (โซนอัตราการเต้นหัวใจ)
 *
 * Formula: Target HR = (Max HR - Resting HR) × % Intensity + Resting HR
 * Max HR = 220 - age (Haskell-Fox)
 *
 * Sources:
 * - Karvonen, Kentala & Mustala (1957) — Target Heart Rate Method
 * - Haskell & Fox (1970) — Max HR estimation
 *
 * Calculates:
 * - Heart rate zones for 5 intensity levels
 * - Based on Karvonen method (accounts for resting heart rate)
 */

export interface HeartRateZonesInput {
  age: number; // Age in years
  restingHeartRate?: number; // Resting HR (default 60 if not provided)
}

export interface HeartRateZone {
  zone: number;
  nameEn: string;
  nameTh: string;
  intensity: number; // As percentage (e.g., 50 for 50%)
  minHR: number;
  maxHR: number;
  description: string;
}

export interface HeartRateZonesResult {
  age: number;
  restingHeartRate: number;
  maxHeartRate: number;
  zones: HeartRateZone[];
}

export function calculateHeartRateZones(input: HeartRateZonesInput): HeartRateZonesResult {
  // Validate inputs
  if (input.age <= 0 || input.age > 120) {
    throw new Error('Age must be between 1 and 120 years');
  }

  const restingHeartRate = input.restingHeartRate || 60;
  if (restingHeartRate <= 0 || restingHeartRate >= 220) {
    throw new Error('Resting heart rate must be between 1 and 220 bpm');
  }

  // Calculate max heart rate using Haskell-Fox formula
  const maxHeartRate = Math.round(220 - input.age);

  // Heart Rate Reserve (Karvonen)
  const heartRateReserve = maxHeartRate - restingHeartRate;

  // Define zones with Karvonen percentages
  const zones: HeartRateZone[] = [
    {
      zone: 1,
      nameEn: 'Recovery',
      nameTh: 'หายใจเฟื่อง (Recovery)',
      intensity: 50,
      minHR: Math.round(heartRateReserve * 0.5 + restingHeartRate),
      maxHR: Math.round(heartRateReserve * 0.6 + restingHeartRate),
      description: 'Very light exercise, recovery and warm-up',
    },
    {
      zone: 2,
      nameEn: 'Aerobic',
      nameTh: 'ออกกำลังปกติ (Aerobic)',
      intensity: 60,
      minHR: Math.round(heartRateReserve * 0.6 + restingHeartRate),
      maxHR: Math.round(heartRateReserve * 0.7 + restingHeartRate),
      description: 'Endurance building, conversational pace',
    },
    {
      zone: 3,
      nameEn: 'Tempo',
      nameTh: 'เทมโปปานกลาง (Tempo)',
      intensity: 70,
      minHR: Math.round(heartRateReserve * 0.7 + restingHeartRate),
      maxHR: Math.round(heartRateReserve * 0.8 + restingHeartRate),
      description: 'Sustained effort, harder breathing',
    },
    {
      zone: 4,
      nameEn: 'Threshold',
      nameTh: 'อัตราเกณฑ์ (Threshold)',
      intensity: 80,
      minHR: Math.round(heartRateReserve * 0.8 + restingHeartRate),
      maxHR: Math.round(heartRateReserve * 0.9 + restingHeartRate),
      description: 'High intensity, lactate threshold',
    },
    {
      zone: 5,
      nameEn: 'VO2 Max',
      nameTh: 'สูงสุด (VO2 Max)',
      intensity: 90,
      minHR: Math.round(heartRateReserve * 0.9 + restingHeartRate),
      maxHR: maxHeartRate,
      description: 'Maximum effort, sprinting/high intensity',
    },
  ];

  return {
    age: input.age,
    restingHeartRate,
    maxHeartRate,
    zones,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateHeartRateZones({
  age: 30,
  restingHeartRate: 60,
});

export const EXAMPLE_2 = calculateHeartRateZones({
  age: 45,
  restingHeartRate: 65,
});

export const EXAMPLE_3 = calculateHeartRateZones({
  age: 50,
  restingHeartRate: 70,
});
