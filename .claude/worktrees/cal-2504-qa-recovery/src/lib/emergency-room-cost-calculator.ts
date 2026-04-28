/**
 * Thai Emergency Room Cost Estimator (คำนวณค่าห้องฉุกเฉิน)
 *
 * Sources:
 * - Ministry of Public Health Emergency Department Tariffs
 * - Thai Hospital Association ER cost guidelines
 * - Insurance coverage standards for emergency care
 */

export type EmergencySeverity =
  | 'minor'
  | 'moderate'
  | 'serious'
  | 'critical';

export interface EmergencyRoomInput {
  severity: EmergencySeverity;
  hospitalType: 'government' | 'private';
  requiresAdmission: boolean;
  hasEmergencyInsurance: boolean;
}

export interface EmergencyRoomResult {
  registrationFee: number;
  consultationFee: number;
  treatmentFee: number;
  testsAndImaging: number;
  admissionCost: number;
  estimatedTotal: number;
  insuranceCoverage: number;
  outOfPocket: number;
  severity: string;
  averageWaitTime: string;
}

function getSeverityFees(
  severity: EmergencySeverity,
  hospitalType: 'government' | 'private',
): { consultation: number; treatment: number; imaging: number } {
  const fees = hospitalType === 'government'
    ? {
        minor: { consultation: 200, treatment: 500, imaging: 800 },
        moderate: { consultation: 300, treatment: 2000, imaging: 2000 },
        serious: { consultation: 500, treatment: 5000, imaging: 4000 },
        critical: { consultation: 800, treatment: 10000, imaging: 5000 },
      }
    : {
        minor: { consultation: 800, treatment: 2000, imaging: 3000 },
        moderate: { consultation: 1500, treatment: 6000, imaging: 5000 },
        serious: { consultation: 2500, treatment: 15000, imaging: 10000 },
        critical: { consultation: 4000, treatment: 30000, imaging: 15000 },
      };

  return fees[severity];
}

export function calculateEmergencyRoomCost(
  input: EmergencyRoomInput,
): EmergencyRoomResult {
  const {
    severity,
    hospitalType,
    requiresAdmission,
    hasEmergencyInsurance,
  } = input;

  const registrationFee = hospitalType === 'government' ? 100 : 300;
  const fees = getSeverityFees(severity, hospitalType);

  const estimatedTotal =
    registrationFee +
    fees.consultation +
    fees.treatment +
    fees.imaging +
    (requiresAdmission ? (hospitalType === 'government' ? 3000 : 10000) : 0);

  // Emergency insurance typically covers 80-90%
  const insuranceRate = hasEmergencyInsurance ? 0.85 : 0;
  const insuranceCoverage = Math.round(estimatedTotal * insuranceRate);
  const outOfPocket = estimatedTotal - insuranceCoverage;

  const severityText =
    severity === 'minor'
      ? 'Minor (cuts, sprains, headaches)'
      : severity === 'moderate'
        ? 'Moderate (fever, fractures)'
        : severity === 'serious'
          ? 'Serious (chest pain, severe bleeding)'
          : 'Critical (unconscious, severe trauma)';

  const waitTime =
    severity === 'critical' ? '5-10 นาที' : severity === 'serious'
      ? '15-30 นาที'
      : '30-60 นาที';

  return {
    registrationFee,
    consultationFee: fees.consultation,
    treatmentFee: fees.treatment,
    testsAndImaging: fees.imaging,
    admissionCost: requiresAdmission
      ? hospitalType === 'government' ? 3000 : 10000
      : 0,
    estimatedTotal,
    insuranceCoverage,
    outOfPocket,
    severity: severityText,
    averageWaitTime: waitTime,
  };
}
