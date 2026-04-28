/**
 * Thai Car Insurance Premium Estimator (คำนวณค่าประกันรถยนต์)
 *
 * Sources:
 * - คปภ. (OIC) — Office of Insurance Commission, Thailand
 * - อัตราเบี้ยประกันภัยรถยนต์อ้างอิง (reference premium tariff)
 *
 * Insurance types:
 *   ชั้น 1  — Comprehensive (own damage + fire + theft + third-party)
 *   ชั้น 2+ — Third-party + collision with identified vehicle + fire + theft
 *   ชั้น 2  — Third-party + fire + theft
 *   ชั้น 3+ — Third-party + collision with identified vehicle
 *   ชั้น 3  — Third-party liability only
 *
 * Factors: insured value, car group (1–5), car age, coverage type
 *
 * Note: This is an estimation tool. Actual premiums vary by insurer,
 * driving record, and specific policy terms.
 */

export type InsuranceType = 'type1' | 'type2plus' | 'type2' | 'type3plus' | 'type3';

export type CarGroup = 1 | 2 | 3 | 4 | 5;

export interface CarInsuranceInput {
  insuranceType: InsuranceType;
  carValue: number;       // มูลค่ารถ (THB)
  carGroup: CarGroup;     // กลุ่มรถ (1–5)
  carAge: number;         // อายุรถ (ปี)
  driverAge: number;      // อายุผู้ขับ (ปี)
}

export interface CarInsuranceResult {
  insuranceType: InsuranceType;
  insuranceTypeName: string;
  estimatedPremium: number;      // เบี้ยประกันโดยประมาณ
  coverageAmount: number;        // ทุนประกัน (สำหรับชั้น 1, 2+, 2)
  thirdPartyProperty: number;    // คุ้มครองทรัพย์สินบุคคลภายนอก
  thirdPartyBodily: number;      // คุ้มครองบาดเจ็บ/เสียชีวิต
  ownDamage: boolean;            // คุ้มครองรถตัวเอง
  fireTheft: boolean;            // คุ้มครองไฟไหม้/โจรกรรม
  floodCoverage: boolean;        // คุ้มครองน้ำท่วม (ชั้น 1 เท่านั้น)
  personalAccident: number;      // ประกันอุบัติเหตุส่วนบุคคล
  medicalExpense: number;        // ค่ารักษาพยาบาล
  bailBond: number;              // ค่าประกันตัวผู้ขับ
  driverAgeAdjustment: number;   // ปรับตามอายุผู้ขับ (multiplier)
  carAgeAdjustment: number;      // ปรับตามอายุรถ (multiplier)
}

/** Insurance type display names */
const INSURANCE_TYPE_NAMES: Record<InsuranceType, string> = {
  type1: 'ประกันชั้น 1',
  type2plus: 'ประกันชั้น 2+',
  type2: 'ประกันชั้น 2',
  type3plus: 'ประกันชั้น 3+',
  type3: 'ประกันชั้น 3',
};

/**
 * Base premium rate as % of insured value, by car group.
 * Type 1 reference rates (approximate OIC tariff range midpoints).
 */
const TYPE1_BASE_RATES: Record<CarGroup, number> = {
  1: 0.017,  // 1.7% — economy sedans (Honda City, Toyota Vios)
  2: 0.021,  // 2.1% — mid sedans (Civic, Corolla, Camry)
  3: 0.027,  // 2.7% — pickups, SUVs (Hilux, Fortuner, D-Max)
  4: 0.032,  // 3.2% — luxury (Benz C-Class, BMW 3)
  5: 0.040,  // 4.0% — sports/premium (Benz S-Class, Porsche)
};

/**
 * Multipliers relative to Type 1 premium for other insurance types.
 */
const TYPE_MULTIPLIERS: Record<InsuranceType, number> = {
  type1: 1.0,
  type2plus: 0.50,
  type2: 0.30,
  type3plus: 0.35,
  type3: 0.12,
};

/**
 * Minimum premiums by type (THB) — floor values regardless of car value.
 */
const MIN_PREMIUMS: Record<InsuranceType, number> = {
  type1: 8000,
  type2plus: 5500,
  type2: 3500,
  type3plus: 4000,
  type3: 1200,
};

