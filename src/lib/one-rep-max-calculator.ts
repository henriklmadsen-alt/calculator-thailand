/**
 * One Rep Max (1RM) Calculator (น้ำหนักสูงสุด 1 ครั้ง)
 *
 * Formula: 1RM = Weight × (1 + Reps / 30)
 * Epley formula for estimating maximum lift
 *
 * Sources:
 * - Epley, B. (1985) "Poundage Chart" Boyd Epley & Strength Training Institute
 *
 * Calculates:
 * - Estimated 1 rep max from submaximal lift
 * - Strength training percentages for different rep ranges
 */

export interface OneRepMaxInput {
  weight: number; // Weight lifted in kg
  reps: number; // Number of reps performed
}

export interface StrengthLevel {
  repRange: string;
  percentage: number;
  weight: number;
}

export interface OneRepMaxResult {
  weight: number;
  reps: number;
  oneRepMax: number;
  strengthLevels: StrengthLevel[];
}

export function calculateOneRepMax(input: OneRepMaxInput): OneRepMaxResult {
  // Validate inputs
  if (input.weight <= 0) {
    throw new Error('Weight must be positive');
  }
  if (input.reps <= 0 || input.reps > 15) {
    throw new Error('Reps must be between 1 and 15 for accurate estimation');
  }

  // Epley formula: 1RM = Weight × (1 + Reps / 30)
  const oneRepMax = Math.round(input.weight * (1 + input.reps / 30) * 10) / 10;

  // Training percentages for different rep ranges
  const strengthLevels: StrengthLevel[] = [
    {
      repRange: '1 rep (1RM)',
      percentage: 100,
      weight: Math.round(oneRepMax * 10) / 10,
    },
    {
      repRange: '2-3 reps',
      percentage: 95,
      weight: Math.round(oneRepMax * 0.95 * 10) / 10,
    },
    {
      repRange: '4-6 reps',
      percentage: 85,
      weight: Math.round(oneRepMax * 0.85 * 10) / 10,
    },
    {
      repRange: '7-8 reps',
      percentage: 80,
      weight: Math.round(oneRepMax * 0.8 * 10) / 10,
    },
    {
      repRange: '8-10 reps',
      percentage: 75,
      weight: Math.round(oneRepMax * 0.75 * 10) / 10,
    },
    {
      repRange: '10-12 reps',
      percentage: 70,
      weight: Math.round(oneRepMax * 0.7 * 10) / 10,
    },
    {
      repRange: '12-15 reps',
      percentage: 65,
      weight: Math.round(oneRepMax * 0.65 * 10) / 10,
    },
  ];

  return {
    weight: input.weight,
    reps: input.reps,
    oneRepMax,
    strengthLevels,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateOneRepMax({
  weight: 100,
  reps: 5,
});

export const EXAMPLE_2 = calculateOneRepMax({
  weight: 80,
  reps: 8,
});

export const EXAMPLE_3 = calculateOneRepMax({
  weight: 120,
  reps: 3,
});
