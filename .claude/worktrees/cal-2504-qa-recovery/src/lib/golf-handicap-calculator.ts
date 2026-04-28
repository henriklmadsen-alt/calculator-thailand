/**
 * Golf Handicap Index Calculator (แฮนดิแคปกอล์ฟ)
 *
 * Formula: WHS (World Handicap System)
 * Score Differential = (Gross Score - Adjusted Course Rating) × 113 / Slope Rating
 * Handicap Index = Average of best 8 of last 20 score differentials
 *
 * Sources:
 * - R&A/USGA World Handicap System (2020)
 * - Thailand Golf Association (adapted WHS)
 *
 * Calculates:
 * - Golf handicap index from recent scores
 * - Player classification
 */

export interface GolfHandicapInput {
  courseName: string; // Golf course name
  courseRating: number; // Course rating (slope-independent difficulty)
  slopeRating: number; // Slope rating (113 = standard)
  grossScore: number; // Gross score for this round
}

export interface GolfScoreDifferential {
  courseName: string;
  grossScore: number;
  scoreDifferential: number;
}

export interface GolfHandicapResult {
  lastScoreDifferential: number;
  averageOf8Best: number;
  handicapIndex: number;
  skillLevel: string;
  skillLevelTh: string;
  remark: string;
}

/**
 * Calculate score differential: (Gross - Course Rating) × 113 / Slope
 */
function calculateScoreDifferential(
  grossScore: number,
  courseRating: number,
  slopeRating: number
): number {
  return Math.round(((grossScore - courseRating) * 113 / slopeRating) * 10) / 10;
}

/**
 * Get skill classification
 */
function getSkillLevel(handicap: number): { level: string; levelTh: string } {
  if (handicap < 0) return { level: 'Scratch', levelTh: 'มืออาชีพ' };
  if (handicap <= 5) return { level: 'Expert', levelTh: 'ระดับเชี่ยวชาญ' };
  if (handicap <= 12) return { level: 'Intermediate', levelTh: 'ระดับกลาง' };
  if (handicap <= 18) return { level: 'Beginner', levelTh: 'ระดับเริ่มต้น' };
  return { level: 'Novice', levelTh: 'ระดับน้อย' };
}

export function calculateGolfHandicap(
  scoreHistory: GolfHandicapInput[],
  latestScore: GolfHandicapInput
): GolfHandicapResult {
  // Validate inputs
  if (!latestScore || latestScore.grossScore < 0 || latestScore.grossScore > 150) {
    throw new Error('Gross score must be between 0 and 150');
  }
  if (latestScore.courseRating <= 0 || latestScore.courseRating > 80) {
    throw new Error('Course rating must be between 0 and 80');
  }
  if (latestScore.slopeRating <= 0 || latestScore.slopeRating > 155) {
    throw new Error('Slope rating must be between 0 and 155');
  }

  // Calculate differentials
  const allDifferentials = scoreHistory.map((score) =>
    calculateScoreDifferential(score.grossScore, score.courseRating, score.slopeRating)
  );

  // Add latest score
  const latestDifferential = calculateScoreDifferential(
    latestScore.grossScore,
    latestScore.courseRating,
    latestScore.slopeRating
  );
  allDifferentials.push(latestDifferential);

  // Sort ascending and take best 8 (if we have 20+)
  allDifferentials.sort((a, b) => a - b);
  const numberToUse = Math.min(8, Math.ceil(allDifferentials.length / 2.5)); // WHS rule
  const best8Average = Math.round(
    (allDifferentials.slice(0, numberToUse).reduce((a, b) => a + b, 0) / numberToUse) * 10
  ) / 10;

  // Apply WHS adjustment factor (0.93)
  const handicapIndex = Math.round(best8Average * 0.93 * 10) / 10;

  const { level, levelTh } = getSkillLevel(handicapIndex);

  const remark =
    handicapIndex < 0
      ? 'ระดับกอล์ฟระดับแข่งขัน'
      : handicapIndex <= 12
        ? 'กำลังเล่นดี ใกล้ระดับเชี่ยวชาญ'
        : handicapIndex <= 18
          ? 'เล่นได้ระดับสนามหลัก'
          : 'ยังต้องฝึกเพื่อปรับปรุง';

  return {
    lastScoreDifferential: latestDifferential,
    averageOf8Best: best8Average,
    handicapIndex,
    skillLevel: level,
    skillLevelTh: levelTh,
    remark,
  };
}

// Worked examples
export const EXAMPLE_1 = calculateGolfHandicap(
  [
    {
      courseName: 'Thai Country Club',
      courseRating: 72.5,
      slopeRating: 130,
      grossScore: 82,
    },
  ],
  {
    courseName: 'Thai Country Club',
    courseRating: 72.5,
    slopeRating: 130,
    grossScore: 85,
  }
);

export const EXAMPLE_2 = calculateGolfHandicap(
  [],
  {
    courseName: 'Royal Bangkok',
    courseRating: 73,
    slopeRating: 135,
    grossScore: 88,
  }
);

export const EXAMPLE_3 = calculateGolfHandicap(
  [
    {
      courseName: 'Black Mountain',
      courseRating: 74,
      slopeRating: 140,
      grossScore: 90,
    },
  ],
  {
    courseName: 'Black Mountain',
    courseRating: 74,
    slopeRating: 140,
    grossScore: 87,
  }
);
