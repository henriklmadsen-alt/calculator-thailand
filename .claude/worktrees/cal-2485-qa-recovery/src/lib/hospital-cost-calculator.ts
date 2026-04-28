/**
 * Thai Hospital Cost Estimator (คำนวณต้นทุนการรักษาพยาบาล)
 *
 * Sources:
 * - Thai Hospital Association (สมาคมโรงพยาบาลไทย)
 * - Comptroller General's Department — hospital tariff guidelines
 * - Public Hospital System Thailand (สถาบันสุขภาพจิตแห่งชาติ)
 * - Thai Health Insurance System data
 *
 * Estimates based on:
 * - Hospital type (government vs private)
 * - Ward type (private, semi-private, general)
 * - Daily hospital fees
 * - Common medical procedures
 * - Lab tests and imaging
 * - Medication costs
 *
 * Note: This is an estimation tool. Actual costs vary significantly by hospital,
 * procedure complexity, and individual cases.
 */

export type HospitalType = 'government' | 'private';
export type WardType = 'private' | 'semiPrivate' | 'general';
export type ProcedureType =
  | 'consultation'
  | 'minor'
  | 'moderate'
  | 'major'
  | 'veryMajor';

export interface HospitalCostInput {
  hospitalType: HospitalType;
  wardType: WardType;
  daysAdmitted: number;
  procedureType: ProcedureType;
  includeImaging: boolean;
  includeLabs: boolean;
  hasComplications: boolean;
}

export interface HospitalCostResult {
  dailyWardFee: number;
  totalWardFee: number;
  procedureFee: number;
  imagingFee: number;
  labFee: number;
  medicationFee: number;
  complicationFee: number;
  subtotal: number;
  estimatedInsuranceCoverage: number;
  estimatedOOP: number;
  hospitalType: HospitalType;
  wardType: WardType;
  wardTypeName: string;
  daysAdmitted: number;
  procedureTypeName: string;
}

const WARD_TYPE_NAMES: Record<WardType, string> = {
  private: 'ห้องส่วนตัว',
  semiPrivate: 'ห้องครึ่งตัว',
  general: 'ห้องทั่วไป',
};

const PROCEDURE_TYPE_NAMES: Record<ProcedureType, string> = {
  consultation: 'การตรวจเท่านั้น',
  minor: 'ผ่าตัดเล็ก',
  moderate: 'ผ่าตัดปานกลาง',
  major: 'ผ่าตัดใหญ่',
  veryMajor: 'ผ่าตัดใหญ่มาก',
};

const PROCEDURE_TYPE_NAMES_EN: Record<ProcedureType, string> = {
  consultation: 'Consultation only',
  minor: 'Minor procedure',
  moderate: 'Moderate procedure',
  major: 'Major surgery',
  veryMajor: 'Very major surgery',
};

/**
 * Daily ward fee varies by hospital type and ward type
 * Government hospitals are significantly cheaper than private
 */
function getDailyWardFee(hospitalType: HospitalType, wardType: WardType): number {
  if (hospitalType === 'government') {
    switch (wardType) {
      case 'private':
        return 1500; // บาท
      case 'semiPrivate':
        return 900;
      case 'general':
        return 300;
    }
  } else {
    // private hospital
    switch (wardType) {
      case 'private':
        return 4500;
      case 'semiPrivate':
        return 2500;
      case 'general':
        return 1200;
    }
  }
}

/**
 * Procedure fees based on complexity
 * Government hospitals charge based on tariff; private hospitals charge higher rates
 */
function getProcedureFee(
  hospitalType: HospitalType,
  procedureType: ProcedureType,
): number {
  if (hospitalType === 'government') {
    switch (procedureType) {
      case 'consultation':
        return 150; // Initial consultation
      case 'minor':
        return 3000;
      case 'moderate':
        return 8000;
      case 'major':
        return 15000;
      case 'veryMajor':
        return 25000;
    }
  } else {
    // private hospital — typically 2-3x higher
    switch (procedureType) {
      case 'consultation':
        return 500;
      case 'minor':
        return 10000;
      case 'moderate':
        return 25000;
      case 'major':
        return 50000;
      case 'veryMajor':
        return 80000;
    }
  }
}

