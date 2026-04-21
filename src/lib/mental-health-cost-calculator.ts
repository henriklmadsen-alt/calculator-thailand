/**
 * Thai Mental Health Treatment Cost Calculator (คำนวณค่าการรักษาสุขภาพจิต)
 *
 * Sources:
 * - National Institute of Mental Health (สถาบันสุขภาพจิตแห่งชาติ)
 * - Thai Psychiatric Association
 * - Hospital mental health services rates
 */

export type TreatmentService =
  | 'counseling'
  | 'therapy'
  | 'psychiatry'
  | 'daycare'
  | 'inpatient';

export interface MentalHealthInput {
  serviceType: TreatmentService;
  sessionsPerMonth: number;
  durationMonths: number;
  facilityType: 'public' | 'private';
  requiresHospitalization: boolean;
}

export interface MentalHealthResult {
  costPerSession: number;
  monthlyCost: number;
  totalTreatmentCost: number;
  hospitalizationCost: number;
  estimatedTotalCost: number;
  governmentAssistance: number;
  outOfPocket: number;
  serviceType: string;
  notes: string;
}

function getCostPerSession(
  serviceType: TreatmentService,
  facilityType: 'public' | 'private',
): number {
  const costs = facilityType === 'public'
    ? {
        counseling: 300,
        therapy: 500,
        psychiatry: 600,
        daycare: 800,
        inpatient: 2000,
      }
    : {
        counseling: 1000,
        therapy: 1500,
        psychiatry: 2000,
        daycare: 3000,
        inpatient: 5000,
      };

  return costs[serviceType];
}

export function calculateMentalHealthCost(
  input: MentalHealthInput,
): MentalHealthResult {
  const {
    serviceType,
    sessionsPerMonth,
    durationMonths,
    facilityType,
    requiresHospitalization,
  } = input;

  const costPerSession = getCostPerSession(serviceType, facilityType);
  const monthlyCost = costPerSession * sessionsPerMonth;
  const totalTreatmentCost = monthlyCost * durationMonths;

  const hospitalizationCost = requiresHospitalization
    ? durationMonths > 1
      ? 30000 * durationMonths
      : 30000
    : 0;

  const estimatedTotalCost = totalTreatmentCost + hospitalizationCost;

  // Thai government provides assistance for mental health treatment
  const governmentAssistance = facilityType === 'public'
    ? Math.round(estimatedTotalCost * 0.5)
    : 0;
  const outOfPocket = estimatedTotalCost - governmentAssistance;

  const notes =
    serviceType === 'inpatient'
      ? 'Hospitalization usually required for acute conditions, duration 7-30 days'
      : serviceType === 'daycare'
        ? 'Partial hospitalization allows patient to return home at night'
        : 'Regular sessions help with anxiety, depression, and other mental health conditions';

  return {
    costPerSession,
    monthlyCost,
    totalTreatmentCost,
    hospitalizationCost,
    estimatedTotalCost,
    governmentAssistance,
    outOfPocket,
    serviceType: `บริการสุขภาพจิต: ${serviceType}`,
    notes,
  };
}
