/**
 * Protein Intake for Athletes Calculator (โปรตีนสำหรับนักกีฬา)
 *
 * Formula: Daily protein = 1.4–2.0 g/kg body weight
 * Adjusted based on training intensity
 *
 * Sources:
 * - ISSN Position Stand: Protein and Exercise (Stout et al., 2017)
 * - International Society of Sports Nutrition
 *
 * Calculates:
 * - Recommended daily protein intake
 * - Per-meal protein distribution (4-6 meals)
 * - Amino acid profile recommendations
 */

export interface ProteinIntakeInput {
  bodyWeightKg: number; // Body weight in kg
  trainingType: 'maintenance' | 'strength' | 'endurance' | 'mixed'; // Training type
  mealsPerDay?: number; // Number of meals per day (default 4)
}

export interface ProteinRecommendation {
  gPerKg: number;
  minGrams: number;
  maxGrams: number;
  perMeal: number;
  trainingDescription: string;
}

export interface ProteinIntakeResult {
  bodyWeightKg: number;
  trainingType: string;
  recommendation: ProteinRecommendation;
  mealsPerDay: number;
}

/**
 * Get protein recommendation based on training type
 * ISSN guidelines
 */
function getProteinRecommendation(
  trainingType: 'maintenance' | 'strength' | 'endurance' | 'mixed'
): ProteinRecommendation {
  switch (trainingType) {
    case 'maintenance':
      return {
        gPerKg: 0.8,
        minGrams: 0.8,
        maxGrams: 1.0,
        perMeal: 0.2,
        trainingDescription: 'ออกกำลังกายเพื่อสุขภาพทั่วไป / Minimal training',
      };
    case 'strength':
      return {
        gPerKg: 1.8,
        minGrams: 1.6,
        maxGrams: 2.0,
        perMeal: 0.4,
        trainingDescription:
          'ฝึกแรง เพิ่มกล้ามเนื้อ / Heavy strength training, muscle building',
      };
    case 'endurance':
      return {
        gPerKg: 1.2,
        minGrams: 1.2,
        maxGrams: 1.4,
        perMeal: 0.25,
        trainingDescription: 'วิ่ง ปั่นจักรยาน ว่ายน้ำ / Endurance sports',
      };
    default: // mixed
      return {
        gPerKg: 1.6,
        minGrams: 1.4,
        maxGrams: 1.8,
        perMeal: 0.35,
        trainingDescription: 'ผสมกำลังและความทนไหว / Mixed strength + endurance',
      };
  }
}

export function calculateProteinIntake(input: ProteinIntakeInput): ProteinIntakeResult {
  // Validate inputs
  if (input.bodyWeightKg <= 0 || input.bodyWeightKg > 200) {
    throw new Error('Body weight must be between 1 and 200 kg');
  }

  const mealsPerDay = input.mealsPerDay || 4;
  if (mealsPerDay < 1 || mealsPerDay > 8) {
    throw new Error('Meals per day must be between 1 and 8');
  }

  const recommendation = getProteinRecommendation(input.trainingType);

  // Calculate min and max daily grams
  const minGrams = Math.round(input.bodyWeightKg * recommendation.minGrams);
  const maxGrams = Math.round(input.bodyWeightKg * recommendation.maxGrams);

  // Per meal recommendation (spread across meals)
  const perMeal = Math.round((minGrams + maxGrams) / 2 / mealsPerDay);

  return {
    bodyWeightKg: input.bodyWeightKg,
    trainingType: input.trainingType,
    recommendation: {
      ...recommendation,
      minGrams,
      maxGrams,
      perMeal,
    },
    mealsPerDay,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateProteinIntake({
  bodyWeightKg: 70,
  trainingType: 'strength',
  mealsPerDay: 5,
});

export const EXAMPLE_2 = calculateProteinIntake({
  bodyWeightKg: 65,
  trainingType: 'endurance',
  mealsPerDay: 4,
});

export const EXAMPLE_3 = calculateProteinIntake({
  bodyWeightKg: 75,
  trainingType: 'mixed',
  mealsPerDay: 6,
});
