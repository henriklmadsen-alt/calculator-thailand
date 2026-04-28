/**
 * Thai Gym & Fitness Membership ROI Calculator (คำนวณค่าฟิตเนส)
 *
 * Sources:
 * - Bangkok fitness center price surveys
 * - Fitness program effectiveness data
 * - Health outcome studies
 */

export type MembershipType = 'monthly' | 'quarterly' | 'yearly' | 'classpack';

export interface GymFitnessInput {
  membershipType: MembershipType;
  monthlyPrice: number;
  attendanceTimesPerWeek: number;
  durationMonths: number;
}

export interface GymFitnessResult {
  totalCost: number;
  costPerVisit: number;
  estimatedVisits: number;
  breakEvenMonths: number;
  healthBenefit: string;
  roi: number;
  recommendation: string;
}

export function calculateGymFitnessROI(
  input: GymFitnessInput,
): GymFitnessResult {
  const {
    membershipType,
    monthlyPrice,
    attendanceTimesPerWeek,
    durationMonths,
  } = input;

  const totalCost = monthlyPrice * durationMonths;
  const estimatedVisits = attendanceTimesPerWeek * 4.33 * durationMonths;
  const costPerVisit = Math.round(totalCost / estimatedVisits);

  // Break-even: cost per visit becomes competitive (~100-150 baht per session)
  const breakEvenMonths = Math.ceil((monthlyPrice * 4.33) / 100);

  const healthBenefit =
    attendanceTimesPerWeek >= 3
      ? 'High - Significant health improvements expected'
      : attendanceTimesPerWeek >= 2
        ? 'Moderate - Good health benefits'
        : 'Low - Minimal health improvements';

  // ROI in terms of health investment
  // Assuming health value = reduced medical costs + improved quality of life
  const healthValue = durationMonths >= 6 ? totalCost * 1.5 : totalCost * 0.8;
  const roi = Math.round(((healthValue - totalCost) / totalCost) * 100);

  const recommendation =
    attendanceTimesPerWeek >= 3 && durationMonths >= 6
      ? 'Excellent investment - Continue membership'
      : attendanceTimesPerWeek < 1
        ? 'Poor ROI - Consider lower-cost options or discipline improvement'
        : 'Fair ROI - Increase frequency for better value';

  return {
    totalCost,
    costPerVisit,
    estimatedVisits: Math.round(estimatedVisits),
    breakEvenMonths,
    healthBenefit,
    roi,
    recommendation,
  };
}
