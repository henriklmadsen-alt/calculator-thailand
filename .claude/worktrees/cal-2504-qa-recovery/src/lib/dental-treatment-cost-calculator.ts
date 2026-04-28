/**
 * Thai Dental Treatment Cost Estimator (คำนวณค่าฟันและจัดฟัน)
 *
 * Sources:
 * - Thai Dental Association (สมาคมทันตแพทย์ไทย) fee schedule
 * - Ministry of Public Health dental tariffs
 * - Private dental clinic average rates
 *
 * Includes:
 * - Cleanings and checkups
 * - Fillings and extractions
 * - Root canals
 * - Dental implants and bridges
 * - Orthodontics (braces)
 */

export type TreatmentType =
  | 'cleaning'
  | 'filling'
  | 'extraction'
  | 'rootCanal'
  | 'implant'
  | 'crown'
  | 'braces';
export type ClinicType = 'government' | 'private';

export interface DentalCostInput {
  treatmentType: TreatmentType;
  clinicType: ClinicType;
  numberOfTeeth: number; // For treatments affecting multiple teeth
  hasDentalInsurance: boolean;
}

export interface DentalCostResult {
  baseCost: number;
  estimatedTotalCost: number;
  insuranceCoverage: number;
  outOfPocket: number;
  treatmentType: string;
  clinicType: string;
  durationMonths: number;
  notes: string;
}

const TREATMENT_NAMES: Record<TreatmentType, string> = {
  cleaning: 'ทำความสะอาดฟัน',
  filling: 'อุดฟัน',
  extraction: 'ถอนฟัน',
  rootCanal: 'รักษาราก',
  implant: 'ปลูกฟัน',
  crown: 'ครอบฟัน',
  braces: 'จัดฟัน',
};

function getTreatmentCost(
  treatmentType: TreatmentType,
  clinicType: ClinicType,
  numberOfTeeth: number = 1,
): { baseCost: number; durationMonths: number } {
  if (clinicType === 'government') {
    switch (treatmentType) {
      case 'cleaning':
        return { baseCost: 300, durationMonths: 0 };
      case 'filling':
        return { baseCost: 500 * numberOfTeeth, durationMonths: 0 };
      case 'extraction':
        return { baseCost: 600 * numberOfTeeth, durationMonths: 0 };
      case 'rootCanal':
        return { baseCost: 2000 * numberOfTeeth, durationMonths: 2 };
      case 'implant':
        return { baseCost: 15000 * numberOfTeeth, durationMonths: 6 };
      case 'crown':
        return { baseCost: 3000 * numberOfTeeth, durationMonths: 1 };
      case 'braces':
        return { baseCost: 20000, durationMonths: 24 };
    }
  } else {
    // Private clinic
    switch (treatmentType) {
      case 'cleaning':
        return { baseCost: 1000, durationMonths: 0 };
      case 'filling':
        return { baseCost: 2000 * numberOfTeeth, durationMonths: 0 };
      case 'extraction':
        return { baseCost: 2500 * numberOfTeeth, durationMonths: 0 };
      case 'rootCanal':
        return { baseCost: 6000 * numberOfTeeth, durationMonths: 2 };
      case 'implant':
        return { baseCost: 40000 * numberOfTeeth, durationMonths: 6 };
      case 'crown':
        return { baseCost: 12000 * numberOfTeeth, durationMonths: 1 };
      case 'braces':
        return { baseCost: 80000, durationMonths: 24 };
    }
  }
}

export function calculateDentalCost(
  input: DentalCostInput,
): DentalCostResult {
  const {
    treatmentType,
    clinicType,
    numberOfTeeth,
    hasDentalInsurance,
  } = input;

  const { baseCost, durationMonths } = getTreatmentCost(
    treatmentType,
    clinicType,
    numberOfTeeth,
  );

  // For multi-month treatments, add monthly care costs
  const estimatedTotalCost = baseCost +
    (durationMonths > 0 ? baseCost * 0.1 * durationMonths : 0);

  // Dental insurance typically covers 50-70%
  const coverageRate = hasDentalInsurance
    ? clinicType === 'government' ? 0.7 : 0.5
    : 0;
  const insuranceCoverage = Math.round(estimatedTotalCost * coverageRate);
  const outOfPocket = estimatedTotalCost - insuranceCoverage;

  const notes =
    treatmentType === 'braces'
      ? 'จัดฟันใช้เวลา 18-24 เดือน ต้องติดตามเยี่ยมแพทย์ทุก 4-6 สัปดาห์'
      : treatmentType === 'implant'
        ? 'ปลูกฟันสามารถใช้ได้นาน 10-15 ปี หากดูแลรักษาอย่างดี'
        : '';

  return {
    baseCost,
    estimatedTotalCost,
    insuranceCoverage,
    outOfPocket,
    treatmentType: TREATMENT_NAMES[treatmentType],
    clinicType: clinicType === 'government' ? 'คลินิกรัฐ' : 'คลินิกเอกชน',
    durationMonths,
    notes,
  };
}
