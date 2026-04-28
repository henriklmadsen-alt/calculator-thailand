/**
 * Thai Vehicle Tax Calculator (คำนวณค่าภาษีรถยนต์ประจำปี)
 *
 * Sources:
 * - กรมการขนส่งทางบก (DLT) — annual vehicle tax rates
 * - พ.ร.บ.คุ้มครองผู้ประสบภัยจากรถ พ.ศ. 2535 — compulsory insurance premiums
 *
 * Sedan (≤7 seats): tax by engine CC
 *   1–600 cc      → 0.50 THB/cc
 *   601–1,800 cc  → 1.50 THB/cc
 *   1,801+ cc     → 4.00 THB/cc
 *
 * Pickup/truck (by weight):
 *   0–500 kg      → 300 THB
 *   501–750 kg    → 450 THB
 *   751–1,000 kg  → 600 THB
 *   1,001–1,250 kg → 750 THB
 *   1,251–1,500 kg → 900 THB
 *   1,501–1,750 kg → 1,050 THB
 *   1,751–2,000 kg → 1,350 THB
 *   2,001–2,500 kg → 1,650 THB
 *   2,501–3,000 kg → 1,950 THB
 *
 * Motorcycle: 100 THB flat
 *
 * Age discount (sedan only, from registration year):
 *   Year 6  → 10%
 *   Year 7  → 20%
 *   Year 8  → 30%
 *   Year 9  → 40%
 *   Year 10+ → 50%
 */

export type VehicleType = 'car' | 'pickup' | 'motorcycle';

export interface VehicleTaxInput {
  vehicleType: VehicleType;
  engineCC: number;        // for car & motorcycle
  weightKg: number;        // for pickup
  vehicleAge: number;      // years since first registration
}

export interface VehicleTaxResult {
  vehicleType: VehicleType;
  baseTax: number;         // ภาษีรถยนต์ก่อนลด
  ageDiscountPercent: number;
  ageDiscount: number;
  annualTax: number;       // ภาษีรถยนต์หลังลด
  prbInsurance: number;    // พ.ร.บ.
  inspectionFee: number;   // ค่าตรวจสภาพ (if applicable)
  totalCost: number;       // ภาษี + พ.ร.บ. + ค่าตรวจสภาพ
}

/** Calculate base tax for sedan/car (≤7 seats) by engine CC */
function calcCarTax(cc: number): number {
  if (cc <= 0) return 0;
  if (cc <= 600) return cc * 0.5;
  if (cc <= 1800) return cc * 1.5;
  return cc * 4.0;
}

/** Calculate tax for pickup/truck by weight (kg) */
function calcPickupTax(weightKg: number): number {
  if (weightKg <= 0) return 0;
  if (weightKg <= 500) return 300;
  if (weightKg <= 750) return 450;
  if (weightKg <= 1000) return 600;
  if (weightKg <= 1250) return 750;
  if (weightKg <= 1500) return 900;
  if (weightKg <= 1750) return 1050;
  if (weightKg <= 2000) return 1350;
  if (weightKg <= 2500) return 1650;
  if (weightKg <= 3000) return 1950;
  // Over 3,000 kg — extrapolate at 450 per 500kg bracket
  return 1950 + Math.ceil((weightKg - 3000) / 500) * 450;
}

/** Age-based discount (applies to cars only) */
function getAgeDiscount(vehicleAge: number): number {
  if (vehicleAge >= 10) return 0.50;
  if (vehicleAge >= 9) return 0.40;
  if (vehicleAge >= 8) return 0.30;
  if (vehicleAge >= 7) return 0.20;
  if (vehicleAge >= 6) return 0.10;
  return 0;
}

/** พ.ร.บ. compulsory insurance premium (inclusive of stamp duty & VAT) */
function getPrbInsurance(vehicleType: VehicleType): number {
  switch (vehicleType) {
    case 'car': return 645.21;
    case 'pickup': return 967.28;
    case 'motorcycle': return 323.14; // 125cc bracket as common default
  }
}

/** Inspection fee — required for vehicles aged 7+ years */
function getInspectionFee(vehicleType: VehicleType, vehicleAge: number): number {
  if (vehicleAge < 7) return 0;
  return vehicleType === 'motorcycle' ? 60 : 200;
}

export function calculateVehicleTax(input: VehicleTaxInput): VehicleTaxResult {
  const { vehicleType, engineCC, weightKg, vehicleAge } = input;

  let baseTax = 0;
  let ageDiscountPercent = 0;

  switch (vehicleType) {
    case 'car':
      baseTax = calcCarTax(engineCC);
      ageDiscountPercent = getAgeDiscount(vehicleAge);
      break;
    case 'pickup':
      baseTax = calcPickupTax(weightKg);
      break;
    case 'motorcycle':
      baseTax = 100;
      break;
  }

  const ageDiscount = baseTax * ageDiscountPercent;
  const annualTax = baseTax - ageDiscount;
  const prbInsurance = getPrbInsurance(vehicleType);
  const inspectionFee = getInspectionFee(vehicleType, vehicleAge);
  const totalCost = annualTax + prbInsurance + inspectionFee;

  return {
    vehicleType,
    baseTax,
    ageDiscountPercent,
    ageDiscount,
    annualTax,
    prbInsurance,
    inspectionFee,
    totalCost,
  };
}
