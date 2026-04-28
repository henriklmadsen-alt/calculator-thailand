/**
 * Thai Physical Therapy Cost Calculator (คำนวณค่ากายภาพบำบัด)
 *
 * Sources:
 * - Thai Physical Therapy Association
 * - Hospital physical therapy rates
 * - Ministry of Public Health standards
 */

export type TherapyType =
  | 'general'
  | 'rehabilitation'
  | 'sports'
  | 'postSurgery'
  | 'chronic';

export interface PhysicalTherapyCostInput {
  therapyType: TherapyType;
  sessionsPerWeek: number;
  durationWeeks: number;
  facilityType: 'hospital' | 'clinic';
  hasInsurance: boolean;
}

export interface PhysicalTherapyResult {
  costPerSession: number;
  totalSessions: number;
  totalCost: number;
  averageWeeklyCost: number;
  insuranceCoverage: number;
  outOfPocket: number;
  therapyType: string;
  recommendedDuration: string;
}

function getCostPerSession(
  therapyType: TherapyType,
  facilityType: 'hospital' | 'clinic',
): number {
  const costs = facilityType === 'hospital'
    ? {
        general: 500,
        rehabilitation: 600,
        sports: 700,
        postSurgery: 700,
        chronic: 500,
      }
    : {
        general: 800,
        rehabilitation: 1000,
        sports: 1200,
        postSurgery: 1100,
        chronic: 800,
      };

  return costs[therapyType];
}

export function calculatePhysicalTherapyCost(
  input: PhysicalTherapyCostInput,
): PhysicalTherapyResult {
  const {
    therapyType,
    sessionsPerWeek,
    durationWeeks,
    facilityType,
    hasInsurance,
  } = input;

  const costPerSession = getCostPerSession(therapyType, facilityType);
  const totalSessions = sessionsPerWeek * durationWeeks;
  const totalCost = costPerSession * totalSessions;

  const insuranceRate = hasInsurance ? 0.6 : 0;
  const insuranceCoverage = Math.round(totalCost * insuranceRate);
  const outOfPocket = totalCost - insuranceCoverage;

  const averageWeeklyCost = costPerSession * sessionsPerWeek;

  const recommendedDuration =
    therapyType === 'postSurgery'
      ? '4-8 สัปดาห์'
      : therapyType === 'sports'
        ? '2-4 สัปดาห์'
        : '6-12 สัปดาห์';

  return {
    costPerSession,
    totalSessions,
    totalCost,
    averageWeeklyCost,
    insuranceCoverage,
    outOfPocket,
    therapyType: `กายภาพบำบัด: ${therapyType}`,
    recommendedDuration,
  };
}
