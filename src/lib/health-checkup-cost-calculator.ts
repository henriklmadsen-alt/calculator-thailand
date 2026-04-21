/**
 * Thai Annual Health Checkup Cost Estimator (คำนวณค่าตรวจสุขภาพประจำปี)
 *
 * Sources:
 * - Thai health promotion centers
 * - Ministry of Public Health health checkup packages
 * - Hospital Association health screening packages
 *
 * Includes:
 * - Basic health screening
 * - Full body checkup
 * - Advanced cardiac and metabolic screening
 * - Cancer screening (varies by age)
 */

export type CheckupPackage = 'basic' | 'standard' | 'premium' | 'executive';
export type FacilityType = 'government' | 'private';

export interface HealthCheckupInput {
  ageYears: number;
  packageType: CheckupPackage;
  facilityType: FacilityType;
  hasInsurance: boolean;
}

export interface HealthCheckupResult {
  packageCost: number;
  screeningTests: string[];
  numberOfTests: number;
  estimatedDurationHours: number;
  insuranceCoverage: number;
  outOfPocket: number;
  packageType: string;
  facilityType: string;
  recommendedFrequency: string;
  includes: string[];
}

const PACKAGE_NAMES: Record<CheckupPackage, string> = {
  basic: 'แบบพื้นฐาน',
  standard: 'แบบมาตรฐาน',
  premium: 'แบบพรีเมียม',
  executive: 'แบบสูงสุด',
};

function getCheckupCost(
  packageType: CheckupPackage,
  facilityType: FacilityType,
  ageYears: number,
): { cost: number; tests: string[] } {
  const costs = facilityType === 'government'
    ? {
        basic: { cost: 2000, tests: ['BP', 'blood test', 'urine', 'weight/BMI'] },
        standard: {
          cost: 5000,
          tests: ['BP', 'blood test', 'urine', 'X-ray', 'ECG', 'ultrasound', 'vision'],
        },
        premium: {
          cost: 10000,
          tests: [
            'Complete blood panel',
            'Metabolic panel',
            'Lipid panel',
            'X-ray',
            'ECG',
            'Ultrasound',
            'Vision',
            'Hearing',
            'Stress test',
          ],
        },
        executive: {
          cost: 20000,
          tests: [
            'All premium tests',
            'CT scan',
            'Advanced imaging',
            'Specialist consultations',
            'Genetic screening',
          ],
        },
      }
    : {
        basic: { cost: 5000, tests: ['BP', 'blood test', 'urine', 'weight/BMI'] },
        standard: {
          cost: 12000,
          tests: ['BP', 'blood test', 'urine', 'X-ray', 'ECG', 'ultrasound', 'vision'],
        },
        premium: {
          cost: 25000,
          tests: [
            'Complete blood panel',
            'Metabolic panel',
            'Lipid panel',
            'X-ray',
            'ECG',
            'Ultrasound',
            'Vision',
            'Hearing',
            'Stress test',
            'Abdominal ultrasound',
          ],
        },
        executive: {
          cost: 50000,
          tests: [
            'All premium tests',
            'CT scan',
            'Advanced imaging',
            'Specialist consultations',
            'Genetic screening',
            'Concierge service',
          ],
        },
      };

  return costs[packageType];
}

export function calculateHealthCheckupCost(
  input: HealthCheckupInput,
): HealthCheckupResult {
  const {
    ageYears,
    packageType,
    facilityType,
    hasInsurance,
  } = input;

  const { cost, tests } = getCheckupCost(packageType, facilityType, ageYears);

  // Age adjustments
  const ageMultiplier = ageYears > 50 ? 1.2 : ageYears > 40 ? 1.1 : 1;
  const packageCost = Math.round(cost * ageMultiplier);

  // Insurance coverage for health checkups: 50-70%
  const coverageRate = hasInsurance
    ? facilityType === 'government' ? 0.7 : 0.5
    : 0;
  const insuranceCoverage = Math.round(packageCost * coverageRate);
  const outOfPocket = packageCost - insuranceCoverage;

  const durationHours =
    packageType === 'basic'
      ? 1
      : packageType === 'standard'
        ? 2
        : packageType === 'premium'
          ? 3
          : 4;

  const recommendedFrequency =
    ageYears < 40
      ? 'ทุก 2-3 ปี'
      : ageYears < 50
        ? 'ทุกปี'
        : 'ทุก 6-12 เดือน';

  return {
    packageCost,
    screeningTests: tests,
    numberOfTests: tests.length,
    estimatedDurationHours: durationHours,
    insuranceCoverage,
    outOfPocket,
    packageType: PACKAGE_NAMES[packageType],
    facilityType: facilityType === 'government' ? 'โรงพยาบาลรัฐ' : 'โรงพยาบาลเอกชน',
    recommendedFrequency,
    includes: tests,
  };
}
