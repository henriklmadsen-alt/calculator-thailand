/**
 * Thai Passport Fee Calculator
 * Source: กรมการกงสุล กระทรวงการต่างประเทศ (Department of Consular Affairs, MFA)
 * Updated: April 2026
 *
 * Fee schedule:
 * - หนังสือเดินทางธรรมดา (อายุ 5 ปี): 1,000 บาท
 * - หนังสือเดินทางธรรมดา (อายุ 10 ปี): 1,500 บาท
 * - บริการด่วน (รับเล่มภายใน 1 วันทำการ): +1,000 บาท
 * - ผู้เยาว์ (อายุต่ำกว่า 20 ปี): ได้เฉพาะเล่ม 5 ปี
 */

export type PassportValidity = '5year' | '10year';
export type ServiceSpeed = 'regular' | 'express';
export type ApplicantType = 'adult' | 'minor';
export type ApplicationType = 'first_time' | 'renewal';

export interface PassportFeeInput {
  applicantType: ApplicantType;
  applicationType: ApplicationType;
  validity: PassportValidity;
  serviceSpeed: ServiceSpeed;
}

export interface PassportFeeResult {
  baseFee: number;
  expressSurcharge: number;
  totalFee: number;
  validity: PassportValidity;
  serviceSpeed: ServiceSpeed;
  applicantType: ApplicantType;
  applicationType: ApplicationType;
  processingDays: string;
  validityYears: number;
}

const BASE_FEES: Record<PassportValidity, number> = {
  '5year': 1000,
  '10year': 1500,
};

const EXPRESS_SURCHARGE = 1000;

export function calculatePassportFee(input: PassportFeeInput): PassportFeeResult {
  // Minors can only get 5-year passport
  const validity: PassportValidity = input.applicantType === 'minor' ? '5year' : input.validity;

  const baseFee = BASE_FEES[validity];
  const expressSurcharge = input.serviceSpeed === 'express' ? EXPRESS_SURCHARGE : 0;
  const totalFee = baseFee + expressSurcharge;

  const processingDays = input.serviceSpeed === 'express' ? '1 วันทำการ' : '2-3 วันทำการ';
  const validityYears = validity === '5year' ? 5 : 10;

  return {
    baseFee,
    expressSurcharge,
    totalFee,
    validity,
    serviceSpeed: input.serviceSpeed,
    applicantType: input.applicantType,
    applicationType: input.applicationType,
    processingDays,
    validityYears,
  };
}

/** Required documents checklist */
export interface DocumentItem {
  label: string;
  required: boolean;
}

export function getRequiredDocuments(
  applicantType: ApplicantType,
  applicationType: ApplicationType
): DocumentItem[] {
  const common: DocumentItem[] = [
    { label: 'บัตรประจำตัวประชาชน (ตัวจริง)', required: true },
    { label: 'ทะเบียนบ้าน (ตัวจริง)', required: true },
  ];

  if (applicationType === 'renewal') {
    common.push({ label: 'หนังสือเดินทางเล่มเดิม', required: true });
  }

  if (applicationType === 'first_time') {
    common.push({ label: 'สูติบัตร (กรณีไม่มีข้อมูลในฐานทะเบียนราษฎร์)', required: false });
  }

  if (applicantType === 'minor') {
    common.push(
      { label: 'สูติบัตร (ตัวจริง)', required: true },
      { label: 'บัตรประจำตัวประชาชนบิดาและมารดา (ตัวจริง)', required: true },
      { label: 'หนังสือยินยอมจากบิดาและมารดา (กรณีไม่ได้มาด้วย)', required: true },
      { label: 'ใบเปลี่ยนชื่อ-สกุล (ถ้ามี)', required: false }
    );
  } else {
    common.push({ label: 'ใบเปลี่ยนชื่อ-สกุล (ถ้ามี)', required: false });
  }

  return common;
}
