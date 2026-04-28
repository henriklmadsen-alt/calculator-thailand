/**
 * Thai Eye Surgery Cost Estimator (คำนวณค่าผ่าตัดเลเซอร์ตา)
 *
 * Sources:
 * - Thai Ophthalmology Society (สมาคมจักษุแพทย์ไทย)
 * - Bangkok eye surgery clinic rates
 * - Ministry of Public Health eye surgery standards
 *
 * Common eye surgeries:
 * - LASIK (laser eye correction)
 * - Cataract surgery
 * - Glaucoma surgery
 * - Retinal detachment repair
 */

export type EyeSurgeryType =
  | 'lasik'
  | 'cataract'
  | 'glaucoma'
  | 'retinal'
  | 'prk'
  | 'iol';
export type FacilityType = 'government' | 'private';

export interface EyeSurgeryInput {
  surgeryType: EyeSurgeryType;
  facilityType: FacilityType;
  numberOfEyes: number; // 1 or 2
  hasEyeInsurance: boolean;
}

export interface EyeSurgeryResult {
  surgeryCost: number;
  preTestingCost: number;
  followUpVisits: number;
  totalFollowUpCost: number;
  estimatedTotalCost: number;
  insuranceCoverage: number;
  outOfPocket: number;
  surgeryType: string;
  facilityType: string;
  recoveryDaysRequired: number;
  notes: string;
}

const SURGERY_NAMES: Record<EyeSurgeryType, string> = {
  lasik: 'เลเซอร์ LASIK',
  cataract: 'ผ่าตัดต้อ',
  glaucoma: 'ผ่าตัดต้อหิน',
  retinal: 'ผ่าตัดจอประสาทตา',
  prk: 'เลเซอร์ PRK',
  iol: 'เสริมเลนส์ IOL',
};

function getSurgeryCost(
  surgeryType: EyeSurgeryType,
  facilityType: FacilityType,
  numberOfEyes: number,
): number {
  const costPerEye = facilityType === 'government'
    ? {
        lasik: 35000,
        cataract: 15000,
        glaucoma: 20000,
        retinal: 50000,
        prk: 25000,
        iol: 12000,
      }
    : {
        lasik: 120000,
        cataract: 60000,
        glaucoma: 80000,
        retinal: 150000,
        prk: 90000,
        iol: 50000,
      };

  return costPerEye[surgeryType] * numberOfEyes;
}

function getPreTestingCost(facilityType: FacilityType): number {
  return facilityType === 'government' ? 2000 : 5000;
}

function getFollowUpCost(
  surgeryType: EyeSurgeryType,
  facilityType: FacilityType,
): { visits: number; costPerVisit: number } {
  const visits =
    surgeryType === 'lasik' || surgeryType === 'prk'
      ? 4
      : surgeryType === 'cataract'
        ? 6
        : 8;
  const costPerVisit = facilityType === 'government' ? 500 : 1500;

  return { visits, costPerVisit };
}

export function calculateEyeSurgeryCost(
  input: EyeSurgeryInput,
): EyeSurgeryResult {
  const {
    surgeryType,
    facilityType,
    numberOfEyes,
    hasEyeInsurance,
  } = input;

  const surgeryCost = getSurgeryCost(surgeryType, facilityType, numberOfEyes);
  const preTestingCost = getPreTestingCost(facilityType);

  const { visits, costPerVisit } = getFollowUpCost(surgeryType, facilityType);
  const totalFollowUpCost = visits * costPerVisit;

  const estimatedTotalCost = surgeryCost + preTestingCost + totalFollowUpCost;

  // Insurance coverage typically 60-80%
  const coverageRate = hasEyeInsurance
    ? facilityType === 'government' ? 0.8 : 0.6
    : 0;
  const insuranceCoverage = Math.round(estimatedTotalCost * coverageRate);
  const outOfPocket = estimatedTotalCost - insuranceCoverage;

  const recoveryDaysRequired =
    surgeryType === 'lasik' ? 3 : surgeryType === 'prk' ? 7 : 14;

  const notes =
    surgeryType === 'lasik'
      ? 'LASIK เหมาะสำหรับคนสายตายาว-สั้น ผลลัพธ์ปรากฏใน 24 ชั่วโมง'
      : surgeryType === 'cataract'
        ? 'ต้อเป็นโรคที่เสื่อมของตา ต้องผ่าตัดเพื่อฟื้นความสามารถในการมองเห็น'
        : '';

  return {
    surgeryCost,
    preTestingCost,
    followUpVisits: visits,
    totalFollowUpCost,
    estimatedTotalCost,
    insuranceCoverage,
    outOfPocket,
    surgeryType: SURGERY_NAMES[surgeryType],
    facilityType: facilityType === 'government' ? 'โรงพยาบาลรัฐ' : 'โรงพยาบาลเอกชน',
    recoveryDaysRequired,
    notes,
  };
}
