/**
 * Thai Driver License Renewal Cost Calculator (คำนวณค่าต่อใบขับขี่)
 *
 * Sources:
 * - Land Transportation Office (สำนักการขนส่งทางบก)
 * - Royal Decree on Rules and Procedures for Driving
 * - Driver License Fee Schedule 2024/2025
 *
 * Covers:
 * - Standard driver license renewal (5-year, 10-year)
 * - License replacement (lost, damaged)
 * - Service types: in-person, online application
 * - Rush service option (expedited processing)
 *
 * Note: Fees vary by license type, duration, and service type.
 * Always verify with the Land Transportation Office.
 */

export type LicenseType = 'car' | 'motorcycle' | 'truck';
export type LicenseDuration = '5year' | '10year';
export type ServiceType = 'standard' | 'rush' | 'replacement' | 'online';

export interface DriverLicenseRenewalInput {
  licenseType: LicenseType;
  licenseDuration: LicenseDuration;
  serviceType: ServiceType;
  needsPhotoUpdate: boolean;
  needsBiometricUpdate: boolean;
}

export interface DriverLicenseRenewalResult {
  licenseType: LicenseType;
  licenseTypeName: string;
  licenseDuration: LicenseDuration;
  durationYears: number;
  serviceType: ServiceType;
  serviceTypeName: string;
  needsPhotoUpdate: boolean;
  needsBiometricUpdate: boolean;

  // Base renewal fee
  baseLicenseFee: number;

  // Additional services
  photoUpdateFee: number;
  biometricUpdateFee: number;
  rushServiceFee: number;
  replacementSurcharge: number;

  // Summary
  subtotal: number;
  total: number;
  processingTime: string;
}

const LICENSE_TYPE_NAMES: Record<LicenseType, string> = {
  car: 'ใบขับขี่ปกติ - รถยนต์ (Car License)',
  motorcycle: 'ใบขับขี่ปกติ - จักรยานยนต์ (Motorcycle License)',
  truck: 'ใบขับขี่ปกติ - รถบรรทุก (Truck License)',
};

const SERVICE_TYPE_NAMES: Record<ServiceType, string> = {
  standard: 'Standard Renewal (ต่อปกติ)',
  rush: 'Rush Renewal (บริการด่วน)',
  replacement: 'Replacement License (ต่อแบบสูญหาย)',
  online: 'Online Application (ยื่นออนไลน์)',
};

/**
 * Base Driver License Renewal Fee
 * Source: Land Transportation Office 2024
 * - Car 5-year: 225 THB
 * - Car 10-year: 450 THB
 * - Motorcycle 5-year: 200 THB
 * - Motorcycle 10-year: 400 THB
 * - Truck 5-year: 325 THB
 * - Truck 10-year: 650 THB
 */
function getBaseLicenseFee(licenseType: LicenseType, licenseDuration: LicenseDuration): number {
  const fees: Record<LicenseType, Record<LicenseDuration, number>> = {
    car: {
      '5year': 225,
      '10year': 450,
    },
    motorcycle: {
      '5year': 200,
      '10year': 400,
    },
    truck: {
      '5year': 325,
      '10year': 650,
    },
  };
  return fees[licenseType][licenseDuration];
}

/**
 * Photo Update Fee
 * Biometric photo update: 50 THB
 */
function getPhotoUpdateFee(): number {
  return 50;
}

/**
 * Biometric Update Fee
 * Biometric data (fingerprints): 100 THB
 */
function getBiometricUpdateFee(): number {
  return 100;
}

/**
 * Rush Service Fee
 * Expedited processing (same day/next day): 200 THB
 */
function getRushServiceFee(): number {
  return 200;
}

/**
 * Replacement Surcharge
 * For lost/damaged license: 50 THB additional
 */
function getReplacementSurcharge(): number {
  return 50;
}

export function calculateDriverLicenseRenewal(
  input: DriverLicenseRenewalInput,
): DriverLicenseRenewalResult {
  const baseFee = getBaseLicenseFee(input.licenseType, input.licenseDuration);
  const photoFee = input.needsPhotoUpdate ? getPhotoUpdateFee() : 0;
  const biometricFee = input.needsBiometricUpdate ? getBiometricUpdateFee() : 0;
  const rushFee = input.serviceType === 'rush' ? getRushServiceFee() : 0;
  const replacementFee = input.serviceType === 'replacement' ? getReplacementSurcharge() : 0;

  const subtotal = baseFee + photoFee + biometricFee + rushFee + replacementFee;

  // Determine processing time
  let processingTime = '3-7 วันทำการ';
  if (input.serviceType === 'rush') processingTime = '1 วันทำการ (เดียวกัน)';
  if (input.serviceType === 'online') processingTime = '5-10 วันทำการ (จัดส่ง)';

  const durationYears = input.licenseDuration === '5year' ? 5 : 10;

  return {
    licenseType: input.licenseType,
    licenseTypeName: LICENSE_TYPE_NAMES[input.licenseType],
    licenseDuration: input.licenseDuration,
    durationYears,
    serviceType: input.serviceType,
    serviceTypeName: SERVICE_TYPE_NAMES[input.serviceType],
    needsPhotoUpdate: input.needsPhotoUpdate,
    needsBiometricUpdate: input.needsBiometricUpdate,
    baseLicenseFee: Math.round(baseFee),
    photoUpdateFee: Math.round(photoFee),
    biometricUpdateFee: Math.round(biometricFee),
    rushServiceFee: Math.round(rushFee),
    replacementSurcharge: Math.round(replacementFee),
    subtotal: Math.round(subtotal),
    total: Math.round(subtotal),
    processingTime,
  };
}

/**
 * Worked Example 1: Standard Car License Renewal (5-year)
 * Basic renewal, no additional services
 */
export const EXAMPLE_1 = calculateDriverLicenseRenewal({
  licenseType: 'car',
  licenseDuration: '5year',
  serviceType: 'standard',
  needsPhotoUpdate: false,
  needsBiometricUpdate: false,
});

/**
 * Worked Example 2: Car License Renewal (10-year) with Photo Update
 * Full biometric update for new license format
 */
export const EXAMPLE_2 = calculateDriverLicenseRenewal({
  licenseType: 'car',
  licenseDuration: '10year',
  serviceType: 'standard',
  needsPhotoUpdate: true,
  needsBiometricUpdate: true,
});

/**
 * Worked Example 3: Motorcycle License Rush Renewal
 * Quick processing, same-day service
 */
export const EXAMPLE_3 = calculateDriverLicenseRenewal({
  licenseType: 'motorcycle',
  licenseDuration: '5year',
  serviceType: 'rush',
  needsPhotoUpdate: true,
  needsBiometricUpdate: false,
});