/** Car age adjustment multiplier */
function getCarAgeAdjustment(carAge: number): number {
  if (carAge <= 1) return 1.0;
  if (carAge <= 3) return 0.95;
  if (carAge <= 5) return 0.90;
  if (carAge <= 7) return 0.85;
  if (carAge <= 10) return 0.80;
  return 0.75;  // 10+ years
}

/** Driver age adjustment multiplier */
function getDriverAgeAdjustment(driverAge: number): number {
  if (driverAge < 25) return 1.20;   // young driver surcharge
  if (driverAge <= 35) return 1.0;   // standard
  if (driverAge <= 50) return 0.95;  // experienced discount
  if (driverAge <= 65) return 1.0;   // standard
  return 1.10;                        // senior surcharge
}

/** Coverage amount (ทุนประกัน) — depreciates with car age */
function getCoverageAmount(carValue: number, carAge: number, insuranceType: InsuranceType): number {
  if (insuranceType === 'type3plus' || insuranceType === 'type3') return 0;
  const depreciationRate = Math.min(carAge * 0.08, 0.60); // max 60% depreciation
  return Math.round(carValue * (1 - depreciationRate));
}

/** Third-party property coverage by type */
function getThirdPartyProperty(insuranceType: InsuranceType): number {
  switch (insuranceType) {
    case 'type1': return 2500000;
    case 'type2plus': return 1000000;
    case 'type2': return 1000000;
    case 'type3plus': return 1000000;
    case 'type3': return 500000;
  }
}

/** Third-party bodily injury/death coverage */
function getThirdPartyBodily(insuranceType: InsuranceType): number {
  switch (insuranceType) {
    case 'type1': return 1000000;
    case 'type2plus': return 500000;
    case 'type2': return 500000;
    case 'type3plus': return 500000;
    case 'type3': return 300000;
  }
}

export function calculateCarInsurance(input: CarInsuranceInput): CarInsuranceResult {
  const { insuranceType, carValue, carGroup, carAge, driverAge } = input;

  const baseRate = TYPE1_BASE_RATES[carGroup];
  const typeMultiplier = TYPE_MULTIPLIERS[insuranceType];
  const carAgeAdj = getCarAgeAdjustment(carAge);
  const driverAgeAdj = getDriverAgeAdjustment(driverAge);

  let premium = carValue * baseRate * typeMultiplier * carAgeAdj * driverAgeAdj;

  // Apply floor
  premium = Math.max(premium, MIN_PREMIUMS[insuranceType]);

  // Round to nearest 100
  premium = Math.round(premium / 100) * 100;

  const coverageAmount = getCoverageAmount(carValue, carAge, insuranceType);
  const hasOwnDamage = insuranceType === 'type1';
  const hasFireTheft = insuranceType === 'type1' || insuranceType === 'type2plus' || insuranceType === 'type2';
  const hasFlood = insuranceType === 'type1';

  return {
    insuranceType,
    insuranceTypeName: INSURANCE_TYPE_NAMES[insuranceType],
    estimatedPremium: premium,
    coverageAmount,
    thirdPartyProperty: getThirdPartyProperty(insuranceType),
    thirdPartyBodily: getThirdPartyBodily(insuranceType),
    ownDamage: hasOwnDamage,
    fireTheft: hasFireTheft,
    floodCoverage: hasFlood,
    personalAccident: insuranceType === 'type1' ? 200000 : insuranceType === 'type3' ? 0 : 100000,
    medicalExpense: insuranceType === 'type1' ? 100000 : insuranceType === 'type3' ? 0 : 50000,
    bailBond: insuranceType === 'type3' ? 100000 : 200000,
    driverAgeAdjustment: driverAgeAdj,
    carAgeAdjustment: carAgeAdj,
  };
}

/** Calculate all 5 types for comparison */
export function calculateAllTypes(
  carValue: number,
  carGroup: CarGroup,
  carAge: number,
  driverAge: number,
): CarInsuranceResult[] {
  const types: InsuranceType[] = ['type1', 'type2plus', 'type2', 'type3plus', 'type3'];
  return types.map((t) =>
    calculateCarInsurance({ insuranceType: t, carValue, carGroup, carAge, driverAge }),
  );
}
