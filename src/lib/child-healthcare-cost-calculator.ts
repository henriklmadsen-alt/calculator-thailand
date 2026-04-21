/**
 * Thai Child Healthcare Cost Calculator (คำนวณค่าเลี้ยงดูสุขภาพเด็ก)
 *
 * Sources:
 * - Ministry of Public Health child health guidelines
 * - Thai Pediatric Society cost estimates
 * - Healthcare expenditure surveys
 */

export interface ChildHealthcareInput {
  ageYears: number;
  facilityType: 'government' | 'private';
  hasHealthInsurance: boolean;
}

export interface ChildHealthcareResult {
  annualCheckups: number;
  checkupCost: number;
  vaccinationCost: number;
  dentalCost: number;
  emergencyCost: number;
  estimatedAnnualCost: number;
  insuranceCoverage: number;
  outOfPocket: number;
  ageGroup: string;
  preventiveRoles: string[];
}

function getAnnualCheckups(ageYears: number): number {
  if (ageYears < 1) return 6; // Infant
  if (ageYears < 3) return 4;
  if (ageYears < 6) return 2;
  return 1;
}

function getCheckupCost(
  ageYears: number,
  facilityType: 'government' | 'private',
): number {
  const baseCost = facilityType === 'government' ? 300 : 1000;
  const ageMultiplier = ageYears < 1 ? 1.5 : 1;
  return baseCost * ageMultiplier;
}

export function calculateChildHealthcareCost(
  input: ChildHealthcareInput,
): ChildHealthcareResult {
  const {
    ageYears,
    facilityType,
    hasHealthInsurance,
  } = input;

  const annualCheckups = getAnnualCheckups(ageYears);
  const checkupCost = getCheckupCost(ageYears, facilityType) * annualCheckups;

  // Vaccination costs vary by age
  const vaccinationCost = facilityType === 'government' ? 2000 : 5000;

  // Dental care (starts around age 2-3)
  const dentalCost = ageYears > 2 ? (facilityType === 'government' ? 800 : 2000) : 0;

  // Estimated emergency/unscheduled visits
  const emergencyCost = facilityType === 'government' ? 1000 : 3000;

  const estimatedAnnualCost = checkupCost + vaccinationCost + dentalCost + emergencyCost;

  // Insurance typically covers 60-80% for child healthcare
  const insuranceRate = hasHealthInsurance ? 0.7 : 0;
  const insuranceCoverage = Math.round(estimatedAnnualCost * insuranceRate);
  const outOfPocket = estimatedAnnualCost - insuranceCoverage;

  const ageGroup = ageYears < 1
    ? 'Infant (0-1 years)'
    : ageYears < 3
      ? 'Toddler (1-3 years)'
      : ageYears < 6
        ? 'Preschool (3-6 years)'
        : 'School age (6+ years)';

  const preventiveRoles = [
    'Regular checkups every 3-6 months',
    'Up-to-date vaccinations',
    'Dental care starting age 2-3',
    'Nutrition counseling',
    'Development screening',
  ];

  return {
    annualCheckups,
    checkupCost,
    vaccinationCost,
    dentalCost,
    emergencyCost,
    estimatedAnnualCost,
    insuranceCoverage,
    outOfPocket,
    ageGroup,
    preventiveRoles,
  };
}