/**
 * Imaging (X-ray, ultrasound, CT, MRI)
 */
function getImagingFee(hospitalType: HospitalType): number {
  if (hospitalType === 'government') {
    return 2000; // Average across imaging types
  }
  return 5000; // Private imaging is more expensive
}

/**
 * Lab tests (blood work, urinalysis, cultures, etc.)
 */
function getLabFee(hospitalType: HospitalType): number {
  if (hospitalType === 'government') {
    return 1500; // Standard lab package
  }
  return 3500; // Private lab premium
}

/**
 * Medication during hospital stay
 */
function getMedicationFee(
  hospitalType: HospitalType,
  daysAdmitted: number,
): number {
  const dailyMeds = hospitalType === 'government' ? 500 : 1500;
  return dailyMeds * daysAdmitted;
}

/**
 * Complication fee — additional charges if complications arise
 */
function getComplicationFee(
  hospitalType: HospitalType,
  procedureType: ProcedureType,
): number {
  if (hospitalType === 'government') {
    // Government hospitals: 20-30% of procedure fee
    const baseFee = getProcedureFee(hospitalType, procedureType);
    return Math.round(baseFee * 0.25);
  }
  // Private hospitals: 30-40% of procedure fee
  const baseFee = getProcedureFee(hospitalType, procedureType);
  return Math.round(baseFee * 0.35);
}

/**
 * Health insurance coverage estimate
 * Thai insurance typically covers 70-90% of hospital costs (depending on policy)
 */
function getInsuranceCoverageRate(hospitalType: HospitalType): number {
  // Government hospitals: higher coverage (~85%)
  // Private hospitals: lower coverage (~70%) or may have room charges not covered
  return hospitalType === 'government' ? 0.85 : 0.7;
}

export function calculateHospitalCost(
  input: HospitalCostInput,
): HospitalCostResult {
  const {
    hospitalType,
    wardType,
    daysAdmitted,
    procedureType,
    includeImaging,
    includeLabs,
    hasComplications,
  } = input;

  const dailyWardFee = getDailyWardFee(hospitalType, wardType);
  const totalWardFee = dailyWardFee * daysAdmitted;
  const procedureFee = getProcedureFee(hospitalType, procedureType);
  const imagingFee = includeImaging ? getImagingFee(hospitalType) : 0;
  const labFee = includeLabs ? getLabFee(hospitalType) : 0;
  const medicationFee = getMedicationFee(hospitalType, daysAdmitted);
  const complicationFee = hasComplications
    ? getComplicationFee(hospitalType, procedureType)
    : 0;

  const subtotal =
    totalWardFee +
    procedureFee +
    imagingFee +
    labFee +
    medicationFee +
    complicationFee;

  const coverageRate = getInsuranceCoverageRate(hospitalType);
  const estimatedInsuranceCoverage = Math.round(subtotal * coverageRate);
  const estimatedOOP = subtotal - estimatedInsuranceCoverage;

  return {
    dailyWardFee,
    totalWardFee,
    procedureFee,
    imagingFee,
    labFee,
    medicationFee,
    complicationFee,
    subtotal,
    estimatedInsuranceCoverage,
    estimatedOOP,
    hospitalType,
    wardType,
    wardTypeName: WARD_TYPE_NAMES[wardType],
    daysAdmitted,
    procedureTypeName: PROCEDURE_TYPE_NAMES[procedureType],
  };
}

/**
 * Compare government vs private hospital costs for the same procedure
 */
export function compareHospitalTypes(
  input: Omit<HospitalCostInput, 'hospitalType'>,
): {
  government: HospitalCostResult;
  private: HospitalCostResult;
  savings: number;
  savingsPercent: number;
} {
  const government = calculateHospitalCost({ ...input, hospitalType: 'government' });
  const privateResult = calculateHospitalCost({
    ...input,
    hospitalType: 'private',
  });

  const savings = privateResult.subtotal - government.subtotal;
  const savingsPercent =
    (savings / privateResult.subtotal) * 100;

  return {
    government,
    private: privateResult,
    savings,
    savingsPercent,
  };
}
