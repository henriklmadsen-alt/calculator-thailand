/**
 * Sport Calories Burn Calculator
 * Covers: Football (KLC-0767), Badminton (KLC-0768), and other sports
 *
 * Formula: Calories = MET × body weight (kg) × time (hours)
 * Using standardized MET values from Compendium of Physical Activities
 *
 * Sources:
 * - Compendium of Physical Activities (Ainsworth et al., 2011)
 * - Standard sports energy expenditure data
 */

export interface SportCaloriesInput {
  sport: 'football' | 'badminton'; // Sport type
  timeMinutes: number; // Duration in minutes
  bodyWeightKg: number; // Body weight in kg
}

export interface SportCaloriesResult {
  sport: string;
  sportTh: string;
  timeMinutes: number;
  bodyWeightKg: number;
  metValue: number;
  caloriesBurned: number;
  remark: string;
}

const sportData: Record<string, { en: string; th: string; met: number }> = {
  football: {
    en: 'Football / Soccer',
    th: 'ฟุตบอล',
    met: 7.0,
  },
  badminton: {
    en: 'Badminton',
    th: 'แบดมินตัน',
    met: 5.5,
  },
};

export function calculateSportCalories(input: SportCaloriesInput): SportCaloriesResult {
  // Validate inputs
  if (input.timeMinutes <= 0 || input.timeMinutes > 480) {
    throw new Error('Time must be between 1 and 480 minutes');
  }
  if (input.bodyWeightKg <= 0 || input.bodyWeightKg > 200) {
    throw new Error('Body weight must be between 1 and 200 kg');
  }
  if (!sportData[input.sport]) {
    throw new Error('Invalid sport type');
  }

  const sport = sportData[input.sport];
  const timeHours = input.timeMinutes / 60;
  const caloriesBurned = Math.round(sport.met * input.bodyWeightKg * timeHours);

  const remark = `เผาแคลอรี่ประมาณ ${caloriesBurned} แคล. ในการเล่น${sport.th}`;

  return {
    sport: input.sport,
    sportTh: sport.th,
    timeMinutes: input.timeMinutes,
    bodyWeightKg: input.bodyWeightKg,
    metValue: sport.met,
    caloriesBurned,
    remark,
  };
}

// Worked examples - Football
export const EXAMPLE_FOOTBALL_1 = calculateSportCalories({
  sport: 'football',
  timeMinutes: 90,
  bodyWeightKg: 70,
});

export const EXAMPLE_FOOTBALL_2 = calculateSportCalories({
  sport: 'football',
  timeMinutes: 60,
  bodyWeightKg: 65,
});

// Worked examples - Badminton
export const EXAMPLE_BADMINTON_1 = calculateSportCalories({
  sport: 'badminton',
  timeMinutes: 45,
  bodyWeightKg: 70,
});

export const EXAMPLE_BADMINTON_2 = calculateSportCalories({
  sport: 'badminton',
  timeMinutes: 60,
  bodyWeightKg: 75,
});

// Generic exports for both sports
export const EXAMPLE_1 = EXAMPLE_FOOTBALL_1;
export const EXAMPLE_2 = EXAMPLE_FOOTBALL_2;
export const EXAMPLE_3 = EXAMPLE_BADMINTON_1;
