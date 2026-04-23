/**
 * TDEE for Athletes Calculator (TDEE สำหรับนักกีฬา)
 *
 * Formula: TDEE = BMR × Activity Factor
 * BMR (Basal Metabolic Rate) = Mifflin-St Jeor formula
 * Activity Factor adjusted for training type
 *
 * Sources:
 * - Mifflin, M.D. et al. (1990) "A new predictive equation for resting energy expenditure in healthy individuals"
 * - American Journal of Clinical Nutrition
 *
 * Calculates:
 * - Basal Metabolic Rate (BMR)
 * - Total Daily Energy Expenditure (TDEE)
 * - Calorie recommendations for goals (bulk, maintain, cut)
 */

export interface TDEEInput {
  bodyWeightKg: number; // Body weight in kg
  heightCm: number; // Height in cm
  age: number; // Age in years
  gender: 'male' | 'female'; // Gender
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive'; // Activity level
}

export interface ActivityLevel {
  name: string;
  nameTh: string;
  factor: number;
  description: string;
}

export interface TDEEResult {
  bodyWeightKg: number;
  bmr: number;
  tdee: number;
  activityMultiplier: number;
  calorieRecommendations: {
    bulk: number;
    maintain: number;
    cut: number;
  };
}

const activityLevels: Record<string, ActivityLevel> = {
  sedentary: {
    name: 'Sedentary',
    nameTh: 'ไม่ออกกำลังกาย',
    factor: 1.2,
    description: 'Little or no exercise',
  },
  light: {
    name: 'Light',
    nameTh: 'เบา',
    factor: 1.375,
    description: 'Light exercise 1-3 days/week',
  },
  moderate: {
    name: 'Moderate',
    nameTh: 'ปานกลาง',
    factor: 1.55,
    description: 'Moderate exercise 3-5 days/week',
  },
  active: {
    name: 'Active',
    nameTh: 'ออกกำลังกาย',
    factor: 1.725,
    description: 'Heavy exercise 6-7 days/week',
  },
  veryActive: {
    name: 'Very Active',
    nameTh: 'ออกกำลังกายมาก',
    factor: 1.9,
    description: 'Very heavy exercise or athletic training',
  },
};

/**
 * Calculate BMR using Mifflin-St Jeor formula
 * More accurate than older Harris-Benedict formula
 */
function calculateBMR(
  bodyWeightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female'
): number {
  let bmr: number;

  if (gender === 'male') {
    // BMR = (10 × weight) + (6.25 × height) - (5 × age) + 5
    bmr = 10 * bodyWeightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    // BMR = (10 × weight) + (6.25 × height) - (5 × age) - 161
    bmr = 10 * bodyWeightKg + 6.25 * heightCm - 5 * age - 161;
  }

  return Math.round(bmr);
}

export function calculateTDEE(input: TDEEInput): TDEEResult {
  // Validate inputs
  if (input.bodyWeightKg <= 0 || input.bodyWeightKg > 200) {
    throw new Error('Body weight must be between 1 and 200 kg');
  }
  if (input.heightCm <= 0 || input.heightCm > 300) {
    throw new Error('Height must be between 1 and 300 cm');
  }
  if (input.age <= 0 || input.age > 120) {
    throw new Error('Age must be between 1 and 120 years');
  }

  const bmr = calculateBMR(input.bodyWeightKg, input.heightCm, input.age, input.gender);
  const activityFactor = activityLevels[input.activityLevel].factor;
  const tdee = Math.round(bmr * activityFactor);

  return {
    bodyWeightKg: input.bodyWeightKg,
    bmr,
    tdee,
    activityMultiplier: activityFactor,
    calorieRecommendations: {
      bulk: Math.round(tdee + 300), // +300 cal surplus for muscle building
      maintain: tdee,
      cut: Math.round(tdee - 500), // -500 cal deficit for fat loss
    },
  };
}

// Worked examples
export const EXAMPLE_1 = calculateTDEE({
  bodyWeightKg: 75,
  heightCm: 180,
  age: 30,
  gender: 'male',
  activityLevel: 'active',
});

export const EXAMPLE_2 = calculateTDEE({
  bodyWeightKg: 65,
  heightCm: 165,
  age: 25,
  gender: 'female',
  activityLevel: 'moderate',
});

export const EXAMPLE_3 = calculateTDEE({
  bodyWeightKg: 80,
  heightCm: 175,
  age: 40,
  gender: 'male',
  activityLevel: 'light',
});
